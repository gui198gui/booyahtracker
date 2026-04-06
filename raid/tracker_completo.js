require('dotenv').config();
let activityTypeCache = {};
let raidTypeIds = new Set();
const axios = require('axios');
const fs = require('fs');

const API_KEY = process.env.BUNGIE_API_KEY;
const CLAN_ID = '5343820';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let raidTypeHashes = new Set();
let activityCache = {};

/**
 * 📦 Load Manifest
 */
async function loadManifest() {
    console.log("📦 A carregar manifest...");

    const manifestResp = await axios.get(
        "https://www.bungie.net/Platform/Destiny2/Manifest/",
        { headers: { 'X-API-Key': API_KEY } }
    );

    const path =
        manifestResp.data.Response.jsonWorldComponentContentPaths.en.DestinyActivityDefinition;

    const fullUrl = `https://www.bungie.net${path}`;

    const data = await axios.get(fullUrl);

    const activities = data.data;

    for (const hash in activities) {
        const act = activities[hash];

        if (!act.displayProperties?.name) continue;

        activityCache[hash] = {
            name: act.displayProperties.name,
            typeHash: act.activityTypeHash
        };
    }
    const typeResp = await axios.get(
    "https://www.bungie.net/Platform/Destiny2/Manifest/",
    { headers: { 'X-API-Key': API_KEY } }
);

const typePath =
    typeResp.data.Response.jsonWorldComponentContentPaths.en.DestinyActivityTypeDefinition;

const typeUrl = `https://www.bungie.net${typePath}`;

const typeData = await axios.get(typeUrl);

const types = typeData.data;

for (const hash in types) {
    const t = types[hash];

    activityTypeCache[hash] = t;
}
for (const hash in activityTypeCache) {
    const type = activityTypeCache[hash];

    const name = type.displayProperties?.name?.toLowerCase();

    if (name === "raid") {
        raidTypeIds.add(hash);
    }
}

    console.log(`✅ Manifest carregado (${Object.keys(activityCache).length})`);
}

/**
 * 📅 Reset semanal (terça 18h UTC)
 */
function getLastReset() {
    const now = new Date();
    const reset = new Date(now);

    const daysSinceTuesday = (now.getUTCDay() + 5) % 7;
    reset.setUTCDate(now.getUTCDate() - daysSinceTuesday);
    reset.setUTCHours(18, 0, 0, 0);

    if (now < reset) reset.setUTCDate(reset.getUTCDate() - 7);

    return reset;
}

/**
 * 🧠 RAID FILTER (FIXED - não baseado em "raid" string genérica)
 */
function isRaid(hash) {
    const act = activityCache[hash];
    if (!act) return false;

    return raidTypeIds.has(String(act.typeHash));
}


/**
 * 🧾 Get activity name
 */
function getActivityName(hash) {
    return activityCache[hash]?.name || `Unknown (${hash})`;
}

/**
 * 🔍 MAIN STATS
 */
async function getWeeklyRaidStats(mType, mId) {
    const reset = getLastReset();

    let raidCounts = {};
    let total = 0;

    try {
        const profileUrl = `https://www.bungie.net/Platform/Destiny2/${mType}/Profile/${mId}/?components=200`;

        const profileResp = await axios.get(profileUrl, {
            headers: { 'X-API-Key': API_KEY }
        });

        const charIds = Object.keys(profileResp.data.Response.characters.data);

        for (const charId of charIds) {
            let page = 0;
            let seen = new Set();
            let stop = false;

            while (!stop) {
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

    // 1. RESET CHECK (não quebra logo tudo)
    if (date <= reset) {
        stop = true;
        continue;
    }

    // 2. VALID CLEAR REAL
    if (!isRealClear(a)) continue;

    // 3. RAID FILTER
    if (!isRaid(hash)) continue;

    // 4. DUPLICADOS
    if (seen.has(id)) continue;
    seen.add(id);

    const name = getActivityName(hash);

    raidCounts[name] = (raidCounts[name] || 0) + 1;
    total++;

    console.log(`✔️ ${name} - ${date.toISOString()}`);
}

                page++;
                await sleep(200);
            }
        }

        return { total, raids: raidCounts };

    } catch (e) {
        console.error("❌ Erro:", e.message);
        return { total: 0, raids: {} };
    }
}

function isRealClear(activity) {
    const completed = activity.values?.completed?.basic?.value;
    const completionReason = activity.values?.completionReason?.basic?.value;

    return (
        completed === 1 &&
        activity.activityDetails?.mode === 4 &&
        completionReason !== 3 // 3 = abandoned / invalid run
    );
}

/**
 * 🏆 TRACKER
 */
async function runTracker() {
    console.log("🚀 Tracker iniciado...\n");

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
        membershipId: mId,
        membershipType: mType,
        lastUpdate: new Date().toLocaleString('pt-PT')
    });

        console.log(`✅ ${stats.total}`);
        await sleep(400);
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