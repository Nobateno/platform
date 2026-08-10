import type { AppLanguage } from "./languages";

interface DocumentMessages {
  title: string;
  description: string;
}

export const documentResources: Record<AppLanguage, DocumentMessages> = {
  fa: { title: "پنل ارائه‌دهندگان نوبت‌نو", description: "پنل چندزبانه مدیریت رزروها، مشتریان و خدمات نوبت‌نو." },
  en: { title: "Nobateno Provider Panel", description: "Multilingual panel for managing Nobateno reservations, customers, and services." },
  zh: { title: "Nobateno 商家管理面板", description: "用于管理 Nobateno 预约、客户和服务的多语言面板。" },
  es: { title: "Panel de proveedores de Nobateno", description: "Panel multilingüe para gestionar reservas, clientes y servicios de Nobateno." },
  ru: { title: "Панель поставщика Nobateno", description: "Многоязычная панель управления бронированиями, клиентами и услугами Nobateno." },
  pt: { title: "Painel de prestadores Nobateno", description: "Painel multilíngue para gerenciar reservas, clientes e serviços da Nobateno." },
  fr: { title: "Espace prestataire Nobateno", description: "Espace multilingue de gestion des réservations, clients et services Nobateno." },
  de: { title: "Nobateno-Anbieterportal", description: "Mehrsprachiges Portal zur Verwaltung von Nobateno-Buchungen, Kunden und Dienstleistungen." },
  ja: { title: "Nobateno 事業者パネル", description: "Nobateno の予約、顧客、サービスを管理する多言語パネルです。" },
};
