(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{384:function(t,e,r){"use strict";r.d(e,"e",(function(){return c})),r.d(e,"c",(function(){return o})),r.d(e,"a",(function(){return l})),r.d(e,"b",(function(){return d})),r.d(e,"d",(function(){return f}));var n=r(48),c=function(){return Object(n.axiosRequest)(n.METHODS.POST,"/video")},o=function(t){return Object(n.axiosRequest)(n.METHODS.GET,"/video/".concat(t,"/tracks/public"))},l=function(){return Object(n.axiosRequest)(n.METHODS.GET,"/videos/me")},d=function(t){return Object(n.axiosRequest)(n.METHODS.GET,"/video/"+t)},f=function(t){return Object(n.axiosRequest)(n.METHODS.GET,"/video/".concat(t,"/tracks"))}},406:function(t,e,r){var content=r(421);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(114).default)("4ec4faff",content,!0,{sourceMap:!1})},420:function(t,e,r){"use strict";r(406)},421:function(t,e,r){var n=r(113)(!1);n.push([t.i,".flex-column[data-v-3cfe5d11],.flex-row[data-v-3cfe5d11]{display:flex}.middle-center[data-v-3cfe5d11]{justify-content:center;align-items:center}.stretch-center[data-v-3cfe5d11]{justify-content:center;align-items:stretch}.fill-screen[data-v-3cfe5d11]{width:100%;height:100vh}#me[data-v-3cfe5d11]{background-color:#470024;color:#fff;min-height:100vh}#me .card[data-v-3cfe5d11]:hover{background-color:#555!important}#me a[data-v-3cfe5d11]{color:inherit}",""]),t.exports=n},429:function(t,e,r){"use strict";r.r(e);var n=r(0),c=r(27),o=(r(67),r(1),r(50),r(52),r(19),r(5),r(4),r(2),r(6),r(3),r(7),r(112)),video=r(384);function l(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}function d(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?l(Object(source),!0).forEach((function(e){Object(n.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):l(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}var f=Object(o.b)({setup:function(){var t=Object(o.k)(),e=t.state.user,r=Object(o.j)(),n=Object(o.h)(),l=n.$api,f=n.$axios,v=Object(o.a)((function(){return e.email})),O=Object(o.a)((function(){return e.loggedIn})),m=Object(o.e)([]);return Object(o.d)(Object(c.a)(regeneratorRuntime.mark((function t(){var e;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(O.value){t.next=3;break}return r.push("/"),t.abrupt("return");case 3:return t.next=5,l(Object(video.a)())();case 5:return e=t.sent,t.next=8,Promise.all(e.map(function(){var t=Object(c.a)(regeneratorRuntime.mark((function t(video){var e;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,f("http://youtube.com/oembed?url=youtube.com/watch?v=".concat(video.handle,"&format=json"));case 2:return e=t.sent,t.abrupt("return",d(d({},video),{},{title:e.data.title||"",thumbnail:e.data.thumbnail_url||""}));case 4:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()));case 8:m.value=t.sent;case 9:case"end":return t.stop()}}),t)})))),{userEmail:v,loggedIn:O,videos:m,logout:function(){t.dispatch("user/logout"),r.push("/")}}}}),v=f,O=(r(420),r(77)),component=Object(O.a)(v,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{attrs:{id:"me"}},[r("div",{staticClass:"container py-5"},[r("h1",[t._v("My Tracks")]),r("div",{staticClass:"row mb-3"},[r("div",{staticClass:"col"},[r("span",{staticClass:"mr-3"},[t._v("E-mail: "+t._s(t.userEmail))]),r("button",{staticClass:"btn btn-primary",on:{click:function(e){return t.logout()}}},[t._v("LOGOUT")])])]),r("div",{staticClass:"row"},t._l(t.videos,(function(video){return r("div",{staticClass:"col-4"},[r("nuxt-link",{attrs:{to:"/edit?videoId="+video._id}},[r("b-card",{staticClass:"video-tiem bg-dark",attrs:{"img-src":video.thumbnail,"img-top":""}},[r("b-card-title",[t._v(t._s(video.title))]),r("nuxt-link",{attrs:{to:"/view?videoId="+video._id}},[r("button",{staticClass:"btn btn-primary"},[t._v("WATCH WITH CC")])])],1)],1)],1)})),0)])])}),[],!1,null,"3cfe5d11",null);e.default=component.exports}}]);