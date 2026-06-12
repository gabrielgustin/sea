'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export default function FAQSection() {
  const { faqs } = useSiteSettings();
  const sortedFAQs = [...faqs].sort((a, b) => a.order - b.order);

  if (sortedFAQs.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Preguntas Frecuentes</h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {sortedFAQs.map((item) => (
            <AccordionItem key={item.id} value={`faq-${item.id}`}>
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="text-base font-semibold text-foreground">
                  {item.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
