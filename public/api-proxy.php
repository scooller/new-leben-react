<?php

/**
 * Lightweight PHP proxy for iLeben API.
 * Forwards /api/v1/* requests to dev.ileben.cl with auth headers.
 * Replaces Apache mod_proxy which may not be available on cPanel.
 */

$API_BASE = 'https://dev.ileben.cl';
$API_TOKEN = '19|kdzwqPh701Qi0JmtP5uAWLdVxLBHIggShc8sw5j1f5825f5a';
$AUTHORIZED_URL = 'https://test.ileben.cl';

// Build target path: /api/v1/proyectos -> https://dev.ileben.cl/api/v1/proyectos
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($requestUri, PHP_URL_PATH) ?: '';
$query = parse_url($requestUri, PHP_URL_QUERY) ?? '';
parse_str($_SERVER['QUERY_STRING'] ?? '', $qs);
if (!empty($qs)) {
    $query = http_build_query($qs);
}

// Only allow /api/* paths
if (!str_starts_with($path, '/api/')) {
    http_response_code(404);
    exit('Not found');
}

$targetUrl = $API_BASE . $path . ($query !== '' ? '?' . $query : '');

// Forward request via cURL
$ch = curl_init($targetUrl);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => 0,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Content-Type: application/json',
        'Authorization: Bearer ' . $API_TOKEN,
        'Origin: ' . $AUTHORIZED_URL,
        'Referer: ' . $AUTHORIZED_URL . '/',
    ],
]);

// Forward request body for POST/PUT/etc
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'])) {
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    $body = file_get_contents('php://input');
    if ($body !== false && $body !== '') {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    }
}

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($response === false) {
    http_response_code(502);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Proxy error', 'detail' => $error]);
    exit;
}

http_response_code($httpCode);
header('Content-Type: application/json');
echo $response;
