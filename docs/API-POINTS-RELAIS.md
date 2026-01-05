# 📚 API Points Relais - Documentation Complète

## 🎯 Vue d'Ensemble

Tous les endpoints pour la gestion des points relais (CRUD complet) sont maintenant implémentés avec une interface utilisateur moderne et des notifications toast.

---

## 📋 Liste des Endpoints

### 1. 📝 Créer un Point Relais

**Endpoint:** `POST /api/v1/admin/relay-points`

**Body:**
```json
{
  "name": "Point Relais Dakar Centre",
  "address": "Avenue Bourguiba, Dakar",
  "type": "DEPOT_RETRAIT",
  "main_phone": "+221771234567",
  "manager_user_id": "usr_55",
  "is_active": true
}
```

**Réponses:**
- ✅ **201** : Point créé
- ❌ **422** : Erreur de validation
- ❌ **401** : Non authentifié

**Service:**
```javascript
import { createRelayPoint } from '../services/relayPointService';

const newPoint = await createRelayPoint({
  name: "Point Relais Nord",
  // ...autres champs
});
```

---

### 2. 📖 Lister les Points Relais

**Endpoint:** `GET /api/v1/admin/relay-points`

**Query Parameters:**
- `q` : Recherche par nom/adresse
- `type` : Filtrer par type (DEPOT, RETRAIT, DEPOT_RETRAIT)
- `status` : Filtrer par statut (actif/inactif)
- `limit` : Nombre de résultats (défaut: 20)
- `offset` : Pagination (défaut: 0)

**Exemple:**
```
GET /api/v1/admin/relay-points?q=dakar&type=DEPOT&limit=10
```

**Réponses:**
- ✅ **200** : Liste des points
- ❌ **401** : Non authentifié

**Service:**
```javascript
import { fetchRelayPoints } from '../services/relayPointService';

const points = await fetchRelayPoints({
  q: 'dakar',
  type: 'DEPOT',
  limit: 10
});
```

---

### 3. 🔍 Détails d'un Point Relais

**Endpoint:** `GET /api/v1/admin/relay-points/{relay_point_id}`

**Réponses:**
- ✅ **200** : Détails du point
- ❌ **404** : Point non trouvé
- ❌ **401** : Non authentifié

**Service:**
```javascript
import { fetchRelayPointById } from '../services/relayPointService';

const point = await fetchRelayPointById(123);
```

---

### 4. ✏️ Mettre à Jour un Point Relais

**Endpoint:** `PATCH /api/v1/admin/relay-points/{relay_point_id}`

**Body:**
```json
{
  "name": "Point Relais Dakar Nord Modifié",
  "address": "Nouvelle Adresse",
  "type": "DEPOT",
  "main_phone": "+221771234567",
  "manager_user_id": "usr_55",
  "is_active": false
}
```

**Réponses:**
- ✅ **200** : Point mis à jour
- ❌ **404** : Point non trouvé
- ❌ **409** : Ressource en cours d'utilisation
- ❌ **422** : Erreur de validation
- ❌ **401** : Non authentifié

**Service:**
```javascript
import { updateRelayPoint } from '../services/relayPointService';

const updated = await updateRelayPoint(123, {
  name: "Nouveau Nom",
  // ...autres champs
});
```

**Documentation:** [Guide Complet](./relay-points-update-endpoint.md)

---

### 5. 🗑️ Supprimer un Point Relais

**Endpoint:** `DELETE /api/v1/admin/relay-points/{relay_point_id}`

**Réponses:**
- ✅ **204** : Point supprimé (soft delete)
- ❌ **404** : Point non trouvé
- ❌ **409** : Point en cours d'utilisation
- ❌ **401** : Non authentifié

**Service:**
```javascript
import { deleteRelayPoint } from '../services/relayPointService';

await deleteRelayPoint(123);
```

**Documentation:** [Guide Complet](./relay-points-delete-endpoint.md)

---

### 6. 📋 Types de Points Relais Disponibles

**Endpoint:** `GET /api/v1/admin/relay-point-types`

**Réponses:**
- ✅ **200** : Liste des types disponibles
- ❌ **401** : Non authentifié

**Réponse exemple:**
```json
[
  {
    "value": "DEPOT",
    "label": "Dépôt"
  },
  {
    "value": "RETRAIT",
    "label": "Retrait"
  },
  {
    "value": "DEPOT_RETRAIT",
    "label": "Dépôt et Retrait"
  }
]
```

**Service:**
```javascript
import { fetchRelayPointTypes } from '../services/relayPointService';

const types = await fetchRelayPointTypes();
// Utilisation dans un select
```

**Documentation:** [Guide Complet](./relay-point-types-endpoint.md)

---

## 📊 Modèle de Données

### Structure d'un Point Relais

