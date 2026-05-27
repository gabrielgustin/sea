import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Briefcase, Trophy } from 'lucide-react';

const programs = [
  {
    id: 1,
    title: 'Programa Inicial',
    description: 'Programas diseñados para iniciantes en temas de ingeniería y tecnología',
    icon: BookOpen,
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 2,
    title: 'Certificaciones',
    description: 'Obtén certificaciones profesionales reconocidas internacionalmente',
    icon: Trophy,
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 3,
    title: 'Trabajo con Industria',
    description: 'Colabora con empresas líderes en proyectos reales',
    icon: Briefcase,
    color: 'from-orange-400 to-orange-600',
  },
  {
    id: 4,
    title: 'Oportunidades Laborales',
    description: 'Accede a oportunidades de empleo exclusivas',
    icon: Users,
    color: 'from-green-400 to-green-600',
  },
];

export default function ProgramsSection() {
  return (
    <section id="programas" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Nuestros Programas</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explora una amplia variedad de programas de extensión académica diseñados para impulsar tu carrera profesional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program) => {
            const Icon = program.icon;
            return (
              <Card key={program.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${program.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{program.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{program.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Ver Todos los Programas
          </Button>
        </div>
      </div>
    </section>
  );
}
