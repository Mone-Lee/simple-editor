<template>
    <div class="simeditor-body">
        <div class="simeditor-placeholder" v-if="!pureContent">添加内容</div>
        <!-- 使用contenteditable属性实现文本框效果 -->
        <div id="simeditor"
            class="simeditor-content"
            placeholder="添加内容"
            contenteditable="true"
            v-html="editContent"
            @input="handleInput"
            @blur="handleBlur"
            @click="handleFocus"
            @keypress="handleKeyPress"
            >
        </div>
    </div>
</template>

<script>
export default {
    props: {
        command: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isShowPlaceholder: true,
            pureContent: '',
            editContent: '<p><br></p>',
        };
    },
    mounted() {
    },
    methods: {
        handleInput(e) {
            this.pureContent = e.target.innerText;
            this.$emit('input', e.target.innerText);
        },
        /**
         * 防止点击工具栏后输入框失去光标，先简单粗暴处理
         */
        handleBlur(e) {
            e.target.focus();
        },
        /**
         * 处理回车换行的输入，规范行尾回车后默认生成 <p><br></p> 元素
         */
        handleKeyPress(e) {
            let keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;

            // 回车键，处理换行生成的默认行段元素
            // 在处理过的内容后键入回车键，生成的下一行的新元素是div，为了统一化，替换为默认的p元素
            if (keyCode === 13) {
                let selection = window.getSelection();
                let range = selection.getRangeAt(0);
                let currentElement = range.endContainer.parentElement;     // 选中的其实是文本元素，例：<p>hello</p>中的hello, 如果要针对整个节点进行操作，就需要找到parentElement
                setTimeout(() => {
                    let nextEle = currentElement.nextElementSibling;

                    if (nextEle && nextEle.nodeName.toLowerCase() === 'div') {
                        this.replaceNode(nextEle, 'p');
                    }
                }, 10);
            }
        },
        /**
         * 编辑器内容被focus时的处理，判断当前focus元素使用了的工具
         */
        handleFocus() {
            let selection = window.getSelection();
            let activeArr = []; // 记录当前选中内容的样式，处理工具栏的active状态
            if (selection.rangeCount) {
                let ele = selection.anchorNode;
                // 情况可能性：
                // 1. 当前聚焦元素为元素节点的文本内容： ele为文本元素, ele.nodeType == 3 && ele.parentNode.nodeType == 1
                // 2. 当前聚焦元素为空内容的元素阶段： ele为元素节点，内容为换行符, ele.nodeType == 1 && ele.innerHTML == "<br>"
                while (ele && ((ele.nodeType === 3 && ele.parentNode.nodeType === 1) || (ele.nodeType === 1 && ele.innerHTML === "<br>"))) {
                    let nodeName = '';
                    if (ele.nodeType === 3) {
                        nodeName = ele.parentNode.nodeName.toLowerCase();
                    } else {
                        nodeName = ele.nodeName.toLowerCase();
                    }
                    activeArr.push(nodeName);
                    ele = ele.parentElement;
                }
            }

            this.$emit('handleFocus', activeArr);
        },
        /**
         * 处理工具栏操作命令，分发操作
         */
        dealWithContent(command) {
            if (command === 'title') {
                this.translateTitleEle();
            } else if (command === 'bold') {
                this.translateBoldEle();
            }
        },

        /**
         * 处理工具栏标题heading操作命令, p元素与h3元素相互切换
         */
        translateTitleEle() {
            if (window.getSelection().rangeCount) {
                // 找到当前选中的节点，获取当前节点信息
                let selection = window.getSelection();
                let range = selection.getRangeAt(0);
                let offset = range.startOffset;    // 记录光标所处位置
                let currentElement = range.endContainer.parentElement;     // 选中的其实是文本元素，例：<p>hello</p>中的hello, 如果要针对整个节点进行操作，就需要找到parentElement

                // 添加对空内容的处理判断
                if (currentElement.id === 'simeditor' || currentElement.innerHTML === "<br>") {
                    this.handleFocus();
                    return;
                }

                // 使用新节点替换当前节点
                let nodeName = currentElement.nodeName.toLowerCase();
                let nName = nodeName === 'p' ? 'h3' : 'p';
                this.replaceNode(currentElement, nName, offset);
            }
        },

        /**
         * 处理工具栏加粗bold操作命令
         */
        translateBoldEle() {
            console.log('bold');
        },

        /**
         * 使用新节点替换旧节点
         * 
         * oldEle: element元素，当前选中的想要被替换的元素
         * newNodeName: String，新元素的节点名
         * offset: 光标在当前元素的选中区域的结束位置
         */
        replaceNode(oldEle, newNodeName, offset=0) {
            let newEle = document.createElement(newNodeName);
            newEle.innerHTML = oldEle.innerHTML;
            oldEle.parentNode.insertBefore(newEle, oldEle);
            oldEle.remove();

            // 将光标定位到新节点上
            let newSelection = window.getSelection();
            let newRange = newSelection.getRangeAt(0);
            newRange.setStart(newEle.childNodes[0], offset);
            newRange.setEnd(newEle.childNodes[0], offset);
            newSelection.addRange(newRange);

            this.handleFocus();
        }
    }
};
</script>

<style lang="less"> // 注意不要添加scoped属性，否则动态添加的html内容的样式不生效
.simeditor-body {
    position: relative;
}

.simeditor-placeholder {
    font-size: 14px;
    color: #bfbfbf;
    line-height: 24px;
    padding: 6px 10px;
    position: absolute;
    top: 0;
    left: 0;
}

.simeditor-content {
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