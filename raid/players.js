const axios = require('axios');

const API_KEY = 'bb2944672b7a4439bb2677af5fd01b67'; 

async function buscarJogador(nome, codigo) {
    try {
        const url = 'https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayerByBungieName/All/';
        
        const response = await axios.post(url, 
            { displayName: nome, displayNameCode: codigo },
            { headers: { 'X-API-Key': API_KEY } }
        );

        const dados = response.data.Response[0];
        
        if (dados) {
            console.log(`Jogador Encontrado: ${dados.bungieGlobalDisplayName}`);
            console.log(`MembershipID: ${dados.membershipId}`);
            console.log(`MembershipType: ${dados.membershipType}`);
            return dados;
        } else {
            console.log("Jogador não encontrado. Verifica o nome e o código.");
        }
    } catch (error) {
        console.error("Erro ao buscar jogador:", error.message);
    }
}

// playersteste
buscarJogador('johnny ganza', '9167');