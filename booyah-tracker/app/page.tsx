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
                      {player.garden > 0 && <span className="text-[9px] bg-green-500/20 text-green-400 px-1.5 rounded border border-green-500/30 font-mono">GOS: {player.garden}</span>}
                      {player.dsc > 0 && <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 rounded border border-blue-500/30 font-mono">DSC: {player.dsc}</span>}
                      {player.vog > 0 && <span className="text-[9px] bg-yellow-500/20 text-yellow-400 px-1.5 rounded border border-yellow-500/30 font-mono">VOG: {player.vog}</span>}
                      {player.votd > 0 && <span className="text-[9px] bg-purple-500/20 text-purple-400 px-1.5 rounded border border-purple-500/30 font-mono">VOTD: {player.votd}</span>}
                      {player.kf > 0 && <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 rounded border border-red-500/30 font-mono">KF: {player.kf}</span>}
                      {player.crota > 0 && <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 rounded border border-emerald-500/30 font-mono">CE: {player.crota}</span>}
                      {player.se > 0 && <span className="text-[9px] bg-pink-500/20 text-pink-400 px-1.5 rounded border border-pink-500/30 font-mono">SE: {player.se}</span>}
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