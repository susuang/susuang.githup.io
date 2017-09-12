/*--------public-------*/
function rand( min, max ) {//随机数
    return Math.random() * ( max - min ) + min;
}
function distance( a, b ) {
  var dx = a.x - b.x,
      dy = a.y - b.y;
  return Math.sqrt( dx * dx + dy * dy );
}

var Particle = function(config){
    this.config = config || {};
    this.path = [];
    this.reset();
};

Particle.prototype = {
    reset:function(){
        var w = this.config.w;

        this.radius = 1;
        this.x = rand( 0, w );
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.hit = 0;
        this.path.length = 0;
    },
    step:function(){
        var pointer = this;
        var gravity = pointer.config.gravity;
        var pillarCount = pointer.config.pillarCount;
        
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
  
        var i = pillarCount;
        while( i-- ) {
            var pillar = pillars[ i ];
            if( distance( this, pillar ) < this.radius + pillar.renderRadius ) {
                this.vx = 0;
                this.vy = 0;
                this.vx += -( pillar.x - this.x ) * rand( 0.01, 0.03 );
                this.vy += -( pillar.y - this.y ) * rand( 0.01, 0.03 );
                pillar.radius -= 0.1;
                this.hit = 1;
            }
        }
    },
    draw:function(){
        ctx.beginPath();
        ctx.moveTo( this.x, ~~this.y );
        for( var i = 0, length = this.path.length; i < length; i++ ) {
            var point = this.path[ i ];
            ctx.lineTo( point[ 0 ], ~~point[ 1 ] );
        }
        ctx.strokeStyle = 'hsla(' + rand( hue + ( this.x / 3 ), hue + ( this.x / 3 ) + hueRange ) + ', 50%, 30%, 0.3)';
        ctx.stroke();
  
        if( this.hit ) {
            ctx.beginPath();
            ctx.arc( this.x, this.y , rand( 1, 25 ), 0, TWO_PI );
            ctx.fillStyle = 'hsla(' + rand( hue + ( this.x / 3 ), hue + ( this.x / 3 ) + hueRange ) + ', 80%, 15%, 0.1)'
            ctx.fill();
        }
    }
};

var Pillar = function(config){
    this.reset();
};

Pillar.prototype = {
    reset:function(){
        this.radius = rand( 50, 100 );
        this.renderRadius = 0;
        this.x = rand( 0, w );
        this.y = rand( h / 2 - h / 4, h );
        this.active = 0;
    },
    step:function(){
        if( this.active ) {
            if( this.radius <= 1 ) {
                this.reset();
            } else {
                this.renderRadius = this.radius;
            }
        } else {
            if( this.renderRadius < this.radius ) {
                this.renderRadius += 0.5;
            } else {
                this.active = 1;
            }
        }
    },
    draw:function(){
        ctx.beginPath();
        ctx.arc( this.x, this.y, this.renderRadius, 0, TWO_PI, false );
        ctx.fill();
    }
};

var c = document.createElement( 'canvas' ),
    ctx = c.getContext( '2d' ),
    w = c.width = 600,
    h = c.height = 400,
    particles = [],
    particleCount = 1000,
    particlePath = 4,
    pillars = [],
    pillarCount = 110,
    hue = 0,
    hueRange = 60,
    hueChange = 1,
    gravity = 0.1,
    lineWidth = 1,
    lineCap = 'round',
    PI = Math.PI,
    TWO_PI = PI * 2;


function init() {
  ctx.lineWidth = lineWidth;
  ctx.lineCap = lineCap;
  
  var i = pillarCount;
  while( i-- ){
    pillars.push( new Pillar() );
  }
  
  
  loop();
}


function step() {
  hue += hueChange;
  
  if( particles.length < particleCount ) {
    particles.push( new Particle() );
  }
  
  var i = particles.length;
  while( i-- ) {
    particles[ i ].step();
  }
  
  i = pillarCount;
  while( i-- ) {
    pillars[ i ].step();
  }
}

function draw() {
  ctx.fillStyle = 'hsla(0, 0%, 0%, 0.1)';
  ctx.fillRect( 0, 0, w, h );
 
  ctx.globalCompositeOperation = 'lighter';
  var i = particles.length;
  while( i-- ) {
    particles[ i ].draw();
  }
  
  ctx.globalCompositeOperation = 'source-over';
  i = pillarCount;
  ctx.fillStyle = 'rgba(20, 20, 20, 0.3)';
  while( i-- ) {
    pillars[ i ].draw();
  }
}

function loop() {
  requestAnimationFrame( loop );
  step();
  draw();
}

init();

var Rain = function(config){

    this.config = config || {};
    this.init();
}

Rain.prototype = {
    init:function(){
        var c = this.config.canvas || document.createElement( 'canvas' );
        var ctx = c.getContext( '2d' );
        var lineWidth = this.config.lineWidth || 1;
        var lineCap = this.config.lineCap || 'round';
        var pillarCount = this.config.pillarCount || 110;

        this.w = c.width = this.config.canvasWidth || 600,
        this.h = c.height = this.config.canvasHeight || 400;
        document.body.appendChild(c);
        this.c = c;

        this.particles = [];
        
        this.particlePath = this.config.particleCount || 4;

        
        

        this.hue = this.config.hue || 0;
        this.hueRange = this.config.hueRange || 60;
        this.hueChange = this.config.hueChange || 1;

        this.gravity = this.config.gravity || 0.1;

        

        this.TWO_PI = Math.PI * 2;

        var pillars = [];
        for(var i=0;i<pillarCount;i++){
            pillars.push( new Pillar() );
        }
        this.pillars = pillars;


        ctx.lineWidth = lineWidth;
        ctx.lineCap = lineCap;
        this.ctx = ctx;

    },
    step:function(){
        var pointer = this;
        var particleCount = pointer.config.particleCount || 1000;
        var pillarCount = pointer.pillars.length;

        this.hue += this.hueChange;
        

        if( pointer.particles.length < particleCount ) {
            pointer.particles.push( new Particle({
                w:pointer.w,
                gravity:pointer.gravity,
                pillarCount:pillarCount
            }) );
        }
    }
};