```typescript
interface RelayPoint {
  id: number;
  name: string;              // Nom du point
  address: string;           // Adresse complète
  type: 'DEPOT' | 'RETRAIT' | 'DEPOT_RETRAIT';
  main_phone: string;        // Téléphone principal
  manager_user_id: string;   // ID du gestionnaire (format: usr_XX)
  is_active: boolean;        // Statut actif/inactif
  created_at?: string;       // Date de création
  updated_at?: string;       // Date de dernière modification
  
  // Champs calculés/optionnels
  manager?: string;          // Nom du gestionnaire
  managerPhone?: string;     // Téléphone du gestionnaire
  agents?: number;           // Nombre d'agents
  shipments_count?: number;  // Nombre de colis traités
}
```

### Types de Points

| Valeur | Label | Description |
|--------|-------|-------------|
| `DEPOT` | Dépôt | Point uniquement pour déposer des colis |
| `RETRAIT` | Retrait | Point uniquement pour retirer des colis |
| `DEPOT_RETRAIT` | Dépôt et Retrait | Point pour déposer ET retirer des colis |

---

## 🎨 Interface Utilisateur

### Page Points Relais (`/src/pages/points/PointsPage.jsx`)

**Fonctionnalités:**
- ✅ Liste des points avec tableau
- ✅ Recherche par nom/adresse
- ✅ Filtrage par type et statut
- ✅ Statistiques (total, actifs, agents, colis)
- ✅ Bouton "Ajouter un point"
- ✅ Boutons d'action : Voir, Modifier, Supprimer
- ✅ Notifications toast
- ✅ Loaders sur les actions

### Formulaire (`/src/components/forms/PointForm.jsx`)

**Mode Création:**
- Titre : "Ajouter un point de retrait"
- Bouton : "Créer le point"
- Champs vides (valeurs par défaut)

**Mode Modification:**
- Titre : "Modifier le point"
- Bouton : "Modifier"
- Champs pré-remplis

**Champs:**
1. Nom du point *
2. Adresse *
3. Type * (select)
4. Téléphone * (main_phone)
5. ID du gestionnaire * (format: usr_XX)
6. Point relais actif (checkbox)

---

## 🔔 Système de Notifications

### Composant Toast (`/src/components/Toast.jsx`)

**Types de notifications:**

| Type | Couleur | Icône | Utilisation |
|------|---------|-------|-------------|
| `success` | Vert | ✓ | Opération réussie |
| `error` | Rouge | ✗ | Erreur critique |
| `warning` | Jaune | ⚠ | Avertissement |

**Caractéristiques:**
- Animation slide-in depuis la droite
- Fermeture automatique après 4 secondes
- Bouton de fermeture manuel
- Position : en haut à droite

**Usage:**
```javascript
setToast({
  message: 'Opération réussie !',
  type: 'success'
});
```

---

## 🛠️ Service Layer

### Fichier: `/src/services/relayPointService.js`

**Fonctions disponibles:**

```javascript
// Créer
export const createRelayPoint = async (data) => { ... }

// Lire (liste)
export const fetchRelayPoints = async (params) => { ... }

// Lire (détails)
export const fetchRelayPointById = async (id) => { ... }

// Mettre à jour
export const updateRelayPoint = async (id, data) => { ... }

// Supprimer
export const deleteRelayPoint = async (id) => { ... }
```

**Caractéristiques communes:**
- ✅ Authentification automatique via `authorizedFetch`
- ✅ Rafraîchissement du token si expiré
- ✅ Gestion des erreurs HTTP
- ✅ Messages d'erreur personnalisés
- ✅ Logs automatiques

---

## ⚠️ Gestion des Erreurs

### Codes HTTP et Messages

| Code | Signification | Message Utilisateur | Toast |
|------|---------------|---------------------|-------|
| **200** | Succès (GET, PATCH) | - | - |
| **201** | Créé (POST) | "{nom} a été créé avec succès" | ✅ Success |
| **204** | Supprimé (DELETE) | "{nom} a été supprimé avec succès" | ✅ Success |
| **401** | Non authentifié | Auto-refresh du token | - |
| **404** | Non trouvé | "Point relais introuvable" | ❌ Error |
| **409** | Conflit | "Point en cours d'utilisation" | ⚠️ Warning |
| **422** | Validation | Message de validation spécifique | ⚠️ Warning |

### Erreur 422 - Exemple

**Réponse API:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Données invalides",
    "details": {
      "email": ["Le champ email est requis."],
      "manager_user_id": ["Format invalide"]
    }
  }
}
```

**Traitement:**
```javascript
if (response.status === 422) {
  const errorData = await response.json();
  const validationErrors = errorData.details || {};
  const firstError = Object.values(validationErrors)[0];
  throw new Error(firstError || errorData.message || 'Erreur de validation');
}
```

---

## ✅ Validation des Données

### Côté Client (Formulaire)

```javascript
const validateForm = () => {
  const errors = {};
  
  if (!formData.name) 
    errors.name = 'Le nom est requis';
  
  if (!formData.address) 
    errors.address = 'L\'adresse est requise';
  
  if (!formData.type) 
    errors.type = 'Le type est requis';
  
  if (!formData.main_phone) 
    errors.main_phone = 'Le téléphone est requis';
  
  if (!formData.manager_user_id) 
    errors.manager_user_id = 'L\'ID du gestionnaire est requis';
  
  if (formData.manager_user_id && !formData.manager_user_id.match(/^usr_[0-9]+$/)) 
    errors.manager_user_id = 'Format invalide (ex: usr_55)';
  
  return errors;
};
```

### Format manager_user_id

**Regex:** `/^usr_[0-9]+$/`

**Valides:**
- ✅ `usr_1`
- ✅ `usr_55`
- ✅ `usr_123456`

**Invalides:**
- ❌ `55`
- ❌ `user_55`
- ❌ `usr_`
- ❌ `usr_abc`

---

## 🚀 Workflows Utilisateur

### Créer un Point

```
1. Clic sur "Ajouter un point"
   ↓
