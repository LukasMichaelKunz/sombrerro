class GameMap
{
    constructor(mapResolution)
    {
        this.mapResolution=mapResolution;

        this.positionX=0;
        this.positionY=0;
        this.loadPositionX=0;
        this.loadPositionY=0;
        this.emptyScreenLeft=0;
        this.emptyScreenRight=0;
        this.emptyScreen

        this.screenLeft=-1;
        this.screenTop=-1;
        this.screenBottom=2;
        this.screenRight=2;



        this.gameObjects = new Array();
        this.gameObjects.push(new GameObject(this.mapResolution ,'test', 0.53, 0.44, 0.2, 0.2));
        this.gameObjects.push(new GameObject(this.mapResolution ,'test', 0.7, 0.3, 0.2, 0.3));
        this.gameObjects.forEach(element=>{
            element.speedX=(Math.random()-0.5)*0.02;
        });
    }
    draw(ctx, left, top, width, height, sombrero, gamePosX, gamePosY)
    {

        this.gameObjects.forEach(element => 
        {
            var moveX = (element.width/2)*width;
            var moveY = (element.height/2)*height;
            ctx.drawImage(element.image, left + width * (element.positionX+gamePosX) - moveX, top + height * (element.positionY+gamePosY) - moveY, width * element.width, height * element.height);
        });
    var moveX = (sombrero.width/2)*width;
    var moveY = (sombrero.height/2)*height;
    ctx.drawImage(sombrero.image, left + width * (sombrero.positionX) - moveX, top + height * (sombrero.positionY) - moveY, width * sombrero.width, height * sombrero.height);

    }
    isReady()
    {
        var check=true;
        this.gameObjects.forEach(element =>
        {
            if (!element.ready)check = false;
        });
        return check;
    }
    dropObjectsOutOfScreen()
    {
        for (var i=this.gameObjects.length-1;i>=0;i--)
        {
            var drop=false;
            if (this.gameObjects[i].positionX<this.screenLeft)drop=true;
            if (this.gameObjects[i].positionX>this.screenRight)drop=true;
            if (this.gameObjects[i].positionY<this.screenTop)drop=true;
            if (this.gameObjects[i].positionY>this.screenBottom)drop=true;
            if (drop)this.gameObjects.splice(i,1);
        }
    }
    updateMap()
    {

    }
    checkCollision()
    {

        var noCollision=true;
        for (var i=0;i<this.gameObjects.length-1;i++)
        {
            for (var ii=i+1;ii<this.gameObjects.length;ii++)
            {
                if (this.isObjectCollision(this.gameObjects[i],this.gameObjects[ii]))
                {
                    noCollision=false;
                    this.gameObjects[i].collision(this.gameObjects[ii]);
                    this.gameObjects[ii].collision(this.gameObjects[i]);
                }
            }
        }
    }
    isObjectCollision(objectA, objectB)
    {
        var posAX=Math.floor((objectA.positionX-objectA.width/2)*this.mapResolution*16/9);
        var posAY=Math.floor((objectA.positionY-objectA.height/2)*this.mapResolution);
        var posBX=Math.floor((objectB.positionX-objectB.width/2)*this.mapResolution*16/9);
        var posBY=Math.floor((objectB.positionY-objectB.height/2)*this.mapResolution);
        var distanceX=posBX-posAX;
        var distanceY=posBY-posAY;

        //TO DO CHECK IF RECT OVERLAPP
        var overlap=true;
        if (overlap)
        {
            for (var x =0;x<objectA.collidationMap.length;x++)
            {
                for (var y =0;y<objectA.collidationMap[0].length;y++)
                {
                    var posCX=x-distanceX;
                    var posCY=y-distanceY;
                    var doIt=true;
                    if (posCX<0)doIt=false;
                    if (posCY<0)doIt=false;
                    if (posCX>=objectB.collidationMap.length)doIt=false;
                    if (posCY>=objectB.collidationMap[0].length)doIt=false;
                    if (doIt)
                    {
                        //alert (x+' '+y+'  C-'+objectA.collidationMap[x][y]+'  -- '+posCX+' '+posCY+'  C-'+objectB.collidationMap[posCX][posCY]);
                        if (objectA.collidationMap[x][y] && objectB.collidationMap[posCX][posCY])return true;
                    }

                }
            }
        }
        return false;

    }
    run()
    {
        this.gameObjects.forEach(element=> {
            element.run();
        });
    }
}