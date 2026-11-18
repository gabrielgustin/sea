// Datos y estilo compartidos por la landing madre (/) y las páginas de cada capacitación.
import { Bricolage_Grotesque } from 'next/font/google';
import { listTenants, toPublic } from '@/lib/tenants/registry';
import { clientFor } from '@/lib/tenants/db';

export const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display' });
export const D = '[font-family:var(--font-display)]';

// Contacto de la Secretaría. shortcut: fijo en código; pasar a configuración si cambia seguido.
export const EMAIL = 'formaciones@portalsea.com.ar';
export const wa = (msg: string) => `https://wa.me/5493513697444?text=${encodeURIComponent(msg)}`;
export const JOIN = wa('Hola! Quiero sumar cursos extracurriculares en mi escuela.');

// Título corto para las tarjetas, así todas quedan de alto parejo ("Categoría III" → "Cat. III").
export const shortTitle = (t: string) => t.replace(/\bCategor[ií]a\s+/gi, 'Cat.\u00a0');

export const pegboard = { backgroundImage: 'radial-gradient(rgb(3 30 65 / .14) 1.4px, transparent 1.6px)', backgroundSize: '26px 26px' };

const SCHOOL_COLORS = [
  { bg: '#FFC531', fg: '#031e41' },
  { bg: '#3D6BFF', fg: '#ffffff' },
  { bg: '#2FD3A0', fg: '#031e41' },
  { bg: '#FF6FA8', fg: '#031e41' },
];

export type Area = 'tec' | 'ofi';
export type Module = { number?: string; title: string; topics?: string[] };
export type Capacitacion = {
  slug: string; title: string; subtitle: string; image: string | null; area: Area;
  description: string; objective: string; methodology: string; finalProject: string; duration: string;
  modules: Module[]; schools: string[];
};

type Row = Record<string, unknown>;
const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
const plain = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

// Cursos que no se ofrecen en la landing aunque estén cargados en alguna escuela (título sin tildes, en minúscula).
const HIDDEN = ['automatizacion con ia'];

// La landing muestra solo tecnología y oficios; arte y deporte quedan fuera (null).
// shortcut: el tema sale del título (la base no tiene categorías cargadas); pasar a la columna category cuando se use.
function areaOf(title: string): Area | null {
  const t = plain(title);
  if (/teatro|futbol|fisica|arte|danza|musica|deporte|pintura/.test(t)) return null;
  if (HIDDEN.includes(t)) return null;
  if (/electric|soldad|mecanic|motor|carpint|plomer/.test(t)) return 'ofi';
  return 'tec';
}

// "Robótica +10" y "Robótica +15" son una sola "Robótica": sin cortes por edad.
const baseTitle = (title: string) => title.replace(/\s*\+\s*\d+\s*$/, '').trim();
const slugify = (s: string) => plain(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const richness = (r: Row) => ['description', 'objective', 'methodology', 'finalProject', 'modules'].reduce((n, k) => n + str(r[k]).length, 0);

function modulesOf(v: unknown): Module[] {
  try {
    const m = JSON.parse(str(v) || '[]');
    return Array.isArray(m) ? m.filter((x) => x && str(x.title)) : [];
  } catch {
    return [];
  }
}

// Catálogo general: un curso que dan varias escuelas aparece una vez, con la versión más completa de sus textos.
export async function loadCatalog() {
  const tenants = await listTenants();
  const schools = await Promise.all(
    tenants.map(async (t, i) => {
      let rows: Row[] = [];
      try {
        rows = (await clientFor(t).execute('SELECT * FROM courses ORDER BY "sortOrder" ASC, "createdAt" DESC')).rows;
      } catch {} // si una base no responde, la escuela igual se muestra
      return { ...toPublic(t), color: SCHOOL_COLORS[i % SCHOOL_COLORS.length], rows: rows.filter((r) => areaOf(str(r.title))) };
    }),
  );

  const groups = new Map<string, { row: Row; school: string }[]>();
  for (const s of schools) {
    for (const row of s.rows) {
      const slug = slugify(baseTitle(str(row.title)));
      groups.set(slug, [...(groups.get(slug) ?? []), { row, school: s.name }]);
    }
  }

  const catalog: Capacitacion[] = [...groups].map(([slug, items]) => {
    const r = items.reduce((a, b) => (richness(b.row) > richness(a.row) ? b : a)).row;
    return {
      slug,
      title: baseTitle(str(r.title)),
      subtitle: str(r.subtitle),
      image: str(r.image) || items.map((i) => str(i.row.image)).find(Boolean) || null,
      area: areaOf(str(r.title))!,
      description: str(r.description),
      objective: str(r.objective),
      methodology: str(r.methodology),
      finalProject: str(r.finalProject),
      duration: str(r.duration),
      modules: modulesOf(r.modules),
      schools: [...new Set(items.map((i) => i.school))],
    };
  });

  return {
    schools: schools.map(({ rows, ...s }) => ({ ...s, count: rows.length, topics: [...new Set(rows.map((r) => baseTitle(str(r.title))))] })),
    catalog,
  };
}
