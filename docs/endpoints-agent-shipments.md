# 📚 Endpoints Agent - Gestion des Colis (Shipments)

## 🎯 Vue d'ensemble

Documentation complète des endpoints pour gérer les **colis (shipments)** dans la vue **Agent** de l'application YES Karangue.

---

## 📋 Liste des Endpoints

| Endpoint | Méthode | Description | Service |
|----------|---------|-------------|---------|
| `/api/v1/agent/shipments` | POST | Créer un nouveau colis | `createAgentShipment` |
| `/api/v1/agent/shipments` | GET | Liste des colis avec filtres | `fetchAgentShipments` |
| `/api/v1/agent/shipments/{id}` | GET | Détails d'un colis | `fetchAgentShipmentById` |

---

## 1. 📦 Créer un nouveau colis

### Endpoint
**Méthode:** `POST`  
**URL:** `/api/v1/agent/shipments`  
**Authentification:** Requise (JWT Bearer Token)  
**Content-Type:** `multipart/form-data`

### Description
Crée un nouveau colis avec les informations de l'expéditeur et du destinataire. Un SMS avec le code de retrait est envoyé automatiquement au destinataire via Africamobile.

### Paramètres Request Body

#### Informations Expéditeur (requis)
| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `sender_full_name` | string | ✅ Oui | Nom complet de l'expéditeur |
| `sender_phone` | string | ✅ Oui | Numéro de téléphone |
| `sender_address` | string | ✅ Oui | Adresse complète |
| `sender_id_type` | string | ❌ Non | Type de pièce d'identité |
| `sender_id_number` | string | ❌ Non | Numéro de pièce d'identité |

#### Informations Destinataire (requis)
| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `recipient_full_name` | string | ✅ Oui | Nom complet du destinataire |
| `recipient_phone` | string | ✅ Oui | Numéro de téléphone |
| `recipient_address` | string | ✅ Oui | Adresse complète |

#### Informations Colis (requis)
| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `content_description` | string | ✅ Oui | Description du contenu |
| `weight_kg` | number (float) | ✅ Oui | Poids en kilogrammes |
| `stamp_box_fdfs` | integer | ❌ Non | Cachet boîte FDFS |
| `transporter_id` | integer | ❌ Non | ID du transporteur |

#### Fichiers (photos)
| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `package_photo` | file (binary) | ✅ Oui | Photo du colis |
| `sender_id_front` | file (binary) | ❌ Non | Photo recto pièce d'identité |
| `sender_id_back` | file (binary) | ❌ Non | Photo verso pièce d'identité |

### Exemple de Requête

```javascript
const formData = new FormData();

// Expéditeur
formData.append('sender_full_name', 'Ahmed Diallo');
formData.append('sender_phone', '+221771234567');
formData.append('sender_address', 'Dakar, Plateau');

// Destinataire
formData.append('recipient_full_name', 'Fatou Sall');
formData.append('recipient_phone', '+221782345678');
formData.append('recipient_address', 'Thiès, Centre');

// Colis
formData.append('content_description', 'Documents administratifs');
formData.append('weight_kg', 2.5);

// Photos
formData.append('package_photo', fileInputPackage.files[0]);
formData.append('sender_id_front', fileInputFront.files[0]);

const response = await createAgentShipment(formData);
```

### Réponse (201 - Succès)

```json
{
  "shipment_id": 5,
  "tracking_number": "YK-2025-00001",
  "status": "true"
}
```

### Structure de Réponse

| Champ | Type | Description |
|-------|------|-------------|
| `shipment_id` | integer | ID unique du colis créé |
| `tracking_number` | string | Numéro de suivi généré (ex: YK-2025-00001) |
| `status` | boolean/string | Statut de création (true si succès) |

### Codes de Réponse

| Code | Description |
|------|-------------|
| 201 | Colis créé avec succès. SMS envoyé automatiquement |
| 401 | Non authentifié |
| 422 | Erreur de validation (champs manquants) |

### Implémentation Service

