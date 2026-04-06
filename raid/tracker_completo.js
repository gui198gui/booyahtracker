require('dotenv').config();

const axios = require('axios');
const fs = require('fs');

const API_KEY = process.env.BUNGIE_API_KEY;
const CLAN_ID = '5343820';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function getLastReset() {
    const agora = new Date();
    const reset = new Date(agora);

    const diasDesdeTerca = (agora.getUTCDay() + 5) % 7;
    reset.setUTCDate(agora.getUTCDate() - diasDesdeTerca);
    reset.setUTCHours(18, 0, 0, 0);

    if (agora < reset) reset.setUTCDate(reset.getUTCDate() - 7);

    return reset;
}

async function getWeeklyClears(mType, mId) {
    const ultimoReset = getLastReset();

    console.log(`📅 Reset considerado: ${ultimoReset.toISOString()}`);

    try {
        // Buscar personagens
        const profileUrl = `https://www.bungie.net/Platform/Destiny2/${mType}/Profile/${mId}/?components=200`;
        const profileResp = await axios.get(profileUrl, {
            headers: { 'X-API-Key': API_KEY }
        });

        const charIds = Object.keys(profileResp.data.Response.characters.data);

        let totalClears = 0;

        for (const charId of charIds) {
            let page = 0;
            let done = false;
            let seenActivityIds = new Set();

            while (!done) {
                const url = `https://www.bungie.net/Platform/Destiny2/${mType}/Account/${mId}/Character/${charId}/Stats/Activities/?mode=4&count=50&page=${page}`;
                
                const resp = await axios.get(url, {
                    headers: { 'X-API-Key': API_KEY }
                });

                const acts = resp.data.Response.activities;

                if (!acts || acts.length === 0) break;

                for (const a of acts) {
                    const activityId = a.activityDetails.instanceId;
                    const dataRaid = new Date(a.period);

                    // parar se já é antes do reset
                    if (dataRaid <= ultimoReset) {
                        done = true;
                        break;
                    }

                    const isComplete = a.values.completed.basic.value === 1;

                    if (isComplete && !seenActivityIds.has(activityId)) {
                        seenActivityIds.add(activityId);
                        totalClears++;

                        console.log(`✔️ Clear contado (${charId}): ${dataRaid.toISOString()}`);
                    }
                }

                page++;
                await sleep(200);
            }
        }

        return totalClears;

    } catch (e) {
        console.error("❌ Erro em getWeeklyClears:", e.message);
        return 0;
    }
}

async function runTracker() {
    console.log("🚀 A iniciar scan semanal...\n");

    let ranking = [];

    try {
        const clanUrl = `https://www.bungie.net/Platform/GroupV2/${CLAN_ID}/Members/`;
        const clanResp = await axios.get(clanUrl, {
            headers: { 'X-API-Key': API_KEY }
        });

        const members = clanResp.data.Response.results;

        for (const m of members) {
            const name = m.destinyUserInfo.bungieGlobalDisplayName;
            const mId = m.destinyUserInfo.membershipId;
            const mType = m.destinyUserInfo.membershipType;

            process.stdout.write(`⏳ ${name}... `);

            const clears = await getWeeklyClears(mType, mId);

            ranking.push({
                name,
                weekly: clears,
                lastUpdate: new Date().toLocaleString('pt-PT')
            });

            console.log(`✅ ${clears}`);
            await sleep(500);
        }

        ranking.sort((a, b) => b.weekly - a.weekly);

        fs.writeFileSync('./ranking.json', JSON.stringify(ranking, null, 2));

        console.log("\n🏆 RANKING ATUALIZADO");
        console.table(ranking);

    } catch (error) {
        console.error("Erro:", error.message);
    }
}

runTracker();