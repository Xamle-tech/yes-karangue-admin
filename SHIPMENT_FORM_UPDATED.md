# 📦 Formulaire Amélioré d'Enregistrement de Colis

## Vue d'Ensemble

Le formulaire de dépôt de colis a été entièrement refondu pour **capturer plus de détails** et **améliorer l'expérience utilisateur** :

### ✨ Améliorations Principales

```
AVANT                           APRÈS
├── Nom complet (1 champ)       ├── Prénom + Nom (2 champs)
├── Téléphone destinataire      ├── Prénom + Nom destinataire
└── Saisie libre des régions    ├── Téléphone expéditeur
                                ├── Téléphone destinataire
                                └── Dropdown régions (14 régions)
                                   + Autocomplétion
```

---

## 🎯 Nouvelle Structure

### Section 1 : 📤 Expéditeur

```
EXPÉDITEUR
├── Prénom * (requis)
│   Placeholder: "Ahmed"
├── Nom * (requis)
│   Placeholder: "Diallo"
└── Téléphone * (requis)
    Format: +221 XX XXX XX XX
```

### Section 2 : 📥 Destinataire

```
DESTINATAIRE
├── Prénom * (requis)
│   Placeholder: "Fatou"
├── Nom * (requis)
│   Placeholder: "Sall"
└── Téléphone * (requis)
    Format: +221 XX XXX XX XX
```

### Section 3 : 📦 Détails du Colis

```
DÉTAILS DU COLIS
├── Description * (textarea)
├── Poids (kg) * (nombre)
├── Région d'origine * (dropdown)
├── Région de destination * (dropdown)
├── Frais de timbre (FCFA) *
└── Photo du colis (optionnel)
```

---

## 🌍 Régions du Sénégal (14 régions)

```
1.  Dakar
2.  Thiès
3.  Saint-Louis
4.  Kaolack
5.  Tambacounda
6.  Kolda
7.  Ziguinchor
8.  Sédhiou
9.  Diourbel
10. Louga
11. Kaffrine
12. Matam
13. Fatick
14. Tamba
```

---

## 🎨 Interface des Dropdowns

### Design

```
┌─ Région d'origine ───────────────┐
│ [Sélectionner une région]     ⌄  │
└──────────────────────────────────┘
        ↓ (Clic pour ouvrir)
┌──────────────────────────────────┐
│ 🔍 Chercher une région...         │
├──────────────────────────────────┤
│ • Dakar                          │
│ • Thiès                          │
│ • Saint-Louis                    │
│ • Kaolack                        │
│ • ...                            │
│ (max-height: scrollable)         │
└──────────────────────────────────┘
```

### Fonctionnalités

