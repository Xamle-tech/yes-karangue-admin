# Documentation - Endpoint de Mise à Jour de Point Relais

## 📋 Aperçu

L'endpoint pour mettre à jour un point relais a été intégré avec succès dans l'application admin `yes-karangue-admin`.

## 🔌 Endpoint API

**Méthode:** `PATCH`  
**URL:** `/api/v1/admin/relay-points/{relay_point_id}`  
**Authentification:** Requise (JWT Bearer Token)

### Paramètres

#### Path Parameters

| Paramètre | Type | Description | Requis |
|-----------|------|-------------|--------|
| `relay_point_id` | integer | ID du point relais à mettre à jour | ✅ Oui |

#### Request Body

| Champ | Type | Description | Requis | Exemple |
|-------|------|-------------|--------|---------|
| `name` | string | Nom du point relais | ✅ Oui | "Point Relais Dakar Centre" |
| `address` | string | Adresse complète | ✅ Oui | "Avenue Bourguiba, Dakar" |
| `type` | string | Type de point (DEPOT, RETRAIT, DEPOT_RETRAIT) | ✅ Oui | "DEPOT" |
| `main_phone` | string | Numéro de téléphone principal | ✅ Oui | "+221771234567" |
| `manager_user_id` | string/integer | ID du gestionnaire | ✅ Oui | "usr_55" ou 55 |
| `is_active` | boolean | Statut actif/inactif | ✅ Oui | true |

### Réponses HTTP

| Code | Description | Message/Retour |
|------|-------------|----------------|
| **200** | Succès - Point relais mis à jour | Objet point relais mis à jour |
| **401** | Non authentifié | Géré automatiquement par `authorizedFetch` |
| **404** | Point relais non trouvé | "Point de retrait non trouvé" |
| **409** | Ressource en cours d'utilisation | "Ressource en cours d'utilisation" |
| **422** | Erreur de validation | Détails des erreurs de validation |

### Exemple de Requête

```bash
curl -X PATCH \
  'https://your-api.com/api/v1/admin/relay-points/123' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Point Relais Dakar Nord",
    "address": "Rue 10, Dakar",
    "type": "DEPOT_RETRAIT",
    "main_phone": "+221771234567",
    "manager_user_id": "usr_55",
    "is_active": true
  }'
```

### Exemple de Réponse (200)

```json
{
  "id": 123,
  "name": "Point Relais Dakar Nord",
  "address": "Rue 10, Dakar",
  "type": "DEPOT_RETRAIT",
  "main_phone": "+221771234567",
  "manager_user_id": "usr_55",
  "is_active": true,
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-05T11:53:00Z"
}
```

### Exemple d'Erreur (422)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Données invalides",
    "details": {
      "email": ["Le champ email est requis."]
    }
  }
}
```

## 🛠️ Implémentation

### Service Layer (`relayPointService.js`)

La fonction `updateRelayPoint` est disponible dans `/src/services/relayPointService.js` :

```javascript
import { updateRelayPoint } from '../services/relayPointService';

