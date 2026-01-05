# 📝 Endpoint - Créer un Utilisateur

## 📋 Aperçu

Endpoint pour créer un nouvel utilisateur avec invitation automatique par email. L'utilisateur recevra un email pour définir son mot de passe (set-password flow).

## 🔌 Endpoint API

**Méthode:** `POST`  
**URL:** `/api/v1/admin/users`  
**Authentification:** Requise (JWT Bearer Token)  
**Content-Type:** `application/json`

### Body de la Requête

```json
{
  "full_name": "Moussa Ndiaye",
  "email": "moussa@example.com",
  "phone": "+221771234567",
  "role": "AGENT",
  "relay_point_id": "rp_1"
}
```

### Champs Requis

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| `full_name` | string | Nom complet de l'utilisateur | Requis, non vide |
| `email` | string | Adresse email unique | Requis, format email valide |
| `phone` | string | Numéro de téléphone unique | Requis, format international recommandé |
| `role` | string | Rôle de l'utilisateur | Requis, voir valeurs possibles |
| `relay_point_id` | string/integer | ID du point relais | Optionnel (requis pour agent/manager) |

### Valeurs Possibles pour `role`

| Valeur | Label | Description |
|--------|-------|-------------|
| `client` | Client | Utilisateur client standard |
| `agent` | Agent | Agent d'un point relais |
| `admin` | Administrateur | Administrateur système |
| `carrier` | Transporteur | Livreur/Transporteur |
| `MANAGER` | Manager | Gestionnaire de point relais |

## 📤 Réponses

### Succès (201)

```json
{
  "id": 15,
  "full_name": "Moussa Ndiaye",
  "email": "moussa@example.com",
  "phone": "+221771234567",
  "role": "AGENT",
  "relay_point_id": "rp_1",
  "status": "pending",
  "created_at": "2026-01-05T12:54:00Z"
}
```

**Note:** Le statut initial est `pending` jusqu'à ce que l'utilisateur définisse son mot de passe.

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

### Erreur 409 - Email ou Téléphone Déjà Utilisé

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Email ou téléphone déjà utilisé",
    "details": []
  }
}
```

### Erreur 422 - Validation

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

## 🎯 Flow d'Invitation

```
1. Admin crée l'utilisateur via POST /admin/users
   ↓
2. Backend crée le compte avec status "pending"
   ↓
3. Backend génère un token d'invitation unique
   ↓
4. Backend envoie un email avec lien set-password
   ↓
5. Utilisateur clique sur le lien
   ↓
6. Utilisateur définit son mot de passe
   ↓
7. Status passe à "active"
   ↓
8. Utilisateur peut se connecter
```

## 🛠️ Implémentation

### Service (`userService.js`)

La fonction `createUser` est déjà implémentée :

```javascript
import { createUser } from '../services/userService';

try {
  const newUser = await createUser({
    full_name: "Moussa Ndiaye",
    email: "moussa@example.com",
    phone: "+221771234567",
    role: "AGENT",
    relay_point_id: "rp_1"
  });
  
  console.log('Utilisateur créé:', newUser);
  // Afficher un message de succès
} catch (error) {
  console.error('Erreur:', error.message);
  // Gérer l'erreur (409, 422, etc.)
}
```

### Utilisation dans React Component

```javascript
import { useState } from 'react';
import { createUser } from '../../services/userService';
import UserForm from '../../components/forms/UserForm';
import Toast from '../../components/Toast';

