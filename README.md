### Zquery

```js
//jquery-part
$(ele) //获取dom元素

$(ele).prev()
  .next()
  .childrens(num||null)
  .parent()
  .attr()

$(ele).on(event,fn) //元素绑定事件
  //事件内置event->
  fn -> return event
     -> $(event).prev()
          .next()
          .childrens(num||null)
          .parent()
          .attr()

$.ajax() //赋予事件
$.each()
```

JQuery-> [功能如上即用]

MVVM->
此部分还在研究中
[简单实现MVVM->结合dom修改]

```html
<!-- View -->
<div id="app">
  <div id="mvvm" z-text=${zxl} z-show=${a}></div>
  <div id="mvvm2" z-html=${zxl} z-show=${a}></div>
  <input type="text" z-model=${zxl} z-input=${input}>
  <button z-touchend=${touch}>click</button>
</div>
```

```js
//Model
new MVVM({
  data() {
    return {
      zxl: 123,
      a: 1
    }
  },
  methods: {
    input(val) {
      this.zxl = val
    },
    touch() {
      this.a = !this.a
    }
  },
  mounted() {
    console.log(this)
    console.log($('#app'))
  }
})
```

[--JS示例](./zxl.js)

[--MVVM使用示例](./index.html)

### waiting

```html
百忙中抽空玩玩 按自己理解编译的jQuery+MVVM 无兼容版
```
