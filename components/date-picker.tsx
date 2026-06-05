'use client';

import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

export function DatePicker({ value, onChange, placeholder = 'Seleccionar fecha' }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Parse the date value - handle both formats
  const getDate = () => {
    if (!value) return undefined;
    
    // Try to parse "Lun 1/06/2026" or "2026-06-30" format
    let date: Date | undefined;
    
    // If it looks like YYYY-MM-DD format
    if (value.includes('-') && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      date = new Date(value + 'T00:00:00');
    } else {
      // Try parsing as "Lun 1/06/2026" - extract the date part
      const parts = value.split(' ');
      const datePart = parts[parts.length - 1];
      if (datePart) {
        const [day, month, year] = datePart.split('/');
        if (day && month && year) {
          date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        }
      }
    }
    
    return date && !isNaN(date.getTime()) ? date : undefined;
  };

  const selectedDate = getDate();

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      // Format as YYYY-MM-DD for storage
      const formatted = format(date, 'yyyy-MM-dd');
      onChange(formatted);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-between text-left font-normal',
            !selectedDate && 'text-muted-foreground'
          )}
          style={{
            borderColor: '#e5e5e5',
            backgroundColor: '#f9fafb',
          }}
        >
          {selectedDate ? (
            <span>
              {format(selectedDate, 'EEE d/MM/yyyy', { locale: es })}
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
          <CalendarIcon className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
