'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import 'react-day-picker/dist/style.css';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

export function DatePicker({ value, onChange, placeholder = 'Seleccionar fecha' }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

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

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      const formatted = format(date, 'yyyy-MM-dd');
      onChange(formatted);
      setOpen(false);
    }
  };

  const displayDate = selectedDate 
    ? format(selectedDate, 'd/MM/yyyy')
    : placeholder;

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full px-4 py-3 border-2 rounded-lg text-left font-medium transition-all duration-300 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-offset-1"
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
        <PopoverContent className="p-2 w-auto" align="start">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            initialFocus
            locale={es}
            className="calendar-compact"
          />
        </PopoverContent>
      </Popover>

      <style jsx global>{`
        .calendar-compact.rdp {
          --rdp-cell-size: 28px;
          --rdp-accent-color: #031e41;
          --rdp-background-color: #9cbadb;
          margin: 0;
          padding: 8px;
          font-size: 13px;
        }

        .calendar-compact .rdp-caption {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0;
          margin-bottom: 10px;
        }

        .calendar-compact .rdp-caption_label {
          font-size: 12px;
          font-weight: 600;
        }

        .calendar-compact .rdp-nav {
          display: flex;
          gap: 4px;
        }

        .calendar-compact .rdp-nav_button {
          width: 24px;
          height: 24px;
          padding: 0;
          border: 1px solid #9cbadb;
          background: white;
          cursor: pointer;
          font-size: 12px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .calendar-compact .rdp-nav_button:hover {
          background: #9cbadb;
        }

        .calendar-compact .rdp-head_cell {
          width: 28px;
          padding: 4px 0;
          font-size: 10px;
          font-weight: 600;
          color: #031e41;
          text-transform: uppercase;
        }

        .calendar-compact .rdp-cell {
          padding: 2px;
          width: 28px;
          height: 28px;
        }

        .calendar-compact .rdp-day {
          width: 100%;
          height: 100%;
          padding: 0;
          font-size: 11px;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .calendar-compact .rdp-day:hover:not(.rdp-day_disabled) {
          background: #e0e7ff;
          font-weight: 600;
        }

        .calendar-compact .rdp-day_selected {
          background: #031e41;
          color: white;
          font-weight: 700;
        }

        .calendar-compact .rdp-day_today {
          font-weight: 600;
          border: 1px solid #9cbadb;
        }

        .calendar-compact .rdp-day_outside {
          opacity: 0.3;
        }

        .calendar-compact .rdp-day_disabled {
          opacity: 0.3;
          color: #9ca3af;
        }

        .calendar-compact .rdp-row {
          display: flex;
          gap: 0;
        }
      `}</style>
    </>
  );
}
