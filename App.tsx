import React, { useState, useEffect } from 'react';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Clock, BarChart2, ChevronLeft, ChevronRight } from 'lucide-react';
import { FeedingEntry, ViewMode } from './types';
import { getStoredEntries, saveEntry, deleteEntry } from './services/storageService';
import { Timeline } from './components/Timeline';
import { CalendarView } from './components/CalendarView';
import { Stats } from './components/Stats';
import { EntryModal } from './components/EntryModal';

const App: React.FC = () => {
  const [entries, setEntries] = useState<FeedingEntry[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewMode>('TIMELINE');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("12:00");

  useEffect(() => {
    setEntries(getStoredEntries());
  }, []);

  const handleAddEntry = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    setIsModalOpen(true);
  };

  const handleSaveEntry = (newEntryData: Omit<FeedingEntry, 'id'>) => {
    const newEntry: FeedingEntry = {
      ...newEntryData,
      id: crypto.randomUUID(),
    };
    const updated = saveEntry(newEntry);
    setEntries(updated);
  };

  const handleDeleteEntry = (id: string) => {
    // Custom confirm could be better, but native is fine for MVP
    if (confirm('Remove this entry?')) {
      const updated = deleteEntry(id);
      setEntries(updated);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    setCurrentDate(curr => direction === 'prev' ? subDays(curr, 1) : addDays(curr, 1));
  };

  // Header Title Logic
  const isToday = isSameDay(currentDate, new Date());
  const title = isToday ? "Today" : format(currentDate, 'EEEE');
  const subtitle = format(currentDate, 'MMMM d, yyyy');

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col max-w-lg mx-auto shadow-2xl shadow-stone-200/50">
      
      {/* Top Header (Sticky) */}
      <header className="sticky top-0 z-40 bg-[#faf9f6]/90 backdrop-blur-md px-4 py-4">
        <div className="flex items-center justify-between">
          {view === 'TIMELINE' ? (
            <>
              <button 
                onClick={() => navigateDate('prev')} 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-stone-100 text-stone-400 hover:text-teal-500 hover:border-teal-200 transition-all"
              >
                <ChevronLeft size={22} />
              </button>
              
              <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
                <h1 className="text-xl font-extrabold text-stone-700 tracking-tight">{title}</h1>
                <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mt-0.5">{subtitle}</p>
              </div>

              <button 
                onClick={() => navigateDate('next')} 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-stone-100 text-stone-400 hover:text-teal-500 hover:border-teal-200 transition-all"
              >
                <ChevronRight size={22} />
              </button>
            </>
          ) : (
            <div className="w-full text-center py-1">
              <h1 className="text-xl font-extrabold text-stone-700">
                {view === 'CALENDAR' ? 'Past Entries' : 'Trends'}
              </h1>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {view === 'TIMELINE' && (
          <Timeline 
            currentDate={currentDate} 
            entries={entries} 
            onAddEntry={handleAddEntry}
            onDeleteEntry={handleDeleteEntry}
          />
        )}
        {view === 'CALENDAR' && (
          <CalendarView 
            currentDate={currentDate} 
            onDateSelect={(date) => {
              setCurrentDate(date);
              setView('TIMELINE');
            }}
            entries={entries}
          />
        )}
        {view === 'STATS' && (
          <Stats entries={entries} />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 max-w-lg w-full bg-white/90 backdrop-blur-lg border-t border-stone-100 pb-safe pt-2 px-6 flex justify-around items-center z-50 rounded-t-[2rem] shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
        <button 
          onClick={() => setView('TIMELINE')}
          className={`p-4 rounded-2xl flex flex-col items-center gap-1 transition-all duration-300 ${view === 'TIMELINE' ? 'text-teal-500 -translate-y-2' : 'text-stone-300 hover:text-stone-400'}`}
        >
          <Clock size={26} strokeWidth={view === 'TIMELINE' ? 2.5 : 2} />
          <span className={`text-[10px] font-bold ${view === 'TIMELINE' ? 'opacity-100' : 'opacity-0'} transition-opacity`}>Daily</span>
        </button>
        
        <button 
          onClick={() => setView('CALENDAR')}
          className={`p-4 rounded-2xl flex flex-col items-center gap-1 transition-all duration-300 ${view === 'CALENDAR' ? 'text-teal-500 -translate-y-2' : 'text-stone-300 hover:text-stone-400'}`}
        >
          <CalendarIcon size={26} strokeWidth={view === 'CALENDAR' ? 2.5 : 2} />
          <span className={`text-[10px] font-bold ${view === 'CALENDAR' ? 'opacity-100' : 'opacity-0'} transition-opacity`}>Calendar</span>
        </button>

        <button 
          onClick={() => setView('STATS')}
          className={`p-4 rounded-2xl flex flex-col items-center gap-1 transition-all duration-300 ${view === 'STATS' ? 'text-teal-500 -translate-y-2' : 'text-stone-300 hover:text-stone-400'}`}
        >
          <BarChart2 size={26} strokeWidth={view === 'STATS' ? 2.5 : 2} />
          <span className={`text-[10px] font-bold ${view === 'STATS' ? 'opacity-100' : 'opacity-0'} transition-opacity`}>Stats</span>
        </button>
      </nav>

      {/* Modals */}
      <EntryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEntry}
        initialDate={currentDate}
        initialTimeSlot={selectedTimeSlot}
      />
      
    </div>
  );
};

export default App;