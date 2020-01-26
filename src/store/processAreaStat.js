function locateName(name) {
  return LocDoc[name].location;
}

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

    // merged Beijing seems better...
    if (provinceName !== '北京市' && area.cities.length) {
      // city level, use `province+city`
      area.cities.forEach(city => {
        putPoint(locateName(provinceName + city.cityName), city);
      });
    } else {
      // no city data or it is a city, use province level
      putPoint(locateName(provinceName), area);
    }
  });

  const maxLog = Math.log(max);
  points.forEach(point => {
    point[2] = Math.max(1e-6, Math.log(point[2]) / maxLog);
  });

  Object.freeze(points);
  return points;
}