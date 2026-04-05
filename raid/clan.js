const axios = require('axios');

const API_KEY = 'bb2944672b7a4439bb2677af5fd01b67';
const CLAN_ID = '5343820'; 

async function getClanMembers() {
    try {
        const url = `https://www.bungie.net/Platform/GroupV2/${CLAN_ID}/Members/`;
        const response = await axios.get(url, {
            headers: { 'X-API-Key': API_KEY }
        });

        const members = response.data.Response.results;
        console.log(`=== MEMBROS DO CLAN (${members.length}) ===`);

        for (const member of members) {
            const name = member.destinyUserInfo.bungieGlobalDisplayName;
            const mId = member.destinyUserInfo.membershipId;
            const mType = member.destinyUserInfo.membershipType;

            console.log(`- ${name} [ID: ${mId} | Type: ${mType}]`);
            
            // Aqui é onde no futuro vamos chamar a função de stats
            // para cada um destes membros.
        }

    } catch (error) {
        console.error("Erro ao listar membros:", error.message);
    }
}

getClanMembers();