# 📚 Nouveaux Endpoints Agent - Gestion Avancée des Colis

## 🎯 Vue d'ensemble

Documentation complète des **nouveaux endpoints** pour la gestion avancée des colis dans la vue **Agent**: recherche par numéro de suivi, mise à jour du statut, et réception au point de destination.

---

## 📋 Liste des Nouveaux Endpoints

| Endpoint | Méthode | Description | Service |
|----------|---------|-------------|---------|
| `/api/v1/agent/shipments/lookup` | GET | Rechercher un colis par numéro de suivi | `lookupAgentShipment` |
| `/api/v1/agent/shipments/{id}/status` | POST | Mettre à jour le statut d'un colis | `updateAgentShipmentStatus` |
| `/api/v1/agent/shipments/{id}/receive` | POST | Marquer un colis comme reçu à destination | `receiveAgentShipment` |

---

## 1. 🔍 Rechercher un colis par numéro de suivi

### Endpoint
**Méthode:** `GET`  
**URL:** `/api/v1/agent/shipments/lookup`  
**Authentification:** Requise (JWT Bearer Token)

### Description
Recherche un colis par son numéro de suivi. Utile pour un scan rapide ou une recherche directe.

### Paramètres de Requête (Query Parameters)

| Paramètre | Type | Requis | Description | Exemple |
|-----------|------|--------|-------------|---------|
| `q` | string (query) | ✅ Oui | Numéro de suivi à rechercher | `?q=YK-2025-00001` |

### Exemples d'Utilisation

```bash
GET /api/v1/agent/shipments/lookup?q=YK-2025-00001
```

### Réponse (200 - Colis trouvé)

```json
{
  "id": 5,
  "tracking_number": "YK-2025-00001",
  "sender_full_name": "Ahmed Diallo",
  "sender_phone": "+221771234567",
  "recipient_full_name": "Fatou Sall",
  "recipient_phone": "+221782345678",
  "status": "DEPOT",
  "created_at": "2025-01-05T10:00:00Z"
}
```

### Codes de Réponse

| Code | Description |
|------|-------------|
| 200 | Colis trouvé avec succès |
| 401 | Non authentifié |
| 404 | Colis introuvable |

### Réponse d'Erreur (404)

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Colis introuvable",
    "details": []
  }
}
```

### Implémentation Service

```javascript
import { lookupAgentShipment } from '../services/agentShipmentsService';

try {
  const shipment = await lookupAgentShipment('YK-2025-00001');
  console.log('Colis trouvé:', shipment);
} catch (error) {
  if (error.message.includes('introuvable')) {
    alert('Ce numéro de suivi n\'existe pas');
  }
}
```

### Cas d'Usage

1. **Scanner de code-barres**: Scan du QR code et recherche instantanée
2. **Recherche rapide**: Agent tape le numéro de suivi pour accéder aux détails
3. **Vérification**: Confirmer qu'un colis existe avant une opération

---

## 2. 🔄 Mettre à jour le statut d'un colis

### Endpoint
**Méthode:** `POST`  
**URL:** `/api/v1/agent/shipments/{id}/status`  
**Authentification:** Requise (JWT Bearer Token)  
**Content-Type:** `application/json`

### Description
Met à jour le statut d'un colis (ex: PRIS_EN_CHARGE, EN_COURS_DE_LIVRAISON, etc.).

### Paramètres

#### Route Parameter
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `id` | integer (path) | ✅ Oui | ID du colis |

#### Request Body
| Champ | Type | Requis | Description | Exemple |
|-------|------|--------|-------------|---------|
| `new_status` | string | ✅ Oui | Nouveau statut | `"CHILD_EN_CHARGE"` |
| `event_time` | string | ❌ Non | Date/heure de l'événement (ISO 8601) | `"2026-01-05T17:28:46.793Z"` |

### Statuts Possibles

| Statut | Description |
|--------|-------------|
| `DEPOT` | Colis en dépôt |
| `CHILD_EN_CHARGE` | Pris en charge |
| `EN_CHARGE` | En charge |
| `EN_COURS_DE_LIVRAISON` | En cours de livraison |
| `ARRIVE_A_DESTINATION` | Arrivé à destination |
| `LIVRE` | Livré |
| `RETOUR` | Retour |

### Exemple de Requête

```javascript
POST /api/v1/agent/shipments/10/status

