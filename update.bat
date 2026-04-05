@echo off
echo 🚀 1. A atualizar dados da Bungie...
cd /d "C:\projetosgit\raid"
node tracker_completo.js

echo.
echo 📦 2. A copiar dados...
copy /Y "C:\projetosgit\raid\ranking.json" "C:\projetosgit\booyah-tracker\app\ranking.json"

echo 📤 3. A enviar para o GitHub...
git add .
git commit -m "Auto-update ranking: %date% %time%"
git push origin main

echo.
if exist "C:\projetosgit\booyah-tracker\app" (
    echo ✅ SUCESSO: O ficheiro ja esta na pasta do site!
) else (
    echo ❌ ERRO: O ficheiro NAO foi copiado. Verifica o caminho.
)

pause