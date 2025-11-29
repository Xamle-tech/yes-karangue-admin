# 👥 Gestion des Clients - Guide Complet

## Vue d'Ensemble

La section **"Clients"** est le centre névralgique pour gérer tous les clients de YES Karangue :
- **Expéditeurs** : Personnes qui envoient les colis
- **Destinataires** : Personnes qui reçoivent les colis
- **Clients complets** : Les deux rôles à la fois

### ✨ Nouveautés vs Expéditeurs

| Feature | Ancien "Expéditeurs" | Nouveau "Clients" |
|---------|-------------------|-----------------|
| Gestion | Expéditeurs uniquement | Expéditeurs + Destinataires |
| Historique | Basique | Complet avec activités |
| Statut App | Non affiché | Visible & traçable |
| Création | Manuel | Manuel + Auto (dépôt colis) |
| Filtrage | Basique | Avancé (avec/sans app) |

---

## 🎯 Concepts Clés

### Types de Clients

```
┌─────────────────────┐
│  TYPES DE CLIENTS   │
├─────────────────────┤
│                     │
│  1. Expéditeur      │  Envoie des colis
│     Seul            │
│                     │
│  2. Destinataire    │  Reçoit des colis
│     Seul            │
│                     │
│  3. Exp. & Dest.    │  Les deux
│     (Complet)       │
│                     │
└─────────────────────┘
```

### Statut Application

```
┌──────────────────────────┐
│   STATUT APPLICATION     │
├──────────────────────────┤
│                          │
│ ✅ Avec App              │ 🟢 Client a téléchargé
│    (Depuis DD/MM/YYYY)   │    Application mobile
│                          │
│ ❌ Sans App              │ 🔴 Client n'a pas app
│                          │    Créé lors du dépôt
│                          │
└──────────────────────────┘
```

### Méthodes de Création

```
┌─────────────────────────────────────┐
│  COMMENT UN CLIENT EST CRÉÉ?        │
├─────────────────────────────────────┤
│                                     │
│  1️⃣  Via l'Application Mobile       │
│   - Client télécharge l'app         │
│   - S'enregistre                    │
│   - Créé avec Statut "Avec app"    │
│                                     │
│  2️⃣  Lors du Dépôt d'un Colis      │
│   - Agent ou client enregistre un   │
│     colis                           │
│   - Destinataire créé automatiquement│
│   - Créé avec Statut "Sans app"    │
│                                     │
│  3️⃣  Ajout Manuel (Admin)           │
│   - Admin crée manuellement         │
│   - Statut "Sans app" par défaut    │
│                                     │
└─────────────────────────────────────┘
```

---

## 📊 Interface Principale

### Vue Tableau

```
┌────────────────────────────────────────────────────┐
│                      CLIENTS                       │
│  Gérez tous les clients (expéditeurs et ...)      │
│                    [+ Ajouter un client]           │
├────────────────────────────────────────────────────┤
│                                                    │
│  STATISTIQUES:                                     │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │
│  │Total:5 │ │App:3   │ │SansApp:2│ │Colis:45│   │
│  └────────┘ └────────┘ └────────┘ └────────┘    │
│                                                    │
│  FILTRES:                                          │
│  [Tous] [🟢 Avec app] [🔴 Sans app]              │
│  [Recherche par nom/email/téléphone]              │
│                                                    │
├────────────────────────────────────────────────────┤
│ NOM       | EMAIL          | TYPE  | APP | COLIS  │
├───────────┼────────────────┼───────┼─────┼────────┤
│ Ahmed D.  | ahmed@m...     | Exp.& | ✅  | 20     │
│ Fatou S.  | fatou@m...     | Dest. | ❌  | 5      │
│ Shop Elec.| shop@e...      | Exp.  | ✅  | 47     │
└────────────────────────────────────────────────────┘
```

### Informations par Client

