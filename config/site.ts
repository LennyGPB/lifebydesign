export const siteConfig = {
  name: "Life By Design",
  // Remplacer par le domaine définitif avant la mise en ligne.
  url: "https://lifebydesign.fr",
  locale: "fr_FR",
  title: "Life By Design · Accompagnement individuel en trading",
  description:
    "Un accompagnement en tête-à-tête pour bâtir ta stratégie, ton process et ta discipline de trading. En présentiel à Paris ou à distance.",
  links: {
    // Placeholders : à remplacer par les vrais liens.
    telegram: "https://t.me/lifebydesign",
    instagram: "https://www.instagram.com/lifebydesign",
    zcal: "https://zcal.co/lifebydesign",
  },
  routes: {
    home: "/",
    questionnaire: "/questionnaire",
    mentionsLegales: "/mentions-legales",
    confidentialite: "/confidentialite",
  },
} as const;
