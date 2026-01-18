# Cleanlystudio Portfolio

## Déploiement (Hostinger)

**IMPORTANT** : Hostinger sert des fichiers statiques depuis la branche `master`.

### Workflow de déploiement

```bash
# 1. Build le projet
npm run build

# 2. Push les fichiers buildés sur master
cd out
git init
git remote add origin https://github.com/theohoug/cleanlystudio.git
git checkout -b deploy-temp
git add -A
git commit -m "deploy: [description]"
git push origin deploy-temp:master --force
cd ..
rm -rf out/.git
```

### Commande rapide "ship"

Quand Théo dit **"ship"** :
1. `npm run build`
2. Push le contenu de `out/` vers `master` (force push)
3. Hostinger auto-deploy depuis `master`

### Branches

| Branche | Contenu | Usage |
|---------|---------|-------|
| `main` | Code source | Développement |
| `master` | Fichiers buildés (`out/`) | Production (Hostinger) |
| `gh-pages` | Fichiers buildés | GitHub Pages (backup) |

### Ne PAS faire

- ❌ Push le code source sur `master`
- ❌ `git push origin main:master` (ça push le source, pas le build)
- ❌ Oublier de `npm run build` avant de déployer

## Stack

- Next.js 16 (static export)
- React Three Fiber / Three.js
- GSAP
- Tailwind CSS

