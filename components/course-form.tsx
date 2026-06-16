'use client';

import React, { useState, useEffect } from 'react';
import { Course, Commission } from '@/context/CoursesContext';
import { useSchool } from '@/context/SchoolContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronUp, ChevronDown, Plus, Trash2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { DatePicker } from '@/components/date-picker';

interface CourseFormProps {
  course?: Course;
  onSave: (courseData: any) => Promise<void> | void;
  onCancel: () => void;
}

interface Module {
  number: string;
  title: string;
  topics: string[];
}

export default function CourseForm({ course, onSave, onCancel }: CourseFormProps) {
  const { schoolId } = useSchool();
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    badge: 'PRESENCIAL',
    startDate: '',
    enrollmentDeadline: '',
    modality: 'Presencial',
    slug: '',
    description: '',
    schedule: '',
    location: 'ITS Savio, Valle Escondido',
    teacher: '',
    duration: '6 meses',
    price: '',
    requirements: '',
    objective: '',
    modules: [] as Module[],
    methodology: '',
    finalProject: '',
    whatsappGroup: '',
    level: 'PRINCIPIANTE',
    showOnHome: false,
    commissions: [] as Commission[],
  });

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    details: false,
    modules: false,
    content: false,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData(prev => ({ ...prev, ...course }));
      // Set preview if image already exists (base64 or URL)
      if (course.image) {
        setImagePreview(course.image);
      }
    }
  }, [course]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (value: string) => {
    const newSlug = generateSlug(value);
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: newSlug,
    }));
  };

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('La imagen no debe exceder 8MB');
      return;
    }

    setUploading(true);

    try {
      // Show local preview immediately
      const localUrl = URL.createObjectURL(file);
      setImagePreview(localUrl);

      // Upload via FormData to avoid JSON body size limits
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', `courses/${schoolId}`);

      const res = await fetch('/api/upload-image', { method: 'POST', body: fd });
      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? 'Upload failed');
      }

      setFormData(prev => ({ ...prev, image: data.url }));
      setImagePreview(data.url);
    } catch (err: any) {
      alert('Error al subir la imagen: ' + err.message);
      setImagePreview(null);
      setFormData(prev => ({ ...prev, image: '' }));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: '',
    }));
    setImagePreview(null);
  };

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
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
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Ej: Desarrollo de Aplicaciones"
                    className="mt-2 transition-smooth"
                  />
                </div>
                <div>
                  <Label>Slug (URL) - Se genera automáticamente</Label>
                  <div className="mt-2 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-mono text-sm">
                    {formData.slug || '(se generará cuando ingreses el título)'}
                  </div>
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
                <Label>Imagen del Curso *</Label>
                <div className="mt-2 space-y-4">
                  {/* Upload Area */}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                      id="course-image-upload"
                    />
                    <label
                      htmlFor="course-image-upload"
                      className="flex flex-col items-center justify-center w-full px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{
                        borderColor: imagePreview ? '#031e41' : '#d1d5db',
                        backgroundColor: uploading ? '#f3f4f6' : 'transparent',
                        opacity: uploading ? 0.6 : 1,
                      }}
                    >
                      <div className="text-center">
                        <Upload size={32} className="mx-auto mb-2" style={{ color: '#031e41' }} />
                        <p className="text-sm font-medium" style={{ color: '#031e41' }}>
                          {uploading ? 'Subiendo imagen...' : 'Arrastra una imagen aquí'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          o haz clic para seleccionar (máx 5MB)
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={imagePreview}
                        alt="Vista previa"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                      <p className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                        {imagePreview.startsWith('data:') ? 'Imagen local' : 'URL'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Fecha de Inicio</Label>
                  <DatePicker
                    value={formData.startDate}
                    onChange={(date) => handleInputChange('startDate', date)}
                    placeholder="Seleccionar fecha de inicio"
                  />
                </div>
                <div>
                  <Label>Fecha Limite Inscripcion</Label>
                  <DatePicker
                    value={formData.enrollmentDeadline || ''}
                    onChange={(date) => handleInputChange('enrollmentDeadline', date)}
                    placeholder="Seleccionar fecha límite"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Modalidad</Label>
                  <Input
                    value={formData.modality}
                    onChange={(e) => handleInputChange('modality', e.target.value)}
                    placeholder="Presencial"
                    className="mt-2 transition-smooth"
                  />
                </div>
                <div>
                  <Label>Nivel del Curso</Label>
                  <select
                    value={formData.level || 'PRINCIPIANTE'}
                    onChange={(e) => handleInputChange('level', e.target.value)}
                    className="mt-2 w-full border rounded-lg px-3 py-2 transition-smooth"
                  >
                    <option value="PRINCIPIANTE">Principiante</option>
                    <option value="INTERMEDIO">Intermedio</option>
                    <option value="AVANZADO">Avanzado</option>
                  </select>
                </div>
              </div>

              {/* Show on Home toggle */}
              <div
                onClick={() => handleInputChange('showOnHome', !formData.showOnHome)}
                className="flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all select-none"
                style={{
                  borderColor: formData.showOnHome ? '#031e41' : '#e5e7eb',
                  backgroundColor: formData.showOnHome ? 'rgba(3,30,65,0.04)' : '#f9fafb',
                }}
              >
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#031e41' }}>
                    Mostrar en "Proximas Formaciones"
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Si esta activo, el curso aparece en el inicio del sitio ademas del catalogo
                  </p>
                </div>
                <div
                  className="relative w-11 h-6 rounded-full flex-shrink-0 transition-colors duration-200"
                  style={{ backgroundColor: formData.showOnHome ? '#031e41' : '#d1d5db' }}
                >
                  <div
                    className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                    style={{ transform: formData.showOnHome ? 'translateX(20px)' : 'translateX(2px)' }}
                  />
                </div>
              </div>

              {/* Commission Manager */}
              <div className="rounded-xl border-2 overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
                <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: '#f0f4f8' }}>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#031e41' }}>Comisiones</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Cada comision tiene su propio horario y limite de inscriptos
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newCommission: Commission = {
                        id: `com_${Date.now()}`,
                        name: '',
                        maxCapacity: 20,
                      };
                      handleInputChange('commissions', [...(formData.commissions || []), newCommission]);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    style={{ backgroundColor: '#031e41', color: '#ffffff' }}
                  >
                    <Plus size={13} />
                    Agregar
                  </button>
                </div>

                {(formData.commissions || []).length === 0 ? (
                  <div className="px-4 py-5 text-center">
                    <p className="text-sm text-gray-400">Sin comisiones. Agrega al menos una para que los alumnos puedan inscribirse.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {(formData.commissions || []).map((commission, idx) => (
                      <div key={commission.id} className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: '#ffffff' }}>
                        <span className="text-xs font-bold text-gray-400 w-5 flex-shrink-0">#{idx + 1}</span>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="text-xs text-gray-500 font-medium mb-1 block">Nombre / Horario</label>
                            <Input
                              value={commission.name}
                              onChange={(e) => {
                                const updated = [...(formData.commissions || [])];
                                updated[idx] = { ...updated[idx], name: e.target.value };
                                handleInputChange('commissions', updated);
                              }}
                              placeholder="Ej: Lunes 18hs, Miercoles 20hs"
                              className="h-8 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 font-medium mb-1 block">Limite de inscriptos</label>
                            <Input
                              type="number"
                              min={1}
                              max={500}
                              value={commission.maxCapacity}
                              onChange={(e) => {
                                const updated = [...(formData.commissions || [])];
                                updated[idx] = { ...updated[idx], maxCapacity: Math.max(1, parseInt(e.target.value) || 1) };
                                handleInputChange('commissions', updated);
                              }}
                              placeholder="20"
                              className="h-8 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 font-medium mb-1 block">Link WhatsApp (opcional)</label>
                            <Input
                              type="url"
                              value={commission.whatsappLink || ''}
                              onChange={(e) => {
                                const updated = [...(formData.commissions || [])];
                                updated[idx] = { ...updated[idx], whatsappLink: e.target.value };
                                handleInputChange('commissions', updated);
                              }}
                              placeholder="https://chat.whatsapp.com/..."
                              className="h-8 text-sm"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (formData.commissions || []).filter((_, i) => i !== idx);
                            handleInputChange('commissions', updated);
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                        >
                          <Trash2 size={15} style={{ color: '#ef4444' }} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                  <Label>Lugar</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="ITS Savio, Valle Escondido"
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
                <Label>Requisitos de Inscripción</Label>
                <Textarea
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="Describe los requisitos para inscribirse (ej: Edad mínima, conocimientos previos, etc.)"
                  rows={2}
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
          disabled={saving}
          className="text-white"
          style={{ backgroundColor: '#031e41' }}
        >
          {saving ? 'Guardando...' : course ? 'Actualizar Curso' : 'Crear Curso'}
        </Button>
      </div>
    </form>
  );
}
