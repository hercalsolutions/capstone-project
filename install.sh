#!/bin/bash

# Script de Instalación Automática - Capstone Project
# Para: Ubuntu 24.04 Server
# Uso: bash install.sh

set -e

echo "================================"
echo "Instalación Automática - Capstone Project"
echo "================================"
echo ""

# Actualizar sistema
echo "📦 Actualizando sistema..."
sudo apt update
sudo apt upgrade -y

# Instalar Node.js
echo "📦 Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PostgreSQL
echo "📦 Instalando PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Iniciar PostgreSQL
echo "🚀 Iniciando PostgreSQL..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Crear base de datos
echo "📦 Creando base de datos..."
sudo -u postgres psql <<EOF
CREATE DATABASE capstone_db;
\c capstone_db
EOF

# Ejecutar schema SQL
echo "📦 Creando tablas..."
sudo -u postgres psql -d capstone_db -f database/schema.sql

# Instalar Git
echo "📦 Instalando Git..."
sudo apt install -y git

# Clonar repositorio
echo "📦 Clonando repositorio..."
cd ~
git clone https://github.com/hercalsolutions/capstone-project.git
cd capstone-project

# Crear archivo .env
echo "📦 Configurando variables de entorno..."
cat > .env << 'ENVFILE'
# Backend Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=capstone_db
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Configuration
JWT_SECRET=tu_clave_secreta_super_segura_cambiar_en_produccion_12345
JWT_EXPIRATION=7d

# Frontend Configuration
REACT_APP_API_URL=http://localhost:5000
ENVFILE

# Instalar dependencias del servidor
echo "📦 Instalando dependencias del servidor..."
cd server
npm install

# Compilar frontend
echo "📦 Compilando frontend..."
cd ../client
npm install
npm run build

echo ""
echo "================================"
echo "✅ ¡Instalación completada!"
echo "================================"
echo ""
echo "📝 Próximos pasos:"
echo ""
echo "1. Edita el archivo .env en la raíz:"
echo "   nano ~/.capstone-project/.env"
echo ""
echo "2. Cambia las credenciales de PostgreSQL si es necesario"
echo ""
echo "3. Para iniciar el servidor (en producción):"
echo "   cd ~/capstone-project/server"
echo "   npm start"
echo ""
echo "4. El frontend estará disponible en:"
echo "   http://localhost:3000"
echo ""
echo "================================"
