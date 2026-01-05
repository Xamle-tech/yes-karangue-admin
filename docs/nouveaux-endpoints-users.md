# 📋 Nouveaux Endpoints Utilisateurs à Intégrer

## 🎯 Vue d'ensemble

Basé sur les captures d'écran Swagger partagées, voici les **nouveaux endpoints** à intégrer dans l'application admin pour la gestion des utilisateurs.

---

## 1. 📧 Renvoyer l'invitation

### Endpoint
**Méthode:** `POST`  
**URL:** `/api/v1/admin/users/{user_id}/invite/resend`  
**Authentification:** Requise (JWT Bearer Token)

### Description
Renvoie l'email d'invitation à un utilisateur qui n'a pas encore défini son mot de passe.

### Paramètres de Route
| Paramètre | Type | Description | Requis |
|-----------|------|-------------|---------|
| `user_id` | integer | ID de l'utilisateur | ✅ Oui |

### Réponses

#### ✅ 200 - Invitation renvoyée
```json
{}
```
**Message:** "Invitation renvoyée avec succès"

#### ❌ 401 - Non authentifié
```json
{
  "error": {
    "code": "INVALID_CODE",
    "message": "Message d'erreur",
    "details": []
  }
}
```

#### ❌ 404 - Utilisateur non trouvé
```json
{
  "error": {
    "code": "INVALID_CODE",
    "message": "Message d'erreur",
    "details": []
  }
}
```

#### ❌ 409 - Email ou téléphone déjà utilisé
```json
{
  "error": {
    "code": "INVALID_CODE",
    "message": "Message d'erreur",
    "details": []
  }
}
```

#### ❌ 422 - Erreur de validation
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Données invalides.",
    "details": [
      {
        "field": "champ email est requis."
      }
    ]
  }
}
```

#### ❌ 429 - Trop de tentatives
```json
{
  "error": {
    "code": "USAGE_CODE",
    "message": "Message d'erreur",
    "details": []
  }
}
```

#### ❌ 503 - Service email indisponible
```json
{
  "error": {
    "code": "USAGE_CODE",
    "message": "Message d'erreur",
    "details": []
  }
}
```

### Implémentation Service

```javascript
/**
 * Renvoie l'email d'invitation à un utilisateur
 * @param {number} userId - L'ID de l'utilisateur
 * @returns {Promise<void>}
 */
