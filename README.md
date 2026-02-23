# TaskFlow

> Application de gestion de tâches - Projet fil rouge CI/CD

[![CI](https://github.com/DthYb/taskflow/actions/workflows/ci.yml/badge.svg)](https://github.com/DthYb/taskflow/actions/workflows/ci.yml)

## Description

TaskFlow est une application web de gestion de tâches (todo list) que vous allez enrichir tout au long de la formation CI/CD.

**Stack technique :**
- Frontend : Vanilla JavaScript + Vite
- Tests : Vitest
- Linting : ESLint + Prettier
- Container : Docker
- Déploiement : GitHub Pages

## Installation

```bash
# Cloner le repository (après fork)
git clone https://github.com/VOTRE-USERNAME/taskflow.git
cd taskflow

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Build pour la production |
| `npm run preview` | Prévisualise le build |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run lint:fix` | Corrige automatiquement les erreurs |
| `npm run format` | Formate le code avec Prettier |
| `npm run test` | Lance les tests |
| `npm run test:watch` | Lance les tests en mode watch |
| `npm run test:coverage` | Lance les tests avec couverture |

## Structure du projet

```
taskflow/
├── index.html          # Page principale
├── src/
│   ├── app.js          # Point d'entrée, gestion UI
│   ├── tasks.js        # Logique métier (testable)
│   └── styles.css      # Styles
├── tests/
│   └── tasks.test.js   # Tests unitaires
├── Dockerfile          # À compléter (Jour 5)
├── package.json
└── README.md
```

## Progression CI/CD

### Jour 1 : Premier workflow CI
- [X] Créer `.github/workflows/ci.yml`
- [X] Workflow : checkout → install → lint

### Jour 2 : Configuration avancée
- [X] Ajouter job `build`
- [X] Matrix Node 18/20/22
- [X] Trigger `workflow_dispatch`

### Jour 3 : Tests et qualité
- [X] Ajouter job `test`
- [X] Atteindre coverage >= 70%
- [X] Upload rapport en artifact

### Jour 4 : Branches et releases
- [ ] Configurer branch protection
- [ ] Créer workflow release
- [ ] Publier v1.0.0

### Jour 5 : Déploiement
- [ ] Compléter le Dockerfile
- [ ] Push image sur ghcr.io
- [ ] Déployer sur GitHub Pages

## Fonctionnalités de l'application

- Ajouter des tâches avec priorité (haute, moyenne, basse)
- Marquer les tâches comme terminées
- Filtrer par état (toutes, actives, terminées)
- Supprimer les tâches terminées
- Persistance dans le localStorage

## Licence

MIT - ForEach Academy
