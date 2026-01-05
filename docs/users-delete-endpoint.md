# 🗑️ Endpoint - Supprimer un Utilisateur

## 📋 Aperçu

Endpoint pour supprimer un utilisateur de manière logique (soft delete). L'utilisateur n'est pas physiquement supprimé de la base de données mais marqué comme supprimé.

## 🔌 Endpoint API

**Méthode:** `DELETE`  
**URL:** `/api/v1/admin/users/{user_id}`  
**Authentification:** Requise (JWT Bearer Token)

### Paramètres

#### Path Parameters

| Paramètre | Type | Description | Requis |
|-----------|------|-------------|--------|
| `user_id` | integer | ID unique de l'utilisateur à supprimer | ✅ Oui |

**Exemple:**
```
DELETE /api/v1/admin/users/15
```

### Aucun Body Requis

Cet endpoint ne nécessite pas de body dans la requête.

## 📤 Réponses

### Succès (204)

**Description:** Utilisateur supprimé avec succès

**Corps de réponse:** Vide (No Content)

Le code 204 indique que l'opération a réussi mais ne retourne aucun contenu.

### Erreur 401 - Non Authentifié

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Message d'erreur",
    "details": []
  }
}
```

### Erreur 404 - Utilisateur Non Trouvé

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Utilisateur non trouvé",
    "details": []
  }
}
```

**Cause:** L'ID de l'utilisateur n'existe pas ou l'utilisateur a déjà été supprimé.

### Erreur 409 - Ressource en Cours d'Utilisation

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Message d'erreur",
    "details": []
  }
}
```

**Cause:** L'utilisateur ne peut pas être supprimé car il est actuellement utilisé (colis actifs, transactions en cours, etc.).

## 🔄 Soft Delete vs Hard Delete

### Soft Delete (Suppression Logique) ✅

**C'est ce qui est implémenté**

- L'utilisateur reste dans la base de données
- Un champ `deleted_at` est renseigné avec la date de suppression
- Le statut peut passer à `deleted` ou `inactive`
- Les données sont conservées pour l'historique
- Possibilité de restauration ultérieure

### Hard Delete (Suppression Physique) ❌

**Non implémenté**

- L'utilisateur est définitivement supprimé de la base
- Perte de toutes les données
- Pas de possibilité de restauration
- Peut créer des incohérences (références orphelines)

### Avantages du Soft Delete

1. **Historique préservé** : Conservation des données pour l'audit
2. **Restauration possible** : Possibilité d'annuler la suppression
3. **Intégrité référentielle** : Pas de références orphelines
4. **Traçabilité** : Qui a supprimé quoi et quand
5. **Conformité légale** : Respect des obligations de conservation

## 🛠️ Implémentation

### Service (`userService.js`)

La fonction `deleteUser` est déjà implémentée :

```javascript
import { deleteUser } from '../services/userService';

