# simpleEditor
功能简单的富文本编辑器


#### 支持在项目中全局引入
```javascript
// main.js
import lightEditor from 'vue-light-editor';

Vue.use(lightEditor)

// vue文件
<light-editor></light-editor>
```

#### 输入框实现
使用`contenteditable="true"`属性使div元素实现可编辑。由于`input`元素和`textarea`元素对html标签的显示不太友好，所以不使用这种方式实现。