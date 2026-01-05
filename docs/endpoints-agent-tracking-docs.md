# 📚 Nouveaux Endpoints Agent - Suivi, Notifications & Documents

## 🎯 Vue d'ensemble

Documentation complète des **derniers endpoints** pour la gestion des colis dans la vue **Agent**: historique de suivi, renvoi du code de retrait par SMS, et téléchargement de la feuille de route PDF.

---

## 📋 Liste des Nouveaux Endpoints

| Endpoint | Méthode | Description | Service |
|----------|---------|-------------|---------|
| `/api/v1/agent/shipments/{id}/events` | GET | Historique complet des événements | `fetchAgentShipmentEvents` |
| `/api/v1/agent/shipments/{id}/pickup-code/resend` | POST | Renvoyer le code de retrait par SMS | `resendPickupCode` |
| `/api/v1/agent/shipments/{id}/waybill.pdf` | GET | Télécharger la feuille de route PDF | `downloadWaybillPDF` |

---

## 1. 📜 Historique des événements de suivi

### Endpoint
**Méthode:** `GET`  
**URL:** `/api/v1/agent/shipments/{id}/events`  
**Authentification:** Requise (JWT Bearer Token)

### Description
Récupère l'historique complet des événements de suivi d'un colis. Permet de voir tous les changements de statut, déplacements et actions effectuées sur le colis.

### Paramètres de Route

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `id` | integer (path) | ✅ Oui | ID du colis |

### Exemple d'Utilisation

```bash
GET /api/v1/agent/shipments/10/events
```

### Réponse (200 - Liste des événements)

```json
[
  {
    "id": 1,
    "shipment_id": 10,
    "event_type": "CREATED",
    "status": "DEPOT",
    "description": "Colis créé et enregistré",
    "location": "Point Relais Dakar Plateau",
    "created_by": "Agent Ahmed",
    "created_at": "2025-01-05T10:00:00Z"
  },
  {
    "id": 2,
    "shipment_id": 10,
    "event_type": "STATUS_CHANGE",
    "status": "EN_CHARGE",
    "description": "Colis pris en charge",
    "location": "Point Relais Dakar Plateau",
    "created_by": "Agent Ahmed",
    "created_at": "2025-01-05T11:00:00Z"
  },
  {
    "id": 3,
    "shipment_id": 10,
    "event_type": "IN_TRANSIT",
    "status": "EN_COURS_DE_LIVRAISON",
    "description": "Colis en cours de livraison vers Thiès",
    "location": "Transporteur YK-TRANS-001",
    "created_by": "Transporteur Fatou",
    "created_at": "2025-01-05T14:00:00Z"
  }
]
```

### Structure d'un Événement

| Champ | Type | Description |
|-------|------|-------------|
| `id` | integer | ID de l'événement |
| `shipment_id` | integer | ID du colis |
| `event_type` | string | Type d'événement (CREATED, STATUS_CHANGE, IN_TRANSIT, DELIVERED, etc.) |
| `status` | string | Statut du colis au moment de l'événement |
| `description` | string | Description de l'événement |
| `location` | string | Localisation au moment de l'événement |
| `created_by` | string | Utilisateur ayant créé l'événement |
| `created_at` | string | Date et heure de l'événement |

### Codes de Réponse

| Code | Description |
|------|-------------|
| 200 | Liste des événements retournée avec succès |
| 401 | Non authentifié |
| 404 | Colis non trouvé |

### Implémentation Service

```javascript
import { fetchAgentShipmentEvents } from '../services/agentShipmentsService';

try {
  const events = await fetchAgentShipmentEvents(10);
  console.log('Historique:', events);
  // events = [{ id: 1, event_type: "CREATED", ... }, ...]
} catch (error) {
  if (error.message.includes('non trouvé')) {
    alert('Ce colis n\'existe pas');
  }
}
```

### Utilisation dans un Composant

