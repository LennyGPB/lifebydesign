import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { questionnairePage as content } from "@/content/pages";

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/questionnaire" },
};

export default function QuestionnairePage() {
  return <PlaceholderPage content={content} />;
}
