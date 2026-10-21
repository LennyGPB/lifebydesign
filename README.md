This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Questionnaire de sélection

Le parcours `/questionnaire` reprend les 20 questions du document de sélection, en cinq étapes. La recommandation est recalculée côté serveur : niveau, rythme, lieu, format et budget. Une contrainte de budget peut changer le format, jamais abaisser le niveau. Pour les tranches de budget, le calcul utilise leur borne supérieure (1 800 ou 2 300 euros) ; le prix exact reste affiché avant toute prise de rendez-vous.

Les candidatures adultes sont enregistrées dans PostgreSQL avec leurs réponses, la recommandation et une priorité indicative A/B/C. La motivation doit toujours être relue par une personne (`reviewPending`). Un profil mineur termine le parcours sans enregistrement des coordonnées. Aucun message Telegram ou e-mail n'est envoyé automatiquement.

Pour activer la réception :

1. Renseigner une vraie connexion PostgreSQL dans `DATABASE_URL` du fichier `.env`.
2. Exécuter `npx prisma migrate deploy`, puis `npx prisma generate`.
3. Consulter les candidatures avec `npm run db:studio`, dans `QuestionnaireSubmission`. Ne pas exposer Prisma Studio publiquement.
4. Vérifier les liens Telegram et Zcal de `config/site.ts`, ainsi que le contenu de la page de confidentialité avant publication.

Si l'enregistrement échoue, la recommandation reste affichée avec un message explicite et un bouton pour réessayer. Une clé unique évite les doublons lors d'un nouvel essai. Les réponses sont conservées en mémoire pendant la navigation entre étapes, pas dans le stockage local du navigateur.

Vérification : `npm run test:questionnaire`, `npm run lint` et `npm run build`.

## Comptes et envoi du questionnaire

Le dernier envoi exige une session valide. Sans connexion, le parcours propose une inscription ou une connexion sur place ; les réponses restent en mémoire et sont envoyées automatiquement après authentification. Une confirmation apparaît uniquement après enregistrement réussi. `/compte` permet de se reconnecter, se déconnecter et consulter ses propres questionnaires. Les anciennes candidatures restent conservées sans compte ; aucune association automatique par adresse e-mail.

Better Auth gère les mots de passe hachés, les cookies de session HttpOnly et la limitation des tentatives. Définir `BETTER_AUTH_SECRET` avec un secret aléatoire durable (au moins 32 caractères), puis `BETTER_AUTH_URL` avec l’origine HTTPS réelle en production. Le secret local a été généré dans `.env`. Exécuter `npm run db:generate` et `npx prisma migrate deploy` lors du déploiement. La confirmation se fait dans l’interface ; aucun e-mail de confirmation ou de récupération n’est configuré.

Test d’intégration : démarrer le serveur local puis lancer `npm run test:auth` (`TEST_BASE_URL` optionnel, défaut `http://localhost:3001`). Ce test crée deux comptes fictifs et des réponses, vérifie les sessions, les droits et les doublons, puis supprime uniquement ses données. Il nécessite la connexion à la base configurée.
