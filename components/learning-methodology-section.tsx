'use client';

export default function LearningMethodologySection() {
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

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#08207f' }}>
            Aprendizaje Que Realmente Funciona
          </h2>
          <p className="text-lg text-gray-600">
            Una metodología probada diseñada para construir habilidades reales y confianza
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="rounded-2xl p-6 border"
              style={{ borderColor: '#08207f', backgroundColor: '#ffffff' }}
            >
              {/* Number */}
              <div className="mb-4">
                <span className="text-4xl font-bold" style={{ color: '#08207f' }}>
                  {step.number}
                </span>
              </div>

              {/* Divider */}
              <div className="w-12 h-1 mb-4 rounded-full" style={{ backgroundColor: '#08207f' }}></div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
