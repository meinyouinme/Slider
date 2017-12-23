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
        this.dotsWrap = this.selector.getElementsByClassName('slider-dots')[0]
        this.prevBtn = this.selector.getElementsByClassName('btn-prev')[0]
        this.nextBtn = this.selector.getElementsByClassName('btn-next')[0]

        this.loop = opt && opt.loop || false
        this.autoPlay = opt && opt.autoPlay || false
        this.duration = opt && opt.duration || 300
        this.interval = opt && opt.interval || 1000
        this.easing = opt && Tween[opt.easing] || Tween['Quad']['easeIn']

        this.startPos = 0
        this.endPos = 0
        this.startTime = 0
        this.sliderWidth = this.selector.clientWidth
        this.sliderNum = this.slider.children.length
        this.autoPlayTimer = null

        this.init()
    }



    S.prototype.init = function () {
        //初始化slider的宽度
        this.slider.style.width = this.sliderWidth * this.sliderNum + 'px'
        //添加圆点
        var dots = '<li class="on"></li>'
        for (var i = 0; i < this.sliderNum - 1; i++) {
            dots += '<li></li>'
        }
        this.dotsWrap.innerHTML = dots
        this.dots = this.dotsWrap.children
        //绑定next prev 事件
        var self = this
        this.prevBtn.onclick = function () {
            self.prev()
        }
        this.nextBtn.onclick = function () {
            self.next()
        }
        //绑定圆点事件
        each(this.dots, function (index) {
            this.onclick = function () {
                self.currentIdx = index
            }
        })
        var oldIdx=0
        Object.defineProperty(self, 'currentIdx', {
            get: function () {
                return oldIdx
            },
            set: function (newIdx) {
                var old=oldIdx
                oldIdx=newIdx
                self.watchIndex(old,newIdx)
            }
        })
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

    S.prototype.watchIndex=function(oldIdx,newIdx){
        var self=this
        self.sliderTo(newIdx,function(){
            self.updateDots()
        })
    }

    function likeArray(obj) {
        var length = obj.length
        return Array.isArray(obj) || (length && (length - 1) in obj)
    }

    function each(obj, callback) {
        if (likeArray(obj)) {
            for (var i = 0, item; item = obj[i]; i++) {
                callback.call(item, i, item)
            }
        }
    }

    S.prototype.prev = function () {
        if(this.currentIdx>0) this.currentIdx--
    }

    S.prototype.next = function () {
        var self=this,slider=self.slider
        if(this.loop){
            var first = slider.children[0]
            slider.appendChild(first)
        }else{
            if(this.currentIdx===this.sliderNum-1) this.currentIdx=0
            else this.currentIdx++
        }
        // var slider = this.slider
        // var self = this
        // if (this.loop) {//如果循环连接播放
        //     this.sliderTo(1, function () {
        //         var first = slider.children[0]
        //         slider.appendChild(first)
        //         slider.style.left = 0
        //         self.currentIdx = self.currentIdx === (self.sliderNum - 1) ? 0 : self.currentIdx + 1
        //         self.updateDots()
        //     })
        // } else {//如果不循环连接播放
        //     if (this.currentIdx < this.sliderNum - 1) {
        //         this.sliderTo(++this.currentIdx, function () {
        //             self.updateDots()
        //         })
        //     } else {
        //         this.sliderTo(this.currentIdx = 0, function () {
        //             self.updateDots()
        //         })
        //     }
        // }
    }

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

    S.prototype.updateDots = function () {
        each(this.dots, function () {
            this.className = ''
        })
        this.dots[this.currentIdx].className = 'on'
    }

    S.prototype.updatePos = function (pos) {
        this.slider.style.left = -pos + 'px'
    }

    Slider = function (selector, opt) {
        return new S(selector, opt)
    }

    window.Slider = Slider

    return Slider

}))