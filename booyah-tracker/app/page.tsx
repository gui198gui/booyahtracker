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
              {data.map((player, index) => (
                <tr key={player.name} className="border-t border-white/5 hover:bg-white/[0.02] transition-all">
                  <td className="p-5 text-gray-500 font-mono">#{index + 1}</td>
                  <td className="p-5 font-bold text-gray-200">{player.name}</td>
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