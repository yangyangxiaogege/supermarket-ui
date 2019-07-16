/*
 * 路由管理模块
 */

// 导入路由模块
import VueRouter from 'vue-router';

// 测试组件
import test from './components/start/test.vue';
// 导入start模块组件
import login from './components/start/login.vue';
import home from  './components/start/home.vue';
import welcome from './components/start/welcome.vue';
// 导入shop模块组件
import shopInfo from './components/shop/shopInfo.vue';
import shopList from './components/shop/shopList.vue';
import shopType from './components/shop/shopType.vue';
import empMgr from './components/shop/empMgr.vue';


const router = new VueRouter({
  //  mode:'history',
    // 匹配规则
    routes:[
        {path:'/',redirect:'/login'},
        {
            path:'/login',
            component:login,
            meta:{
                // 表示不被拦截验证
                noAuth:true
            }
        },
        {
            path:'/home',
            component:home,
            name:'home',
            children:[
               {path:'test',component:test,name:'test'},
                {path:'welcome',component:welcome,name:'welcome'},
                {path:'shopInfo',component:shopInfo,name:'shopInfo'},
                {path:'shopList',component:shopList,name:'shopList'},
                {path:'shopType',component:shopType,name:'shopType'},
                {path:'empMgr',component:empMgr,name:'empMgr'},
            ]
        },
    ]
});

// 路由验证
// router.beforeEach((to,from,next) => {
//     // 判断是否需要进行拦截验证
//     if (to.meta.noAuth == true){
//         // 不需要进行拦截
//         next();
//     }else{
//         // 验证有没有进行登陆
//         if (sessionStorage.getItem('userCode') == null) {
//             // 需要先进性登陆
//             alert('请先进行登陆');
//             next({
//                 path:'/login'
//             })
//         }else{
//             next();
//         }
//     }
// });

export default router;