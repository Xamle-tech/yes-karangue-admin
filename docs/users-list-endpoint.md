# 📚 Endpoint - Liste des Utilisateurs

## 📋 Aperçu

Endpoint pour récupérer la liste de tous les utilisateurs avec pagination et filtres avancés.

## 🔌 Endpoint API

**Méthode:** `GET`  
**URL:** `/api/v1/admin/users`  
**Authentification:** Requise (JWT Bearer Token)

### Paramètres de Requête (Query Parameters)

Tous les paramètres sont optionnels :

| Paramètre | Type | Description | Exemple |
|-----------|------|-------------|---------|
| `q` | string | Recherche par nom, email ou téléphone | `?q=mama` |
| `role` | string | Filtrer par rôle | `?role=client` |
| `relay_point_id` | integer | Filtrer par point relais | `?relay_point_id=5` |
| `status` | string | Filtrer par statut | `?status=active` |
| `limit` | integer | Nombre d'éléments par page (défaut: 20) | `?limit=50` |
| `offset` | integer | Offset pour la pagination (défaut: 0) | `?offset=20` |

### Valeurs Possibles

**Rôles (`role`):**
- `admin` - Administrateur
- `agent` - Agent
- `client` - Client
- `carrier` - Transporteur
- `MANAGER` - Manager

**Statuts (`status`):**
- `active` - Actif
- `inactive` - Inactif
- `pending` - En attente

## 🎯 Exemples d'Utilisation

### Exemple 1: Liste complète (par défaut)
```bash
GET /api/v1/admin/users
```

### Exemple 2: Recherche par nom
```bash
GET  /api/v1/admin/users?q=maria
```

### Exemple 3: Filtrer par rôle
```bash
GET /api/v1/admin/users?role=client
```

### Exemple 4: Filtrer par statut + pagination
```bash
GET /api/v1/admin/users?status=active&limit=10&offset=0
```

### Exemple 5: Filtrage combiné
```bash
GET /api/v1/admin/users?role=agent&relay_point_id=5&status=active&limit=50
```

## 📤 Réponse (200)

```json
{
  "data": [
    {
      "id": 1,
      "name": "Mama Diallo",
      "email": "mama@example.com",
      "phone": "+221771234567",
      "role": "client",
      "relay_point_id": 5,
      "relay_point_name": "Point Dakar Centre",
      "status": "active",
      "credits": 15000,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-05T12:00:00Z"
    },
    {
      "id": 2,
      "name": "Mouhamadou Ba",
      "email": "mouhamadou@example.com",
      "phone": "+221782345678",
      "role": "MANAGER",
      "relay_point_id": 3,
      "relay_point_name": "Point Thiès Est",
      "status": "active",
      "credits": 0,
      "created_at": "2024-12-20T00:00:00Z",
      "updated_at": "2025-01-03T10:00:00Z"
    }
  ],
  "total": 150,
  "limit": 20,
  "offset": 0
}
```

### Structure de Réponse

| Champ | Type | Description |
|-------|------|-------------|
| `data` | array | Tableau d'utilisateurs |
| `total` | integer | Nombre total d'utilisateurs (pour pagination) |
| `limit` | integer | Limite appliquée |
| `offset` | integer | Offset appliquée |

### Structure d'un Utilisateur

| Champ | Type | Description |
|-------|------|-------------|
| `id` | integer | ID unique de l'utilisateur |
| `name` | string | Nom complet |
| `email` | string | Email |
| `phone` | string | Numéro de téléphone |
| `role` | string | Rôle de l'utilisateur |
| `relay_point_id` | integer/null | ID du point relais associé |
| `relay_point_name` | string/null | Nom du point relais |
| `status` | string | Statut du compte |
| `credits` | integer | Crédits disponibles |
| `created_at` | string | Date de création |
| `updated_at` | string | Date de dernière modification |

## ⚠️ Codes de Réponse

| Code | Description |
|------|-------------|
| 200 | Liste des utilisateurs retournée avec succès |
| 401 | Non authentifié |

## 🛠️ Implémentation

### Service (`userService.js`)

```javascript
import { fetchUsers } from '../services/userService';

// Liste complète
const users = await fetchUsers();

// Avec filtres
const filteredUsers = await fetchUsers({
  q: 'mama',
  role: 'client',
  status: 'active',
  limit: 50,
  offset: 0
});

// Avec pagination
const page2 = await fetchUsers({
  limit: 20,
  offset: 20
});
```

### Utilisation dans un Composant React

```javascript
import { useState, useEffect } from 'react';
import { fetchUsers } from '../../services/userService';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      };

      if (searchTerm) params.q = searchTerm;
      if (filterRole) params.role = filterRole;
      if (filterStatus) params.status = filterStatus;

      const data = await fetchUsers(params);
      
      setUsers(data.data || data);
      setTotalItems(data.total || data.length);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [searchTerm, filterRole, filterStatus, currentPage]);

  return (
    // ... JSX
  );
}
```

## 📊 Calcul de Pagination

