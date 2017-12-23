;(function (global, factory) {
    if (typeof define === 'function' && define.amd)
        define(function () {
            factory(global)
        })
    else
        factory(global)
}(this, function (window) {

    var Slider

    function S(selector, opt) {
        selector = selector[0] === '#' ? selector.substr(1) : selector
        this.selector = document.getElementById(selector)
        this.slider = this.selector.getElementsByClassName('slider-wrapper')[0]
        this.prevBtn = this.selector.getElementsByClassName('btn-prev')[0]
        this.nextBtn = this.selector.getElementsByClassName('btn-next')[0]

        this.showDots = opt && opt.showDots || true
        this.loop = opt && opt.loop || false
        this.autoPlay = opt && opt.autoPlay || true
        this.duration = opt && opt.duration || 300
        this.interval = opt && opt.interval || 1000
        this.easing = opt && Tween[opt.easing] || Tween['Quad']['easeIn']

        this.currentIdx = 0
        this.startPos = 0
        this.endPos = 0
        this.startTime = 0
        this.sliderWidth = this.selector.clientWidth
        this.sliderNum = this.slider.children.length
        this.autoPlayTimer = null

        this.init()
    }

    S.prototype.init = function () {
        var self = this
        //初始化slider的宽度
        this.slider.style.width = this.sliderWidth * this.sliderNum + 'px'
        if (this.showDots) {
            this.dotsWrap = this.selector.getElementsByClassName('slider-dots')[0]
            //添加圆点
            var dots = '<li class="on"></li>'
            for (var i = 0; i < this.sliderNum - 1; i++) {
                dots += '<li></li>'
            }
            this.dotsWrap.innerHTML = dots
            this.dots = this.dotsWrap.children
            //绑定圆点事件
            each(this.dots, function (index) {
                this.onclick = function () {
                    self.sliderTo(self.currentIdx = index, function () {
                        self.updateDots()
                    })
                }
            })
        }
        //绑定next prev 事件
        this.prevBtn.onclick = function () {
            self.prev()
        }
        this.nextBtn.onclick = function () {
            self.next()
        }
        //如果设置自动播放
        if (this.autoPlay) {
            this.autoPlayTimer = setInterval(function () {
                self.nextBtn.click()
            }, this.duration + this.interval)
            //鼠标滑入停止自动播放
            this.selector.onmouseover = function () {
                clearInterval(self.autoPlayTimer)
            }
            //鼠标滑出 继续自动播放
            this.selector.onmouseout = function () {
                self.autoPlayTimer = setInterval(function () {
                    self.nextBtn.click()
                }, self.duration + self.interval)
            }
        }
    }

    //针对数组和类数组的简单遍历
    function each(obj, callback) {
        for (var i = 0, item; item = obj[i]; i++) {
            callback.call(item, i, item)
        }
    }

    //上一张 方法
    S.prototype.prev = function () {
        var self = this
        if (this.currentIdx > 0) {
            this.sliderTo(--this.currentIdx, function () {
                self.updateDots()
            })
        }
    }

    //下一张 方法
    S.prototype.next = function () {
        var slider = this.slider
        var self = this
        if (this.loop) {//如果循环连接播放
            this.sliderTo(1, function () {
                var first = slider.children[0]
                slider.appendChild(first)
                slider.style.left = 0
                self.currentIdx = self.currentIdx === (self.sliderNum - 1) ? 0 : self.currentIdx + 1
                self.updateDots()
            })
        } else {//如果不循环连接播放
            if (this.currentIdx < this.sliderNum - 1) {
                this.sliderTo(++this.currentIdx, function () {
                    self.updateDots()
                })
            } else {
                this.sliderTo(this.currentIdx = 0, function () {
                    self.updateDots()
                })
            }
        }
    }

    //滚动到某一张 方法
    S.prototype.sliderTo = function (targetIdx, callback) {
        var timer, self = this
        this.startTime = +new Date()
        this.startPos = Math.abs(this.slider.getBoundingClientRect()['left'])
        this.endPos = targetIdx * this.sliderWidth
        timer = setInterval(function () {
            if (self.step() === false) {
                clearInterval(timer)
                callback && callback.call(this)
            }
        }, 19)
    }

    S.prototype.step = function () {
        var t = +new Date()
        if (t >= this.startTime + this.duration) {
            this.updatePos(this.endPos)
            return false
        }
        var pos = this.easing(t - this.startTime, this.startPos, this.endPos - this.startPos, this.duration)
        this.updatePos(pos)
    }

    //更新轮播图位置
    S.prototype.updatePos = function (pos) {
        this.slider.style.left = -pos + 'px'
    }

    //更新圆点高亮
    S.prototype.updateDots = function () {
        each(this.dots, function () {
            this.className = ''
        })
        this.dots[this.currentIdx].className = 'on'
    }

    Slider = function (selector, opt) {
        return new S(selector, opt)
    }

    window.Slider = Slider

    return Slider

}))