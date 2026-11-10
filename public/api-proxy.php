<?php

/**
 * Lightweight PHP proxy for iLeben API.
 * Forwards /api/v1/* requests to the configured target API with auth headers.
 * Replaces Apache mod_proxy which may not be available on cPanel.
 *
 * All URLs and tokens are read dynamically from environment variables or .env (never hardcoded).
 */

function get_proxy_env(string $key, string $default = ''): string
{
    $val = getenv($key);
    if ($val !== false && $val !== '') {
        return $val;
    }
    if (!empty($_ENV[$key])) {
        return $_ENV[$key];
    }
    if (!empty($_SERVER[$key])) {
        return $_SERVER[$key];
    }

    static $env = null;
    if ($env === null) {
        $env = [];
        $candidates = [
            dirname(__DIR__) . '/.env.local',
            dirname(__DIR__) . '/.env',
            __DIR__ . '/.env.local',
            __DIR__ . '/.env',
        ];
        foreach ($candidates as $file) {
            if (file_exists($file) && is_readable($file)) {
                $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                foreach ($lines as $line) {
                    $line = trim($line);
                    if ($line === '' || str_starts_with($line, '#')) {
                        continue;
                    }
                    if (str_contains($line, '=')) {
                        [$k, $v] = explode('=', $line, 2);
                        $k = trim($k);
                        $v = trim($v, " \t\n\r\0\x0B\"'");
                        if (!isset($env[$k])) {
                            $env[$k] = $v;
                        }
                    }
                }
            }
        }
    }

    return $env[$key] ?? $default;
}

$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
    || (isset($_SERVER['SERVER_PORT']) && (int)$_SERVER['SERVER_PORT'] === 443);
$currentOrigin = ($isHttps ? 'https://' : 'http://') . ($_SERVER['HTTP_HOST'] ?? 'localhost');

$rawApiBase = get_proxy_env('API_TARGET', get_proxy_env('DEV_API_TARGET', 'https://dev.ileben.cl'));
$API_BASE = preg_replace('#/(?:api(?:/v1)?)?/?$#', '', rtrim($rawApiBase, '/'));
$API_TOKEN = get_proxy_env('API_TOKEN', get_proxy_env('DEV_API_TOKEN', ''));
$AUTHORIZED_URL = rtrim(get_proxy_env('API_ORIGIN', get_proxy_env('DEV_API_ORIGIN', $currentOrigin)), '/');
$REFERER = get_proxy_env('API_REFERER', get_proxy_env('DEV_API_REFERER', $AUTHORIZED_URL . '/'));

if (empty($API_BASE)) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'API target not configured in environment (API_TARGET or DEV_API_TARGET)']);
    exit;
}

// Build target path: /api/v1/proyectos -> {$API_BASE}/api/v1/proyectos
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

$headers = [
    'Accept: application/json',
    'Content-Type: application/json',
    'Origin: ' . $AUTHORIZED_URL,
    'Referer: ' . $REFERER,
];

if (!empty($API_TOKEN)) {
    $headers[] = 'Authorization: Bearer ' . $API_TOKEN;
}

// Forward request via cURL
$ch = curl_init($targetUrl);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => 0,
    CURLOPT_HTTPHEADER => $headers,
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