```javascript
import { createAgentShipment } from '../services/agentShipmentsService';

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('sender_full_name', senderName);
  formData.append('sender_phone', senderPhone);
  formData.append('sender_address', senderAddress);
  formData.append('recipient_full_name', recipientName);
  formData.append('recipient_phone', recipientPhone);
  formData.append('recipient_address', recipientAddress);
  formData.append('content_description', description);
  formData.append('weight_kg', weight);
  formData.append('package_photo', packagePhoto);

  try {
    const result = await createAgentShipment(formData);
    alert(`Colis créé! Numéro de suivi: ${result.tracking_number}`);
  } catch (error) {
    alert('Erreur: ' + error.message);
  }
};
```

---

## 2. 📋 Liste des colis

### Endpoint
**Méthode:** `GET`  
**URL:** `/api/v1/agent/shipments`  
**Authentification:** Requise (JWT Bearer Token)

### Description
Récupère la liste des colis avec filtres optionnels.

### Paramètres de Requête (Query Parameters)

| Paramètre | Type | Description | Exemple |
|-----------|------|-------------|---------  |
| `status` | string | Filtrer par statut | `?status=DEPOT` |
| `tracking_number` | string | Rechercher par numéro de suivi | `?tracking_number=YK-2025-00001` |

### Valeurs Possibles pour `status`

| Valeur | Description |
|--------|-------------|
| `DEPOT` | Colis en dépôt |
| `EN_COURS` | En cours de livraison |
| `LIVRE` | Livré |

### Exemples d'Utilisation

#### Liste complète
```bash
GET /api/v1/agent/shipments
```

#### Filtrer par statut
```bash
GET /api/v1/agent/shipments?status=DEPOT
```

#### Rechercher par numéro de suivi
```bash
GET /api/v1/agent/shipments?tracking_number=YK-2025-00001
```

### Réponse (200)

```json
[
  {
    "id": 5,
    "tracking_number": "YK-2025-00001",
    "sender_full_name": "Ahmed Diallo",
    "sender_phone": "+221771234567",
    "sender_address": "Dakar, Plateau",
    "recipient_full_name": "Fatou Sall",
    "recipient_phone": "+221782345678",
    "recipient_address": "Thiès, Centre",
    "content_description": "Documents",
    "weight_kg": 2.5,
    "status": "DEPOT",
    "created_at": "2025-01-05T10:00:00Z"
  }
]
```

### Codes de Réponse

| Code | Description |
|------|-------------|
| 200 | Liste retournée avec succès |
| 401 | Non authentifié |

### Implémentation

```javascript
import { fetchAgentShipments } from '../services/agentShipmentsService';

// Liste complète
const shipments = await fetchAgentShipments();

// Avec filtres
const depotShipments = await fetchAgentShipments({ status: 'DEPOT' });

// Recherche par numéro
const found = await fetchAgentShipments({ tracking_number: 'YK-2025-00001' });
```

---

## 3. 👁️ Détails d'un colis

### Endpoint
**Méthode:** `GET`  
**URL:** `/api/v1/agent/shipments/{id}`  
**Authentification:** Requise (JWT Bearer Token)

### Description
Récupère les détails complets d'un colis par son ID.

### Paramètres de Route

| Paramètre | Type | Description | Requis |
|-----------|------|-------------|---------|
| `id` | integer (path) | ID du colis | ✅ Oui |

### Exemple d'Utilisation

```bash
GET /api/v1/agent/shipments/5
```

### Réponse (200)

```json
{
  "id": 5,
  "tracking_number": "YK-2025-00001",
  "sender_full_name": "Ahmed Diallo",
  "sender_phone": "+221771234567",
  "sender_address": "Dakar, Plateau",
  "sender_id_type": "CNI",
  "sender_id_number": "123456789",
  "recipient_full_name": "Fatou Sall",
  "recipient_phone": "+221782345678",
  "recipient_address": "Thiès, Centre",
  "content_description": "Documents administratifs",
  "weight_kg": 2.5,
  "stamp_box_fdfs": 1,
  "transporter_id": 3,
  "status": "DEPOT",
  "created_at": "2025-01-05T10:00:00Z",
  "updated_at": "2025-01-05T12:00:00Z"
}
```

