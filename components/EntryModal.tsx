import React, { useState, useEffect } from 'react';
import { X, Milk, Utensils, Check } from 'lucide-react';
import { Button } from './Button';
import { EntryType, FeedingEntry } from '../types';

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<FeedingEntry, 'id'>) => void;
  initialDate: Date;
  initialTimeSlot: string; // "14:30"
}

export const EntryModal: React.FC<EntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDate,
  initialTimeSlot,
}) => {
  const [type, setType] = useState<EntryType>('MILK');
  const [amount, setAmount] = useState<number>(120); // Default 120ml
  const [customAmount, setCustomAmount] = useState<string>('');
  const [foodName, setFoodName] = useState<string>('');
  const [time, setTime] = useState(initialTimeSlot);

  useEffect(() => {
    if (isOpen) {
      setTime(initialTimeSlot);
      // Reset fields
      setType('MILK');
      setAmount(120);
      setCustomAmount('');
      setFoodName('');
    }
  }, [isOpen, initialTimeSlot]);

  if (!isOpen) return null;

  const handleSave = () => {
    const [hours, minutes] = time.split(':').map(Number);
    const entryDate = new Date(initialDate);
    entryDate.setHours(hours, minutes, 0, 0);

    const finalAmount = customAmount ? parseInt(customAmount) : amount;

    if (type === 'FOOD' && !foodName.trim()) {
      alert("Please enter a food name");
      return;
    }

    onSave({
      timestamp: entryDate.getTime(),
      type,
      amountMl: type === 'MILK' ? finalAmount : undefined,
      foodName: type === 'FOOD' ? foodName : undefined,
    });
    onClose();
  };

  const milkPresets = [60, 90, 120, 150, 180, 210];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-900/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-extrabold text-stone-700">Log Feeding</h2>
          <button onClick={onClose} className="p-2 bg-stone-50 rounded-full hover:bg-stone-100 text-stone-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Time Selector */}
        <div className="mb-8 flex items-center justify-between bg-[#faf9f6] p-4 rounded-3xl border border-stone-100">
          <span className="text-stone-500 font-bold ml-2">Time</span>
          <input 
            type="time" 
            value={time} 
            onChange={(e) => setTime(e.target.value)}
            className="bg-transparent text-2xl font-extrabold text-stone-700 focus:outline-none text-right"
          />
        </div>

        {/* Type Toggle */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setType('MILK')}
            className={`flex-1 py-6 rounded-3xl flex flex-col items-center gap-3 transition-all duration-300 border-2 ${
              type === 'MILK' 
                ? 'border-blue-400 bg-blue-50 text-blue-500 shadow-md shadow-blue-100 scale-105' 
                : 'border-transparent bg-[#faf9f6] text-stone-300 hover:bg-stone-50'
            }`}
          >
            <Milk size={32} strokeWidth={2.5} />
            <span className="font-extrabold text-sm uppercase tracking-wider">Milk</span>
          </button>
          <button
            onClick={() => setType('FOOD')}
            className={`flex-1 py-6 rounded-3xl flex flex-col items-center gap-3 transition-all duration-300 border-2 ${
              type === 'FOOD' 
                ? 'border-orange-400 bg-orange-50 text-orange-500 shadow-md shadow-orange-100 scale-105' 
                : 'border-transparent bg-[#faf9f6] text-stone-300 hover:bg-stone-50'
            }`}
          >
            <Utensils size={32} strokeWidth={2.5} />
            <span className="font-extrabold text-sm uppercase tracking-wider">Food</span>
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="mb-10 min-h-[160px]">
          {type === 'MILK' ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              <p className="text-stone-400 font-bold text-sm ml-1">AMOUNT (ML)</p>
              <div className="grid grid-cols-3 gap-3">
                {milkPresets.map(preset => (
                  <button
                    key={preset}
                    onClick={() => { setAmount(preset); setCustomAmount(''); }}
                    className={`py-3 rounded-2xl text-sm font-bold transition-all ${
                      amount === preset && !customAmount
                        ? 'bg-blue-400 text-white shadow-lg shadow-blue-200 scale-105'
                        : 'bg-[#faf9f6] text-stone-500 hover:bg-stone-50'
                    }`}
                  >
                    {preset}ml
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-4 pt-2">
                <span className="text-sm font-bold text-stone-400">Custom:</span>
                <input
                  type="number"
                  placeholder="..."
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="flex-1 bg-[#faf9f6] rounded-2xl px-4 py-3 font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                />
                <span className="text-stone-400 font-bold">ml</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              <p className="text-stone-400 font-bold text-sm ml-1">DETAILS</p>
              <input
                type="text"
                placeholder="What did baby eat?"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                autoFocus
                className="w-full bg-orange-50/50 border-2 border-orange-100 text-orange-900 placeholder-orange-300 rounded-3xl px-6 py-5 text-xl font-bold focus:outline-none focus:border-orange-300 focus:bg-white transition-all"
              />
              <div className="flex gap-2 flex-wrap">
                {['🍌 Banana', '🥣 Porridge', '🍎 Apple', '🥕 Carrot', '🥑 Avocado'].map(suggestion => (
                   <button 
                    key={suggestion}
                    onClick={() => setFoodName(suggestion)}
                    className="px-4 py-2 bg-[#faf9f6] rounded-xl text-xs font-bold text-stone-500 hover:bg-orange-100 hover:text-orange-600 transition-colors"
                   >
                     {suggestion}
                   </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <Button onClick={handleSave} fullWidth size="lg" className="shadow-xl shadow-teal-100">
          <Check className="mr-2" size={24} strokeWidth={3} />
          Save Entry
        </Button>

      </div>
    </div>
  );
};