```
┌─────────────────────────────────────┐
│       DÉTAILS CLIENT                │
├─────────────────────────────────────┤
│                                     │
│  📧 Email: ahmed@mail.com          │
│  📱 Téléphone: +221 77 123 45 67   │
│  📍 Adresse: Dakar, Sénégal        │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ APP: ✅ Installée le 10/01    │ │
│  └───────────────────────────────┘ │
│                                     │
│  Type: Exp. & Dest. | Total: 20    │
│  - Envoyés: 12                      │
│  - Reçus: 8                         │
│                                     │
│  Dernier accès: 15/01/2025 14:30   │
│                                     │
│  HISTORIQUE D'ACTIVITÉ:             │
│  • 15/01 - Reçu colis YK-00045     │
│  • 14/01 - Déposé colis YK-00044   │
│  • 12/01 - Connexion app           │
│                                     │
│  [Modifier]  [Fermer]              │
└─────────────────────────────────────┘
```

---

## ✅ Fonctionnalités Principales

### 1. 📋 Liste des Clients

**Affichage:**
- ✅ Tous les clients (expéditeurs, destinataires, complets)
- ✅ Informations de contact
- ✅ Type de client
- ✅ Statut application
- ✅ Historique d'activité
- ✅ Nombre de colis

**Tri & Filtrage:**
- 🔍 Recherche : nom, email, téléphone
- 🎯 Filtre App : Tous / Avec app / Sans app
- 📊 Statistiques en temps réel

### 2. ➕ Ajouter un Client

**Modal d'Ajout:**
```
Champs:
├── Nom complet * (requis)
├── Email * (requis)
├── Téléphone * (requis)
├── Adresse
├── Type de client
│   ├── Expéditeur uniquement
│   ├── Destinataire uniquement
│   └── Exp. & Dest.
└── ☑️ Le client a téléchargé l'app

Boutons:
├── Annuler
└── Ajouter
```

**Cas d'Usage:**
```
Scénario 1: Ajouter un client sans app
├── Admin clique "+ Ajouter"
├── Remplit les champs
├── Ne coche PAS "Avec app"
├── Clique "Ajouter"
└── Client créé avec statut "Sans app" ❌

Scénario 2: Ajouter un client avec app
├── Admin clique "+ Ajouter"
├── Remplit les champs
├── Coche "Avec app"
├── Clique "Ajouter"
└── Client créé avec statut "Avec app" ✅
```

### 3. 👁️ Voir les Détails

**Modal de Détails:**
```
Affiche:
├── Informations complètes
├── Statut application + date
├── Type et statistiques
├── Dernier accès
├── Historique d'activité complet
├── Date d'enregistrement
├── Méthode de création
└── Boutons: Modifier / Fermer
```

**Historique d'Activité:**
```
Types d'activités affichées:
├── "Déposé un colis" (avec ID)
├── "Reçu un colis" (avec ID)
├── "Connexion app"
├── "Téléchargé l'app"
└── Autres actions système

Chaque entrée contient:
├── Action
├── Date
├── Heure (optionnelle)
└── Référence colis (si applicable)
```

### 4. ✏️ Modifier un Client

**Fonctionnalités:**
- ✅ Modifier tous les champs
- ✅ Changer le type de client
- ✅ Mettre à jour le statut app
- ✅ Conserver l'historique

**Accès:**
```
Depuis la liste: Cliquer icône ✏️
        ↓
Ouvre le modal de modification
        ↓
Changez les infos
        ↓
Cliquez "Modifier"
```

### 5. 🗑️ Supprimer un Client

**Sécurité:**
- ⚠️ Confirmation requise
- ℹ️ Les colis restent intacts

**Confirmation:**
```
"Êtes-vous sûr de vouloir supprimer ce client?"
├── Oui → Supprime
└── Non → Annule
```

---

## 📊 Statistiques et Filtrage

### Tableau de Bord

```
┌─ STATS GLOBALES ─────┐
│ Total clients:    5  │
│ Avec app:         3  │
│ Sans app:         2  │
│ Taux adoption: 60%   │
│ Total colis:     45  │
└──────────────────────┘
```

