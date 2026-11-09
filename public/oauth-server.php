<?php

/**
 * RFC 8414 OAuth 2.0 Authorization Server Discovery & Poppy Binding
 * Spec: https://www.rfc-editor.org/rfc/rfc8414
 * Poppy Spec: https://personalagentprotocol.org/docs/spec#3-discovery
 */

$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
    || (isset($_SERVER['SERVER_PORT']) && (int)$_SERVER['SERVER_PORT'] === 443);
$protocol = $isHttps ? 'https://' : 'http://';
$detectedHost = $_SERVER['HTTP_HOST'] ?? 'ileben.cl';
$cleanDomain = preg_replace('/^www\./i', '', $detectedHost);
$issuer = $protocol . $detectedHost;

$metadata = [
    'issuer' => $issuer,
    'authorization_endpoint' => $issuer . '/login',
    'token_endpoint' => $issuer . '/api/v1/login',
    'revocation_endpoint' => $issuer . '/oauth/revoke',
    'registration_endpoint' => $issuer . '/api/v1/register',
    'poppy_domains' => array_values(array_unique([
        $cleanDomain,
        'ileben.cl',
        'test.ileben.cl',
        'dev.ileben.cl',
    ])),
    'response_types_supported' => [
        'token',
        'code',
    ],
    'grant_types_supported' => [
        'client_credentials',
        'password',
        'authorization_code',
    ],
    'token_endpoint_auth_methods_supported' => [
        'client_secret_post',
        'bearer',
    ],
    'agent_auth' => [
        'register_uri' => $issuer . '/auth.md',
        'supported_identity_types' => [
            'agent',
            'organization',
        ],
        'credential_types' => [
            'api_key',
            'bearer_token',
        ],
    ],
];

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, HEAD, OPTIONS');
header('Cache-Control: no-cache, no-store, must-revalidate, max-age=0');
echo json_encode($metadata, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
exit;

