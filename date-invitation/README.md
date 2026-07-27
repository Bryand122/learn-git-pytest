# 💌 Notre Date — Invitation romantique

Application web premium inspirée de la tendance TikTok « Do you want to go on a
date with me? », construite avec Next.js 15, TypeScript, Tailwind CSS v4,
Framer Motion, react-day-picker et lucide-react.

## ✨ Parcours

1. **L’invitation** — « Ça te dit un date avec moi ? ❤️ ». Le bouton **Oui**
   pulse doucement ; le bouton **Non** est impossible à attraper :
   - **Desktop** : il fuit la souris avec un ressort fluide, sans jamais sortir
     de l’écran.
   - **Mobile** : il saute à chaque tentative et rétrécit ; après quelques
     essais, un toast taquine (« Tu abandonnes pas hein ? 😂 »), puis il
     disparaît.
   - **iPad / tablette** : mêmes esquives avec une légère rotation, et une
     disparition dans une explosion de petits cœurs.
2. **Le choix du moment** — un vrai calendrier (react-day-picker, locale
   française) où **seuls les samedis et dimanches** sont sélectionnables,
   puis le créneau (🌞 Matin / ☀️ Après-midi / 🌙 Soir) et une envie
   facultative.
3. **La confirmation** — chargement élégant sous une pluie de pétales et de
   cœurs, puis l’écran final avec un grand cœur battant et le bouton
   **📅 Ajouter au calendrier** qui génère un fichier `.ics` (Apple Calendar,
   Google Calendar, Outlook…).

Bonus : cœurs flottants en arrière-plan, glassmorphism, dégradés subtils,
lumière douce sur les cartes, vibrations haptiques quand le navigateur le
permet, et respect de `prefers-reduced-motion`.

## 🚀 Lancer le projet

```bash
npm install
npm run dev
```

Puis ouvrir [http://localhost:3000](http://localhost:3000).

## 🏗️ Architecture

```
src/
├── app/                    # Layout (DM Sans, métadonnées) + page orchestratrice
├── components/
│   ├── animations/         # Transitions d’écran, explosion de cœurs, pluie de pétales
│   ├── floating-hearts/    # Cœurs ambiants en arrière-plan
│   ├── invitation/         # Le bouton « Non » fuyant
│   ├── screens/            # Les trois écrans + l’interlude de célébration
│   └── ui/                 # Composants réutilisables (Button, Card, Input, Toast, Modal)
├── hooks/                  # use-device-type, use-haptics
└── lib/                    # Constantes (créneaux), génération ICS, utilitaires
```

## 🎨 Direction artistique

- Palette : fond `#F8F5F2`, rose `#E86A92`, bordeaux `#8E3B57`, blanc, gris très clair
- Typographie : DM Sans (via `next/font`)
- Style : minimalisme, cartes arrondies, ombres douces, animations spring
  inspirées d’Apple / Linear / Stripe