// Utilisation
try {
  const updatedPoint = await updateRelayPoint(pointId, {
    name: "Point Relais Mis à Jour",
    address: "Nouvelle Adresse",
    type: "DEPOT",
    main_phone: "+221771234567",
    manager_user_id: "usr_55",
    is_active: true
  });
  
  console.log('Point modifié:', updatedPoint);
} catch (error) {
  console.error('Erreur:', error.message);
}
```

**Caractéristiques:**
- ✅ Méthode HTTP: **PATCH** (corrigé de PUT)
- ✅ Gestion automatique de l'authentification via `authorizedFetch`
- ✅ Rafraîchissement automatique du token si expiré
- ✅ Gestion détaillée des erreurs (404, 409, 422)
- ✅ Messages d'erreur personnalisés pour les validations
- ✅ Extraction du premier message d'erreur en cas d'erreur 422

### Interface Utilisateur

#### 1. **Formulaire de Modification** (`PointForm.jsx`)

Le formulaire a été mis à jour pour :
- ✅ Détecter automatiquement le mode (création vs modification)
- ✅ Pré-remplir les champs en mode édition
- ✅ Corriger `north_phone` → `main_phone`
- ✅ Ajouter le champ `is_active` (checkbox)
- ✅ Valider tous les champs requis
- ✅ Afficher les erreurs de validation

**Champs du formulaire:**
```javascript
{
  name: string,           // Nom du point
  address: string,        // Adresse
  type: string,          // DEPOT | RETRAIT | DEPOT_RETRAIT
  main_phone: string,    // Téléphone (corrigé)
  manager_user_id: string, // Format: usr_XX
  is_active: boolean     // Nouveau champ
}
```

#### 2. **Page Points Relais** (`PointsPage.jsx`)

**Nouvelle fonction `handleAddOrUpdatePoint`:**
```javascript
const handleAddOrUpdatePoint = async (formData) => {
  try {
    if (editingPoint) {
      // Mode modification
      await updateRelayPoint(editingPoint.id, formData);
      setToast({
        message: `${formData.name} a été modifié avec succès`,
        type: 'success'
      });
    } else {
      // Mode création
      await createRelayPoint(formData);
      setToast({
        message: `${formData.name} a été créé avec succès`,
        type: 'success'
      });
    }
    
    setShowForm(false);
    setEditingPoint(null);
    await loadRelayPoints();
  } catch (error) {
    // Gestion des erreurs avec toast
    // ...
  }
};
```

**Bouton d'édition:**
```jsx
<button 
  onClick={() => {
    setEditingPoint(point);
    setShowForm(true);
  }}
  className="p-2 hover:bg-gray-100 rounded-lg text-[#E8B44D] transition"
  title="Modifier"
>
  <Edit2 className="h-4 w-4" />
