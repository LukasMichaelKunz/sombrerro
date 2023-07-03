class CollisionGroundMap
{
    constructor(mapResolution)
    {
        var dimensionFactor=16/9;
        this.dimensionHeight=mapResolution;
        this.dimensionWidth=Math.floor(this.dimensionHeight*dimensionFactor);
        
        this.collisionGroundMap=null;
        this.generateCollisionGroundMap();
    }
    generateCollisionGroundMap()
    {
        this.collisionGroundMap = new Array(this.dimensionWidth);
        for (var x=0;x<this.dimensionWidth;x++)
        {
            this.collisionGroundMap[x]=new Array(this.dimensionHeight);
            for (var y=0;y<this.dimensionHeight;y++)
            {
                this.collisionGroundMap[x][y] = false;
                /*if (Math.random()*2>1)
                {
                    this.collisionGroundMap[x][y] = true;
                }*/
            }
        }
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