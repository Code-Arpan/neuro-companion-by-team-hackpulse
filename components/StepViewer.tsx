
import React, { useState } from 'react';
import { CheckCircle2, RefreshCw, Trophy, ArrowLeft } from 'lucide-react';
import { TaskStep, UserTask } from '../types';
import { ENCOURAGEMENTS } from '../constants';
import { soundService } from '../services/soundService';

interface StepViewerProps {
  task: UserTask;
  onCompleteStep: (stepId: string) => void;
  onFinishTask: () => void;
  onCancel: () => void;
  soundEnabled: boolean;
}

export const StepViewer: React.FC<StepViewerProps> = ({ task, onCompleteStep, onFinishTask, onCancel, soundEnabled }) => {
  const currentStepIndex = task.steps.findIndex(s => !s.isCompleted);
  const currentStep = task.steps[currentStepIndex];
  const progress = (task.steps.filter(s => s.isCompleted).length / task.steps.length) * 100;

  const [encouragement] = useState(() => 
    ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]
  );

  const handleComplete = (id: string) => {
    if (soundEnabled) soundService.playStepChime();
    onCompleteStep(id);
  };

  const handleFinish = () => {
    if (soundEnabled) soundService.playTaskMelody();
    onFinishTask();
  };

  if (!currentStep) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-8 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center shadow-inner">
          <Trophy size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">Mission Accomplished!</h2>
          <p className="text-slate-500">You broke through the wall. Great job.</p>
        </div>
        <button
          onClick={handleFinish}
          className="w-full py-4 bg-green-400 text-white rounded-2xl font-semibold shadow-lg shadow-green-100 hover:bg-green-500 transition-all"
        >
          Finish & Save Win
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={onCancel}
          className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Step {currentStepIndex + 1} of {task.steps.length}
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="space-y-6">
        <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 min-h-[160px] flex items-center justify-center text-center">
          <p className="text-2xl font-medium text-slate-800 leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm italic">
          <RefreshCw size={14} className="animate-spin-slow" />
          {encouragement}
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => handleComplete(currentStep.id)}
          className="w-full py-5 bg-blue-500 text-white rounded-2xl font-semibold shadow-lg shadow-blue-100 hover:bg-blue-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg"
        >
          <CheckCircle2 size={24} />
          Done with this bit
        </button>
        
        <button
          onClick={() => handleComplete(currentStep.id)} 
          className="w-full py-3 text-slate-400 font-medium hover:text-slate-600 transition-colors text-sm"
        >
          This step is too hard / Skip it
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Overall Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-400 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