Body:
{
  "new_status": "CHILD_EN_CHARGE",
  "event_time": "2026-01-05T17:28:46.793Z"
}
```

### Réponse (200 - Statut mis à jour)

```json
{}
```

### Codes de Réponse

| Code | Description |
|------|-------------|
| 200 | Statut mis à jour avec succès |
| 401 | Non authentifié |
| 404 | Colis non trouvé |
| 422 | Erreur de validation (champ manquant ou invalide) |

### Réponse d'Erreur (422 - Validation)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Erreur de validation",
    "details": {
      "errors": {
        "field": [
          "Le champ email est requis."
        ]
      }
    }
  }
}
```

### Implémentation Service

```javascript
import { updateAgentShipmentStatus } from '../services/agentShipmentsService';

const handleUpdateStatus = async (shipmentId) => {
  try {
    await updateAgentShipmentStatus(shipmentId, {
      new_status: 'EN_CHARGE',
      event_time: new Date().toISOString()
    });
    
    alert('Statut mis à jour avec succès!');
  } catch (error) {
    if (error.message.includes('validation')) {
      alert('Erreur: statut invalide');
    } else {
      alert('Erreur: ' + error.message);
    }
  }
};
```

### Cas d'Usage

1. **Prise en charge**: Agent scanne et marque comme "PRIS_EN_CHARGE"
2. **Suivi en temps réel**: Mise à jour au fur et à mesure du trajet
3. **Arrivée à destination**: Marquer comme "ARRIVE_A_DESTINATION"

---

## 3. 📦 Marquer un colis comme reçu à destination

### Endpoint
**Méthode:** `POST`  
**URL:** `/api/v1/agent/shipments/{id}/receive`  
**Authentification:** Requise (JWT Bearer Token)  
**Content-Type:** `application/json`

### Description
Marque un colis comme arrivé au point de destination. Utilisé quand un colis arrive au point relais de destination.

### Paramètres

#### Route Parameter
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `id` | integer (path) | ✅ Oui | ID du colis |

#### Request Body
| Champ | Type | Requis | Description | Exemple |
|-------|------|--------|-------------|---------|
| `destination_point_id` | integer | ✅ Oui | ID du point de destination | `9` |
| `received_at` | string | ✅ Oui | Date/heure de réception (ISO 8601) | `"2026-01-05T17:29:38.694Z"` |

### Exemple de Requête

```javascript
POST /api/v1/agent/shipments/10/receive

Body:
{
  "destination_point_id": 9,
  "received_at": "2026-01-05T17:29:38.694Z"
}
```

### Réponse (200 - Colis marqué comme arrivé)

```json
{}
```

### Codes de Réponse

| Code | Description |
|------|-------------|
| 200 | Colis marqué comme arrivé avec succès |
| 401 | Non authentifié |
| 404 | Colis non trouvé |
| 422 | Erreur de validation |

### Implémentation Service

```javascript
import { receiveAgentShipment } from '../services/agentShipmentsService';

const handleReceiveShipment = async (shipmentId, pointId) => {
  try {
    await receiveAgentShipment(shipmentId, {
      destination_point_id: pointId,
      received_at: new Date().toISOString()
    });
    
    alert('Colis marqué comme reçu!');
  } catch (error) {
    alert('Erreur: ' + error.message);
  }
};
```

### Cas d'Usage

1. **Arrivée au point relais**: Agent scanne et marque comme reçu
2. **Traçabilité**: Enregistrement précis de l'heure d'arrivée
3. **Notification**: Peut déclencher une notification au destinataire

---

## 🚀 Workflows Utilisateur

### Workflow 1: Recherche rapide par scan

```
1. Agent scanne le code-barres du colis
   ↓
2. Système récupère le numéro de suivi (YK-2025-00001)
   ↓
3. Appel API GET /api/v1/agent/shipments/lookup?q=YK-2025-00001
   ↓
4. Si 200: Affichage des détails du colis
   Si 404: Message "Colis introuvable"
```

### Workflow 2: Mise à jour du statut

```
1. Agent identifie un colis
   ↓
2. Sélectionne le nouveau statut (ex: "EN_CHARGE")
   ↓
3. Appel API POST /api/v1/agent/shipments/{id}/status
   Body: { new_status: "EN_CHARGE", event_time: "..." }
   ↓
4. Si 200: Toast "Statut mis à jour"
   Si 422: Toast "Statut invalide"
   Si 404: Toast "Colis non trouvé"
```

