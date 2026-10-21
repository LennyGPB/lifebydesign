import { siteConfig } from "@/config/site";

export type PlaceholderContent = {
  metaTitle: string;
  metaDescription: string;
  label: string;
  title: string;
  text: string;
  backLink: { label: string; href: string };
  externalLink?: { label: string; href: string };
};

const backLink = { label: "← Retour à l’accueil", href: siteConfig.routes.home };

export const questionnairePage = {
  metaTitle: "Questionnaire",
  metaDescription:
    "4 minutes pour cerner ton niveau et recevoir une recommandation de formule adaptée à ton profil.",
};

export const mentionsLegalesPage: PlaceholderContent = {
  metaTitle: "Mentions légales",
  metaDescription: "Mentions légales du site Life By Design.",
  label: "Informations légales",
  title: "Mentions légales",
  text: "[Mentions légales à compléter : éditeur, hébergeur, directeur de publication, contact.]",
  backLink,
};

export const confidentialitePage: PlaceholderContent = {
  metaTitle: "Politique de confidentialité",
  metaDescription:
    "Politique de confidentialité et traitement des données personnelles du site Life By Design.",
  label: "Informations légales",
  title: "Politique de confidentialité",
  text: "[Politique de confidentialité à compléter : données collectées, finalités, durée de conservation, droits RGPD.]",
  backLink,
};