export const resendUserInvitation = async (userId) => {
  try {
    const url = buildUrl(`/api/v1/admin/users/${userId}/invite/resend`);
    
    const response = await authorizedFetch(url, {
      method: 'POST',
      headers: getDefaultHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Utilisateur non trouvé');
      }
      if (response.status === 409) {
        throw new Error('Invitation déjà acceptée ou utilisateur déjà actif');
      }
      if (response.status === 429) {
        throw new Error('Trop de tentatives. Veuillez réessayer plus tard');
      }
      if (response.status === 503) {
        throw new Error('Service email indisponible. Veuillez réessayer plus tard');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }

    return;
  } catch (error) {
    console.error('Erreur lors du renvoi de l\'invitation:', error);
    throw error;
  }
};
```

### Utilisation dans un Composant

```javascript
const handleResendInvitation = async (userId) => {
  try {
    setLoading(true);
    await resendUserInvitation(userId);
    setToast({
      message: 'Invitation renvoyée avec succès',
      type: 'success'
    });
  } catch (error) {
    setToast({
      message: error.message,
      type: 'error'
    });
  } finally {
    setLoading(false);
  }
};
```

---

## 2. 🔍 Recherche d'utilisateurs (Lookup)

### Endpoint
**Méthode:** `GET`  
**URL:** `/api/v1/admin/users/lookup`  
**Authentification:** Requise (JWT Bearer Token)

### Description
Recherche des utilisateurs par nom, email ou téléphone pour gestionnaires, etc. Utile pour les champs autocomplete.

### Paramètres de Requête (Query Parameters)
| Paramètre | Type | Description | Requis | Exemple |
|-----------|------|-------------|---------|---------|
| `q` | string | Recherche (nom, email, téléphone) | ❌ Non | `?q=amadou` |
| `role` | string | Filtrer par rôle | ❌ Non | `?role=ADMIN` |
| `limit` | integer | Nombre de résultats (défaut: 20) | ❌ Non | `?limit=20` |

### Valeurs Possibles pour `role`
- `ADMIN` - Administrateur
- `AGENT` - Agent
- `MANAGER` - Gestionnaire

### Exemples d'Utilisation

#### Recherche simple
```bash
GET /api/v1/admin/users/lookup?q=amadou
```

#### Recherche avec filtre de rôle
```bash
GET /api/v1/admin/users/lookup?q=mama&role=ADMIN
```

#### Recherche avec limite
```bash
GET /api/v1/admin/users/lookup?q=test&limit=10
```

### Réponses

#### ✅ 200 - Résultats de la recherche
```json
[]
```

**Format attendu** (basé sur la logique standard):
```json
[
  {
    "id": 1,
    "full_name": "Amadou Diallo",
    "email": "amadou@example.com",
    "phone": "+221771234567",
    "role": "ADMIN"
  },
  {
    "id": 2,
    "full_name": "Mama Ndiaye",
    "email": "mama@example.com",
    "phone": "+221772345678",
    "role": "MANAGER"
  }
]
```

#### ❌ 401 - Non authentifié
```json
{
  "error": {
    "code": "INVALID_CODE",
    "message": "Message d'erreur",
    "details": []
  }
}
```

#### ❌ 422 - Erreur de validation
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Données invalides.",
    "details": [
      {
        "field": "Champ email est requis."
      }
    ]
  }
}
```

### Implémentation Service

```javascript
/**
 * Recherche d'utilisateurs (autocomplete)
 * @param {Object} params - Paramètres de recherche
 * @param {string} params.q - Terme de recherche
 * @param {string} params.role - Filtrer par rôle (ADMIN, AGENT, MANAGER)
 * @param {number} params.limit - Nombre de résultats (défaut: 20)
 * @returns {Promise<Array>} Liste d'utilisateurs correspondants
 */
export const lookupUsers = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const url = buildUrl('/api/v1/admin/users/lookup' + (queryString ? `?${queryString}` : ''));

    const response = await authorizedFetch(url, {
      method: 'GET',
      headers: getDefaultHeaders(),
    });

    if (!response.ok) {
      if (response.status === 422) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erreur de validation');
      }
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la recherche d\'utilisateurs:', error);
    throw error;
  }
};
```

### Utilisation dans un Composant (Autocomplete)

```javascript
import { useState, useEffect } from 'react';
import { lookupUsers } from '../../services/userService';

export default function UserAutocomplete({ onSelect, roleFilter = '' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm.length >= 2) {
        try {
          setLoading(true);
          const users = await lookupUsers({
            q: searchTerm,
            role: roleFilter,
            limit: 10
          });
          setResults(users);
        } catch (error) {
          console.error('Erreur recherche:', error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, roleFilter]);

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Rechercher un utilisateur..."
        className="w-full px-4 py-2 border rounded-lg"
      />
      
      {loading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      )}

      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map(user => (
            <button
              key={user.id}
              onClick={() => {
                onSelect(user);
                setSearchTerm('');
                setResults([]);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{user.full_name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                {user.role}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 📁 Fichiers à Modifier

### 1. `/src/services/userService.js`
Ajouter les deux nouvelles fonctions :
- ✅ `resendUserInvitation(userId)`
- ✅ `lookupUsers(params)`

### 2. `/src/pages/users/UsersPage.jsx`
Ajouter un bouton "Renvoyer l'invitation" dans le tableau pour les utilisateurs avec statut `pending`:

```javascript
{user.status === 'pending' && (
  <button
    onClick={() => handleResendInvitation(user.id)}
    className="text-blue-600 hover:text-blue-800"
    title="Renvoyer l'invitation"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  </button>
)}
```

### 3. Créer un composant `UserAutocomplete`
Fichier: `/src/components/forms/UserAutocomplete.jsx`

Utile pour sélectionner un gestionnaire lors de la création d'un point relais, etc.

---

## 🎨 Interface Utilisateur

### Badge pour "En attente"
Pour les utilisateurs qui n'ont pas encore accepté leur invitation:

```javascript
{user.status === 'pending' && (
  <div className="flex items-center space-x-2">
    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
      En attente
    </span>
    <button
      onClick={() => handleResendInvitation(user.id)}
      className="text-sm text-blue-600 hover:underline"
    >
      Renvoyer
    </button>
  </div>
)}
```

---

## 🧪 Tests avec cURL

### Renvoyer une invitation
```bash
curl -X POST \
  'https://your-api.com/api/v1/admin/users/15/invite/resend' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Recherche d'utilisateurs
```bash
curl -X GET \
  'https://your-api.com/api/v1/admin/users/lookup?q=amadou&role=ADMIN&limit=10' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## 🎯 Cas d'Usage

### 1. Renvoyer une invitation
**Scénario:** Un utilisateur n'a pas reçu l'email d'invitation ou l'email a expiré.

**Flow:**
1. Admin voit dans la liste que l'utilisateur a le statut "En attente"
2. Clic sur le bouton "Renvoyer l'invitation"
3. Appel API `POST /api/v1/admin/users/{id}/invite/resend`
4. Toast de succès: "Invitation renvoyée avec succès"
5. L'utilisateur reçoit un nouvel email

### 2. Autocomplete pour gestionnaire
**Scénario:** Lors de la création d'un point relais, il faut assigner un gestionnaire.

**Flow:**
1. Admin ouvre le formulaire "Créer un point relais"
2. Dans le champ "Gestionnaire", commence à taper "Ama"
3. Après 300ms, appel API `GET /api/v1/admin/users/lookup?q=Ama&role=MANAGER`
4. Affichage des résultats dans un dropdown
5. Sélection d'un gestionnaire
6. Le `relay_point.manager_id` est défini avec l'ID sélectionné

---

## 📊 Résumé des Endpoints

| Endpoint | Méthode | Statut | Service |
|----------|---------|--------|---------|
| `/api/v1/admin/users` | GET | ✅ Implémenté | `fetchUsers` |
| `/api/v1/admin/users/{id}` | GET | ✅ Implémenté | `fetchUserById` |
| `/api/v1/admin/users` | POST | ✅ Implémenté | `createUser` |
| `/api/v1/admin/users/{id}` | PATCH | ✅ Implémenté | `updateUser` |
| `/api/v1/admin/users/{id}` | DELETE | ✅ Implémenté | `deleteUser` |
| `/api/v1/admin/users/{id}/invite/resend` | POST | ❌ **Nouveau** | `resendUserInvitation` |
| `/api/v1/admin/users/lookup` | GET | ❌ **Nouveau** | `lookupUsers` |

---

## ✅ Actions à Réaliser

1. **Mettre à jour `userService.js`**
   - Ajouter `resendUserInvitation`
   - Ajouter `lookupUsers`

2. **Mettre à jour `UsersPage.jsx`**
   - Ajouter bouton "Renvoyer l'invitation" pour statut `pending`
   - Implémenter `handleResendInvitation`

3. **Créer `UserAutocomplete.jsx`**
   - Composant réutilisable pour sélection d'utilisateur
   - Utiliser `lookupUsers` avec debounce

4. **Tester les nouveaux endpoints**
   - Test manuel dans l'interface
   - Vérifier les notifications toast
   - Tester les cas d'erreur (404, 429, 503)

---

**Créé le:** 2026-01-05  
**Version:** 1.0  
**Basé sur:** Captures Swagger fournies
