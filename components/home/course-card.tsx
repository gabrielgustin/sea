'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';
import type { Course } from '@/context/CoursesContext';

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

// "2026-08-19" → "19 ago 2026" (sin depender del idioma del navegador, así coincide con el servidor).
export function shortDate(iso: string) {
  const [y, m, d] = (iso ?? '').split('-').map(Number);
  return y && m && d ? `${d} ${MONTHS[m - 1]} ${y}` : iso;
}

// Mueve el brillo de .spotlight hacia donde está el cursor.
export function trackPointer(e: React.PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
}

export default function CourseCard({ course, href, priority }: { course: Course; href: string; priority?: boolean }) {
  return (
    <Link
      href={href}
      onPointerMove={trackPointer}
      className="spotlight reveal group flex flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-2 shadow-[0_1px_2px_rgb(3_30_65/0.04)] transition duration-500 hover:-translate-y-1.5 hover:border-[#9cbadb] hover:shadow-[0_24px_50px_-12px_rgb(3_30_65/0.25)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-slate-100">
        <Image
          src={course.image}
          alt={course.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {course.modality && (
            <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-[#031e41] backdrop-blur-md">{course.modality}</span>
          )}
          {course.badge && course.badge.toLowerCase() !== course.modality?.toLowerCase() && (
            <span className="rounded-full bg-[#031e41]/85 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">{course.badge}</span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-5">
        <h3 className="text-xl font-semibold leading-snug tracking-tight text-slate-900">{course.title}</h3>
        {course.subtitle && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">{course.subtitle}</p>}

        <div className="mt-auto flex items-end justify-between gap-3 pt-6">
          <div className="space-y-1.5 text-sm text-slate-600">
            {course.startDate && (
              <p className="flex items-center gap-2"><CalendarDays size={15} className="text-[#031e41]" />Inicio: <span className="font-medium text-slate-900">{shortDate(course.startDate)}</span></p>
            )}
            {course.location && (
              <p className="flex items-center gap-2"><MapPin size={15} className="text-[#031e41]" /><span className="line-clamp-1">{course.location}</span></p>
            )}
          </div>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[#031e41] transition duration-500 group-hover:bg-[#031e41] group-hover:text-white">
            <ArrowUpRight size={19} className="rotate-45 transition duration-500 group-hover:rotate-0" />
          </span>
        </div>
      </div>
    </Link>
  );
}
