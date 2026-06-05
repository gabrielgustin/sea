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
    ? format(selectedDate, 'd \'de\' MMMM \'de\' yyyy', { locale: es })
    : placeholder;

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full px-4 py-3 border-2 rounded-lg text-left font-medium transition-all duration-300 flex items-center justify-between focus:outline-none"
            style={{
              borderColor: selectedDate ? '#031e41' : '#d1d5db',
              color: selectedDate ? '#031e41' : '#9ca3af',
              backgroundColor: '#ffffff'
            }}
            onMouseEnter={(e) => {
              if (!selectedDate) e.currentTarget.style.borderColor = '#9cbadb';
            }}
            onMouseLeave={(e) => {
              if (!selectedDate) e.currentTarget.style.borderColor = '#d1d5db';
            }}
          >
            <span className="text-sm md:text-base">{displayDate}</span>
            <Calendar 
              size={20} 
              className="flex-shrink-0"
              style={{ color: selectedDate ? '#031e41' : '#9ca3af' }}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border-0 shadow-2xl" align="start">
          <div 
            className="p-6 rounded-lg"
            style={{ backgroundColor: '#f8f9fa' }}
          >
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              initialFocus
              locale={es}
              showOutsideDays={true}
              className="calendar-picker"
            />
          </div>
        </PopoverContent>
      </Popover>

      <style jsx global>{`
        .calendar-picker {
          --rdp-cell-size: 44px;
          --rdp-accent-color: #031e41;
          --rdp-background-color: #9cbadb;
          font-family: inherit;
        }

        .calendar-picker .rdp {
          --rdp-cell-size: 44px;
          --rdp-accent-color: #031e41;
          --rdp-background-color: #9cbadb;
          margin: 0;
        }

        .calendar-picker .rdp-caption {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 8px;
          margin-bottom: 20px;
          font-weight: 600;
          color: #031e41;
        }

        .calendar-picker .rdp-caption_label {
          font-size: 15px;
          font-weight: 700;
          color: #031e41;
        }

        .calendar-picker .rdp-nav_button {
          width: 36px;
          height: 36px;
          border: 2px solid #9cbadb;
          border-radius: 8px;
          background-color: white;
          color: #031e41;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 18px;
        }

        .calendar-picker .rdp-nav_button:hover {
          background-color: #9cbadb;
          color: white;
          border-color: #031e41;
        }

        .calendar-picker .rdp-head_cell {
          color: #031e41;
          font-weight: 600;
          font-size: 13px;
          text-transform: uppercase;
          padding: 12px 0;
          text-align: center;
        }

        .calendar-picker .rdp-cell {
          padding: 3px;
          text-align: center;
        }

        .calendar-picker .rdp-day {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          font-size: 14px;
          color: #031e41;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
        }

        .calendar-picker .rdp-day:hover:not(.rdp-day_disabled) {
          background-color: #e0e7ff;
          color: #031e41;
          font-weight: 600;
          transform: scale(1.05);
        }

        .calendar-picker .rdp-day_selected:not([disabled]) {
          background-color: #031e41 !important;
          color: white !important;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(3, 30, 65, 0.3);
        }

        .calendar-picker .rdp-day_today:not(.rdp-day_selected) {
          font-weight: 700;
          color: #031e41;
          border: 2px solid #9cbadb;
        }

        .calendar-picker .rdp-day_disabled {
          color: #d1d5db;
          cursor: not-allowed;
          opacity: 0.4;
        }

        .calendar-picker .rdp-day_outside {
          color: #d1d5db;
          opacity: 0.4;
        }

        .calendar-picker .rdp-row {
          display: flex;
          justify-content: center;
          gap: 0;
        }
      `}</style>
    </>
  );
}
