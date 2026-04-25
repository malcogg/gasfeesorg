export const siteConfig = {
  name: "GasFees.org",
  url: "https://gasfees.org",
  description:
    "Search clear, practical gas fee guides, blockchain explainers, tools, and trackers for crypto transaction costs.",
  nav: [
    { href: "/search", label: "Search" },
    { href: "/blog", label: "Blog" },
    { href: "/blockchains", label: "Blockchains" },
    { href: "/topics", label: "Topics" },
    { href: "/tools", label: "Tools" },
    { href: "/charts", label: "Charts" },
    { href: "/about", label: "About" },
  ],
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
