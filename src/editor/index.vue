<template>
    <div class="container">
        <h2 class="title">editor</h2>
        <div class="simeditor">
            <toolbar></toolbar>
            <!-- 使用contenteditable属性实现文本框效果 -->
            <editor v-model="content"></editor>
        </div>
        <span>{{content}}</span>
    </div>
</template>

<script>
import toolbar from './toolbar.vue';
import editor from './editor.vue';
export default {
    name: 'light-editor',
    components: { toolbar, editor },
    data() {
        return {
            content: '',
        };
    },
    mounted() {
    },
    methods: {
    }
};
</script>

<style lang="less"> // 注意不要添加scoped属性，否则动态添加的html内容的样式不生效
.container {
    margin-left: 120px;
    margin-top: 20px;
}
.title {
    margin-bottom: 5px;
}

.simeditor {
    width: 400px;
    min-height: 186px;
    border: 1px solid #e5e5e5;
    border-radius: 3px;
    background: #fff;
    position: relative;
}
</style>