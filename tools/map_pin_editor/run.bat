@echo off
title Editor de Pines de Mapa - Leben
cd /d "%~dp0"
python main.py
if %ERRORLEVEL% neq 0 (
    echo.
    echo Error al iniciar la aplicacion. Verifique que Python y Pillow esten instalados:
    echo pip install -r requirements.txt
    pause
)
