import data from './ranking.json';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
          BOOYAH CLAN
        </h1>
        <p className="text-gray-400 mb-10 tracking-widest uppercase text-sm">Raid Leaderboard Semanal</p>
          
        <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs uppercase">
                <th className="p-5">Rank</th>
                <th className="p-5">Guardião</th>
                <th className="p-5 text-right">Clears</th>
              </tr>
            </thead>
            <tbody>
              {/* Adicionado ': any' no player para o TypeScript aceitar as propriedades novas das raids */}
              {data.map((player: any, index: number) => (
                <tr key={player.name} className="border-t border-white/5 hover:bg-white/[0.02] transition-all">
                  <td className="p-5 text-gray-500 font-mono">#{index + 1}</td>
                  
                  {/* --- NOVA CÉLULA DO GUARDIÃO COM AS BADGES --- */}
                  <td className="p-5">
                    <div className="font-bold text-gray-200">{player.name}</div>
                    <div className="flex flex-wrap gap-1 mt-1">

  {player.raids?.["Garden of Salvation"] > 0 && (
    <span className="text-[9px] bg-green-500/20 text-green-400 px-1.5 rounded border border-green-500/30 font-mono">
      GOS: {player.raids["Garden of Salvation"]}
    </span>
  )}

  {player.raids?.["Deep Stone Crypt"] > 0 && (
    <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 rounded border border-blue-500/30 font-mono">
      DSC: {player.raids["Deep Stone Crypt"]}
    </span>
  )}

  {player.raids?.["Vault of Glass"] > 0 && (
    <span className="text-[9px] bg-yellow-500/20 text-yellow-400 px-1.5 rounded border border-yellow-500/30 font-mono">
      VOG: {player.raids["Vault of Glass"]}
    </span>
  )}

  {player.raids?.["Vow of the Disciple"] > 0 && (
    <span className="text-[9px] bg-purple-500/20 text-purple-400 px-1.5 rounded border border-purple-500/30 font-mono">
      VOTD: {player.raids["Vow of the Disciple"]}
    </span>
  )}

  {player.raids?.["King's Fall"] > 0 && (
    <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 rounded border border-red-500/30 font-mono">
      KF: {player.raids["King's Fall"]}
    </span>
  )}

  {player.raids?.["Crota's End"] > 0 && (
    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 rounded border border-emerald-500/30 font-mono">
      CE: {player.raids["Crota's End"]}
    </span>
  )}

  {player.raids?.["Root of Nightmares"] > 0 && (
    <span className="text-[9px] bg-pink-500/20 text-pink-400 px-1.5 rounded border border-pink-500/30 font-mono">
      RON: {player.raids["Root of Nightmares"]}
    </span>
  )}

  {player.raids?.["Last Wish"] > 0 && (
    <span className="text-[9px] bg-orange-500/20 text-orange-400 px-1.5 rounded border border-orange-500/30 font-mono">
      LW: {player.raids["Last Wish"]}
    </span>
  )}

</div>
                  </td>
                  {/* ------------------------------------------- */}

                  <td className={`p-5 text-right font-black text-2xl ${player.weekly > 0 ? 'text-yellow-500' : 'text-gray-700'}`}>
                    {player.weekly}
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