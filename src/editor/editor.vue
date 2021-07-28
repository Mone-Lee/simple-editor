<template>
    <div class="simeditor-body">
        <div class="simeditor-placeholder" v-if="isPureHtml">添加内容</div>
        <!-- 使用contenteditable属性实现文本框效果 -->
        <div id="simeditor"
            class="simeditor-content"
            contenteditable="true"
            @input="handleInput"
            @blur="handleBlur"
            @click="handleFocus"
            @keypress="handleKeyPress"
            >
            <p><br></p>
        </div>

        <input type="file" accept="image/*" name="file" id="file" >
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
            pureContent: '',
            isPureHtml: true
        };
    },
    mounted() {
        let uploader = document.getElementById('file');
        uploader.addEventListener('change', this.uploadImage, false);
    },
    methods: {
        handleInput(e) {
            if (!e.target.innerHTML) {
                e.target.innerHTML = '<p><br></p>';
            } else {
                this.pureContent = e.target.innerText;
                this.$emit('input', e.target.innerText);
            }

            this.isPureHtml = e.target.innerHTML === '<p><br></p>';
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
                let currentElement = range.endContainer.parentNode;     // 选中的其实是文本元素，例：<p>hello</p>中的hello, 如果要针对整个节点进行操作，就需要找到parentNode
                setTimeout(() => {
                    let nextEle = currentElement.nextElementSibling;

                    if (nextEle && nextEle.nodeName.toLowerCase() === 'div') {
                        this.replaceNode(nextEle, 'p');
                    }
                }, 10);
            }
        },
        /**
         * 编辑器内容被focus时的处理，判断当前focus元素使用了的工具类型，控制工具栏样式
         */
        handleFocus() {
            let selection = window.getSelection();
            let activeArr = []; // 记录当前选中内容的样式，处理工具栏的active状态
            if (selection.rangeCount) {
                let ele = selection.anchorNode;
                // 当前聚焦元素为元素节点的文本内容： ele为文本元素, ele.nodeType == 3
                // 当前聚焦元素为节点元素，需要循环判断到class="simeditor-content"元素终止
                while (ele && (ele.nodeType === 3 || (ele.nodeType === 1 && ele.nodeName.toLowerCase() !== 'div'))) {
                    let nodeName = '';
                    if (ele.nodeType === 3) {
                        nodeName = ele.parentNode.nodeName.toLowerCase();
                    } else {
                        nodeName = ele.nodeName.toLowerCase();
                    }
                    activeArr.push(nodeName);
                    ele = ele.parentNode;
                }
            }
            this.$emit('handleFocus', activeArr);
        },

        /**
         * 简单比较两个DOM元素是否相等
         * ele1: 比较元素
         * ele2: 比较元素
         * onlyChild: 是否该元素只有一个子元素， 如果只有一个子元素，则简单对比两个元素的文本元素是否相等
         */
        checkTextElementEqual(ele1, ele2, onlyChild=false) {
            let isEqual = true;
            // 判断不等条件： wholeText不相等；previousSibling元素不相等；nextSibling元素不相等
            // 在当前项目中，这里进行比较的元素都是文本元素，所以使用wholeText获取元素内容
            if (onlyChild) {
                // 使用wholeText而不是textContent是因为在对一个元素进行加粗、斜体操作并复原后，该元素的文本元素会被双引号分为多个
                // 例：
                // <p>
                //    "dmskmk"
                //    "smd"
                //    "kasmdka"
                //</p>
                // 使用textContent只能获取其中一个文本元素内容，此时需要使用wholeText
                if (ele1.wholeText !== ele2.wholeText) {
                    isEqual = false;
                }
            } else {
                if (!onlyChild && ele1.wholeText !== ele2.wholeText || (ele1.previousSibling && !ele2.previousSibling) || (!ele1.previousSibling && ele2.previousSibling) || (ele1.previousSibling && ele2.previousSibling && ele1.previousSibling.innerText !== ele1.previousSibling.innerText) || (ele1.nextSibling && !ele2.nextSibling) || (!ele1.nextSibling && ele2.nextSibling) || (ele1.nextSibling && ele2.nextSibling && ele1.nextSibling.innerText !== ele1.nextSibling.innerText)) {
                    isEqual = false;
                }
            }
            return isEqual;
        },

        /**
         * 在进行元素标签替换后，在当前元素的子元素中查找，恢复获得焦点的元素
         * 
         * nodeList: 当前替换标签元素的子元素
         * targetNode: 替换标签前元素中获得焦点的子元素
         */
        findFocusElement(nodeList, targetNode) {
            if (nodeList.length === 1) {
                if (this.checkTextElementEqual(nodeList[0], targetNode, true)) {
                    return nodeList[0];
                }
            } else {
                for (let i=0; i<nodeList.length; i++) {
                    let node = nodeList[i];
                    if (node.childNodes.length === 0) {
                        if (this.checkTextElementEqual(node, targetNode)) {
                            return node;
                        }
                    } else {
                        let target = this.findFocusElement(node.childNodes, targetNode);
                        return target;
                    }
                }
            }
            return null;
        },

        /**
         * 使用新节点替换旧节点
         * 
         * oldEle: element元素，当前选中的想要被替换的元素
         * newNodeName: String，新元素的节点名
         * offset: 光标在当前元素的选中区域的结束位置
         */
        replaceNode(oldEle, newNodeName, targetNode, offset=0) {
            let newEle = document.createElement(newNodeName);
            newEle.innerHTML = oldEle.innerHTML;

            // 将光标定位到新节点上
            let newSelection = window.getSelection();
            let newRange = newSelection.getRangeAt(0);

            let target = this.findFocusElement(newEle.childNodes, targetNode);
            if (target) {
                oldEle.parentNode.insertBefore(newEle, oldEle);
                oldEle.remove();

                newRange.setStart(target, offset);
                newRange.setEnd(target, offset);
                newSelection.addRange(newRange);

                this.handleFocus();
            }
        },

        /**
         * 处理工具栏操作命令，分发操作
         */
        dealWithContent(command) {
            if (command === 'title') {
                this.translateTitleEle();
            } else if (command === 'bold') {
                this.translateBoldEle();
            } else if (command === 'italic') {
                this.translateItalicEle();
            } else if (command === 'upload') {
                this.addImgEle();
            } else if (command === 'hr') {
                this.addHrEle();
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
                let offset = range.endOffset;    // 记录光标所处位置
                let targetNode = range.commonAncestorContainer;
                let currentElement = range.commonAncestorContainer.parentNode;     // range.commonAncestorContainer选中的其实是文本元素，例：<p>hello</p>中的"hello", 如果要针对整个节点进行操作，就需要找到parentNode
                while (currentElement && currentElement.parentNode.nodeName.toLowerCase() !== 'div') {
                    currentElement = currentElement.parentNode;
                }

                // 添加对空内容的处理判断
                if (currentElement.id === 'simeditor' || currentElement.innerHTML === "<br>") {
                    this.handleFocus();
                    return;
                }

                // 使用新节点替换当前节点
                let nodeName = currentElement.nodeName.toLowerCase();
                let nName = nodeName === 'p' ? 'h3' : 'p';
                this.replaceNode(currentElement, nName, targetNode, offset);
            }
        },

        /**
         * 处理工具栏加粗bold操作命令
         */
        translateBoldEle() {
            document.execCommand('bold', false, null);
            this.handleFocus();
        },

        /**
         * 处理工具栏斜体italic操作命令
         */
        translateItalicEle() {
            document.execCommand('italic', false, null);
            this.handleFocus();
        },

        /**
         * 处理工具栏插入图片操作命令
         */
        addImgEle() {
            let uploader = document.getElementById('file');
            uploader.click();
        },

        uploadImage() {
            let uploader = document.getElementById('file');
            let files = uploader.files;

            let image = document.createElement('img');
            image.src = URL.createObjectURL(files[0]);

            let selection = window.getSelection();
            let range = selection.getRangeAt(0);
            range.insertNode(image);
            uploader.value = '';    // 注意上传完需要清空历史数据，否则change事件无法被正常触发
            this.isPureHtml = false;
        },

        /**
         * 处理工具栏分隔线操作命令
         */
        addHrEle() {
            if (window.getSelection().rangeCount) {
                let selection = window.getSelection();
                let range = selection.getRangeAt(0);
                let currentElement = range.commonAncestorContainer;
                if (currentElement.nodeType !== 1) {
                    while (currentElement && currentElement.parentNode.nodeName.toLowerCase() !== 'div') {
                        currentElement = currentElement.parentNode;
                    }
                }

                // 插入hr元素
                let hrEle = document.createElement('hr');
                let parentEle = currentElement.parentNode;
                parentEle.appendChild(hrEle);

                // 在hr元素后添加新行
                let newEle = document.createElement('p');
                let brEle = document.createElement('br');
                newEle.appendChild(brEle);
                parentEle.appendChild(newEle);

                // 将光标定位到新节点上
                range.setStart(newEle, 0);
                range.setEnd(newEle, 0);
                selection.addRange(range);
            }
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

    h3 {
        font-size: 20px;
        font-weight: 500;
        color: #262626;
        line-height: 1;
        margin-bottom: 10px;
    }

    b, strong {
        font-weight: 700;
    }

    hr {
        display: block;
        height: 0px;
        border: 0;
        border-top: 1px solid #ccc;
        margin: 15px 0;
        padding: 0;
    }
}

input[type=file] {
    opacity: 0;
}
</style>