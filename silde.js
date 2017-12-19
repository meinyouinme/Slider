

(function($,window,document){

    "use strict";

    function Slide(element,options) {

        this.options=$.extend({},Slide.Defaults,options);

        this.$element=$(element);


    }

    Slide.Defaults ={
        items:3,
    }

    Slide.prototype.trigger=function(){
        
    }

})($,window,document)