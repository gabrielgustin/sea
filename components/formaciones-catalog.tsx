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
      <section className="relative -mt-[76px] overflow-hidden bg-[#EAF2FB] px-5 pb-16 pt-36 sm:px-8 sm:pt-40" style={{ backgroundImage: 'radial-gradient(rgb(3 30 65 / .14) 1.4px, transparent 1.6px)', backgroundSize: '26px 26px' }}>
        <div className="relative mx-auto max-w-7xl">
          <p className="rise inline-block rounded-full border-2 border-[#031e41] bg-white px-4 py-2 text-sm font-semibold">{tenant.name}</p>
          <h1 className="rise mt-6 text-balance text-5xl font-extrabold leading-[0.95] tracking-[-0.035em] [font-family:var(--font-display)] sm:text-7xl" style={{ animationDelay: '.08s' }}>Catálogo de formaciones</h1>
          <p className="rise mt-5 max-w-2xl text-lg text-[#031e41]/75" style={{ animationDelay: '.16s' }}>
            {visible.length} {visible.length === 1 ? 'formación disponible' : 'formaciones disponibles'}. Elegí la que mejor se adapte a vos y empezá a aprender haciendo.
          </p>

          <div className="rise mt-10 flex max-w-2xl items-center gap-3 rounded-full border-2 border-[#031e41] bg-white px-5 shadow-[5px_5px_0_#031e41] transition focus-within:shadow-[5px_5px_0_var(--accent)]" style={{ animationDelay: '.24s' }}>
            <Search size={20} className="shrink-0" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscá por nombre o tema…"
              aria-label="Buscar formaciones"
              className="h-14 w-full bg-transparent outline-none placeholder:text-[#031e41]/45"
            />
            {q && (
              <button onClick={() => setQ('')} aria-label="Limpiar búsqueda" className="rounded-full p-1.5 hover:bg-[#EAF2FB]"><X size={18} /></button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-12 sm:px-8">
        {modalities.length > 2 && (
          <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filtrar por modalidad">
            {modalities.map((m) => (
              <button
                key={m}
                onClick={() => setModality(m)}
                aria-pressed={modality === m}
                className={`rounded-full border-2 border-[#031e41] px-4 py-2 font-semibold transition active:scale-95 ${modality === m ? 'bg-[#031e41] text-white' : 'bg-white hover:bg-[var(--accent)] hover:text-[var(--accent-ink)]'}`}
              >
                {m}
              </button>
            ))}
          </div>
        )}

        {list.length === 0 ? (
          <div className="rounded-[32px] border-2 border-dashed border-[#031e41]/40 py-24 text-center">
            <p className="text-lg font-medium text-slate-700">{visible.length === 0 ? 'No hay formaciones disponibles en este momento.' : 'No encontramos formaciones con esa búsqueda.'}</p>
            {visible.length > 0 && (
              <button onClick={() => { setQ(''); setModality('Todas'); }} className="mt-4 text-sm font-semibold text-[#031e41] underline underline-offset-4">Ver todas</button>
            )}
          </div>
        ) : (
          <div className="grid gap-x-7 gap-y-12 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c, i) => (
              <CourseCard key={c.id} course={c} href={`/${schoolId}/cursos/${c.slug || c.id}`} priority={i < 3} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
