<?php
$doIt=true;

if ($doIt)
{
    // Create connection
    $conn = new mysqli('localhost', 'sombrero', 'leoandluke', 'sombrero');
    // Check connection
    if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
    }
    $sql = 'truncate map;';
    $conn->query($sql);
    for ($i =0; $i<5000; $i++)
    {
        $posX = rand(-1000,1000);
        $posY = rand(-1000,1000);
        $width = 10;
        $height = 10;
        $dontdoit = false;
        if ($posX>40&&$posX<60&&$posY>40&&$posY<60)$dontdoit=true;
        $sql = 'insert into map (object,posX,posY,width,height) values ("test",'.$posX.','.$posY.','.$width.','.$height.')';
        if (! $dontdoit) $conn->query($sql);

    }

    $conn->close();

} 
else
{
    echo "missing Input";
}
?>