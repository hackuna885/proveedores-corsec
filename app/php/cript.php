<?php
error_reporting(E_ALL ^ E_DEPRECATED);
header("Content-Type: text/html; Charset=UTF-8");
date_default_timezone_set('America/Mexico_City');

$correo = 'admin@corsec.com.mx';
$pws = '12345678';

$correoCript = md5($correo);
$pwsCript = md5($pws);

echo '
<h1>'.$correoCript.'</h1>
<br>
<h1>'.$pwsCript.'</h1>
';

?>