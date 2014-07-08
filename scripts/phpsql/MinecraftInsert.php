<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
define( "DATABASE_SERVER", "minecrftdb.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "minecrftdb");
define( "DATABASE_PASSWORD", "SaDie9954!");
define( "DATABASE_NAME", "minecrftdb");
//connect to the database.
$con = mysql_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD) or die ('cannot reach database');
mysql_select_db(DATABASE_NAME,$con) or die ("This is not a valid database");
$x1 = mysql_real_escape_string($data->X1);
$x2 = mysql_real_escape_string($data->X2);
$y1 = mysql_real_escape_string($data->Y1);
$y2 = mysql_real_escape_string($data->Y2);
$z1 = mysql_real_escape_string($data->Z1);
$z2 = mysql_real_escape_string($data->Z2);
$w = mysql_real_escape_string($data->W);
$h = mysql_real_escape_string($data->H);
$primaryType = mysql_real_escape_string($data->primaryType);
$subType = mysql_real_escape_string($data->subType);
$query = "INSERT INTO june10(x1,y1,x2,y2,lev1,lev2,width,height,primaryType,subType)
VALUES(
'" . $x1 . "', " .
"'" . $z1 . "', " .
"'" . $x2 . "', " .
"'" . $z2 . "', " .
"'" . $y1 . "', " .
"'" . $y2 . "', " .
"'" . $w . "', " .
"'" . $h . "', " .
"'" . $primaryType . "', " .
"'" . $subType . "')";
$qry_res = mysql_query($query,$con);
if ($qry_res) {
	$arr = array('msg' => "Insert successful", 'result' => $qry_res, 'params' => $x1 . ":" + $y1 . ":" . $x2 . ":" . $y2 . ":" + $z1 . ":" . $z2 . ":" . $w . ":" . $h . ":" . $primaryType . ":" . $subType);
	$jsn = json_encode($arr);
	echo($jsn);
} else {
	$arr = array('msg' => "Error inserting record", 'result' => $qry_res,'params' => $x1 . ":" + $x2 . ":" . $y1 . ":" . $y2 . ":" + $z1 . ":" . $z2 . ":" . $w . ":" . $h . ":" . $primaryType . ":" . $subType);
	$jsn = json_encode($arr);
	echo($jsn);
}
?>