### Filtres Disponibles

```
1. RECHERCHE (Texte libre)
   - Par nom
   - Par email
   - Par téléphone

2. STATUT APP
   [Tous] [✅ Avec app] [❌ Sans app]

3. RÉSULTATS
   - Affichage immédiat
   - Compteur de résultats
```

---

## 🔄 Flux de Création Automatique

### Scenario: Dépôt d'un Colis

```
ÉTAPE 1: Agent/Client dépose un colis
         Remplit le formulaire
         Saisit le destinataire (nouveau)
                 ↓
ÉTAPE 2: Système vérifie
         Client existe?
                 ↓
ÉTAPE 3: Création automatique
         ├── Nom: (du formulaire)
         ├── Email: (du formulaire)
         ├── Téléphone: (du formulaire)
         ├── Type: "Destinataire"
         ├── App: "Non" (sans app)
         ├── Method: "Dépôt colis"
         └── Status: "Active"
                 ↓
ÉTAPE 4: Colis enregistré
         Destinataire créé automatiquement
```

### Scenario: Téléchargement d'App

```
ÉTAPE 1: Client télécharge app
         S'enregistre
                 ↓
ÉTAPE 2: Système vérifie
         Email existe?
                 ↓
ÉTAPE 3: Création (si nouveau)
         ├── Données du formulaire
         ├── Type: "Exp. & Dest."
         ├── App: "Oui"
         ├── Method: "App"
         └── Status: "Active"
                 ↓
ÉTAPE 4: Client peut envoyer/recevoir
```

---

## 🎯 Cas d'Usage

### Use Case 1: Nouveau Client Suite à Dépôt

```
1. Agent crée un colis
2. Saisit destinataire: "Fatou Sall"
3. Téléphone: "+221 77 987 65 43"
4. Système vérifie → Non existant
5. Client créé automatiquement
   ├── Type: Destinataire
   ├── App: Non
   └── Créé le: Date du dépôt

Résultat: Dans la liste Clients
├── Fatou Sall
├── Sans app ❌
├── 1 colis reçu
└── Peut recevoir les futurs colis
```

### Use Case 2: Client Télécharge App

```
1. Fatou télécharge l'app
2. S'enregistre avec son téléphone
3. Système vérifie: Existe déjà
4. Profil mis à jour
   ├── Type: Exp. & Dest.
   ├── App: Oui
   └── Mis à jour le: Aujourd'hui

Résultat: Dans la liste Clients
├── Fatou Sall
├── Avec app ✅ (depuis 15/01)
├── 1 colis reçu + ...
└── Peut envoyer ET recevoir
```

### Use Case 3: Admin Ajoute Client Manuellement

```
1. Admin clique "+ Ajouter"
2. Remplit le formulaire
   ├── Nom: Ahmed Diallo
   ├── Email: ahmed@mail.com
   ├── Téléphone: +221 77 123 45 67
   ├── Type: Exp. & Dest.
   ├── App: Coche "Oui"
   └── (Date aujourd'hui)
3. Clique "Ajouter"

Résultat: Client créé
├── Visible immédiatement
├── Avec toutes les infos
├── Méthode: Ajout manuel
└── Prêt à utiliser
```

---

## 🔐 Permissions & Limitations

### Qui Peut Accéder?

```
✅ Admin               → Accès complet
❌ Agent              → Pas d'accès
❌ Client (app)       → Pas d'accès
❌ Transporteur       → Pas d'accès
```

### Actions Possibles par Rôle

```
ADMIN:
├── ✅ Voir tous les clients
├── ✅ Ajouter manuellement
├── ✅ Modifier les infos
├── ✅ Supprimer
├── ✅ Filtrer par statut app
└── ✅ Voir l'historique

SYSTÈME:
├── ✅ Créer automatiquement (dépôt)
├── ✅ Créer automatiquement (app)
├── ✅ Mettre à jour app status
└── ✅ Enregistrer activités
```

---

