import React, { useMemo } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  getDay, 
  isToday,
  addMonths,
  subMonths
} from 'date-fns';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { AttendanceStatus } from '../types';

interface CalendarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  attendanceData: Record<string, AttendanceStatus>;
  onToggleAttendance: (dateStr: string) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const Calendar: React.FC<CalendarProps> = ({ 
  currentDate, 
  onDateChange, 
  attendanceData, 
  onToggleAttendance,
}) => {

  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const startDayOfWeek = getDay(startOfMonth(currentDate));
  const emptySlots = Array.from({ length: startDayOfWeek });

  const handlePrevMonth = () => onDateChange(subMonths(currentDate, 1));
  const handleNextMonth = () => onDateChange(addMonths(currentDate, 1));

  const getStatusStyles = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return 'bg-emerald-400 border-emerald-500 text-white shadow-lg shadow-emerald-200/50 scale-105 z-10 rotate-1';
      case AttendanceStatus.ABSENT:
        return 'bg-rose-500 border-rose-600 text-white shadow-lg shadow-rose-200/50 scale-95 opacity-90 -rotate-1';
      default:
        return 'bg-white border-slate-100 text-slate-400 hover:border-fuchsia-300 hover:shadow-sm hover:z-10 hover:scale-105';
    }
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-purple-900/20 overflow-hidden border border-white/50 ring-4 ring-white/20">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-fuchsia-50 to-purple-50 border-b border-fuchsia-100">
        <button 
          onClick={handlePrevMonth}
          className="p-3 rounded-xl bg-white shadow-sm hover:scale-110 transition-transform text-fuchsia-700 border border-fuchsia-100"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
        <h2 className="text-2xl font-black text-fuchsia-900 tracking-tight uppercase">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <button 
          onClick={handleNextMonth}
          className="p-3 rounded-xl bg-white shadow-sm hover:scale-110 transition-transform text-fuchsia-700 border border-fuchsia-100"
        >
          <ChevronRight size={22} strokeWidth={2.5} />
        </button>
      </div>

      {/* Grid */}
      <div className="p-6">
        <div className="grid grid-cols-7 gap-3 mb-4">
          {WEEKDAYS.map(day => (
            <div key={day} className="text-center text-[11px] font-black text-fuchsia-300 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-3">
          {emptySlots.map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}
          
          {daysInMonth.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const status = attendanceData[dateStr] || AttendanceStatus.UNMARKED;
            const isDayToday = isToday(day);
            
            return (
              <button
                key={dateStr}
                onClick={() => onToggleAttendance(dateStr)}
                className={`
                  relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300
                  ${getStatusStyles(status)}
                  ${isDayToday ? 'ring-4 ring-fuchsia-300 ring-offset-2 ring-offset-white' : ''}
                `}
              >
                <span className={`text-sm font-black ${status === AttendanceStatus.UNMARKED ? 'text-slate-500' : 'text-white'}`}>
                  {format(day, 'd')}
                </span>
                
                {status === AttendanceStatus.PRESENT && (
                  <Check size={20} className="mt-0.5 stroke-[4]" />
                )}
                {status === AttendanceStatus.ABSENT && (
                  <X size={20} className="mt-0.5 stroke-[4]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="px-6 py-5 bg-fuchsia-50/50 border-t border-fuchsia-100 flex justify-between text-xs font-bold text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-100"></div> Present
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500 ring-4 ring-rose-100"></div> Absent
        </div>
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-white border-2 border-slate-200"></div> Unmarked
        </div>
      </div>
    </div>
  );
};