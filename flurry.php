<?php
header('Access-Control-Allow-Origin: *');
	header('Content-type: application/json');
if(isset($_GET['metric'])&&isset($_GET['from_date'])&&isset($_GET['to_date'])){
	$route = $_GET['metric']!=''?$_GET['metric']:'ActiveUsers';
	$from_date = isset($_GET['from_date'])?date('Y-m-d',strtotime($_GET['from_date'])):date('Y-m-d',strtotime('-7 days'));
	$to_date = isset($_GET['to_date'])?date('Y-m-d',strtotime($_GET['to_date'])):date('Y-m-d');
	$ch = curl_init();
	$headers = array('Accept:application/json');
	curl_setopt($ch, CURLOPT_URL, "http://api.flurry.com/appMetrics/$route?apiAccessCode=H7V5S5V6QV58RVB9PBSY&apiKey=Y2TV7ZZ36Q9QDKPS24V3&startDate=$from_date&endDate=$to_date&groupBy=days"); # URL to post to
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1 ); # return into a variable
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers ); # custom headers, see above
	echo curl_exec( $ch ); # run!
	curl_close($ch);
}
