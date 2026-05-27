import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const news = [
  {
    id: 1,
    title: 'Nueva Especialización en IA y Machine Learning',
    description: 'Lanzamos un programa especializado en inteligencia artificial dirigido a profesionales',
    category: 'Programas',
    date: '15 de Mayo 2026',
    image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 2,
    title: 'Jornada de Networking con Empresas Líderes',
    description: 'Participa en nuestra jornada anual donde conocerás profesionales de grandes empresas',
    category: 'Eventos',
    date: '20 de Mayo 2026',
    image: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    id: 3,
    title: 'Ciclo de Conferencias sobre Sostenibilidad',
    description: 'Expertos discuten sobre tecnología sostenible y su impacto en la industria',
    category: 'Conferencias',
    date: '25 de Mayo 2026',
    image: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
];

export default function NewsSection() {
  return (
    <section id="noticias" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Últimas Novedades</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mantente actualizado con los últimos eventos, programas y oportunidades
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
              <div
                className="w-full h-40"
                style={{ background: item.image }}
              />
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary">{item.category}</Badge>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
                <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-2 mb-4">{item.description}</CardDescription>
                <Button variant="link" className="p-0 text-primary">
                  Leer más →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
            Ver Todas las Noticias
          </Button>
        </div>
      </div>
    </section>
  );
}
