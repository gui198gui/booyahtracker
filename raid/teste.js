const axios = require('axios');

const API_KEY = 'bb2944672b7a4439bb2677af5fd01b67'; 

async function testarConexao() {
    try {
        const url = 'https://www.bungie.net/Platform/Destiny2/Manifest/';
        const response = await axios.get(url, {
            headers: { 'X-API-Key': API_KEY }
        });
        
        console.log("Sucesso! Conectado à API da Bungie.");
        console.log("Versão atual do Manifest:", response.data.Response.version);
    } catch (error) {
        console.error("Erro na conexão:", error.message);
    }
}

testarConexao();