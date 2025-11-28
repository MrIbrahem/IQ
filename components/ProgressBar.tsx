import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = Math.round(((current) / total) * 100);

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-sm text-gray-500 mb-2 font-mono">
        <span>السؤال {current} من {total}</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};