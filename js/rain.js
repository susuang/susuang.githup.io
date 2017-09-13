/*--------public-------*/
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
function rand( min, max ) {//随机数
    return Math.random() * ( max - min ) + min;
}
function distance( a, b ) {
  var dx = a.x - b.x,
      dy = a.y - b.y;
  return Math.sqrt( dx * dx + dy * dy );
}

/*----------------线粒子--------------------*/
var Particle = function(config){
    this.config = config || {};
    this.path = [];
    this.reset();
};

Particle.prototype = {
    reset:function(){
        var canvas = this.config.canvas
        var w = canvas.width;

        this.radius = 1;
        this.x = rand( 0, w );
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.hit = 0;
        this.path.length = 0;

        this.step();
    },
    step:function(){
        var pointer = this;
        var canvas = pointer.config.canvas
        var gravity = pointer.config.gravity;
        var pillars = pointer.config.pillars;
        var particlePath = 4;
        var h = canvas.height;
        
        pointer.hit = 0;
        pointer.path.unshift([pointer.x, pointer.y]);

        if( pointer.path.length > particlePath ) {
            pointer.path.pop();
        }
 
        pointer.vy += gravity;
        pointer.x += pointer.vx;
        pointer.y += pointer.vy;
  
        if( pointer.y > h + 10 ) {
            pointer.reset();
        }
  
        var i = pillars.length;
        while( i-- ) {
            var pillar = pillars[ i ];
            if( distance( pointer, pillar ) < pointer.radius + pillar.renderRadius ) {
                pointer.vx = 0;
                pointer.vy = 0;
                pointer.vx += -( pillar.x - pointer.x ) * rand( 0.01, 0.03 );
                pointer.vy += -( pillar.y - pointer.y ) * rand( 0.01, 0.03 );
                pillar.radius -= 0.1;
                pointer.hit = 1;
            }
        }
    },
    draw:function(){

        var pointer = this;
        var ctx = pointer.config.ctx,hue = pointer.config.hue,hueRange = pointer.config.hueRange,TWO_PI = Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo( pointer.x, ~~pointer.y );

        for( var i = 0, length = pointer.path.length; i < length; i++ ) {
            var point = pointer.path[ i ];
            ctx.lineTo( point[ 0 ], ~~point[ 1 ] );
        }
        ctx.strokeStyle = 'hsla(' + rand( hue + ( pointer.x / 3 ), hue + ( pointer.x / 3 ) + hueRange ) + ', 50%, 30%, 0.3)';
        ctx.stroke();
  
        if( pointer.hit ) {
            ctx.beginPath();
            ctx.arc( pointer.x, pointer.y , rand( 1, 25 ), 0, TWO_PI );
            ctx.fillStyle = 'hsla(' + rand( hue + ( pointer.x / 3 ), hue + ( pointer.x / 3 ) + hueRange ) + ', 80%, 15%, 0.1)'
            ctx.fill();
        }
    }
};

/*-----------------柱-------------------*/
var Pillar = function(config){
    this.config = config || {};
    this.reset();
};

Pillar.prototype = {
    reset:function(){
        var canvas = this.config.canvas;
        var w = canvas.width,h = canvas.height;
        this.radius = rand( 50, 100 );
        this.renderRadius = 0;
        this.x = rand( 0, w);
        this.y = rand( h / 2 - h / 4, h );
        this.active = 0;

        this.step();
    },
    step:function(){
        var pointer = this;
        if( pointer.active ) {
            if( pointer.radius <= 1 ) {
                pointer.reset();
            } else {
                pointer.renderRadius = pointer.radius;
            }
        } else {
            if( pointer.renderRadius < pointer.radius ) {
                pointer.renderRadius += 0.5;
            } else {
                pointer.active = 1;
            }
        }
    },
    draw:function(){
        var ctx = this.config.ctx,TWO_PI = Math.PI * 2;
        ctx.beginPath();
        ctx.arc( this.x, this.y, this.renderRadius, 0, TWO_PI, false );
        ctx.fill();
    }
};

/*-----------------雨-------------------*/
var Rain = function(config){

    this.config = config || {};
    this.init();
}

Rain.prototype = {
    init:function(){
        var pointer = this;
        var canvas = pointer.config.canvas || document.createElement( 'canvas' );
        var ctx = canvas.getContext( '2d' );
        var lineWidth = pointer.config.lineWidth || 1;
        var lineCap = pointer.config.lineCap || 'round';

        /*绘制画板*/
        canvas.width = pointer.config.canvasWidth || 600,
        canvas.height = pointer.config.canvasHeight || 400;
        document.body.appendChild(canvas);
        ctx.lineWidth = lineWidth;
        ctx.lineCap = lineCap;
        pointer.canvas = canvas;
        pointer.ctx = ctx;
        pointer.particles = [];

        pointer.hue = pointer.config.hue || 0;
        
        var pillars = [];
        var i = pointer.config.pillarCount || 110;
        while( i-- ){
            pillars.push(new Pillar({
                canvas:canvas,
                ctx:ctx
            }));
        }
        pointer.pillars = pillars;  
        var loop = function(){
          requestAnimationFrame(loop);
          pointer.step();
          pointer.draw();
        };
        loop();
    },
    step:function(){

        var pointer = this;
        var particleCount = pointer.config.particleCount || 1000;
        var pillarCount = pointer.pillars.length;
        var hueChange = pointer.config.hueChange || 1;
        var hueRange = pointer.config.hueRange || 60;
        var gravity = pointer.config.gravity || 0.1;
        
        pointer.hue += hueChange;

        if( pointer.particles.length < particleCount ) {
            pointer.particles.push( new Particle({
                canvas:pointer.canvas,
                ctx:pointer.ctx,
                pillars:pointer.pillars,
                hue:pointer.hue,
                hueRange:hueChange,
                gravity:gravity
            }) );
        }

        var i = pointer.particles.length;
        while( i-- ) {
            pointer.particles[ i ].step();
        }
        i = pillarCount;
        while( i-- ) {
            pointer.pillars[ i ].step();
        }
        
    },
    draw:function(){
        var canvas = this.canvas,ctx = this.ctx,particles = this.particles,pillars = this.pillars;
        var w = canvas.width,h = canvas.height;

        ctx.fillStyle = 'hsla(0, 0%, 0%, 0.1)';
        ctx.fillRect( 0, 0, w, h );
        ctx.globalCompositeOperation = 'lighter';

        var i = particles.length;
        while( i-- ) {
            particles[ i ].draw();
        }
      
        ctx.globalCompositeOperation = 'source-over';
        i = pillars.length;
        ctx.fillStyle = 'rgba(20, 20, 20, 0.3)';
        while( i-- ) {
            pillars[ i ].draw();
        }
    }
};