```javascript
import { useState, useEffect } from 'react';
import { fetchAgentShipmentEvents } from '../services/agentShipmentsService';

function ShipmentTimeline({ shipmentId }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchAgentShipmentEvents(shipmentId);
        setEvents(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [shipmentId]);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="timeline">
      {events.map(event => (
        <div key={event.id} className="timeline-item">
          <div className="timeline-badge">
            {event.status}
          </div>
          <div className="timeline-content">
            <h4>{event.description}</h4>
            <p>📍 {event.location}</p>
            <p>👤 {event.created_by}</p>
            <p className="text-sm text-gray-500">
              {new Date(event.created_at).toLocaleString('fr-FR')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Cas d'Usage

1. **Historique de suivi**: Afficher tous les événements d'un colis dans une timeline
2. **Traçabilité**: Voir qui a effectué quelle action et quand
3. **Support client**: Répondre aux questions "Où est mon colis?"

---

## 2. 📱 Renvoyer le code de retrait par SMS

### Endpoint
**Méthode:** `POST`  
**URL:** `/api/v1/agent/shipments/{id}/pickup-code/resend`  
**Authentification:** Requise (JWT Bearer Token)

### Description
Renvoie le code de retrait par SMS au destinataire via **Africamobile**. Utile si le destinataire a perdu le SMS original ou ne l'a pas reçu.

### Paramètres de Route

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `id` | integer (path) | ✅ Oui | ID du colis |

### Exemple d'Utilisation

```bash
POST /api/v1/agent/shipments/10/pickup-code/resend
```

### Réponse (200 - Code renvoyé)

```json
{}
```

### Codes de Réponse

| Code | Description |
|------|-------------|
| 200 | Code renvoyé avec succès par SMS |
| 401 | Non authentifié |
| 404 | Colis non trouvé |

### Implémentation Service

```javascript
import { resendPickupCode } from '../services/agentShipmentsService';

const handleResendCode = async (shipmentId) => {
  try {
    await resendPickupCode(shipmentId);
    alert('✅ Code de retrait renvoyé par SMS!');
  } catch (error) {
    if (error.message.includes('non trouvé')) {
      alert('❌ Colis non trouvé');
    } else {
      alert('❌ Erreur: ' + error.message);
    }
  }
};
```

### Utilisation dans un Composant

```javascript
import { resendPickupCode } from '../services/agentShipmentsService';

