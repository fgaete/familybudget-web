#!/bin/bash

# Script de despliegue que incluye Git push y Firebase deploy

echo "🚀 Iniciando proceso de despliegue..."

# Verificar si hay cambios para commitear
if [[ -n $(git status --porcelain) ]]; then
    echo "📝 Agregando cambios a Git..."
    git add .
    
    echo "💬 Ingrese el mensaje del commit:"
    read -r commit_message
    
    if [[ -z "$commit_message" ]]; then
        commit_message="Actualización automática - $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    
    echo "📦 Creando commit: $commit_message"
    git commit -m "$commit_message"
    
    echo "⬆️ Subiendo cambios a repositorio remoto..."
    git push
else
    echo "✅ No hay cambios nuevos para commitear"
fi

# Crear build de producción
echo "🏗️ Creando build de producción..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build creado exitosamente"
    
    # Desplegar a Firebase
    echo "🔥 Desplegando a Firebase Hosting..."
    firebase deploy --only hosting
    
    if [ $? -eq 0 ]; then
        echo "🎉 ¡Despliegue completado exitosamente!"
        echo "🌐 La aplicación está disponible en: https://family-budget-app-2b857.web.app"
    else
        echo "❌ Error en el despliegue a Firebase"
        exit 1
    fi
else
    echo "❌ Error en la creación del build"
    exit 1
fi

echo "✨ Proceso de despliegue finalizado"