export default function UsersPage() {
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);

  const handleCreateUser = async (formData) => {
    try {
      await createUser(formData);
      
      setToast({
        message: `${formData.full_name} a été créé avec succès. Un email d'invitation a été envoyé.`,
        type: 'success'
      });
      
      setShowForm(false);
      await loadUsers(); // Recharger la liste
    } catch (error) {
      let errorMessage = 'Une erreur est survenue';
      let toastType = 'error';
      
      if (error.message.includes('409') || error.message.includes('déjà utilisé')) {
        errorMessage = 'Cet email ou téléphone est déjà utilisé';
        toastType = 'warning';
      } else if (error.message.includes('422') || error.message.includes('validation')) {
        errorMessage = error.message;
        toastType = 'warning';
      } else {
        errorMessage = error.message;
      }
      
      setToast({
        message: errorMessage,
        type: toastType
      });
      
      throw error; // Pour que le formulaire puisse aussi gérer l'erreur
    }
  };

  return (
    <div>
      <button onClick={() => setShowForm(true)}>
        Ajouter un utilisateur
      </button>

      {showForm && (
        <UserForm
          onSubmit={handleCreateUser}
          onClose={() => setShowForm(false)}
        />
      )}

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

## 📋 Formulaire UserForm Component

Le composant `UserForm` a été créé avec :

### Champs

1. **Nom complet** (texte)
   - Placeholder: "John Doe"
   - Validation: requis, non vide

2. **Email** (email)
   - Placeholder: "utilisateur@example.com"
   - Validation: requis, format email valide

3. **Téléphone** (tel)
   - Placeholder: "+221 77 123 45 67"
   - Validation: requis, 10-15 chiffres

4. **Rôle** (select)
   - Options: Client, Agent, Admin, Transporteur, Manager
   - Validation: requis

5. **ID Point relais** (texte, optionnel)
   - Placeholder: "rp_1"
   - Note: Requis pour Agent et Manager

### Caractéristiques

- ✅ Validation côté client avant soumission
- ✅ Messages d'erreur descriptifs par champ
- ✅ Indicateur de chargement pendant la soumission
- ✅ Message d'information sur l'email d'invitation
- ✅ Design responsive et accessible
- ✅ Gestion des erreurs API

## 🎨 Interface Utilisateur

### Message d'Information

Le formulaire affiche un bandeau bleu d'information :

> "Un email d'invitation sera envoyé à l'utilisateur pour définir son mot de passe."

### States du Formulaire

```javascript
const [formData, setFormData] = useState({
  full_name: '',
  email: '',
  phone: '',
  role: 'client',
  relay_point_id: '',
});

const [errors, setErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);
```

### Validation

```javascript
const validateForm = () => {
  const newErrors = {};
  
  if (!formData.full_name) {
    newErrors.full_name = 'Le nom complet est requis';
  }
  
  if (!formData.email) {
    newErrors.email = 'L\'email est requis';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Format d\'email invalide';
  }
  
  if (!formData.phone) {
    newErrors.phone = 'Le téléphone est requis';
  } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
    newErrors.phone = 'Format de téléphone invalide';
  }
  
  if (!formData.role) {
    newErrors.role = 'Le rôle est requis';
  }

  return newErrors;
};
```

## ⚠️ Gestion des Erreurs

### Erreur 409 - Conflit

**Cause:** Email ou téléphone déjà utilisé

**Gestion:**
```javascript
if (error.message.includes('409') || error.message.includes('déjà utilisé')) {
  setToast({
    message: 'Cet email ou téléphone est déjà utilisé',
    type: 'warning'
  });
}
```

### Erreur 422 - Validation

**Cause:** Données invalides (format, champs manquants)

**Gestion:**
```javascript
if (response.status === 422) {
  const errorData = await response.json();
  const validationErrors = errorData.details || {};
  const firstError = Object.values(validationErrors)[0];
  throw new Error(firstError || errorData.message || 'Erreur de validation');
}
```

## 🧪 Test de l'Endpoint

### Avec cURL

```bash
curl -X POST \
  'https://your-api.com/api/v1/admin/users' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "full_name": "Moussa Ndiaye",
    "email": "moussa@example.com",
    "phone": "+221771234567",
    "role": "AGENT",
    "relay_point_id": "rp_1"
  }'
```

### Avec Postman

```
Method: POST
URL: /api/v1/admin/users
Headers:
  - Authorization: Bearer {token}
  - Content-Type: application/json
Body (raw JSON):
{
  "full_name": "Moussa Ndiaye",
  "email": "moussa@example.com",
  "phone": "+221771234567",
  "role": "AGENT",
  "relay_point_id": "rp_1"
}
```

## 💡 Bonnes Pratiques

### 1. Validation des Formats

**Email:**
```javascript
/\S+@\S+\.\S+/.test(email)
```

**Téléphone International:**
```javascript
/^\+?[0-9]{10,15}$/.test(phone.replace(/\s/g, ''))
```

### 2. Messages d'Erreur Clairs

```javascript
// ✅ Bon
"Cet email est déjà utilisé. Veuillez en choisir un autre."

// ❌ Éviter
"Erreur 409"
```

### 3. Retour Utilisateur Après Création

```javascript
setToast({
  message: `${formData.full_name} a été créé avec succès. Un email d'invitation a été envoyé à ${formData.email}.`,
  type: 'success'
});
```

### 4. Validation Conditionnelle

Pour les agents et managers, `relay_point_id` devrait être requis :

```javascript
if ((formData.role === 'agent' || formData.role === 'MANAGER') && !formData.relay_point_id) {
  newErrors.relay_point_id = 'Un point relais est requis pour ce rôle';
}
```

## 📧 Email d'Invitation

### Contenu Recommandé

**Sujet:** "Invitation à rejoindre YES Karangue"

**Corps:**
```
Bonjour [Nom],

