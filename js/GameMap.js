class GameMap
{
    constructor()
    {
        alert ('con');
        this.gameObjects = new Array();
        this.gameObjects.push(new GameObject(60 ,'./image/testObject.png', 0.7, 0.3, 0.2, 0.2));
    }
    draw(ctx, left, top, width, height, gamePosX, gamePosY)
    {
        this.gameObjects.forEach(element => 
        {
            var moveX = (element.width/2)*width;
            var moveY = (element.height/2)*height;
            ctx.drawImage(element.image, left + width * (element.positionX+gamePosX) - moveX, top + height * (element.positionY+gamePosY) - moveY, width * object.width, height * object.height);
        });
    }
    isReady()
    {
        alert ('here');
        var check=true;
        this.gameObjects.forEach(element =>
        {
            if (!element.ready)check = false;
        });
        return check;
    }
}