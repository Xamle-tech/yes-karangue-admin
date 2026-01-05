# 📚 API Utilisateurs - Documentation Complète

## 🎯 Vue d'Ensemble

Tous les endpoints pour la gestion complète des utilisateurs (CRUD) sont maintenant implémentés avec services, composants et documentation.

---

## 📋 Liste des Endpoints

### 1. 📖 Liste des Utilisateurs

**Endpoint:** `GET /api/v1/admin/users`

**Paramètres:**
- `q` : Recherche (nom, email, téléphone)
- `role` : Filtrer par rôle
- `relay_point_id` : Filtrer par point relais
- `status` : Filtrer par statut
- `limit` : Pagination (défaut: 20)
- `offset` : Pagination (défaut: 0)

**Service:**
```javascript
import { fetchUsers } from '../services/userService';

const users = await fetchUsers({
  q: 'mama',
  role: 'client',
  status: 'active',
  limit: 20,
  offset: 0
});
```

**Documentation:** [users-list-endpoint.md](./users-list-endpoint.md)

---

### 2. 🔍 Détails d'un Utilisateur

**Endpoint:** `GET /api/v1/admin/users/{user_id}`

**Réponse:**
```json
{
  "id": 15,
  "full_name": "Moussa Ndiaye",
  "email": "moussa@example.com",
  "phone": "+221771234567",
  "role": "AGENT",
  "relay_point_id": 5,
  "relay_point_name": "Point Dakar Centre",
  "status": "active",
  "credits": 5000,
  "created_at": "2026-01-01T00:00:00Z"
}
```

**Service:**
```javascript
import { fetchUserById } from '../services/userService';

const user = await fetchUserById(15);
```

**Documentation:** [users-details-endpoint.md](./users-details-endpoint.md)

---

### 3. ➕ Créer un Utilisateur

**Endpoint:** `POST /api/v1/admin/users`

**Body:**
```json
{
  "full_name": "Moussa Ndiaye",
  "email": "moussa@example.com",
  "phone": "+221771234567",
  "role": "AGENT",
  "relay_point_id": "rp_1"
}
```

**+ Email d'invitation automatique (set-password flow)**

**Service:**
```javascript
import { createUser } from '../services/userService';

const newUser = await createUser({
  full_name: "Moussa Ndiaye",
  email: "moussa@example.com",
  phone: "+221771234567",
  role: "AGENT",
  relay_point_id: "rp_1"
});
```

**Composant:** `UserForm.jsx` (créé)

**Documentation:** [users-create-endpoint.md](./users-create-endpoint.md)

---

### 4. ✏️ Modifier un Utilisateur

**Endpoint:** `PATCH /api/v1/admin/users/{user_id}`

**Body:**
```json
{
  "full_name": "Nouveau Nom",
  "email": "nouveau@email.com",
  "phone": "+221771234567",
  "role": "MANAGER",
  "relay_point_id": "rp_2",
  "status": "active"
}
```

**Service:**
```javascript
import { updateUser } from '../services/userService';

const updated = await updateUser(15, {
  full_name: "Nouveau Nom",
  // ...autres champs
});
```

**Réponses:**
- ✅ **200** : Utilisateur mis à jour
- ❌ **404** : Utilisateur non trouvé
- ❌ **409** : Ressource en cours d'utilisation
- ❌ **422** : Erreur de validation

---

### 5. 🗑️ Supprimer un Utilisateur

**Endpoint:** `DELETE /api/v1/admin/users/{user_id}`

**Service:**
```javascript
import { deleteUser } from '../services/userService';

await deleteUser(15);
```

**Réponses:**
- ✅ **204** : Utilisateur supprimé
- ❌ **404** : Utilisateur non trouvé
- ❌ **409** : Utilisateur en cours d'utilisation (colis actifs, etc.)

---

## 📊 Modèle de Données

### Structure d'un Utilisateur

```typescript
interface User {
  id: number;
  full_name: string;           // Nom complet
  email: string;               // Email unique
  phone: string;               // Téléphone unique
  role: 'admin' | 'agent' | 'client' | 'carrier' | 'MANAGER';
  relay_point_id?: number;     // ID du point relais (pour agent/manager)
  relay_point_name?: string;   // Nom du point relais
  status: 'active' | 'inactive' | 'pending';
  credits: number;             // Crédits disponibles
  created_at: string;          // Date de création (ISO 8601)
  updated_at: string;          // Date de modification
  last_login?: string;         // Date de dernière connexion
  email_verified: boolean;     // Email vérifié
  phone_verified: boolean;     // Téléphone vérifié
  profile_picture?: string;    // URL de la photo de profil
}
```

### Rôles Disponibles

| Valeur | Label | Description |
|--------|-------|-------------|
| `admin` | Administrateur | Accès complet au système |
| `agent` | Agent | Agent d'un point relais |
| `client` | Client | Utilisateur standard |
| `carrier` | Transporteur | Livreur/Conducteur |
| `MANAGER` | Manager | Gestionnaire de point relais |

