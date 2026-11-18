import Image from 'next/image';
import Link from 'next/link';
import { Mail, MessageCircle } from 'lucide-react';
import { EMAIL, JOIN } from '@/lib/landing';

export function LandingFooter({ schools }: { schools: { slug: string; name: string; color: { bg: string } }[] }) {
  return (
    <footer data-nav="dark" className="bg-[#031e41] text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-10 pt-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image src="/logo-sea-dark.svg" alt="SEA" width={64} height={64} className="size-16" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">Secretaría de Extensión Académica. Cursos extracurriculares de tecnología y oficios, dictados en tu escuela.</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white/50">Escuelas que ya los dictan</h3>
          <ul className="mt-4 space-y-3">
            {schools.map((s) => (
              <li key={s.slug}><Link href={`/${s.slug}`} className="flex items-center gap-2.5 text-sm text-white/80 transition hover:text-white"><span className="size-2.5 rounded-full" style={{ background: s.color.bg }} />{s.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white/50">Contacto</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li><a href={JOIN} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 transition hover:text-white"><MessageCircle size={16} className="text-[#FFC531]" />WhatsApp</a></li>
            <li><a href={`mailto:${EMAIL}`} className="flex items-center gap-2.5 transition hover:text-white"><Mail size={16} className="text-[#FFC531]" />{EMAIL}</a></li>
          </ul>
        </div>
      </div>
      <p className="mx-auto max-w-7xl border-t border-white/10 px-5 py-6 text-xs text-white/40 sm:px-8">© {new Date().getFullYear()} Portal SEA · Secretaría de Extensión Académica</p>
    </footer>
  );
}
