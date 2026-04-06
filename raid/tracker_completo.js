require('dotenv').config();

const axios = require('axios');
const fs = require('fs');

const API_KEY = process.env.BUNGIE_API_KEY;
const CLAN_ID = '5343820';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

let activityCache = {}; 

/**
 *   Baixar manifest e construir mapa de atividades
 */
async function loadManifest() {
    console.log("📦 A carregar manifest...");

    const manifestResp = await axios.get(
        "https://www.bungie.net/Platform/Destiny2/Manifest/",
        { headers: { 'X-API-Key': API_KEY } }
    );

    const path = manifestResp.data.Response.jsonWorldComponentContentPaths.en.DestinyActivityDefinition;

    const fullUrl = `https://www.bungie.net${path}`;

    const data = await axios.get(fullUrl);

    const activities = data.data;

    for (const hash in activities) {
        const act = activities[hash];

        if (act.displayProperties && act.displayProperties.name) {
            activityCache[hash] = {
                name: act.displayProperties.name,
                type: act.activityTypeHash
            };
        }
    }

    console.log(`✅ Manifest carregado (${Object.keys(activityCache).length} atividades)`);
}

/**
 * 📅 Reset semanal
 */
function getLastReset() {
    const agora = new Date();
    const reset = new Date(agora);

    const diasDesdeTerca = (agora.getUTCDay() + 5) % 7;
    reset.setUTCDate(agora.getUTCDate() - diasDesdeTerca);
    reset.setUTCHours(18, 0, 0, 0);

    if (agora < reset) reset.setUTCDate(reset.getUTCDate() - 7);

    return reset;
}

/**
 *  Verificar se é RAID
 */
function isRaid(hash) {
    const name = activityCache[hash]?.name?.toLowerCase() || "";

    return (
        name.includes("raid") ||
        name.includes("last wish") ||
        name.includes("garden") ||
        name.includes("crypt") ||
        name.includes("vault") ||
        name.includes("king") ||
        name.includes("vow") ||
        name.includes("root") ||
        name.includes("crota")
    );
}

/**
 * 🔍 Nome da atividade
 */
function getActivityName(hash) {
    return activityCache[hash]?.name || `Unknown (${hash})`;
}

/**
 *  Buscar stats semanais com manifest
 */
async function getWeeklyRaidStats(mType, mId) {
    const ultimoReset = getLastReset();

    let raidCounts = {};
    let totalClears = 0;

    try {
        const profileUrl = `https://www.bungie.net/Platform/Destiny2/${mType}/Profile/${mId}/?components=200`;
        const profileResp = await axios.get(profileUrl, {
            headers: { 'X-API-Key': API_KEY }
        });

        const charIds = Object.keys(profileResp.data.Response.characters.data);

        for (const charId of charIds) {
            let page = 0;
            let done = false;
            let seen = new Set();

            while (!done) {
                const url = `https://www.bungie.net/Platform/Destiny2/${mType}/Account/${mId}/Character/${charId}/Stats/Activities/?mode=4&count=50&page=${page}`;

                const resp = await axios.get(url, {
                    headers: { 'X-API-Key': API_KEY }
                });

                const acts = resp.data.Response.activities;

                if (!acts || acts.length === 0) break;

                for (const a of acts) {
                    const id = a.activityDetails.instanceId;
                    const hash = a.activityDetails.referenceId;
                    const date = new Date(a.period);

                    if (date <= ultimoReset) {
                        done = true;
                        break;
                    }

                    const isComplete = a.values.completed.basic.value === 1;

                    if (isComplete && !seen.has(id)) {
                        seen.add(id);

                        if (!isRaid(hash)) continue;

                        const name = getActivityName(hash);

                        if (!raidCounts[name]) raidCounts[name] = 0;
                        raidCounts[name]++;
                        totalClears++;

                        console.log(`✔️ ${name} - ${date.toISOString()}`);
                    }
                }

                page++;
                await sleep(200);
            }
        }

        return { total: totalClears, raids: raidCounts };

    } catch (e) {
        console.error("❌ Erro:", e.message);
        return { total: 0, raids: {} };
    }
}

/**
 * 🏆 Tracker
 */
async function runTracker() {
    console.log("🚀 A iniciar tracker...\n");

    await loadManifest();

    let ranking = [];

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

        const stats = await getWeeklyRaidStats(mType, mId);

        ranking.push({
            name,
            total: stats.total,
            raids: stats.raids,
            lastUpdate: new Date().toLocaleString('pt-PT')
        });

        console.log(`✅ ${stats.total}`);
        await sleep(500);
    }

    ranking.sort((a, b) => b.total - a.total);

    fs.writeFileSync('./ranking.json', JSON.stringify(ranking, null, 2));

    console.log("\n🏆 RANKING ATUALIZADO");
    console.table(ranking.map(r => ({
        name: r.name,
        total: r.total
    })));
}

runTracker();