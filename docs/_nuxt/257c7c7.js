(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{383:function(e,t,n){"use strict";n.d(t,"b",(function(){return r})),n.d(t,"a",(function(){return l}));n(1),n(43),n(385),n(144);var r=function(time){return Math.round(100*time)/100},l=function(time){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],t=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],n=r(time),l=Math.floor(n/3600),o=Math.floor(n%3600/60),c=t?Math.floor(n%60*100)/100:Math.floor(n%60),v=e?l.toString()+":":"",d=(e?o.toString().padStart(2,"0"):o.toString())+":",f=t?c.toFixed(2).toString().padStart(5,"0"):c.toString().padStart(2,"0");return v+d+f}},389:function(e,t,n){"use strict";n.d(t,"b",(function(){return l})),n.d(t,"c",(function(){return o})),n.d(t,"a",(function(){return c}));n(21),n(19);var r=n(48),l=function(){return Object(r.axiosRequest)(r.METHODS.POST,"/infos")},o=function(){return Object(r.axiosRequest)(r.METHODS.PUT,"/infos")},c=function(e){return Object(r.axiosRequest)(r.METHODS.DELETE,"/infos?".concat(e.map((function(e){return"ids[]=".concat(e)})).join("&")))}},394:function(e,t,n){var content=n(405);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(114).default)("a88244f0",content,!0,{sourceMap:!1})},404:function(e,t,n){"use strict";n(394)},405:function(e,t,n){var r=n(113)(!1);r.push([e.i,".flex-column[data-v-0ef824a8],.flex-row[data-v-0ef824a8]{display:flex}.middle-center[data-v-0ef824a8]{justify-content:center;align-items:center}.stretch-center[data-v-0ef824a8]{justify-content:center;align-items:stretch}.fill-screen[data-v-0ef824a8]{width:100%;height:100vh}.move-target[data-v-0ef824a8]{cursor:move}.drag[data-v-0ef824a8]{cursor:ew-resize}",""]),e.exports=r},413:function(e,t,n){var content=n(429);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(114).default)("836c44f8",content,!0,{sourceMap:!1})},418:function(e,t,n){"use strict";n.r(t);n(183),n(398);var r=n(112),time=n(383),l=Object(r.b)({props:{videoLength:{type:Number,required:!0},getDisplayPosition:{type:Function,required:!0},density:{type:Number,required:!0},timelineLength:{type:Number,required:!0},timelineStart:{type:Number,required:!0},scrollbarHeight:{type:Number,required:!0},rulerTextOffset:{type:Number,required:!0}},setup:function(e){var t=Object(r.g)(e),n=t.videoLength,l=t.density,o=t.timelineLength,c=t.timelineStart,v=[1,10,60,600,3600],d=[16,10,6],f=function(){for(var e=v.length-1,i=0;i<v.length;i++){var t=v[i];if(!t)throw new Error("Out of range");if(l.value<=.02*t){e=i;break}}var n=v[e];if(!n)throw new Error("Out of range");return{main:n,half:n/2,sub:v[e-1]||.1}},m=function(e){var sub=f().sub;return(Math.floor(c.value/sub)+e-1)*sub},h=function(e){var time=m(e),t=f(),main=t.main,n=t.half;return time%main==0?"main":time%n==0?"half":"sub"};return{getRulerNum:function(){return Math.ceil(o.value/f().sub)+1},getRulerTime:m,getRulerType:h,getRulerLineHeight:function(e){var t=h(e);return"main"===t?d[0]:"half"===t?d[1]:d[2]},getRulerText:function(e){return Object(time.a)(m(e),n.value>3600,!1)}}}}),o=n(77),component=Object(o.a)(l,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("g",e._l(e.getRulerNum(),(function(t){return n("g",[n("line",{attrs:{x1:e.getDisplayPosition(e.getRulerTime(t)),y1:e.scrollbarHeight,x2:e.getDisplayPosition(e.getRulerTime(t)),y2:e.scrollbarHeight+e.getRulerLineHeight(t),stroke:"#0DCAF0"}}),"main"===e.getRulerType(t)?n("text",{staticClass:"text-monospace",attrs:{x:e.getDisplayPosition(e.getRulerTime(t))+5,y:e.scrollbarHeight+e.rulerTextOffset,fill:"#999999","font-size":"10px"}},[e._v(e._s(e.getRulerText(t)))]):e._e()])})),0)}),[],!1,null,"d6b1d91c",null);t.default=component.exports},419:function(e,t,n){"use strict";n.r(t);n(183);var r=n(112),l=n(383),o=n(389),c=Object(r.b)({props:{sub:{type:Object,required:!0},videoLength:{type:Number,required:!0},pointerTime:{type:Number,required:!0},trackY:{type:Number,required:!0},trackHeight:{type:Number,required:!0},getSubWidth:{type:Function,required:!0},getDisplayPosition:{type:Function,required:!0}},setup:function(e){var t=Object(r.g)(e),n=t.videoLength,c=t.pointerTime,v=t.getSubWidth,d=Object(r.h)().$api,f=Object(r.e)(null),m=Object(r.e)(""),h=function(){var sub=f.value,e=m.value;if(sub&&("start"===e||"end"===e)){sub.dragPoint=sub.dragPoint||Object(l.b)(c.value);var t="start"===e?(sub.prev?sub.prev.endTime:0)-sub.startTime:sub.startTime+.1-sub.endTime,r="start"===e?sub.endTime-.1-sub.startTime:(sub.next?sub.next.startTime:n.value)-sub.endTime,time=Object(l.b)(c.value-sub.dragPoint);time=Math.max(t,time),time=Math.min(r,time),time=Object(l.b)(time),sub.dragPoint=Object(l.b)(sub.dragPoint+time),"start"===e&&(sub.startTime+=time),"end"===e&&(sub.endTime+=time)}},y=function(){var sub=f.value,e=m.value;if(sub&&"move"===e){sub.dragPoint=sub.dragPoint||Object(l.b)(c.value);var dt=Object(l.b)(c.value-sub.dragPoint),t=(sub.prev?sub.prev.endTime:0)-sub.startTime,r=(sub.next?sub.next.startTime:n.value)-sub.endTime;dt=Math.max(t,dt),dt=Math.min(r,dt),dt=Object(l.b)(dt),sub.dragPoint=Object(l.b)(sub.dragPoint+dt),sub.startTime=Object(l.b)(sub.startTime+dt),sub.endTime=Object(l.b)(sub.endTime+dt)}},T=function(){var sub=f.value;f.value=null,m.value="",sub&&sub._id&&d(Object(o.c)())([{_id:sub._id,startTime:sub.startTime,endTime:sub.endTime,text:sub.text}])};return Object(r.d)((function(){window.addEventListener("mouseup",T),window.addEventListener("mousemove",y),window.addEventListener("mousemove",h)})),{subDragPoint:function(sub,e){f.value=sub,m.value=e,sub.dragPoint=Object(l.b)(c.value)},isSelfTarget:function(sub,e){return f.value===sub&&m.value===e},isDragEnabled:function(sub){return v.value(sub)>20},isMoveEnabled:function(sub){return v.value(sub)>10}}}}),v=(n(404),n(77)),component=Object(v.a)(c,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("g",{staticClass:"timeline-sub-control"},[n("rect",{staticClass:"move-target",class:{"d-none":!e.isMoveEnabled(e.sub)},attrs:{x:e.isSelfTarget(e.sub,"move")?0:e.getDisplayPosition(e.sub.startTime),y:e.trackY,rx:"4",width:e.isSelfTarget(e.sub,"move")?"100%":e.getSubWidth(e.sub),height:e.trackHeight},on:{mousedown:function(t){return e.subDragPoint(e.sub,"move")}}}),n("rect",{staticClass:"drag drag-start",class:{"d-none":!e.isDragEnabled(e.sub)},attrs:{x:e.isSelfTarget(e.sub,"start")?0:e.getDisplayPosition(e.sub.startTime),y:e.trackY,rx:"4",width:e.isSelfTarget(e.sub,"start")?"100%":10,height:e.trackHeight},on:{mousedown:function(t){return e.subDragPoint(e.sub,"start")}}}),n("rect",{staticClass:"drag drag-end",class:{"d-none":!e.isDragEnabled(e.sub)},attrs:{x:e.isSelfTarget(e.sub,"end")?0:e.getDisplayPosition(e.sub.endTime)-10,y:e.trackY,rx:"4",width:e.isSelfTarget(e.sub,"end")?"100%":10,height:e.trackHeight},on:{mousedown:function(t){return e.subDragPoint(e.sub,"end")}}})])}),[],!1,null,"0ef824a8",null);t.default=component.exports},428:function(e,t,n){"use strict";n(413)},429:function(e,t,n){var r=n(113)(!1);r.push([e.i,".flex-column[data-v-3bb7c0f5],.flex-row[data-v-3bb7c0f5]{display:flex}.middle-center[data-v-3bb7c0f5]{justify-content:center;align-items:center}.stretch-center[data-v-3bb7c0f5]{justify-content:center;align-items:stretch}.fill-screen[data-v-3bb7c0f5]{width:100%;height:100vh}#timeline-map-svg[data-v-3bb7c0f5]{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}",""]),e.exports=r},436:function(e,t,n){"use strict";n.r(t);var r=n(27),l=(n(67),n(183),n(1),n(3),n(112)),o=Object(l.b)({props:{videoLength:{type:Number,default:60},player:{default:null},tracks:{type:Array,default:[]},curTrackId:{type:String,default:""},changeTrack:{type:Function,required:!0}},setup:function(e){var t=Object(l.g)(e),n=t.videoLength,o=t.player,c=t.tracks,v=t.changeTrack,d=Object(l.a)((function(){return n.value/2})),f=Object(l.a)((function(){return c.value.length})),cursor=Object(l.e)(0),m=Object(l.e)({x:0,y:0}),h=Object(l.e)(0),y=Object(l.a)((function(){return k.value+H.value*P.value})),T=Object(l.a)((function(){return cursor.value>k.value&&cursor.value<F.value})),x=Object(l.a)((function(){return 32+32*f.value})),O=Object(l.e)(null),k=Object(l.e)(0),j=Object(l.e)(1),w=Object(l.e)(!1),S=Object(l.e)(1440),H=Object(l.a)((function(){return m.value.x/S.value})),P=Object(l.a)((function(){return n.value/j.value})),F=Object(l.a)((function(){return k.value+P.value})),D=Object(l.a)((function(){return P.value/S.value})),E=function(){k.value=Math.max(k.value,0),k.value=Math.min(k.value,n.value-P.value)},M=function(){var e;null===(e=o.value)||void 0===e||e.seekTo(y.value,!0)},L=function(){if(w.value){h.value=h.value||H.value;var e=H.value-h.value,t=0-k.value/n.value,r=1-(k.value+P.value)/n.value;e=Math.max(t,e),e=Math.min(r,e),h.value=h.value+e,k.value=k.value+e*n.value}},_=function(){w.value=!1},R=function(e){var t=y.value;j.value*=Math.pow(1.2,-e/100),j.value=Math.max(1,j.value),j.value=Math.min(d.value,j.value),k.value=t-P.value*H.value,E()},C=function(e){k.value+=e*P.value/1e3,E()},N=function e(){W(),Y(),A(),window.requestAnimationFrame(e)},W=function(){var e=Object(r.a)(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,null===(t=o.value)||void 0===t?void 0:t.getCurrentTime();case 2:if(e.t0=e.sent,e.t0){e.next=5;break}e.t0=0;case 5:cursor.value=e.t0;case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),Y=function(){c.value.forEach((function(e){return e.subs.setActive(cursor.value)}))},A=function(){var e=Object(r.a)(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.t0=o.value,!e.t0){e.next=6;break}return e.next=4,o.value.getPlayerState();case 4:e.t1=e.sent,e.t0=1===e.t1;case 6:if(!e.t0){e.next=10;break}.9,T.value?cursor.value>k.value+.9*P.value&&(t=cursor.value-.9*P.value)+P.value<n.value&&(k.value=t):k.value=cursor.value-P.value*(1-.9),E();case 10:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),z=function(){var e;S.value=(null===(e=O.value)||void 0===e?void 0:e.getBoundingClientRect().width)||1440};return Object(l.d)((function(){window.addEventListener("mousemove",(function(e){m.value.x=e.x,m.value.y=e.y}),!0),window.addEventListener("drag",(function(e){(e.x||e.y)&&(m.value.x=e.x,m.value.y=e.y)}),!0),window.addEventListener("mouseup",_),window.addEventListener("mousemove",L),window.addEventListener("resize",z),z(),N()})),{trackNum:f,cursor:cursor,pointerTime:y,trackHeight:32,scrollbarHeight:8,rulerSpaceHeight:24,rulerTextOffset:20,timelineHeight:x,timelineSvg:O,timelineStart:k,timelineLength:P,timelineScale:j,density:D,timelineWheel:function(e){e.preventDefault(),e.ctrlKey?R(e.deltaY):C(e.deltaY)},timelineClick:M,timelineMapDragPoint:function(){h.value=H.value,w.value=!0},changeTrackAndSeek:function(e){v.value(e),M()},getSubWidth:function(sub){var e=sub.endTime-sub.startTime;return S.value*e/P.value},getDisplayPosition:function(time){return(time-k.value)/P.value*S.value},getTrackYPos:function(i){return 32+32*i}}}}),c=o,v=(n(428),n(77)),component=Object(v.a)(c,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("svg",{ref:"timelineSvg",attrs:{id:"timeline-map-svg",width:"100%",height:e.timelineHeight},on:{wheel:e.timelineWheel}},[n("g",{attrs:{id:"timeline-bg"}},[n("rect",{attrs:{x:"0",y:e.scrollbarHeight,width:"100%",height:e.timelineHeight-e.scrollbarHeight,fill:"#000000"}})]),n("g",{attrs:{id:"timeline-scroll-bar"}},[n("rect",{attrs:{x:e.timelineStart/e.timelineLength/e.timelineScale*100+"%",y:"0",width:1/e.timelineScale*100+"%",height:e.scrollbarHeight,rx:"4",fill:"#FFFFFF88"},on:{mousedown:e.timelineMapDragPoint}})]),n("g",{attrs:{id:"ruler"}},[n("EditTimelineRuler",{attrs:{videoLength:e.videoLength,getDisplayPosition:e.getDisplayPosition,density:e.density,timelineLength:e.timelineLength,timelineStart:e.timelineStart,scrollbarHeight:e.scrollbarHeight,rulerTextOffset:e.rulerTextOffset}})],1),n("g",{attrs:{id:"timeline-box"}},[n("rect",{attrs:{x:"0",y:e.scrollbarHeight,width:"100%",height:e.timelineHeight,fill:"#00000000"},on:{click:e.timelineClick}})]),n("g",{attrs:{id:"timeline-subs"}},e._l(e.tracks,(function(t,i){return n("g",{staticClass:"timeline-track",on:{click:function(n){return e.changeTrackAndSeek(t._id)}}},[n("rect",{staticClass:"track-control",style:{opacity:t._id===e.curTrackId?1:.5},attrs:{x:0,y:e.scrollbarHeight+e.rulerSpaceHeight+e.trackHeight*i,width:"100%",height:e.trackHeight,fill:t._id===e.curTrackId?"#FFFFFF22":"#00000000"}}),e._l(t.subs.data,(function(sub){return n("g",{staticClass:"position-absolute timeline-sub rounded h-100"},[n("rect",{attrs:{x:e.getDisplayPosition(sub.startTime),y:e.scrollbarHeight+e.rulerSpaceHeight+e.trackHeight*i,rx:"4",width:e.getSubWidth(sub),height:e.trackHeight,fill:"#FFFFFF88",stroke:"#FFFFFF","stroke-width":"0.5px"}})])}))],2)})),0),n("line",{attrs:{id:"cursor",x1:e.getDisplayPosition(e.cursor),y1:e.scrollbarHeight,x2:e.getDisplayPosition(e.cursor),y2:e.timelineHeight,stroke:"#FF0000"}}),n("g",{attrs:{id:"timeline-sub-controls",fill:"#00000000"}},e._l(e.tracks,(function(t,i){return n("g",{staticClass:"timeline-sub-controls-track",on:{click:function(n){return e.changeTrack(t._id)}}},e._l(t.subs.data,(function(sub,t){return n("EditTimelineSubtitleControl",{key:t,staticClass:"timeline-sub",attrs:{sub:sub,videoLength:e.videoLength,pointerTime:e.pointerTime,trackY:e.getTrackYPos(i),trackHeight:e.trackHeight,getSubWidth:e.getSubWidth,getDisplayPosition:e.getDisplayPosition}})})),1)})),0)])}),[],!1,null,"3bb7c0f5",null);t.default=component.exports;installComponents(component,{EditTimelineRuler:n(418).default,EditTimelineSubtitleControl:n(419).default})}}]);