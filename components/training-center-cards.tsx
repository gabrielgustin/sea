import Link from 'next/link';

export default function TrainingCenterCards() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Info Cards Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Card 1 */}
        <Link href="/formaciones">
          <div className="p-4 md:p-8 rounded-2xl text-white text-center transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer flex flex-col justify-center min-h-64 md:min-h-80" style={{ backgroundColor: '#031e41' }}>
            <h3 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">Lleva SEA a tu Institución</h3>
            <p className="text-sm md:text-lg leading-relaxed">
              Creamos tu Centro de Formación junto a la Secretaría de Extensión Académica.
            </p>
          </div>
        </Link>

        {/* Card 2 */}
        <Link href="/trabaja-con-nosotros">
          <div className="p-4 md:p-8 rounded-2xl text-white text-center transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer flex flex-col justify-center min-h-64 md:min-h-80" style={{ backgroundColor: '#031e41' }}>
            <h3 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">Trabajá con Nosotros</h3>
            <p className="text-sm md:text-lg leading-relaxed">
              Graduado/a y estudiante avanzado/a: Postulate para trabajar en nuestros proyectos o dictar cursos
            </p>
          </div>
        </Link>

        {/* Card 3 */}
        <Link href="/catalogo-formaciones">
          <div className="p-4 md:p-8 rounded-2xl text-white text-center transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer flex flex-col justify-center min-h-64 md:min-h-80" style={{ backgroundColor: '#031e41' }}>
            <h3 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">Nuestras Formaciones</h3>
            <p className="text-sm md:text-lg leading-relaxed">
              Explora todo nuestro catálogo de formaciones disponibles y encuentra la que mejor se adapte a tus necesidades
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
