class GameMap
{
    constructor()
    {

    }
    drawObjectsToGame(object, ctx, left, top, width, height, gamePosX, gamePosY)
    {
            var moveX = (object.width/2)*width;
            var moveY = (object.height/2)*height;
            ctx.drawImage(object.image, left + width * (object.positionX+gamePosX) - moveX, top + height * (object.positionY+gamePosY) - moveY, width * object.width, height * object.height);
    }
}