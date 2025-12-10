import React from 'react';
import { TranscriptSegment } from '../types';
import { User, Users } from 'lucide-react';

interface TranscriptProps {
  segments: TranscriptSegment[];
}

const Transcript: React.FC<TranscriptProps> = ({ segments }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-500" />
          Call Transcript
        </h3>
        <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
          Diarized
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {segments.map((segment, index) => {
          // Heuristic: Assume 'Salesperson' or similar is "me", others are "them"
          const isSalesperson = segment.speaker.toLowerCase().includes('sales') || 
                                segment.speaker.toLowerCase().includes('agent') || 
                                segment.speaker.toLowerCase().includes('rep');

          return (
            <div key={index} className={`flex flex-col ${isSalesperson ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1 px-1">
                 {!isSalesperson && <User className="w-3 h-3 text-slate-400" />}
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                   {segment.speaker}
                 </span>
                 <span className="text-xs text-slate-300">•</span>
                 <span className="text-xs text-slate-400 font-mono">{segment.timestamp}</span>
                 {isSalesperson && <User className="w-3 h-3 text-indigo-400" />}
              </div>
              
              <div 
                className={`
                  max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed
                  ${isSalesperson 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-slate-100 text-slate-800 rounded-tl-none'}
                `}
              >
                {segment.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Transcript;