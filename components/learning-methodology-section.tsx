'use client';

const steps = [
  {
    number: '01',
    title: 'Aprende',
    description: 'Participa en lecciones en video completas y materiales de curso detallados creados por expertos de la industria.',
  },
  {
    number: '02',
    title: 'Practica',
    description: 'Aplica tu conocimiento a través de ejercicios de codificación interactivos y proyectos del mundo real.',
  },
  {
    number: '03',
    title: 'Construye',
    description: 'Crea proyectos de portfolio que demuestren tus habilidades a posibles empleadores.',
  },
  {
    number: '04',
    title: 'Triunfa',
    description: 'Obtén certificación y accede a oportunidades de colocación laboral con empresas tecnológicas líderes.',
  },
];

export default function LearningMethodologySection() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance" style={{ color: '#031e41' }}>
            Nuestra ruta de aprendizaje
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Un camino probado diseñado para construir habilidades reales y confianza
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-white border border-gray-200 hover:shadow-md transition-shadow duration-300"
            >
              {/* Number */}
              <div
                className="text-5xl font-bold mb-3"
                style={{ color: '#9dc3e6' }}
              >
                {step.number}
              </div>

              {/* Divider line */}
              <div
                className="h-1 w-full rounded-full mb-5"
                style={{ backgroundColor: '#031e41' }}
              />

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
