// import { locateName } from '../util';

export function processAreaStat(areaStat) {
  const points = [];
  let max = 0;

  function putPoint(areaName, data) {
    if (!data.confirmedCount) {
      return;
    }
    const loc = LocDoc[areaName];
    if (!loc) {
      console.error('cannot find:', areaName);
      return;
    }
    const point = {
      coordinates: loc.location,
      confirmedCount: data.confirmedCount,
      existingCount: Math.max(0, data.confirmedCount - data.curedCount),
      provinceName: loc.province,
      cityName: loc.city || data.cityName,
      areaName: loc.province + (loc.city || data.cityName),
      data,
    };
    points.push(point);
    max = Math.max(max, data.existingCount);
  }

  areaStat.forEach(area => {
    const { provinceName } = area;

    if (area.cities.length) {
      // city level, use `province+city`
      area.cities.forEach(city => {
        putPoint(provinceName + city.cityName, city);
      });
    } else {
      // no city data or it is a city, use province level
      putPoint(provinceName, area);
    }
  });

  Object.freeze(points);
  return points;
}