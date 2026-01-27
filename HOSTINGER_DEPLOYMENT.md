# 🚀 Guide de Déploiement - Yes Karangue Admin sur Hostinger

## 📋 Prérequis

- Compte Hostinger avec accès SSH
- Accès au panneau de contrôle (hPanel)
- Git configuré sur le serveur Hostinger
- Node.js et npm installés sur Hostinger

---

## 🌐 Étape 1 : Créer le sous-domaine

### ⚠️ IMPORTANT : Configuration du Document Root

1. Connectez-vous au **hPanel** de Hostinger
2. Allez dans **Domaines** > **Sous-domaines**
3. Cliquez sur **Créer un sous-domaine**

### Configuration :

- **Sous-domaine** : `backoffice`
- **Domaine parent** : `yeskarangue.com`
- **Document Root** : `/home/u853874975/public_html/backoffice.yeskarangue.com/yes-karangue-admin/dist`

### ⚠️ CHEMIN CRITIQUE

```
/home/u853874975/public_html/backoffice.yeskarangue.com/yes-karangue-admin/dist
```

**Notez bien** :
- Le chemin pointe vers le dossier `dist/` (pas la racine du projet)
- C'est là que Vite génère les fichiers de production
- ❌ NE PAS pointer vers `/yes-karangue-admin` seul

---

## 🔐 Étape 2 : Connexion SSH

```bash
ssh u853874975@your-server.hostinger.com -p 65002
```

---

## 📦 Étape 2.5 : Installer Node.js et npm (OBLIGATOIRE)

### Vérifier si Node.js est installé

```bash
node --version
npm --version
```

### Si Node.js n'est pas installé (erreur "command not found")

**📖 Consultez le guide complet : [INSTALL_NODEJS.md](./INSTALL_NODEJS.md)**

**Installation rapide via NVM :**

```bash
# 1. Installer NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 2. Activer NVM
source ~/.bashrc

# 3. Installer Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# 4. Vérifier
node --version
npm --version
```

**✅ Node.js est maintenant installé et prêt à l'emploi !**

---

## 📦 Étape 3 : Cloner le projet

```bash
# Aller dans le dossier du sous-domaine
cd /home/u853874975/public_html/backoffice.yeskarangue.com

# Cloner le repository
git clone https://github.com/VOTRE_USERNAME/yes-karangue-admin.git

# Entrer dans le dossier
cd yes-karangue-admin

# Se placer sur la bonne branche
git checkout v2.1
```

---

## 🛠️ Étape 4 : Installation et Build

### Option A : Script automatique (Recommandé)

```bash
# Rendre le script exécutable
chmod +x setup-hostinger.sh

# Exécuter le script
./setup-hostinger.sh
```

Le script va :
- ✅ Vérifier Node.js, npm et Git
- ✅ Installer les dépendances
- ✅ Builder le projet
- ✅ Vérifier que .htaccess est bien copié

### Option B : Installation manuelle

```bash
# Installer les dépendances
npm install

# Build de production
npm run build
```

Le build va créer un dossier `dist/` avec tous les fichiers optimisés.

---

## ✅ Étape 5 : Vérifier le déploiement

Visitez : **https://backoffice.yeskarangue.com**

Si vous voyez la page de login, c'est parfait ! ✅

### En cas d'erreur 404 :

1. Vérifiez que le **Document Root** pointe bien vers le dossier `dist/`
2. Vérifiez que le fichier `.htaccess` est présent dans `dist/`

```bash
ls -la /home/u853874975/public_html/backoffice.yeskarangue.com/yes-karangue-admin/dist/
```

Vous devriez voir :
- `index.html`
- `.htaccess`
- `assets/` (dossier avec JS et CSS)

---

## 🤖 Déploiement Automatique avec GitHub Actions

### Configuration des Secrets GitHub

1. Allez sur votre repository GitHub
2. **Settings** > **Secrets and variables** > **Actions**
3. Ajoutez les secrets suivants :

| Secret | Valeur |
|--------|--------|
| `HOSTINGER_SSH_HOST` | Votre hostname SSH Hostinger |
| `HOSTINGER_SSH_USERNAME` | `u853874975` |
| `HOSTINGER_SSH_PASSWORD` | Votre mot de passe SSH |
| `HOSTINGER_SSH_PORT` | `65002` (ou votre port) |

### Déploiement automatique

Une fois configuré, **chaque push sur la branche `v2.1`** déclenchera automatiquement :

1. 📥 Pull des dernières modifications
2. 📦 Installation des dépendances
3. 🔨 Build de production
4. ✅ Mise en ligne sur https://backoffice.yeskarangue.com

---

## 🔄 Déploiement Manuel (si besoin)

```bash
# Connexion SSH
ssh u853874975@your-server.hostinger.com -p 65002

# Aller dans le dossier du projet
cd /home/u853874975/public_html/backoffice.yeskarangue.com/yes-karangue-admin

# Pull des modifications
git pull origin v2.1

# Installer les dépendances (si package.json a changé)
npm install

# Build de production
npm run build
```

---

## 📝 Structure des fichiers

```
/home/u853874975/public_html/backoffice.yeskarangue.com/
└── yes-karangue-admin/
    ├── .github/
    │   └── workflows/
    │       └── deploy-hostinger.yml    # Configuration GitHub Actions
    ├── src/                             # Code source React
    ├── dist/                            # ⚠️ Fichiers de production (Document Root)
    │   ├── index.html
    │   ├── .htaccess                    # Configuration Apache
    │   └── assets/
    ├── .htaccess                        # Source (copié dans dist/)
    ├── vite.config.js
    └── package.json
```

---

## 🔍 Troubleshooting

### Problème : npm: command not found

**Cause** : Node.js et npm ne sont pas installés ou pas dans le PATH

**Solution** :
1. Installez Node.js via le panneau Hostinger (voir Étape 2.5)
2. Ou installez via NVM :
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

### Problème : 404 sur les routes React

**Cause** : Le `.htaccess` n'est pas présent ou mal configuré

**Solution** :
```bash
cd /home/u853874975/public_html/backoffice.yeskarangue.com/yes-karangue-admin
npm run build
```

Le build va automatiquement copier le `.htaccess` dans `dist/`

### Problème : L'admin ne se connecte pas à l'API

**Cause** : L'URL de l'API est incorrecte

**Solution** : Vérifier `src/config/api.js`
```javascript
export const API_BASE_URL = import.meta.env.DEV
    ? ''
    : (import.meta.env.VITE_API_BASE_URL || 'https://xamleprodbackend.yeskarangue.com');
```

### Problème : GitHub Actions échoue

**Cause** : Secrets GitHub mal configurés

**Solution** : Vérifier que tous les secrets sont bien définis dans GitHub

---

## 🎯 Résumé

| Élément | Valeur |
|---------|--------|
| **URL Admin** | https://backoffice.yeskarangue.com |
| **URL API** | https://xamleprodbackend.yeskarangue.com |
| **Document Root** | `/home/u853874975/public_html/backoffice.yeskarangue.com/yes-karangue-admin/dist` |
| **Branche de déploiement** | `v2.1` |
| **Port SSH** | `65002` |

---

**✅ Votre admin est maintenant en ligne et se déploie automatiquement !**
