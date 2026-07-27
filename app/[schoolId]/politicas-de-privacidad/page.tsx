import Link from 'next/link';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { Shield, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Politicas de Privacidad - SEA Centro de Formaciones',
  description: 'Politicas de privacidad y tratamiento de datos personales de SEA Centro de Formaciones.',
};

export default async function PoliticasDePrivacidadPage({
  params,
}: {
  params: Promise<{ schoolId: string }>;
}) {
  const { schoolId } = await params;

  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden">
      <Sidebar />
      <div className="flex h-screen w-full">
        <main className="w-full md:ml-[10%] overflow-x-hidden overflow-y-auto">
          <Header />

          <div className="max-w-3xl mx-auto px-4 py-10 md:py-16">
            {/* Back button */}
            <Link
              href={`/${schoolId}/formaciones`}
              className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors hover:opacity-75"
              style={{ color: '#031e41' }}
            >
              <ArrowLeft size={16} />
              Volver a Formaciones
            </Link>

            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#031e41' }}
              >
                <Shield size={20} className="text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#031e41' }}>
                Politicas de Privacidad
              </h1>
            </div>
            <p className="text-sm text-gray-500 mb-10 ml-[52px]">
              Ultima actualizacion: julio de 2026
            </p>

            {/* Sections */}
            <div className="space-y-10 text-gray-700 leading-relaxed text-sm md:text-base">

              <section>
                <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: '#031e41' }}>
                  1. Informacion general
                </h2>
                <p>
                  SEA Centro de Formaciones (en adelante &quot;SEA&quot;, &quot;nosotros&quot; o &quot;nuestro&quot;) opera el sitio web portalsea.com.ar. Esta pagina le informa sobre nuestras politicas con respecto a la recopilacion, uso y divulgacion de datos personales cuando utiliza nuestros servicios, asi como sobre las opciones que tiene asociadas con esos datos.
                </p>
              </section>

              <section>
                <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: '#031e41' }}>
                  2. Datos que recopilamos
                </h2>
                <p className="mb-3">
                  Recopilamos distintos tipos de informacion con el fin de proporcionar y mejorar nuestros servicios:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Datos de identificacion:</strong> nombre y apellido del alumno o responsable adulto.</li>
                  <li><strong>Datos de contacto:</strong> numero de telefono y/o correo electronico.</li>
                  <li><strong>Datos de inscripcion:</strong> curso, comision y fecha de inicio seleccionados.</li>
                  <li><strong>Datos de uso:</strong> informacion sobre como accede y utiliza nuestro sitio web (direccion IP, tipo de navegador, paginas visitadas), recopilada de forma anonima mediante herramientas de analisis.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: '#031e41' }}>
                  3. Uso de los datos
                </h2>
                <p className="mb-3">SEA utiliza los datos recopilados para los siguientes fines:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Gestionar y confirmar inscripciones a cursos y formaciones.</li>
                  <li>Comunicarnos con usted respecto a su inscripcion, novedades y cambios en los cursos.</li>
                  <li>Mejorar nuestros servicios, contenidos y experiencia de usuario.</li>
                  <li>Cumplir con obligaciones legales aplicables en la Republica Argentina.</li>
                  <li>Mostrar publicidad relevante a traves de plataformas como Meta (Facebook e Instagram), unicamente cuando el usuario ha dado su consentimiento.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: '#031e41' }}>
                  4. Uso de Meta Platforms (Facebook e Instagram)
                </h2>
                <p className="mb-3">
                  Nuestro sitio puede utilizar herramientas de Meta Platforms, Inc. (incluyendo el Pixel de Meta y la API de Conversiones) con el objetivo de medir la efectividad de nuestra publicidad y mostrarle anuncios relevantes.
                </p>
                <p className="mb-3">
                  A traves de estas herramientas, Meta puede recopilar informacion sobre su actividad en nuestro sitio. Esta informacion se utiliza para:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Medir conversiones y el rendimiento de campanas publicitarias.</li>
                  <li>Crear audiencias personalizadas para mostrar anuncios a personas con intereses similares.</li>
                  <li>Optimizar la entrega de anuncios.</li>
                </ul>
                <p className="mt-3">
                  El tratamiento de datos por parte de Meta esta sujeto a la{' '}
                  <a
                    href="https://www.facebook.com/privacy/policy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium"
                    style={{ color: '#031e41' }}
                  >
                    Politica de Privacidad de Meta
                  </a>
                  . Usted puede gestionar sus preferencias de publicidad desde la configuracion de su cuenta de Facebook o Instagram.
                </p>
              </section>

              <section>
                <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: '#031e41' }}>
                  5. Base legal para el tratamiento de datos
                </h2>
                <p className="mb-3">
                  El tratamiento de sus datos personales se realiza en conformidad con la Ley N° 25.326 de Proteccion de Datos Personales de la Republica Argentina, sobre las siguientes bases:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Consentimiento:</strong> cuando usted completa un formulario de inscripcion o nos contacta voluntariamente.</li>
                  <li><strong>Ejecucion de un contrato:</strong> cuando el tratamiento es necesario para gestionar su inscripcion.</li>
                  <li><strong>Interes legitimo:</strong> para mejorar nuestros servicios y comunicarnos sobre novedades relevantes.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: '#031e41' }}>
                  6. Compartir datos con terceros
                </h2>
                <p className="mb-3">
                  No vendemos, intercambiamos ni transferimos sus datos personales a terceros sin su consentimiento, salvo en los siguientes casos:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Proveedores de servicios:</strong> empresas que nos asisten en la operacion del sitio (hosting, bases de datos, analisis), bajo estrictos acuerdos de confidencialidad.</li>
                  <li><strong>Plataformas de publicidad:</strong> Meta Platforms, unicamente con datos anonimizados o bajo su consentimiento expreso.</li>
                  <li><strong>Obligaciones legales:</strong> cuando la ley lo requiera o para proteger nuestros derechos.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: '#031e41' }}>
                  7. Retencion de datos
                </h2>
                <p>
                  Conservamos sus datos personales unicamente durante el tiempo necesario para cumplir con los fines descritos en esta politica, o el tiempo exigido por la legislacion vigente. Una vez finalizada la relacion, los datos seran eliminados o anonimizados de forma segura.
                </p>
              </section>

              <section>
                <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: '#031e41' }}>
                  8. Sus derechos
                </h2>
                <p className="mb-3">
                  De acuerdo con la Ley N° 25.326, usted tiene derecho a:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Acceder</strong> a los datos personales que tenemos sobre usted.</li>
                  <li><strong>Rectificar</strong> datos inexactos o incompletos.</li>
                  <li><strong>Suprimir</strong> sus datos cuando ya no sean necesarios o haya retirado su consentimiento.</li>
                  <li><strong>Oponerse</strong> al tratamiento de sus datos para fines de marketing directo.</li>
                  <li><strong>Portabilidad:</strong> recibir sus datos en un formato estructurado y legible.</li>
                </ul>
                <p className="mt-3">
                  Para ejercer cualquiera de estos derechos, puede contactarnos a traves de WhatsApp al{' '}
                  <a
                    href="https://wa.me/543513697444"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium"
                    style={{ color: '#031e41' }}
                  >
                    +54 3513697444
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: '#031e41' }}>
                  9. Seguridad de los datos
                </h2>
                <p>
                  Implementamos medidas tecnicas y organizativas adecuadas para proteger sus datos personales contra accesos no autorizados, alteracion, divulgacion o destruccion. Sin embargo, ningun metodo de transmision por internet es completamente seguro, por lo que no podemos garantizar su seguridad absoluta.
                </p>
              </section>

              <section>
                <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: '#031e41' }}>
                  10. Cambios en esta politica
                </h2>
                <p>
                  Podemos actualizar esta politica de privacidad periodicamente. Le notificaremos cualquier cambio publicando la nueva version en esta pagina con una fecha de actualizacion actualizada. Le recomendamos revisar esta politica regularmente.
                </p>
              </section>

              <section>
                <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: '#031e41' }}>
                  11. Contacto
                </h2>
                <p>
                  Si tiene preguntas o inquietudes sobre esta politica de privacidad o sobre el tratamiento de sus datos personales, puede contactarnos:
                </p>
                <ul className="list-none mt-3 space-y-1 ml-2">
                  <li><strong>Organizacion:</strong> SEA Centro de Formaciones</li>
                  <li><strong>Sitio web:</strong> portalsea.com.ar</li>
                  <li>
                    <strong>WhatsApp:</strong>{' '}
                    <a
                      href="https://wa.me/543513697444"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium"
                      style={{ color: '#031e41' }}
                    >
                      +54 3513697444
                    </a>
                  </li>
                </ul>
              </section>

            </div>

            {/* Footer divider */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <Link
                href={`/${schoolId}/formaciones`}
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-75"
                style={{ color: '#031e41' }}
              >
                <ArrowLeft size={16} />
                Volver a Formaciones
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
