"use client";

import { useEffect, useState } from "react";

type Player = {
  name: string;
  total: number;
  raids: Record<string, number>;
  lastUpdate: string;
};

export default function Page() {
  const [data, setData] = useState<Player[]>([]);

  useEffect(() => {
    fetch("/ranking.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🔥 Raid Ranking</h1>

      <div className="space-y-6">
        {data.map((player, index) => (
          <div
            key={player.name}
            className="border border-gray-700 rounded-xl p-4 bg-zinc-900"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">
                #{index + 1} {player.name}
              </h2>

              <span className="text-green-400 font-bold">
                {player.total} clears
              </span>
            </div>

            {/* RAIDS */}
            <div className="mt-3 space-y-1 text-sm text-gray-300">
              {Object.entries(player.raids).map(([raid, count]) => (
                <div key={raid} className="flex justify-between">
                  <span>{raid}</span>
                  <span>{count}</span>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="text-xs text-gray-500 mt-2">
              Updated: {player.lastUpdate}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}