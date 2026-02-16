
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { TaskInput } from './components/TaskInput';
import { StepViewer } from './components/StepViewer';
import { HistoryViewer } from './components/HistoryViewer';
import { AppState, UserTask, TaskStep, UserProfile } from './types';
import { decomposeTask } from './services/geminiService';
import { Sparkles, History, Check, Type, Volume2, VolumeX, List } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [activeTask, setActiveTask] = useState<UserTask | null>(null);
  const [history, setHistory] = useState<UserTask[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(() => {
    const savedProfile = localStorage.getItem('sc_profile');
    return savedProfile ? JSON.parse(savedProfile) : {
      name: 'Friend',
      preferences: { useDyslexiaFont: true, highContrast: false, soundEnabled: true },
      wins: 0
    };
  });

  // Load history from local storage
  useEffect(() => {
    const savedHistory = localStorage.getItem('sc_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // Sync profile preferences to DOM
  useEffect(() => {
    if (profile.preferences.useDyslexiaFont) {
      document.body.classList.add('dyslexia-font');
    } else {
      document.body.classList.remove('dyslexia-font');
    }
  }, [profile.preferences.useDyslexiaFont]);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('sc_history', JSON.stringify(history));
    localStorage.setItem('sc_profile', JSON.stringify(profile));
  }, [history, profile]);

  const handleTaskSubmit = async (goal: string) => {
    setState(AppState.PROCESSING);
    
    const stepsData = await decomposeTask(goal);
    
    const newTask: UserTask = {
      id: Date.now().toString(),
      originalGoal: goal,
      steps: stepsData.map((s, i) => ({
        ...s,
        id: `step-${i}`,
        isCompleted: false
      })),
      createdAt: Date.now()
    };

    setActiveTask(newTask);
    setState(AppState.ACTIVE_TASK);
  };

  const handleCompleteStep = (stepId: string) => {
    if (!activeTask) return;

    const updatedSteps = activeTask.steps.map(s => 
      s.id === stepId ? { ...s, isCompleted: true } : s
    );

    setActiveTask({ ...activeTask, steps: updatedSteps });
  };

  const handleFinishTask = () => {
    if (!activeTask) return;
    
    const completedTask = { ...activeTask, completedAt: Date.now() };
    setHistory(prev => [completedTask, ...prev].slice(0, 50)); // Keep more history now that we have a viewer
    setProfile(prev => ({ ...prev, wins: prev.wins + 1 }));
    setActiveTask(null);
    setState(AppState.IDLE);
  };

  const handleCancel = () => {
    setActiveTask(null);
    setState(AppState.IDLE);
  };

  const toggleDyslexiaFont = () => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        useDyslexiaFont: !prev.preferences.useDyslexiaFont
      }
    }));
  };

  const toggleSound = () => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        soundEnabled: !prev.preferences.soundEnabled
      }
    }));
  };

  return (
    <Layout>
      {state === AppState.IDLE && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex justify-end gap-2">
            <button 
              onClick={toggleSound}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                profile.preferences.soundEnabled 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
              title={profile.preferences.soundEnabled ? 'Disable Sounds' : 'Enable Sounds'}
            >
              {profile.preferences.soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              {profile.preferences.soundEnabled ? 'Sound On' : 'Muted'}
            </button>
            <button 
              onClick={toggleDyslexiaFont}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                profile.preferences.useDyslexiaFont 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              <Type size={14} />
              {profile.preferences.useDyslexiaFont ? 'Dyslexia Font On' : 'Standard Font'}
            </button>
          </div>

          <TaskInput onSubmit={handleTaskSubmit} isProcessing={false} />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <History size={14} />
                Recent Wins
              </h3>
              {history.length > 0 && (
                <button 
                  onClick={() => setShowHistoryModal(true)}
                  className="text-[10px] font-bold text-blue-500 uppercase tracking-wider hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <List size={12} />
                  See All
                </button>
              )}
            </div>
            
            <div className="space-y-3">
              {history.length > 0 ? (
                history.slice(0, 3).map(task => (
                  <div key={task.id} className="flex items-center gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <div className="w-6 h-6 bg-green-100 text-green-500 rounded-full flex items-center justify-center shrink-0">
                      <Check size={12} />
                    </div>
                    <span className="text-sm text-slate-600 truncate">{task.originalGoal}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                  <p className="text-xs text-slate-400">Your micro-wins will show up here</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-blue-50/50 p-4 rounded-2xl flex items-center gap-4 border border-blue-100/50">
            <div className="w-10 h-10 bg-blue-100 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Lifetime Wins</p>
              <p className="text-xl font-bold text-slate-800">{profile.wins} tasks crushed</p>
            </div>
          </div>
        </div>
      )}

      {state === AppState.PROCESSING && (
        <div className="flex flex-col items-center justify-center space-y-8 py-12 animate-in fade-in duration-500">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-100 border-t-green-400 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="text-green-400 animate-pulse" size={24} />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-slate-800">Processing...</h3>
            <p className="text-slate-400 animate-pulse italic">Breaking it down into tiny pieces...</p>
          </div>
        </div>
      )}

      {state === AppState.ACTIVE_TASK && activeTask && (
        <StepViewer 
          task={activeTask} 
          onCompleteStep={handleCompleteStep}
          onFinishTask={handleFinishTask}
          onCancel={handleCancel}
          soundEnabled={profile.preferences.soundEnabled}
        />
      )}

      {showHistoryModal && (
        <HistoryViewer 
          history={history} 
          onClose={() => setShowHistoryModal(false)} 
        />
      )}
    </Layout>
  );
};

export default App;
