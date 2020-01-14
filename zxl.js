/*
 * @Author: zxl
 * @Date: 2020-01-11 11:04:42
 * @FilePath: \js-plugIn\Item\zxl.js
 * @Description: like Jquery
 */
class JqueryEvent {
  constructor() {
    window.$ = this.$
  }

  static $make = (key, fn) => {
    $[key] = fn
  }

  setFun = ele => {
    ele.on = (event, fn) => {
      ele[`on${event}`] = e => {
        e.preventDefault()
        e.stopPropagation()
        let { target } = e
        fn(this.findEventFamily(target))
      }
    }

    this.findEventFamily(ele)

    if (ele.tagName != 'INPUT') {
      ele.html = str => {
        if (!str && str != 0) {
          return ele.innerHTML
        } else {
          ele.innerHTML = str
        }
      }
    } else {
      ele.val = str => {
        if (!str && str != 0) {
          return ele.value
        } else {
          ele.value = str
        }
      }
    }

    ele.attr = (key, val) => {
      if (val) {
        ele.setAttribute(key, val)
      } else {
        return ele.getAttribute(key)
      }
    }

    ele.show = () => {
      ele.style.display = 'block'
    }

    ele.hide = () => {
      ele.style.display = 'none'
    }
  }

  isDOM = ele => {
    if (typeof ele === 'object') {
      return ele instanceof HTMLElement
    } else {
      return ele && typeof ele === 'object' && ele.nodeType === 1 && typeof ele.nodeName === 'string';
    }
  }

  deal (type, path, target) {
    let reals = []
    let index = 0
    path.childNodes.forEach(item => {
      if (item.tagName) {
        item.index = index
        reals.push(item)
        index++
      }
    })
    if (type == 'prev') {
      return reals.filter(item => item.index < target.index).pop()
    } else if (type == 'next') {
      return reals.filter(item => item.index > target.index).pop()
    }
  }

  findEventFamily = target => {
    if (Object.prototype.toString.call(target) == '[object Array]') {
      Array.prototype.parent = () => {
        let father = target[0].parentNode
        this.findEventFamily(father)
        return father
      }
    } else {
      let father = target.parentNode
      let children = Array.from(target.childNodes).filter(item => item.tagName)
      target.parent = () => {
        this.findEventFamily(father)
        return father
      }

      target.next = () => {
        let next = this.deal('next', father, target)
        next && this.findEventFamily(next)
        return next
      }

      target.prev = () => {
        let prev = this.deal('prev', father, target)
        prev && this.findEventFamily(next)
        return prev
      }

      children.length && (target.childrens = idx => {
        if (idx || idx === 0) {
          this.findEventFamily(children[idx])
          return children[idx]
        } else {
          let CN = []
          children.forEach(item => {
            if (this.isDOM(item)) {
              CN.push(item)
            }
          })
          this.findEventFamily(Array.from(CN))
          return Array.from(CN)
        }
      })
      return target
    }
  }

  $ = name => {
    if (typeof name === 'object') {
      if (name instanceof HTMLElement) {
        this.forSetEvent([name])
      }
      return name
    } else if (name.indexOf('#') !== -1) {
      let ele = document.querySelector(name)
      this.forSetEvent([ele])
      return ele
    } else {
      let ele = document.querySelectorAll(name)
      if (ele.length == 1) {
        this.forSetEvent(ele)
        return ele[0]
      } else {
        this.forSetEvent(ele)
        return ele
      }
    }
  }

  forSetEvent = arr => {
    arr.forEach(ele => {
      if (ele.length > 1) {
        this.forSetEvent(ele)
      } else {
        this.setFun(ele)
      }
    })
  }
}

class SundryFn extends JqueryEvent {
  static sets = () => {
    super.$make('ajax', this.ajax)
    super.$make('each', this.each)
  }

  static getParms (obj) {
    let str = ''
    for (const a in obj) {
      str += `${a}=${obj[a]}&`
    }
    return str
  }

  static ajax = (opt) => {
    let defaults = {
      async: true,
      data: '',
      ...opt
    }
    let xhr = new XMLHttpRequest();
    if (defaults.type.toLowerCase() == 'get') {
      defaults.url += '?' + this.getParms(defaults.data);
      xhr.open('get', defaults.url, defaults.async);
      xhr.send(null);
    } else {
      xhr.open('post', defaults.url, defaults.async);
      xhr.setRequestHeader('content-type',
        'application/x-www-form-urlencoded');
      xhr.send(defaults.data);
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          defaults.success(xhr.responseText);
        } else {
          console('错误是：' + xhr.status);
        }
      }
    }
  }

  static each = (arr, fn) => {
    arr.forEach((item, index) => {
      const setAttr = item => {
        item.attr = (key, val) => {
          if (val) {
            item.setAttribute(key, val)
          } else {
            return item.getAttribute(key)
          }
        }
      }
      const doChilds = arr => {
        let childs = Array.from(arr.childNodes).filter(i => i.tagName)
        if (childs.length) {
          childs.forEach(i => {
            setAttr(i)
            doChilds(i)
          })
        }
      }
      setAttr(item)
      fn(item, index)
    })
  }
}

