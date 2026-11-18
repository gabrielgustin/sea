import { BookOpenText, ChartLine, CircleCheck, ClipboardCheck, MonitorPlay, Sparkles, Users, type LucideIcon } from 'lucide-react';
import { D } from '@/lib/fonts';

// Plataforma de aprendizaje propia de SEA: la misma sección en la portada (le habla a las escuelas)
// y en el inicio de cada colegio (le habla a estudiantes y familias, que se inscriben desde ahí).
const PEGBOARD = { backgroundImage: 'radial-gradient(rgb(3 30 65 / .14) 1.4px, transparent 1.6px)', backgroundSize: '26px 26px' };

const ITEMS: { icon: LucideIcon; title: string; bg: string }[] = [
  { icon: MonitorPlay, title: 'Cada clase, a mano', bg: '#FFC531' },
  { icon: ClipboardCheck, title: 'Tareas y entregas', bg: '#FF6FA8' },
  { icon: BookOpenText, title: 'Material de estudio', bg: '#ffffff' },
  { icon: ChartLine, title: 'Evaluación y seguimiento', bg: '#9cbadb' },
];

const COPY = {
  escuelas: {
    intro: 'Durante la cursada, cada estudiante entra a nuestra plataforma para seguir las clases, hacer las tareas y estudiar. Y es también donde evaluamos: tu escuela sabe cómo va cada uno.',
    note: '',
    items: [
      'Lo que se vio en el aula queda en la plataforma para repasarlo cuando quieran.',
      'Las consignas, las fechas y las entregas, todo en un mismo lugar.',
      'Apuntes, videos y recursos de cada curso, ordenados clase por clase.',
      'Evaluamos ahí mismo y seguimos el avance de cada estudiante.',
    ],
  },
  alumnos: {
    intro: 'Desde el primer día de cursada tenés acceso a nuestra plataforma: ahí están las clases, las tareas y todo el material para estudiar y repasar cuando quieras, desde la compu o el celular.',
    note: 'Para las familias: evaluamos durante todo el curso y hacemos un seguimiento de cada estudiante, clase a clase.',
    items: [
      '¿Faltaste o querés repasar? Lo que se vio en el aula queda en la plataforma.',
      'Las consignas, las fechas de entrega y tus trabajos, todo en un mismo lugar.',
      'Apuntes, videos y recursos de cada curso, ordenados clase por clase.',
      'Las evaluaciones se hacen ahí y vas viendo tu avance durante la cursada.',
    ],
  },
};

