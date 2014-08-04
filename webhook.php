<?php
include("payments/Stripe.php");
Stripe::setApiKey("sk_test_qJGXdBKW7V06dVISkdHeQYiM");

// Retrieve the request's body and parse it as JSON
$body = @file_get_contents('php://input');
//$event_json = json_decode($body);
file_put_contents('payments_log.txt',file_get_contents('php://input'));