

var Cloud = function(config){
    this.config = config || {};
};

Cloud.prototype = {
    init:function(){
        var canvas = document.createElement('canvas');
        var pointer = this;

        canvas.width = document.getElementById("clouds").offsetWidth ;
        canvas.height = document.getElementById("clouds").offsetHeight;
        canvas.style.position = "absolute";
        canvas.style.zIndex = 0;

        var ctx = canvas.getContext("2d");
        document.getElementById("clouds").appendChild(canvas);

        var i = 0;
        var intv = window.setInterval(function() {
            //清空画布
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            //绘制一朵云
            pointer.drawCloud(ctx, i, pointer.config.site, pointer.config.size);
            //云朵向右随机移动
            i += Math.random();
        },16/1000);

        return this.intv = intv;
    },
    drawCloud:function(context, cx, cy, cw){
        var ch = cw * 0.6;
        var clientWidth = document.body.clientWidth;
        var pointer = this;

        context.beginPath();

        var grd = context.createLinearGradient(0,0,0,cy);
        grd.addColorStop(0,'#fff');
        grd.addColorStop(1,'#d6f0fd');
        context.fillStyle = grd;

        context.arc(cx, cy, cw * 0.19, 0, 360, false);
        context.arc(cx + cw * 0.08, cy - ch * 0.3, cw * 0.11, 0, 360, false);
        context.arc(cx + cw * 0.3, cy - ch * 0.25, cw * 0.25, 0, 360, false);
        context.arc(cx + cw * 0.6, cy, cw * 0.21, 0, 360, false);
        context.arc(cx + cw * 0.3, cy - ch * 0.1, cw * 0.28, 0, 360, false);

        context.closePath();
        context.fill();

        if((cx-cw * 0.19) > clientWidth){
            var intv=window.clearInterval(pointer.intv);
            return this.intv = intv;
        }
    }
};