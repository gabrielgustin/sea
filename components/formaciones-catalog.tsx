'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useCourses } from '@/context/CoursesContext';
import { useSchool } from '@/context/SchoolContext';
import CourseCard from '@/components/home/course-card';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function FormacionesCatalog() {
  const { courses } = useCourses();
  const { schoolId, tenant } = useSchool();
  const [q, setQ] = useState('');
  const [modality, setModality] = useState('Todas');

  const visible = courses.filter((c) => c.showOnHome);
  const modalities = ['Todas', ...new Set(visible.map((c) => c.modality).filter(Boolean))];
  const list = visible.filter(
    (c) => (modality === 'Todas' || c.modality === modality) && norm(`${c.title} ${c.subtitle} ${c.description}`).includes(norm(q.trim())),
  );

  return (
    <>
      <section className="relative -mt-[76px] overflow-hidden bg-[#031e41] px-5 pb-20 pt-40 text-white sm:px-8 aurora">
        <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-7xl">
          <p className="rise text-xs font-semibold uppercase tracking-[0.2em] text-[#9cbadb]">{tenant.name}</p>
          <h1 className="rise mt-4 text-5xl font-semibold tracking-tight sm:text-7xl" style={{ animationDelay: '.08s' }}>Catálogo de formaciones</h1>
          <p className="rise mt-5 max-w-2xl text-lg text-white/65" style={{ animationDelay: '.16s' }}>
            {visible.length} {visible.length === 1 ? 'formación disponible' : 'formaciones disponibles'}. Elegí la que mejor se adapte a vos y empezá a aprender haciendo.
          </p>

          <div className="rise mt-10 flex max-w-2xl items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 backdrop-blur-md focus-within:border-white/40" style={{ animationDelay: '.24s' }}>
            <Search size={20} className="shrink-0 text-white/60" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscá por nombre o tema…"
              aria-label="Buscar formaciones"
              className="h-14 w-full bg-transparent text-white outline-none placeholder:text-white/45"
            />
            {q && (
              <button onClick={() => setQ('')} aria-label="Limpiar búsqueda" className="rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white"><X size={18} /></button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-8">
        {modalities.length > 2 && (
          <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filtrar por modalidad">
            {modalities.map((m) => (
              <button
                key={m}
                onClick={() => setModality(m)}
                aria-pressed={modality === m}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${modality === m ? 'bg-[#031e41] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {m}
              </button>
            ))}
          </div>
        )}

        {list.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 py-24 text-center">
            <p className="text-lg font-medium text-slate-700">{visible.length === 0 ? 'No hay formaciones disponibles en este momento.' : 'No encontramos formaciones con esa búsqueda.'}</p>
            {visible.length > 0 && (
              <button onClick={() => { setQ(''); setModality('Todas'); }} className="mt-4 text-sm font-semibold text-[#031e41] underline underline-offset-4">Ver todas</button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c, i) => (
              <CourseCard key={c.id} course={c} href={`/${schoolId}/cursos/${c.slug || c.id}`} priority={i < 3} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