1. **Dropdown avec Régions**
   - ✅ Liste de 14 régions
   - ✅ Scrollable si trop de résultats
   - ✅ Selection sauvegardée
   - ✅ Chevron rotatif (indication d'état)

2. **Autocomplétion**
   - ✅ Champ de recherche intégré
   - ✅ Filtrage en temps réel
   - ✅ Case-insensitive
   - ✅ Affiche "Aucune région trouvée" si 0 résultat

3. **Navigation**
   - ✅ Cliquer sur une région la sélectionne
   - ✅ Dropdown se ferme automatiquement
   - ✅ Filtre se réinitialise
   - ✅ Les 2 dropdowns sont indépendants

### Interaction Complète

```
AVANT SAISIE:
[Sélectionner une région]  ⌄

CLIC :
Dropdown s'ouvre
│ 🔍 Chercher...
├─ Dakar
├─ Thiès
└─ ...

SAISIE "TAMBA":
│ 🔍 Chercher...
├─ Tambacounda
└─ Tamba

CLIC SUR "DAKAR":
[Dakar]  ⌄
(Dropdown se ferme)

RÉSULTAT:
formData.origin = "Dakar"
```

---

## 📋 Champs Détail

### Expéditeur

| Champ | Type | Validation | Exemple |
|-------|------|-----------|---------|
| Prénom | Text | Requis | Ahmed |
| Nom | Text | Requis | Diallo |
| Téléphone | Tel | Requis | +221 77 123 45 67 |

### Destinataire

| Champ | Type | Validation | Exemple |
|-------|------|-----------|---------|
| Prénom | Text | Requis | Fatou |
| Nom | Text | Requis | Sall |
| Téléphone | Tel | Requis | +221 77 987 65 43 |

### Colis

| Champ | Type | Validation | Exemple |
|-------|------|-----------|---------|
| Description | Textarea | Requis | Colis électronique |
| Poids (kg) | Number | > 0 | 2.5 |
| Origine | Select | Requis | Dakar |
| Destination | Select | Requis | Thiès |
| Frais Timbre | Number | > 0 | 5000 |
| Photo | File | Optionnel | image.jpg |

---

## ✅ Validation

### Avant Soumission

```javascript
Vérifications:
├── Prénom expéditeur ✓
├── Nom expéditeur ✓
├── Téléphone expéditeur ✓
├── Prénom destinataire ✓
├── Nom destinataire ✓
├── Téléphone destinataire ✓
├── Description ✓
├── Poids > 0 ✓
├── Origine sélectionnée ✓
├── Destination sélectionnée ✓
└── Frais timbre > 0 ✓

SI ERREUR: Affiche message en rouge sous le champ
SI VALIDE: Soumet le formulaire
```

### Messages d'Erreur

```
Prénom requis
Nom requis
Téléphone requis
La description est requise
Le poids doit être supérieur à 0
L'origine est requise
La destination est requise
Le frais de timbre est requis
```

---

## 🔄 Flux d'Utilisation

### Scenario Complet

```
ÉTAPE 1: Agent clique "Dépôt de Colis"
         Modal s'ouvre
         ↓
ÉTAPE 2: Agent remplit l'expéditeur
         ├── Prénom: Ahmed
         ├── Nom: Diallo
         └── Téléphone: +221 77 123 45 67
         ↓
ÉTAPE 3: Agent remplit le destinataire
         ├── Prénom: Fatou
         ├── Nom: Sall
         └── Téléphone: +221 77 987 65 43
         ↓
ÉTAPE 4: Agent remplit les détails du colis
         ├── Description: Colis électronique
         ├── Poids: 2.5 kg
         ├── Clique "Région d'origine"
         │   ├── Dropdown s'ouvre
         │   ├── Choisit "Dakar"
         │   └── Dropdown se ferme
         ├── Clique "Région de destination"
         │   ├── Cherche "TAMBA"
         │   ├── Voit "Tambacounda" et "Tamba"
         │   ├── Choisit "Tambacounda"
         │   └── Dropdown se ferme
         ├── Frais de timbre: 5000
         └── Photo: (optionnel)
         ↓
ÉTAPE 5: Agent clique "Enregistrer le colis"
         ↓
ÉTAPE 6: Validation
         Tous les champs requis validés?
         OUI → Soumet
         NON → Affiche erreurs
         ↓
ÉTAPE 7: Colis enregistré
         ├── Statut: 1 (Dépôt)
         ├── Créé dans la liste
         └── Modal se ferme
```

---

## 💡 Bonnes Pratiques

### ✅ À Faire

1. **Utiliser les deux champs Prénom/Nom**
   - ✅ Prénom: Ahmed
   - ✅ Nom: Diallo
   - ❌ Pas: "Ahmed Diallo" dans prénom

2. **Utiliser les dropdowns pour régions**
   - ✅ Cliquer et sélectionner dans la liste
   - ✅ Chercher avec l'autocomplétion
   - ❌ Pas de saisie libre

3. **Format téléphone**
   - ✅ +221 77 123 45 67
   - ✅ 77 123 45 67
   - ❌ Pas: "221 77 123 45 67"

4. **Peser le colis correctement**
   - ✅ 2.5 kg
   - ✅ 10 kg
   - ❌ Pas: "2,5" (utiliser point)

### ❌ À Éviter

1. ❌ Laisser un champ vide (sauf photo)
2. ❌ Utiliser la saisie libre pour régions
3. ❌ Format téléphone incorrect
4. ❌ Poids négatif ou zéro
5. ❌ Même région pour départ et arrivée

---

## 📊 Données Envoyées

### Avant (ancien format)

```javascript
{
  shipper: "Ahmed Diallo",
  recipient: "Fatou Sall",
  recipientPhone: "+221 77 987 65 43",
  description: "Colis électronique",
  weight: 2.5,
  origin: "Dakar",
  destination: "Thiès",
  stampFee: 5000,
  photo: File,
}
```

### Après (nouveau format)

```javascript
{
  // Expéditeur (fusionné)
  shipper: "Ahmed Diallo",
  shipperFirstName: "Ahmed",
  shipperLastName: "Diallo",
  shipperPhone: "+221 77 123 45 67",
  
  // Destinataire (fusionné)
  recipient: "Fatou Sall",
  recipientFirstName: "Fatou",
  recipientLastName: "Sall",
  recipientPhone: "+221 77 987 65 43",
  
  // Colis
  description: "Colis électronique",
  weight: 2.5,
  origin: "Dakar",
  destination: "Thiès",
  stampFee: 5000,
  photo: File,
}
```

**Note:** Les champs `shipper` et `recipient` (fusionnés) sont créés automatiquement pour compatibilité avec le reste du système.

---

## 🎯 Cas d'Usage Courants

### Use Case 1: Dépôt Simple

```
Expéditeur: Ahmed Diallo
Destinataire: Fatou Sall
Origine: Dakar
Destination: Thiès
↓
Résultat: Colis créé, prêt à être pris en charge
```

### Use Case 2: Recherche Région

```
Agent veut "Tambacounda" mais ne se souvient pas du nom
├── Clique dropdown destination
├── Saisit "TAMBA"
├── Voir "Tambacounda" et "Tamba"
├── Sélectionne "Tambacounda"
└── Colis destiné à Tambacounda
```

### Use Case 3: Colis avec Photo

```
Agent prend une photo du colis
├── Clique "Ajouter une photo"
├── Sélectionne le fichier
├── Aperçu affiché
├── Remplit le reste du formulaire
├── Enregistre
└── Colis avec photo en base
```

---

## 🔗 Intégration

### Avec Clients

Lors de la sauvegarde:
```
1. Expéditeur créé/mis à jour
   ├── Prénom: Ahmed
   ├── Nom: Diallo
   └── Téléphone: +221 77 123 45 67

2. Destinataire créé/mis à jour
   ├── Prénom: Fatou
   ├── Nom: Sall
   └── Téléphone: +221 77 987 65 43

3. Colis enregistré
   ├── Relie l'expéditeur
   ├── Relie le destinataire
   └── Sauvegarde tous les détails
```

### Avec Points de Retrait

```
1. Agent reçoit le colis
2. Système met à jour le statut
3. Point de retrait associé aux régions
4. Clients peuvent le chercher par région
```

---

## 📱 Responsive Design

```
DESKTOP (max-width: unlimited)
├── 2 colonnes Prénom/Nom
├── 2 colonnes Région d'origine/Destination
└── Pleine largeur pour autres

TABLETTE (max-width: 768px)
├── 2 colonnes Prénom/Nom
├── 2 colonnes Région
└── Adapté

MOBILE (max-width: 640px)
├── 1 colonne Prénom/Nom (stack)
├── 1 colonne Région (stack)
└── Pleine largeur partout
```

---

## 🧪 Tests

### Test 1: Validation Complète

```
1. Laisser tous les champs vides
2. Cliquer "Enregistrer"
3. Voir les erreurs en rouge

✅ Résultat: Toutes les erreurs affichées
```

### Test 2: Dropdown Régions

```
1. Ouvrir dropdown d'origine
2. Chercher "TAMBA"
3. Voir "Tambacounda" et "Tamba"
4. Sélectionner "Tambacounda"

✅ Résultat: "Tambacounda" sélectionné
```

### Test 3: Soumission

```
1. Remplir tous les champs correctement
2. Cliquer "Enregistrer"

✅ Résultat: Colis créé avec succès
```

---

## 📈 Performance

### Optimisations

- ✅ Filtrage en temps réel (< 100ms)
- ✅ Dropdown optimisé (14 régions seulement)
- ✅ Validation immédiate
- ✅ Photos compressées côté client

---

**Version** : 2.0.0  
**Date** : Janvier 2025  
**Changes** : Nouveau formulaire avec Prénom/Nom séparés, téléphones expéditeur/destinataire, dropdowns régions avec autocomplétion

---

**Développé avec ❤️ pour Yes Karangue**

