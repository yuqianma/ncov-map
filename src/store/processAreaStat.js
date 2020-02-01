import { locateName } from '../util';

// We can merge districts to get a right heatmap, 
// but it is misleading for some places like Chongqing.
// As a result, the normal heatmap may not be a good choice here.
const MergeNameMap = {
  // '北京市': 1,
  // '上海市': 1,
  // '天津市': 1
};

export function processAreaStat(areaStat) {
  const points = [];
  let max = 0;

  function putPoint(location, data) {
    const point = [location[0], location[1], data.confirmedCount, data];
    points.push(point);
    max = Math.max(max, point[2]);
  }

  areaStat.forEach(area => {
    const { provinceName } = area;

    if (!MergeNameMap[provinceName] && area.cities.length) {
      // city level, use `province+city`
      area.cities.forEach(city => {
        putPoint(locateName(provinceName + city.cityName), city);
      });
    } else {
      // no city data or it is a city, use province level
      putPoint(locateName(provinceName), area);
    }
  });

  Object.freeze(points);
  return points;
}