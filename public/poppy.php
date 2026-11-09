<?php

/**
 * Personal Agent Protocol (Poppy) Discovery Manifest
 * Spec: https://personalagentprotocol.org/docs/spec#3-discovery
 */

$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
    || (isset($_SERVER['SERVER_PORT']) && (int)$_SERVER['SERVER_PORT'] === 443);
$protocol = $isHttps ? 'https://' : 'http://';
$detectedHost = $_SERVER['HTTP_HOST'] ?? 'ileben.cl';
$cleanDomain = preg_replace('/^www\./i', '', $detectedHost);
$issuer = $protocol . $detectedHost;

$manifest = [
    'protocol_version' => '0.1',
    'organization' => [
        'name' => 'Inmobiliaria Leben',
        'domain' => $cleanDomain,
    ],
    'auth' => [
        'issuer' => $issuer,
    ],
    'web' => new stdClass(),
    'apis' => [
        [
            'name' => 'catalog-api',
            'endpoint' => $issuer . '/api/v1/proyectos',
            'description' => 'Catálogo de proyectos y departamentos disponibles en venta',
        ],
    ],
    'agent' => [
        'name' => 'leben-agent',
        'description' => 'Agente comercial y cotizador de proyectos inmobiliarios Leben',
    ],
];

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, HEAD, OPTIONS');
header('Cache-Control: no-cache, no-store, must-revalidate, max-age=0');
echo json_encode($manifest, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
exit;

