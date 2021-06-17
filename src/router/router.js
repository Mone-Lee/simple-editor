import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const router = new Router({
    mode: 'history', //去除url中的#号
    routes: [
        {
            path: '/',
            component: r => require.ensure([], () => r(require('../pages/index.vue')), 'index'),
            meta: {
                title: 'index'
            }
        },
    ]
});

router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
      document.title = to.meta.title;
    }
    next();
});
  
export default router;