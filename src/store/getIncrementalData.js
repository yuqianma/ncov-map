function sumDateInc(listOfDate) {
  return listOfDate.reduce((acc, v) => acc + v.confirmedCountInc, 0);
}

function sumAreaStatCount(areaStat) {
  return areaStat.reduce((acc, v) => acc + v.confirmedCount, 0);
}

export function getIncrementalData({ dateFrom, formerData, areaStats }) {
  const list = [];

  const dateIncMap = {};

  let date = dayjs(formerData.dateFrom);
  while (date <= formerData.dateTo) {
    const provinceInc = formerData.getProvinceIncOfDate(date);
    dateIncMap[+date] = sumDateInc(provinceInc);
    // console.log(dayjs(date).format('MM-DD'), dateIncMap[+date]);
    list.push(...provinceInc);
    date = date.add(1, 'day');
  }

  let prevProvinceMap = formerData.aggregateProvinceMap();

  areaStats.forEach((areaStat) => {
    const date = new Date(dayjs(areaStat.time).endOf('day'));
    const provinceMap = {};
    const listOfDate = [];
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
      
      listOfDate.push({
        date,
        confirmedCountInc,
        provinceName
      });
    });

    list.push(...listOfDate);
    dateIncMap[+date] = sumDateInc(listOfDate);
    // console.log(dayjs(areaStat.time).format('MM-DD HH:mm'), dateIncMap[+date]);
    prevProvinceMap = provinceMap;
  });

  const filteredList = list.filter(v => v.date >= dateFrom);
  
  filteredList.dateMap = dateIncMap;
  Object.freeze(filteredList);

  return filteredList;
}
