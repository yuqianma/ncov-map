import { getTimeFromAreaStatFileName } from './util';

const AreaStatIndex = window.AreaStatIndex;

export const LatestTime = getTimeFromAreaStatFileName(AreaStatIndex[AreaStatIndex.length - 1]);
window.getAreaStat.time = LatestTime;

export const DateRange = [
  // new Date('2019-12-07'),
  new Date('2020-01-15'),
  new Date(LatestTime),
];

export const SeparateDate = new Date('2020-01-24');

const Colors1 = [
  "#effdff",
  "#86cbe9",
  "#c76bae",
  "#e14da0",
  "#b91b55",
  "#660000"
];
const Colors2 = [
  "#b1e5eb",
  "#90dbfc",
  "#e170c4",
  "#eb1d78",
  "#ae1233",
  "#550000"
]

export const VisMap = {
  Domains: [1, 10, 100, 500, 5000, 10000],
  Radii: [1, 2, 4, 8, 10, 15],
  Colors: Colors2
}
