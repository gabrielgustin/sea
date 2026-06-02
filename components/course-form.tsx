'use client';

import React, { useState, useEffect } from 'react';
import { Course } from '@/context/CoursesContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronUp, ChevronDown, Plus, Trash2 } from 'lucide-react';

interface CourseFormProps {
  course?: Course;
  onSave: (courseData: any) => void;
  onCancel: () => void;
}

interface Module {
  number: string;
  title: string;
  topics: string[];
}

export default function CourseForm({ course, onSave, onCancel }: CourseFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    badge: 'EDUCACIÓN PRESENCIAL',
    startDate: '',
    modality: 'Presencial',
    slug: '',
    description: '',
    schedule: '',
    location: 'ITS Villada, Valle Escondido',
    teacher: '',
    duration: '6 meses',
    price: '',
    objective: '',
    modules: [] as Module[],
    methodology: '',
    finalProject: '',
  });

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    details: false,
    modules: false,
    content: false,
  });

  useEffect(() => {
    if (course) {
      setFormData(course);
    }
  }, [course]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleModuleChange = (index: number, field: string, value: any) => {
    const newModules = [...formData.modules];
    if (field === 'topics') {
      newModules[index] = {
        ...newModules[index],
        topics: value,
      };
    } else {
      newModules[index] = {
        ...newModules[index],
        [field]: value,
      };
    }
    setFormData(prev => ({
      ...prev,
      modules: newModules,
    }));
  };

  const addModule = () => {
    const nextNumber = String(formData.modules.length + 1).padStart(2, '0');
    setFormData(prev => ({
      ...prev,
      modules: [
        ...prev.modules,
        { number: nextNumber, title: '', topics: [] },
      ],
    }));
  };

  const removeModule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index),
    }));
  };

  const addTopic = (moduleIndex: number) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].topics.push('');
    setFormData(prev => ({
      ...prev,
      modules: newModules,
    }));
  };

  const updateTopic = (moduleIndex: number, topicIndex: number, value: string) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].topics[topicIndex] = value;
    setFormData(prev => ({
      ...prev,
      modules: newModules,
    }));
  };

  const removeTopic = (moduleIndex: number, topicIndex: number) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].topics = newModules[moduleIndex].topics.filter((_, i) => i !== topicIndex);
    setFormData(prev => ({
      ...prev,
      modules: newModules,
    }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
      <div className="bg-white rounded-lg border-2 border-gray-200">
        {/* Basic Information Section */}
        <div className="border-b-2 border-gray-200">
          <button
            type="button"
            onClick={() => toggleSection('basic')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-xl font-bold" style={{ color: '#031e41' }}>
              Información Básica
            </h2>
            {expandedSections.basic ? <ChevronUp /> : <ChevronDown />}
          </button>

          {expandedSections.basic && (
            <div className="px-6 py-4 space-y-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Título del Curso *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ej: Desarrollo de Aplicaciones"
                    className="mt-2 transition-smooth"
                  />
                </div>
                <div>
                  <Label>Slug (URL) *</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="desarrollo-de-aplicaciones"
                    className="mt-2 transition-smooth"
                  />
                </div>
              </div>

              <div>
                <Label>Subtítulo *</Label>
                <Input
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  placeholder="Descripción corta del curso"
                  className="mt-2 transition-smooth"
                />
              </div>

              <div>
                <Label>URL de Imagen *</Label>
                <Input
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="/course-app-development.jpg"
                  className="mt-2 transition-smooth"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Inicialmente</Label>
                  <Input
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    placeholder="Lun 1/06/2026"
                    className="mt-2 transition-smooth"
                  />
                </div>
                <div>
                  <Label>Modalidad</Label>
                  <Input
                    value={formData.modality}
                    onChange={(e) => handleInputChange('modality', e.target.value)}
                    placeholder="Presencial"
                    className="mt-2 transition-smooth"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="border-b-2 border-gray-200">
          <button
            type="button"
            onClick={() => toggleSection('details')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-xl font-bold" style={{ color: '#031e41' }}>
              Detalles del Curso
            </h2>
            {expandedSections.details ? <ChevronUp /> : <ChevronDown />}
          </button>

          {expandedSections.details && (
            <div className="px-6 py-4 space-y-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Horario</Label>
                  <Input
                    value={formData.schedule}
                    onChange={(e) => handleInputChange('schedule', e.target.value)}
                    placeholder="Lunes: 16:30 a 18:00"
                    className="mt-2 transition-smooth"
                  />
                </div>
                <div>
                  <Label>Lugar</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="ITS Villada, Valle Escondido"
                    className="mt-2 transition-smooth"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Profesor/a</Label>
                  <Input
                    value={formData.teacher}
                    onChange={(e) => handleInputChange('teacher', e.target.value)}
                    placeholder="Gabriel Muñoz"
                    className="mt-2 transition-smooth"
                  />
                </div>
                <div>
                  <Label>Duración</Label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="6 meses"
                    className="mt-2 transition-smooth"
                  />
                </div>
              </div>

              <div>
                <Label>Precio</Label>
                <Input
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="$35.000/mes"
                  className="mt-2 transition-smooth"
                />
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="border-b-2 border-gray-200">
          <button
            type="button"
            onClick={() => toggleSection('content')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-xl font-bold" style={{ color: '#031e41' }}>
              Contenido
            </h2>
            {expandedSections.content ? <ChevronUp /> : <ChevronDown />}
          </button>

          {expandedSections.content && (
            <div className="px-6 py-4 space-y-4 bg-gray-50">
              <div>
                <Label>Objetivo del Curso</Label>
                <Textarea
                  value={formData.objective}
                  onChange={(e) => handleInputChange('objective', e.target.value)}
                  placeholder="Describe el objetivo principal del curso..."
                  rows={3}
                  className="mt-2 transition-smooth"
                />
              </div>

              <div>
                <Label>Descripción</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descripción completa del curso..."
                  rows={4}
                  className="mt-2 transition-smooth"
                />
              </div>

              <div>
                <Label>Metodología</Label>
                <Textarea
                  value={formData.methodology}
                  onChange={(e) => handleInputChange('methodology', e.target.value)}
                  placeholder="Describe la metodología del curso..."
                  rows={3}
                  className="mt-2 transition-smooth"
                />
              </div>

              <div>
                <Label>Proyecto Final</Label>
                <Textarea
                  value={formData.finalProject}
                  onChange={(e) => handleInputChange('finalProject', e.target.value)}
                  placeholder="Describe el proyecto final del curso..."
                  rows={3}
                  className="mt-2 transition-smooth"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modules Section */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection('modules')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b-2 border-gray-200"
          >
            <h2 className="text-xl font-bold" style={{ color: '#031e41' }}>
              Módulos ({formData.modules.length})
            </h2>
            {expandedSections.modules ? <ChevronUp /> : <ChevronDown />}
          </button>

          {expandedSections.modules && (
            <div className="px-6 py-4 space-y-6 bg-gray-50">
              {formData.modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="p-4 border-2 border-gray-300 rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>Número del Módulo</Label>
                          <Input
                            value={module.number}
                            onChange={(e) => handleModuleChange(moduleIndex, 'number', e.target.value)}
                            placeholder="01"
                            className="mt-1 transition-smooth"
                          />
                        </div>
                        <div>
                          <Label>Título del Módulo</Label>
                          <Input
                            value={module.title}
                            onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)}
                            placeholder="Ej: Fundamentos de Programación"
                            className="mt-1 transition-smooth"
                          />
                        </div>
                      </div>

                      {/* Topics */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm">Tópicos ({module.topics.length})</Label>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => addTopic(moduleIndex)}
                            className="flex items-center gap-1"
                          >
                            <Plus size={16} /> Agregar
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {module.topics.map((topic, topicIndex) => (
                            <div key={topicIndex} className="flex gap-2">
                              <Input
                                value={topic}
                                onChange={(e) => updateTopic(moduleIndex, topicIndex, e.target.value)}
                                placeholder={`Tópico ${topicIndex + 1}`}
                                className="transition-smooth"
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => removeTopic(moduleIndex, topicIndex)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeModule(moduleIndex)}
                      className="ml-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                onClick={addModule}
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <Plus size={18} /> Agregar Módulo
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="text-white"
          style={{ backgroundColor: '#031e41' }}
        >
          {course ? 'Actualizar Curso' : 'Crear Curso'}
        </Button>
      </div>
    </form>
  );
}
