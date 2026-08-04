"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * A nav link to a section of the home page.
 *
 * Header and Footer both list the sections as bare fragments (`#work`), which
 * only resolve on the home page itself. On /blog and on a post those anchors
 * do not exist, so the links were inert and Writing was a one-way trip with no
 * route back except the browser's back button.
 *
 * On the home page a fragment stays a native anchor, so the existing jump
 * behaviour is untouched. Off it, the fragment is rewritten to a route link
 * (`/#work`) and Next handles the navigation and the scroll.
 */
export function SectionLink({
  href,
  className,
  children,
  onClick,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  /** Used by the mobile panel to close itself on navigation. */
  onClick?: () => void;
}) {
  const onHome = usePathname() === "/";
  const isFragment = href.startsWith("#");

  if (isFragment && onHome) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={isFragment ? `/${href}` : href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

/**
 * The wordmark. Home on every other route, top of page on the home page.
 */
export function HomeLink({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const onHome = usePathname() === "/";

  if (onHome) {
    return (
      <a href="#top" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href="/" className={className}>
      {children}
    </Link>
  );
}
