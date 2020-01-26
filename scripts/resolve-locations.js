const fs = require('fs');
const path = require('path');
const Crawler = require('crawler');
require('./load-env');

const PUBLIC_DIR = path.join(__dirname, '../public/');
const DXY_DIR = path.join(PUBLIC_DIR, 'dxy');
const LOC_DOC_PATH = path.join(PUBLIC_DIR, 'location-document.js');

function evalJsVar(text) {
  return (new Function(`var window = {}; ${text}; for(let k in window) {return window[k];}`))();
}

const LocDocStr = fs.readFileSync(LOC_DOC_PATH).toString();
const LocDoc = evalJsVar(LocDocStr);

function getLatestAreaStat() {
  const latest = fs.readdirSync(DXY_DIR).sort().pop();
  console.log('latest:', latest);
  const latestFileStr = fs.readFileSync(path.join(DXY_DIR, latest)).toString();
  return evalJsVar(latestFileStr);
}

function getUnresolvedNamesInAreaStat(areaStat) {
  const nameMap = {};
  areaStat.forEach(area => {
    const { provinceName } = area;

    if (area.cities.length) {
      // city level, use `province+city`
      area.cities.forEach(city => {
        nameMap[provinceName + city.cityName] = 1;
      });
    } else {
      // no city data or it is a city, use province level
      nameMap[provinceName] = 1;
    }
  });

  return Object.keys(nameMap).filter(name => !LocDoc[name]);
}

function fetchNamesLocation(names) {
  if (!process.env.AMAP_KEY) {
    throw 'cannot find amap key, set `AMAP_KEY` in `env.config.local.js` or env';
  }  
  
  return new Promise((res, rej) => {
    console.log(names.length, 'names to fetch');

    const nameLocationMap = {};

    if (names.length === 0) {
      res(nameLocationMap);
      return;
    }
    
    const c = new Crawler({
      rateLimit: 20,
      jQuery: false,
      json: true,
      callback: (error, response, done) => {
        const name = response.options.locationName;

        if(error || (response.statusCode/100|0) !== 2) {
          console.error('[error]', name, error || response.body);
        } else {
          const result = response.body;
          const geocode = result.geocodes[0];
          if (geocode) {
            let { province, city, location } = geocode;

            city = city.length ? city : null;
            const loc = location.split(',');
            location = [+loc[0], +loc[1]];

            nameLocationMap[name] = {
              province, city, location
            }

            console.log(name, province, location);
          } else {
            nameLocationMap[name] = {
              invalid: true,
              location: []
            }
          }
        }

        done();
      }
    });

    c.on('drain', () => {
      res(nameLocationMap);
    });

    names.forEach(name => {
      c.queue({
        uri: `https://restapi.amap.com/v3/geocode/geo?key=${process.env.AMAP_KEY}&address=${encodeURIComponent(name)}`,
        locationName: name,
      });
    });

  });
}

(async function main() {
  const unresolvedNames = getUnresolvedNamesInAreaStat(getLatestAreaStat());
  const nameLocationMap = await fetchNamesLocation(unresolvedNames);
  console.log(nameLocationMap);

  Object.assign(LocDoc, nameLocationMap);
  
  const formatJson = JSON.stringify(LocDoc, null, 2);
  fs.writeFileSync(LOC_DOC_PATH, `window.LocDoc=${formatJson};`);
})();
