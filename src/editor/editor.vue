<template>
    <!-- 使用contenteditable属性实现文本框效果 -->
    <div id="simeditor"
        class="simeditor-body"
        placeholder="添加内容"
        contenteditable="true"
        v-html="editContent"
        @input="handleInput"
        @blur="handleBlur"
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
        command: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            editContent: '<p><br></p>',
        };
    },
    mounted() {
    },
    methods: {
        handleInput(e) {
            this.$emit('input', e.target.innerText);

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
            
        },
        handleBlur(e) {
            // 防止点击工具栏后输入框失去光标，先简单粗暴处理
            e.target.focus();
        },
        // 处理工具栏命令
        dealWithContent(command) {
            if (command === 'title') {
                let range = window.getSelection().getRangeAt(0);
                console.log(range);
                let currentElement = range.endContainer.parentElement;
                let headingEle = document.createElement('h3');
                headingEle.innerHTML = currentElement.innerHTML;
                currentElement.parentNode.insertBefore(headingEle, currentElement);
                currentElement.remove();
            }
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

    p {
        color: #262626;
        margin: 0;
        word-wrap: break-word;
        font-size: 14px;
        font-weight: 300;
    }
}
</style>