#!/usr/bin/env node
var argv = process.argv;
var inputStream = process.stdin;
// argv[0] = node 
// argv[1] = filename
var curl_res_raw = '', app_key = argv[2], app_secret = argv[3];

process.stdin.resume();

inputStream.on('data',function(chunk){
  curl_res_raw += chunk;
});

inputStream.on('end',function() {
  var curl_res = JSON.parse(curl_res_raw);
  delete curl_res["token_type"];
  curl_res["token"] = curl_res["access_token"];
  delete curl_res["access_token"];
  curl_res["key"] = app_key;
  curl_res["secret"] = app_secret;
  console.log(curl_res);
});


