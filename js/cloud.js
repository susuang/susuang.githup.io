function showCloud(){
    var canvas = document.createElement('canvas');
    canvas.width = document.getElementById("clouds").offsetWidth ;
    canvas.height = document.getElementById("clouds").offsetHeight;
    canvas.style.position = "absolute";
    canvas.style.zIndex = 0;
    var ctx = canvas.getContext("2d");
    console.info(document.getElementById("clouds").offsetWidth);
    document.getElementById("clouds").appendChild(canvas);
    var i = 0;
    window.setInterval(function() {
        //清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //绘制一朵云
        drawCloud(ctx, i, 80, 125);
        //云朵向右随机移动
        i += Math.random();
    },16/1000)
}
function drawCloud(context, cx, cy, cw){
    var ch = cw * 0.6;
    context.beginPath();
    context.fillStyle = "#f2f9fe";
    var grd = context.createLinearGradient(0,0,0,cy);
    grd.addColorStop(0,'#f2f9fe');
    grd.addColorStop(1,'#d6f0fd');
    context.fillStyle = grd;
    context.fill();
    context.arc(cx, cy, cw * 0.19, 0, 360, false);
    context.arc(cx + cw * 0.08, cy - ch * 0.3, cw * 0.11, 0, 360, false);
    context.arc(cx + cw * 0.3, cy - ch * 0.25, cw * 0.25, 0, 360, false);
    context.arc(cx + cw * 0.6, cy, cw * 0.21, 0, 360, false);
    context.arc(cx + cw * 0.3, cy - ch * 0.1, cw * 0.28, 0, 360, false);
    context.closePath();
    context.fill();
}