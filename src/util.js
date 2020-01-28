export function evalJsVar(text) {
  return (new Function(`var window = {}; ${text}; for(let k in window) {return window[k];}`))();
}