function ResendCodeButton({ shipmentId }) {
  const [sending, setSending] = useState(false);

  const handleClick = async () => {
    if (!confirm('Renvoyer le code de retrait par SMS au destinataire?')) {
      return;
    }

    try {
      setSending(true);
      await resendPickupCode(shipmentId);
      alert('✅ SMS envoyé avec succès!');
    } catch (error) {
      alert('❌ Erreur: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={sending}
      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
    >
      {sending ? (
        <>
          <span className="animate-spin">⏳</span> Envoi...
        </>
      ) : (
        <>
          📱 Renvoyer le code SMS
        </>
      )}
    </button>
  );
}
```

### Cas d'Usage

1. **SMS perdu**: Le destinataire n'a pas reçu ou a supprimé le SMS
2. **Changement de numéro**: Le destinataire a changé de téléphone
3. **Code expiré**: Besoin de générer un nouveau code

---

## 3. 📄 Télécharger la feuille de route (Waybill PDF)

### Endpoint
**Méthode:** `GET`  
**URL:** `/api/v1/agent/shipments/{id}/waybill.pdf`  
**Authentification:** Requise (JWT Bearer Token)  
**Content-Type:** `application/pdf`

### Description
Génère et télécharge la feuille de route (waybill) en format PDF. Document officiel contenant toutes les informations du colis pour le transport.

### Paramètres de Route

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `id` | integer (path) | ✅ Oui | ID du colis |

### Exemple d'Utilisation

```bash
GET /api/v1/agent/shipments/10/waybill.pdf
```

### Réponse (200 - Fichier PDF généré)

**Content-Type:** `application/pdf`  
**Body:** Fichier PDF binaire

### Codes de Réponse

| Code | Description |
|------|-------------|
| 200 | PDF généré et retourné avec succès |
| 401 | Non authentifié |
| 404 | Colis non trouvé |

### Implémentation Service

```javascript
import { downloadWaybillPDF } from '../services/agentShipmentsService';

const handleDownloadPDF = async (shipmentId, trackingNumber) => {
  try {
    const blob = await downloadWaybillPDF(shipmentId);
    
    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waybill-${trackingNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    alert('✅ PDF téléchargé!');
  } catch (error) {
    alert('❌ Erreur: ' + error.message);
  }
};
```

### Utilisation dans un Composant

```javascript
import { downloadWaybillPDF } from '../services/agentShipmentsService';

function DownloadWaybillButton({ shipmentId, trackingNumber }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const blob = await downloadWaybillPDF(shipmentId);
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `waybill-${trackingNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Nettoyer
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
      alert('✅ Feuille de route téléchargée!');
    } catch (error) {
      alert('❌ Erreur: ' + error.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
    >
      {downloading ? (
        <>
          <span className="animate-spin">⏳</span> Téléchargement...
        </>
      ) : (
        <>
          📄 Télécharger PDF
        </>
      )}
    </button>
  );
}
```

### Contenu du PDF (Waybill)

Le PDF généré contient typiquement:

- **Numéro de suivi**: YK-2025-00001
- **Informations expéditeur**: Nom, téléphone, adresse
- **Informations destinataire**: Nom, téléphone, adresse
- **Détails du colis**: Poids, description
- **Code de retrait**: Code unique pour récupération
- **Points de départ/arrivée**: Localisations
- **Code-barres/QR code**: Pour scan rapide

### Cas d'Usage

1. **Impression**: Imprimer le document pour le joindre au colis
2. **Archivage**: Garder une copie pour les dossiers
3. **Transport**: Document officiel pour le transporteur

---

## 🚀 Workflows Utilisateur

### Workflow 1: Consulter l'historique

```
1. Agent ouvre les détails d'un colis
   ↓
2. Clique sur "Voir l'historique"
   ↓
3. API GET /api/v1/agent/shipments/{id}/events
   ↓
4. Affichage de la timeline avec tous les événements
   ↓
5. Agent peut voir:
   - Qui a fait quoi
   - Quand exactement
   - Où (localisation)
```

### Workflow 2: Renvoyer le code SMS

```
1. Destinataire appelle: "Je n'ai pas reçu le code"
   ↓
2. Agent recherche le colis
   ↓
3. Clique sur "Renvoyer le code SMS"
   ↓
4. Confirmation
   ↓
5. API POST /api/v1/agent/shipments/{id}/pickup-code/resend
   ↓
6. SMS envoyé via Africamobile
   ↓
7. Toast: "Code renvoyé avec succès"
   ↓
8. Destinataire reçoit le SMS
```

### Workflow 3: Imprimer la feuille de route

```
1. Nouveau colis créé
   ↓
2. Agent clique sur "Télécharger PDF"
   ↓
3. API GET /api/v1/agent/shipments/{id}/waybill.pdf
   ↓
4. PDF téléchargé automatiquement
   ↓
5. Agent imprime le PDF
   ↓
6. Feuille de route jointe au colis
```

---

## 🧪 Tests avec cURL

### Historique des événements

```bash
curl -X GET \
  'https://your-api.com/api/v1/agent/shipments/10/events' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Renvoyer le code de retrait

```bash
curl -X POST \
  'https://your-api.com/api/v1/agent/shipments/10/pickup-code/resend' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Télécharger le PDF

```bash
curl -X GET \
  'https://your-api.com/api/v1/agent/shipments/10/waybill.pdf' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  --output waybill.pdf
```

---

## ✅ Résumé des Fonctions Service

| Fonction | Endpoint | Méthode | Retour | Description |
|----------|----------|---------|--------|-------------|
| `fetchAgentShipmentEvents(id)` | `/{id}/events` | GET | Array | Liste des événements |
| `resendPickupCode(id)` | `/{id}/pickup-code/resend` | POST | Object | Confirmation d'envoi |
| `downloadWaybillPDF(id)` | `/{id}/waybill.pdf` | GET | Blob | Fichier PDF |

---

## 📁 Fichiers Modifiés

- ✅ `/src/services/agentShipmentsService.js` - 3 nouvelles fonctions ajoutées

---

## 🎯 Prochaines Étapes Suggérées

1. **Timeline interactive**: Afficher l'historique avec animations
2. **Bouton de renvoi**: Ajouter dans la page de détails
3. **Auto-print PDF**: Option pour imprimer automatiquement
4. **Statistiques**: Nombre de SMS renvoyés, PDFs générés

---

**Créé le:** 2026-01-05  
**Version:** 1.0  
**Auteur:** Antigravity AI