// Supprimer un utilisateur
try {
  await deleteUser(15);
  console.log('Utilisateur supprimé avec succès');
} catch (error) {
  if (error.message.includes('404') || error.message.includes('non trouvé')) {
    console.log('Utilisateur introuvable');
  } else if (error.message.includes('409') || error.message.includes('utilisation')) {
    console.log('Utilisateur en cours d\'utilisation');
  } else {
    console.error('Erreur:', error);
  }
}
```

### Code du Service

```javascript
export const deleteUser = async (userId) => {
    try {
        const url = buildUrl(`/api/v1/admin/users/${userId}`);

        const response = await authorizedFetch(url, {
            method: 'DELETE',
            headers: getDefaultHeaders(),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Utilisateur non trouvé');
            }
            if (response.status === 409) {
                throw new Error('Impossible de supprimer cet utilisateur car il est en cours d\'utilisation');
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        return;
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        throw error;
    }
};
```

## 🎨 Utilisation dans React Component

### Avec Confirmation et Toast

```javascript
import { useState } from 'react';
import { deleteUser } from '../../services/userService';
import Toast from '../../components/Toast';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);

  const handleDeleteUser = async (id) => {
    // Confirmation obligatoire
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?\n\nCette action est irréversible.')) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteUser(id);
      
      const userName = users.find(u => u.id === id)?.name || 'L\'utilisateur';
      setToast({
        message: `${userName} a été supprimé avec succès`,
        type: 'success'
      });
      
      // Recharger la liste
      await loadUsers();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      
      let errorMessage = 'Une erreur est survenue';
      let toastType = 'error';
      
      if (error.message.includes('non trouvé') || error.message.includes('404')) {
        errorMessage = 'Utilisateur introuvable. Il a peut-être déjà été supprimé.';
      } else if (error.message.includes('cours d\'utilisation') || error.message.includes('409')) {
        errorMessage = 'Impossible de supprimer cet utilisateur car il est actuellement en cours d\'utilisation.';
        toastType = 'warning';
      } else {
        errorMessage = error.message;
      }
      
      setToast({
        message: errorMessage,
        type: toastType
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* Bouton de suppression */}
      <button
        onClick={() => handleDeleteUser(user.id)}
        disabled={deletingId === user.id}
        className={`p-2 hover:bg-gray-100 rounded-lg transition ${
          deletingId === user.id 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-red-500'
        }`}
        title={deletingId === user.id ? 'Suppression en cours...' : 'Supprimer'}
      >
        {deletingId === user.id ? (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </button>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
```

### Bouton avec Loader

```jsx
<button
  onClick={() => handleDeleteUser(user.id)}
  disabled={deletingId === user.id}
  className={`p-2 hover:bg-red-50 rounded-lg transition ${
    deletingId === user.id 
      ? 'text-gray-400 cursor-not-allowed' 
      : 'text-red-600'
  }`}
  title={deletingId === user.id ? 'Suppression en cours...' : 'Supprimer'}
>
  {deletingId === user.id ? (
    <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-red-600 rounded-full"></div>
  ) : (
    <Trash2 className="h-4 w-4" />
  )}
</button>
```

## 🔄 Workflow Complet

```
1. Utilisateur clique sur l'icône poubelle 🗑️
   ↓
2. Dialog de confirmation s'affiche
   "Êtes-vous sûr de vouloir supprimer cet utilisateur?"
   ↓
3. Utilisateur confirme
   ↓
4. État deletingId = userId (affiche loader)
   ↓
5. Appel DELETE /api/v1/admin/users/{id}
   ↓
6. Backend effectue le soft delete
   - Marque deleted_at = NOW()
   - Change status = 'deleted'
   ↓
7. Réponse 204 (ou erreur 404/409)
   ↓
8. Toast de succès/erreur affiché
   ↓
9. Liste des utilisateurs rechargée
   ↓
10. deletingId = null (cache loader)
```

## ⚠️ Gestion des Erreurs

### Cas d'Erreur 404

**Scénario:** L'utilisateur a déjà été supprimé par un autre admin

**Gestion:**
```javascript
if (error.message.includes('404')) {
  setToast({
    message: 'Cet utilisateur a déjà été supprimé ou n\'existe pas.',
    type: 'error'
  });
  await loadUsers(); // Rafraîchir pour retirer de la liste
}
```

### Cas d'Erreur 409

**Scénarios:**
- L'utilisateur a des colis en cours de livraison
- L'utilisateur a des transactions non finalisées
- L'utilisateur est un manager avec des agents rattachés

**Gestion:**
```javascript
if (error.message.includes('409')) {
  setToast({
    message: 'Impossible de supprimer cet utilisateur car il a des opérations en cours. Veuillez finaliser ou transférer ses activités avant de le supprimer.',
    type: 'warning'
  });
}
```

### Messages d'Erreur Personnalisés

```javascript
const getDeleteErrorMessage = (error) => {
  if (error.message.includes('404')) {
    return {
      message: 'Utilisateur introuvable. Il a peut-être déjà été supprimé.',
      type: 'error'
    };
  }
  
  if (error.message.includes('409')) {
    return {
      message: 'Impossible de supprimer cet utilisateur car il est en cours d\'utilisation (colis actifs, transactions, etc.).',
      type: 'warning'
    };
  }
  
  return {
    message: 'Une erreur est survenue lors de la suppression.',
    type: 'error'
  };
};
```

## 🧪 Test de l'Endpoint

### Avec cURL

```bash
curl -X DELETE \
  'https://your-api.com/api/v1/admin/users/15' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Réponse attendue (succès):**
```
Status: 204 No Content
(Corps vide)
```

### Avec Postman

```
Method: DELETE
URL: /api/v1/admin/users/15
Headers:
  - Authorization: Bearer {token}
```

**Réponse 204:** Pas de corps, juste le code de statut

## 💡 Bonnes Pratiques

### 1. Toujours Demander Confirmation

```javascript
// ✅ Bon - Confirmation claire
if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?\n\nCette action est irréversible.')) {
  return;
}

// ❌ Éviter - Pas de confirmation
await deleteUser(id);
```

### 2. Afficher un Loader

```javascript
// ✅ Bon - Feedback visuel pendant l'opération
setDeletingId(userId);
try {
  await deleteUser(userId);
} finally {
  setDeletingId(null);
}

// ❌ Éviter - Pas de feedback
await deleteUser(userId);
```

### 3. Toast de Confirmation

```javascript
// ✅ Bon - Message descriptif avec le nom
setToast({
  message: `${userName} a été supprimé avec succès`,
  type: 'success'
});

// ❌ Éviter - Message générique
setToast({
  message: 'Supprimé',
  type: 'success'
});
```

### 4. Recharger la Liste

```javascript
// ✅ Bon - Liste mise à jour
await deleteUser(userId);
await loadUsers();

// ❌ Éviter - Liste obsolète
await deleteUser(userId);
// Pas de rechargement
```

### 5. Gérer les Cas Limites

```javascript
// Vérifier que l'utilisateur existe avant de supprimer
const userToDelete = users.find(u => u.id === userId);
if (!userToDelete) {
  setToast({
    message: 'Utilisateur introuvable',
    type: 'error'
  });
  return;
}

// Vérifier le rôle (ne pas supprimer le super admin, par exemple)
if (userToDelete.role === 'super_admin') {
  setToast({
    message: 'Impossible de supprimer le super administrateur',
    type: 'warning'
  });
  return;
}
```

## 🔐 Sécurité

### Contrôles d'Accès

**Côté Backend:**
- Vérifier que l'utilisateur connecté a le droit de supprimer
- Un utilisateur ne peut pas se supprimer lui-même
- Certains rôles ne peuvent pas être supprimés (super admin)

**Côté Frontend:**
```javascript
// Ne pas afficher le bouton si pas les droits
{currentUser.role === 'admin' && (
  <button onClick={() => handleDeleteUser(user.id)}>
    <Trash2 />
  </button>
)}

// Empêcher l'auto-suppression
{user.id !== currentUser.id && (
  <button onClick={() => handleDeleteUser(user.id)}>
    <Trash2 />
  </button>
)}
```

### Audit Trail

Le soft delete permet de conserver une trace :
- Qui a supprimé (`deleted_by`)
- Quand (`deleted_at`)
- Pourquoi (optionnel: `deletion_reason`)

## 📊 Cas d'Usage

### 1. Suppression d'un Compte Inactif

```javascript
// Utilisateur qui n'a jamais activé son compte
const inactiveUser = users.find(u => u.status === 'pending' && daysSince(u.created_at) > 30);
await deleteUser(inactiveUser.id);
```

### 2. Suppression d'un Utilisateur Malveillant

```javascript
// Avec raison
await deleteUser(userId);
// Backend enregistre: deleted_by, deleted_at, reason: "Activité suspecte"
```

### 3. Nettoyage en Masse (Admin)

```javascript
const inactiveUsers = users.filter(u => 
  u.status === 'pending' && 
  daysSince(u.created_at) > 60
);

for (const user of inactiveUsers) {
  try {
    await deleteUser(user.id);
  } catch (error) {
    console.error(`Échec suppression ${user.id}:`, error);
  }
}
```

## 🔄 Restauration (Si implémenté)

Si le backend implémente la restauration :

```javascript
// Endpoint hypothétique
POST /api/v1/admin/users/{user_id}/restore

// Service
export const restoreUser = async (userId) => {
  const response = await authorizedFetch(
    buildUrl(`/api/v1/admin/users/${userId}/restore`),
    { method: 'POST', headers: getDefaultHeaders() }
  );
  return await response.json();
};
```

## 📁 Fichiers

- ✅ `/src/services/userService.js` - Fonction `deleteUser()` implémentée
- ✅ `/docs/users-delete-endpoint.md` - Cette documentation

## 🎯 Checklist d'Implémentation

- [x] Service API `deleteUser()` fonctionnel
- [x] Gestion des erreurs 404 et 409
- [x] Documentation complète
- [ ] Intégration dans `UsersPage.jsx`
- [ ] Dialog de confirmation
- [ ] Loader pendant suppression
- [ ] Toast de succès/erreur
- [ ] Rechargement de la liste
- [ ] Tests de l'endpoint

## 🚀 Prochaines Étapes

1. **Intégrer dans UsersPage.jsx** :
   - Ajouter état `deletingId`
   - Implémenter `handleDeleteUser`
   - Ajouter loader sur le bouton
   - Afficher toast

2. **Améliorer la Confirmation** :
   - Modal personnalisé au lieu de `confirm()`
   - Afficher les informations de l'utilisateur
   - Option "Êtes-vous vraiment sûr ?"

3. **Ajouter des Contrôles** :
   - Empêcher l'auto-suppression
   - Vérifier les droits
   - Protéger certains rôles

---

**Créé le:** 2026-01-05  
**Version:** 1.0  
**Auteur:** Antigravity AI