## 📈 Indicateurs de Performance

### Métriques Affichées

```
1. Total Clients
   - Évolution dans le temps
   - Comparaison période précédente

2. Taux Adoption App
   - Avec app / Total × 100
   - Objectif: > 70%

3. Activité
   - Clients actifs ce mois
   - Derniers accès

4. Colis
   - Total par client
   - En moyenne
```

---

## 🆘 Dépannage

### Problème: Client ne s'affiche pas

**Causes:**
1. Client filtré (statut app)
2. Nom mal orthographié
3. Pas encore synchronisé

**Solutions:**
```
1. Vérifier les filtres
2. Essayer recherche par téléphone
3. Attendre synchronisation
4. Rafraîchir la page
```

### Problème: Impossible de modifier

**Causes:**
1. Permission insuffisante
2. Client utilisé dans un colis
3. Session expirée

**Solutions:**
```
1. Vérifier que vous êtes admin
2. Essayer de supprimer le colis
3. Se reconnecter
```

### Problème: Client créé en double

**Causes:**
1. Créé manuellement + auto
2. Deux sources différentes

**Solutions:**
```
1. Fusionner manuellement
2. Supprimer le doublon
3. Vérifier emails/téléphones
```

---

## 💡 Bonnes Pratiques

### ✅ À Faire

1. **Vérifier avant d'ajouter**
   - Chercher si client existe
   - Vérifier l'email
   - Vérifier le téléphone

2. **Complèter les infos**
   - Toujours remplir les champs obligatoires
   - Ajouter l'adresse quand possible
   - Cocher le statut app correctement

3. **Nettoyer les doublons**
   - Vérifier régulièrement
   - Fusionner si nécessaire
   - Mettre à jour les infos

4. **Suivre l'activité**
   - Vérifier l'historique
   - Identifier les inactifs
   - Encourager l'adoption app

### ❌ À Éviter

1. ❌ Ajouter des clients en doublon
2. ❌ Laisser des infos incomplètes
3. ❌ Cocher "Avec app" à tort
4. ❌ Supprimer sans vérifier les colis

---

## 📱 Intégration avec l'App Mobile

### Flux Enregistrement App

```
Client télécharge app
        ↓
Formulaire d'enregistrement
├── Nom
├── Email
├── Téléphone
└── Mot de passe
        ↓
Système crée client
├── Si nouveau → Crée profil
├── Si existant → Met à jour
├── Marque "Avec app: Oui"
└── Enregistre date téléchargement
        ↓
Client visible dans Admin
├── Statut app: ✅
├── Peut envoyer colis
└── Peut recevoir colis
```

---

## 📝 Fiche de Synthèse

```
┌─────────────────────────────────────────┐
│  GESTION CLIENTS - FICHE SYNTHÈSE      │
├─────────────────────────────────────────┤
│                                         │
│  ACCÈS: Menu → Clients                 │
│                                         │
│  ACTIONS:                              │
│  ├── Voir tous les clients             │
│  ├── Rechercher / Filtrer              │
│  ├── Ajouter manuellement              │
│  ├── Modifier les infos                │
│  ├── Voir l'historique                 │
│  └── Supprimer (avec confirmation)     │
│                                         │
│  DONNÉES AFFICHÉES:                    │
│  ├── Infos de contact                  │
│  ├── Type de client                    │
│  ├── Statut application                │
│  ├── Historique d'activité             │
│  └── Statistiques colis                │
│                                         │
│  CRÉATIONS AUTOMATIQUES:               │
│  ├── Via dépôt de colis                │
│  └── Via téléchargement app            │
│                                         │
│  FILTRES:                              │
│  ├── Par texte (nom/email/tel)         │
│  ├── Par statut app                    │
│  └── En temps réel                     │
│                                         │
└─────────────────────────────────────────┘
```

---

**Version** : 1.0.0  
**Date** : Janvier 2025  
**Contact** : support@yeskarangue.com

---

**Développé avec ❤️ pour Yes Karangue**

