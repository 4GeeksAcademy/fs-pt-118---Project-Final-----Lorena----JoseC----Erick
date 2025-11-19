#!/usr/bin/env bash
# exit on error
set -o errexit

# Build frontend
npm install
npm run build

# Install Python dependencies
pip install pipenv
pipenv install --skip-lock

# Database migrations
# Inicializar migraciones si no existe la carpeta
if [ ! -d "migrations" ]; then
    echo "🔧 Initializing Flask-Migrate migrations folder..."
    pipenv run flask db init
fi

# Crear migración inicial si no hay versiones
if [ ! -d "migrations/versions" ] || [ -z "$(ls -A migrations/versions 2>/dev/null)" ]; then
    echo "📝 Creating initial migration..."
    pipenv run flask db migrate -m "Initial migration"
fi

# ARREGLAR MÚLTIPLES HEADS: Mergear automáticamente
echo "🔄 Checking for multiple heads..."
pipenv run flask db merge heads -m "Merge migration heads" || echo "No merge needed"

# Aplicar todas las migraciones
echo "⬆️ Applying database migrations..."
pipenv run flask db upgrade

echo "✅ Build completed successfully!"