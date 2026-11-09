<?php

/**
 * Lightweight Social Share / Crawler Meta Injector (Ponytail Principle)
 * Serves index.html with dynamically injected Open Graph & Twitter Card tags for projects.
 *
 * All URLs and credentials are read dynamically from environment variables / .env (no hardcoding).
 */

function get_env_var(string $key, string $default = ''): string
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

// 1. Dynamic Site URL (never hardcoded)
$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
    || (isset($_SERVER['SERVER_PORT']) && (int)$_SERVER['SERVER_PORT'] === 443);
$protocol = $isHttps ? 'https://' : 'http://';
$detectedHost = $_SERVER['HTTP_HOST'] ?? 'localhost';
$currentOrigin = $protocol . $detectedHost;

$SITE_URL = rtrim(get_env_var('SITE_URL', get_env_var('VITE_SITE_URL', $currentOrigin)), '/');
$DEFAULT_IMAGE = $SITE_URL . '/images/home/hero-institucional.jpg';
$LOGO_URL = $SITE_URL . '/images/brand/logo-isotipo.webp';

// 2. Slug extraction
$slug = trim($_GET['slug'] ?? '');
$slug = preg_replace('/[^a-zA-Z0-9_-]/', '', $slug);

if (empty($slug)) {
    readfile(__DIR__ . '/index.html');
    exit;
}

$cleanSlug = strtolower(preg_replace('/^edificio-/', '', preg_replace('/edificio\s+/i', '', $slug)));
$canonicalUrl = $SITE_URL . '/proyectos/' . $cleanSlug;

// 3. Dynamic API Configuration from environment
$apiBase = rtrim(get_env_var('API_TARGET', get_env_var('DEV_API_TARGET', '')), '/');
$apiToken = get_env_var('API_TOKEN', get_env_var('DEV_API_TOKEN', ''));
$apiOrigin = get_env_var('API_ORIGIN', get_env_var('DEV_API_ORIGIN', $currentOrigin));

// Cache directory for fetched project meta (1 hour TTL)
$cacheFile = sys_get_temp_dir() . '/leben_proj_share_' . md5($cleanSlug) . '.json';
$projectData = null;

if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < 3600)) {
    $content = @file_get_contents($cacheFile);
    if ($content) {
        $projectData = json_decode($content, true);
    }
}

if (!$projectData && !empty($apiBase)) {
    $apiUrl = $apiBase . '/api/v1/proyectos/' . urlencode($cleanSlug) . '/content';
    $headers = [
        'Accept: application/json',
        'Origin: ' . $apiOrigin,
    ];
    if (!empty($apiToken)) {
        $headers[] = 'Authorization: Bearer ' . $apiToken;
    }

    $ch = curl_init($apiUrl);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 2,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => 0,
        CURLOPT_HTTPHEADER => $headers,
    ]);
    $res = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200 && $res) {
        $json = json_decode($res, true);
        if (!empty($json['data'])) {
            $projectData = $json['data'];
            @file_put_contents($cacheFile, json_encode($projectData));
        }
    }
}

// Fallbacks if API is unreachable or returns empty
$rawName = $projectData['name'] ?? $formattedName;
$projectName = trim(preg_replace('/^edificio\s+/i', '', $rawName));
$comuna = $projectData['hero']['location'] ?? $projectData['technical_info'][1]['value'] ?? '';
$comunaStr = !empty($comuna) ? " en {$comuna}" : '';

$pageTitle = "Edificio {$projectName}{$comunaStr} — Departamentos en Venta | Inmobiliaria Leben";
$pageDesc = $projectData['hero']['subtitle']
    ?? $projectData['overview']['description']
    ?? "Descubre Edificio {$projectName}{$comunaStr}. Departamentos exclusivos de alta gama. Cotiza online con Inmobiliaria Leben.";

// Determine best cover image
$rawImage = $projectData['overview']['collage']['left']
    ?? $projectData['project_section']['slides'][0]['img']
    ?? $projectData['project_slides'][0]['img']
    ?? $projectData['equipment']['bg_image_url']
    ?? $DEFAULT_IMAGE;

$imageUrl = (str_starts_with($rawImage, 'http://') || str_starts_with($rawImage, 'https://'))
    ? $rawImage
    : $SITE_URL . '/' . ltrim($rawImage, '/');

// Read base index.html
$indexPath = __DIR__ . '/index.html';
if (!file_exists($indexPath)) {
    http_response_code(404);
    exit('index.html not found');
}

$html = file_get_contents($indexPath);

function set_or_inject_meta(string $html, string $attr, string $key, string $content): string
{
    $safeContent = htmlspecialchars($content, ENT_QUOTES, 'UTF-8');
    $pattern = '/<meta\s+' . preg_quote($attr, '/') . '=["\']' . preg_quote($key, '/') . '["\'][^>]*>/i';
    $replacement = '<meta ' . $attr . '="' . $key . '" content="' . $safeContent . '" />';
    if (preg_match($pattern, $html)) {
        return preg_replace($pattern, $replacement, $html);
    }
    return str_ireplace('</head>', "    {$replacement}\n  </head>", $html);
}

// Safe tag replacements
$safeTitle = htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8');
$safeUrl = htmlspecialchars($canonicalUrl, ENT_QUOTES, 'UTF-8');

// Title & Canonical
$html = preg_replace('/<title>.*?<\/title>/i', "<title>{$safeTitle}</title>", $html);
$html = preg_replace('/<link rel="canonical" href=".*?"\s*\/?>/i', "<link rel=\"canonical\" href=\"{$safeUrl}\" />", $html);

// Meta Description
$html = set_or_inject_meta($html, 'name', 'description', $pageDesc);

// Core Open Graph Tags (OG)
$html = set_or_inject_meta($html, 'property', 'og:site_name', 'Inmobiliaria Leben');
$html = set_or_inject_meta($html, 'property', 'og:locale', 'es_CL');
$html = set_or_inject_meta($html, 'property', 'og:type', 'website');
$html = set_or_inject_meta($html, 'property', 'og:url', $canonicalUrl);
$html = set_or_inject_meta($html, 'property', 'og:title', $pageTitle);
$html = set_or_inject_meta($html, 'property', 'og:description', $pageDesc);
$html = set_or_inject_meta($html, 'property', 'og:image', $imageUrl);
$html = set_or_inject_meta($html, 'property', 'og:image:secure_url', $imageUrl);
$html = set_or_inject_meta($html, 'property', 'og:image:alt', $pageTitle);
$html = set_or_inject_meta($html, 'property', 'og:logo', $LOGO_URL);

// Twitter Cards
$html = set_or_inject_meta($html, 'name', 'twitter:card', 'summary_large_image');
$html = set_or_inject_meta($html, 'name', 'twitter:site', '@leben_inmuebles');
$html = set_or_inject_meta($html, 'name', 'twitter:title', $pageTitle);
$html = set_or_inject_meta($html, 'name', 'twitter:description', $pageDesc);
$html = set_or_inject_meta($html, 'name', 'twitter:image', $imageUrl);
$html = set_or_inject_meta($html, 'name', 'twitter:image:alt', $pageTitle);

header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: public, max-age=600');
echo $html;
exit;
