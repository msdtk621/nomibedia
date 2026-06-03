<?php
$target = "http://localhost:3002";
$path = $_SERVER["REQUEST_URI"];

$url = $target . $path;
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER["REQUEST_METHOD"]);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$headers = array("Host: localhost:3002");
$allHeaders = getallheaders() ?: array();
foreach ($allHeaders as $key => $value) {
    if (strtolower($key) === 'host') continue;
    $headers[] = "$key: $value";
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// ボディを持ちうる全メソッドで転送する（PATCH/DELETE を含む）
$method = $_SERVER["REQUEST_METHOD"];
if (in_array($method, array("POST", "PUT", "PATCH", "DELETE"), true)) {
    $body = file_get_contents("php://input");
    if ($body !== false && $body !== "") {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    }
}

$response = curl_exec($ch);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$responseHeaders = substr($response, 0, $headerSize);
$responseBody = substr($response, $headerSize);

http_response_code($httpCode);
foreach (explode("\r\n", $responseHeaders) as $header) {
    if (empty($header) || strpos($header, "HTTP/") === 0) continue;
    $lower = strtolower($header);
    if (strpos($lower, 'transfer-encoding') === 0) continue;
    if (strpos($lower, 'connection') === 0) continue;
    header($header, false);
}

echo $responseBody;
