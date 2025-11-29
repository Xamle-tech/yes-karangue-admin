# 🚀 Guide de Démarrage - Dashboard Admin Yes Karangue

Bienvenue dans le tableau de bord administrateur de Yes Karangue ! Ce guide vous aidera à démarrer rapidement.

## ⚡ Démarrage Rapide (5 minutes)

### 1️⃣ Installation

```bash
cd /Users/mouhamadougueye/Documents/GitHub/yes_karangue_admin
npm install
```

### 2️⃣ Démarrage du Serveur

```bash
npm run dev
```

L'application s'ouvrira automatiquement sur **http://localhost:5173**

### 3️⃣ Connexion

**Email** : `admin@yeskarangue.com`  
**Mot de passe** : `123456` (minimum)

C'est tout ! 🎉

## 📋 Vue d'Ensemble du Dashboard

### Pages Principales

#### 🏠 **Tableau de Bord** (`/dashboard`)
Votre page d'accueil avec :
- Statistiques clés en temps réel
- Graphiques d'activité
- Colis récents
- Meilleurs transporteurs
- État du système

#### 📦 **Colis** (`/shipments`)
Gestion complète des colis :
- Liste de tous les colis
- Création de nouveaux colis
- Upload de photos
- Générer des feuilles de route
- Confirmer les paiements de timbres
- Suivi du statut

#### 👥 **Expéditeurs** (`/shippers`)
Gestion des entités qui envoient :
- Ajouter des entreprises
- Gérer les informations
- Activer/désactiver les comptes
- Historique des expéditions

#### 🚚 **Transporteurs** (`/transporters`)
Gestion des livreurs :
- Enregistrer des chauffeurs/courriers
- Suivre les performances
- Voir les évaluations
- Gérer les revenus

#### 👨‍💼 **Utilisateurs & Points** (`/users`)
Gestion des points de retrait :
- Créer des comptes clients
- Créer des points de retrait
- Gérer les crédits
- Assigner les rôles

#### ⚙️ **Paramètres** (`/settings`)
Configuration globale :
- Informations de l'application
- Tarifs et commissions
- Mode maintenance
- Notifications

## 🎯 Flux de Travail Principal

### Créer un Nouveau Colis

1. Allez sur **Colis** → Cliquez sur **Ajouter un colis**
2. Remplissez le formulaire :
   - **Expéditeur** : Sélectionnez ou créez un expéditeur
   - **Destinataire** : Sélectionnez un client
   - **Description** : Décrivez le contenu
   - **Poids** : Entrez le poids en kg
   - **Origine/Destination** : Villes
   - **Photo** : Uploadez une image (optionnel)
   - **Timbre** : Montant en FCFA
3. Cliquez sur **Ajouter**

### Générer une Feuille de Route

1. Dans **Colis**, trouvez le colis
2. Cliquez sur l'icône **Télécharger** (download)
3. Dans la modale :
   - Vérifiez les informations
   - **Optionnel** : Confirmez le paiement du timbre
   - Cliquez sur **Imprimer** ou **Télécharger PDF**

### Confirmer un Paiement de Timbre

1. Dans **Colis**, repérez la colonne **Timbre**
2. Si le statut est **Confirmer** (bouton jaune) :
   - Cliquez sur le bouton
   - Le statut passera à **Payé** (badge vert)

## 🔑 Fonctionnalités Clés

### Recherche & Filtrage

**Partout dans le dashboard** :
- 🔍 Utilisez la barre de recherche pour filtrer
- 📊 Utilisez les dropdown pour trier

### Pagination

- Les tableaux affichent 20 éléments par défaut
- Naviguez avec les boutons de pagination
- Changez la limite dans les paramètres

### Modales

- ❌ Cliquez sur le X ou en dehors pour fermer
- ✅ Les validations vous empêchent d'envoyer des données invalides
- 💾 Cliquez sur le bouton d'action pour confirmer

### Notifications

