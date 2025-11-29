# Yes Karangue - Admin Dashboard

Tableau de bord administrateur moderne et complet pour la gestion de la plateforme **Yes Karangue** - une solution de livraison et transport de bagages.

## 🎯 Fonctionnalités

### 🔐 Authentification
- **Connexion sécurisée** avec email et mot de passe
- Affichage/masquage du mot de passe
- Mémorisation des utilisateurs
- Récupération de mot de passe oubli

### 📦 Gestion des Colis
- **Enregistrement rapide** des colis avec :
  - Description simple du contenu
  - Poids (en kg)
  - Photos/preuves
  - Points de départ et destination
  - Gestion des frais de timbre
- **Suivi complet** des colis
- **Génération et impression** de feuilles de route
- **Confirmation de paiement** des timbres

### 👥 Gestion des Expéditeurs
- Enregistrement des expéditeurs
- Gestion des informations d'entreprise
- Numéro d'enregistrement
- Statut actif/inactif
- Historique des expéditions

### 🚚 Gestion des Transporteurs
- Enregistrement des transporteurs
- Suivi des performances :
  - Nombre de livraisons
  - Notation/évaluation
  - Revenus totaux
- Gestion des véhicules
- Statistiques de performance

### 👨‍💼 Gestion des Utilisateurs & Points de Retrait
- Gestion des comptes utilisateurs
- Création de points de retrait YES Karangue
- Attribution de rôles (Client, Gestionnaire Point, Administrateur)
- Gestion des crédits clients
- Statut d'activation des comptes

### 📊 Tableau de Bord
- **Statistiques en temps réel** :
  - Nombre de colis en transit
  - Utilisateurs actifs
  - Revenus mensuels
  - Problèmes signalés
- **Graphiques interactifs** :
  - Activité mensuelle (ligne)
  - Distribution des statuts (pie)
  - Performances clés
- **Colis récents** avec statuts
- **Meilleurs transporteurs**
- **Santé du système**

### ⚙️ Paramètres
- Configuration globale (nom, fuseau horaire, langue)
- Paramètres de livraison (poids max, tarifs, commissions)
- Paramètres système (mode maintenance, limites API)
- Gestion des notifications (email, SMS)
- Zone dangereuse pour opérations critiques

## 🛠️ Technologies

- **Frontend** : React 18 + React Router 6
- **Styling** : Tailwind CSS
- **Graphiques** : Recharts
- **Icônes** : Lucide React
- **Build** : Vite
- **État** : React Hooks (useState)

## 📦 Installation

### Prérequis
- Node.js 16+ 
- npm ou yarn

### Étapes

```bash
# 1. Cloner ou naviguer vers le projet
cd /Users/mouhamadougueye/Documents/GitHub/yes_karangue_admin

# 2. Installer les dépendances
npm install

# 3. Démarrer le serveur de développement
npm run dev

# 4. Ouvrir dans le navigateur
# L'app s'ouvrira automatiquement sur http://localhost:5173
```

## 🚀 Déploiement

```bash
# Build de production
npm run build

# Prévisualiser la build
npm run preview
```

La build optimisée se trouvera dans le dossier `dist/`.

## 📁 Structure du Projet

```
yes_karangue_admin/
├── src/
│   ├── components/
│   │   ├── Layout.jsx              # Layout principal
│   │   ├── Sidebar.jsx             # Barre latérale
│   │   ├── Header.jsx              # En-tête
│   │   ├── forms/                  # Formulaires
│   │   │   ├── ShipperForm.jsx
│   │   │   ├── ShipmentForm.jsx
│   │   │   ├── TransporterForm.jsx
│   │   │   └── UserForm.jsx
│   │   └── modals/                 # Modales
│   │       └── RouteSheetModal.jsx
│   ├── pages/
│   │   ├── auth/
│   │   │   └── LoginPage.jsx       # Page de login
│   │   ├── dashboard/
│   │   │   └── DashboardPage.jsx
│   │   ├── shippers/
│   │   │   └── ShippersPage.jsx
│   │   ├── shipments/
│   │   │   └── ShipmentsPage.jsx
│   │   ├── transporters/
│   │   │   └── TransportersPage.jsx
│   │   ├── users/
│   │   │   └── UsersPage.jsx
│   │   └── settings/
│   │       └── SettingsPage.jsx
│   ├── App.jsx                     # Routeur principal
│   ├── main.jsx                    # Point d'entrée
│   └── index.css                   # Styles globaux
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🔐 Authentification

### Page de Login
- **Identifiants de test** :
  - Email : `admin@yeskarangue.com`
  - Mot de passe : `123456` (minimum)

### Stockage du Token
Les tokens sont actuellement stockés dans `localStorage`. Pour la production, utilisez :
- **HttpOnly Cookies** pour une meilleure sécurité
- **Refresh Tokens** pour gérer l'expiration
- **JWT** pour les tokens stateless

## 📱 Responsive Design

Le dashboard est complètement responsive :
- **Ordinateur de bureau** : Sidebar fixe, contenu principal
- **Tablet** : Sidebar repliée ou hidden
- **Mobile** : Sidebar en overlay, menu hamburger

## 🎨 Couleurs & Thème

### Couleur Primaire : Teal
- `#305669` (Primary)
- `#1F3A4A` (Dark)
- `#4A7A99` (Light)

