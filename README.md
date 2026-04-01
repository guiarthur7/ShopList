# ShopList

Application web Node.js pour gerer une liste de courses.

Le projet contient :

- un back-end Express + Sequelize + MySQL
- une interface front simple en HTML/CSS/JS (dossier public)
- une authentification utilisateur (inscription/connexion)
- une gestion de produits avec recherche et pagination
- une liste personnelle (panier/liste de course)

## Stack technique

- Node.js
- Express
- Sequelize
- MySQL
- JSON Web Token (jsonwebtoken)
- bcrypt

## Structure du projet

- index.js : point d'entree du serveur (port 8080)
- models : modeles Sequelize et associations
- controllers : logique metier
- routes : endpoints API
- public : front-end (pages + scripts + styles)

## Prerequis

- Node.js 18+
- MySQL en local

## Installation

1. Cloner le depot
2. Installer les dependances

```bash
npm install
```

## Configuration

Le projet utilise les variables d'environnement via dotenv (fichier .env a la racine).

Creer un fichier .env avec au minimum :

```env
DB_NAME=shoplist
DB_USER=root
DB_PASS=
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DIALECT=mysql
JWT_SECRET=change_this_secret
```

## Base de donnees

Creer la base MySQL correspondant a DB_NAME, puis les tables utilisees par le projet :

- role
- users
- produit
- liste

Important :

- le code d'inscription attend un role USER dans la table role
- ajoute au moins cette ligne avant de tester l'inscription

Exemple SQL :

```sql
INSERT INTO role (name) VALUES ('USER');
```

## Lancer le projet

Mode developpement (nodemon) :

```bash
npm run dev
```

Le serveur demarre sur :

http://localhost:8080

## Utilisation

- Page d'accueil : http://localhost:8080/
- Inscription : http://localhost:8080/register.html
- Connexion : http://localhost:8080/login.html
- Dashboard : http://localhost:8080/dashboard.html

Comportement metier actuel :

- un utilisateur connecte peut ajouter/retirer des produits de sa liste
- l'utilisateur admin (username admin) voit des actions de gestion produits (creation/suppression) dans l'interface

## API principale

Authentification :

- POST /api/users/register
- POST /api/users/login

Produits :

- GET /api/produits?offset=0&limit=10
- GET /api/produits/search?search=nom&offset=0&limit=10
- POST /api/produits/create
- DELETE /api/produits/:id

Liste de course :

- POST /api/liste/see
- POST /api/liste/add
- POST /api/liste/del

## Scripts npm

- npm run dev : demarrage avec nodemon

## Notes

- Le script npm test n'est pas configure.
- La suppression de produit en API n'est pas protegee par un middleware d'authentification cote serveur.
- La logique de droits admin est actuellement geree cote front.
