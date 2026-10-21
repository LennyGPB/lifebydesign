import type { Metadata } from "next";
import { Account } from "@/components/auth/Account";

export const metadata: Metadata = { title: "Mon compte", robots: { index: false, follow: false } };

export default function AccountPage() {
  return <Account />;
}
