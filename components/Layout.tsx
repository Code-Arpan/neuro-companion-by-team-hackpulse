
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 transition-colors duration-500">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 flex flex-col gap-8 relative overflow-hidden">
        {/* Subtle decorative background blur */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-50 rounded-full -ml-16 -mb-16 blur-3xl opacity-50" />
        
        <header className="flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-400 rounded-xl shadow-sm flex items-center justify-center">
              <span className="text-white text-sm font-bold tracking-tight">NC</span>
            </div>
            <h1 className="text-xl font-semibold text-slate-800">Neuro Companion</h1>
          </div>
        </header>

        <main className="flex-1 z-10">
          {children}
        </main>
      </div>
    </div>
  );
};
