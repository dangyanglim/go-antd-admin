(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[16],{l9Wt:function(e,a,t){"use strict";t.r(a);t("Pwec");var n,o,i,r=t("CtXQ"),s=(t("sRBo"),t("kaz8")),c=(t("fOrg"),t("+KLJ")),l=t("p0pE"),m=t.n(l),d=(t("2qtc"),t("kLXV")),p=t("2Taf"),g=t.n(p),u=t("vZ4D"),f=t.n(u),h=t("l4Ni"),b=t.n(h),v=t("ujKo"),w=t.n(v),y=t("MhPg"),M=t.n(y),E=t("q1tI"),O=t.n(E),j=t("MuoO"),q=t("Y2fQ"),C=t("wY1l"),k=t.n(C),N=t("QBZU"),F=t("w2qy"),L=t.n(F),S=t("T+dw"),T=t.n(S),P=T.a.mideaLoginUrl,A=N["a"].Tab,B=N["a"].UserName,D=N["a"].Password,G=N["a"].Mobile,J=N["a"].Captcha,K=N["a"].Submit,Q=(n=Object(j["connect"])(function(e){var a=e.login,t=e.loading;return{login:a,submitting:t.effects["login/login"]}}),n((i=function(e){function a(){var e,t;g()(this,a);for(var n=arguments.length,o=new Array(n),i=0;i<n;i++)o[i]=arguments[i];return t=b()(this,(e=w()(a)).call.apply(e,[this].concat(o))),t.state={type:"account",autoLogin:!0},t.onTabChange=function(e){t.setState({type:e})},t.componentDidMount=function(){console.log(t.props.location),console.log(window.location);var e=!1;if(e)if(t.props.location.query.ticket){console.log(t.props.location.query.ticket);var a=t.props.dispatch;a({type:"login/actMideaLogin",payload:{password:"ant.design",type:"account",userName:"admin"}})}else window.location.href=P+window.location.href},t.onGetCaptcha=function(){return new Promise(function(e,a){t.loginForm.validateFields(["mobile"],{},function(n,o){if(n)a(n);else{var i=t.props.dispatch;i({type:"login/getCaptcha",payload:o.mobile}).then(e).catch(a),d["a"].info({title:Object(q["formatMessage"])({id:"app.login.verification-code-warning"})})}})})},t.handleSubmit=function(e,a){var n=t.state.type;if(!e){var o=t.props.dispatch;o({type:"login/actMideaLogin",payload:m()({},a,{type:n})})}},t.changeAutoLogin=function(e){t.setState({autoLogin:e.target.checked})},t.renderMessage=function(e){return O.a.createElement(c["a"],{style:{marginBottom:24},message:e,type:"error",showIcon:!0})},t}return M()(a,e),f()(a,[{key:"render",value:function(){var e=this,a=this.props,t=a.login,n=a.submitting,o=this.state,i=o.type,c=o.autoLogin;return O.a.createElement("div",{className:L.a.main},O.a.createElement(N["a"],{defaultActiveKey:i,onTabChange:this.onTabChange,onSubmit:this.handleSubmit,ref:function(a){e.loginForm=a}},O.a.createElement(A,{key:"account",tab:Object(q["formatMessage"])({id:"app.login.tab-login-credentials"})},"error"===t.status&&"account"===t.type&&!n&&this.renderMessage(Object(q["formatMessage"])({id:"app.login.message-invalid-credentials"})),O.a.createElement(B,{name:"name",placeholder:"".concat(Object(q["formatMessage"])({id:"app.login.userName"})),rules:[{required:!0,message:Object(q["formatMessage"])({id:"validation.userName.required"})}]}),O.a.createElement(D,{name:"pwd",placeholder:"".concat(Object(q["formatMessage"])({id:"app.login.password"})),rules:[{required:!0,message:Object(q["formatMessage"])({id:"validation.password.required"})}],onPressEnter:function(a){a.preventDefault(),e.loginForm.validateFields(e.handleSubmit)}})),O.a.createElement(A,{key:"mobile",tab:Object(q["formatMessage"])({id:"app.login.tab-login-mobile"})},"error"===t.status&&"mobile"===t.type&&!n&&this.renderMessage(Object(q["formatMessage"])({id:"app.login.message-invalid-verification-code"})),O.a.createElement(G,{name:"mobile",placeholder:Object(q["formatMessage"])({id:"form.phone-number.placeholder"}),rules:[{required:!0,message:Object(q["formatMessage"])({id:"validation.phone-number.required"})},{pattern:/^1\d{10}$/,message:Object(q["formatMessage"])({id:"validation.phone-number.wrong-format"})}]}),O.a.createElement(J,{name:"captcha",placeholder:Object(q["formatMessage"])({id:"form.verification-code.placeholder"}),countDown:120,onGetCaptcha:this.onGetCaptcha,getCaptchaButtonText:Object(q["formatMessage"])({id:"form.get-captcha"}),getCaptchaSecondText:Object(q["formatMessage"])({id:"form.captcha.second"}),rules:[{required:!0,message:Object(q["formatMessage"])({id:"validation.verification-code.required"})}]})),O.a.createElement("div",null,O.a.createElement(s["a"],{checked:c,onChange:this.changeAutoLogin},O.a.createElement(q["FormattedMessage"],{id:"app.login.remember-me"})),O.a.createElement("a",{style:{float:"right"},href:""},O.a.createElement(q["FormattedMessage"],{id:"app.login.forgot-password"}))),O.a.createElement(K,{loading:n},O.a.createElement(q["FormattedMessage"],{id:"app.login.login"})),O.a.createElement("div",{className:L.a.other},O.a.createElement(q["FormattedMessage"],{id:"app.login.sign-in-with"}),O.a.createElement(r["a"],{type:"alipay-circle",className:L.a.icon,theme:"outlined"}),O.a.createElement(r["a"],{type:"taobao-circle",className:L.a.icon,theme:"outlined"}),O.a.createElement(r["a"],{type:"weibo-circle",className:L.a.icon,theme:"outlined"}),O.a.createElement(k.a,{className:L.a.register,to:"/user/register"},O.a.createElement(q["FormattedMessage"],{id:"app.login.signup"})))))}}]),a}(E["Component"]),o=i))||o);a["default"]=Q}}]);