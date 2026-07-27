import Link from 'next/link';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { FileText, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Condiciones de Servicio - SEA Centro de Formaciones',
  description: 'Condiciones de servicio y terminos de uso de SEA Centro de Formaciones.',
};

export default async function CondicionesDeServicioPage({
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
                <FileText size={20} className="text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#031e41' }}>
                Condiciones de Servicio
              </h1>
            </div>
            <p className="text-sm text-gray-500 mb-10 ml-[52px]">
              Ultima actualizacion: julio de 2026
            </p>

            {/* Sections */}
            <div className="space-y-10 text-gray-700 leading-relaxed text-sm md:text-base">

              <section>
                <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: '#031e41' }}>
                  1. Aceptacion de los terminos
                </h2>
                <p>
                  Al acceder y utilizar el sitio web portalsea.com.ar y los servicios ofrecidos por SEA Centro de Formaciones (en adelante &quot;SEA&quot;, &quot;nosotros&quot; o &quot;nuestro&quot;), usted acepta quedar vinculado por estas Condiciones de Servicio. Si no esta de acuerdo con alguna parte de estos terminos, no podra acceder al servicio.
                </p>
              </section>

              <section>
                <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: '#031e41' }}>
                  2. Descripcion del servicio
                </h2>
                <p className="mb-3">
                  SEA Centro de Formaciones ofrece cursos y formaciones presenciales en el area de tecnologia, incluyendo robotica, programacion, desarrollo de videojuegos y otras disciplinas relacionadas. A traves de nuestro sitio web, los usuarios pueden:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Explorar el catalogo de cursos y comisiones disponibles.</li>
                  <li>Completar el proceso de preinscripcion a un curso.</li>
                  <li>Obtener informacion de contacto y novedades institucionales.</li>
                </ul>
                <p className="mt-3">
                  La preinscripcion a traves del sitio no garantiza un lugar reservado hasta tanto SEA confirme la disponibilidad y se realice el pago correspondiente.
                </p>
              </section>

              <section>
                <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: '#031e41' }}>
                  3. Inscripcion y cupos
                </h2>
                <p className="mb-3">
                  Los cupos por comision son limitados. SEA se reserva el derecho de cerrar inscripciones una vez alcanzada la capacidad maxima de cada comision. El orden de preinscripcion no garantiza por si solo la confirmacion del lugar.
                </p>
                <p>
                  Una vez completada la preinscripcion, un representante de SEA se comunicara con el interesado para coordinar los pasos de confirmacion, incluyendo el pago de la primera cuota o matricula segun corresponda.
                </p>
              </section>

              <section>
                <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: '#031e41' }}>
                  4. Aranceles y pagos
                </h2>
                <p className="mb-3">
                  Los aranceles de cada curso se informan en la ficha del mismo dentro del sitio web. SEA se reserva el derecho de modificar los precios con previo aviso. Los metodos y plazos de pago se acordaran directamente con el equipo de SEA al momento de la confirmacion de la inscripcion.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>El pago de la primera cuota confirma y reserva el lugar en la comision.</li>
                  <li>Las cuotas posteriores vencen segun el calendario acordado al momento de la inscripcion.</li>
                  <li>El atraso en los pagos puede implicar la perdida del lugar en la comision.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: '#031e41' }}>
                  5. Cancelaciones y reembolsos
                </h2>
                <p className="mb-3">
                  Si el alumno decide no continuar con el curso, debera notificarlo a SEA con al menos 7 dias de anticipacion al inicio del ciclo de pago siguiente. SEA evaluara cada caso de forma individual. No se realizan reembolsos por clases ya dictadas.
                </p>
                <p>
                  En caso de que SEA deba suspender o cancelar un curso por causas ajenas a los alumnos, se ofrecera al alumno la posibilidad de cambiarse a otra comision disponible o de recibir el reembolso proporcional correspondiente.
                </p>
              </section>

              <section>
                <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: '#031e41' }}>
                  6. Conducta del usuario
                </h2>
                <p className="mb-3">
                  Al utilizar nuestros servicios, usted se compromete a:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Proporcionar informacion veraz y actualizada durante el proceso de inscripcion.</li>
                  <li>No utilizar el sitio con fines ilicitos o que perjudiquen a terceros.</li>
                  <li>No intentar acceder a areas restringidas del sitio sin autorizacion.</li>
                  <li>Respetar las normas de convivencia en los espacios de formacion presencial.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: '#031e41' }}>
                  7. Propiedad intelectual
                </h2>
                <p>
                  Todo el contenido publicado en portalsea.com.ar, incluyendo textos, imagenes, logos, materiales didacticos y disenos, es propiedad de SEA Centro de Formaciones o de sus respectivos autores y esta protegido por la legislacion argentina de propiedad intelectual. Queda prohibida su reproduccion, distribucion o uso comercial sin autorizacion expresa y escrita de SEA.
                </p>
              </section>

              <section>
                <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: '#031e41' }}>
                  8. Limitacion de responsabilidad
                </h2>
                <p>
                  SEA no sera responsable por danos directos, indirectos, incidentales o consecuentes derivados del uso o la imposibilidad de uso de nuestros servicios, incluyendo interrupciones del sitio web, errores tecnicos o fuerza mayor. El sitio se ofrece &quot;tal cual&quot; y SEA no garantiza que el acceso sea ininterrumpido o libre de errores.
                </p>
              </section>

              <section>
                <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: '#031e41' }}>
                  9. Enlaces a terceros
                </h2>
                <p>
                  Nuestro sitio puede contener enlaces a sitios web de terceros, como redes sociales o plataformas de pago. SEA no tiene control sobre el contenido de esos sitios y no asume responsabilidad alguna por sus politicas ni practicas. Le recomendamos revisar los terminos y politicas de privacidad de cualquier sitio externo que visite.
                </p>
              </section>

              <section>
                <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: '#031e41' }}>
                  10. Modificaciones a las condiciones
                </h2>
                <p>
                  SEA se reserva el derecho de modificar estas Condiciones de Servicio en cualquier momento. Los cambios entran en vigencia desde su publicacion en esta pagina. El uso continuado del sitio tras la publicacion de cambios implica la aceptacion de los nuevos terminos. Le recomendamos revisar esta pagina periodicamente.
                </p>
              </section>

              <section>
                <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: '#031e41' }}>
                  11. Ley aplicable y jurisdiccion
                </h2>
                <p>
                  Estas Condiciones de Servicio se rigen por las leyes de la Republica Argentina. Cualquier disputa derivada del uso de nuestros servicios sera sometida a la jurisdiccion de los tribunales ordinarios de la ciudad de Cordoba, Argentina, con renuncia expresa a cualquier otro fuero que pudiera corresponder.
                </p>
              </section>

              <section>
                <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: '#031e41' }}>
                  12. Contacto
                </h2>
                <p>
                  Si tiene preguntas sobre estas Condiciones de Servicio, puede comunicarse con nosotros:
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
