'use client';

import React, { useState } from 'react';
import { useSiteSettings, FAQ } from '@/context/SiteSettingsContext';
import { Plus, Edit2, Trash2, GripVertical, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FAQManager() {
  const { faqs, addFAQ, updateFAQ, deleteFAQ, reorderFAQs } = useSiteSettings();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ question: '', answer: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateFAQ(editingId, formData);
      setEditingId(null);
    } else {
      addFAQ({
        ...formData,
        order: faqs.length + 1,
      });
    }
    setFormData({ question: '', answer: '' });
    setShowForm(false);
  };

  const handleEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setFormData({ question: faq.question, answer: faq.answer });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta pregunta?')) {
      deleteFAQ(id);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ question: '', answer: '' });
    setShowForm(false);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newFaqs = [...faqs];
    [newFaqs[index - 1], newFaqs[index]] = [newFaqs[index], newFaqs[index - 1]];
    newFaqs.forEach((faq, i) => (faq.order = i + 1));
    reorderFAQs(newFaqs);
  };

  const moveDown = (index: number) => {
    if (index === faqs.length - 1) return;
    const newFaqs = [...faqs];
    [newFaqs[index], newFaqs[index + 1]] = [newFaqs[index + 1], newFaqs[index]];
    newFaqs.forEach((faq, i) => (faq.order = i + 1));
    reorderFAQs(newFaqs);
  };

  const sortedFAQs = [...faqs].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#031e41' }}>
            Preguntas Frecuentes
          </h2>
          <p className="text-gray-600">
            Gestiona las preguntas y respuestas que se muestran en la sección de FAQ
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-white"
            style={{ backgroundColor: '#031e41' }}
          >
            <Plus size={20} />
            Nueva Pregunta
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#031e41' }}>
            {editingId ? 'Editar Pregunta' : 'Nueva Pregunta'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Pregunta *
              </label>
              <input
                type="text"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Escribe la pregunta..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Respuesta *
              </label>
              <textarea
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Escribe la respuesta..."
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex items-center gap-2 text-white"
                style={{ backgroundColor: '#031e41' }}
              >
                <Save size={18} />
                {editingId ? 'Guardar Cambios' : 'Agregar Pregunta'}
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                className="flex items-center gap-2"
              >
                <X size={18} />
                Cancelar
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* FAQ List */}
      <div className="space-y-4">
        {sortedFAQs.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No hay preguntas frecuentes configuradas</p>
            <p className="text-sm text-gray-400 mt-2">
              Haz clic en "Nueva Pregunta" para agregar la primera
            </p>
          </div>
        ) : (
          sortedFAQs.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Reorder Controls */}
                <div className="flex flex-col gap-1 pt-1">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mover arriba"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 15l-6-6-6 6"/>
                    </svg>
                  </button>
                  <GripVertical size={16} className="text-gray-400" />
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === sortedFAQs.length - 1}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mover abajo"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h4 className="font-semibold text-lg" style={{ color: '#031e41' }}>
                    {faq.question}
                  </h4>
                  <p className="text-gray-600 mt-2">{faq.answer}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
