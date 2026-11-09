<?php

/**
 * Markdown for Agents Negotiation Endpoint
 * RFC / Cloudflare Agent spec: returns clean Markdown when Accept: text/markdown is present.
 */

$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
    || (isset($_SERVER['SERVER_PORT']) && (int)$_SERVER['SERVER_PORT'] === 443);
$currentOrigin = ($isHttps ? 'https://' : 'http://') . ($_SERVER['HTTP_HOST'] ?? 'ileben.cl');

$rawPath = trim($_GET['path'] ?? '', '/');
$cleanPath = strtolower(preg_replace('/[^a-zA-Z0-9_\-\/]/', '', $rawPath));

$title = 'Inmobiliaria Leben';
$md = '';

if (empty($cleanPath)) {
    // Homepage
    $md = <<<MD
# Inmobiliaria Leben — Departamentos y Proyectos en Venta en Chile

Descubre departamentos exclusivos en venta en las mejores ubicaciones del sur y centro de Chile: **Puerto Varas**, **Temuco** y **Santiago**. Proyectos diseñados con altos estándares de arquitectura, eficiencia energética y plusvalía garantizada.

## Proyectos Destacados
- **Edificio INN** (Temuco): Departamentos modernos con excelente conectividad, áreas comunes de vanguardia y terminaciones premium.
- **Cumbres del Sur** (Puerto Varas): Entorno natural incomparable, vista a volcanes y lagos, alta demanda residencial y turística.
- **Parque Frutillar** (Frutillar / Llanquihue): Calidad de vida sureña con diseño sustentable.

## Servicios Disponibles
- [Cotizador Online]({$currentOrigin}/cotizador): Cotiza departamentos en tiempo real con valores actualizados en UF.
- [Inversión Inmobiliaria]({$currentOrigin}/invest): Asesoría especializada para rentabilizar tu patrimonio.
- [Círculo de Brokers]({$currentOrigin}/brokers): Comercialización estratégica y comisiones atractivas.
- [Nosotros]({$currentOrigin}/nosotros): Trayectoria y compromiso del Grupo Leben.

## Contacto & Asistencia
- Sitio web: {$currentOrigin}
- Correo: contacto@ileben.cl
- API Discovery: {$currentOrigin}/.well-known/api-catalog
MD;
} elseif (str_starts_with($cleanPath, 'proyectos/')) {
    $slug = substr($cleanPath, strlen('proyectos/'));
    $projName = ucwords(str_replace(['-', '_'], ' ', preg_replace('/^edificio-/', '', $slug)));
    $md = <<<MD
# Edificio {$projName} — Inmobiliaria Leben

Proyecto residencial exclusivo comercializado por Inmobiliaria Leben.

## Características Principales
- **Ubicación:** Chile (Zona Sur y Metropolitana)
- **Tipologías:** Departamentos de 1, 2 y 3 dormitorios
- **Terminaciones:** Cocina equipada, ventanas termopanel, envolvente térmico
- **Espacios Comunes:** Quincho panorámico, gimnasio equipado, hall de doble altura y áreas verdes

## Acciones Disponibles
- [Cotizar este proyecto]({$currentOrigin}/proyectos/{$slug})
- [Ver planos y disponibilidad]({$currentOrigin}/cotizador?proyecto={$slug})
- [Ficha técnica oficial]({$currentOrigin}/api/v1/proyectos/{$slug}/content)
MD;
} elseif ($cleanPath === 'cotizador') {
    $md = <<<MD
# Cotizador de Departamentos en Línea — Inmobiliaria Leben

Herramienta oficial para calcular valores, dividendos estimados y planes de pago en UF.

## Instrucciones para Agentes
1. Selecciona la comuna o proyecto deseado.
2. Filtra por número de dormitorios (1D, 2D, 3D).
3. Obtén el plano de planta, metraje útil, terraza y precio total en UF sin decimales.
4. Puedes enviar una solicitud de cotización directamente vía API en `POST /api/v1/contact-submissions`.
MD;
} elseif ($cleanPath === 'invest') {
    $md = <<<MD
# Inversión Inmobiliaria — Inmobiliaria Leben

Asesoría integral para inversionistas que buscan rentabilidad y plusvalía en Chile.

## Modelos de Inversión
- **Renta Residencial:** Alta demanda de arriendo en ciudades universitarias y turísticas (Temuco, Puerto Varas).
- **Asesoría Financiera:** Gestión de crédito hipotecario y beneficios tributarios.
MD;
} else {
    $pageName = ucwords(str_replace(['-', '_', '/'], ' ', $cleanPath));
    $md = <<<MD
# {$pageName} — Inmobiliaria Leben

Información oficial de Inmobiliaria Leben. Para consultar el catálogo completo de proyectos, visita [Catálogo de Proyectos]({$currentOrigin}/api/v1/proyectos).
MD;
}

$tokens = (int)ceil(strlen($md) / 4);

header('Content-Type: text/markdown; charset=UTF-8');
header('Vary: Accept');
header('x-markdown-tokens: ' . $tokens);
header('Access-Control-Allow-Origin: *');
header('Cache-Control: public, max-age=600');
echo $md;
exit;
