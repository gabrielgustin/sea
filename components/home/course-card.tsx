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

const TILT = [-1.5, 1.2, -0.8, 1.6, -1.2, 0.9];
const TAPE = ['#FFC531', '#FF6FA8', '#2FD3A0', '#9cbadb'];

// Tarjeta de curso estilo polaroid (mismo lenguaje que la landing madre).
export default function CourseCard({ course, href, priority, index = 0 }: { course: Course; href: string; priority?: boolean; index?: number }) {
  return (
    <Link
      href={href}
      style={{ ['--tilt' as string]: `${TILT[index % TILT.length]}deg` }}
      className="group relative flex h-full rotate-[var(--tilt)] flex-col rounded-[24px] border-2 border-[#031e41] bg-white p-2.5 shadow-[6px_6px_0_#031e41] transition duration-300 hover:-translate-y-1.5 hover:rotate-0 hover:shadow-[9px_10px_0_#031e41] focus-visible:rotate-0 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
    >
      <span aria-hidden className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-3 rounded-sm opacity-90" style={{ background: TAPE[index % TAPE.length] }} />
      <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-[#EAF2FB]">
        <Image
          src={course.image}
          alt={course.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 400px"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {course.modality && (
            <span className="rounded-full border-2 border-[#031e41] bg-white px-3 py-0.5 text-xs font-bold">{course.modality}</span>
          )}
          {course.badge && course.badge.toLowerCase() !== course.modality?.toLowerCase() && (
            <span className="rounded-full border-2 border-[#031e41] bg-[var(--accent)] px-3 py-0.5 text-xs font-bold text-[var(--accent-ink)]">{course.badge}</span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-2.5 pb-3 pt-4">
        <h3 className="text-xl font-bold leading-snug tracking-tight [font-family:var(--font-display)]">{course.title}</h3>
        {course.subtitle && <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-600">{course.subtitle}</p>}

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div className="flex flex-wrap gap-1.5 text-sm">
            {course.startDate && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF2FB] px-3 py-1 font-medium"><CalendarDays size={14} />{shortDate(course.startDate)}</span>
            )}
            {course.location && (
              <span className="inline-flex max-w-[12rem] items-center gap-1.5 rounded-full bg-[#EAF2FB] px-3 py-1 font-medium"><MapPin size={14} className="shrink-0" /><span className="truncate">{course.location}</span></span>
            )}
          </div>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-[#031e41] bg-[var(--accent)] text-[var(--accent-ink)] transition duration-300 group-hover:rotate-45">
            <ArrowUpRight size={19} />
          </span>
        </div>
      </div>
    </Link>
  );
}
