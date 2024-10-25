import React from 'react';
import { Trophy, Target, Layers } from 'lucide-react';

interface GameStatsProps {
  score: number;
  level: number;
  lines: number;
}

export const GameStats: React.FC<GameStatsProps> = ({ score, level, lines }) => {
  return (
    <div className="flex flex-col gap-4 bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <div className="flex flex-col">
          <span className="text-sm text-gray-400">Score</span>
          <span className="text-xl font-bold">{score}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Target className="w-5 h-5 text-green-400" />
        <div className="flex flex-col">
          <span className="text-sm text-gray-400">Level</span>
          <span className="text-xl font-bold">{level}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Layers className="w-5 h-5 text-blue-400" />
        <div className="flex flex-col">
          <span className="text-sm text-gray-400">Lines</span>
          <span className="text-xl font-bold">{lines}</span>
        </div>
      </div>
    </div>
  );
};