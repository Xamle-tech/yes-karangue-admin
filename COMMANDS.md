# 📋 Commandes Utiles - Yes Karangue Admin Dashboard

## 🚀 Démarrage & Développement

### Installation des dépendances
```bash
npm install
```
Installe toutes les dépendances du projet.

### Démarrer le serveur de développement
```bash
npm run dev
```
Démarre le serveur Vite sur `http://localhost:5173` avec hot reload.

### Build pour la production
```bash
npm run build
```
Crée une version optimisée dans le dossier `dist/`.

### Prévisualiser la build
```bash
npm run preview
```
Lance un serveur local pour tester la version production.

## 🔍 Maintenance & Debugging

### Vérifier les vulnerabilités
```bash
npm audit
```
Affiche les vulnérabilités de sécurité.

### Corriger les vulnerabilités automatiquement
```bash
npm audit fix
```
Corrige automatiquement les vulnérabilités si possible.

### Forcer la correction (non recommandé)
```bash
npm audit fix --force
```
Force la correction même si cela peut casser des dépendances.

### Vérifier les mises à jour disponibles
```bash
npm outdated
```
Liste les packages qui ont des mises à jour disponibles.

### Mettre à jour les packages
```bash
npm update
```
Met à jour tous les packages à la dernière version compatible.

## 📦 Gestion des Packages

### Ajouter un package
```bash
npm install nom-du-package
```
Ajoute et installe un nouveau package.

### Ajouter un package de développement
```bash
npm install --save-dev nom-du-package
```
Ajoute un package utilisé uniquement en développement.

### Supprimer un package
```bash
npm uninstall nom-du-package
```
Supprime un package du projet.

### Lister les packages installés
```bash
npm list
```
Affiche l'arborescence des packages installés.

### Voir les informations d'un package
```bash
npm info nom-du-package
```
Affiche les détails d'un package sur npm registry.

## 🧹 Nettoyage

### Supprimer node_modules
```bash
rm -rf node_modules
rm package-lock.json
npm install
```
Réinitialise complètement les dépendances.

### Nettoyer le cache npm
```bash
npm cache clean --force
```
Nettoie le cache npm local.

### Supprimer la build
```bash
rm -rf dist
```
Supprime le dossier de build.

## 🌐 Navigation Rapide

### Aller au dossier du projet
```bash
cd /Users/mouhamadougueye/Documents/GitHub/yes_karangue_admin
```

### Ouvrir dans un éditeur
```bash
code .
```
Ouvre le projet dans VS Code.

### Ouvrir dans le navigateur
```bash
open http://localhost:5173
```
(macOS) Ouvre le dashboard dans le navigateur.

```bash
start http://localhost:5173
```
(Windows) Ouvre le dashboard dans le navigateur.

```bash
xdg-open http://localhost:5173
```
(Linux) Ouvre le dashboard dans le navigateur.

## 📊 Informations du Projet

### Voir la version de Node
```bash
node --version
# ou
node -v
```

### Voir la version de npm
```bash
npm --version
# ou
npm -v
```

### Voir le fichier package.json
```bash
cat package.json
```

### Voir la version du projet
```bash
npm list | grep yes-karangue-admin
```

## 🔐 Environnement

### Créer un fichier .env
```bash
cat > .env << EOF
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENV=development
REACT_APP_VERSION=1.0.0
EOF
```

### Voir les variables d'environnement
```bash
cat .env
```

### Charger les variables d'environnement
```bash
source .env
```
(macOS/Linux)

```cmd
.\node_modules\.bin\dotenv -e .env
```
(Windows)

## 📱 Test Mobile

### Tester sur mobile local
Utilisez l'IP de votre machine au lieu de localhost :
```bash
# Trouvez votre IP
ipconfig getifaddr en0   # macOS
hostname -I             # Linux
ipconfig                # Windows

# Puis accédez via navigateur mobile :
http://[VOTRE_IP]:5173
```

## 🚀 Déploiement

### Déployer sur Vercel
```bash
npm install -g vercel
vercel
```

### Déployer sur Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Déployer manuellement
```bash
# 1. Build
npm run build

# 2. Compresser
tar -czf dist.tar.gz dist/

# 3. Copier sur serveur
scp dist.tar.gz user@server:/var/www/

# 4. Extraire sur serveur
ssh user@server
cd /var/www/
tar -xzf dist.tar.gz
```

## 🐛 Debugging

### Voir les logs du terminal
```bash
# Dans le terminal où npm run dev s'exécute
```

### Ouvrir la console du navigateur
```
F12 ou Cmd+Option+I (macOS)
```

### Inspecter les éléments
```
F12 puis cliquer sur Elements/Inspector
```

### Vérifier les performances
```
F12 > Performance > Enregistrer > Recharger > Analyser
```

## 📚 Documentation

### Voir le README
```bash
cat README.md
```

### Voir le guide d'intégration API
```bash
cat API_INTEGRATION.md
```

### Voir le guide de démarrage
```bash
cat GETTING_STARTED.md
```

### Voir le résumé du projet
```bash
cat PROJECT_SUMMARY.md
```

## 💾 Version Control

### Initialiser Git
```bash
git init
git add .
git commit -m "Initial commit"
```

### Voir l'état du repo
```bash
git status
```

### Voir l'historique des commits
```bash
git log --oneline
```

### Créer une branche
```bash
git checkout -b feature/ma-feature
```

### Fusionner une branche
```bash
git checkout main
git merge feature/ma-feature
```

## ⚡ Raccourcis Utiles

### Redémarrer rapidement
```bash
# Tuple 1 : Arrêter (Ctrl+C)
npm run dev
```

### Vider le cache et réinstaller
```bash
rm -rf node_modules package-lock.json && npm install
```

### Build et test rapide
```bash
npm run build && npm run preview
```

## 🔗 Ressources Externes

### npm
```bash
npm search npm
npm info react
npm registry https://registry.npmjs.org/
```

### Package documentations
- React : https://react.dev
- Tailwind : https://tailwindcss.com/docs
- Vite : https://vitejs.dev/guide/
- React Router : https://reactrouter.com/
- Recharts : https://recharts.org/api

## 📝 Alias Utiles

Ajoutez à votre `.bashrc`, `.zshrc` ou `.bash_profile` :

```bash
# Alias pour ce projet
alias yk-admin="cd /Users/mouhamadougueye/Documents/GitHub/yes_karangue_admin"
alias yk-start="cd /Users/mouhamadougueye/Documents/GitHub/yes_karangue_admin && npm run dev"
alias yk-build="cd /Users/mouhamadougueye/Documents/GitHub/yes_karangue_admin && npm run build"

# Alias npm globaux
alias ni="npm install"
alias nr="npm run"
alias nrdev="npm run dev"
alias nrbuild="npm run build"
```

Puis utilisez :
```bash
yk-start  # Démarre le projet
yk-build  # Build le projet
```

## 🆘 Si Ça Ne Fonctionne Pas

### Problème : Port 5173 déjà utilisé
```bash
# Changez le port dans vite.config.js
# Ou tuez le processus
lsof -i :5173
kill -9 <PID>
```

### Problème : npm commandes ne fonctionnent pas
```bash
# Réinstallez npm
npm install -g npm

# Vérifiez la version
npm -v
```

### Problème : node_modules corrompu
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problème : Permission denied
```bash
# Changez les permissions
sudo chown -R $USER:$USER /Users/mouhamadougueye/Documents/GitHub/yes_karangue_admin
```

---

**Astuce** : Sauvegardez cette page comme signets pour un accès rapide ! 📌

**Développé avec ❤️ pour Yes Karangue**

