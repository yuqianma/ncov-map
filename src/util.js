export function evalJsVar(text) {
  return (new Function(`var window = {}; ${text}; for(let k in window) {return window[k];}`))();
}

export function locateName(name) {
  if (!LocDoc[name]) {
    console.error(name);
    return [];
  }
  return LocDoc[name].location;
}

export function getTimeFromAreaStatFileName(filename) {
  return +filename.replace(/[^\d]/g, '');
}
