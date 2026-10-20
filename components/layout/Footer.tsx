import { cacheLife } from "next/cache";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { common, footer } from "@/content/landing";

async function getCurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function Footer() {
  const year = await getCurrentYear();

  return (
    <footer className="border-t border-line bg-bg">
      <div className="shell py-14 md:py-20">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <Link
              href={siteConfig.routes.home}
              className="font-display text-2xl font-medium leading-none tracking-[-0.02em]"
            >
              {siteConfig.name}
            </Link>
            <ul aria-label={footer.socialLabel} className="mt-6 flex gap-6">
              {footer.social.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text/80 underline-offset-4 transition-colors hover:text-text hover:underline"
                  >
                    {link.label}
                    <span className="sr-only"> {common.newTab}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label={footer.legalLabel}>
            <ul className="flex flex-col gap-3 md:items-end">
              {footer.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text/80 underline-offset-4 transition-colors hover:text-text hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 border-t border-line pt-8">
          <p className="max-w-3xl text-xs leading-relaxed text-text-muted">
            {footer.disclaimer}
          </p>
          <p className="mt-6 text-xs text-text-muted">{footer.copyright(year)}</p>
        </div>
      </div>
    </footer>
  );
}
