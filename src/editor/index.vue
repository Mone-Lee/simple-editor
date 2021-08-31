<template>
    <div class="container">
        <div class="simeditor">
            <toolbar ref="toolbar" unselectable="on" @setTextStyle="handleSetTextStyle" :activeList="activeList"></toolbar>
            <!-- 使用contenteditable属性实现文本框效果 -->
            <editor ref="editor" v-model="content" @handleFocus="handleEditorFocus"></editor>
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
            activeList: [],     // 工具栏活跃样式
            content: ''
        };
    },
    mounted() {
        document.addEventListener('click', this.handleClick, false);
    },
    methods: {
        handleSetTextStyle(e) {
            this.$refs.editor.dealWithCommand(e);
        },

        handleEditorFocus(e) {
            this.activeList = e;
        },

        // 判断是否点击了表格设置弹框以外的内容，如果是，则隐藏表格设置弹框，然后判断是否点击的是编辑区域，如果是，则判断点击内容，恢复工具栏激活状态
        handleClick(e) {
            let toolbarTable = document.getElementById('toolbar-table');
            if (!this.hasChild(toolbarTable, e.target)) {
                if (this.$refs.toolbar.tools[8].isClick) {
                    this.$refs.toolbar.hideTableMenu();

                    let simeditorBody = document.getElementById('simeditor-body');
                    if (this.hasChild(simeditorBody, e.target)) {
                        this.$refs.editor.handleFocus();
                    }
                }
            }
        },

        hasChild(parent, child) {
            let parentNode = null;
            if (parent && child) {
                parentNode = child.parentNode;

                while (parentNode) {
                    if (parent === parentNode) {
                        return true;
                    }

                    parentNode = parentNode.parentNode;
                }
            }

            return false;
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