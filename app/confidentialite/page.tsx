import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { confidentialitePage as content } from "@/content/pages";

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/confidentialite" },
};

export default function ConfidentialitePage() {
  return <PlaceholderPage content={content} />;
}
