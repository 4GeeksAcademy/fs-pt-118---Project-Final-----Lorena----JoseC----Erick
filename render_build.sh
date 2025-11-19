#!/usr/bin/env bash
# exit on error
set -o errexit

# Build frontend
npm install
npm run build

# Install Python dependencies
pip install pipenv
# CAMBIO: Forzar instalación sin verificar hashes
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

# Aplicar todas las migraciones
echo "⬆️ Applying database migrations..."
pipenv run flask db upgrade

echo "✅ Build completed successfully!"