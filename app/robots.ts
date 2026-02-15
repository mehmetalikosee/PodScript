import { SITE_URL } from "@/lib/site-config";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/login", "/signup", "/reset-password", "/forgot-password"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/login", "/signup", "/reset-password", "/forgot-password"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
