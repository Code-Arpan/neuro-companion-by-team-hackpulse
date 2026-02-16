
import React, { useState, useCallback } from 'react';
import { Mic, Send, AlertCircle } from 'lucide-react';
import { voiceService } from '../services/voiceService';

interface TaskInputProps {
  onSubmit: (goal: string) => void;
  isProcessing: boolean;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onSubmit, isProcessing }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVoice = async () => {
    if (!voiceService.isSupported()) {
      setError("Voice input isn't supported in this browser.");
      return;
    }

    try {
      setIsListening(true);
      setError(null);
      const transcript = await voiceService.startListening();
      setText(transcript);
      if (transcript.length > 5) {
        onSubmit(transcript);
      }
    } catch (err: any) {
      console.error(err);
      setError("I couldn't catch that. Try typing instead?");
    } finally {
      setIsListening(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isProcessing) {
      onSubmit(text);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-800 leading-tight">
          What's on your mind right now?
        </h2>
        <p className="text-slate-500 text-sm">
          Tell me anything—we'll find a soft place to start together.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isListening ? "Listening with care..." : "e.g., Get started with laundry"}
          className={`w-full min-h-[140px] p-5 rounded-2xl outline-none resize-none transition-all text-lg placeholder:text-slate-300 border-2 ${
            isListening 
              ? 'border-indigo-300 bg-white ring-4 ring-indigo-50 animate-pulse-subtle' 
              : 'bg-slate-50 border-transparent focus:border-indigo-200 focus:bg-white'
          }`}
          disabled={isProcessing || isListening}
        />
        
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            type="button"
            onClick={handleVoice}
            disabled={isProcessing}
            className={`p-3 rounded-full transition-all shadow-sm ${
              isListening 
                ? 'bg-indigo-500 text-white animate-pulse scale-110 shadow-indigo-200' 
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
            title="Use Voice"
          >
            <Mic size={20} />
          </button>
          
          <button
            type="submit"
            disabled={isProcessing || isListening || !text.trim()}
            className="p-3 bg-indigo-400 text-white rounded-full hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-lg shadow-indigo-100"
          >
            <Send size={20} />
          </button>
        </div>

        {isListening && (
          <div className="absolute top-4 right-4 pointer-events-none">
            <div className="flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
      </form>

      <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
        {['Clear my desk', 'Send that email', 'Drink some water', 'Check my mail'].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setText(suggestion)}
            className="whitespace-nowrap px-4 py-2 bg-slate-100 text-slate-500 text-xs rounded-full hover:bg-slate-200 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