export function PlatformSection({ audience }: { audience: keyof typeof COPY }) {
  const c = COPY[audience];
  return (
    <section id="plataforma" className="scroll-mt-24 px-3 pt-28 sm:px-6 sm:pt-36">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[40px] border-2 border-[#031e41] bg-[#2FD3A0] px-6 py-14 shadow-[8px_8px_0_#031e41] sm:px-12 sm:py-20" style={PEGBOARD}>
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
          <div className="reveal">
            <p className="inline-flex items-center gap-2 rounded-full border-2 border-[#031e41] bg-white px-4 py-2 text-sm font-semibold">
              <Sparkles size={16} aria-hidden /> Incluida en todos los cursos
            </p>
            <h2 className={`mt-6 text-balance text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl ${D}`}>Nuestra propia plataforma de aprendizaje</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#031e41]/80">{c.intro}</p>
            {c.note && (
              <p className="mt-4 flex max-w-xl items-start gap-2.5 rounded-2xl border-2 border-[#031e41] bg-white px-4 py-3 text-[15px] font-medium">
                <Users size={18} className="mt-0.5 shrink-0" aria-hidden /> {c.note}
              </p>
            )}
            <ul className="mt-9 grid gap-4 sm:grid-cols-2">
              {ITEMS.map(({ icon: Icon, title, bg }, i) => (
                <li key={title} className="rounded-2xl border-2 border-[#031e41] bg-white/85 p-4 shadow-[3px_3px_0_#031e41]">
                  <span className="flex size-10 items-center justify-center rounded-xl border-2 border-[#031e41]" style={{ background: bg }}><Icon size={20} strokeWidth={2.2} aria-hidden /></span>
                  <h3 className={`mt-3 text-lg font-bold leading-tight ${D}`}>{title}</h3>
                  <p className="mt-1 text-[15px] leading-snug text-[#031e41]/75">{c.items[i]}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Maqueta ilustrativa (datos de ejemplo) */}
          <div className="reveal relative pb-24 sm:pb-20" role="img" aria-label="Ejemplo de la plataforma: la cursada de Robótica con clases, una tarea y el seguimiento de los estudiantes">
            <div aria-hidden className="overflow-hidden rounded-3xl border-2 border-[#031e41] bg-white shadow-[6px_6px_0_#031e41] lg:-rotate-1">
              <div className="flex items-center gap-1.5 border-b-2 border-[#031e41] bg-[#EAF2FB] px-4 py-3">
                <span className="size-3 rounded-full bg-[#FF6FA8]" /><span className="size-3 rounded-full bg-[#FFC531]" /><span className="size-3 rounded-full bg-[#2FD3A0]" />
                <span className="ml-3 truncate rounded-full bg-white px-3 py-1 text-xs text-[#031e41]/60">Mi cursada · Robótica</span>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <span className={`text-2xl font-extrabold ${D}`}>Robótica</span>
                  <span className="text-sm font-semibold text-[#031e41]/60">Clase 6 de 12</span>
                </div>
                <span className="mt-3 block h-3 overflow-hidden rounded-full border-2 border-[#031e41] bg-[#EAF2FB]"><span className="block h-full w-1/2 bg-[#2FD3A0]" /></span>
                <ul className="mt-5 space-y-2.5 text-[15px]">
                  <li className="flex items-center gap-3 rounded-xl bg-[#F7FAFD] px-3 py-2.5"><CircleCheck size={20} className="shrink-0 text-[#12a37a]" /> <span className="flex-1">Clase 5 · Sensores y motores</span></li>
                  <li className="flex items-center gap-3 rounded-xl border-2 border-[#031e41] bg-[#FFC531]/30 px-3 py-2.5 font-semibold"><MonitorPlay size={20} className="shrink-0" /> <span className="flex-1">Clase 6 · Programar el recorrido</span><span className="rounded-full bg-[#031e41] px-2.5 py-0.5 text-xs text-white">Hoy</span></li>
                  <li className="flex items-center gap-3 rounded-xl bg-[#F7FAFD] px-3 py-2.5"><ClipboardCheck size={20} className="shrink-0 text-[#d94c86]" /> <span className="flex-1">Tarea · Seguidor de línea</span><span className="text-xs font-semibold text-[#031e41]/60">Entrega vie.</span></li>
                  <li className="flex items-center gap-3 rounded-xl bg-[#F7FAFD] px-3 py-2.5"><BookOpenText size={20} className="shrink-0 text-[#3D6BFF]" /> <span className="flex-1">Apunte · Cómo funciona un servo</span></li>
                </ul>
              </div>
            </div>
            {/* Tarjeta del seguimiento, encimada */}
            <div aria-hidden className="absolute -bottom-8 right-0 w-[78%] max-w-[320px] rotate-2 rounded-2xl border-2 border-[#031e41] bg-[#031e41] p-4 text-white shadow-[5px_5px_0_#FFC531] sm:right-[-4%]">
              <p className="flex items-center gap-2 text-sm font-bold"><ChartLine size={16} /> Seguimiento del grupo</p>
              <ul className="mt-3 space-y-2.5 text-[13px]">
                {[['Martina', 92, '#2FD3A0'], ['Tomás', 75, '#FFC531'], ['Lucía', 58, '#FF6FA8']].map(([n, p, c]) => (
                  <li key={n as string} className="grid grid-cols-[64px_1fr_34px] items-center gap-2">
                    <span>{n}</span>
                    <span className="h-2 overflow-hidden rounded-full bg-white/15"><span className="block h-full rounded-full" style={{ width: `${p}%`, background: c as string }} /></span>
                    <span className="text-right font-semibold">{p}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
