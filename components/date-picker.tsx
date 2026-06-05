'use client';

import * as React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

export function DatePicker({ value, onChange, placeholder = 'Seleccionar fecha' }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const getDate = () => {
    if (!value) return undefined;
    
    if (value.includes('-') && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const date = new Date(value + 'T00:00:00');
      return !isNaN(date.getTime()) ? date : undefined;
    }
    
    const parts = value.split(' ');
    const datePart = parts[parts.length - 1];
    if (datePart) {
      const [day, month, year] = datePart.split('/');
      if (day && month && year) {
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return !isNaN(date.getTime()) ? date : undefined;
      }
    }
    return undefined;
  };

  const selectedDate = getDate();

  React.useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(selectedDate);
    }
  }, [value]);

  const handleSelect = (date: Date) => {
    const formatted = format(date, 'yyyy-MM-dd');
    onChange(formatted);
    setOpen(false);
  };

  const displayDate = selectedDate 
    ? format(selectedDate, 'd/MM/yyyy')
    : placeholder;

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get the day of week for the first day (0 = Sunday, adjust for Monday start)
  const startDayOfWeek = getDay(monthStart);
  const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // Convert to Monday = 0

  const weekDays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="w-full px-4 py-3 border-2 rounded-lg text-left font-medium transition-all duration-200 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 hover:border-gray-400"
          style={{
            borderColor: selectedDate ? '#031e41' : '#e5e7eb',
            color: selectedDate ? '#031e41' : '#6b7280',
            backgroundColor: '#ffffff',
            fontSize: '14px'
          }}
        >
          <span>{displayDate}</span>
          <Calendar 
            size={18} 
            className="flex-shrink-0"
            style={{ color: selectedDate ? '#031e41' : '#9ca3af' }}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 bg-white rounded-lg shadow-lg border border-gray-200" style={{ width: '280px' }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-3 px-1">
            <button
              type="button"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={16} style={{ color: '#031e41' }} />
            </button>
            <span className="text-sm font-semibold capitalize" style={{ color: '#031e41' }}>
              {format(currentMonth, 'MMMM yyyy', { locale: es })}
            </span>
            <button
              type="button"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ChevronRight size={16} style={{ color: '#031e41' }} />
            </button>
          </div>

          {/* Week days header */}
          <div className="grid grid-cols-7 gap-0 mb-1">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold py-1"
                style={{ color: '#6b7280' }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-0">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: adjustedStartDay }).map((_, index) => (
              <div key={`empty-${index}`} className="w-9 h-9" />
            ))}
            
            {/* Days of the month */}
            {daysInMonth.map((day) => {
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => handleSelect(day)}
                  className="w-9 h-9 flex items-center justify-center text-sm rounded-md transition-all duration-150 hover:bg-blue-50"
                  style={{
                    backgroundColor: isSelected ? '#031e41' : 'transparent',
                    color: isSelected ? '#ffffff' : '#031e41',
                    fontWeight: isSelected || isToday ? 600 : 400,
                    border: isToday && !isSelected ? '1px solid #9cbadb' : 'none'
                  }}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
