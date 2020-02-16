export function getIncrementalData({ formerData, areaStats }) {
  const list = [];

  let date = dayjs(formerData.dateFrom);
  while (date <= formerData.dateTo) {
    const provinceInc = formerData.getProvinceIncOfDate(date);
    list.push(...provinceInc);
    date = date.add(1, 'day');
  }

  let prevProvinceMap = formerData.aggregateProvinceMap();

  areaStats.forEach((areaStat) => {
    const date = dayjs(areaStat.time).format('YYYY-MM-DD');
    const provinceMap = {};
    areaStat.forEach(area => {
      let provinceName = area.provinceName;
      if (LocDoc[provinceName]) {
        provinceName = LocDoc[provinceName].province;
      }

      if (!provinceMap[provinceName]) {
        provinceMap[provinceName] = area;
      }

      let confirmedCountInc;
      if (prevProvinceMap[provinceName]) {
        confirmedCountInc = area.confirmedCount - prevProvinceMap[provinceName].confirmedCount;
      } else {
        confirmedCountInc = area.confirmedCount;
      }

      // if (confirmedCountInc < 0) {
      //   console.warn(date, provinceName, prevProvinceMap[provinceName].confirmedCount, area.confirmedCount);
      // }
      
      list.push({
        date,
        confirmedCountInc,
        provinceName
      });
    });
    prevProvinceMap = provinceMap;
  });

  return list;
}
