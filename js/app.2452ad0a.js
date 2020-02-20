(function(e){function t(t){for(var a,o,c=t[0],s=t[1],u=t[2],d=0,p=[];d<c.length;d++)o=c[d],Object.prototype.hasOwnProperty.call(r,o)&&r[o]&&p.push(r[o][0]),r[o]=0;for(a in s)Object.prototype.hasOwnProperty.call(s,a)&&(e[a]=s[a]);l&&l(t);while(p.length)p.shift()();return i.push.apply(i,u||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],a=!0,c=1;c<n.length;c++){var s=n[c];0!==r[s]&&(a=!1)}a&&(i.splice(t--,1),e=o(o.s=n[0]))}return e}var a={},r={app:0},i=[];function o(t){if(a[t])return a[t].exports;var n=a[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=e,o.c=a,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)o.d(n,a,function(t){return e[t]}.bind(null,a));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="https://cdn.jsdelivr.net/gh/yuqianma/ncov-map@gh-pages/";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],s=c.push.bind(c);c.push=t,c=c.slice();for(var u=0;u<c.length;u++)t(c[u]);var l=s;i.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"034f":function(e,t,n){"use strict";var a=n("85ec"),r=n.n(a);r.a},"410e":function(e,t,n){"use strict";var a=n("f4e6"),r=n.n(a);r.a},5490:function(e,t,n){"use strict";var a=n("a6b6"),r=n.n(a);r.a},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var a=n("2b0e"),r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("Map"),n("router-view")],1)},i=[],o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{ref:"container",class:{"show-label":e.showLabel},attrs:{id:"map-container"}})},c=[],s=(n("a4d3"),n("4de4"),n("4160"),n("d81d"),n("e439"),n("dbb4"),n("b64b"),n("159b"),n("3835")),u=n("ade3"),l=n("2f62");function d(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?d(Object(n),!0).forEach((function(t){Object(u["a"])(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var f={name:"Map",data:function(){return{showLabel:!1}},mounted:function(){this.mapbox()},computed:p({},Object(l["c"])(["mapType"]),{},Object(l["b"])(["visiblePoints"])),watch:{visiblePoints:function(e){"circle"===this.mapType?this.map.getSource("points").setData(this.dataToPointFeature(e)):this.map.getSource("polygons").setData(this.dataToPolygonFeature(e))},mapType:function(e){var t=this.map;"circle"===e?(t.getSource("points").setData(this.dataToPointFeature(this.visiblePoints)),t.setLayoutProperty("ncov-circle","visibility","visible"),t.setLayoutProperty("ncov-3d","visibility","none"),t.easeTo({pitch:0})):(t.getSource("polygons").setData(this.dataToPolygonFeature(this.visiblePoints)),t.setLayoutProperty("ncov-3d","visibility","visible"),t.setLayoutProperty("ncov-circle","visibility","none"),t.easeTo({pitch:60}))}},methods:{dataToPointFeature:function(e){return{type:"FeatureCollection",features:e.map((function(e,t){return{type:"Feature",properties:{count:e.confirmedCount,areaName:e.areaName,idx:t},geometry:{type:"Point",coordinates:e.coordinates}}}))}},dataToPolygonFeature:function(e){var t=.15;return{type:"FeatureCollection",features:e.map((function(e,n){var a=Object(s["a"])(e.coordinates,2),r=a[0],i=a[1];return{type:"Feature",properties:{count:e.confirmedCount,areaName:e.areaName,idx:n},geometry:{type:"Polygon",coordinates:[[[r-t,i+t],[r-t,i-t],[r+t,i-t],[r+t,i+t],[r-t,i+t]]]}}}))}},mapbox:function(){var e=this,t=new mapboxgl.Map({container:this.$refs.container,center:[104.299012,34.781634],zoom:2,antialias:!0,style:{version:8,sources:{"raster-tiles":{type:"raster",tiles:["https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}"],tileSize:256},"raster-boundaries":{type:"raster",tiles:["https://map.geoq.cn/arcgis/rest/services/SimpleFeature/ChinaBoundaryLine/MapServer/tile/{z}/{y}/{x}"],tileSize:128},points:{type:"geojson",data:this.dataToPointFeature(this.visiblePoints)},polygons:{type:"geojson",data:this.dataToPolygonFeature(this.visiblePoints)}},layers:[{id:"tiles",type:"raster",source:"raster-tiles",minzoom:0,maxzoom:10,paint:{"raster-saturation":-1,"raster-brightness-min":.3,"raster-contrast":.2,"raster-opacity":.5}},{id:"boundaries",type:"raster",source:"raster-boundaries",maxzoom:4,paint:{"raster-saturation":-1,"raster-brightness-min":.5}}]}});window._map=t,this.map=t,t.addControl(new mapboxgl.NavigationControl({visualizePitch:!0}),"top-right"),t.on("load",(function(){t.addLayer({id:"ncov-circle",type:"circle",source:"points",paint:{"circle-radius":["interpolate",["linear"],["zoom"],4,["interpolate",["linear"],["get","count"],1,2,1e3,20],10,["interpolate",["linear"],["get","count"],1,5,1e3,100]],"circle-color":["interpolate",["linear"],["get","count"],1,"rgba(33,102,172,0)",10,"rgb(103,169,207)",50,"rgb(209,229,240)",100,"rgb(253,219,199)",500,"rgb(239,138,98)",1e3,"rgb(178,24,43)"],"circle-stroke-width":.1,"circle-stroke-color":"#888"}}),t.addLayer({id:"ncov-3d",type:"fill-extrusion",source:"polygons",paint:{"fill-extrusion-color":["interpolate",["linear"],["get","count"],1,"rgb(253,219,199)",1e3,"rgb(178,24,43)"],"fill-extrusion-base":0,"fill-extrusion-height":["*",["get","count"],1e3]}}),t.setLayoutProperty("ncov-3d","visibility","none")})),t.on("click",(function(n){var a=t.queryRenderedFeatures(n.point);a[0]?e.$store.commit("setPickedIdx",a[0].properties.idx):e.$store.commit("setPickedIdx",-1)}))}}},m=f,h=(n("5490"),n("2877")),v=Object(h["a"])(m,o,c,!1,null,null,null),y=v.exports,g={components:{Map:y}},b=g,w=(n("034f"),Object(h["a"])(b,r,i,!1,null,null,null)),O=w.exports,x=n("8c4f"),j=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"home"},[n("div",{staticClass:"point-info"},[e._v(e._s(e.pointInfo))]),n("div",{staticClass:"pane",class:e.size},[n("div",{staticClass:"handle",class:e.size,on:{click:e.toggleSize}}),e.loading?n("Spinner",{staticStyle:{"flex-grow":"1"}}):e._e(),e.loaded?n("TimeMinimap"):e._e(),n("span",{staticClass:"update-time"},[e._v("update: "+e._s(e.updateTime))])],1)])},D=[];n("99af"),n("ac1f"),n("5319");function P(e){return new Function("var window = {}; ".concat(e,"; for(let k in window) {return window[k];}"))()}function _(e){return+e.replace(/[^\d]/g,"")}var S=window.AreaStatIndex,k=_(S[S.length-1]);window.getAreaStat.time=k;var C=[new Date("2020-01-15"),new Date(k)],T=new Date("2020-01-24"),N=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},M=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"lds-ellipsis"},[n("div"),n("div"),n("div"),n("div")])}],z={name:"Spinner"},F=z,$=(n("e1f7"),Object(h["a"])(F,N,M,!1,null,"ba5a3b68",null)),E=$.exports,I=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{ref:"wrapper",staticClass:"wrapper"},[n("div",{ref:"container",staticClass:"container"}),n("label",{staticClass:"include-hubei"},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.includeHubei,expression:"includeHubei"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(e.includeHubei)?e._i(e.includeHubei,null)>-1:e.includeHubei},on:{change:function(t){var n=e.includeHubei,a=t.target,r=!!a.checked;if(Array.isArray(n)){var i=null,o=e._i(n,i);a.checked?o<0&&(e.includeHubei=n.concat([i])):o>-1&&(e.includeHubei=n.slice(0,o).concat(n.slice(o+1)))}else e.includeHubei=r}}}),e._v(" 包含湖北省 ")])])},H=[];n("d3b7"),n("ddb0");function L(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function A(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?L(Object(n),!0).forEach((function(t){Object(u["a"])(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):L(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var q={name:"TimeMinimap",data:function(){return{includeHubei:!0}},mounted:function(){this.initChart()},computed:A({},Object(l["c"])(["paneSize"]),{},Object(l["b"])(["incrementalData"])),watch:{includeHubei:function(e){this.view&&this.view.signal("includeHubei",e).runAsync()},paneSize:function(){this.$refs.container.style.display="none";var e=this.getContainerSize(),t=e.width,n=e.height;this.$refs.container.style.display="",this.view&&this.view.width(t).height(n).runAsync()},incrementalData:function(e){this.initChart()}},methods:{getContainerSize:function(){var e=this.$refs.wrapper,t=e.clientWidth,n=e.clientHeight;return{width:t,height:n}},initChart:function(){var e=this,t=this.$refs.container;if(!this.view&&t&&this.incrementalData){var n=B(A({},this.getContainerSize(),{values:this.incrementalData})),a=new vega.View(vega.parse(n),{renderer:"svg",container:t,hover:!0});a.runAsync(),this.view=a,window._view=a,a.addSignalListener("indexDate",(function(t,n){var a=dayjs(n).endOf("date");e.$store.commit("setDataTime",+a)}))}}}};function B(e){var t=e.width,n=e.height,a=e.values;return{$schema:"https://vega.github.io/schema/vega/v5.json",padding:0,width:t,height:n,autosize:"fit",data:[{name:"source",values:a},{name:"dateCount",source:"source",transform:[{type:"filter",expr:" includeHubei ? true : datum.provinceName != '湖北省' "},{field:"date",type:"timeunit",units:["year","month","date"],as:["yearmonth_date","yearmonth_date_end"]},{type:"aggregate",groupby:["yearmonth_date"],ops:["sum"],fields:["confirmedCountInc"],as:["sum_count"]}]},{name:"table",source:"source",transform:[{type:"filter",expr:" includeHubei ? true : datum.provinceName != '湖北省' "},{field:"date",type:"timeunit",units:["year","month","date"],as:["yearmonth_date","yearmonth_date_end"]},{type:"aggregate",groupby:["yearmonth_date","provinceName"],ops:["sum"],fields:["confirmedCountInc"],as:["sum_count"]},{type:"impute",field:"sum_count",groupby:["provinceName"],key:"yearmonth_date",method:"value",value:0},{type:"stack",groupby:["yearmonth_date"],field:"sum_count",sort:{field:["provinceName"],order:["descending"]},as:["sum_count_start","sum_count_end"],offset:"center"}]}],signals:[{name:"includeHubei",value:!0},{name:"indexDate",on:[{events:"mousemove, touchmove",update:"invert('x', clamp(x(), 0, width))"}]}],marks:[{name:"pathgroup",type:"group",from:{facet:{name:"faceted_path_main",data:"table",groupby:["provinceName"]}},encode:{update:{width:{field:{group:"width"}},height:{field:{group:"height"}}}},marks:[{name:"marks",type:"area",style:["area"],sort:{field:'datum["yearmonth_date"]'},from:{data:"faceted_path_main"},encode:{update:{interpolate:{value:"monotone"},orient:{value:"vertical"},fill:{scale:"color",field:"provinceName"},x:{scale:"x",field:"yearmonth_date"},y:{scale:"y",field:"sum_count_end"},y2:{scale:"y",field:"sum_count_start"},defined:{signal:'isValid(datum["yearmonth_date"]) && isFinite(+datum["yearmonth_date"]) && isValid(datum["sum_count"]) && isFinite(+datum["sum_count"])'}}}},{type:"rule",encode:{update:{x:{scale:"x",signal:"indexDate",offset:.5},y2:{field:{group:"height"}},stroke:{value:"firebrick"}}}},{type:"text",encode:{update:{x:{scale:"x",signal:"indexDate",offset:-2},baseline:{value:"top"},align:{value:"right"},text:{signal:"indexDate ? '↑ ' + scale('count', datetime(year(indexDate), month(indexDate), date(indexDate)) ) : '' "},fill:{value:"firebrick"},fontWeight:{value:"bolder"},stroke:{value:"rgba(255,255,255,0.3)"}}}},{type:"text",encode:{update:{x:{scale:"x",signal:"indexDate",offset:-2},y:{value:12},baseline:{value:"top"},align:{value:"right"},text:{signal:"indexDate ? timeFormat(indexDate, '%m-%d') : '' "},fill:{value:"firebrick"},fontWeight:{value:"bolder"},stroke:{value:"rgba(255,255,255,0.3)"}}}}]}],scales:[{name:"x",type:"time",domain:{data:"table",field:"yearmonth_date"},range:[0,{signal:"width"}]},{name:"y",type:"linear",domain:{data:"table",fields:["sum_count_start","sum_count_end"]},range:[{signal:"height"},0],nice:!0,zero:!0},{name:"color",type:"ordinal",domain:{data:"table",field:"provinceName",sort:!0},range:{scheme:"category20b"}},{name:"count",type:"ordinal",domain:{data:"dateCount",field:"yearmonth_date"},range:{data:"dateCount",field:"sum_count"}}],axes:[{scale:"x",orient:"bottom",gridScale:"y",grid:!0,tickCount:"day",domain:!1,labels:!1,maxExtent:0,minExtent:0,ticks:!1,zindex:0},{scale:"x",orient:"bottom",grid:!1,domain:!1,tickSize:0,labelFlush:!0,labelOverlap:!0,tickCount:{signal:"ceil(width/40)"},encode:{labels:{update:{text:{signal:"timeFormat(datum.value, '%m-%d')"}}}},zindex:0}]}}var R=q,V=(n("8f4f"),Object(h["a"])(R,I,H,!1,null,"86b6a8dc",null)),Y=V.exports;function W(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function J(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?W(Object(n),!0).forEach((function(t){Object(u["a"])(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):W(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var G={name:"home",components:{Spinner:E,TimeMinimap:Y},data:function(){return{updateTime:dayjs(k).format("YYYY-MM-DD HH:mm")}},computed:J({},Object(l["c"])({mapType:"mapType",size:"paneSize"}),{loading:function(){return"loading"===this.$store.state.loadState},loaded:function(){return"loaded"===this.$store.state.loadState},changeType:function(){return"circle"===this.mapType?"3D":"circle"},formattedDateMin:function(){return dayjs(this.dateMin).format("MM-DD")},formattedDateMax:function(){return dayjs(this.dateMax).format("MM-DD")},dayInfo:function(){var e=this.$store.state.dataTime,t=this.$store.getters.incrementalData,n=dayjs(e).format("MM-DD"),a=t&&t.dateMap[+dayjs(e).endOf("day")];return isNaN(a)&&(a=""),"".concat(n,": ↑").concat(a)},pointInfo:function(){var e=this.$store.getters.visiblePoints[this.$store.state.pickedIdx];return e?"".concat(e.areaName,": ").concat(e.confirmedCount):""}}),methods:{toggleSize:function(){var e="small"===this.size?"large":"small";this.$store.commit("setPaneSize",e)},toggleMapType:function(){this.$store.commit("setMapType",this.changeType)}}},K=G,Q=(n("410e"),Object(h["a"])(K,j,D,!1,null,"6a7ccaac",null)),U=Q.exports;a["a"].use(x["a"]);var X=[{path:"/",name:"home",component:U}],Z=new x["a"]({routes:X}),ee=Z,te=(n("c740"),n("dca8"),n("3ca3"),n("96cf"),n("1da1"));function ne(e){var t=[],n=0;function a(e,a){if(a.confirmedCount){var r=LocDoc[e];if(r){a.areaName=e;var i={coordinates:r.location,confirmedCount:a.confirmedCount,provinceName:r.province,cityName:r.cityName,areaName:e,data:a};t.push(i),n=Math.max(n,a.confirmedCount)}else console.error("cannot find:",e)}}return e.forEach((function(e){var t=e.provinceName;e.cities.length?e.cities.forEach((function(e){a(t+e.cityName,e)})):a(t,e)})),Object.freeze(t),t}n("a15b"),n("07ac");var ae=n("d4ec"),re=n("bee2"),ie=function(){function e(){Object(ae["a"])(this,e),this.data=null,this.dateFrom=0,this.dateTo=0}return Object(re["a"])(e,[{key:"load",value:function(){var e=Object(te["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!this.data){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,d3.csv("".concat("https://cdn.jsdelivr.net/gh/yuqianma/ncov-map@gh-pages/","before0124.csv"),(function(e){var t=e["地区"],n=LocDoc[t];if(!n)throw t;return{caseNum:+e["病例数"],date:new Date(dayjs(e["发病日期"]).endOf("day")),areaName:e["地区"],loc:n,infoSource:e["消息来源"],note:e["备注"]}}));case 4:t=e.sent,this.data=t.sort((function(e,t){return e.date-t.date})),this.dateFrom=this.data[0].date,this.dateTo=this.data[this.data.length-1].date;case 8:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},{key:"aggregateProvinceMap",value:function(){var e={};return this.data.forEach((function(t){var n=t.loc,a=e[n.province]=e[n.province]||{confirmedCount:0,provinceName:n.province};a.confirmedCount+=t.caseNum})),e}},{key:"queryIncOfDate",value:function(e){return e=new Date(dayjs(e).endOf("day")),this.data.filter((function(t){return t.date-e===0}))}},{key:"getProvinceIncOfDate",value:function(e){e=new Date(dayjs(e).endOf("day"));var t=this.queryIncOfDate(e),n={};return t.forEach((function(t){var a=t.loc,r=n[a.province]=n[a.province]||{date:e,confirmedCountInc:0,provinceName:a.province};r.confirmedCountInc+=t.caseNum})),Object.values(n)}},{key:"queryPointsByDate",value:function(e){var t=new Date(e);return this.data.filter((function(e){return e.date<=t}))}},{key:"getVisiblePointsByDate",value:function(e){var t=this.queryPointsByDate(e),n={};return t.forEach((function(e){var t=e.loc.location,a=t.join(","),r=n[a]=n[a]||{coordinates:t,confirmedCount:0,provinceName:e.loc.province,cityName:e.loc.city,areaName:e.loc.province+e.loc.city,data:[]};r.confirmedCount+=e.caseNum,r.data.push(e)})),Object.values(n)}}]),e}(),oe=new ie,ce=(n("13d5"),n("2909"));function se(e){return e.reduce((function(e,t){return e+t.confirmedCountInc}),0)}function ue(e){var t=e.dateFrom,n=e.formerData,a=e.areaStats,r=[],i={},o=dayjs(n.dateFrom);while(o<=n.dateTo){var c=n.getProvinceIncOfDate(o);i[+o]=se(c),r.push.apply(r,Object(ce["a"])(c)),o=o.add(1,"day")}var s=n.aggregateProvinceMap();a.forEach((function(e){var t=new Date(dayjs(e.time).endOf("day")),n={},a=[];e.forEach((function(e){var r,i=e.provinceName;LocDoc[i]&&(i=LocDoc[i].province),n[i]||(n[i]=e),r=s[i]?e.confirmedCount-s[i].confirmedCount:e.confirmedCount,a.push({date:t,confirmedCountInc:r,provinceName:i})})),r.push.apply(r,a),i[+t]=se(a),s=n}));var u=r.filter((function(e){return e.date>=t}));return u.dateMap=i,Object.freeze(u),u}function le(){return Promise.all(AreaStatIndex.map((function(e){return fetch("".concat("https://cdn.jsdelivr.net/gh/yuqianma/ncov-map@gh-pages/","dxy/").concat(e)).then((function(e){return e.text()})).then((function(t){var n=P(t);return n.time=_(e),Object.freeze(n)}))})))}a["a"].use(l["a"]);var de=new l["a"].Store({state:{mapType:"circle",areaStats:[],pickedIdx:-1,dataTime:k,loadState:null,paneSize:"small"},getters:{visiblePoints:function(e){var t=e.areaStats,n=e.dataTime;if(n>=k)return ne(window.getAreaStat);if(n>T){var a=t.findIndex((function(e){return e.time>+n}));return a=Math.max(0,Math.min(a-1,t.length)),ne(t[a])}return oe.getVisiblePointsByDate(n)},incrementalData:function(e){var t=e.areaStats;return t.length?ue({dateFrom:C[0],formerData:oe,areaStats:t}):null}},mutations:{setLoading:function(e){e.loadState="loading"},setDataTime:function(e,t){e.dataTime=t>=k?k:t},saveAllData:function(e,t){e.areaStats=t,e.loadState="loaded"},setPickedIdx:function(e,t){return e.pickedIdx=t},setMapType:function(e,t){return e.mapType=t},setPaneSize:function(e,t){return e.paneSize=t}},actions:{fetchAllData:function(){var e=Object(te["a"])(regeneratorRuntime.mark((function e(t){var n,a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(n=t.state,a=t.commit,!n.loadState){e.next=3;break}return e.abrupt("return");case 3:return a("setLoading"),console.time("load"),e.next=7,oe.load();case 7:return e.next=9,le().then((function(e){console.timeEnd("load"),a("saveAllData",e)}));case 9:case"end":return e.stop()}}),e)})));function t(t){return e.apply(this,arguments)}return t}()},modules:{}});de.dispatch("fetchAllData").then((function(){}));var pe=de;a["a"].config.productionTip=!1;new a["a"]({router:ee,store:pe,render:function(e){return e(O)}}).$mount("#app")},"85ec":function(e,t,n){},"8f4f":function(e,t,n){"use strict";var a=n("a523"),r=n.n(a);r.a},a523:function(e,t,n){},a6b6:function(e,t,n){},e1f7:function(e,t,n){"use strict";var a=n("ff9f"),r=n.n(a);r.a},f4e6:function(e,t,n){},ff9f:function(e,t,n){}});