```javascript
// Nombre total de pages
const totalPages = Math.ceil(totalItems / itemsPerPage);

// Premier élément de la page
const startItem = (currentPage - 1) * itemsPerPage + 1;

// Dernier élément de la page
const endItem = Math.min(currentPage * itemsPerPage, totalItems);

// Aller à la page suivante
const nextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
  }
};

// Aller à la page précédente
const prevPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};
```

## 🧪 Test avec cURL

```bash
curl -X GET \
  'https://your-api.com/api/v1/admin/users?role=client&status=active&limit=10' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

## 🎨 Interface Utilisateur

### Statistiques

D'après le design fourni, afficher :
- **Utilisateurs total** : Nombre total d'utilisateurs
- **Crédits** : Nombre de crédits (à calculer)
- **Points de retrait** : Nombre unique de points relais
- **Crédits totaux** : Somme des crédits (en FCFA)

```javascript
const stats = {
  total: totalItems,
  credits: users.filter(u => u.credits > 0).length,
  relayPoints: new Set(users.map(u => u.relay_point_id).filter(Boolean)).size,
  totalCredits: users.reduce((acc, u) => acc + (u.credits || 0), 0),
};
```

### Badges de Rôle

```javascript
const getRoleBadge = (role) => {
  const roleMap = {
    admin: { label: 'Admin', class: 'bg-purple-100 text-purple-800' },
    agent: { label: 'Agent', class: 'bg-blue-100 text-blue-800' },
    client: { label: 'Client', class: 'bg-gray-100 text-gray-800' },
    carrier: { label: 'Transporteur', class: 'bg-orange-100 text-orange-800' },
    MANAGER: { label: 'Manager', class: 'bg-indigo-100 text-indigo-800' },
  };
  
  const config = roleMap[role] || { label: role, class: 'bg-gray-100 text-gray-800' };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
      {config.label}
    </span>
  );
};
```

### Badges de Statut

```javascript
const getStatusBadge = (status) => {
  const statusMap = {
    active: { label: 'Actif', class: 'bg-green-100 text-green-800' },
    inactive: { label: 'Inactif', class: 'bg-gray-100 text-gray-800' },
    pending: { label: 'En attente', class: 'bg-yellow-100 text-yellow-800' },
  };
  
  const config = statusMap[status] || statusMap.active;
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
      {config.label}
    </span>
  );
};
```

## 💡 Bonnes Pratiques

### 1. Débounce sur la Recherche
Pour éviter trop de requêtes pendant la saisie :

```javascript
import { useEffect, useState } from 'react';

const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearch, setDebouncedSearch] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchTerm);
  }, 500);

  return () => clearTimeout(timer);
}, [searchTerm]);

useEffect(() => {
  loadUsers();
}, [debouncedSearch]); // Utiliser debouncedSearch au lieu de searchTerm
```

### 2. Gestion des Erreurs

```javascript
try {
  const data = await fetchUsers(params);
  setUsers(data.data || data);
} catch (error) {
  if (error.message.includes('401')) {
    // Rediriger vers login
  } else {
    setToast({
      message: error.message,
      type: 'error'
    });
  }
}
```

### 3. Cache Local (Optionnel)

Pour améliorer les performances :

```javascript
const cacheKey = JSON.stringify(params);
const cachedData = sessionStorage.getItem(cacheKey);

if (cachedData) {
  setUsers(JSON.parse(cachedData));
} else {
  const data = await fetchUsers(params);
  sessionStorage.setItem(cacheKey, JSON.stringify(data));
  setUsers(data);
}
```

## 🔄 Workflow Complet

```
1. Chargement de la page
   ↓
2. Appel API avec paramètres par défaut
   ↓
3. Affichage de la liste
   ↓
4. Utilisateur filtre par rôle/statut
   ↓
5. Nouvel appel API avec filtres
   ↓
6. Mise à jour de l'affichage
   ↓
7. Utilisateur change de page
   ↓
8. Appel API avec nouvel offset
   ↓
9. Affichage de la nouvelle page
```

## 📁 Fichiers Créés

- ✅ `/src/services/userService.js` - Service complet pour les utilisateurs
- ✅ `/src/pages/users/UsersPage.jsx` - Page existante à mettre à jour
- ✅ `/docs/users-list-endpoint.md` - Cette documentation

## 📝 Note d'Implémentation

La page `UsersPage.jsx` existe déjà avec des données statiques. Pour l'intégrer avec l'API :

1. **Importer le service** :
   ```javascript
   import { fetchUsers, deleteUser } from '../../services/userService';
   import Toast from '../../components/Toast';
   ```

2. **Remplacer les données statiques** :
   ```javascript
   const [users, setUsers] = useState([]);
   const [loading, setLoading] = useState(true);
   ```

3. **Ajouter useEffect pour charger** :
   ```javascript
   useEffect(() => {
     loadUsers();
   }, [filters]);
   ```

4. **Implémenter la pagination** :
   - Ajouter états `currentPage`, `itemsPerPage`, `totalItems`
   - Calculer offset : `(currentPage - 1) * itemsPerPage`

5. **Ajouter Toast pour notifications**

---

**Créé le:** 2026-01-05  
**Version:** 1.0  
**Auteur:** Antigravity AI
