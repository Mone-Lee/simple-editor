# simpleEditor **(未完成，不要安装！！)**
功能简单的富文本编辑器


#### 支持在项目中全局引入
```javascript
// main.js
import lightEditor from 'vue-light-editor';

Vue.use(lightEditor)

// vue文件
<light-editor></light-editor>
```

#### 功能支持
1. 标题heading (当前仅支持固定大小h3)
2. 加粗bold
3. 斜体italic

#### 实现原理
使用`contenteditable="true"`属性使div元素实现可编辑。由于`input`元素和`textarea`元素对html标签的显示不太友好，所以不使用这种方式实现。  

编辑器的工具基本由原生JS操作DOM元素(heading)和`document.execCommond`(bold, italic)这一api来实现。同时配合`Selection`对象和`Range`对象来控制光标位置以及选中的操作元素。


### 参考文献
[【webpack】font-awesome加载不到woff字体文件](https://www.jianshu.com/p/964cdd5eb0a0)  
[富文本编辑器-Selection](https://developer.mozilla.org/zh-CN/docs/Web/API/Selection)  
[富文本编辑器-Range](https://developer.mozilla.org/zh-CN/docs/Web/API/Selection)  
[document.execCommand](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand)