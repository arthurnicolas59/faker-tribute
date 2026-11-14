# Astro pour le site, Netlify pour l'hébergement

Le site est une seule page de contenu, en français, sans interaction des visiteurs. On le construit avec Astro : il produit des fichiers statiques très rapides, et les textes (Parcours, Palmarès, Moments mythiques) restent rangés à part du code, ce qui les rend faciles à corriger. On l'héberge gratuitement sur Netlify, parce que l'utilisateur y a déjà un compte et que Netlify fonctionne avec un repo GitHub privé. Il n'y a ni serveur ni base de données.

## Options écartées

- **HTML pur** : plus simple au départ, mais les textes sont mélangés au code et il y a peu de vérifications automatiques.
- **Next.js** : trop lourd pour une page statique.
- **Cloudflare Pages** : équivalent à Netlify, mais l'utilisateur n'y a pas de compte.
- **GitHub Pages** : impossible avec un repo privé sur un compte gratuit.