Vous avez été invité(e) à rejoindre YES Karangue en tant que [Rôle].

Pour activer votre compte, veuillez définir votre mot de passe en cliquant sur le lien ci-dessous :

[Lien Set-Password]

Ce lien est valide pendant 48 heures.

Cordialement,
L'équipe YES Karangue
```

### Informations dans l'Email

- Nom complet de l'utilisateur
- Rôle assigné
- Lien unique de set-password avec token
- Date d'expiration du lien
- Instructions claires

## 🔐 Sécurité

### Token d'Invitation

- Généré de manière unique et sécurisée
- Expire après 48 heures
- À usage unique (invalidé après utilisation)
- Haché côté serveur

### Workflow Sécurisé

```
1. Token généré: crypto.randomBytes(32).toString('hex')
2. Token haché et stocké en DB
3. Envoyé en clair dans l'email
4. Utilisateur clique sur le lien
5. Token vérifié et validé
6. Mot de passe défini
7. Token invalidé
```

## 📁 Fichiers Créés/Modifiés

- ✅ `/src/services/userService.js` - Fonction `createUser()` déjà implémentée
- ✅ `/src/components/forms/UserForm.jsx` - Formulaire complet créé
- ✅ `/docs/users-create-endpoint.md` - Cette documentation

## 🎯 Checklist d'Implémentation

- [x] Service API `createUser()` fonctionnel
- [x] Formulaire `UserForm.jsx` créé
- [x] Validation côté client
- [x] Gestion des erreurs 409 et 422
- [x] Message d'information sur l'email
- [x] Notifications toast
- [x] Documentation complète
- [ ] Intégration dans `UsersPage.jsx`
- [ ] Tests de l'endpoint
- [ ] Vérification de l'envoi d'email

## 🚀 Prochaines Étapes

1. **Intégrer dans UsersPage.jsx** :
   - Connecter le bouton "Ajouter un utilisateur" au formulaire
   - Implémenter `handleCreateUser` avec gestion d'erreurs
   - Afficher les toasts de succès/erreur

2. **Tester End-to-End** :
   - Créer un utilisateur via l'interface
   - Vérifier l'envoi de l'email d'invitation
   - Tester le flow set-password
   - Confirmer l'activation du compte

3. **Améliorer** :
   - Ajouter un sélecteur de point relais (au lieu d'un champ texte)
   - Valider le format du numéro de téléphone par pays
   - Permettre de renvoyer l'invitation
   - Afficher le statut d'invitation dans la liste

---

**Créé le:** 2026-01-05  
**Version:** 1.0  
**Auteur:** Antigravity AI
