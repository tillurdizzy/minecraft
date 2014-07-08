<?php
require_once ('vo/MinecraftVO.php');
//SQL Connection Info 
define( "DATABASE_SERVER", "minecrftdb.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "minecrftdb");
define( "DATABASE_PASSWORD", "SaDie9954!");
define( "DATABASE_NAME", "minecrftdb");


//connect to the database.
$con = mysql_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD) or die ('cannot reach database');
mysql_select_db(DATABASE_NAME,$con) or die ("This is not a valid database");

$query = sprintf("SELECT * FROM june10");
$result = mysql_query($query,$con);

$resultValueObjects = array();
while ($row = mysql_fetch_object($result)) {
	$oneVO = new MinecraftVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->x1 = $row->x1;
	$oneVO->z1 = $row->y1;
	$oneVO->x2 = $row->x2;
	$oneVO->z2 = $row->y2;
	$oneVO->y1 = $row->lev1;
	$oneVO->y2 = $row->lev2;
	$oneVO->W = $row->width;
	$oneVO->H = $row->height;
	$oneVO->primaryType = $row->primaryType;
	$oneVO->subType = $row->subType;
	array_push( $resultValueObjects, $oneVO );
}

echo json_encode($resultValueObjects);
?>