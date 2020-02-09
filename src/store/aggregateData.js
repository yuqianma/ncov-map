import { DateRange, SeparateDate } from '../constants';

function aggregateFormer(formerData) {
  const aggregated = [];

  let date = dayjs(DateRange[0]);
  while(date < SeparateDate) {
    const data = formerData.queryPointsByDate(date);
    const agg = {
      date: +date,
      confirmedCount: 0,
      provinces: [],
    };

    const provinceMap = {};

    data.forEach(d => {
      provinceMap[d.loc.province] = provinceMap[d.loc.province] || 0;
      provinceMap[d.loc.province] += d.confirmedCount;
      
      agg.confirmedCount += d.confirmedCount;
    });

    agg.provinces = Object.keys(provinceMap).map(provinceName => {
      return {
        provinceName,
        confirmedCount: provinceMap[provinceName]
      }
    });

    aggregated.push(agg);

    date = date.add(1, 'day');
  }

  return aggregated;
}

function aggregateAreaStats(areaStats) {
  const aggregated = [];

  areaStats.forEach(areaStat => {
    const agg = {
      date: areaStat.time,
      confirmedCount: 0,
      provinces: areaStat,
    };
    areaStat.forEach(area => {
      agg.confirmedCount += area.confirmedCount;
    });
    aggregated.push(agg);
  });

  return aggregated;
}

export function aggregateData({ formerData, areaStats }) {
  return [...aggregateFormer(formerData), ...aggregateAreaStats(areaStats)];
}
