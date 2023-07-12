class ImageObject
{
    constructor(name, file)
    {
        this.name = name;
        this.file = file;
        this.ready = false;
        this.image = new Image();
        this.loadImage();
    }
    loadImage()
    {
        var context = this;
        var image = new Image();
        image.onload = function()
        {
            context.image=this;
            context.ready=true;
        }
        image.src = this.file;
    }
}