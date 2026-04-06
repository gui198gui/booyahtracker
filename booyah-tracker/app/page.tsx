import data from "./ranking.json";

const raidIcons: Record<string, string> = {
  "Root of Nightmares":
    "https://www.bungie.net/common/destiny2_content/icons/raid_root.png",
  "Garden of Salvation":
    "https://www.bungie.net/common/destiny2_content/icons/raid_gos.png",
  "Last Wish":
    "https://www.bungie.net/common/destiny2_content/icons/raid_lastwish.png",
  "King's Fall":
    "https://www.bungie.net/common/destiny2_content/icons/raid_kingsfall.png",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
          BOOYAH CLAN
        </h1>

        <p className="text-gray-400 mb-10 tracking-widest uppercase text-sm">
          Raid Leaderboard Semanal
        </p>

        <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          
          <table className="w-full text-left">
            
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs uppercase">
                <th className="p-5">Rank</th>
                <th className="p-5">Guardião</th>
                <th className="p-5 text-right">Total Clears</th>
              </tr>
            </thead>

            <tbody>
              {data.map((player: any, index: number) => (
                <tr
                  key={player.name}
                  className={`border-t border-white/5 hover:bg-white/[0.02] transition-all ${
                    index === 0
                      ? "bg-yellow-500/5 shadow-[0_0_25px_rgba(234,179,8,0.15)]"
                      : ""
                  }`}
                >
                  
                  {/* RANK */}
                  <td className="p-5 text-gray-500 font-mono">
                    #{index + 1}
                  </td>

                  {/* NAME + EMBLEM + RAIDS */}
                  <td className="p-5">
                    
                    <div className="flex items-center gap-3 font-bold text-gray-200">
                      
                      {/* EMBLEM (se existir no JSON) */}
                      {player.emblem && (
                        <img
                          src={`https://www.bungie.net${player.emblem}`}
                          className="w-10 h-10 rounded-md border border-white/10"
                          alt="emblem"
                        />
                      )}

                      {player.name}
                    </div>

                    {/* RAIDS */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Object.entries(player.raids || {}).map(
                        ([raid, count]: any) =>
                          count > 0 && (
                            <span
                              key={raid}
                              className="text-[10px] bg-white/5 text-gray-300 px-2 py-1 rounded border border-white/10 font-mono flex items-center gap-1"
                            >
                              
                              {raidIcons[raid] && (
                                <img
                                  src={raidIcons[raid]}
                                  className="w-3 h-3 opacity-80"
                                />
                              )}

                              {raid}: {count}
                            </span>
                          )
                      )}
                    </div>

                  </td>

                  {/* TOTAL CLEARS */}
                  <td className="p-5 text-right font-black text-2xl text-yellow-500">
                    {player.total ?? 0}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>
      </div>
    </main>
  );
}