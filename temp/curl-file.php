<?php
$file = "/temp/test.pdf";
$url = "http://localhost:8080/uri_for_accept_the_file";
$params['file'] = curl_file_create($file, mime_content_type($file),  $file );
$params['other_parames'] = "xxxx";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
$output = curl_exec($ch);
var_dump( $output );
curl_close($ch);