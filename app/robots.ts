import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/private/", "/admin/"], // Пример: запретить индексацию этих путей
    },
    sitemap: "https://your-domain.com/sitemap.xml", // Замените на ваш домен
  }
}
