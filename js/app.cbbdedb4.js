(function(e){function t(t){for(var r,o,c=t[0],s=t[1],u=t[2],d=0,f=[];d<c.length;d++)o=c[d],Object.prototype.hasOwnProperty.call(a,o)&&a[o]&&f.push(a[o][0]),a[o]=0;for(r in s)Object.prototype.hasOwnProperty.call(s,r)&&(e[r]=s[r]);l&&l(t);while(f.length)f.shift()();return i.push.apply(i,u||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],r=!0,c=1;c<n.length;c++){var s=n[c];0!==a[s]&&(r=!1)}r&&(i.splice(t--,1),e=o(o.s=n[0]))}return e}var r={},a={app:0},i=[];function o(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=e,o.c=r,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,function(t){return e[t]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="https://cdn.jsdelivr.net/gh/yuqianma/ncov-map@gh-pages/";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],s=c.push.bind(c);c.push=t,c=c.slice();for(var u=0;u<c.length;u++)t(c[u]);var l=s;i.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"034f":function(e,t,n){"use strict";var r=n("85ec"),a=n.n(r);a.a},"471a":function(e,t,n){"use strict";var r=n("6632"),a=n.n(r);a.a},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("Map"),n("router-view")],1)},i=[],o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{ref:"container"})},c=[],s=(n("a4d3"),n("4de4"),n("4160"),n("d81d"),n("e439"),n("dbb4"),n("b64b"),n("159b"),n("ade3")),u=n("2f62");function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function d(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){Object(s["a"])(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var f=5e4,p={name:"Map",mounted:function(){var e=this,t=new maptalks.Map(this.$refs.container,{center:[104.299012,34.781634],zoom:3,minZoom:3,maxZoom:10,zoomControl:{position:"top-right",slider:!1,zoomLevel:!1},layers:[new maptalks.TileLayer("tile",{urlTemplate:"https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}",maxAvailableZoom:10,cssFilter:"sepia(100%) grayscale(100%)",opacity:.5}),new maptalks.TileLayer("boudaries",{urlTemplate:"https://map.geoq.cn/arcgis/rest/services/SimpleFeature/ChinaBoundaryLine/MapServer/tile/{z}/{y}/{x}",maxAvailableZoom:8,cssFilter:"grayscale(100%)",opacity:.5})]});t.setMaxExtent([73.502355,16,135.09567,53.563269]),this.map=t,window._map=t,this.eventLayer=new maptalks.VectorLayer("v").addTo(t);var n=this.map.distanceToPixel(f).width;this.heatLayer=new maptalks.HeatLayer("heat",this.visiblePoints,{radius:n,blur:n,gradient:{.4:"blue",.6:"cyan",.7:"lime",.8:"yellow",1:"red"}}).addTo(t),t.on("zoomend",(function(t){t.to;var n=e.map.distanceToPixel(f).width;e.heatLayer.config({radius:n,blur:n})})),this.appendEventCircles(this.visiblePoints)},computed:d({},Object(u["b"])(["visiblePoints"])),watch:{visiblePoints:function(e){this.heatLayer.setData(e)}},methods:{appendEventCircles:function(e){var t=this,n=null,r=function(e){n&&n.updateSymbol({lineWidth:0}),e.target.updateSymbol({lineWidth:2}),n=e.target,t.$store.commit("setPickedIdx",e.target.options.idx)};this.eventLayer.addGeometry(e.map((function(e,t){var n=new maptalks.Circle([e[0],e[1]],f,{idx:t,symbol:{lineWidth:0}});return n.on("click",r),n})))}}},m=p,v=(n("471a"),n("2877")),h=Object(v["a"])(m,o,c,!1,null,"7ed35dc5",null),b=h.exports,y={components:{Map:b}},g=y,w=(n("034f"),Object(v["a"])(g,a,i,!1,null,null,null)),O=w.exports,j=n("8c4f"),x=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"home"},[n("div",{staticClass:"info info-time"},[e._v(e._s(e.formattedTime))]),n("div",{staticClass:"info info-point"},[e._v(e._s(e.pointInfo))]),n("div",{staticClass:"pane"},[e.loading?n("Spinner"):e._e(),e.loaded||e.loading?e._e():n("div",{staticClass:"load",on:{click:e.load}},[e._v("加载全部数据")]),e.loaded?n("input",{directives:[{name:"model",rawName:"v-model",value:e.dataTime,expression:"dataTime"}],attrs:{type:"range",min:e.dateMin,max:e.dateMax},domProps:{value:e.dataTime},on:{__r:function(t){e.dataTime=t.target.value}}}):e._e()],1)])},P=[],D=(n("99af"),n("96cf"),n("1da1"));n("ac1f"),n("5319");function _(e){return new Function("var window = {}; ".concat(e,"; for(let k in window) {return window[k];}"))()}function S(e){return LocDoc[e]?LocDoc[e].location:(console.error(e),[])}function k(e){return+e.replace(/[^\d]/g,"")}var T=window.AreaStatIndex,M=k(T[T.length-1]);window.getAreaStat.time=M;var E=[new Date("2019-12-07"),new Date(M)],C=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},L=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"lds-ellipsis"},[n("div"),n("div"),n("div"),n("div")])}],$={name:"Spinner"},A=$,I=(n("e1f7"),Object(v["a"])(A,C,L,!1,null,"ba5a3b68",null)),z=I.exports;function q(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function N(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?q(Object(n),!0).forEach((function(t){Object(s["a"])(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):q(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var R={name:"home",components:{Spinner:z},data:function(){return{dateMin:+E[0],dateMax:+E[1],loading:!1}},computed:N({},Object(u["c"])(["loaded"]),{dataTime:{get:function(){return+this.$store.state.dataTime},set:function(e){this.$store.commit("setDataTime",+e)}},formattedTime:function(){return dayjs(this.$store.state.dataTime).format("YYYY-MM-DD HH:mm")},pointInfo:function(){var e=this.$store.getters.visiblePoints[this.$store.state.pickedIdx];if(!e)return"";var t=e[3];return console.log(t),"".concat(t.cityName||t.provinceName,": ").concat(t.confirmedCount)}}),methods:{load:function(){var e=Object(D["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return this.loading=!0,e.next=3,this.$store.dispatch("fetchAllData");case 3:this.loading=!1;case 4:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()}},B=R,F=(n("7851"),Object(v["a"])(B,x,P,!1,null,"d49ba69c",null)),Y=F.exports;r["a"].use(j["a"]);var Z=[{path:"/",name:"home",component:Y}],H=new j["a"]({routes:Z}),V=H,W=(n("c740"),n("dca8"),n("d3b7"),n("3ca3"),n("ddb0"),{"北京市":1,"上海市":1,"天津市":1});function G(e){var t=[],n=0;function r(e,r){var a=[e[0],e[1],r.confirmedCount,r];t.push(a),n=Math.max(n,a[2])}e.forEach((function(e){var t=e.provinceName;!W[t]&&e.cities.length?e.cities.forEach((function(e){r(S(t+e.cityName),e)})):r(S(t),e)}));var a=Math.log(n);return t.forEach((function(e){e[2]=Math.max(1e-6,Math.log(e[2])/a)})),Object.freeze(t),t}n("a15b"),n("07ac");var J=n("d4ec"),K=n("bee2"),Q=function(){function e(){Object(J["a"])(this,e),this.data=null}return Object(K["a"])(e,[{key:"load",value:function(){var e=Object(D["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,d3.csv("".concat("https://cdn.jsdelivr.net/gh/yuqianma/ncov-map@gh-pages/","before0124.csv"),(function(e){var t=e["地区"],n=LocDoc[t];if(!n)throw t;return{confirmedCount:e["病例数"],date:new Date(e["发病日期"]),areaName:e["地区"],location:n.location,infoSource:e["消息来源"],note:e["备注"]}}));case 2:t=e.sent,this.data=t.sort((function(e,t){return e.date-t.date}));case 4:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},{key:"queryPointsByDate",value:function(e){var t=new Date(e);return this.data.filter((function(e){return e.date<=t}))}},{key:"getVisiblePointsByDate",value:function(e){var t=this.queryPointsByDate(e),n={};return t.forEach((function(e){var t=e.location.join(","),r=n[t]=n[t]||[e.location[0],e.location[1],0,[]];r[2]+=+e.confirmedCount,r[3].push(e)})),Object.values(n)}}]),e}(),U=new Q;function X(){return Promise.all(AreaStatIndex.map((function(e){return fetch("".concat("https://cdn.jsdelivr.net/gh/yuqianma/ncov-map@gh-pages/","dxy/").concat(e)).then((function(e){return e.text()})).then((function(t){var n=_(t);return n.time=k(e),Object.freeze(n)}))})))}r["a"].use(u["a"]);var ee=new Date("2020-01-24"),te=new u["a"].Store({state:{areaStats:[],pickedIdx:-1,dataTime:M,loaded:!1},getters:{visiblePoints:function(e){var t=e.areaStats,n=e.dataTime;if(n===M)return G(window.getAreaStat);if(n>ee){var r=t.findIndex((function(e){return e.time>+n}));return r=Math.max(0,Math.min(r-1,t.length)),G(t[r])}return U.getVisiblePointsByDate(n)}},mutations:{setDataTime:function(e,t){e.dataTime=t},saveAllData:function(e,t){e.areaStats=t,e.loaded=!0},setPickedIdx:function(e,t){return e.pickedIdx=t}},actions:{fetchAllData:function(){var e=Object(D["a"])(regeneratorRuntime.mark((function e(t){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=t.commit,console.time("load"),e.next=4,U.load();case 4:return e.next=6,X().then((function(e){n("saveAllData",e),n("setDataTime",E[0])}));case 6:console.timeEnd("load");case 7:case"end":return e.stop()}}),e)})));function t(t){return e.apply(this,arguments)}return t}()},modules:{}}),ne=te;r["a"].config.productionTip=!1;var re=new r["a"]({router:V,store:ne,render:function(e){return e(O)}}).$mount("#app");window.vm=re},6632:function(e,t,n){},6925:function(e,t,n){},7851:function(e,t,n){"use strict";var r=n("6925"),a=n.n(r);a.a},"85ec":function(e,t,n){},e1f7:function(e,t,n){"use strict";var r=n("ff9f"),a=n.n(r);a.a},ff9f:function(e,t,n){}});