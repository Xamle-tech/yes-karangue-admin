# 🎯 Guide du Profil Agent - Yes Karangue

## Vue d'Ensemble

Le **profil Agent** est un rôle spécialisé avec des permissions limitées pour l'enregistrement et le suivi des colis.

---

## 🔐 Connexion en tant qu'Agent

### Méthode Automatique
Pour vous connecter en tant qu'Agent, utilisez un email contenant le mot **"agent"** :

**Exemples d'emails Agent** :
- `agent@yeskarangue.com`
- `agent1@gmail.com`
- `karim.agent@mail.com`
- `agent.dakar@yeskarangue.com`

**Mot de passe** : N'importe quel mot de passe (en mode développement)

### Redirection Automatique
- Email avec "agent" → **Espace Agent** (`/agent`)
- Autres emails → **Espace Admin** (`/dashboard`)

---

## ✅ Permissions de l'Agent

### Ce qu'un Agent PEUT faire :

#### 1️⃣ **Enregistrer un nouveau colis**
- Nom de l'expéditeur
- Nom du destinataire
- Téléphone du destinataire
- Description du colis
- Poids (en kg)
- Point de départ
- Destination
- Frais de timbre
- Photo du colis (optionnel)

#### 2️⃣ **Mettre à jour le statut du colis** (Étapes 1-3 uniquement)

**Étape 1 : Dépôt du colis**
- Le colis a été déposé au point de retrait

**Étape 2 : Prise en charge**
- Le transporteur a récupéré le colis

**Étape 3 : En cours de livraison**
- Le colis est en route vers sa destination

#### 3️⃣ **Consulter tous les colis**
- Voir la liste complète
- Rechercher par ID, numéro de suivi ou destinataire
- Voir les détails de chaque colis

---

## ❌ Ce qu'un Agent NE PEUT PAS faire :

- ❌ Accéder au tableau de bord admin
- ❌ Gérer les expéditeurs
- ❌ Gérer les transporteurs
- ❌ Gérer les utilisateurs
- ❌ Modifier les paramètres globaux
- ❌ Mettre à jour les étapes 4 et 5 (automatiques)

---

## 📊 Statuts des Colis

### Étapes Gérées par l'Agent (1-3)

| Étape | Statut | Description | Action Agent |
|-------|--------|-------------|--------------|
| 1 | **Dépôt** | Colis déposé | ✅ Peut mettre à jour |
| 2 | **Prise en charge** | Transporteur a récupéré | ✅ Peut mettre à jour |
| 3 | **En cours** | En route vers destination | ✅ Peut mettre à jour |

### Étapes Automatiques (4-5)

| Étape | Statut | Description | Action Agent |
|-------|--------|-------------|--------------|
| 4 | **Au point** | Arrivé au point de retrait | 🤖 Automatique |
| 5 | **Remis** | Remis au destinataire | 🤖 Automatique |

---

## 🎨 Interface Agent

### Page Principale : Gestion des Colis

**Statistiques en haut** :
- Total colis
- En attente (statut 1)
- Pris en charge (statut 2)
- En cours (statut 3)

**Actions disponibles** :
1. **Bouton "Enregistrer un colis"** (en haut à droite)
2. **Barre de recherche** (recherche par ID, tracking, destinataire)
3. **Cartes de colis** avec :
   - ID et numéro de suivi
   - Expéditeur et destinataire
   - Description et poids
   - Origine et destination
   - Statut actuel
   - **Bouton "Mettre à jour le statut"** (si étapes 1-3)

---

## 📝 Workflow Agent

### 1. Enregistrer un nouveau colis

```
1. Cliquer sur "Enregistrer un colis"
2. Remplir le formulaire :
   - Expéditeur ✅
   - Destinataire ✅
   - Téléphone destinataire ✅
   - Description ✅
   - Poids ✅
   - Origine ✅
   - Destination ✅
   - Frais de timbre ✅
   - Photo (optionnel)
3. Cliquer "Enregistrer le colis"
4. Le colis est créé avec le statut "Dépôt" (étape 1)
```

### 2. Mettre à jour un colis

```
1. Trouver le colis dans la liste
2. Cliquer "Mettre à jour le statut"
3. Sélectionner le nouveau statut :
   - Étape 1 : Dépôt ✅
   - Étape 2 : Prise en charge ✅
   - Étape 3 : En cours ✅
4. Cliquer "Confirmer la mise à jour"
5. Le statut est mis à jour immédiatement
```

### 3. Consulter un colis

