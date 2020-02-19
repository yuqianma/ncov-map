const fs = require('fs');
const { PATH } = require('./constants');
const { getTimeFromAreaStatFileName, getLatestJsFileName } = require('./util');
const resolveLocations = require('./resolve-locations');

const {
  DXY_DIR,
  AREA_STAT_INDEX_PATH,
  HTML_PATH
} = PATH;

function filterListByDay(list) {
  let filteredList = [];
  let currDate = null;
  let prevFileName = null;

  let i = -1;
  while (++i < list.length) {
    const fileName = list[i];
    const datetime = new Date(getTimeFromAreaStatFileName(fileName));
    let date = datetime.toLocaleDateString(undefined,{timeZone: 'Asia/Shanghai'});
    if (date !== currDate) {
      prevFileName && filteredList.push(prevFileName);
      currDate = date;
    }

    prevFileName = fileName;
  }
  
  filteredList.push(prevFileName);
  
  return filteredList;
}

function updateAreaStatIndex() {
  let list = fs.readdirSync(DXY_DIR).sort();
  list = filterListByDay(list);
  const formattedJson = JSON.stringify(list, null, 2);
  fs.writeFileSync(AREA_STAT_INDEX_PATH, `window.AreaStatIndex=${formattedJson};`);
  console.log(`area-stat-index.js updated`);
}

function updateHtmlResources() {
  const htmlStr = fs.readFileSync(HTML_PATH).toString();
  const latestJs = getLatestJsFileName();
  if (!htmlStr.includes(latestJs)) {
    const updatedHtmlStr = htmlStr.replace(/getAreaStat\.\d+\.js/, latestJs);
    fs.writeFileSync(HTML_PATH, updatedHtmlStr);
    console.log(`index.html updated: ${latestJs}`);
  }
}

async function persistData() {
  await resolveLocations();
  updateAreaStatIndex();
  updateHtmlResources();
}

module.exports = persistData;
