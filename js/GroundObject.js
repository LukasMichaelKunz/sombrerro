class GroundObject
{
    constructor(collidationMapResolution, imageName, positionX, positionY, width, height)
    {
        this.imageName = imageName;
        this.positionX = positionX;
        this.positionY = positionY;
        this.width = width;
        this.height = height;
        this.collidationMapResolution = collidationMapResolution;
        this.ready = false;
        this.collidationMap = null;

    }

    generateCollisionMap(image)
    {
        var collidationMapResolutionY = this.collidationMapResolution;
        var collidationMapResolutionX = Math.floor(collidationMapResolutionY * (16/9));
        var collidationMapSizeX = Math.floor(collidationMapResolutionX * this.width);
        var collidationMapSizeY = Math.floor(collidationMapResolutionY * this.height);
        
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.canvas.width=image.width;
        context.canvas.height=image.height;
        context.drawImage(image, 0, 0);

        var imageData = context.getImageData (0, 0, image.width, image.height);
        var pixel = imageData.data;

        this.collidationMap = new Array (collidationMapSizeX);
        for (var x = 0; x < collidationMapSizeX; x++)
        {
            this.collidationMap[x] = new Array (collidationMapSizeY);
            for (var y = 0; y < collidationMapSizeY; y++)
            {
                this.collidationMap[x][y]= false;
            }
        }

        for (var x = 0; x < image.width; x++)
        {
            for (var y = 0; y < image.height; y++)
            {
                var pos = (y*(image.width*4)) + (x*4);
                if (pixel[pos + 3] != 0)
                {
                    var posX = Math.floor(x/image.width*collidationMapSizeX);
                    var posY = Math.floor(y/image.height*collidationMapSizeY);
                    this.collidationMap[posX][posY]= true;
                }
            }
        }
        this.ready = true;

    }
}