import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { subDays, format, isSameDay, eachDayOfInterval } from 'date-fns';
import { FeedingEntry } from '../types';

interface StatsProps {
  entries: FeedingEntry[];
}

export const Stats: React.FC<StatsProps> = ({ entries }) => {
  
  const weeklyData = useMemo(() => {
    const end = new Date();
    const start = subDays(end, 6); // Last 7 days
    const days = eachDayOfInterval({ start, end });

    return days.map(day => {
      const dayEntries = entries.filter(e => isSameDay(e.timestamp, day));
      const totalMilk = dayEntries
        .filter(e => e.type === 'MILK')
        .reduce((sum, e) => sum + (e.amountMl || 0), 0);
      
      const totalFood = dayEntries.filter(e => e.type === 'FOOD').length;

      return {
        name: format(day, 'EEE'), // Mon, Tue...
        fullDate: format(day, 'MMM d'),
        milk: totalMilk,
        food: totalFood,
      };
    });
  }, [entries]);

  const totalMilkConsumed = weeklyData.reduce((acc, curr) => acc + curr.milk, 0);
  const avgMilk = Math.round(totalMilkConsumed / 7);

  return (
    <div className="w-full px-6 pt-4 pb-24 overflow-y-auto space-y-6">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-400 rounded-[2rem] p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
          <p className="text-blue-50 text-xs font-bold uppercase tracking-wider mb-2">Total (7d)</p>
          <div className="flex items-baseline gap-1">
             <span className="text-4xl font-extrabold">{totalMilkConsumed}</span>
             <span className="text-lg font-medium opacity-80">ml</span>
          </div>
        </div>
        <div className="bg-teal-400 rounded-[2rem] p-6 text-white shadow-lg shadow-teal-200 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white opacity-10 rounded-full -ml-8 -mb-8"></div>
          <p className="text-teal-50 text-xs font-bold uppercase tracking-wider mb-2">Daily Avg</p>
          <div className="flex items-baseline gap-1">
             <span className="text-4xl font-extrabold">{avgMilk}</span>
             <span className="text-lg font-medium opacity-80">ml</span>
          </div>
        </div>
      </div>

      {/* Chart Card */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-stone-100">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-lg font-extrabold text-stone-700">Milk Intake</h3>
           <span className="text-xs font-bold bg-stone-100 text-stone-500 px-3 py-1 rounded-full">Last 7 Days</span>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#a8a29e', fontWeight: 600 }} 
                dy={10}
              />
              <Tooltip 
                cursor={{ fill: '#f5f5f4', radius: 8 }}
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  padding: '12px 16px',
                  fontWeight: 'bold',
                  color: '#57534e'
                }}
              />
              <Bar dataKey="milk" radius={[8, 8, 8, 8]} barSize={24}>
                {weeklyData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.milk > avgMilk ? '#60a5fa' : '#bfdbfe'} // Blue 400 vs Blue 200
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Food Stats Placeholder */}
      <div className="bg-orange-50 rounded-[2rem] p-6 border border-orange-100">
         <h3 className="text-lg font-extrabold text-orange-800 mb-2">Food Intake</h3>
         <p className="text-orange-600/80 text-sm font-medium">
           You logged solid food <span className="font-bold text-orange-700">{weeklyData.reduce((a, b) => a + b.food, 0)} times</span> this week.
         </p>
      </div>

    </div>
  );
};