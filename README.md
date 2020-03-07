# ncov-map

https://ncov-map.hcifun.com/

## 每日数据汇总说明

每半小时从丁香园抓取一次数据。

往日数据：取24点前最后一次抓取结果。

当日数据：最新抓取结果。

省份“新增确诊”数据由前后2天相减得出。因为统计的时间点不同，结果可能与官方数据不同。

一切以官方数据为准。

## 数据源说明

**2020-01-24开始**

丁香园：https://ncov.dxy.cn/ncovh5/view/pneumonia

**2020-01-24之前**

https://mp.weixin.qq.com/s/JWxGVZieKj-S0uX9G42ybA

整理结果：https://github.com/yuqianma/ncov-map/blob/master/public/before0124.csv

所有数据都静态化在项目中（public文件夹）

## 使用的服务说明

1. Github Actions 定时执行，抓取丁香园数据，与已有数据比较，如有改变则保存最新数据。
2. 遍历最新数据地理位置名称，使用[高德接口](https://lbs.amap.com/api/webservice/guide/api/georegeo)获取经纬度坐标，保存到项目中。
3. 打包含最新数据的静态文件。替换 index.html 中 URL，使用 jsdelivr.com 作为 CDN 保证大陆访问。
4. 使用了 http://sc.ftqq.com/ 通知自己数据变化。

## 主要使用的开源库
Mapbox-gl: https://github.com/mapbox/mapbox-gl-js
Vega: https://github.com/vega/vega
dayjs: https://github.com/dayjs

## 相关参考

疫情的流图: https://mp.weixin.qq.com/s/Jroh5Us5QkwyJJI24z7uaA

为有精度地观察疫情而设计: https://mp.weixin.qq.com/s/wsBxeePhy5i2YRqEInsfNQ

向帆老师作品：
http://zeelab.cn/WuhanCircleGraph/

地图 circle 大小分段参考 WHO 地图：
https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports/
