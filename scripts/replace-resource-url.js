const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const DIST_DIR = path.join(__dirname, '../dist/');
const HTML_PATH = path.join(DIST_DIR, 'index.html');
const LOC_DOC_PATH = path.join(DIST_DIR, 'location-document.js');
const AREA_STAT_INDEX_PATH = path.join(DIST_DIR, 'area-stat-index.js');

function getMD5(filepath) {
  var buffer = fs.readFileSync(filepath);
  var fsHash = crypto.createHash('md5');

  fsHash.update(buffer);
  return fsHash.digest('hex');
}

function replaceResourceURL() {
  const htmlStr = fs.readFileSync(HTML_PATH).toString();
  let updatedHtmlStr = htmlStr.replace(/location-document\.js/, `location-document.js?hash=${getMD5(LOC_DOC_PATH)}`);
  updatedHtmlStr = updatedHtmlStr.replace(/area-stat-index\.js/, `area-stat-index.js?hash=${getMD5(AREA_STAT_INDEX_PATH)}`);

  fs.writeFileSync(HTML_PATH, updatedHtmlStr);
  console.log(`hash updated`);
}

replaceResourceURL();
