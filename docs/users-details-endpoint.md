# 🔍 Endpoint - Détails d'un Utilisateur

## 📋 Aperçu

Endpoint pour récupérer les informations détaillées d'un utilisateur spécifique par son ID.

## 🔌 Endpoint API

**Méthode:** `GET`  
**URL:** `/api/v1/admin/users/{user_id}`  
**Authentification:** Requise (JWT Bearer Token)

### Paramètres

#### Path Parameters

| Paramètre | Type | Description | Requis |
|-----------|------|-------------|--------|
| `user_id` | integer | ID unique de l'utilisateur | ✅ Oui |

**Exemple:**
```
GET /api/v1/admin/users/15
```

### Aucun Query Parameter

Cet endpoint ne nécessite pas de paramètres de requête.

## 📤 Réponse (200)

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
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-05T10:30:00Z",
  "last_login": "2026-01-05T09:15:00Z",
  "email_verified": true,
  "phone_verified": true,
  "profile_picture": "https://cdn.example.com/avatars/user15.jpg"
}
```

### Structure de la Réponse

| Champ | Type | Description |
|-------|------|-------------|
| `id` | integer | ID unique de l'utilisateur |
| `full_name` | string | Nom complet |
| `email` | string | Adresse email |
| `phone` | string | Numéro de téléphone |
| `role` | string | Rôle de l'utilisateur |
| `relay_point_id` | integer/null | ID du point relais associé |
| `relay_point_name` | string/null | Nom du point relais |
| `status` | string | Statut du compte (active, inactive, pending) |
| `credits` | integer | Crédits disponibles |
| `created_at` | string | Date de création (ISO 8601) |
| `updated_at` | string | Date de dernière modification |
| `last_login` | string/null | Date de dernière connexion |
| `email_verified` | boolean | Email vérifié ou non |
| `phone_verified` | boolean | Téléphone vérifié ou non |
| `profile_picture` | string/null | URL de la photo de profil |

## ⚠️ Codes de Réponse

| Code | Description | Exemple |
|------|-------------|---------|
| **200** | Utilisateur trouvé et retourné | Voir exemple ci-dessus |
| **401** | Non authentifié | Token invalide ou absent |
| **404** | Utilisateur non trouvé | L'ID n'existe pas |

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

## 🛠️ Implémentation

### Service (`userService.js`)

La fonction `fetchUserById` est déjà implémentée :

```javascript
import { fetchUserById } from '../services/userService';

// Récupérer un utilisateur
try {
  const user = await fetchUserById(15);
  console.log('Utilisateur:', user);
  // {
  //   id: 15,
  //   full_name: "Moussa Ndiaye",
  //   email: "moussa@example.com",
  //   ...
  // }
} catch (error) {
  if (error.message.includes('404') || error.message.includes('non trouvé')) {
    console.log('Utilisateur introuvable');
  } else {
    console.error('Erreur:', error);
  }
}
```

### Utilisation dans un Composant React

```javascript
import { useState, useEffect } from 'react';
import { fetchUserById } from '../../services/userService';

export default function UserDetailsModal({ userId, onClose }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const data = await fetchUserById(userId);
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadUser();
    }
  }, [userId]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!user) return null;

  return (
    <div className="modal">
      <h2>{user.full_name}</h2>
      <p>Email: {user.email}</p>
      <p>Téléphone: {user.phone}</p>
      <p>Rôle: {user.role}</p>
      <p>Statut: {user.status}</p>
      {user.relay_point_name && (
        <p>Point relais: {user.relay_point_name}</p>
      )}
      <button onClick={onClose}>Fermer</button>
    </div>
  );
}
```

## 🎨 Cas d'Usage

### 1. Modal de Détails

Afficher les informations complètes d'un utilisateur dans un modal :

```javascript
const [selectedUserId, setSelectedUserId] = useState(null);
const [showDetails, setShowDetails] = useState(false);

