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
                this.translateTitleEle();
            }
        },

        // p标签与heading标签转换
        translateTitleEle() {
            if (window.getSelection().rangeCount) {
                // 找到当前选中的节点，获取当前节点信息
                let selection = window.getSelection();
                let range = selection.getRangeAt(0);
                let offset = range.startOffset;    // 记录光标所处位置
                let currentElement = range.endContainer.parentElement;     // 选中的其实是文本元素，例：<p>hello</p>中的hello, 如果要针对整个节点进行操作，就需要找到parentElement

                // 使用新节点替换当前节点
                let nodeName = currentElement.nodeName.toLowerCase();
                let newEle = nodeName === 'p' ? document.createElement('h3') : document.createElement('p');
                newEle.innerHTML = currentElement.innerHTML;
                currentElement.parentNode.insertBefore(newEle, currentElement);
                currentElement.remove();

                // 将光标定位到新节点上
                let newSelection = window.getSelection();
                let newRange = newSelection.getRangeAt(0);
                newRange.setStart(newEle.childNodes[0], offset);
                newRange.setEnd(newEle.childNodes[0], offset);
                newSelection.addRange(newRange);
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