class Game
{
    constructor()
    {
        this.gamePositionX = 0;
        this.gamePositionY = 0;

        this.collisionBackX = 0;
        this.collisionBackY = 0;

        this.moveSpeed=0.012;

        this.mapResolution = 100;

        this.keys= new Map();
        
        this.groundMap= new GroundMap(this.mapResolution);

        this.gameMap = new GameMap(this.mapResolution);
        this.sombrero = new SombreroObject(100, './image/sombrero.png', 0.5, 0.5, 0.05, 0.05);

        var context = this;
        document.body.addEventListener('keydown',function(e){context.keyControl(e);});
        document.body.addEventListener('keyup',function(e){context.keyControl(e);});

        this.canvas = document.createElement('canvas');
        this.canvas.id = "Display";
        this.canvas.width = 0;
        this.canvas.height = 0;
        this.canvas.style.zIndex = 8;
        this.canvas.style.position = "absolute";
        this.canvas.style.border = "0px solid";
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(this.canvas);

        this.counter = 0;
        this.counterCheck = 0;

        this.loadInterval = setInterval(this.waitinForLoad.bind(this),200);

    }
    keyControl(event)
    {
        var state = 0;
        switch(event.type)
        {
            case 'keydown':
                {
                    state=true;
                    break;
                }
            case 'keyup':
                {
                    state=false;
                    break;
                }
            default:
                {
                    break;
                }
        }
        this.keys.set(event.key,state);
        
    }
    waitinForLoad()
    { 
        var check = true;
        if (!this.groundMap.isReady()) check = false;
        if (!this.gameMap.isReady()) check = false;
        //if (!this.sombrero.ready) check = false;
        if (check)
        {
            clearInterval(this.loadInterval);
            this.gameInterval = setInterval(this.run.bind(this), 40);
        }
    }
    run()
    {
        this.counter ++;

        var ctx = document.getElementById('Display').getContext('2d');
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        this.groundMap.generateCollisionGroundMap(this.gamePositionX, this.gamePositionY);
        //this.groundMap.drawCollisionGroundMap(ctx, 50, 50 ,500, 320);

        this.groundMap.draw(ctx, 0, 0, window.innerWidth, window.innerHeight, this.gamePositionX, this.gamePositionY);
        this.gameMap.draw(ctx, 0, 0, window.innerWidth, window.innerHeight, this.sombrero, this.gamePositionX, this.gamePositionY);
        this.gameMap.checkCollision();
        this.gameMap.run();

        this.doGamePosition();
        this.groundMap.generateCollisionGroundMap(this.gamePositionX, this.gamePositionY);

        if (this.groundMap.isObjectCollisionWithGroundMap(this.sombrero, 0, 0))
        {
            this.gamePositionX += this.collisionBackX;
            this.gamePositionY += this.collisionBackY;
            this.groundMap.generateCollisionGroundMap(this.gamePositionX, this.gamePositionY);

        }
        this.drawPosition(ctx);

        //this.groundMap.drawLoadMap(ctx, 600,700,600,480, this.gamePositionX, this.gamePositionY);
        this.groundMap.loadAndDropObjects(this.gamePositionX, this.gamePositionY);
        this.groundMap.parseNewData();
        this.groundMap.setObjectsReady();

        if (this.counter-this.counterCheck>1)alert ('there is something wrong');
        this.counterCheck = this.counter;
    }
    doGamePosition()
    {
        this.collisionBackX = 0;
        this.collisionBackY = 0;
        if (this.keys.get('d'))
        {
            this.gamePositionX-=this.moveSpeed;
            this.collisionBackX=this.moveSpeed;
        }
        if (this.keys.get('a'))
        {
            this.gamePositionX+=this.moveSpeed;
            this.collisionBackX=-this.moveSpeed;
        }
        if (this.keys.get('s'))
        {
            this.gamePositionY-=this.moveSpeed;
            this.collisionBackY=this.moveSpeed;
        }
        if (this.keys.get('w'))
        {
            this.gamePositionY+=this.moveSpeed;
            this.collisionBackY=-this.moveSpeed;
        }
        
    }
    drawPosition(ctx)
    {
        ctx.fillStyle='black';
        ctx.font = "30px Arial";
        var posX=Math.floor(this.gamePositionX*100);
        var posY=Math.floor(this.gamePositionY*100);
        ctx.fillText(posX + '   ' + posY,50,50);
    }

}