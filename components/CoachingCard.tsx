import React from 'react';
import { CoachingData } from '../types';
import { ThumbsUp, AlertCircle, Award } from 'lucide-react';

interface CoachingCardProps {
  data: CoachingData;
}

const CoachingCard: React.FC<CoachingCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          AI Coaching Card
        </h3>
      </div>
      
      <div className="flex-1 p-5 grid grid-cols-1 gap-6 overflow-y-auto">
        {/* Strengths */}
        <div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-emerald-500" />
            Winning Moments
          </h4>
          <ul className="space-y-3">
            {data.strengths.map((point, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-700 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                <span className="flex-shrink-0 w-5 h-5 bg-emerald-200 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-slate-100 pt-2"></div>

        {/* Opportunities */}
        <div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            Missed Opportunities
          </h4>
          <ul className="space-y-3">
            {data.opportunities.map((point, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-700 bg-rose-50 p-3 rounded-lg border border-rose-100">
                 <span className="flex-shrink-0 w-5 h-5 bg-rose-200 text-rose-700 rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CoachingCard;