const handleViewUser = (userId) => {
  setSelectedUserId(userId);
  setShowDetails(true);
};

<button onClick={() => handleViewUser(user.id)}>
  <Eye className="h-4 w-4" />
</button>

{showDetails && (
  <UserDetailsModal 
    userId={selectedUserId}
    onClose={() => setShowDetails(false)}
  />
)}
```

### 2. Page de Profil Utilisateur

Une page dédiée au profil complet d'un utilisateur :

```javascript
import { useParams } from 'react-router-dom';

export default function UserProfilePage() {
  const { userId } = useParams(); // De l'URL /users/:userId
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserById(userId).then(setUser);
  }, [userId]);

  return (
    <div>
      <h1>Profil de {user?.full_name}</h1>
      {/* Afficher tous les détails */}
    </div>
  );
}
```

### 3. Pré-remplir un Formulaire d'Édition

Charger les données d'un utilisateur pour pré-remplir le formulaire de modification :

```javascript
const [editingUser, setEditingUser] = useState(null);

const handleEdit = async (userId) => {
  const userData = await fetchUserById(userId);
  setEditingUser(userData);
  setShowForm(true);
};

<UserForm 
  user={editingUser} 
  onSubmit={handleUpdate}
/>
```

## 🔄 Workflow Complet

### Visualisation des Détails

```
1. Utilisateur clique sur l'icône "Œil" 👁️
   ↓
2. Récupération de l'ID de l'utilisateur
   ↓
3. Appel GET /api/v1/admin/users/{id}
   ↓
4. Affichage des données dans un modal/page
   ↓
5. Utilisateur consulte les informations
   ↓
6. Fermeture du modal
```

### Édition

```
1. Utilisateur clique sur "Modifier" ✏️
   ↓
2. GET /api/v1/admin/users/{id}
   ↓
3. Pré-remplissage du formulaire
   ↓
4. Utilisateur modifie les champs
   ↓
5. PATCH /api/v1/admin/users/{id}
   ↓
6. Mise à jour réussie
```

## 🧪 Test de l'Endpoint

### Avec cURL

```bash
curl -X GET \
  'https://your-api.com/api/v1/admin/users/15' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Avec Postman

```
Method: GET
URL: /api/v1/admin/users/15
Headers:
  - Authorization: Bearer {token}
```

### Réponse Attendue

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
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-05T10:30:00Z"
}
```

## 💡 Bonnes Pratiques

### 1. Cache Local

Pour éviter des requêtes répétées :

```javascript
const [userCache, setUserCache] = useState({});

const getUserById = async (id) => {
  // Vérifier le cache
  if (userCache[id]) {
    return userCache[id];
  }
  
  // Charger depuis l'API
  const user = await fetchUserById(id);
  
  // Mettre en cache
  setUserCache(prev => ({ ...prev, [id]: user }));
  
  return user;
};
```

### 2. Gestion d'Erreur 404

```javascript
try {
  const user = await fetchUserById(userId);
  setUser(user);
  setError(null);
} catch (error) {
  if (error.message.includes('404') || error.message.includes('non trouvé')) {
    setError('Cet utilisateur n\'existe pas ou a été supprimé.');
    setToast({
      message: 'Utilisateur introuvable',
      type: 'error'
    });
  } else {
    setError('Une erreur est survenue lors du chargement.');
  }
}
```

### 3. État de Chargement

Toujours afficher un loader pendant le chargement :

```javascript
{loading ? (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
) : (
  <UserDetails user={user} />
)}
```

### 4. Rafraîchissement des Données

Recharger les données après modification :

```javascript
const handleUpdate = async (formData) => {
  await updateUser(userId, formData);
  
  // Recharger les détails mis à jour
  const updatedUser = await fetchUserById(userId);
  setUser(updatedUser);
  
  setToast({ message: 'Utilisateur modifié', type: 'success' });
};
```

## 🎨 Composant Modal de Détails (Exemple)

```javascript
import { useState, useEffect } from 'react';
import { X, Mail, Phone, MapPin, Calendar, CreditCard } from 'lucide-react';
import { fetchUserById } from '../../services/userService';

