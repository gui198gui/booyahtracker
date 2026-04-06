import data from './ranking.json';
async function getEmblem(membershipType: number, membershipId: string) {
  const res = await fetch(
    `https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${membershipId}/?components=200`,
    {
      headers: {
        "X-API-Key": process.env.NEXT_PUBLIC_BUNGIE_API_KEY!,
      },
    }
  );

  const data = await res.json();

  const profile = data?.Response?.profile?.data;
  const emblemHash = profile?.userInfo?.iconPath;

  return emblemHash;
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
          BOOYAH NIGGA CLAN
        </h1>

        <p className="text-gray-400 mb-10 tracking-widest uppercase text-sm">
          Quem tiver em 1º é gay
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
                  className="border-t border-white/5 hover:bg-white/[0.02] transition-all"
                >

                  {/* RANK */}
                  <td className="p-5 text-gray-500 font-mono">
                    #{index + 1}
                  </td>

                  {/* NAME + RAID TAGS */}
                  <td className="p-5">
                    <div className="flex items-center gap-3">

                      {/* EMBLEM */}
                      {player.emblem && (
                        <img
                          src={`https://www.bungie.net${player.emblem}`}
                          className="w-10 h-10 rounded-md border border-white/10"
                          alt="emblem"
                        />
                      )}

                      {/* NAME */}
                      <div className="font-bold text-gray-200">
                        {player.name}
                      </div>

                    </div>

                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(player.raids || {}).map(
                        ([raid, count]: any) =>
                          count > 0 && (
                            <span
                              key={raid}
                              className="text-[9px] bg-white/5 text-gray-300 px-1.5 rounded border border-white/10 font-mono"
                            >
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