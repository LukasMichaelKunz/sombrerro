class GameObject
{
    constructor(collidationMapResolution, name, positionX, positionY, width, height)
    {
        this.name=name;
        this.positionX = positionX;
        this.positionY = positionY;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.collidationMapResolution = collidationMapResolution;
        this.image = null;
        this.backPicutres = new Array();
        this.ready = false;
        this.loaded = 0;
        this.collidationMap = null;

        this.initImages();
    }
    loadImage(index, file)
    {
        var image = new Image();
        var context = this;
        image.onload = function()
            {
                context.backPictures[index]=this;
                context.loaded++;
                if (context.loaded==context.backPictures.length)
                {
                    context.image=context.backPictures[0];
                    context.generateCollisionMap();
                }
            }
        image.src = file;
    }
    initImages()
    {
        switch(this.name)
        {
            case 'test':
                {
                    this.backPictures=new Array(2);
                    this.loadImage(0, '../image/testObject.png');
                    this.loadImage(1, '../image/Ball.png');
                    break;
                }
            default:
                {
                    alert ('no such gameObjectName: '+this.name);
                    break;
                }
        }
    }
    generateCollisionMap()
    {

        var collidationMapResolutionY = this.collidationMapResolution;
        var collidationMapResolutionX = Math.floor(collidationMapResolutionY * (16/9));
        var collidationMapSizeX = Math.floor(collidationMapResolutionX * this.width);
        var collidationMapSizeY = Math.floor(collidationMapResolutionY * this.height);
        
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.canvas.width=this.image.width;
        context.canvas.height=this.image.height;
        context.drawImage(this.image, 0, 0);

        var imageData = context.getImageData (0, 0, this.image.width, this.image.height);
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

        for (var x = 0; x < this.image.width; x++)
        {
            for (var y = 0; y < this.image.height; y++)
            {
                var pos = (y*(this.image.width*4)) + (x*4);
                if (pixel[pos + 3] != 0)
                {
                    var posX = Math.floor(x/this.image.width*collidationMapSizeX);
                    var posY = Math.floor(y/this.image.height*collidationMapSizeY);
                    this.collidationMap[posX][posY]= true;
                }
            }
        }
        if (this.loaded==this.backPictures.length)this.ready = true;

    }
    run()
    {
        this.positionX+=this.speedX;
        this.positionY+=this.speedY;
    }
    collision(object)
    {
        switch (this.name)
        {
            case 'test':
                {
                    this.image=this.backPictures[1];
                    this.generateCollisionMap();
                }
        }
    }

}