- 🔔 Cliquez sur la cloche en haut à droite
- Les nouvelles notifications apparaissent en temps réel
- Actif/désactivez dans **Paramètres**

## 🎨 Personnalisation

### Thème de Couleurs

La couleur primaire est **Teal** (`#305669`). Pour changer :

1. Ouvrez `tailwind.config.js`
2. Modifiez la couleur dans la section `extend.colors`
3. Les couleurs se mettront à jour automatiquement

### Ajouter un Menu

1. Ouvrez `src/components/Sidebar.jsx`
2. Ajoutez un nouvel élément à `menuItems` :
```javascript
{ 
  icon: IconName, 
  label: 'Mon Lien', 
  path: '/mon-lien' 
}
```
3. Créez la page correspondante dans `src/pages/`

## 🔗 Intégration Backend

### Actuellement

Le dashboard utilise des **données simulées** (mock data).

### Pour Connecter le Backend

1. Créez un fichier `src/api.js` :

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const apiCall = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};
```

2. Utilisez-le dans vos pages :

```javascript
import { apiCall } from '../api';

const fetchShipments = async () => {
  try {
    const data = await apiCall('/shipments');
    setShipments(data.data.shipments);
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

3. Configurez la variable d'environnement dans `.env` :

```env
REACT_APP_API_URL=http://localhost:3000/api
```

### Voir : `API_INTEGRATION.md` pour tous les détails

## 🐛 Dépannage

### Le dashboard ne se charge pas

```bash
# Vérifiez si le serveur tourne
npm run dev

# Vérifiez la console pour les erreurs
# Ouvrez : http://localhost:5173
```

### Les données ne se mettent pas à jour

```javascript
// Assurez-vous d'utiliser useEffect
useEffect(() => {
  fetchData();
}, []); // Dépendances vides = une seule exécution
```

### Erreur de token

```javascript
// Votre token a expiré. Reconnectez-vous
localStorage.removeItem('authToken');
window.location.href = '/login';
```

## 📱 Responsive Design

Le dashboard fonctionne sur :
- 💻 Ordinateur de bureau (1920px+)
- 📱 Tablet (768px - 1024px)
- 📱 Mobile (< 768px)

Testez avec les **DevTools** du navigateur (F12).

## 🚀 Déploiement

### Sur Vercel (Recommandé)

```bash
# 1. Connectez le repo sur vercel.com
# 2. Configurez les variables d'environnement
# 3. Déployez automatiquement

# Ou en ligne de commande :
npm install -g vercel
vercel
```

### Sur Netlify

```bash
npm run build
# Uploadez le dossier 'dist' sur Netlify
```

### Sur un Serveur Personnel

```bash
npm run build
# Copiez le dossier 'dist' sur votre serveur
# Servez avec Nginx ou Apache
```

## 📚 Ressources Utiles

- **Docs React** : https://react.dev
- **Tailwind CSS** : https://tailwindcss.com
- **React Router** : https://reactrouter.com
- **Lucide Icons** : https://lucide.dev
- **Recharts** : https://recharts.org

## 💬 Questions ?

Consultez :
1. **README.md** - Vue d'ensemble complète
2. **API_INTEGRATION.md** - Intégration backend
3. **Code Comments** - Documentation du code
4. **Support** : support@yeskarangue.com

## ✅ Checklist de Démarrage

- [ ] Installer les dépendances (`npm install`)
- [ ] Démarrer le serveur (`npm run dev`)
- [ ] Ouvrir http://localhost:5173
- [ ] Se connecter avec les identifiants de test
- [ ] Naviguer dans les différentes pages
- [ ] Créer un colis de test
- [ ] Générer une feuille de route
- [ ] Lire la doc API pour intégration backend
- [ ] Configurer votre backend
- [ ] Deployer en production

---

**Bon travail !** 🎉 

N'hésitez pas à explorer le code et à le personnaliser selon vos besoins.

**Développé avec ❤️ pour Yes Karangue**

