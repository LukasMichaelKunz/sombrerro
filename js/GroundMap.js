class GroundMap
{
    constructor(mapResolution)
    {
        var dimensionFactor=16/9;
        this.dimensionHeight=mapResolution;
        this.mapResolution=mapResolution;
        this.dimensionWidth=Math.floor(this.dimensionHeight*dimensionFactor);
        this.mapObjects = new Array();
        //this.mapObjects.push(new GroundObject(this.mapResolution, 'test', 0.1, 0.1, 0.3, 0.3));
        this.imageObjects = new Array();
        this.imageObjects.push(new ImageObject('test','./image/testObject.png'));
        this.lastLoadX = 0;
        this.lastLoadY = 0;
        this.loadSpace = 0.05;

        this.newLoadData='';

        this.gameOutX = 0.5;
        this.gameOutY = 0.5;
        this.collisionGroundMap=null;

        this.load((0-this.gameOutX)*100,(0-this.gameOutY)*100,(1+this.gameOutX)*100,(1+this.gameOutY)*100);
    }
    isReady()
    {
        var check=true;
        this.mapObjects.forEach(element =>
        {
            if (!element.ready)check = false;
        });
        this.imageObjects.forEach(element=>
        {   
            if (!element.ready)check = false;

        });
        return check;
    }
    getImage(name)
    {
        var r= new Image();
        this.imageObjects.forEach(element=>
        {
            if (element.name==name)r=element.image;
        });
        return r;
    }
    isImageReady(name)
    {
        var r=false;
        this.imageObjects.forEach(element=>
            {
                if (element.name==name)
                {
                   r = element.ready;
                }
            });
        return r;
    
    }
    draw(ctx, left, top, width, height, gamePosX, gamePosY)
    {
        ctx.fillStyle='silver';
        ctx.fillRect(left,top,width,height);
        this.mapObjects.forEach(element => 
        {
            if (element.ready)
            {
                var moveX = (element.width/2)*width;
                var moveY = (element.height/2)*height;
                ctx.drawImage(this.getImage(element.imageName), left + width * (element.positionX + gamePosX) - moveX, top + height * (element.positionY + gamePosY) - moveY, width * element.width, height * element.height);
            }
        });
    }
    setObjectsReady()
    {
        this.mapObjects.forEach(element=>
        {
            if (!element.ready)
            {
                if (this.isImageReady(element.imageName))
                    {
                        element.generateCollisionMap(this.getImage(element.imageName));
                    }
            }
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

            var loadX = gamePosX-this.lastLoadX;
            var loadY = gamePosY-this.lastLoadY;

            this.lastLoadX=gamePosX;
            this.lastLoadY=gamePosY;

            if (loadX>0)
                {
                    var left = Math.floor(sLeft*100);
                    var top = Math.floor(sTop * 100);
                    var width = Math.floor(100*Math.abs(loadX));
                    var height = Math.floor((2*this.gameOutY+1)*100);
                    this.load(left - Math.round(gamePosX*100), top - Math.round(gamePosY*100), width, height);
                }
            if (loadX<0)
                {
                    var left = Math.floor((sRight*100)-(100*Math.abs(loadX)));
                    var top = Math.floor(sTop * 100);
                    var width = Math.floor(100*Math.abs(loadX));
                    var height = Math.floor((2*this.gameOutY+1)*100);
                    this.load(left - Math.round(gamePosX*100), top - Math.round(gamePosY*100), width, height);
                }
            if (loadY>0)
                {
                    var left = Math.floor(100*sLeft);
                    if (loadX>0)left+=Math.floor(loadX*100);
                    var top = Math.floor(sTop * 100);
                    var width = Math.floor(100*((2*this.gameOutY+1)-Math.abs(loadX)));
                    var height = Math.floor(100*Math.abs(loadY));
                    this.load(left - Math.round(gamePosX*100), top - Math.round(gamePosY*100), width, height);
                }
            if (loadY<0)
                {
                    var left = Math.floor(100*sLeft);
                    if (loadX>0)left+=Math.floor(loadX*100);
                    var top = Math.floor((sBottom-Math.abs(loadY)) * 100);
                    var width = Math.floor(100*((2*this.gameOutY+1)-Math.abs(loadX)));
                    var height = Math.floor(100*Math.abs(loadY));
                    this.load(left - Math.round(gamePosX*100), top - Math.round(gamePosY*100), width, height);
                }
        }
    }   
    parseNewData()
    {

        var objects = this.newLoadData.split('<object>');
        this.newLoadData='';
        for (var i =1; i<objects.length;i++)
            {
                var object = objects[i].split('<split>');
                if (object.length==5)
                {
                    //alert (object[0]+' left' + object[1]+' top' + object[2] + ' width' + object[3] + 'height' + object[4]);
                    //var newGroundObject = new GroundObject(this.mapResolution, object[0],parseInt(object[1])/100,parseInt(object[2])/100,parseInt(object[3])/100,parseInt(object[4])/100);
                    this.mapObjects.push(new GroundObject(this.mapResolution, object[0],parseInt(object[1])/100,parseInt(object[2])/100,parseInt(object[3])/100,parseInt(object[4])/100));
                }
            }
    }
    load(left, top, width, height)
    {
        //alert ('left:'+left+' top:'+top+' width:'+width+' height:'+height);
        var context = this;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                context.newLoadData +=  xhttp.responseText;
            }
        };
        var params = '?left='+left;
        params += '&top='+top;
        params += '&width='+width;
        params += '&height='+height;
        params += '&map=map';
        xhttp.open("GET", "php/readMap.php"+params, true);
        xhttp.send();
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
        {   if (element.ready)
            {
                this.addGroundObjectToCollisionMap(element, gamePosX, gamePosY);
            }
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