import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { mentionsLegalesPage as content } from "@/content/pages";

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  return <PlaceholderPage content={content} />;
}
