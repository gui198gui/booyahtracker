@echo off
echo 🚀 A iniciar o motor de busca da Bungie...
cd raid
node tracker_completo.js

echo 📦 A copiar os novos dados para o site...
copy ranking.json ..\booyah-tracker\src\app\ranking.json /Y

echo ✅ Concluido! O teu site ja esta atualizado.
pause