### Codes de Réponse

| Code | Description |
|------|-------------|
| 200 | Détails retournés avec succès |
| 401 | Non authentifié |
| 404 | Colis non trouvé |

### Réponse d'Erreur (404)

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Colis non trouvé",
    "details": []
  }
}
```

### Implémentation

```javascript
import { fetchAgentShipmentById } from '../services/agentShipmentsService';

try {
  const shipment = await fetchAgentShipmentById(5);
  console.log(shipment);
} catch (error) {
  if (error.message.includes('non trouvé')) {
    alert('Ce colis n\'existe pas');
  }
}
```

---

## 📁 Fichiers Créés

### Services
- ✅ `/src/services/agentShipmentsService.js` - Service pour les colis agent

### Pages
- ✅ `/src/pages/agent/AgentShipmentsPage.jsx` - Page liste des colis

### Documentation
- ✅ `/docs/endpoints-agent-shipments.md` - Ce fichier

---

## 🚀 Workflows Utilisateur

### Workflow 1: Créer un nouveau colis

```
1. Agent clique sur "Nouveau colis"
   ↓
2. Formulaire s'ouvre avec tous les champs
   ↓
3. Agent remplit les informations expéditeur/destinataire
   ↓
4. Agent upload la photo du colis
   ↓
5. Validation et soumission
   ↓
6. POST /api/v1/agent/shipments (multipart/form-data)
   ↓
7. Réponse avec tracking_number (ex: YK-2025-00001)
   ↓
8. SMS automatique envoyé au destinataire
   ↓
9. Toast de succès avec numéro de suivi
   ↓
10. Liste rechargée
```

### Workflow 2: Voir la liste des colis

```
1. Agent accède à /agent/shipments
   ↓
2. Appel API GET /api/v1/agent/shipments
   ↓
3. Affichage de la liste dans un tableau
   ↓
4. Agent peut filtrer par statut (DEPOT, EN_COURS, LIVRE)
   ↓
5. Agent peut rechercher par numéro de suivi
```

### Workflow 3: Voir les détails d'un colis

```
1. Agent clique sur l'icône "Œil" 👁️
   ↓
2. Appel API GET /api/v1/agent/shipments/{id}
   ↓
3. Modal s'affiche avec toutes les informations
   ↓
4. Affichage expéditeur, destinataire, contenu, poids, statut
```

---

## 🧪 Tests avec cURL

### Créer un colis

```bash
curl -X POST \
  'https://your-api.com/api/v1/agent/shipments' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -F 'sender_full_name=Ahmed Diallo' \
  -F 'sender_phone=+221771234567' \
  -F 'sender_address=Dakar, Plateau' \
  -F 'recipient_full_name=Fatou Sall' \
  -F 'recipient_phone=+221782345678' \
  -F 'recipient_address=Thiès, Centre' \
  -F 'content_description=Documents' \
  -F 'weight_kg=2.5' \
  -F 'package_photo=@/path/to/photo.jpg'
```

### Liste des colis

```bash
curl -X GET \
  'https://your-api.com/api/v1/agent/shipments?status=DEPOT' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Détails d'un colis

```bash
curl -X GET \
  'https://your-api.com/api/v1/agent/shipments/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## ✅ Checklist d'Intégration

- ✅ Service `agentShipmentsService.js` créé
- ✅ Fonction `createAgentShipment` avec FormData
- ✅ Fonction `fetchAgentShipments` avec filtres
- ✅ Fonction `fetchAgentShipmentById`
- ✅ Page `AgentShipmentsPage.jsx` créée
- ✅ Liste avec tableau
- ✅ Filtres par statut
- ✅ Recherche par numéro de suivi
- ✅ Modal de détails
- ✅ Statistiques (Total, Dépôt, En cours, Livrés)
- ✅ Toast de notifications
- ✅ Loaders pendant chargements
- ✅ Documentation complète

---

**Créé le:** 2026-01-05  
**Version:** 1.0  
**Auteur:** Antigravity AI
