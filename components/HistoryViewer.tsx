
import React from 'react';
import { X, Trophy, Calendar, CheckCircle } from 'lucide-react';
import { UserTask } from '../types';

interface HistoryViewerProps {
  history: UserTask[];
  onClose: () => void;
}

export const HistoryViewer: React.FC<HistoryViewerProps> = ({ history, onClose }) => {
  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <header className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <Trophy size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Your Wins</h2>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Hall of Fame</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center">
                <CheckCircle size={32} />
              </div>
              <p className="text-slate-400 font-medium">No tasks completed yet. Your wins will appear here!</p>
            </div>
          ) : (
            history.map((task) => (
              <div 
                key={task.id} 
                className="group p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-green-200 hover:bg-white transition-all duration-300"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <p className="text-slate-800 font-medium leading-snug">
                      {task.originalGoal}
                    </p>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      <Calendar size={12} />
                      <span>{task.completedAt ? formatDate(task.completedAt) : 'Recent'}</span>
                    </div>
                  </div>
                  <div className="shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle size={16} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <footer className="p-6 bg-slate-50 border-t border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
          >
            Keep going
          </button>
        </footer>
      </div>
    </div>
  );
};
