(function (global, factory) {
    if (typeof define === 'function' && define.amd)
        define(function () {
            return factory(global)
        })
    else
        factory(global)
}(this, function (window) {

    var Slider

    //简单的线性缓动 如果没有引入Tween.js 就用这个
    function linear(t, b, c, d) {
        return c * t / d + b;
    }

    //针对数组和类数组的简单遍历
    function each(obj, callback) {
        for (var i = 0, item; item = obj[i]; i++) {
            callback.call(item, i, item)
        }
    }

    //简单的扩展参数函数
    function extend(source, target) {
        for (var key in target) {
            if(key==='easing'){
                if(!window.Tween){
                    source['easing']=linear
                }
                else{
                    var words=target['easing'].split('.')
                    source['easing']=words.length===1?Tween[words[0]]:Tween[words[0]][words[1]]
                }

            }
            else if (target[key] !== undefined) source[key] = target[key]
        }
    }

    function S(selector, opt) {
        //ID选择器加#或不加#都行
        selector = selector[0] === '#' ? selector.substr(1) : selector
        this.selector = document.getElementById(selector)

        this.slider = this.selector.getElementsByClassName('slider-wrapper')[0]
        this.prevBtn = this.selector.getElementsByClassName('btn-prev')[0]
        this.nextBtn = this.selector.getElementsByClassName('btn-next')[0]

        this.options = {
            showDots: true,//显示圆点
            loop: false,//是否循环播放
            autoplay: true,//是否自动播放
            duration: 300,//切换一张的时间
            interval: 3000,//切换下一张的时间间隔
            easing: linear//缓动动画
        }
        //融合默认参数和自定义参数
        extend(this.options, opt)

        this.currentIdx = 0//当前幻灯片序号
        this.startPos = 0//幻灯片开始位置
        this.endPos = 0//幻灯片结束位置
        this.startTime = 0//幻灯片开始运动时间
        this.sliderWidth = this.selector.clientWidth//幻灯片宽度
        this.sliderNum = this.slider.children.length//幻灯片数量
        this.autoPlayTimer = null//自动播放计时器

        this.init()//初始化幻灯片
    }

    S.prototype.init = function () {
        var self = this
        //初始化slider的宽度
        this.slider.style.width = this.sliderWidth * this.sliderNum + 'px'
        if (this.options.showDots) {
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
        if (this.options.autoplay) {
            this.autoPlayTimer = setInterval(function () {
                self.nextBtn.click()
            }, self.options.duration + self.options.interval)
            //鼠标滑入停止自动播放
            this.selector.onmouseover = function () {
                clearInterval(self.autoPlayTimer)
            }
            //鼠标滑出 继续自动播放
            this.selector.onmouseout = function () {
                self.autoPlayTimer = setInterval(function () {
                    self.nextBtn.click()
                }, self.options.duration + self.options.interval)
            }
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
        if (this.options.loop) {//如果循环连接播放
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
        if (t >= this.startTime + this.options.duration) {
            this.updatePos(this.endPos)
            return false
        }
        var pos = this.options.easing(t - this.startTime, this.startPos, this.endPos - this.startPos, this.options.duration)
        this.updatePos(pos)
    }

    //更新轮播图位置
    S.prototype.updatePos = function (pos) {
        this.slider.style.left = -pos + 'px'
    }

    //更新圆点高亮
    S.prototype.updateDots = function () {
        if (this.options.showDots) {//如果有圆点才更新
            each(this.dots, function () {
                this.className = ''
            })
            this.dots[this.currentIdx].className = 'on'
        }
    }

    Slider = function (selector, opt) {
        return new S(selector, opt)
    }

    window.Slider = Slider

    return Slider

}))