#!/bin/bash

# Script para agregar cursos rápidamente
# Uso: ./add_course.sh

read -p "Nombre del slug (ej: desarrollo-apps): " slug
read -p "Título del curso: " title
read -p "Subtítulo: " subtitle
read -p "Descripción corta: " description
read -p "Precio (ej: \$35.000/mes): " price
read -p "Duración (ej: 24 clases): " duration
read -p "Fecha inicio (YYYY-MM-DD): " startDate
read -p "Horario: " schedule
read -p "Ubicación: " location
read -p "Docente: " teacher
read -p "Nivel (PRINCIPIANTE/INTERMEDIO/AVANZADO): " level
read -p "Objetivo del curso: " objective
read -p "Metodología: " methodology
read -p "Proyecto final: " finalProject
read -p "Requisitos: " requirements

echo "Agregando curso..."

curl -s -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d "{
    \"slug\": \"$slug\",
    \"title\": \"$title\",
    \"subtitle\": \"$subtitle\",
    \"description\": \"$description\",
    \"badge\": \"PRESENCIAL\",
    \"status\": \"open\",
    \"category\": \"general\",
    \"price\": \"$price\",
    \"duration\": \"$duration\",
    \"startDate\": \"$startDate\",
    \"schedule\": \"$schedule\",
    \"location\": \"$location\",
    \"teacher\": \"$teacher\",
    \"modality\": \"PRESENCIAL\",
    \"level\": \"$level\",
    \"objective\": \"$objective\",
    \"methodology\": \"$methodology\",
    \"finalProject\": \"$finalProject\",
    \"requirements\": \"$requirements\",
    \"modules\": []
  }" | jq .

echo "¡Curso agregado exitosamente! Puedes editar los módulos en el panel de administración."
