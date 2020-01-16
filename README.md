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

MV-> [MV->结合dom修改]

MVVM->?[此部分还在研究中]

```html
<!-- View -->
<div id="app">
  <div id="mvvm" z-text=${zxl} z-show=${a}></div>
  <div id="mvvm2" z-html=${zxl} z-show=${a}></div>
  <input type="text" z-model=${zxl} z-input=${input}>
  <button z-touchend=${touch}>click</button><br><br>
  left:<div z-text=${rolls.left}></div>
  top:<div z-text=${rolls.top}></div>
  left<input type="number" z-model=${rolls.left} z-input=${inputCss}><br>
  top<input type="number" z-model=${rolls.top} z-input=${inputCss}>
  <div id="roll" style="position: absolute;" z-style=${rolls}></div>
  <button z-text=${stopFont} z-touchend=${stopFrame}></button>
</div>
```

```js
//Model
new MV({
  data() {
    return {
      zxl: 123,
      a: 1,
      rolls: {
        left: 100,
        top: 300
      },
      frame: null,
      stopFont: 'stop'
    }
  },
  methods: {
    input(val) {
      this.zxl = val
    },
    inputCss(key, val) {
      this.rolls[key] = val
    },
    touch() {
      this.a = !this.a
    },
    stopFrame() {
      if (this.stopFont == 'stop') {
        this.stopFont = 'run'
        cancelAnimationFrame(this.frame)
      } else {
        this.stopFont = 'stop'
        this.runFrame()
      }
    },
    runFrame() {
      const run = () => {
        this.rolls.left += 0.5
        this.frame = requestAnimationFrame(run)
      }
      this.frame = requestAnimationFrame(run)
    }
  },
  mounted() {
    this.runFrame()
  }
})
```

[--JS示例](./zxl.js)

[--Model->View测试](./index.html)

编译View模板语法是否使用eval解惑
[--MDN-eval](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval)

数据劫持解惑
[--MDN-Object.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)

### last

```html

*-个人开发的吃力感t.t,许多细节都非完善
 -目前MV做法->
-->调用同一model触发监听时,堆积数组队列执行view的改变
-->暂时model最多支持一层对象

```

```html
百忙中抽空玩玩 按自己理解编译的jQuery+MV 单向数据操作DOM 无兼容版
```
