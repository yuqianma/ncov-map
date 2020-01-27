const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../public/');
const DXY_DIR = path.join(PUBLIC_DIR, 'dxy');
const LOC_DOC_PATH = path.join(PUBLIC_DIR, 'location-document.js');
const HTML_PATH = path.join(PUBLIC_DIR, 'index.html');

const PATH = {
  PUBLIC_DIR,
  DXY_DIR,
  LOC_DOC_PATH,
  HTML_PATH
};

module.exports = {
  PATH
}
