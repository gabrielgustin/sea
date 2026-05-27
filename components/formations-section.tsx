import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const formations = [
  {
    id: 1,
    title: 'Lean Manufacturing con asistencia de IA',
    type: 'Diplomatura',
    modality: 'Online',
    startDate: 'Inicia Lun 15/06/2026',
    image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 2,
    title: 'Gestión Gerencial con asistencia de IA',
    type: 'Diplomatura',
    modality: 'Online',
    startDate: 'Inicia Mar 20/06/2026',
    image: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    id: 3,
    title: 'Gestión de Mandos Medios con asistencia de IA',
    type: 'Diplomatura',
    modality: 'Online',
    startDate: 'Inicia Mié 25/06/2026',
    image: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    id: 4,
    title: 'Power BI - Nivel Inicial',
    type: 'Curso',
    modality: 'Online',
    startDate: 'Inicia Vie 27/06/2026',
    image: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  {
    id: 5,
    title: 'Análisis de escenarios para la toma de decisiones con asistencia de IA',
    type: 'Diplomatura',
    modality: 'Online',
    startDate: 'Inicia Lun 30/06/2026',
    image: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  {
    id: 6,
    title: 'EmpleHabilidad: Cómo conseguir empleo',
    type: 'Curso',
    modality: 'Presencial',
    startDate: 'Inicia Mié 15/07/2026',
    image: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  },
];

function getTypeColor(type: string) {
  return type === 'Diplomatura' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
}

export default function FormationsSection() {
  return (
    <section id="formaciones" className="py-16 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Próximas Formaciones</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Inscripciones abiertas para nuestros programas de formación especializada
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formations.map((formation) => (
            <Card key={formation.id} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
              <div
                className="w-full h-40"
                style={{ background: formation.image }}
              />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge className={getTypeColor(formation.type)}>
                    {formation.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {formation.modality}
                  </Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2">{formation.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs mb-4">
                  {formation.startDate}
                </CardDescription>
                <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                  Inscribirse
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
