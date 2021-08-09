# simpleEditor
功能简单的富文本编辑器, 支持在vue项目中作为插件使用。由于项目实现的功能参考的是[teambition](https://www.teambition.com/)中日程创建中使用的编辑器，功能比较简单，不作正式的文字处理软件使用。


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
4. 插入图片
5. 插入链接
6. 分隔符hr

待实现功能：
1. 有序列表
2. 无序列表
3. 插入表格

#### 实现原理
使用`contenteditable="true"`属性使div元素实现可编辑。由于`input`元素和`textarea`元素对html标签的显示不太友好，所以不使用这种方式实现。  

编辑器的工具基本由原生JS操作DOM元素(heading)和`document.execCommond`(bold, italic)这一api来实现。同时配合`Selection`对象和`Range`对象来控制光标位置以及选中的操作元素。

#### 参考链接
[【webpack】font-awesome加载不到woff字体文件](https://www.jianshu.com/p/964cdd5eb0a0)  
[富文本编辑器-Selection](https://developer.mozilla.org/zh-CN/docs/Web/API/Selection)  
[富文本编辑器-Range](https://developer.mozilla.org/zh-CN/docs/Web/API/Selection)  
[document.execCommand](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand)  
[文件上传<input type="file">](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input/file)  
[在contenteditable元素中将光标定位到最后](https://www.cnblogs.com/ybixian/p/10601224.html)