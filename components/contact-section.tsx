'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#031e41' }}>Ponte en Contacto</h2>
          <p className="text-lg text-muted-foreground">
            ¿Tienes dudas? Envíanos un mensaje y nos comunicaremos lo antes posible
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Ubicación</h3>
                <p className="text-muted-foreground">
                  Instituto Técnico Salesiano Villada<br />
                  Cordoba Capital
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Teléfono</h3>
                <p className="text-muted-foreground">+54 3516307002</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Horarios</h3>
                <p className="text-muted-foreground">
                  Lunes a Viernes: 16:30 - 18:00<br />
                  Sábados: 9:00 - 13:00
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-fade-in-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Tu nombre"
                  className="mt-2 transition-smooth focus:ring-2 focus:ring-offset-2"
                  style={{ '--tw-ring-color': '#031e41' } as any}
                />
              </div>

              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@email.com"
                  className="mt-2 transition-smooth focus:ring-2 focus:ring-offset-2"
                  style={{ '--tw-ring-color': '#031e41' } as any}
                />
              </div>

              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+54..."
                  className="mt-2 transition-smooth focus:ring-2 focus:ring-offset-2"
                  style={{ '--tw-ring-color': '#031e41' } as any}
                />
              </div>

              <div>
                <Label htmlFor="subject">Asunto</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Asunto del mensaje"
                  className="mt-2 transition-smooth focus:ring-2 focus:ring-offset-2"
                  style={{ '--tw-ring-color': '#031e41' } as any}
                />
              </div>

              <div>
                <Label htmlFor="message">Mensaje</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Cuéntanos tu consulta..."
                  rows={4}
                  className="mt-2 transition-smooth focus:ring-2 focus:ring-offset-2"
                  style={{ '--tw-ring-color': '#031e41' } as any}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full text-white transition-all duration-300 hover:shadow-blue-lg hover-lift"
                style={{ backgroundColor: '#031e41' }}
              >
                {submitted ? '¡Mensaje Enviado!' : 'Enviar Mensaje'}
              </Button>

              {submitted && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                  <p className="text-green-800">
                    Gracias por tu mensaje. Nos comunicaremos pronto.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