class LoadModel {
  static rules = {
    tagAttr: ['model', 'text', 'html', 'show', 'touchend', 'input'],
    bindValues: []
  }

  static hasAttr (i) {
    let { tagAttr } = this.rules
    let groups = tagAttr.filter(item => i.attr(`z-${item}`))
    return groups
  }

  static randomNum (num) {
    let str = ''
    for (let a = 0; a < num; a++) {
      str += parseInt(Math.random() * 10)
    }
    return str
  }

  static forCheck () {
    let random = `z-${this.randomNum(10)}`
    let check = this.rules.bindValues.filter(item => item.key == random)
    if (check.length) {
      return forCheck()
    } else {
      return random
    }
  }

  static doAnalysis (i) {
    let random = this.forCheck()
    let tags = {
      vars: {}
    }
    this.hasAttr(i).forEach(item => {
      let attrVal = i.attr(`z-${item}`)
      tags[item] = attrVal
      if (attrVal.indexOf('$') !== -1) {
        tags.vars[item] = attrVal.match(/{([\s\S]*)}/)[1]
      } else {
        tags[item] = attrVal.match(/{([\s\S]*)}/)[1]
      }
    })
    i.attr(random, 113)
    this.rules.bindValues.push({
      key: random, dom: i, tags
    })
  }

  static analysisBrace () {
    let domChilds = $('body').childrens().filter(i => i.tagName != 'SCRIPT' && i.tagName != 'STYLE')
    $.each(domChilds, item => {
      this.doAnalysis(item)
      let childs = Array.from(item.childNodes).filter(i => i.tagName)
      if (childs.length) {
        $.each(childs, i => {
          this.doAnalysis(i)
        })
      }
    })
    return this
  }

  static RunSetHTML () {
    this.rules.bindValues.forEach(i => {
      let { dom, tags } = i
      for (const a in tags) {
        let { vars } = tags
        if (a == 'text' && !vars.text) {
          $(dom).html(tags[a])
        } else if (a == 'html' && !vars.html) {
          $(dom).html(tags[a])
        } else if (a == 'show' && !vars.show) {
          if (tags[a] != 'true') {
            $(dom).hide()
          }
        }
      }
    })
    return this.rules.bindValues
  }
}

class MVVM {
  constructor(config) {
    this.values = {}
    this.data = {}
    this.observeFn = {}
    this.init(config)
  }
  observe = (key, fn) => {
    if (!this.observeFn[key]) {
      this.observeFn[key] = [fn]
      this.watcher(key)
    } else {
      this.observeFn[key] = [...this.observeFn[key], fn]
    }
  }
  watcher = key => {
    Object.defineProperty(this.data, key, {
      get: () => {
        return this.values[key]
      },
      set: val => {
        this.values[key] = val
        this.observeFn[key].forEach(item => {
          item(val)
        })
      }
    })
  }

  init = config => {
    let { data, methods, mounted } = config
    let loadDOM = LoadModel.analysisBrace().RunSetHTML()
    let obj = data()
    this.data = { ...obj, ...methods }

    loadDOM.forEach(item => {
      let { tags, dom } = item
      let { vars } = tags
      if (vars.text) {
        this.observe(vars.text, val => {
          $(dom).html(val)
        })
        this.data[vars.text] = obj[vars.text]
      }

      if (vars.html) {
        this.observe(vars.html, val => {
          $(dom).html(val)
        })
        this.data[vars.html] = obj[vars.html]
      }

      if (vars.show) {
        this.observe(vars.show, val => {
          val ? $(dom).show() : $(dom).hide()
        })
        this.data[vars.show] = obj[vars.show]
      }

      if (vars.touchend) {
        $(dom).on('touchend', () => {
          this.data[vars.touchend]()
        })
      }

      if (vars.model) {
        this.observe(vars.model, val => {
          $(dom).val(val)
        })
        this.data[vars.model] = obj[vars.model]
      }

      if (vars.input) {
        $(dom).on('input', () => {
          this.data[vars.input]($(dom).val())
        })
      }
    })
    mounted.bind(this.data)()
  }
}

new JqueryEvent()
SundryFn.sets()
