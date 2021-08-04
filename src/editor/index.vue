<template>
    <div class="container">
        <h2 class="title">editor</h2>
        <div class="simeditor">
            <toolbar unselectable="on" @setTextStyle="handleSetTextStyle" :activeList="activeList"></toolbar>
            <!-- 使用contenteditable属性实现文本框效果 -->
            <editor ref="editor" v-model="content" :command="command" @handleFocus="handleEditorFocus"></editor>
        </div>
        <div class="simeditor-content show-box" v-html="content"></div>
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
            command: '',    // 样式调整命令
            activeList: [],     // 工具栏活跃样式
            content: ''
        };
    },
    mounted() {
    },
    methods: {
        handleSetTextStyle(e) {
            this.command = e;
            this.$refs.editor.dealWithContent(this.command);
        },

        handleEditorFocus(e) {
            this.activeList = e;
        }
    },

    watch: {
        content(val) {
            if (!val.trim()) {
                this.activeList = [];
            }
        }
    }
};
</script>

<style lang="less"> // 注意不要添加scoped属性，否则动态添加的html内容的样式不生效
@import url('../assets/css/style.less');
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

.show-box {
    width: 400px;
    min-height: 186px;
    border: 1px solid #e5e5e5;
    border-radius: 3px;
    background: #fff;
    margin-top: 20px;
}
</style>