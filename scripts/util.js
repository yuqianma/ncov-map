const fs = require('fs');
const path = require('path');
const { PATH } = require('./constants')

function evalJsVar(text) {
  return (new Function(`var window = {}; ${text}; for(let k in window) {return window[k];}`))();
}

function getLatestJsFileName() {
  return fs.readdirSync(PATH.DXY_DIR).sort().pop();
}

function getLatestAreaStatStr() {
  const latestJs = getLatestJsFileName();
  return fs.readFileSync(path.join(PATH.DXY_DIR, latestJs)).toString();
}

function getLatestAreaStat() {
  return evalJsVar(getLatestAreaStatStr());
}

module.exports = {
  evalJsVar,
  getLatestJsFileName,
  getLatestAreaStatStr,
  getLatestAreaStat,
};
