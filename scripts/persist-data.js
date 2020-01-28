const fs = require('fs');
const { PATH } = require('./constants');
const { evalJsVar, getLatestJsFileName } = require('./util');
const resolveLocations = require('./resolve-locations');

const {
  DXY_DIR,
  AREA_STAT_INDEX_PATH,
  HTML_PATH
} = PATH;

function updateAreaStatIndex() {
  const list = fs.readdirSync(DXY_DIR).sort();
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
