@echo off
set "ROOT=%~dp0"
echo 🚀 A iniciar o motor de busca da Bungie...

:: Entra na pasta raid usando o caminho absoluto do script
cd /d "%ROOT%raid"
node tracker_completo.js

echo.
echo 📦 A copiar os novos dados para o dashboard...
:: Copia do raid para o src/app do site
copy /Y "ranking.json" "%ROOT%booyah-tracker\src\app\ranking.json"

echo.
echo ✅ Concluido! Dados atualizados no PC.
echo 💡 Agora faz Commit e Push no GitHub Desktop para atualizar o site online.
pause