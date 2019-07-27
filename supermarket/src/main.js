// 导入vue模块
import Vue from 'vue';
// 导入路由模块
import VueRouter from 'vue-router';
// 注册路由
Vue.use(VueRouter);
// 导入路由匹配模块
import router from './router.js';
// 导入axios模块
import axios from 'axios';
axios.defaults.baseURL = 'http://192.168.16.104:8080/'; //龙溪
//axios.defaults.baseURL = 'http://192.167.9.126:8080/'; // 晓港
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.prototype.$http = axios;
// 导入vuex
import Vuex from 'vuex'
Vue.use(Vuex)
// 导入element-ui组件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
// 引入bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.min.js';
// 导入app组件
import app from './app.vue';

// 创建一个sotre进行公共数据管理
var store = new Vuex.Store({
    state:{
        baseUrl:'http://192.168.16.104:8080/'
    },
    mutations:{

    },
    getters:{

    }
});
// 创建Vue实例
const vue = new Vue({
    el:'#app',
    // 渲染组件
    render:c => c(app),
    // 挂载路由
    router,
    // 挂载store
    store
})