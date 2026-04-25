import { toolSchema, type Tool } from "@/lib/content/schemas";

const rawTools = [
  {
    slug: "aptos-gas-fee-calculator",
    name: "Aptos Gas Fee Calculator",
    description:
      "Estimate Aptos transaction costs from instruction gas, storage gas, and payload size assumptions.",
    status: "live",
    href: "/tools/aptos-gas-fee-calculator",
  },
  {
    slug: "gas-fee-charts",
    name: "Gas Fee Charts",
    description:
      "A tracker hub for comparing gas fee concepts, chain pages, and future live fee data integrations.",
    status: "beta",
    href: "/charts",
  },
  {
    slug: "wordpress-import-validator",
    name: "WordPress Import Validator",
    description:
      "Content migration tooling that flags thin posts, missing metadata, broken links, and redirect decisions.",
    status: "planned",
    href: "/tools",
  },
] satisfies Tool[];

export const tools = rawTools.map((tool) => toolSchema.parse(tool));