</button>
```

## 🎯 Flux d'Utilisation

1. **Utilisateur clique sur l'icône d'édition (crayon)** ✏️
2. **Ouverture du formulaire en mode édition**
   - Champs pré-remplis avec les données actuelles
   - Titre: "Modifier le point"
   - Bouton: "Modifier" (au lieu de "Créer le point")
3. **Utilisateur modifie les champs souhaités**
4. **Validation côté client**
   - Vérification des champs requis
   - Validation du format `manager_user_id` (usr_XX)
5. **Soumission du formulaire**
   - Bouton désactivé pendant la requête
   - Texte: "Traitement..."
6. **Appel API PATCH**
   - Envoi des données au backend
7. **Gestion de la réponse**
   - **Succès (200):** Toast vert + fermeture du formulaire + rechargement
   - **Erreur 404:** Toast rouge "Point introuvable"
   - **Erreur 409:** Toast jaune "Point en cours d'utilisation"
   - **Erreur 422:** Toast jaune avec le message de validation
   - **Autre erreur:** Toast rouge avec message d'erreur
8. **Mise à jour de l'interface**
   - Liste rechargée
   - Formulaire fermé
   - `editingPoint` réinitialisé

## 🎨 Types de Points Relais

| Valeur | Label | Description |
|--------|-------|-------------|
| `DEPOT` | Dépôt | Point uniquement pour déposer des colis |
| `RETRAIT` | Retrait | Point uniquement pour retirer des colis |
| `DEPOT_RETRAIT` | Dépôt et Retrait | Point pour déposer ET retirer |

## ⚠️ Validation des Données

### Format `manager_user_id`

Le champ `manager_user_id` doit respecter le format: `usr_XX`

**Regex:** `/^usr_[0-9]+$/`

**Exemples valides:**
- ✅ `usr_55`
- ✅ `usr_123`
- ✅ `usr_1`

**Exemples invalides:**
- ❌ `55` (manque le préfixe)
- ❌ `user_55` (mauvais préfixe)
- ❌ `usr_` (pas de numéro)
- ❌ `usr_abc` (lettres au lieu de chiffres)

### Autres Validations

- **name:** Requis, non vide
- **address:** Requis, non vide
- **type:** Requis, doit être DEPOT, RETRAIT ou DEPOT_RETRAIT
- **main_phone:** Requis, format téléphone recommandé
- **is_active:** Boolean, true par défaut

## 🔄 Différences Création vs Modification

| Aspect | Création | Modification |
|--------|----------|--------------|
| Titre du formulaire | "Ajouter un point de retrait" | "Modifier le point" |
| Bouton principal | "Créer le point" | "Modifier" |
| Champs pré-remplis | Non (valeurs par défaut) | Oui (données actuelles) |
| État `editingPoint` | `null` | Objet point sélectionné |
| Méthode API | POST | PATCH |
| Endpoint | `/relay-points` | `/relay-points/{id}` |
| Message succès | "{name} a été créé..." | "{name} a été modifié..." |

## 🚀 Améliorations Apportées

### 1. Correction de la Méthode HTTP
- ❌ Avant: `PUT`
- ✅ Maintenant: `PATCH`

### 2. Correction du Champ Téléphone
- ❌ Avant: `north_phone`
- ✅ Maintenant: `main_phone`

### 3. Ajout du Champ Statut
- ✅ Nouveau: `is_active` (checkbox)
- Permet d'activer/désactiver un point lors de la modification

### 4. Gestion des Erreurs Améliorée
- ✅ Erreur 422 avec extraction du premier message de validation
- ✅ Messages personnalisés pour 404 et 409
- ✅ Notifications toast pour tous les cas

### 5. UX Unifiée
- ✅ Même formulaire pour création et modification
- ✅ Détection automatique du mode
- ✅ Réinitialisation propre de l'état

## 📝 Notes Importantes

1. **PATCH vs PUT:**
   - PATCH = mise à jour partielle (seulement les champs modifiés)
   - PUT = remplacement complet de la ressource
   - L'API utilise PATCH, donc on peut envoyer seulement les champs modifiés

2. **Statut `is_active`:**
   - `true` = Point actif, visible et utilisable
   - `false` = Point inactif, caché ou désactivé
   - Valeur par défaut: `true`

3. **Immutabilité du manager:**
   - Si le point est en cours d'utilisation (colis actifs), certaines modifications peuvent être bloquées (erreur 409)

## 🔍 Débogage

Pour déboguer les mises à jour :

```javascript
// Dans handleAddOrUpdatePoint
console.log('Mode:', editingPoint ? 'Modification' : 'Création');
console.log('Point à modifier:', editingPoint);
console.log('Données envoyées:', formData);

// Logs automatiques dans relayPointService.js
console.error('Erreur lors de la mise à jour du point de retrait:', error);
```

## ✅ Checklist d'Implémentation

- [x] Endpoint API configuré (`updateRelayPoint` avec PATCH)
- [x] Correction de `north_phone` → `main_phone`
- [x] Ajout du champ `is_active`
- [x] Gestion des erreurs 404, 409, 422
- [x] Fonction `handleAddOrUpdatePoint` unifiée
- [x] Bouton d'édition avec onClick
- [x] Formulaire pré-rempli en mode édition
- [x] Notifications toast pour succès/erreur
- [x] Rechargement automatique de la liste
- [x] Réinitialisation de l'état `editingPoint`

## 🎁 Bonus: Réutilisation

Le pattern de formulaire unifié (création + modification) est maintenant réutilisable pour d'autres entités :

```javascript
// Pattern réutilisable
const handleAddOrUpdate = async (formData) => {
  try {
    if (editing) {
      await updateService(editing.id, formData);
      showToast('Modifié avec succès', 'success');
    } else {
      await createService(formData);
      showToast('Créé avec succès', 'success');
    }
    
    closeForm();
    reload();
  } catch (error) {
    handleError(error);
  }
};
```

---

**Créé le:** 2026-01-05  
**Auteur:** Antigravity AI  
**Version:** 1.0
