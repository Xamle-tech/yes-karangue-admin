#!/bin/bash

# Script de configuration initiale pour Hostinger
# Ce script doit être exécuté UNE SEULE FOIS après avoir cloné le projet

set -e  # Arrêter en cas d'erreur

echo "🚀 Configuration initiale de Yes Karangue Admin sur Hostinger"
echo "============================================================="

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier Node.js
echo ""
echo "🔍 Vérification de Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js installé: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js n'est pas installé${NC}"
    echo ""
    echo "📝 Instructions pour installer Node.js :"
    echo "  1. Via hPanel : Avancé > Node.js > Activer Node.js"
    echo "  2. Ou via NVM :"
    echo "     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "     source ~/.bashrc"
    echo "     nvm install 20"
    echo "     nvm use 20"
    exit 1
fi

# Vérifier npm
echo ""
echo "🔍 Vérification de npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm installé: $NPM_VERSION${NC}"
else
    echo -e "${RED}✗ npm n'est pas installé${NC}"
    exit 1
fi

# Vérifier Git
echo ""
echo "🔍 Vérification de Git..."
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✓ Git installé: $GIT_VERSION${NC}"
else
    echo -e "${RED}✗ Git n'est pas installé${NC}"
    exit 1
fi

# Installer les dépendances
echo ""
echo "📦 Installation des dépendances npm..."
npm install

# Build de production
echo ""
echo "🔨 Build de production..."
npm run build

# Vérifier que le dossier dist existe
if [ -d "dist" ]; then
    echo -e "${GREEN}✓ Build réussi ! Le dossier dist/ a été créé${NC}"
else
    echo -e "${RED}✗ Échec du build. Le dossier dist/ n'existe pas${NC}"
    exit 1
fi

# Vérifier .htaccess
if [ -f "dist/.htaccess" ]; then
    echo -e "${GREEN}✓ Fichier .htaccess présent dans dist/${NC}"
else
    echo -e "${YELLOW}⚠ Fichier .htaccess absent dans dist/${NC}"
    echo "  Copie manuelle du .htaccess..."
    if [ -f ".htaccess" ]; then
        cp .htaccess dist/.htaccess
        echo -e "${GREEN}✓ .htaccess copié avec succès${NC}"
    else
        echo -e "${RED}✗ Fichier .htaccess source introuvable${NC}"
    fi
fi

# Résumé
echo ""
echo "============================================================="
echo -e "${GREEN}✅ Configuration terminée avec succès !${NC}"
echo ""
echo "📂 Structure des fichiers :"
echo "   $(pwd)/dist/"
echo ""
echo "🌐 Assurez-vous que le Document Root pointe vers :"
echo "   $(pwd)/dist"
echo ""
echo "🔗 Votre admin sera disponible sur :"
echo "   https://backoffice.yeskarangue.com"
echo ""
echo "============================================================="