```
1. Utiliser la barre de recherche
2. Taper l'ID, le numéro de suivi ou le nom du destinataire
3. Voir les détails complets du colis
```

---

## 🔒 Sécurité

### Protection des Données
- ✅ Les agents ne peuvent voir que les informations des colis
- ✅ Pas d'accès aux données sensibles des utilisateurs
- ✅ Pas d'accès aux paramètres système
- ✅ Journalisation de toutes les actions

### Permissions Limitées
- ✅ Menu simplifié (uniquement "Gestion des Colis")
- ✅ Pas d'accès aux autres sections
- ✅ Redirection automatique si tentative d'accès non autorisé

---

## 💡 Conseils pour les Agents

### ✅ Bonnes Pratiques

1. **Vérifier les informations** avant d'enregistrer un colis
2. **Prendre une photo** du colis si possible
3. **Mettre à jour le statut** dès que possible
4. **Vérifier le téléphone** du destinataire
5. **Confirmer les frais de timbre** avec le client

### ⚠️ Points d'Attention

1. Ne pas mettre à jour un statut **en arrière** (impossible)
2. Les étapes 4 et 5 sont **automatiques** (pas d'action nécessaire)
3. Le statut "Dépôt" est **automatiquement** assigné à la création
4. Vérifier que le **poids** est correct
5. S'assurer que l'**origine** et la **destination** sont correctes

---

## 🆘 Dépannage

### Problème : Je ne peux pas me connecter
**Solution** : Vérifiez que votre email contient le mot "agent"

### Problème : Je ne vois pas le bouton "Mettre à jour"
**Solution** : Le colis est probablement à l'étape 4 ou 5 (automatique)

### Problème : Je ne peux pas choisir l'étape 4 ou 5
**Solution** : Normal ! Ces étapes sont gérées automatiquement par le système

### Problème : L'application me redirige vers le dashboard admin
**Solution** : Déconnectez-vous et reconnectez-vous avec un email contenant "agent"

---

## 📱 Navigation

### Menu de l'Agent
- **Gestion des Colis** (page principale)
- **Déconnexion** (en bas du menu)

### Pas d'accès à :
- ❌ Tableau de bord
- ❌ Expéditeurs
- ❌ Transporteurs
- ❌ Utilisateurs
- ❌ Paramètres

---

## 🎓 Formation

### Pour devenir Agent

1. **Recevoir vos identifiants** (email avec "agent")
2. **Lire ce guide** (5 minutes)
3. **Pratiquer** avec quelques colis de test
4. **Demander de l'aide** si besoin

### Support
- 📧 Email : support@yeskarangue.com
- 💬 Chat : Disponible dans l'application
- 📚 Documentation : Ce guide

---

## 📊 Exemple Complet

### Scénario : Enregistrer et suivre un colis

```
ÉTAPE 1 : Connexion
Email : agent.dakar@yeskarangue.com
Mot de passe : 123456

ÉTAPE 2 : Enregistrer le colis
- Expéditeur : "Boutique Électronique Dakar"
- Destinataire : "Fatou Sall"
- Téléphone : "+221 77 123 45 67"
- Description : "Laptop Dell XPS 15"
- Poids : 2.5 kg
- Origine : "Dakar"
- Destination : "Thiès"
- Frais : 5000 FCFA
- Photo : [Upload image]

RÉSULTAT : Colis YK-2025-00123 créé avec statut "Dépôt"

ÉTAPE 3 : Transporteur arrive
- Chercher le colis YK-2025-00123
- Cliquer "Mettre à jour le statut"
- Sélectionner "Prise en charge"
- Confirmer

RÉSULTAT : Statut mis à jour → "Prise en charge"

ÉTAPE 4 : Transporteur part
- Chercher le colis YK-2025-00123
- Cliquer "Mettre à jour le statut"
- Sélectionner "En cours de livraison"
- Confirmer

RÉSULTAT : Statut mis à jour → "En cours"

ÉTAPE 5 : Automatique
Le système mettra automatiquement le colis aux étapes 4 et 5
```

---

## ✅ Checklist de l'Agent

Avant de terminer votre journée :

- [ ] Tous les nouveaux colis sont enregistrés
- [ ] Les statuts sont à jour
- [ ] Les photos ont été prises
- [ ] Les informations sont correctes
- [ ] Aucun colis en attente de mise à jour

---

**Version** : 1.0.0  
**Dernière mise à jour** : Janvier 2025  
**Contact** : support@yeskarangue.com

---

**Développé avec ❤️ pour Yes Karangue**

