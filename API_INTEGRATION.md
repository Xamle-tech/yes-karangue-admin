# Guide d'Intégration API - Yes Karangue Admin

Ce document décrit les endpoints API nécessaires pour intégrer le dashboard admin avec le backend Yes Karangue.

## 📡 Configuration Générale

### URL de Base
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
```

### Headers Requis
```javascript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
};
```

## 🔐 Authentification

### 1. Login
**Endpoint** : `POST /auth/login`

**Request** :
```json
{
  "email": "admin@yeskarangue.com",
  "password": "password123"
}
```

**Response** (200) :
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123",
      "email": "admin@yeskarangue.com",
      "name": "Admin",
      "role": "admin"
    }
  }
}
```

### 2. Refresh Token
**Endpoint** : `POST /auth/refresh`

**Request** :
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200) :
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Logout
**Endpoint** : `POST /auth/logout`

**Headers** : Authorization requerido

**Response** (200) :
```json
{
  "success": true,
  "message": "Logout successful"
}
```

## 📦 Gestion des Colis (Shipments)

### 1. Lister les Colis
**Endpoint** : `GET /shipments`

**Query Parameters** :
- `page` : número de página (default: 1)
- `limit` : colis par página (default: 20)
- `status` : filtre par statut (pending, in_transit, delivered, cancelled)
- `search` : recherche par ID ou numéro de suivi

**Response** (200) :
```json
{
  "success": true,
  "data": {
    "shipments": [
      {
        "id": "ship_123",
        "trackingNumber": "YK-2025-00001",
        "shipper": {
          "id": "shipper_1",
          "name": "Entreprise ABC",
          "email": "contact@abc.com"
        },
        "recipient": {
          "id": "user_456",
          "name": "Client XYZ",
          "phone": "+221 77 123 45 67"
        },
        "description": "Colis électronique",
        "weight": 2.5,
        "origin": "Dakar",
        "destination": "Thiès",
        "status": "in_transit",
        "stampFee": 5000,
        "stampStatus": "pending",
        "createdAt": "2025-01-15T10:30:00Z",
        "updatedAt": "2025-01-15T14:20:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 145,
      "totalPages": 8
    }
  }
}
```

### 2. Créer un Colis
**Endpoint** : `POST /shipments`

**Content-Type** : `multipart/form-data`

**Request** :
```
shipper: "shipper_1"
recipient: "user_456"
description: "Colis électronique"
weight: 2.5
origin: "Dakar"
destination: "Thiès"
stampFee: 5000
photo: <file binary>
```

