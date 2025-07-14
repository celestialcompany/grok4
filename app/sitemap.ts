import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://your-domain.com", // Замените на ваш домен
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://your-domain.com/chat", // Замените на ваш домен
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://your-domain.com/dashboard", // Замените на ваш домен
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://your-domain.com/terms", // Замените на ваш домен
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://your-domain.com/privacy", // Замените на ваш домен
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // Добавьте другие важные страницы вашего сайта
  ]
}
