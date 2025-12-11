import React from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from 'date-fns';
import { FeedingEntry } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  entries: FeedingEntry[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ currentDate, onDateSelect, entries }) => {
  const [viewDate, setViewDate] = React.useState(currentDate);

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const getDaySummary = (day: Date) => {
    const dayEntries = entries.filter(e => isSameDay(e.timestamp, day));
    const milk = dayEntries.filter(e => e.type === 'MILK').length;
    const food = dayEntries.filter(e => e.type === 'FOOD').length;
    return { milk, food };
  };

  return (
    <div className="w-full px-6 pt-2 pb-24 overflow-y-auto">
      {/* Month Navigation Card */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-stone-100 mb-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-2 rounded-full hover:bg-stone-50 text-stone-400 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-extrabold text-stone-700">
            {format(viewDate, 'MMMM yyyy')}
          </h2>
          <button onClick={nextMonth} className="p-2 rounded-full hover:bg-stone-50 text-stone-400 transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-4 text-center">
          {weekDays.map(day => (
            <div key={day} className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-4 gap-x-1">
          {days.map(day => {
            const { milk, food } = getDaySummary(day);
            const isSelected = isSameDay(day, currentDate);
            const isCurrentMonth = isSameMonth(day, viewDate);
            const isTodayDate = isToday(day);
            
            return (
              <button
                key={day.toString()}
                onClick={() => onDateSelect(day)}
                className={`
                  relative h-12 rounded-2xl flex flex-col items-center justify-center transition-all duration-200
                  ${!isCurrentMonth ? 'opacity-20' : 'opacity-100'}
                  ${isSelected 
                    ? 'bg-teal-400 text-white shadow-lg shadow-teal-100 scale-110 z-10 font-bold' 
                    : 'text-stone-600 hover:bg-stone-50'
                  }
                  ${isTodayDate && !isSelected ? 'bg-teal-50 text-teal-600 font-bold' : ''}
                `}
              >
                <span className="text-sm">{format(day, 'd')}</span>

                {/* Indicators */}
                <div className="flex gap-1 mt-1 h-1.5">
                  {milk > 0 && (
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-300'}`}></div>
                  )}
                  {food > 0 && (
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-orange-300'}`}></div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Legend / Tip */}
      <div className="text-center space-y-2">
        <p className="text-sm text-stone-400 font-medium">Tap a date to view or edit logs</p>
        <div className="flex justify-center gap-4 text-xs font-bold text-stone-500">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-300"></div> Milk</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-300"></div> Food</div>
        </div>
      </div>
    </div>
  );
};