**Response** (201) :
```json
{
  "success": true,
  "data": {
    "id": "ship_123",
    "trackingNumber": "YK-2025-00001",
    "status": "pending",
    "stampStatus": "pending",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

### 3. Modifier un Colis
**Endpoint** : `PUT /shipments/:id`

**Request** :
```json
{
  "description": "Colis électronique (TV)",
  "weight": 3.2,
  "stampFee": 6000
}
```

**Response** (200) :
```json
{
  "success": true,
  "data": { /* updated shipment */ }
}
```

### 4. Supprimer un Colis
**Endpoint** : `DELETE /shipments/:id`

**Response** (200) :
```json
{
  "success": true,
  "message": "Shipment deleted successfully"
}
```

### 5. Générer Feuille de Route
**Endpoint** : `POST /shipments/:id/generate-route-sheet`

**Response** (200) :
```json
{
  "success": true,
  "data": {
    "routeSheetId": "route_123",
    "pdf": "data:application/pdf;base64,...",
    "html": "<html>...</html>"
  }
}
```

### 6. Confirmer Paiement Timbre
**Endpoint** : `POST /shipments/:id/confirm-stamp-payment`

**Request** :
```json
{
  "paymentMethod": "cash|momo|bank",
  "reference": "PAY-123456"
}
```

**Response** (200) :
```json
{
  "success": true,
  "data": {
    "stampStatus": "paid",
    "confirmedAt": "2025-01-15T15:45:00Z"
  }
}
```

## 👥 Gestion des Expéditeurs (Shippers)

### 1. Lister les Expéditeurs
**Endpoint** : `GET /shippers`

**Query Parameters** :
- `page`, `limit`, `search`, `status`

**Response** (200) :
```json
{
  "success": true,
  "data": {
    "shippers": [
      {
        "id": "shipper_1",
        "name": "Entreprise ABC",
        "email": "contact@abc.com",
        "phone": "+221 77 123 45 67",
        "address": "Dakar, Sénégal",
        "registrationNumber": "SN123456",
        "status": "active",
        "createdAt": "2025-01-15T10:30:00Z"
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

### 2. Créer un Expéditeur
**Endpoint** : `POST /shippers`

**Request** :
```json
{
  "name": "Entreprise ABC",
  "email": "contact@abc.com",
  "phone": "+221 77 123 45 67",
  "address": "Dakar, Sénégal",
  "registrationNumber": "SN123456"
}
```

**Response** (201) :
```json
{
  "success": true,
  "data": { /* created shipper */ }
}
```

### 3. Modifier un Expéditeur
**Endpoint** : `PUT /shippers/:id`

**Response** (200) :
```json
{
  "success": true,
  "data": { /* updated shipper */ }
}
```

### 4. Supprimer un Expéditeur
**Endpoint** : `DELETE /shippers/:id`

**Response** (200) :
```json
{
  "success": true,
  "message": "Shipper deleted successfully"
}
```

## 🚚 Gestion des Transporteurs

### 1. Lister les Transporteurs
**Endpoint** : `GET /transporters`

**Response** (200) :
```json
{
  "success": true,
  "data": {
    "transporters": [
      {
        "id": "transporter_1",
        "name": "Transport ABC",
        "email": "contact@abc-transport.com",
        "phone": "+221 77 123 45 67",
        "vehicleType": "Voiture",
        "vehicleNumber": "SN-123-ABC",
        "rating": 4.8,
        "deliveries": 245,
        "totalEarnings": 5200000,
        "status": "active",
        "createdAt": "2025-01-10T10:30:00Z"
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

### 2. Créer un Transporteur
**Endpoint** : `POST /transporters`

**Request** :
```json
{
  "name": "Transport ABC",
  "email": "contact@abc-transport.com",
  "phone": "+221 77 123 45 67",
  "vehicleType": "Voiture",
  "vehicleNumber": "SN-123-ABC"
}
```

### 3. Modifier un Transporteur
**Endpoint** : `PUT /transporters/:id`

### 4. Supprimer un Transporteur
**Endpoint** : `DELETE /transporters/:id`

## 👨‍💼 Gestion des Utilisateurs & Points

### 1. Lister les Utilisateurs
**Endpoint** : `GET /users`

**Response** (200) :
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_1",
        "name": "Mama Diallo",
        "email": "mama@example.com",
        "phone": "+221 77 123 45 67",
        "role": "client",
        "credits": 15000,
        "status": "active",
        "createdAt": "2025-01-01T10:30:00Z",
        "point": {
          "id": "point_1",
          "name": "Point Dakar Centre",
          "location": "Dakar"
        }
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

### 2. Créer un Utilisateur
**Endpoint** : `POST /users`

**Request** :
```json
{
  "name": "Mama Diallo",
  "email": "mama@example.com",
  "phone": "+221 77 123 45 67",
  "role": "client",
  "password": "securePassword123",
  "point": {
    "name": "Point Dakar Centre",
    "location": "Dakar"
  }
}
```

### 3. Modifier un Utilisateur
**Endpoint** : `PUT /users/:id`

### 4. Supprimer un Utilisateur
**Endpoint** : `DELETE /users/:id`

## 📊 Tableau de Bord (Dashboard)

### 1. Statistiques Globales
**Endpoint** : `GET /stats/overview`

**Response** (200) :
```json
{
  "success": true,
  "data": {
    "shipmentsInTransit": 24,
    "activeUsers": 1248,
    "monthlyRevenue": 2400000,
    "reportedIssues": 3
  }
}
```

### 2. Données Mensuelles
**Endpoint** : `GET /stats/monthly?months=6`

**Response** (200) :
```json
{
  "success": true,
  "data": [
    {
      "month": "January",
      "shipments": 65,
      "users": 240,
      "revenue": 500000
    },
    /* ... more months ... */
  ]
}
```

### 3. Distribution des Statuts
**Endpoint** : `GET /stats/shipment-status-distribution`

**Response** (200) :
```json
{
  "success": true,
  "data": {
    "delivered": 45,
    "inTransit": 30,
    "pending": 15,
    "cancelled": 10
  }
}
```

### 4. Colis Récents
**Endpoint** : `GET /shipments/recent?limit=10`

### 5. Meilleurs Transporteurs
**Endpoint** : `GET /transporters/top?limit=5`

## ⚙️ Paramètres

### 1. Obtenir les Paramètres
**Endpoint** : `GET /settings`

**Response** (200) :
```json
{
  "success": true,
  "data": {
    "appName": "Yes Karangue",
    "timezone": "Africa/Dakar",
    "currency": "FCFA",
    "maxShipmentWeight": 50,
    "stampFeePerKg": 500,
    "commissionPercentage": 5,
    "maintenanceMode": false
  }
}
```

### 2. Mettre à Jour les Paramètres
**Endpoint** : `PUT /settings`

**Request** :
```json
{
  "appName": "Yes Karangue",
  "timezone": "Africa/Dakar",
  "maxShipmentWeight": 50,
  "stampFeePerKg": 500,
  "commissionPercentage": 5
}
```

## 🔄 Upload de Fichiers

### Upload de Photo de Colis
**Endpoint** : `POST /upload/shipment-photo`

**Content-Type** : `multipart/form-data`

**Request** :
```
file: <image file binary>
shipmentId: "ship_123"
```

**Response** (200) :
```json
{
  "success": true,
  "data": {
    "fileId": "file_123",
    "url": "https://cdn.yeskarangue.com/uploads/ship_123/photo.jpg",
    "size": 204800,
    "mimeType": "image/jpeg"
  }
}
```

## ❌ Gestion des Erreurs

Tous les endpoints retournent une structure d'erreur cohérente :

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is invalid",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Codes d'Erreur Courants
- `VALIDATION_ERROR` (400) : Validation échouée
- `UNAUTHORIZED` (401) : Token manquant ou invalide
- `FORBIDDEN` (403) : Permissions insuffisantes
- `NOT_FOUND` (404) : Ressource non trouvée
- `CONFLICT` (409) : Duplication de données
- `SERVER_ERROR` (500) : Erreur serveur

## 🔑 Permissions & Rôles

### Rôles
- **admin** : Accès complet à tous les endpoints
- **agent** : Accès à shipments, users, settings (lecture)
- **point_manager** : Accès limité à sa branche

### Exemple de Vérification
```javascript
// Dans chaque endpoint
const userRole = req.user.role;
if (!['admin', 'agent'].includes(userRole)) {
  return res.status(403).json({ error: 'Forbidden' });
}
```

## 🧪 Tester les APIs

### Avec cURL
```bash
curl -X GET http://localhost:3000/api/shipments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Avec Postman
1. Importer la collection depuis `/docs/postman-collection.json`
2. Configurer l'environnement avec l'URL et le token
3. Exécuter les requêtes

### Avec insomnia
Similaire à Postman, importer la collection

## 📚 Ressources Additionnelles

- API Docs complète : `/api/docs`
- Swagger UI : `http://localhost:3000/api/docs`
- GraphQL Schema : `http://localhost:3000/graphql/schema`

---

**Version** : 1.0.0  
**Dernière mise à jour** : Janvier 2025  
**Maintenu par** : Yes Karangue Team