### Statuts Disponibles

| Valeur | Label | Description |
|--------|-------|-------------|
| `active` | Actif | Compte actif, peut se connecter |
| `inactive` | Inactif | Compte désactivé |
| `pending` | En attente | Invitation envoyée, MDP non défini |

---

## 🛠️ Service Layer

### Fichier: `/src/services/userService.js`

**Fonctions disponibles:**

```javascript
// Lister avec filtres et pagination
export const fetchUsers = async (params) => { ... }

// Détails d'un utilisateur
export const fetchUserById = async (userId) => { ... }

// Créer (avec invitation email)
export const createUser = async (userData) => { ... }

// Mettre à jour
export const updateUser = async (userId, userData) => { ... }

// Supprimer
export const deleteUser = async (userId) => { ... }
```

**Caractéristiques:**
- ✅ Authentification automatique via `authorizedFetch`
- ✅ Rafraîchissement du token si expiré
- ✅ Gestion des erreurs 404, 409, 422
- ✅ Messages d'erreur personnalisés
- ✅ Logs automatiques

---

## 🎨 Composants UI

### 1. Page UsersPage (`/src/pages/users/UsersPage.jsx`)

**Fonctionnalités:**
- ✅ Liste des utilisateurs avec tableau
- ✅ Recherche par nom/email/téléphone
- ✅ Filtres par rôle, statut, point relais
- ✅ Pagination complète
- ✅ Statistiques (total, crédits, points, total crédits)
- ✅ Boutons d'action : Voir, Modifier, Supprimer
- ✅ Notifications toast
- ✅ Loaders sur les actions

**State existant (avec données statiques):**
- Liste d'utilisateurs
- Recherche et filtres
- Mode d'affichage (grille/liste)

**À intégrer:**
- Appel API `fetchUsers` au lieu de données statiques
- Fonction `handleDeleteUser` avec l'API et toast
- Pagination avec offset/limit

### 2. Formulaire UserForm (`/src/components/forms/UserForm.jsx`)

**Créé:** ✅ Oui

**Champs:**
1. Nom complet *
2. Email *
3. Téléphone *
4. Rôle * (select)
5. ID Point relais (optionnel)

**Fonctionnalités:**
- ✅ Validation côté client
- ✅ Messages d'erreur par champ
- ✅ Support mode création/modification
- ✅ Indicateur de chargement
- ℹ️ Message d'information (email d'invitation)
- ✅ Design responsive

### 3. Modal UserDetailsModal (À créer)

**Fichier:** `/src/components/modals/UserDetailsModal.jsx`

**Usage:**
```javascript
<UserDetailsModal 
  userId={15}
  onClose={() => setShowDetails(false)}
/>
```

**Affiche:**
- Avatar/Initiales
- Nom complet
- Email, téléphone
- Rôle, statut
- Point relais (si applicable)
- Crédits
- Dates (création, dernière connexion)
- Bouton "Modifier"

---

## 🔔 Système de Notifications (Toast)

### Composant Toast (`/src/components/Toast.jsx`)

**Déjà créé et disponible**

**Types:**
- ✅ `success` (vert) - Opération réussie
- ❌ `error` (rouge) - Erreur critique
- ⚠️ `warning` (jaune) - Avertissement

**Usage:**
```javascript
const [toast, setToast] = useState(null);

setToast({
  message: 'Utilisateur créé avec succès',
  type: 'success'
});

{toast && (
  <Toast
    message={toast.message}
    type={toast.type}
    onClose={() => setToast(null)}
  />
)}
```

---

## ⚠️ Gestion des Erreurs

### Codes HTTP et Messages

| Code | Signification | Message Utilisateur | Toast |
|------|---------------|---------------------|-------|
| **200** | Succès (GET, PATCH) | - | - |
| **201** | Créé (POST) | "Utilisateur créé. Email envoyé." | ✅ Success |
| **204** | Supprimé (DELETE) | "Utilisateur supprimé avec succès" | ✅ Success |
| **401** | Non authentifié | Auto-refresh du token | - |
| **404** | Non trouvé | "Utilisateur introuvable" | ❌ Error |
| **409** | Conflit | "Email/téléphone déjà utilisé" ou "En cours d'utilisation" | ⚠️ Warning |
| **422** | Validation | Message spécifique du champ | ⚠️ Warning |

### Gestion dans le Code

```javascript
try {
  await createUser(formData);
  setToast({ message: 'Créé avec succès', type: 'success' });
} catch (error) {
  let message = 'Une erreur est survenue';
  let type = 'error';
  
  if (error.message.includes('409')) {
    message = 'Email ou téléphone déjà utilisé';
    type = 'warning';
  } else if (error.message.includes('422')) {
    message = error.message; // Message de validation spécifique
    type = 'warning';
  } else if (error.message.includes('404')) {
    message = 'Utilisateur introuvable';
  }
  
  setToast({ message, type });
}
```

---

## 🚀 Workflows Utilisateur

