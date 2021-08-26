<template>
    <div class="simeditor-wrap">
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

        <div class="link-popover"
            v-show="isShowLinkPopover"
            :style="{left: linkPopoverInfo.x + 'px', top: linkPopoverInfo.y + 'px'}">
            <header class="popover-header">
                <h3 class="popover-title">添加链接</h3>
                <div class="iconfont icon-close" @click="isShowLinkPopover=false"></div>
            </header>
            <div class="popover-content">
                <div class="item">
                    <input class="link-text form-control" :placeholder="linkPopoverInfo.text" type="text" v-model="linkPopoverInfo.text">
                </div>
                <div class="item">
                    <textarea class="link-url form-control" placeholder="链接地址" v-model="linkPopoverInfo.url"></textarea>
                </div>
                <div class="item">
                    <button type="submit" class="btn btn-primary" :class="{'disabled': !linkPopoverInfo.url}" @click="updateLink">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pureContent: '',
            isPureHtml: true,
            isShowLinkPopover: false,
            editLinkElement: null,
            linkPopoverInfo: {
                x: 0,
                y: 0,
                text: '链接文字',
                url: ''
            }
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
                this.$emit('input', e.target.innerHTML);
            }

            this.isPureHtml = e.target.innerHTML === '<p><br></p>';
        },

        /**
         * 防止点击工具栏后输入框失去光标，先简单粗暴处理
         */
        handleBlur() {
            // e.target.focus();
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
                // 选中的其实是文本元素，例：<p>hello</p>中的hello, 如果要针对整个节点进行操作，就需要找到parentNode
                // 如果是在有序列表（无序列表）的通过回车结束列表的情况下，range.endContainer选中的则是li元素
                let currentElement = range.endContainer.parentNode;
                setTimeout(() => {
                    let nextEle = currentElement.nextElementSibling;

                    if (nextEle && nextEle.nodeName.toLowerCase() === 'div') {
                        nextEle.innerHTML = '<br>';
                        this.replaceNode(nextEle, 'p');
                    }

                    this.handleFocus();
                }, 10);
            }
        },

        /**
         * 编辑器内容被focus时的处理，判断当前focus元素使用了的工具类型，控制工具栏样式
         */
        handleFocus(e) {
            // 如果选中的是链接节点，则弹出链接设置弹框
            if (e && e.target.nodeName.toLowerCase() === 'a') {
                let ele = e.target;
                this.editLinkElement = e.target;
                this.showLinkPopover(ele.offsetLeft, ele.offsetTop + ele.offsetHeight, ele.innerHTML, ele.getAttribute('href'));
            }

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
                        if (target) {
                            return target;
                        }
                    }
                }
            }
            return null;
        },

        /**
         * 使用新节点替换旧节点
         * 
         * oldElement: element元素，当前选中的想要被替换的元素
         * newNodeName: String，新元素的节点名
         * targetNode: oldEle中光标定位的子元素，用于比照，恢复光标在新元素中的确切位置  例如<p>AA<b>BB</b>CC</p>, 加入光标定位在BB文本元素中，则此时targetNode为<b>BB</b>，而oldElement为<p>AA<b>BB</b>CC</p>
         * offset: 光标在当前元素的选中区域的结束位置
         */
        replaceNode(oldElement, newNodeName, targetNode, offset=0) {
            let newEle = document.createElement(newNodeName);
            newEle.innerHTML = oldElement.innerHTML;
            oldElement.parentNode.insertBefore(newEle, oldElement);
            oldElement.remove();

            let target = null;
            if (targetNode) {
                target = this.findFocusElement(newEle.childNodes, targetNode);

                if (!target) {
                    console.log('找不到光标位置');
                    return;
                }

                // 将光标定位到新节点上
                let editor = document.getElementById('simeditor');
                editor.focus();
                // 将光标定位到新节点上
                this.focusOnElement(target, offset);
                this.handleFocus();
                this.updateContent();
            }
        },

        /**
         * 处理工具栏操作命令，分发操作
         */
        dealWithCommand(command) {
            if (command.type === 'title') {
                this.translateTitleEle();
            } else if (command.type === 'bold') {
                this.translateBoldEle();
            } else if (command.type === 'italic') {
                this.translateItalicEle();
            } else if (command.type === 'upload') {
                this.addImgEle();
            } else if (command.type === 'link') {
                this.addLinkEle();
            } else if (command.type === 'ol') {
                this.translateListEle('ol');
            } else if (command.type === 'ul') {
                this.translateListEle('ul');
            } else if (command.type === 'hr') {
                this.addHrEle();
            } else if (command.type === 'table') {
                this.addTableEle(command.tablePoint);
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
            if (!window.getSelection().rangeCount) {
                this.focusOnEnd();
            }

            let uploader = document.getElementById('file');
            uploader.click();
        },

        uploadImage() {
            let uploader = document.getElementById('file');
            let files = uploader.files;

            let image = document.createElement('img');
            image.src = URL.createObjectURL(files[0]);

            let editor = document.getElementById('simeditor');
            editor.focus();
            let selection = window.getSelection();
            let range = selection.getRangeAt(0);
            range.insertNode(image);
            range.setStartAfter(image);
            range.setEndAfter(image);
            uploader.value = '';    // 注意上传完需要清空历史数据，否则change事件无法被正常触发
            this.isPureHtml = false;
            this.updateContent();
        },

        /**
         * 处理工具栏插入链接操作命令
         */
        addLinkEle() {
            if (!window.getSelection().rangeCount) {
                this.focusOnEnd();
            }

            let link = document.createElement('a');
            link.innerHTML = '链接文字';
            link.target = '_blank';
            link.className = 'selected';
            link.href = '';

            let selection = window.getSelection();
            let range = selection.getRangeAt(0);
            range.insertNode(link);
            range.selectNode(link);
            this.isPureHtml = false;
            this.updateContent();
            link.click();
        },

        /**
         * 处理工具栏插入列表操作命令
         */
        translateListEle(type) {
            if (!window.getSelection().rangeCount) {
                this.focusOnEnd();
            }

            let selection = window.getSelection();
            let range = selection.getRangeAt(0);
            let targetNode = range.commonAncestorContainer.parentNode;

            while (targetNode && targetNode.parentNode.nodeName.toLowerCase() !== 'div') {
                targetNode = targetNode.parentNode;
            }

            let parentEle = targetNode.parentNode;
            // 替换当前元素为ol元素
            if (targetNode.nodeName.toLowerCase() === 'p' || targetNode.nodeName.toLowerCase() === 'h3') {
                let listEle = document.createElement(type);
                parentEle.insertBefore(listEle, targetNode);

                // 在ol元素中插入li元素，li元素内容为旧行元素内容
                this.addListItem(listEle, targetNode, range);
                targetNode.remove();

            } else if (targetNode.nodeName.toLowerCase() === 'ol' || targetNode.nodeName.toLowerCase() === 'ul') {
                let childNodes = targetNode.childNodes;
                let fragment = document.createDocumentFragment();

                // 将ol、ul元素的子元素转换为p元素, 并恢复光标位置
                let target = null;
                let offset = range.endOffset;
                for (let i=0; i<childNodes.length; i++) {
                    let newElement = document.createElement('p');
                    newElement.innerHTML = childNodes[i].innerHTML;
                    fragment.appendChild(newElement);

                    let focusNode = range.commonAncestorContainer;
                    if (focusNode) {
                        target = this.findFocusElement(newElement.childNodes, focusNode);

                        if (!target) {
                            console.log('找不到光标位置');
                        }
                    }
                }

                parentEle.insertBefore(fragment, targetNode);
                targetNode.remove();

                // 将光标定位到新节点上
                let editor = document.getElementById('simeditor');
                editor.focus();
                if (target) {
                    this.focusOnElement(target, offset);
                }
            }

            this.isPureHtml = false;
            this.updateContent();
            this.handleFocus();
        },

        /**
         * 将文本元素转换成列表子元素li
         *
         * parentElement: 子元素要插入的父元素ol、ul
         * targetNode: 文本元素，提取里面的innerHTML，迁移到li元素中
         * range: 设置光标定位在li元素
         */
        addListItem(parentElement, targetNode, range) {
            let liEle = document.createElement('li');
            liEle.innerHTML = targetNode.innerHTML === '<br>' ? '' : targetNode.innerHTML;
            parentElement.appendChild(liEle);

            let target = null;
            let focusNode = range.commonAncestorContainer;
            let offset = range.endOffset;
            if (focusNode) {
                target = this.findFocusElement(liEle.childNodes, focusNode);
                if (!target) {
                    console.log('找不到光标位置');
                    return;
                }

                // 将光标定位到新节点上
                let editor = document.getElementById('simeditor');
                editor.focus();
                this.focusOnElement(target, offset);
            }
        },

        /**
         * 处理工具栏插入分隔线操作命令
         */
        addHrEle() {
            if (!window.getSelection().rangeCount) {
                this.focusOnEnd();
            }

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
            let editor = document.getElementById('simeditor');
            editor.focus();
            this.focusOnElement(newEle);

            this.isPureHtml = false;
            this.updateContent();
        },

        /**
         * 处理工具栏插入表格操作命令
         */
        addTableEle(tablePoint) {
            let { row, col } = tablePoint;

            let table = document.createElement('table');
            let data = new Array();
            data.push('<table border="1"><thead><tr>');
            for (let i=0; i<col; i++) {
                data.push('<th></th>');
            }
            data.push('</tr></thead><tbody>');

            for (let j=0; j<row; j++) {
                data.push('<tr>');
                for (let k=0; k<col; k++) {
                    data.push('<td></td>');
                }
                data.push('</tr>');
            }

            data.push('</tbody></table>');
            table.innerHTML = data.join('');

            if (!window.getSelection().rangeCount) {
                this.focusOnEnd();
            }
            let selection = window.getSelection();
            let range = selection.getRangeAt(0);
            let currentElement = range.commonAncestorContainer;
            // 如果当前光标定位是 单元格中的文本元素 或 空单元格<td></td>, 则向上寻找到表格的根节点元素
            if (currentElement.nodeType !== 1 || currentElement.nodeName.toLowerCase() === 'td') {
                while (currentElement && currentElement.parentNode.nodeName.toLowerCase() !== 'div') {
                    currentElement = currentElement.parentNode;
                }
            }

            let parentEle = currentElement.parentNode;
            parentEle.appendChild(table);


            // 将光标定位到新节点上
            let editor = document.getElementById('simeditor');
            editor.focus();
            let thead = table.firstChild.firstChild;
            this.focusOnElement(thead);

            this.isPureHtml = false;
            this.updateContent();
        },

        /**
         * 当输入区域没有被选中，无法获取光标位置时，将光标定位在编辑内容的最后
         */
        focusOnEnd() {
            let editor = document.getElementById('simeditor');
            if (window.getSelection) {
                editor.focus();
                // 将光标定位到最后一个元素上
                let endElement = editor.lastChild;
                this.focusOnElement(endElement);
            } else {    //ie10 9 8 7 6 5
                let range = document.createRange();
                range.moveToElementText(editor); //range定位到editor
                range.collapse(false); //光标移至最后
                range.select();
            }
        },

        focusOnElement(ele, offset=0) {
            let selection = window.getSelection();
            let range = selection.getRangeAt(0);
            range.setStart(ele, offset);
            range.setEnd(ele, offset);
            selection.addRange(range);
        },

        updateContent() {
            let innerHTML = document.getElementById('simeditor').innerHTML;
            this.$emit('input', innerHTML);
        },

        showLinkPopover(x, y, text, url) {
            if (!this.isShowLinkPopover) {
                this.isShowLinkPopover = true;
            }
            this.linkPopoverInfo.x = x;
            this.linkPopoverInfo.y = y;
            this.linkPopoverInfo.text = text;
            this.linkPopoverInfo.url = url;
        },

        updateLink() {
            if (!this.linkPopoverInfo.url) return;

            this.editLinkElement.innerHTML = this.linkPopoverInfo.text;
            this.editLinkElement.href = this.linkPopoverInfo.url;
            this.isShowLinkPopover = false;
            this.updateContent();
        }
    }
};
</script>

