(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{415:function(e,t,n){"use strict";n.r(t);var o=n(112),r=n(132),c=Object(o.b)({setup:function(){var e=Object(o.k)(),t=e.state.user,n=Object(o.h)().$api,c=Object(o.e)(""),l=Object(o.e)(""),d=Object(o.e)(""),v=Object(o.a)((function(){return t.email})),m=Object(o.a)((function(){return t.loggedIn}));Object(o.d)((function(){f()}));var f=function(){n(Object(r.b)())().then((function(e){d.value=e})).catch((function(e){d.value=""}))};return{email:c,password:l,secret:d,userEmail:v,loggedIn:m,login:function(){e.dispatch("user/login",{email:c.value,password:l.value})},logout:function(){e.dispatch("user/logout")},refresh:f}}}),l=n(77),component=Object(l.a)(c,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[e.loggedIn?n("div",[n("div",[n("span",[e._v(e._s(e.userEmail))])]),n("div",[n("button",{on:{click:function(t){return e.logout()}}},[e._v("LOGOUT")])])]):n("div",[n("div",[n("span",[e._v("E-mail")]),n("input",{directives:[{name:"model",rawName:"v-model",value:e.email,expression:"email"}],attrs:{type:"text",name:"email",required:""},domProps:{value:e.email},on:{input:function(t){t.target.composing||(e.email=t.target.value)}}})]),n("div",[n("span",[e._v("Password")]),n("input",{directives:[{name:"model",rawName:"v-model",value:e.password,expression:"password"}],attrs:{type:"password",name:"password",required:""},domProps:{value:e.password},on:{input:function(t){t.target.composing||(e.password=t.target.value)}}})]),n("div",[n("button",{on:{click:function(t){return e.login()}}},[e._v("LOGIN")])]),e._m(0)]),n("div",[n("button",{on:{click:function(t){return e.refresh()}}},[e._v("REFRESH")])]),n("div",[n("span",[e._v("SECRET: "+e._s(e.secret))])])])}),[function(){var e=this.$createElement,t=this._self._c||e;return t("div",[t("form",{attrs:{action:"http://localhost:1233/login/google",method:"post"}},[t("input",{attrs:{type:"submit"}})])])}],!1,null,"5756ff99",null);t.default=component.exports}}]);