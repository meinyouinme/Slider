#### 自己练手的一个slider轮播图插件

使用示例
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Slider</title>
    <!--重置样式-->
    <link href="./css/reset.css" rel="stylesheet">
    <link href="./css/slider.css" rel="stylesheet">
</head>
<body>
<div id="slider" class="slider">
    <ul class="slider-wrapper">
        <li><img src="./img/1.jpg"></li>
        <li><img src="./img/2.jpg"></li>
        <li><img src="./img/3.jpg"></li>
    </ul>
    <ul class="slider-dots"></ul>
    <div class="slider-btn btn-prev">‹</div>
    <div class="slider-btn btn-next">›</div>
</div>
<!--tween.js可引入或者不引入 引入的话轮播图会有比较多的效果选择-->
<script src="./js/tween.js"></script>
<script src="./js/slider.js"></script>
<script>
    var slider=Slider('#slider')//这里#可有可无
</script>
</body>
</html>
```
配置说明
```javascript
Slider('#slider',{
    showDots: true,//是否显示圆点 默认true
    loop: false,//是否循环播放 默认false
    autoplay: true,//是否自动播放 默认true
    duration: 300,//切换一张的时间 默认300ms
    interval: 3000,//切换下一张的时间间隔 默认3000ms
    easing: Linear//缓动动画 如果不引入tween.js 请不要配置easing 如果引入tween.js 请参考下面说明配置此参数
})
```
easing缓动动画配置说明

具体每个动画的效果说明[请看这篇文章](http://easings.net/zh-cn)
```javascript
//Linear
//Quad.easeIn
//Quad.easeOut
//Quad.easeInOut
//Cubic.easeIn
//Cubic.easeOut
//Cubic.easeInOut
//Quart.easeIn
//Quart.easeOut
//Quart.easeInOut
//Quint.easeIn
//Quint.easeOut
//Quint.easeInOut
//Sine.easeIn
//Sine.easeOut
//Sine.easeInOut
//Expo.easeIn
//Expo.easeOut
//Expo.easeInOut
//Circ.easeIn
//Circ.easeOut
//Circ.easeInOut
//Elastic.easeIn
//Elastic.easeOut
//Elastic.easeInOut
//Back.easeIn
//Back.easeOut
//Back.easeInOut
//Bounce.easeIn
//Bounce.easeOut
//Bounce.easeInOut
```