<style lang="less"> // 注意不要添加scoped属性，否则动态添加的html内容的样式不生效
@import url('../assets/css/style.less');

.simeditor-wrap, .simeditor-body {
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

input[type=file] {
    opacity: 0;
}

.link-popover {
    width: 250px;
    height: 250px;
    margin-top: 3px;
    background: #fff;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
    border-radius: 3px;
    position: absolute;
    z-index: 20;

    .popover-header {
        padding: 10px 15px;
        border-bottom: 1px solid #eee;
        margin: 0px 15px;

        .popover-title {
            padding: 0;
            background: none;
            border: 0;
            text-align: center;
            font-size: 15px;
            font-weight: 700;
            line-height: 30px;
        }

        .icon-close {
            color: #8c8c8c;
            position: absolute;
            top: 15px;
            right: 15px;
        }
    }

    .popover-content {
        padding: 15px;
        overflow-y: auto;

        .item {
            position: relative;
            margin-bottom: 15px;
            font-size: 14px;
        }

        .form-control {
            background-color: #fff;
            border: 1px solid #d9d9d9;
            border-radius: 3px;
            color: #262626;
            width: 100%;
            padding: 8px 12px;
            box-sizing: border-box;
            line-height: 20px;
            font-size: 14px;

            &:focus {
                border-color: #a6a6a6;
                box-shadow: none;
                outline: 0;
            }

            &::placeholder {
                color: #c3c3c3;
            }
        }

        input.form-control {
            height: 40px;
            line-height: 26px;
        }

        textarea.form-control {
            resize: vertical;
            width: 100%;
            box-sizing: border-box;
            resize: none;
            outline: none;
        }

        .btn {
            width: 100%;
            display: inline-block;
            padding: 8px 12px;
            margin-bottom: 0;
            font-size: 14px;
            line-height: 20px;
            color: #262626;
            text-align: center;
            vertical-align: middle;
            cursor: pointer;
            border: 1px solid #d9d9d9;
            border-radius: 3px;
            background-color: #fff;
            white-space: nowrap;
            opacity: 1;
        }

        .btn-primary {
            color: #fff;
            background-color: #1b9aee;
            border-color: #1b9aee;
        }

        .disabled {
            opacity: .65;
        }
    }
}
</style>