import { getTimeFromAreaStatFileName } from './util';

const AreaStatIndex = window.AreaStatIndex;

export const LatestTime = getTimeFromAreaStatFileName(AreaStatIndex[AreaStatIndex.length - 1]);
window.getAreaStat.time = LatestTime;

export const DateRange = [
  new Date('2019-12-07'),
  new Date(LatestTime),
];
