<template>
    <!-- 使用contenteditable属性实现文本框效果 -->
    <div id="simeditor"
        class="simeditor-body"
        placeholder="添加内容"
        contenteditable="true"
        v-html="editContent"
        @input="handleInput"
        >
    </div>
</template>

<script>
export default {
    props: {
        content: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            editContent: '',
        };
    },
    mounted() {
    },
    methods: {
        handleInput(e) {
            console.log(e);
            // this.editContent = '<p>' + e.target.innerText + '</p>';
            // this.$emit('input', e.target.innerText);

            // setTimeout(() => {
            //     if (window.getSelection) { //ie11 10 9 ff safari
            //         e.target.focus(); //解决ff不获取焦点无法定位问题
            //         let range = window.getSelection(); //创建range
            //         range.selectAllChildren(e.target); //range 选择e.target下所有子内容
            //         range.collapseToEnd(); //光标移至最后
            //     } else if (document.selection) { //ie10 9 8 7 6 5
            //         let range = document.selection.createRange(); //创建选择对象
            //         range.moveToElementText(e.target); //range定位到e.target
            //         range.collapse(false); //光标移至最后
            //         range.select();
            //     }
            // }, 5);
            
        }
    }
};
</script>

<style lang="less"> // 注意不要添加scoped属性，否则动态添加的html内容的样式不生效
.simeditor-body {
    &:empty:before {
        content: attr(placeholder);
        font-size: 14px;
        color: #bfbfbf;
        line-height: 24px;
        padding: 6px 4px;
    }

    outline: 0;
    font-size: 14px;
    color: #262626;
    word-wrap: break-word;
    display: block;
    line-height: 24px;
    padding: 6px 8px;
    min-height: 156px;
    box-sizing: border-box;
    user-select: text;
    // -webkit-user-modify: read-write-plaintext-only;
    // -moz-user-modify: read-write-plaintext-only;
}
</style>