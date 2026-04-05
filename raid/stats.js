const axios = require('axios');

const API_KEY = 'bb2944672b7a4439bb2677af5fd01b67';
const membershipType = '3';
const membershipId = '4611686018515664333';

async function getRaidStats() {
    try {
        // O modo 4 corresponde a RAIDS
        const url = `https://www.bungie.net/Platform/Destiny2/${membershipType}/Account/${membershipId}/Stats/?modes=4`;

        const response = await axios.get(url, {
            headers: { 'X-API-Key': API_KEY }
        });

        // Verificamos se existem dados de raid
        const raidData = response.data.Response.mergedAllCharacters.results.allPvE.allTime;

        if (raidData) {
            console.log("=== ESTATÍSTICAS DE RAID ===");
            console.log(`Raids Concluídas: ${raidData.activitiesCleared.basic.displayValue}`);
            console.log(`Total de Kills: ${raidData.kills.basic.displayValue}`);
            console.log(`Tempo total em Raids: ${raidData.secondsPlayed.basic.displayValue}`);
            console.log(`Melhor rácio de Kills/Morte: ${raidData.killsDeathsRatio.basic.displayValue}`);
        } else {
            console.log("Este jogador ainda não completou nenhuma raid.");
        }

    } catch (error) {
        console.error("Erro ao puxar estatísticas:", error.message);
    }
}

getRaidStats();