export default function UserDetailsModal({ userId, onClose }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchUserById(userId);
        setUser(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">{user.full_name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Info Row */}
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Téléphone</p>
              <p className="font-medium">{user.phone}</p>
            </div>
          </div>

          {user.relay_point_name && (
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Point relais</p>
                <p className="font-medium">{user.relay_point_name}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Crédits</p>
              <p className="font-medium">{user.credits} FCFA</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Date d'inscription</p>
              <p className="font-medium">
                {new Date(user.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Fermer
          </button>
          <button 
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
}
```

## 📊 Affichage des Informations

### Badges de Statut

```javascript
const getStatusBadge = (status) => {
  const statusConfig = {
    active: { label: 'Actif', class: 'bg-green-100 text-green-800' },
    inactive: { label: 'Inactif', class: 'bg-gray-100 text-gray-800' },
    pending: { label: 'En attente', class: 'bg-yellow-100 text-yellow-800' },
  };
  
  const config = statusConfig[status] || statusConfig.active;
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.class}`}>
      {config.label}
    </span>
  );
};
```

### Badges de Rôle

```javascript
const getRoleBadge = (role) => {
  const roleConfig = {
    admin: { label: 'Admin', class: 'bg-purple-100 text-purple-800' },
    agent: { label: 'Agent', class: 'bg-blue-100 text-blue-800' },
    client: { label: 'Client', class: 'bg-gray-100 text-gray-800' },
    carrier: { label: 'Transporteur', class: 'bg-orange-100 text-orange-800' },
    MANAGER: { label: 'Manager', class: 'bg-indigo-100 text-indigo-800' },
  };
  
  const config = roleConfig[role] || { label: role, class: 'bg-gray-100 text-gray-800' };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.class}`}>
      {config.label}
    </span>
  );
};
```

## 🔗 Intégration avec la Liste

Dans `UsersPage.jsx`, ajouter le bouton "Voir" :

```javascript
const [viewingUserId, setViewingUserId] = useState(null);
const [showDetails, setShowDetails] = useState(false);

// Dans le tableau
<button 
  onClick={() => {
    setViewingUserId(user.id);
    setShowDetails(true);
  }}
  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
  title="Voir les détails"
>
  <Eye className="h-4 w-4" />
</button>

// Afficher le modal
{showDetails && (
  <UserDetailsModal
    userId={viewingUserId}
    onClose={() => {
      setShowDetails(false);
      setViewingUserId(null);
    }}
  />
)}
```

## 📁 Fichiers

- ✅ `/src/services/userService.js` - Fonction `fetchUserById()` déjà implémentée
- ✅ `/docs/users-details-endpoint.md` - Cette documentation
- 📝 À créer: `/src/components/modals/UserDetailsModal.jsx` (optionnel)

## 🎯 Checklist

- [x] Service API `fetchUserById()` fonctionnel
- [x] Gestion de l'erreur 404
- [x] Documentation complète
- [ ] Composant modal de détails (optionnel)
- [ ] Intégration dans `UsersPage.jsx`
- [ ] Tests de l'endpoint

## 🚀 Prochaines Étapes

1. **Créer le composant UserDetailsModal** (si nécessaire)
2. **Intégrer dans UsersPage.jsx** :
   - Ajouter state `viewingUserId` et `showDetails`
   - Connecter le bouton "Œil"
   - Afficher le modal conditionnel

3. **Améliorer** :
   - Afficher l'historique d'activité de l'utilisateur
   - Ajouter un bouton "Modifier" dans le modal
   - Afficher les statistiques (colis envoyés, reçus, etc.)

---

**Créé le:** 2026-01-05  
**Version:** 1.0  
**Auteur:** Antigravity AI
