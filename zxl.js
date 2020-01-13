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
        if (!str) {
          return ele.innerHTML
        } else {
          ele.innerHTML = str
        }
      }
    } else {
      ele.val = str => {
        if (!str) {
          return ele.value
        } else {
          ele.value = str
        }
      }
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

class Request extends JqueryEvent {
  static sets = () => {
    super.$make('ajax', this.ajax)
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
}

new JqueryEvent()
Request.sets()
