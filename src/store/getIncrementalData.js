export function getIncrementalData({ formerData, areaStats }) {
  const list = [];

  let date = dayjs(formerData.dateFrom);
  while (date <= formerData.dateTo) {
    const provinceInc = formerData.getProvinceIncOfDate(date);
    // console.log(date.format('YYYY-MM-DD'), provinceInc.reduce((acc, v) => acc + v.confirmedCountInc, 0));
    list.push(...provinceInc);
    date = date.add(1, 'day');
  }

  let prevProvinceMap = formerData.aggregateProvinceMap();

  areaStats.forEach((areaStat) => {
    const date = new Date(dayjs(areaStat.time).endOf('day'));
    const provinceMap = {};
    let acc = 0;
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
      
      acc += confirmedCountInc;
      list.push({
        date,
        confirmedCountInc,
        provinceName
      });
    });
    // console.log(dayjs(date).format('YYYY-MM-DD'), acc);
    prevProvinceMap = provinceMap;
  });

  return list;
}
