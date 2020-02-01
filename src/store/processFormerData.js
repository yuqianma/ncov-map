
class FormerData {
  constructor() {
    this.data = null;
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
        confirmedCount: d['病例数'],
        date: new Date(d['发病日期']),
        areaName: d['地区'],
        loc,
        infoSource: d['消息来源'],
        note: d['备注']
      }
    });

    this.data = data.sort((a, b) => a.date - b.date);
  }

  queryPointsByDate(date) {
    const endDate = new Date(date);
    return this.data.filter(d => d.date <= endDate);
  }

  getVisiblePointsByDate(date) {
    const data = this.queryPointsByDate(date);
    const lngLatMap = {};
    data.forEach(d => {
      const location = d.loc.location;
      const lngLat = location.join(',');
      const p = lngLatMap[lngLat] = lngLatMap[lngLat] || [location[0], location[1], 0, []];
      p[2] += +d.confirmedCount;
      p[3].push(d);
    });

    return Object.values(lngLatMap);
  }
}

export const formerData = new FormerData();
