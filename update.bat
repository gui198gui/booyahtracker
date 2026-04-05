@echo off
echo 🚀 A iniciar o motor de busca da Bungie...
cd raid
node tracker_completo.js

echo.
echo 📦 A copiar os novos dados para o site...
:: O comando abaixo sobe uma pasta (..) e entra na pasta do site
copy ranking.json ..\booyah-tracker\src\app\ranking.json /Y

echo.
echo ✅ Concluido! Dados copiados para o dashboard.
echo 💡 Agora vai ao GitHub Desktop, faz Commit e Push para atualizar o site online!
pause