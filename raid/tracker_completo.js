if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const axios = require('axios');
const fs = require('fs');

const API_KEY = process.env.BUNGIE_API_KEY;
const CLAN_ID = '5343820'; 

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getWeeklyClears(mType, mId) {
    try {
        // 1. Cálculo do Reset (Terça-feira 18h UTC)
        const agora = new Date();
        const ultimoReset = new Date(agora);
        const diasDesdeTerca = (agora.getUTCDay() + 5) % 7;
        ultimoReset.setUTCDate(agora.getUTCDate() - diasDesdeTerca);
        ultimoReset.setUTCHours(18, 0, 0, 0);
        if (agora < ultimoReset) ultimoReset.setUTCDate(ultimoReset.getUTCDate() - 7);

        // 2. Buscar as personagens para não usar o "0" genérico
        const profileUrl = `https://www.bungie.net/Platform/Destiny2/${mType}/Profile/${mId}/?components=200`;
        const profileResp = await axios.get(profileUrl, { headers: { 'X-API-Key': API_KEY } });
        const charIds = Object.keys(profileResp.data.Response.characters.data);

        let count = 0;
        for (const id of charIds) {
            const url = `https://www.bungie.net/Platform/Destiny2/${mType}/Account/${mId}/Character/${id}/Stats/Activities/?mode=4&count=50`;
            const resp = await axios.get(url, { headers: { 'X-API-Key': API_KEY } });
            const acts = resp.data.Response.activities;

            if (acts) {
                const semanais = acts.filter(a => {
                    const dataRaid = new Date(a.period);
                    return dataRaid > ultimoReset && a.values.completed.basic.value === 1;
                });
                count += semanais.length;
            }
        }
        return count;
    } catch (e) { return 0; }
}

async function runTracker() {
    console.log("🚀 A iniciar scan semanal...");
    let ranking = [];

    try {
        const clanUrl = `https://www.bungie.net/Platform/GroupV2/${CLAN_ID}/Members/`;
        const clanResp = await axios.get(clanUrl, { headers: { 'X-API-Key': API_KEY } });
        const members = clanResp.data.Response.results;

        for (const m of members) {
            const name = m.destinyUserInfo.bungieGlobalDisplayName;
            const mId = m.destinyUserInfo.membershipId;
            const mType = m.destinyUserInfo.membershipType;

            process.stdout.write(`⏳ Verificando: ${name}... `);
            const clears = await getWeeklyClears(mType, mId);
            ranking.push({ name, weekly: clears, lastUpdate: new Date().toLocaleString('pt-PT') });
            console.log(`✅ ${clears}`);
            await sleep(500);
        }

        ranking.sort((a, b) => b.weekly - a.weekly);
        
        // FORÇAR A CRIAÇÃO DO FICHEIRO
        fs.writeFileSync('./ranking.json', JSON.stringify(ranking, null, 2));
        console.log("\n🏆 RANKING ATUALIZADO NO FICHEIRO ranking.json");
        console.table(ranking);

    } catch (error) {
        console.error("Erro:", error.message);
    }
}

runTracker();