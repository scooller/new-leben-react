# Auth.md

# Inmobiliaria Leben Agent Authentication & API Guide

Welcome to the **Inmobiliaria Leben** agent API and resource gateway.

## 1. Overview
Inmobiliaria Leben provides automated discovery and programmatic access to real estate development data, apartment inventory, and quoting tools in Chile (sur de Chile y Santiago).

## 2. API Endpoints
- **Base URL:** `https://ileben.cl/api/v1`
- **Public Catalog:** `GET /api/v1/proyectos`
- **Project Detail:** `GET /api/v1/proyectos/{slug}/content`
- **Contact & Quotes:** `POST /api/v1/contact-submissions`
- **MCP Server:** `https://ileben.cl/wp-json/mcp/v1/http`

## 3. Authentication for AI Agents
Protected write endpoints require a Bearer token:
```http
Authorization: Bearer <API_TOKEN>
```
To request an agent API key or webhook credentials, submit an agent registration request to `contacto@ileben.cl` or authenticate via the OAuth authorization server declared at `/.well-known/oauth-authorization-server`.

## 4. Discovery Manifests
- **API Catalog (RFC 9727):** `/.well-known/api-catalog`
- **Agent Skills (RFC v0.2.0):** `/.well-known/agent-skills/index.json`
- **MCP Server Card (SEP-1649):** `/.well-known/mcp/server-card.json`
- **ARD Manifest:** `/.well-known/ai-catalog.json`
- **OAuth Protected Resource (RFC 9728):** `/.well-known/oauth-protected-resource`