2. Remplir le formulaire
   ↓
3. Clic sur "Créer le point"
   ↓
4. Validation côté client
   ↓
5. Requête POST à l'API
   ↓
6. Toast de succès
   ↓
7. Rechargement de la liste
```

### Modifier un Point

```
1. Clic sur l'icône crayon ✏️
   ↓
2. Formulaire pré-rempli
   ↓
3. Modification des champs
   ↓
4. Clic sur "Modifier"
   ↓
5. Validation côté client
   ↓
6. Requête PATCH à l'API
   ↓
7. Toast de succès
   ↓
8. Rechargement de la liste
```

### Supprimer un Point

```
1. Clic sur l'icône poubelle 🗑️
   ↓
2. Confirmation
   ↓
3. Loader sur le bouton
   ↓
4. Requête DELETE à l'API
   ↓
5. Toast de succès/erreur
   ↓
6. Rechargement de la liste
```

---

## 📁 Structure des Fichiers

```
yes-karangue-admin/
├── src/
│   ├── components/
│   │   ├── Toast.jsx                    ✨ Nouveau
│   │   ├── forms/
│   │   │   └── PointForm.jsx            ✏️ Modifié
│   │   └── modals/
│   │       └── PointDetails.jsx
│   ├── pages/
│   │   └── points/
│   │       └── PointsPage.jsx           ✏️ Modifié
│   ├── services/
│   │   └── relayPointService.js         ✏️ Modifié
│   ├── examples/
│   │   └── ToastExample.jsx             ✨ Nouveau
│   └── index.css                        ✏️ Modifié
├── docs/
│   ├── relay-points-delete-endpoint.md  ✨ Nouveau
│   ├── relay-points-update-endpoint.md  ✨ Nouveau
│   ├── GUIDE-SUPPRESSION-POINT-RELAIS.md ✨ Nouveau
│   ├── GUIDE-UPDATE-POINT-RELAIS.md     ✨ Nouveau
│   └── API-POINTS-RELAIS.md             ✨ Ce fichier
```

---

## 🧪 Tests

### Test Manuel dans l'Interface

1. **Créer** : Ajouter un nouveau point via le formulaire
2. **Lire** : Vérifier l'affichage dans la liste
3. **Modifier** : Modifier un point existant
4. **Supprimer** : Supprimer un point (vérifier la confirmation)
5. **Recherche** : Tester la barre de recherche
6. **Filtres** : Tester les filtres par type

### Test avec cURL

Voir les fichiers de documentation individuels pour les exemples cURL de chaque endpoint.

---

## 💡 Bonnes Pratiques

### 1. Toujours gérer les erreurs
```javascript
try {
  await updateRelayPoint(id, data);
} catch (error) {
  console.error('Erreur:', error);
  setToast({ message: error.message, type: 'error' });
}
```

### 2. Recharger les données après modification
```javascript
await createRelayPoint(data);
await loadRelayPoints(); // Recharger la liste
```

### 3. Réinitialiser l'état
```javascript
setShowForm(false);
setEditingPoint(null);
```

### 4. Messages utilisateur clairs
```javascript
// ✅ Bon
setToast({ 
  message: 'Point Relais Dakar Centre a été supprimé avec succès', 
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

- 📄 [Endpoint DELETE - Documentation Détaillée](./relay-points-delete-endpoint.md)
- 📄 [Endpoint PATCH - Documentation Détaillée](./relay-points-update-endpoint.md)
- 📄 [Guide Rapide - Suppression](./GUIDE-SUPPRESSION-POINT-RELAIS.md)
- 📄 [Guide Rapide - Mise à Jour](./GUIDE-UPDATE-POINT-RELAIS.md)

---

## 🎉 Conclusion

Vous disposez maintenant d'un **CRUD complet** pour la gestion des points relais avec :

- ✅ **5 endpoints fonctionnels** (Create, Read, Read One, Update, Delete)
- ✅ **Interface utilisateur moderne** avec formulaires et tableaux
- ✅ **Notifications toast élégantes** pour tous les retours utilisateur
- ✅ **Gestion complète des erreurs** avec messages personnalisés
- ✅ **Validation côté client** pour une meilleure UX
- ✅ **Documentation complète** pour chaque endpoint
- ✅ **Code réutilisable** (Toast, patterns CRUD)

---

**Créé le:** 2026-01-05  
**Version:** 1.0  
**Auteur:** Antigravity AI
