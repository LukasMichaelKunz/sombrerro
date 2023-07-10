class GroundMap
{
    constructor(mapResolution)
    {
        var dimensionFactor=16/9;
        this.dimensionHeight=mapResolution;
        this.mapResolution=mapResolution;
        this.dimensionWidth=Math.floor(this.dimensionHeight*dimensionFactor);
        this.mapObjects = new Array();
        this.mapObjects.push(new GroundObject(this.mapResolution, './image/testObject.png', 0.1, 0.6, 0.5, 0.5));

        this.lastLoadX = 0;
        this.lastLoadY = 0;
        this.loadSpace = 0.3;

        this.gameOutX = 1;
        this.gameOutY = 1;
        this.collisionGroundMap=null;
    }
    isReady()
    {
        var check=true;
        this.mapObjects.forEach(element =>
        {
            if (!element.ready)check = false;
        });
        return check;
    }
    draw(ctx, left, top, width, height, gamePosX, gamePosY)
    {
        ctx.fillStyle='silver';
        ctx.fillRect(left,top,width,height);
        this.mapObjects.forEach(element => 
        {
            var moveX = (element.width/2)*width;
            var moveY = (element.height/2)*height;
            ctx.drawImage(element.image, left + width * (element.positionX + gamePosX) - moveX, top + height * (element.positionY + gamePosY) - moveY, width * element.width, height * element.height);
        });
    }
    drawLoadMap(ctx, left, top, width, height, gamePosX, gamePosY)
    {
        var sLeft=0 - this.gameOutX;
        var sTop= 0 - this.gameOutY;
        var sBottom=this.gameOutY + 1;
        var sRight=this.gameOutX +1;
        
        var sWidth=sRight-sLeft;
        var sHeight=sBottom-sTop;

        ctx.fillStyle='green';
        ctx.fillRect(left,top,width,height);
        ctx.fillStyle='blue';
        ctx.fillRect(left-sLeft/sWidth*width,top-sTop/sHeight*height,width/sWidth,height/sHeight);


        var loadDisplayX = sRight-sLeft;
        var loadDisplayY = sBottom-sTop;

        var loadSpaceX = gamePosX - this.lastLoadX;
        var loadSpaceY = gamePosY - this.lastLoadY;

        ctx.fillStyle='red';
        if (loadSpaceX > 0)
            {
                ctx.fillRect(left,top, loadSpaceX/loadDisplayX*width,height);
            }
        if (loadSpaceX < 0)
            {
                ctx.fillRect(left + width + loadSpaceX/loadDisplayX*width,top, -loadSpaceX/loadDisplayX*width,height);
            }
        if (loadSpaceY > 0)
            {
                ctx.fillRect(left,top, width, height*loadSpaceY/loadDisplayY);
            }
        if (loadSpaceY < 0)
            {
                ctx.fillRect(left,top + height + loadSpaceY/loadDisplayY*height, width, -height*loadSpaceY/loadDisplayY);
            }

        ctx.fillStyle='black';
        this.mapObjects.forEach(element=>{
            ctx.beginPath();
            ctx.arc(gamePosX*width/(this.gameOutX+this.gameOutY+1)+left-sLeft/sWidth*width+width*(element.positionX)/sWidth,gamePosY*height/(this.gameOutX+this.gameOutY+1)+top-sTop/sHeight*height+height*(element.positionY)/sHeight,5,0,Math.PI*2);
            ctx.fill();
            ctx.stroke();
        });
    }
    loadAndDropObjects(gamePosX, gamePosY)
    {
        var sLeft=0 - this.gameOutX;
        var sTop= 0 - this.gameOutY;
        var sBottom=this.gameOutY + 1;
        var sRight=this.gameOutX +1;
        for (var i=this.mapObjects.length-1;i>=0;i--)
        {
            var drop=false;
            if (this.mapObjects[i].positionX+gamePosX<sLeft)drop=true;
            if (this.mapObjects[i].positionX+gamePosX>sRight)drop=true;
            if (this.mapObjects[i].positionY+gamePosY<sTop)drop=true;
            if (this.mapObjects[i].positionY+gamePosY>sBottom)drop=true;
            if (drop)this.mapObjects.splice(i,1);
        }

        var doLoad = false;
        if (Math.abs(gamePosX-this.lastLoadX)>=this.loadSpace)doLoad = true;
        if (Math.abs(gamePosY-this.lastLoadY)>=this.loadSpace)doLoad = true;
        if (doLoad)
        {
            this.lastLoadX=gamePosX;
            this.lastLoadY=gamePosY;

            var loadX = gamePosX-this.lastLoadX;
            var loadY = gamePosY-this.lastLoadY
        }
    }   
    generateCollisionGroundMap(gamePosX, gamePosY)
    {
        this.collisionGroundMap = new Array(this.dimensionWidth);
        for (var x=0;x<this.dimensionWidth;x++)
        {
            this.collisionGroundMap[x]=new Array(this.dimensionHeight);
            for (var y=0;y<this.dimensionHeight;y++)
            {
                this.collisionGroundMap[x][y] = false;
            }
        }
        this.mapObjects.forEach(element =>
        {
            this.addGroundObjectToCollisionMap(element, gamePosX, gamePosY);
        });
    }
    drawCollisionGroundMap(ctx, left, top, width, height)
    {   
        var cellWidth = width/this.dimensionWidth;
        var cellHeight = height/this.dimensionHeight;
        ctx.fillStyle = 'grey';
        ctx.fillRect (left, top, width, height);

        for (var x=0;x<this.dimensionWidth;x++)
        {
            for (var y=0;y<this.dimensionHeight;y++)
            {
                ctx.strokeStyle = 'blue';
                ctx.beginPath();
                ctx.moveTo(left + x *cellWidth, top + y * cellHeight);
                ctx.lineTo(left + (x + 1) *cellWidth, top + y * cellHeight);
                ctx.moveTo(left + x *cellWidth, top + y * cellHeight);
                ctx.lineTo(left + x *cellWidth, top + (y + 1) * cellHeight);

                ctx.stroke();
                
                ctx.fillStyle = 'red';
                if (this.collisionGroundMap[x][y])
                {
                    ctx.fillRect(left + x * cellWidth, top + y * cellHeight, cellWidth, cellHeight);
                }
            }
        }
    }
    addGroundObjectToCollisionMap(groundObject, gamePosX, gamePosY)
    {
        var moveLeft = Math.floor (groundObject.collidationMap.length / 2)
        var moveRight = Math.floor (groundObject.collidationMap[0].length / 2)

        for (var x=0; x<groundObject.collidationMap.length; x++)
        {
            for (var y=0; y<groundObject.collidationMap[0].length; y++)
            {
                var insertX = x - moveLeft + Math.round( this.dimensionWidth * (groundObject.positionX+gamePosX) );
                var insertY = y - moveRight + Math.round( this.dimensionHeight * (groundObject.positionY+gamePosY) );
                
                if (insertX>=0 && insertX< this.collisionGroundMap.length && insertY>=0 && insertY < this.collisionGroundMap[0].length)
                {
                    this.collisionGroundMap[insertX][insertY]=groundObject.collidationMap[x][y];
                }
            }
        }
    }
    isObjectCollisionWithGroundMap(object, gamePosX, gamePosY)
    {
        var moveLeft = Math.floor (object.collidationMap.length / 2)
        var moveRight = Math.floor (object.collidationMap[0].length / 2)

        for (var x=0; x<object.collidationMap.length; x++)
        {
            for (var y=0; y<object.collidationMap[0].length; y++)
            {
                var insertX = x - moveLeft + Math.round( this.dimensionWidth * (object.positionX+gamePosX) );
                var insertY = y - moveRight + Math.round( this.dimensionHeight * (object.positionY + gamePosY) );
                
                if (insertX>=0 && insertX< this.collisionGroundMap.length && insertY>=0 && insertY < this.collisionGroundMap[0].length)
                {
                    if (this.collisionGroundMap[insertX][insertY] && object.collidationMap[x][y]) return true;
                }
            }
        }        
        return false;
    }

}