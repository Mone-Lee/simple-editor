import vue from 'vue';
import Editor from './editor/index.vue';

new vue({
    el: '#lightEditor',
    render: h => h(Editor)
});

Editor.install = Vue => {
    if (!Vue) {
        window.Vue = vue;
    }
    Vue.component(Editor.name, Editor);
};
export default Editor;