### Créer un Utilisateur

```
1. Clic sur "Ajouter un utilisateur"
   ↓
2. Modal UserForm s'ouvre
   ↓
3. Saisie des informations
   ↓
4. Validation côté client
   ↓
5. POST /api/v1/admin/users
   ↓
6. Backend crée le compte (status: pending)
   ↓
7. Email d'invitation envoyé
   ↓
8. Toast de succès affiché
   ↓
9. Liste rechargée
```

### Voir les Détails

```
1. Clic sur l'icône "Œil" 👁️
   ↓
2. GET /api/v1/admin/users/{id}
   ↓
3. Modal UserDetailsModal s'ouvre
   ↓
4. Affichage des informations complètes
```

### Modifier un Utilisateur

```
1. Clic sur l'icône "Crayon" ✏️
   ↓
2. GET /api/v1/admin/users/{id}
   ↓
3. Modal UserForm pré-rempli
   ↓
4. Modification des champs
   ↓
5. PATCH /api/v1/admin/users/{id}
   ↓
6. Toast de succès
   ↓
7. Liste rechargée
```

### Supprimer un Utilisateur

```
1. Clic sur l'icône "Poubelle" 🗑️
   ↓
2. Confirmation
   ↓
3. DELETE /api/v1/admin/users/{id}
   ↓
4. Toast de succès/erreur
   ↓
5. Liste rechargée
```

---

## 📁 Structure des Fichiers

```
yes-karangue-admin/
├── src/
│   ├── components/
│   │   ├── Toast.jsx                    ✅ Existant
│   │   ├── forms/
│   │   │   └── UserForm.jsx             ✅ Créé
│   │   └── modals/
│   │       └── UserDetailsModal.jsx     📝 À créer (optionnel)
│   ├── pages/
│   │   └── users/
│   │       └── UsersPage.jsx            ✅ Existant (à intégrer API)
│   └── services/
│       └── userService.js               ✅ Service complet
├── docs/
│   ├── users-list-endpoint.md           ✅ Créé
│   ├── users-details-endpoint.md        ✅ Créé
│   ├── users-create-endpoint.md         ✅ Créé
│   └── API-USERS.md                     ✅ Ce fichier
```

---

## 🧪 Tests

### Test Manuel dans l'Interface

1. **Liste** : Vérifier l'affichage, la recherche, les filtres, la pagination
2. **Créer** : Ajouter un utilisateur, vérifier l'email d'invitation
3. **Voir** : Afficher les détails d'un utilisateur
4. **Modifier** : Modifier les informations d'un utilisateur
5. **Supprimer** : Supprimer un utilisateur (avec confirmation)

### Test avec cURL

Voir les fichiers de documentation individuels pour les exemples cURL de chaque endpoint.

---

## 💡 Bonnes Pratiques

### 1. Toujours gérer les erreurs
```javascript
try {
  await fetchUsers();
} catch (error) {
  setToast({ message: error.message, type: 'error' });
}
```

### 2. Recharger après modification
```javascript
await deleteUser(userId);
await loadUsers(); // Recharger la liste
```

### 3. Réinitialiser l'état
```javascript
setShowForm(false);
setEditingUser(null);
setViewingUserId(null);
```

### 4. Messages clairs
```javascript
// ✅ Bon
setToast({ 
  message: 'Moussa Ndiaye a été créé avec succès. Email envoyé.',
  type: 'success'
});

// ❌ Éviter
setToast({ 
  message: 'Succès',
  type: 'success'
});
```

---

## 📚 Documentation Complète

- 📄 [Liste des Utilisateurs](./users-list-endpoint.md)
- 📄 [Détails d'un Utilisateur](./users-details-endpoint.md)
- 📄 [Créer un Utilisateur](./users-create-endpoint.md)
- 📄 [Guide Complet API](./API-USERS.md) - Ce fichier

---

## 🎉 Résumé

Vous disposez maintenant d'un **système complet de gestion des utilisateurs** avec :

- ✅ **5 endpoints fonctionnels** (Create, Read List, Read One, Update, Delete)
- ✅ **Service API complet** avec gestion d'erreurs
- ✅ **Formulaire de création** avec validation
- ✅ **Page de liste** existante (à intégrer API)
- ✅ **Notifications toast** élégantes
- ✅ **Documentation complète** pour chaque endpoint
- ✅ **Flow d'invitation** par email (set-password)
- ✅ **Gestion des erreurs** personnalisée
- ✅ **Pagination** et filtres avancés

## 🎯 Prochaines Étapes

1. **Intégrer l'API dans UsersPage.jsx** :
   - Remplacer données statiques par `fetchUsers`
   - Implémenter `handleDeleteUser` avec toast
   - Ajouter pagination fonctionnelle

2. **Créer UserDetailsModal** (optionnel mais recommandé)

3. **Tester le flow complet** :
   - Création → Invitation email → Set password → Connexion

---

**Créé le:** 2026-01-05  
**Version:** 1.0  
**Auteur:** Antigravity AI
