const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const Crawler = require('crawler');
const { PATH } = require('./constants');
const { evalJsVar, getLatestAreaStatStr } = require('./util');
const resolveLocations = require('./resolve-locations');
require('./load-env');

const {
  DXY_DIR,
} = PATH;

const SC_KEY = process.env.SC_KEY;

if (!SC_KEY) {
  console.error('cannot find SC_KEY, set `SC_KEY` in `env.config.local.js` or env');
}

let latestFileStr = getLatestAreaStatStr();

console.log(`[${new Date()}] start`);

const c = new Crawler({
    callback : async function (error, res, done) {
        if(error){
            console.log(error);
            notify(error);
        }else{
            const $ = res.$;

            const str_getAreaStat = $('#getAreaStat').html();
            const str_getStatisticsService = $('#getStatisticsService').html();

            if (str_getAreaStat) {
              await compareAndSave(str_getAreaStat, str_getStatisticsService);
            } else {
              notify('no getAreaStat');
              throw 'no getAreaStat';
            }
        }
        done();
    }
});

// Queue just one URL, with default callback
c.queue('https://3g.dxy.cn/newh5/view/pneumonia');

async function compareAndSave(str_getAreaStat, str_getStatisticsService) {
  if (latestFileStr === str_getAreaStat) {
    console.log('same, do nothing');
  } else {

    const filepath = path.join(DXY_DIR, `getAreaStat.${+new Date()}.js`);
    fs.writeFileSync(filepath, str_getAreaStat);
    console.log(`write to`, filepath);

    await resolveLocations();

  
    // for notification only
    let countText = '';
    try {
      const statisticsService = evalJsVar(str_getStatisticsService);
      const { countRemark, confirmedCount, suspectedCount, curedCount, deadCount } = statisticsService;
      countText = countRemark;
      if (!countText) {
        countText = `确诊${confirmedCount},疑似${suspectedCount},死亡${deadCount},治愈${curedCount}`;
      }
    } catch (e) {
      console.error(e);
    }
    notify(countText);
  }
}

function notify(text) {
  if (!SC_KEY) {
    return;
  }
  text = encodeURIComponent('[ncov-map]' + text);
  c.direct({
    uri: `https://sc.ftqq.com/${SC_KEY}.send?text=${text}`,
    callback: () => {}
  });
}
