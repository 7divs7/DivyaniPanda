//Keep object sizes constant on changing window size

// Canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

// Gameover setup
const canvas2 = document.getElementById('canvas1');
const gamectx = canvas2.getContext('2d');

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';

//Background setup
let gameSpeed =  6;


// Mouse interactivity
const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}
canvas.addEventListener('mousedown', function(event){
    mouse.click = true;
    var mousePos = getMousePos(canvas, event);
    mouse.x = mousePos.x;
    mouse.y = mousePos.y;
});
canvas.addEventListener('mouseup', function(event){
    mouse.click = false;
    var mousePos = getMousePos(canvas, event);
    mouse.x = mousePos.x;
    mouse.y = mousePos.y;
});
function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

// Player setup
const playerImg = new Image();
playerImg.src = 'assets/img/tessaract.png';
const LokiImg = new Image();
LokiImg.src = 'assets/img/loki.png';

class Player
{
    constructor()
    {
        this.x = canvas.width;
        this.y = canvas.height/2;
        this.radius = 80;
        this.angle = 0;
        this.speed = 0.04;
    }
    update()
    {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        if(mouse.x != this.x)
        {
            this.x -= dx * this.speed;
        }
        if(mouse.y != this.y)
        {
            this.y -= dy * this.speed;
        }
    }
    draw()
    {
        if(mouse.click)
        {
            ctx.fillStyle = 'red';
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            //ctx.stroke();
        }
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        //ctx.fill();
        ctx.closePath();

        ctx.drawImage(playerImg, this.x - playerImg.width/5.5 , this.y - playerImg.height/5, playerImg.width/2.5, playerImg.height/2.5); 
        /*
        if(this.x >= mouse.x)
            ctx.drawImage(playerLeft, this.x - playerLeft.width/5 , this.y - playerLeft.height/5, playerLeft.width/2.5, playerLeft.height/2.5);    
        else
            ctx.drawImage(playerRight, this.x - playerRight.width/5 , this.y - playerRight.height/5, playerRight.width/2.5, playerRight.height/2.5);
         */   
            
    }
}
const player = new Player();

// Objects
const navArray = [];
class NavObjects
{
    constructor()
    {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 60;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted;
    }
    update()
    {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    }
    draw()
    {
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        //ctx.fill();
        ctx.closePath();
        //ctx.stroke();
        ctx.drawImage(LokiImg, this.x - LokiImg.width/5 , this.y - LokiImg.height/5, LokiImg.width/2.5, LokiImg.height/2.5); 
    }
}

function handleObjects()
{
    if(gameFrame % 50 == 0) //run this func every 50 frames
    {
        navArray.push(new NavObjects());
    }
    for (let i = 0; i < navArray.length; i++)
    {
        navArray[i].update();
        navArray[i].draw();
    }
    for (let i = 0; i < navArray.length; i++)
    {
        if((navArray[i].y + navArray[i].radius) < 0)
        {
            navArray.splice(i, 1);
        }
        if(navArray[i])
        {
            // check collision with player
            if(navArray[i].distance < navArray[i].radius + player.radius)
            {
                if(!navArray[i].counted)
                {
                    score++;
                    return;
                    navArray[i].counted = true;
                    navArray.splice(i, 1);
                }
                
            }
        }
    }
}

let x = 0;
let x2 = 1024*1.5;

// Animation loop
function animateLoop()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    /*
    ctx.drawImage(backgroundLayer1, x, -100, 1024*1.5, 576*1.5);
    ctx.drawImage(backgroundLayer1, x2, -100, 1024*1.5, 576*1.5);
    if(x < -1024*1.5) x = 1024*1.5 - gameSpeed *2;
    else x -= gameSpeed;
    if(x2 < -1024*1.5) x2 = 1024*1.5 - gameSpeed *2;
    else x2 -= gameSpeed;
    */
    handleObjects();
    player.update();
    player.draw();
    ctx.fillStyle = 'black';
    //ctx.fillText('score: ' + score, 10, 50);
    gameFrame++;

    if(score > 0) 
    {
        canvas2.style.visibility='visible';
        return;
    }

    requestAnimationFrame(animateLoop);
}
animateLoop();


function swapCanvases(){
   
      canvas.style.visibility='hidden';
      canvas2.style.visibility='visible';
    
  }