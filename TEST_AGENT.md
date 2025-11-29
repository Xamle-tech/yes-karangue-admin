# 🧪 Tests du Profil Agent

## ✅ Problèmes Corrigés

### ❌ **Avant** :
1. Besoin de rafraîchir la page après connexion
2. Agent redirigé vers dashboard admin
3. Agent pouvait accéder aux pages admin

### ✅ **Après** :
1. ✅ Redirection automatique immédiate
2. ✅ Agent arrive directement sur `/agent`
3. ✅ Agent ne peut pas accéder aux pages admin
4. ✅ Si agent essaie d'accéder à une page admin → redirection vers `/agent`

---

## 🧪 Plan de Test

### Test 1 : Connexion Agent
```
1. Aller sur http://localhost:5173
2. Email : agent@test.com
3. Mot de passe : 123
4. Cliquer "Se connecter"

✅ RÉSULTAT ATTENDU :
- Redirection immédiate vers /agent
- Page "Espace Agent - Gestion des Colis"
- Menu avec seulement "Gestion des Colis"
- Header affiche "Agent" au lieu de "Admin"
```

### Test 2 : Connexion Admin
```
1. Déconnexion (si connecté)
2. Email : admin@test.com
3. Mot de passe : 123
4. Cliquer "Se connecter"

✅ RÉSULTAT ATTENDU :
- Redirection vers /dashboard
- Page "Tableau de Bord"
- Menu complet (7 éléments)
- Header affiche "Admin"
```

### Test 3 : Protection des Routes Agent
```
Étant connecté comme Agent :
1. Essayer d'accéder à http://localhost:5173/dashboard
2. Essayer d'accéder à http://localhost:5173/shippers
3. Essayer d'accéder à http://localhost:5173/settings

✅ RÉSULTAT ATTENDU :
- Redirection automatique vers /agent
- Message de protection (pas d'accès)
```

### Test 4 : Menu Agent
```
Étant connecté comme Agent :
1. Regarder le menu latéral

✅ RÉSULTAT ATTENDU :
- Seulement 1 élément : "Gestion des Colis"
- Bouton "Déconnexion" en bas
- Logo "YES KARANGUE" avec "Agent"
```

### Test 5 : Enregistrer un Colis (Agent)
```
Étant connecté comme Agent :
1. Cliquer "Enregistrer un colis"
2. Remplir le formulaire :
   - Expéditeur : "Boutique Test"
   - Destinataire : "Client Test"
   - Téléphone : "+221 77 123 45 67"
   - Description : "Colis de test"
   - Poids : 2.5
   - Origine : "Dakar"
   - Destination : "Thiès"
   - Frais : 5000
3. Cliquer "Enregistrer le colis"

✅ RÉSULTAT ATTENDU :
- Modal se ferme
- Nouveau colis apparaît dans la liste
- Statut = "Dépôt" (étape 1)
- Bouton "Mettre à jour le statut" visible
```

### Test 6 : Mettre à jour le Statut (Agent)
```
Étant connecté comme Agent :
1. Trouver un colis avec statut "Dépôt"
2. Cliquer "Mettre à jour le statut"
3. Sélectionner "Prise en charge"
4. Confirmer

✅ RÉSULTAT ATTENDU :
- Modal se ferme
- Statut du colis = "Prise en charge"
- Badge bleu affiché
```

### Test 7 : Étapes Automatiques (Agent)
```
Étant connecté comme Agent :
1. Mettre un colis à l'étape 3 "En cours"
2. Regarder le modal de mise à jour

✅ RÉSULTAT ATTENDU :
- Seules les étapes 1, 2, 3 sont sélectionnables
- Message : "Les étapes 4 et 5 seront mises à jour automatiquement"
- Impossible de sélectionner étapes 4 et 5
```

### Test 8 : Statistiques Agent
```
Étant connecté comme Agent :
1. Regarder les 4 cartes en haut

✅ RÉSULTAT ATTENDU :
- Total colis
- En attente (statut 1)
- Pris en charge (statut 2)
- En cours (statut 3)
- Nombres corrects selon les colis
```

### Test 9 : Recherche Agent
```
Étant connecté comme Agent :
1. Taper dans la barre de recherche : "YK-2025-00001"
2. Taper : "Client Test"
3. Taper : "TRK001"

✅ RÉSULTAT ATTENDU :
- Filtrage en temps réel
- Résultats correspondants affichés
- Autres colis masqués
```

### Test 10 : Déconnexion et Reconnexion
```
1. Connecté comme Agent, cliquer "Déconnexion"
2. Reconnecter avec email "admin@test.com"
3. Vérifier qu'on arrive sur dashboard admin
4. Déconnecter
5. Reconnecter avec "agent@test.com"
6. Vérifier qu'on arrive sur /agent

✅ RÉSULTAT ATTENDU :
- Déconnexion correcte
- Redirection vers /login
- Reconnexion avec bon rôle
- Bon dashboard affiché
```

---

## 📝 Checklist de Test Rapide

Cochez après chaque test :

- [ ] Test 1 : Connexion Agent ✅
- [ ] Test 2 : Connexion Admin ✅
- [ ] Test 3 : Protection routes ✅
- [ ] Test 4 : Menu Agent ✅
- [ ] Test 5 : Enregistrer colis ✅
- [ ] Test 6 : Mettre à jour statut ✅
- [ ] Test 7 : Étapes automatiques ✅
- [ ] Test 8 : Statistiques ✅
- [ ] Test 9 : Recherche ✅
- [ ] Test 10 : Déconnexion/Reconnexion ✅

---

## 🐛 Si Problèmes

### Problème : Page blanche après connexion
**Solution** : 
1. Ouvrir console DevTools (F12)
2. Vérifier les erreurs
3. Rafraîchir avec Ctrl+Shift+R

### Problème : Agent voit dashboard admin
**Solution** :
1. Déconnexion
2. Vider le cache (Ctrl+Shift+Delete)
3. Se reconnecter

### Problème : Routes ne redirigent pas
**Solution** :
1. Vérifier localStorage : `localStorage.getItem('userRole')`
2. Devrait être "agent" ou "admin"
3. Si vide, se reconnecter

---

## ✅ Résultat Final Attendu

**Pour Agent** :
- ✅ Login → Redirection immédiate vers /agent
- ✅ Menu simplifié (1 élément)
- ✅ Peut enregistrer colis
- ✅ Peut mettre à jour statuts (1-3)
- ✅ Ne peut pas accéder pages admin
- ✅ Header affiche "Agent"

**Pour Admin** :
- ✅ Login → Redirection vers /dashboard
- ✅ Menu complet (7 éléments)
- ✅ Accès à toutes les pages
- ✅ Header affiche "Admin"

---

**Status** : ✅ Tous les problèmes corrigés !  
**Version** : 1.1.0  
**Date** : Janvier 2025

