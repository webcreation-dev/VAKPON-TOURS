# 📘 Spécifications Techniques et Fonctionnelles - Backend Vakpon Tours (V1)

Ce document détaille l'architecture, les fonctionnalités et les processus métier pour le backend de la plateforme Vakpon Tours, développé avec **NestJS** et **TypeORM**.

---

## 1. Vision et Objectifs du Backend

Le backend doit servir de moteur centralisé pour trois interfaces (Site Vitrine, Web App Client, Dashboard Admin). Il gère la sécurité, la logique de prix dynamique, et le cycle de vie complexe des réservations sans paiement en ligne immédiat.

---

## 2. Stack Technique
- **Framework :** NestJS (TypeScript)
- **ORM :** TypeORM
- **Base de Données :** PostgreSQL (recommandé)
- **Authentification :** JWT (JSON Web Tokens) avec Passport.js
- **Validation :** Class-validator & Class-transformer
- **Stockage Fichiers :** Local (Multer) ou Cloud (AWS S3/Cloudinary) pour les preuves de paiement et images.

---

## 3. Architecture des Données (Entités TypeORM)

### 3.1. User (Utilisateur)
Gère l'authentification et les profils.
- `id`: UUID (Primary Key)
- `email`: string (unique)
- `password`: string (hashé)
- `firstName`: string
- `lastName`: string
- `phone`: string (WhatsApp)
- `country`: string
- `role`: Enum (`CLIENT`, `ADMIN`, `AGENT`)
- `isActive`: boolean
- `createdAt / updatedAt`: timestamps

### 3.2. Pack (Le Voyage)
- `id`: UUID
- `title`: string
- `description`: text
- `startingPrice`: decimal (Prix de base)
- `durationDays`: int
- `includedServices`: string[] (ex: ["Hébergement", "Petit-déjeuner"])
- `isPublished`: boolean
- **Relations :** 
    - `options`: OneToMany -> `PackOption`

### 3.3. PackOption (Options additionnelles)
Permet de personnaliser le séjour.
- `id`: UUID
- `label`: string (ex: "Chambre individuelle", "Activités Safari")
- `description`: text
- `price`: decimal (S'ajoute au prix de base)
- **Relations :**
    - `pack`: ManyToOne -> `Pack`

### 3.4. Reservation (Commande)
Le cœur du système.
- `id`: UUID
- `reference`: string (ex: VKP-2024-001)
- `startDate`: date (choisie par le client)
- `participantsCount`: int
- `status`: Enum (`PENDING`, `CONTACTED`, `WAITING_PAYMENT`, `PAYMENT_PROOFS_SUBMITTED`, `CONFIRMED`, `CANCELLED`, `COMPLETED`)
- `basePriceAtBooking`: decimal (Prix de départ au moment T)
- `totalPrice`: decimal (Prix de base + somme des options au moment T)
- `paymentProofUrl`: string (Lien vers le fichier)
- `internalNotes`: text (Visible par l'admin uniquement)
- **Relations :**
    - `user`: ManyToOne -> `User`
    - `pack`: ManyToOne -> `Pack`
    - `selectedOptions`: ManyToMany -> `PackOption` (via une table de jonction pour figer les prix)

---

## 4. Fonctionnalités Détaillées

### 4.1. Gestion des Utilisateurs & Auth
- **Inscription :** Validation des données, check des doublons email, hashage du mot de passe avec Argon2 ou BCrypt.
- **Connexion :** Génération de tokens JWT avec durée d'expiration.
- **Profil :** Mise à jour des informations personnelles et changement de mot de passe.

### 4.2. Logique de Calcul des Prix (Dynamic Pricing)
Le système ne se contente pas de stocker un prix, il le recalcule à chaque étape critique :
- **Simulation :** Lors de la sélection d'options par le client, le backend renvoie un total dynamique.
- **Fixation :** Au moment du clic sur "Réserver", le backend enregistre le `startingPrice` actuel et les prix des options dans la commande (pour que si le prix du pack change plus tard, la réservation du client reste au prix initial).

### 4.3. Gestion du Workflow des Réservations
Le backend gère les transitions d'états :
- **Action Client :** Créer une réservation (Statut: `PENDING`).
- **Action Admin :** Assigner un agent et passer en `CONTACTED`.
- **Action Admin :** Envoyer les détails bancaires (Passer en `WAITING_PAYMENT`).
- **Action Client :** Upload d'une image/PDF (Passer en `PAYMENT_PROOFS_SUBMITTED`).
- **Action Admin :** Vérification visuelle du reçu et validation (Passer en `CONFIRMED`).

### 4.4. Module Admin
- **CRUD Packs :** Création complète des offres avec gestion dynamique des options.
- **Monitoring :** Liste exhaustive des réservations avec filtres par statut.
- **Statistiques :** Aggrégations TypeORM pour calculer le chiffre d'affaires prévisionnel (somme des `totalPrice` des réservations confirmées).

---

## 5. Processus Métier (Workflows)

### 5.1. Parcours de Réservation (Côte Client)
1. **Sélection :** Le client choisit un pack via `GET /packs/:id`.
2. **Options :** Le client coche des options. Le backend valide que les options appartiennent bien au pack choisi via `POST /reservations/calculate-price`.
3. **Soumission :** `POST /reservations` crée l'entrée avec le statut `PENDING`.
4. **Paiement :** Après contact, le client utilise `PATCH /reservations/:id/upload-proof` pour soumettre son reçu.

### 5.2. Gestion du Catalogue (Côté Admin)
1. **Création Pack :** `POST /admin/packs`.
2. **Ajout Options :** `POST /admin/packs/:id/options`.
3. **Publication :** Le pack n'est visible sur le site vitrine que si `isPublished` est vrai.

---

## 6. Architecture des Endpoints API (Prévisionnel)

| Méthode | Endpoint | Description | Accès |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | Créer un compte | Public |
| **POST** | `/auth/login` | Se connecter | Public |
| **GET** | `/packs` | Liste des packs publiés | Public |
| **GET** | `/packs/:id` | Détails d'un pack et ses options | Public |
| **POST** | `/reservations` | Créer une réservation | Client |
| **GET** | `/reservations/my` | Mes réservations | Client |
| **PATCH** | `/reservations/:id/proof` | Upload preuve de paiement | Client |
| **GET** | `/admin/reservations` | Liste globale des réservations | Admin |
| **PATCH** | `/admin/reservations/:id/status`| Changer le statut | Admin |
| **POST** | `/admin/packs` | Créer un pack | Admin |

---

## 7. Sécurité et Robustesse
- **Guards NestJS :** Protection des routes sensibles. Seuls les admins voient les statistiques et toutes les réservations.
- **Transaction TypeORM :** Lors de la création d'une réservation, utilisation de `QueryRunner` pour s'assurer que si l'insertion de l'option échoue, la réservation n'est pas créée.
- **Dossier Upload :** Les preuves de paiement seront stockées dans un dossier protégé ou via des URLs signées pour éviter que n'importe qui puisse voir les reçus bancaires d'autrui.

---

## 8. Évolutivité (V2)
Le backend est conçu pour être "Stripe-Ready". Il suffira d'ajouter un module de webhook pour automatiser le passage au statut `CONFIRMED` dès réception d'un signal de succès de carte bancaire.
