import Vue from 'vue';
import Editor from './editor/index.vue';

import './assets/normalize.css';

if (process.env.NODE_ENV === 'development') {
    new Vue({
        el: '#lightEditor',
        render: h => h(Editor)
    });
}

export default Editor;