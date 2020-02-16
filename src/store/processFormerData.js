
class FormerData {
  constructor() {
    this.data = null;
    this.dateFrom = 0;
    this.dateTo = 0;
  }

  async load() {
    if (this.data) {
      return;
    }
    const data = await d3.csv(`${process.env.BASE_URL}before0124.csv`, (d) => {
      const area = d['地区'];
      const loc = LocDoc[area];
      if (!loc) {
        throw area;
      }
      // if (!loc.city) {
      //   console.log(area, loc);
      // }
      return {
        caseNum: +d['病例数'],
        date: new Date(d['发病日期']),
        areaName: d['地区'],
        loc,
        infoSource: d['消息来源'],
        note: d['备注']
      }
    });

    this.data = data.sort((a, b) => a.date - b.date);

    this.dateFrom = this.data[0].date;
    this.dateTo = this.data[this.data.length - 1].date;
    console.log(this.dateFrom, this.dateTo);
  }

  aggregateProvinceMap() {
    const provinceMap = {};
    this.data.forEach(d => {
      const loc = d.loc;
      const p = provinceMap[loc.province] = provinceMap[loc.province] || {
        confirmedCount: 0,
        provinceName: loc.province,
      };
      p.confirmedCount += d.caseNum;
    });
    return provinceMap;
  }

  queryIncOfDate(date) {
    date = new Date(dayjs(date).format('YYYY-MM-DD'));
    return this.data.filter(d => d.date - date === 0);
  }

  getProvinceIncOfDate(date) {
    date = dayjs(date).format('YYYY-MM-DD');
    const data = this.queryIncOfDate(date);
    const provinceMap = {};
    data.forEach(d => {
      const loc = d.loc;
      const p = provinceMap[loc.province] = provinceMap[loc.province] || {
        date,
        confirmedCountInc: 0,
        provinceName: loc.province,
      };
      p.confirmedCountInc += d.caseNum;
    });
    return Object.values(provinceMap);
  }

  queryPointsByDate(date) {
    const endDate = new Date(date);
    return this.data.filter(d => d.date <= endDate);
  }

  getVisiblePointsByDate(date) {
    const data = this.queryPointsByDate(date);
    // dirty work: merge some data manually
    const lngLatMap = {};
    data.forEach(d => {
      const location = d.loc.location;
      const lngLat = location.join(',');
      const p = lngLatMap[lngLat] = lngLatMap[lngLat] || {
        coordinates: location,
        confirmedCount: 0,
        provinceName: d.loc.province,
        cityName: d.loc.city,
        areaName: d.loc.province + d.loc.city,
        data: [],
      };
      p.confirmedCount += d.caseNum;
      p.data.push(d);
    });

    return Object.values(lngLatMap);
  }
}

export const formerData = new FormerData();