### Workflow 3: Réception au point de destination

```
1. Colis arrive au point relais de destination
   ↓
2. Agent scanne le colis
   ↓
3. Système identifie le point de destination
   ↓
4. Appel API POST /api/v1/agent/shipments/{id}/receive
   Body: { destination_point_id: 9, received_at: "..." }
   ↓
5. Si 200: Toast "Colis reçu avec succès"
   Notification envoyée au destinataire
```

---

## 💻 Exemples d'Utilisation dans un Composant

### Composant Scanner

```javascript
import { useState } from 'react';
import { lookupAgentShipment } from '../services/agentShipmentsService';

function ShipmentScanner() {
  const [scanning, setScanning] = useState(false);
  const [shipment, setShipment] = useState(null);

  const handleScan = async (trackingNumber) => {
    try {
      setScanning(true);
      const data = await lookupAgentShipment(trackingNumber);
      setShipment(data);
    } catch (error) {
      if (error.message.includes('introuvable')) {
        alert('Colis introuvable');
      }
    } finally {
      setScanning(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Scanner ou taper le n° de suivi"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleScan(e.target.value);
          }
        }}
      />
      {scanning && <p>Recherche...</p>}
      {shipment && (
        <div>
          <h3>{shipment.tracking_number}</h3>
          <p>Statut: {shipment.status}</p>
        </div>
      )}
    </div>
  );
}
```

### Composant Mise à Jour Statut

```javascript
import { updateAgentShipmentStatus } from '../services/agentShipmentsService';

function StatusUpdater({ shipmentId }) {
  const statuses = [
    { value: 'DEPOT', label: 'En dépôt' },
    { value: 'CHILD_EN_CHARGE', label: 'Pris en charge' },
    { value: 'EN_CHARGE', label: 'En charge' },
    { value: 'EN_COURS_DE_LIVRAISON', label: 'En cours de livraison' },
  ];

  const handleUpdateStatus = async (newStatus) => {
    try {
      await updateAgentShipmentStatus(shipmentId, {
        new_status: newStatus,
        event_time: new Date().toISOString()
      });
      alert('Statut mis à jour!');
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  return (
    <div>
      <h3>Mettre à jour le statut:</h3>
      {statuses.map(status => (
        <button
          key={status.value}
          onClick={() => handleUpdateStatus(status.value)}
        >
          {status.label}
        </button>
      ))}
    </div>
  );
}
```

---

## 🧪 Tests avec cURL

### Rechercher un colis

```bash
curl -X GET \
  'https://your-api.com/api/v1/agent/shipments/lookup?q=YK-2025-00001' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Mettre à jour le statut

```bash
curl -X POST \
  'https://your-api.com/api/v1/agent/shipments/10/status' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "new_status": "EN_CHARGE",
    "event_time": "2026-01-05T17:28:46.793Z"
  }'
```

### Marquer comme reçu

```bash
curl -X POST \
  'https://your-api.com/api/v1/agent/shipments/10/receive' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "destination_point_id": 9,
    "received_at": "2026-01-05T17:29:38.694Z"
  }'
```

---

## ✅ Résumé des Fonctions Service

| Fonction | Endpoint | Méthode | Description |
|----------|----------|---------|-------------|
| `lookupAgentShipment(trackingNumber)` | `/lookup?q=...` | GET | Recherche par numéro |
| `updateAgentShipmentStatus(id, data)` | `/{id}/status` | POST | Mise à jour statut |
| `receiveAgentShipment(id, data)` | `/{id}/receive` | POST | Marquer comme reçu |

---

## 📁 Fichiers Modifiés

- ✅ `/src/services/agentShipmentsService.js` - 3 nouvelles fonctions ajoutées

---

## 🎯 Prochaines Étapes Suggérées

1. **Scanner QR/Code-barres**: Intégrer avec les nouvelles fonctions lookup
2. **Boutons de mise à jour rapide**: Interface pour changer le statut en un clic
3. **Historique de tracking**: Afficher tous les changements de statut
4. **Notifications**: Alerter le destinataire quand le colis arrive

---

**Créé le:** 2026-01-05  
**Version:** 1.0  
**Auteur:** Antigravity AI
