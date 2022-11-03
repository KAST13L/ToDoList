(this.webpackJsonptodolist=this.webpackJsonptodolist||[]).push([[0],{101:function(t,e,a){t.exports=a(131)},106:function(t,e,a){},108:function(t,e,a){},131:function(t,e,a){"use strict";a.r(e);var r={};a.r(r),a.d(r,"selectIsLoggedIn",(function(){return ht}));var n=a(0),s=a.n(n),o=a(9),i=a.n(o);a(106),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var c,l,u=a(7),d=a.n(u),p=a(14),f=(a(108),a(174)),m=a(175),b=a(176),v=a(133),h=a(170),g=a(177),k=a(178),E=a(16),j=a(81),y=a.n(j).a.create(Object(E.a)({baseURL:"https://social-network.samuraijs.com/api/1.1/"},{withCredentials:!0,headers:{"API-KEY":"1cdd9f77-c60e-4af5-b194-659e4ebd5d41"}})),O=function(){return y.get("todo-lists")},x=function(t){return y.post("todo-lists",{title:t})},C=function(t){return y.delete("todo-lists/".concat(t))},w=function(t,e){return y.put("todo-lists/".concat(t),{title:e})},I=function(t){return y.get("todo-lists/".concat(t,"/tasks"))},T=function(t,e){return y.delete("todo-lists/".concat(t,"/tasks/").concat(e))},S=function(t,e){return y.post("todo-lists/".concat(t,"/tasks"),{title:e})},A=function(t,e,a){return y.put("todo-lists/".concat(t,"/tasks/").concat(e),a)},L=function(t){return y.post("auth/login",t)},z=function(){return y.delete("auth/login")},P=function(){return y.get("auth/me")},F=a(13),D={setAppStatus:Object(F.b)("appActions/setAppStatus"),setAppError:Object(F.b)("appActions/setAppError")},N=function(t,e){var a=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];return a&&e.dispatch(D.setAppError({error:t.messages.length?t.messages[0]:"Some error occurred"})),e.dispatch(D.setAppStatus({status:"failed"})),e.rejectWithValue({errors:t.messages,fieldsErrors:t.fieldsErrors})},W=function(t,e){var a=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];return a&&e.dispatch(D.setAppError({error:t.message?t.message:"Some error occurred"})),e.dispatch(D.setAppStatus({status:"failed"})),e.rejectWithValue({errors:[t.message],fieldsErrors:void 0})},M=D.setAppStatus,R=Object(F.c)("todolists/fetchTodolists",function(){var t=Object(p.a)(d.a.mark((function t(e,a){var r;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a.dispatch(M({status:"loading"})),t.prev=1,t.next=4,O();case 4:return r=t.sent,a.dispatch(M({status:"succeeded"})),t.abrupt("return",{todolists:r.data});case 9:return t.prev=9,t.t0=t.catch(1),t.abrupt("return",W(t.t0,a));case 12:case"end":return t.stop()}}),t,null,[[1,9]])})));return function(e,a){return t.apply(this,arguments)}}()),V=Object(F.c)("todolists/removeTodolist",function(){var t=Object(p.a)(d.a.mark((function t(e,a){var r;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=a.dispatch,a.rejectWithValue,r(M({status:"loading"})),r(J({id:e,status:"loading"})),t.next=5,C(e);case 5:return t.sent,r(M({status:"succeeded"})),t.abrupt("return",{id:e});case 8:case"end":return t.stop()}}),t)})));return function(e,a){return t.apply(this,arguments)}}()),q=Object(F.c)("todolists/addTodolist",function(){var t=Object(p.a)(d.a.mark((function t(e,a){var r;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a.dispatch(M({status:"loading"})),t.prev=1,t.next=4,x(e);case 4:if(0!==(r=t.sent).data.resultCode){t.next=10;break}return a.dispatch(M({status:"succeeded"})),t.abrupt("return",{todolist:r.data.data.item});case 10:return t.abrupt("return",N(r.data,a,!1));case 11:t.next=16;break;case 13:return t.prev=13,t.t0=t.catch(1),t.abrupt("return",W(t.t0,a,!1));case 16:case"end":return t.stop()}}),t,null,[[1,13]])})));return function(e,a){return t.apply(this,arguments)}}()),B=Object(F.c)("todolists/changeTodolistTitle",function(){var t=Object(p.a)(d.a.mark((function t(e,a){var r;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,w(e.id,e.title);case 3:if(0!==(r=t.sent).data.resultCode){t.next=9;break}return a.dispatch(M({status:"succeeded"})),t.abrupt("return",{id:e.id,title:e.title});case 9:return t.abrupt("return",N(r.data,a));case 10:t.next=15;break;case 12:return t.prev=12,t.t0=t.catch(0),t.abrupt("return",W(t.t0,a,!1));case 15:case"end":return t.stop()}}),t,null,[[0,12]])})));return function(e,a){return t.apply(this,arguments)}}()),H={fetchTodolistsTC:R,removeTodolistTC:V,addTodolistTC:q,changeTodolistTitleTC:B},K=Object(F.d)({name:"todolists",initialState:[],reducers:{changeTodolistFilter:function(t,e){var a=t.findIndex((function(t){return t.id===e.payload.id}));t[a].filter=e.payload.filter},changeTodolistEntityStatus:function(t,e){var a=t.findIndex((function(t){return t.id===e.payload.id}));t[a].entityStatus=e.payload.status}},extraReducers:function(t){t.addCase(R.fulfilled,(function(t,e){return e.payload.todolists.map((function(t){return Object(E.a)(Object(E.a)({},t),{},{filter:"all",entityStatus:"idle"})}))})).addCase(V.fulfilled,(function(t,e){var a=t.findIndex((function(t){return t.id===e.payload.id}));a>-1&&t.splice(a,1)})).addCase(q.fulfilled,(function(t,e){t.unshift(Object(E.a)(Object(E.a)({},e.payload.todolist),{},{filter:"all",entityStatus:"idle"}))})).addCase(B.fulfilled,(function(t,e){var a=t.findIndex((function(t){return t.id===e.payload.id}));t[a].title=e.payload.title}))}}),U=K.actions,J=(U.changeTodolistFilter,U.changeTodolistEntityStatus),Y=Object(F.c)("tasks/fetchTasks",function(){var t=Object(p.a)(d.a.mark((function t(e,a){var r,n;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a.dispatch(D.setAppStatus({status:"loading"})),t.prev=1,t.next=4,I(e);case 4:return r=t.sent,n=r.data.items,a.dispatch(D.setAppStatus({status:"succeeded"})),t.abrupt("return",{tasks:n,todolistId:e});case 10:return t.prev=10,t.t0=t.catch(1),t.abrupt("return",W(t.t0,a));case 13:case"end":return t.stop()}}),t,null,[[1,10]])})));return function(e,a){return t.apply(this,arguments)}}()),$=Object(F.c)("tasks/removeTask",function(){var t=Object(p.a)(d.a.mark((function t(e,a){return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,T(e.todolistId,e.taskId);case 2:return t.sent,t.abrupt("return",{taskId:e.taskId,todolistId:e.todolistId});case 4:case"end":return t.stop()}}),t)})));return function(e,a){return t.apply(this,arguments)}}()),_=Object(F.c)("tasks/addTask",function(){var t=Object(p.a)(d.a.mark((function t(e,a){var r;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a.dispatch(D.setAppStatus({status:"loading"})),t.prev=1,t.next=4,S(e.todolistId,e.title);case 4:if(0!==(r=t.sent).data.resultCode){t.next=10;break}return a.dispatch(D.setAppStatus({status:"succeeded"})),t.abrupt("return",r.data.data.item);case 10:return N(r.data,a,!1),t.abrupt("return",a.rejectWithValue({errors:r.data.messages,fieldsErrors:r.data.fieldsErrors}));case 12:t.next=17;break;case 14:return t.prev=14,t.t0=t.catch(1),t.abrupt("return",W(t.t0,a,!1));case 17:case"end":return t.stop()}}),t,null,[[1,14]])})));return function(e,a){return t.apply(this,arguments)}}()),G=Object(F.c)("tasks/updateTask",function(){var t=Object(p.a)(d.a.mark((function t(e,a){var r,n,s,o;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(r=a.getState(),n=r.tasks[e.todolistId].find((function(t){return t.id===e.taskId}))){t.next=4;break}return t.abrupt("return",a.rejectWithValue("task not found in the state"));case 4:return s=Object(E.a)({deadline:n.deadline,description:n.description,priority:n.priority,startDate:n.startDate,title:n.title,status:n.status},e.model),t.next=7,A(e.todolistId,e.taskId,s);case 7:if(o=t.sent,t.prev=8,0!==o.data.resultCode){t.next=13;break}return t.abrupt("return",e);case 13:return t.abrupt("return",N(o.data,a));case 14:t.next=19;break;case 16:return t.prev=16,t.t0=t.catch(8),t.abrupt("return",W(t.t0,a));case 19:case"end":return t.stop()}}),t,null,[[8,16]])})));return function(e,a){return t.apply(this,arguments)}}()),Q={fetchTasks:Y,removeTask:$,addTask:_,updateTask:G},X=Object(F.d)({name:"tasks",initialState:{},reducers:{},extraReducers:function(t){t.addCase(H.addTodolistTC.fulfilled,(function(t,e){t[e.payload.todolist.id]=[]})).addCase(H.removeTodolistTC.fulfilled,(function(t,e){delete t[e.payload.id]})).addCase(H.fetchTodolistsTC.fulfilled,(function(t,e){e.payload.todolists.forEach((function(e){t[e.id]=[]}))})).addCase(Y.fulfilled,(function(t,e){t[e.payload.todolistId]=e.payload.tasks})).addCase($.fulfilled,(function(t,e){var a=t[e.payload.todolistId],r=a.findIndex((function(t){return t.id===e.payload.taskId}));r>-1&&a.splice(r,1)})).addCase(_.fulfilled,(function(t,e){t[e.payload.todoListId].unshift(e.payload)})).addCase(G.fulfilled,(function(t,e){var a=t[e.payload.todolistId],r=a.findIndex((function(t){return t.id===e.payload.taskId}));r>-1&&(a[r]=Object(E.a)(Object(E.a)({},a[r]),e.payload.model))}))}}),Z=a(22),tt=a(171),et=a(132),at=a(89),rt=a(46),nt=a(179),st=a(167),ot=a(168),it=s.a.memo((function(t){var e=t.addItem,a=t.disabled,r=void 0!==a&&a,o=Object(n.useState)(""),i=Object(rt.a)(o,2),c=i[0],l=i[1],u=Object(n.useState)(null),f=Object(rt.a)(u,2),m=f[0],b=f[1],v=function(){var t=Object(p.a)(d.a.mark((function t(){return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:""!==c.trim()?e(c,{setError:b,setTitle:l}):b("Title is required");case 1:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return s.a.createElement("div",null,s.a.createElement(nt.a,{variant:"outlined",disabled:r,error:!!m,value:c,onChange:function(t){l(t.currentTarget.value)},onKeyPress:function(t){null!==m&&b(null),13===t.charCode&&v()},label:"Title"}),s.a.createElement(st.a,{color:"primary",onClick:v,disabled:r,style:{marginLeft:"5px"}},s.a.createElement(ot.a,null)),s.a.createElement("div",{style:{height:"1px",fontSize:"13px",color:"red",padding:"0 0 10px 10px"}},m))})),ct=s.a.memo((function(t){console.log("EditableSpan called");var e=Object(n.useState)(!1),a=Object(rt.a)(e,2),r=a[0],o=a[1],i=Object(n.useState)(t.value),c=Object(rt.a)(i,2),l=c[0],u=c[1],d=function(){o(!1),t.onChange(l)};return r?s.a.createElement(nt.a,{value:l,onChange:function(t){u(t.currentTarget.value)},onKeyPress:function(t){13===t.charCode&&d()},autoFocus:!0,onBlur:d}):s.a.createElement("span",{onDoubleClick:function(){o(!0),u(t.value)}},t.value)})),lt=a(169),ut=a(181);!function(t){t[t.New=0]="New",t[t.InProgress=1]="InProgress",t[t.Completed=2]="Completed",t[t.Draft=3]="Draft"}(c||(c={})),function(t){t[t.Low=0]="Low",t[t.Middle=1]="Middle",t[t.Hi=2]="Hi",t[t.Urgently=3]="Urgently",t[t.Later=4]="Later"}(l||(l={}));var dt=a(23),pt=function(){return Object(Z.b)()};function ft(t){var e=pt();return Object(n.useMemo)((function(){return Object(dt.b)(t,e)}),[])}var mt=s.a.memo((function(t){var e=ft(Et),a=e.updateTask,r=e.removeTask,o=Object(n.useCallback)((function(){return r({taskId:t.task.id,todolistId:t.todolistId})}),[t.task.id,t.todolistId]),i=Object(n.useCallback)((function(e){a({taskId:t.task.id,model:{status:e.currentTarget.checked?c.Completed:c.New},todolistId:t.todolistId})}),[t.task.id,t.todolistId]),l=Object(n.useCallback)((function(e){a({taskId:t.task.id,model:{title:e},todolistId:t.todolistId})}),[t.task.id,t.todolistId]);return s.a.createElement("div",{key:t.task.id,className:t.task.status===c.Completed?"is-done":"",style:{position:"relative"}},s.a.createElement(ut.a,{checked:t.task.status===c.Completed,color:"primary",onChange:i}),s.a.createElement(ct,{value:t.task.title,onChange:l}),s.a.createElement(st.a,{size:"small",onClick:o,style:{position:"absolute",top:"2px",right:"2px"}},s.a.createElement(lt.a,{fontSize:"small"})))})),bt=s.a.memo((function(t){var e=t.demo,a=void 0!==e&&e,r=Object(at.a)(t,["demo"]),o=ft(Et).fetchTasks,i=ft(kt),l=i.changeTodolistFilter,u=i.removeTodolistTC,f=i.changeTodolistTitleTC,m=pt();Object(n.useEffect)((function(){a||o(r.todolist.id)}),[]);var b=Object(n.useCallback)(function(){var t=Object(p.a)(d.a.mark((function t(e,a){var n,s,o,i,c,l;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=Et.addTask({title:e,todolistId:r.todolist.id}),t.next=3,m(n);case 3:s=t.sent,Et.addTask.rejected.match(s)?(null===(o=s.payload)||void 0===o||null===(i=o.errors)||void 0===i?void 0:i.length)?(l=null===(c=s.payload)||void 0===c?void 0:c.errors[0],a.setError(l)):a.setError("Some error occured"):a.setTitle("");case 5:case"end":return t.stop()}}),t)})));return function(e,a){return t.apply(this,arguments)}}(),[r.todolist.id]),v=Object(n.useCallback)((function(t){f({id:r.todolist.id,title:t})}),[r.todolist.id]),g=Object(n.useCallback)((function(t){return l({filter:t,id:r.todolist.id})}),[r.todolist.id]),k=r.tasks;"active"===r.todolist.filter&&(k=r.tasks.filter((function(t){return t.status===c.New}))),"completed"===r.todolist.filter&&(k=r.tasks.filter((function(t){return t.status===c.Completed})));var E=function(t,e,a){return s.a.createElement(h.a,{variant:r.todolist.filter===t?"outlined":"text",onClick:function(){return g(t)},color:e},a)};return s.a.createElement(et.a,{style:{padding:"10px",position:"relative"}},s.a.createElement(st.a,{size:"small",onClick:function(){u(r.todolist.id)},disabled:"loading"===r.todolist.entityStatus,style:{position:"absolute",right:"5px",top:"5px"}},s.a.createElement(lt.a,{fontSize:"small"})),s.a.createElement("h3",null,s.a.createElement(ct,{value:r.todolist.title,onChange:v})),s.a.createElement(it,{addItem:b,disabled:"loading"===r.todolist.entityStatus}),s.a.createElement("div",null,k.map((function(t){return s.a.createElement(mt,{key:t.id,task:t,todolistId:r.todolist.id})})),!k.length&&s.a.createElement("div",{style:{padding:"10px",color:"grey"}},"No task")),s.a.createElement("div",{style:{paddingTop:"10px"}},E("all","default","All"),E("active","primary","Active"),E("completed","secondary","Completed")))})),vt=a(17),ht=function(t){return t.auth.isLoggedIn},gt=function(t){var e=t.demo,a=void 0!==e&&e,r=Object(Z.c)((function(t){return t.todolists})),o=Object(Z.c)((function(t){return t.tasks})),i=Object(Z.c)(ht),c=ft(kt).fetchTodolistsTC;return Object(n.useEffect)((function(){!a&&i&&c()}),[]),i?s.a.createElement(s.a.Fragment,null,s.a.createElement(tt.a,{container:!0,spacing:7},r.map((function(t){var e=o[t.id];return s.a.createElement(tt.a,{item:!0,key:t.id},s.a.createElement("div",{style:{width:"350px"}},s.a.createElement(et.a,{elevation:9},s.a.createElement(bt,{todolist:t,tasks:e,demo:a}))))})))):s.a.createElement(vt.a,{to:"/login"})},kt=Object(E.a)(Object(E.a)({},H),K.actions),Et=Object(E.a)(Object(E.a)({},Q),X.actions),jt=K.reducer,yt=X.reducer,Ot=a(183),xt=a(180);function Ct(t){return s.a.createElement(xt.a,Object.assign({elevation:6,variant:"filled"},t))}function wt(){var t=Object(Z.c)((function(t){return t.app.error})),e=ft(D).setAppError,a=function(t,a){"clickaway"!==a&&e({error:null})},r=null!==t;return s.a.createElement(Ot.a,{open:r,autoHideDuration:6e3,onClose:a},s.a.createElement(Ct,{onClose:a,severity:"error"},t))}var It=function(t){return t.app.status},Tt=function(t){return t.app.isInitialized},St=a(184),At=a(166),Lt=a(172),zt=a(173),Pt=a(88),Ft=D.setAppStatus,Dt=Object(F.c)("auth/login",function(){var t=Object(p.a)(d.a.mark((function t(e,a){var r;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a.dispatch(Ft({status:"loading"})),t.prev=1,t.next=4,L(e);case 4:if(0!==(r=t.sent).data.resultCode){t.next=10;break}return a.dispatch(Ft({status:"succeeded"})),t.abrupt("return");case 10:return t.abrupt("return",N(r.data,a));case 11:t.next=16;break;case 13:return t.prev=13,t.t0=t.catch(1),t.abrupt("return",W(t.t0,a));case 16:case"end":return t.stop()}}),t,null,[[1,13]])})));return function(e,a){return t.apply(this,arguments)}}()),Nt=Object(F.c)("auth/logout",function(){var t=Object(p.a)(d.a.mark((function t(e,a){var r;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a.dispatch(Ft({status:"loading"})),t.prev=1,t.next=4,z();case 4:if(0!==(r=t.sent).data.resultCode){t.next=10;break}return a.dispatch(Ft({status:"succeeded"})),t.abrupt("return");case 10:return t.abrupt("return",N(r.data,a));case 11:t.next=16;break;case 13:return t.prev=13,t.t0=t.catch(1),t.abrupt("return",W(t.t0,a));case 16:case"end":return t.stop()}}),t,null,[[1,13]])})));return function(e,a){return t.apply(this,arguments)}}()),Wt={login:Dt,logout:Nt},Mt=Object(F.d)({name:"auth",initialState:{isLoggedIn:!1},reducers:{setIsLoggedIn:function(t,e){t.isLoggedIn=e.payload.value}},extraReducers:function(t){t.addCase(Dt.fulfilled,(function(t){t.isLoggedIn=!0})).addCase(Nt.fulfilled,(function(t){t.isLoggedIn=!1}))}}),Rt=(Mt.reducer,Mt.actions.setIsLoggedIn,function(){var t=pt(),e=Object(Z.c)(ht),a=Object(Pt.a)({validate:function(t){return t.email?t.password?void 0:{password:"Password is required"}:{email:"Email is required"}},initialValues:{email:"",password:"",rememberMe:!1},onSubmit:function(){var e=Object(p.a)(d.a.mark((function e(a,r){var n,s,o,i,c;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t(Vt.login(a));case 2:n=e.sent,Dt.rejected.match(n)&&(null===(s=n.payload)||void 0===s||null===(o=s.fieldsErrors)||void 0===o?void 0:o.length)&&(c=null===(i=n.payload)||void 0===i?void 0:i.fieldsErrors[0],r.setFieldError(c.field,c.error));case 4:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}()});return e?s.a.createElement(vt.a,{to:"/"}):s.a.createElement(tt.a,{container:!0,justify:"center"},s.a.createElement(tt.a,{item:!0,xs:4},s.a.createElement("form",{onSubmit:a.handleSubmit},s.a.createElement(St.a,null,s.a.createElement(At.a,null,s.a.createElement("p",null,"To log in get registered ",s.a.createElement("a",{href:"https://social-network.samuraijs.com/",target:"_blank"},"here")),s.a.createElement("p",null,"or use common test account credentials:"),s.a.createElement("p",null," Email: free@samuraijs.com"),s.a.createElement("p",null,"Password: free")),s.a.createElement(Lt.a,null,s.a.createElement(nt.a,Object.assign({label:"Email",margin:"normal"},a.getFieldProps("email"))),a.errors.email?s.a.createElement("div",null,a.errors.email):null,s.a.createElement(nt.a,Object.assign({type:"password",label:"Password",margin:"normal"},a.getFieldProps("password"))),a.errors.password?s.a.createElement("div",null,a.errors.password):null,s.a.createElement(zt.a,{label:"Remember me",control:s.a.createElement(ut.a,Object.assign({},a.getFieldProps("rememberMe"),{checked:a.values.rememberMe}))}),s.a.createElement(h.a,{type:"submit",variant:"contained",color:"primary"},"Login"))))))}),Vt=Object(E.a)(Object(E.a)({},Wt),Mt.actions),qt=Mt.reducer,Bt=Object(F.c)("application/initializeApp",function(){var t=Object(p.a)(d.a.mark((function t(e,a){var r;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=a.dispatch,t.next=3,P();case 3:0===t.sent.data.resultCode&&r(Vt.setIsLoggedIn({value:!0}));case 5:case"end":return t.stop()}}),t)})));return function(e,a){return t.apply(this,arguments)}}()),Ht={initializeApp:Bt},Kt=Object(F.d)({name:"app",initialState:{status:"idle",error:null,isInitialized:!1},reducers:{},extraReducers:function(t){t.addCase(Bt.fulfilled,(function(t,e){t.isInitialized=!0})).addCase(D.setAppStatus,(function(t,e){t.status=e.payload.status})).addCase(D.setAppError,(function(t,e){t.error=e.payload.error}))}}),Ut=Kt.reducer,Jt=Kt.actions,Yt=Object(E.a)(Object(E.a)({},Jt),Ht);var $t=function(t){var e=t.demo,a=void 0!==e&&e,o=Object(Z.c)(It),i=Object(Z.c)(Tt),c=Object(Z.c)(r.selectIsLoggedIn),l=pt(),u=ft(Vt).logout,E=ft(Yt).initializeApp;Object(n.useEffect)((function(){a||E()}),[]);var j=Object(n.useCallback)((function(){u()}),[]),y=Object(n.useCallback)(function(){var t=Object(p.a)(d.a.mark((function t(e,a){var r,n,s,o,i,c;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=kt.addTodolistTC(e),t.next=3,l(r);case 3:n=t.sent,kt.addTodolistTC.rejected.match(n)?(null===(s=n.payload)||void 0===s||null===(o=s.errors)||void 0===o?void 0:o.length)?(c=null===(i=n.payload)||void 0===i?void 0:i.errors[0],a.setError(c)):a.setError("Some error occurred"):a.setTitle("");case 5:case"end":return t.stop()}}),t)})));return function(e,a){return t.apply(this,arguments)}}(),[]);return i?s.a.createElement("div",{className:"App"},s.a.createElement(wt,null),s.a.createElement(m.a,{position:"static",color:"transparent"},s.a.createElement(b.a,{style:{display:"flex",justifyContent:"space-between"}},s.a.createElement("div",{style:{display:"flex",flexDirection:"row",width:"750px",justifyContent:"space-between",padding:"10px"}},s.a.createElement(v.a,{variant:"h3"},"TODO LIST"),c&&s.a.createElement(it,{addItem:y})),c&&s.a.createElement(h.a,{variant:"contained",color:"secondary",onClick:j},"Log out")),s.a.createElement("div",{style:{height:"1px"}},"loading"===o&&s.a.createElement(g.a,null))),s.a.createElement(k.a,{fixed:!0,style:{paddingTop:"25px"}},s.a.createElement(vt.b,{exact:!0,path:"/",render:function(){return s.a.createElement(gt,{demo:a})}}),s.a.createElement(vt.b,{path:"/login",render:function(){return s.a.createElement(Rt,null)}}))):s.a.createElement("div",{style:{position:"fixed",top:"30%",textAlign:"center",width:"100%"}},s.a.createElement(f.a,null))},_t=a(49),Gt=Object(dt.c)({app:Ut,auth:qt,todolists:jt,tasks:yt}),Qt=Object(F.a)({reducer:Gt,middleware:function(t){return t().prepend(_t.a)}});window.store=Qt;var Xt=a(48);i.a.render(s.a.createElement(Z.a,{store:Qt},s.a.createElement(Xt.a,null,s.a.createElement($t,null))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))}},[[101,1,2]]]);
//# sourceMappingURL=main.cb63e684.chunk.js.map