### Couleurs Secondaires
- Succès : `#4CAF50`
- Alerte : `#FFC107`
- Erreur : `#F44336`
- Info : `#305669`

## 🔄 Intégration Backend

### Points d'intégration

1. **Login** (`src/pages/auth/LoginPage.jsx`)
   - POST `/api/auth/login` - Authentification
   - Retour : `{ token, role, user }`

2. **Shippers** (`src/pages/shippers/ShippersPage.jsx`)
   - GET `/api/shippers` - Lister
   - POST `/api/shippers` - Créer
   - PUT `/api/shippers/:id` - Modifier
   - DELETE `/api/shippers/:id` - Supprimer

3. **Shipments** (`src/pages/shipments/ShipmentsPage.jsx`)
   - GET `/api/shipments` - Lister
   - POST `/api/shipments` - Créer avec upload photo
   - PUT `/api/shipments/:id` - Modifier
   - DELETE `/api/shipments/:id` - Supprimer
   - POST `/api/shipments/:id/route-sheet` - Générer feuille de route
   - POST `/api/shipments/:id/confirm-stamp` - Confirmer timbre

4. **Transporters** (`src/pages/transporters/TransportersPage.jsx`)
   - GET `/api/transporters` - Lister
   - POST `/api/transporters` - Créer
   - PUT `/api/transporters/:id` - Modifier
   - DELETE `/api/transporters/:id` - Supprimer

5. **Users & Points** (`src/pages/users/UsersPage.jsx`)
   - GET `/api/users` - Lister
   - POST `/api/users` - Créer
   - PUT `/api/users/:id` - Modifier
   - DELETE `/api/users/:id` - Supprimer

6. **Dashboard** (`src/pages/dashboard/DashboardPage.jsx`)
   - GET `/api/stats/overview` - Statistiques globales
   - GET `/api/stats/monthly` - Données mensuelles
   - GET `/api/shipments/recent` - Colis récents

## 🐛 Bugs Connus & À Faire

- [ ] Authentification backend complète
- [ ] Upload d'images via API
- [ ] Génération PDF pour les feuilles de route
- [ ] WebSockets pour les notifications en temps réel
- [ ] Export des données (CSV, Excel)
- [ ] Multi-langue complet
- [ ] Mode sombre
- [ ] Tests unitaires
- [ ] Tests E2E

## 📚 Guides Additionnels

### Ajouter une Nouvelle Page

1. Créer le fichier dans `src/pages/<section>/NewPage.jsx`
2. Ajouter la route dans `src/App.jsx`
3. Ajouter le menu dans `src/components/Sidebar.jsx`

### Ajouter un Formulaire

1. Créer le fichier dans `src/components/forms/NewForm.jsx`
2. Utiliser la structure existante pour la validation
3. Importer et utiliser dans la page concernée

### Appeler l'API

```javascript
const handleSubmit = async (data) => {
  try {
    const response = await fetch('/api/endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    // Gérer le résultat
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

## 📞 Support

Pour les questions ou problèmes :
- Email : support@yeskarangue.com
- Docs : https://docs.yeskarangue.com

## 📄 Licence

Copyright © 2025 Yes Karangue. Tous droits réservés.

---

**Développé avec ❤️ pour Yes Karangue**
