# 📦 Installation de Node.js sur Hostinger via NVM

Si votre hébergement Hostinger ne propose pas Node.js directement, vous devez l'installer manuellement via **NVM (Node Version Manager)**.

---

## 🚀 Installation pas à pas

### Étape 1 : Connexion SSH

```bash
ssh u853874975@your-server.hostinger.com -p 65002
```

---

### Étape 2 : Installer NVM

```bash
# Télécharger et installer NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

**Sortie attendue :**
```
=> Downloading nvm from git to '$HOME/.nvm'
=> Cloning into '$HOME/.nvm'...
=> Compressing and cleaning up git repository
=> Appending nvm source string to $HOME/.bashrc
=> Close and reopen your terminal to start using nvm
```

---

### Étape 3 : Activer NVM

```bash
# Recharger le profil
source ~/.bashrc

# OU si vous utilisez zsh
source ~/.zshrc
```

**Vérifier que NVM fonctionne :**
```bash
nvm --version
```

**Sortie attendue :**
```
0.39.7
```

---

### Étape 4 : Installer Node.js

```bash
# Installer Node.js version 20 LTS (Long Term Support)
nvm install 20

# Définir Node.js 20 comme version par défaut
nvm use 20
nvm alias default 20
```

**Sortie attendue :**
```
Downloading and installing node v20.x.x...
Now using node v20.x.x (npm v10.x.x)
default -> 20 (-> v20.x.x)
```

---

### Étape 5 : Vérifier l'installation

```bash
node --version
npm --version
```

**Sortie attendue :**
```
v20.11.0
10.2.4
```

---

## ✅ Installation terminée !

Vous pouvez maintenant continuer avec le déploiement de l'admin :

```bash
cd /home/u853874975/public_html/backoffice.yeskarangue.com
git clone https://github.com/VOTRE_USERNAME/yes-karangue-admin.git
cd yes-karangue-admin
git checkout v2.1
./setup-hostinger.sh
```

---

## 🔍 Commandes utiles NVM

```bash
# Lister les versions disponibles
nvm ls-remote

# Lister les versions installées
nvm ls

# Installer une version spécifique
nvm install 18

# Changer de version
nvm use 18
nvm use 20

# Définir une version par défaut
nvm alias default 20

# Désinstaller une version
nvm uninstall 18
```

---

## 🐛 Troubleshooting

### Problème : `nvm: command not found`

**Solution :**
```bash
# Recharger le profil
source ~/.bashrc

# Si ça ne fonctionne toujours pas, ajouter manuellement à ~/.bashrc
nano ~/.bashrc
```

Ajouter ces lignes à la fin du fichier :
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

Puis recharger :
```bash
source ~/.bashrc
```

### Problème : `npm: command not found` après installation

**Solution :**
```bash
# Vérifier quelle version de Node est active
nvm current

# Activer Node.js 20
nvm use 20

# Vérifier npm
npm --version
```

### Problème : NVM se réinitialise après déconnexion

**Solution :** Ajouter NVM au profil bash :
```bash
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
source ~/.bashrc
```

---

## 📚 Ressources

- [Documentation officielle NVM](https://github.com/nvm-sh/nvm)
- [Node.js LTS Schedule](https://nodejs.org/en/about/releases/)

---

**✅ Une fois Node.js installé, retournez au [HOSTINGER_DEPLOYMENT.md](./HOSTINGER_DEPLOYMENT.md) pour continuer le déploiement.**
