import React, { useMemo, useRef, useEffect, useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { FeedingEntry } from '../types';
import { Plus, Milk, Utensils, Trash2 } from 'lucide-react';

interface TimelineProps {
  currentDate: Date;
  entries: FeedingEntry[];
  onAddEntry: (timeSlot: string) => void;
  onDeleteEntry: (id: string) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ 
  currentDate, 
  entries, 
  onAddEntry, 
  onDeleteEntry 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Force re-render every minute to keep current time indicator fresh
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  // Filter entries for the current day
  const dayEntries = useMemo(() => {
    return entries.filter(e => isSameDay(e.timestamp, currentDate));
  }, [entries, currentDate]);

  // Generate 30-min slots
  const slots = useMemo(() => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      times.push({ h, m: 0 });
      times.push({ h, m: 30 });
    }
    return times;
  }, []);

  // Precise scrolling to current time
  useEffect(() => {
    if (isSameDay(currentDate, new Date())) {
      // Use a timeout to ensure the DOM is fully painted and animations have started
      const timeoutId = setTimeout(() => {
        const now = new Date();
        const h = now.getHours();
        const m = now.getMinutes();
        
        // Determine the current 30-minute slot
        const targetM = m >= 30 ? 30 : 0;
        const elementId = `slot-${h}-${targetM}`;
        
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300); // 300ms delay to accommodate entry animations
      
      return () => clearTimeout(timeoutId);
    }
  }, [currentDate]);

  const getEntriesForSlot = (h: number, m: number) => {
    return dayEntries.filter(e => {
      const d = new Date(e.timestamp);
      const entryH = d.getHours();
      const entryM = d.getMinutes();
      
      if (entryH !== h) return false;
      if (m === 0) return entryM < 30;
      return entryM >= 30;
    });
  };

  const now = new Date();
  const isToday = isSameDay(currentDate, now);
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto pb-32 no-scrollbar px-4">
      <div className="relative pt-6">
        
        {/* Decorative Vertical Line */}
        <div className="absolute left-[3.5rem] top-0 bottom-0 w-[2px] bg-stone-100 z-0"></div>

        {slots.map(({ h, m }) => {
          const slotEntries = getEntriesForSlot(h, m);
          const timeLabel = format(new Date().setHours(h, m), 'h:mm a');
          const timeValue = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
          const slotId = `slot-${h}-${m}`;
          const isFullHour = m === 0;

          // Check if this is the current time slot
          const isCurrentTimeSlot = isToday && 
            h === currentHour && 
            ((m === 0 && currentMinute < 30) || (m === 30 && currentMinute >= 30));

          return (
            <div id={slotId} key={`${h}-${m}`} className={`relative flex group ${isFullHour ? 'mb-2 mt-4' : 'mb-2'}`}>
              
              {/* Time Label */}
              <div className="w-[3.5rem] pr-4 text-right flex-shrink-0 flex items-start justify-end pt-1 relative">
                <span className={`text-xs font-bold transition-colors duration-300
                  ${isCurrentTimeSlot ? 'text-teal-500 scale-110' : (isFullHour ? 'text-stone-500' : 'text-stone-300')}
                `}>
                  {timeLabel}
                </span>
                {/* Active Indicator Dot next to time label */}
                {isCurrentTimeSlot && (
                  <div className="absolute right-0 top-2 w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></div>
                )}
              </div>

              {/* Timeline Node */}
              <div className="relative z-10 flex-1 pl-6">
                
                {/* Visual Dot on Line */}
                <div 
                  onClick={() => onAddEntry(timeValue)}
                  className={`absolute left-[-5px] top-1.5 w-3 h-3 rounded-full border-2 border-[#faf9f6] cursor-pointer transition-all duration-300
                    ${slotEntries.length > 0 
                      ? 'bg-teal-400 scale-125 shadow-[0_0_0_4px_rgba(45,212,191,0.2)]' 
                      : isCurrentTimeSlot 
                        ? 'bg-teal-500 ring-4 ring-teal-100' // Highlight current time dot
                        : isFullHour ? 'bg-stone-300' : 'bg-stone-200 w-2 h-2 left-[-3px]'
                    }
                    hover:scale-150 hover:bg-teal-300
                  `}
                ></div>

                {/* Entry Content */}
                <div className="min-h-[2rem]">
                  {slotEntries.length === 0 ? (
                    // Empty State hover effect
                    <div 
                      onClick={() => onAddEntry(timeValue)}
                      className={`h-8 rounded-xl border border-transparent transition-colors cursor-pointer flex items-center px-3 -mt-1 group/empty
                        ${isCurrentTimeSlot ? 'bg-teal-50/30 border-dashed border-teal-200' : 'hover:border-dashed hover:border-teal-200 hover:bg-teal-50/50'}
                      `}
                    >
                       <span className={`text-[10px] font-bold text-teal-400 flex items-center gap-1 transition-opacity
                         ${isCurrentTimeSlot ? 'opacity-100' : 'opacity-0 group-hover/empty:opacity-100'}
                       `}>
                         <Plus size={12} /> Add log
                       </span>
                    </div>
                  ) : (
                    <div className="space-y-3 pb-2">
                      {slotEntries.map(entry => (
                        <div 
                          key={entry.id} 
                          className={`relative p-4 rounded-3xl shadow-sm border animate-in slide-in-from-bottom-2 duration-300
                            ${entry.type === 'MILK' 
                              ? 'bg-blue-50/80 border-blue-100' 
                              : 'bg-orange-50/80 border-orange-100'
                            }`}
                        >
                          {/* Delete Action */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteEntry(entry.id); }}
                            className="absolute top-3 right-3 p-2 rounded-full text-stone-300 hover:text-rose-400 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>

                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm
                               ${entry.type === 'MILK' ? 'bg-white text-blue-400' : 'bg-white text-orange-400'}
                            `}>
                              {entry.type === 'MILK' ? <Milk size={22} fill="currentColor" className="opacity-20" /> : <Utensils size={22} />}
                              {/* Overlay Icon */}
                              <div className="absolute">
                                {entry.type === 'MILK' ? <Milk size={22} /> : <Utensils size={22} />}
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-lg font-extrabold text-stone-700">
                                {entry.type === 'MILK' ? `${entry.amountMl} ml` : entry.foodName}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${entry.type === 'MILK' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                  {entry.type === 'MILK' ? 'Formula / Breastmilk' : 'Solid Food'}
                                </span>
                                <span className="text-xs text-stone-400 font-semibold">
                                  {format(new Date(entry.timestamp), 'h:mm a')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};