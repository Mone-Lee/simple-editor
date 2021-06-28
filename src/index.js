import Vue from 'vue';
import Editor from './editor/index.vue';

import './assets/css/normalize.css';
import './assets/fonts/iconfont.css';
import './assets/fonts/iconfont.ttf';

if (process.env.NODE_ENV === 'development') {
    new Vue({
        el: '#lightEditor',
        render: h => h(Editor)
    });
}

const lightEditor = {
    Editor,
    install(Vue) {          // 允许使用Vue.use(...), 进行全局引入
        Vue.component('lightEditor', Editor);
    }
};

export default lightEditor;