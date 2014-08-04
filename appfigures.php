<?php
header('Access-Control-Allow-Origin: *');
	header('Content-type: application/json');
if(isset($_GET['action']) && $_GET['action']=='overall'){
	// ini_set('display_startup_errors',1);
	// ini_set('display_errors',1);
	// error_reporting(-1);
	
	$ch = curl_init();
	$headers = array('Authorization: Basic aGlAYnJlYWt0aHJvdWdoYXBwcy5jb206SmFuRGFuMDE=', 'X-Client-Key: e4fd6ac0c3bc40498bc96b76874a50a5');
	curl_setopt($ch, CURLOPT_URL, "https://api.appfigures.com/v2/sales/?products=11939389504"); # URL to post to
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1 ); # return into a variable
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers ); # custom headers, see above
	$result = json_decode(curl_exec( $ch ),true); # run!
	curl_setopt($ch, CURLOPT_URL, "https://api.appfigures.com/v2/reviews/count?products=11939389504"); # URL to post to
	$reviews = json_decode(curl_exec( $ch ),true);
	$result['reviews'] = $reviews['products']['212692220'];
	curl_close($ch);
	echo json_encode($result);
}
if(isset($_GET['action']) && $_GET['action']=='specific'){
	$from_date = isset($_GET['from_date'])?date('Y-m-d',strtotime($_GET['from_date'])):date('Y-m-d',strtotime('-7 days'));
	$to_date = isset($_GET['to_date'])?date('Y-m-d',strtotime($_GET['to_date'])):date('Y-m-d');
	//echo "https://api.appfigures.com/v2//ranks/212692220/daily/$from_date/$to_date?countries=US";
	$ch = curl_init();
	$headers = array('Authorization: Basic aGlAYnJlYWt0aHJvdWdoYXBwcy5jb206SmFuRGFuMDE=', 'X-Client-Key: e4fd6ac0c3bc40498bc96b76874a50a5');
	curl_setopt($ch, CURLOPT_URL, "https://api.appfigures.com/v2//sales/dates/?products=11939389504&start_date=$from_date&end_date=$to_date"); # URL to post to
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1 ); # return into a variable
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers ); # custom headers, see above
	echo curl_exec( $ch ); # run!
	curl_close($ch);
}