import {
  supportedLanguages,
  type AppLanguage,
} from "@/shared/i18n/languages";

export const reportsNamespace = "reports" as const;

type MessageTuple = readonly [string, string, string, string, string, string, string, string, string];
const message = (...values: MessageTuple) => values;

const messages = {
  eyebrow: message("گزارش‌ها", "Reports", "报表", "Informes", "Отчёты", "Relatórios", "Rapports", "Berichte", "レポート"),
  title: message("نمای عملیاتی کسب‌وکار", "Business operations snapshot", "业务运营概览", "Resumen operativo del negocio", "Сводка работы бизнеса", "Resumo operacional do negócio", "Aperçu des opérations", "Betriebsübersicht", "事業運営スナップショット"),
  description: message("حجم و منبع رزرو، نتیجه تأیید و عملکرد خدمات را با داده نمایشی بررسی کنید.", "Review booking volume, sources, approval outcomes, and service performance using demonstration data.", "使用演示数据查看预约量、来源、审核结果和服务表现。", "Revisa volumen, fuentes, aprobaciones y rendimiento con datos de demostración.", "Смотрите объём, источники, подтверждения и эффективность на демонстрационных данных.", "Veja volume, origens, aprovações e desempenho com dados de demonstração.", "Consultez volume, sources, validations et performances avec des données de démonstration.", "Prüfen Sie Volumen, Quellen, Bestätigungen und Leistung anhand von Demodaten.", "デモデータで予約数、流入元、承認結果、サービス実績を確認します。"),
  sampleData: message("داده‌ها فقط نمونه‌اند و به حساب واقعی متصل نیستند.", "Sample data only; these figures are not connected to a provider account.", "仅为示例数据；这些数字未连接服务商账户。", "Solo datos de ejemplo; no están conectados a una cuenta real.", "Только примеры; данные не связаны с аккаунтом поставщика.", "Apenas dados de exemplo; não estão conectados a uma conta real.", "Données d’exemple uniquement, sans connexion à un compte réel.", "Nur Beispieldaten; keine Verbindung zu einem Anbieterkonto.", "サンプルデータのみで、実際の事業者アカウントには接続されていません。"),
  period: message("بازه گزارش", "Reporting period", "报告周期", "Periodo del informe", "Период отчёта", "Período do relatório", "Période du rapport", "Berichtszeitraum", "集計期間"),
  last7: message("۷ روز گذشته", "Last 7 days", "过去 7 天", "Últimos 7 días", "Последние 7 дней", "Últimos 7 dias", "7 derniers jours", "Letzte 7 Tage", "過去7日間"),
  last30: message("۳۰ روز گذشته", "Last 30 days", "过去 30 天", "Últimos 30 días", "Последние 30 дней", "Últimos 30 dias", "30 derniers jours", "Letzte 30 Tage", "過去30日間"),
  volume: message("کل درخواست‌های رزرو", "Booking requests", "预约请求", "Solicitudes de reserva", "Заявки на запись", "Solicitações de agendamento", "Demandes de réservation", "Buchungsanfragen", "予約リクエスト"),
  approved: message("تأییدشده", "Approved", "已批准", "Aprobadas", "Подтверждено", "Aprovadas", "Approuvées", "Bestätigt", "承認済み"),
  cancelled: message("لغوشده", "Cancelled", "已取消", "Canceladas", "Отменено", "Canceladas", "Annulées", "Storniert", "キャンセル"),
  noShow: message("عدم حضور", "No-show", "未到店", "Ausencias", "Неявка", "Não compareceu", "Absences", "Nicht erschienen", "無断欠席"),
  sourcesTitle: message("منبع رزرو", "Booking source", "预约来源", "Origen de reserva", "Источник записи", "Origem do agendamento", "Source des réservations", "Buchungsquelle", "予約経路"),
  online: message("آنلاین", "Online", "在线", "En línea", "Онлайн", "Online", "En ligne", "Online", "オンライン"),
  manual: message("دستی", "Manual", "手动", "Manual", "Вручную", "Manual", "Manuelle", "Manuell", "手動"),
  voice: message("تلفن گویا", "Voice booking", "语音预约", "Reserva por voz", "Голосовая запись", "Agendamento por voz", "Réservation vocale", "Sprachbuchung", "音声予約"),
  outcomesTitle: message("نتیجه درخواست‌ها", "Request outcomes", "请求结果", "Resultados de solicitudes", "Результаты заявок", "Resultados das solicitações", "Résultats des demandes", "Anfrageergebnisse", "リクエスト結果"),
  performanceTitle: message("عملکرد خدمات و تیم", "Service and team performance", "服务与团队表现", "Rendimiento de servicios y equipo", "Эффективность услуг и команды", "Desempenho de serviços e equipe", "Performance des services et de l’équipe", "Leistung von Services und Team", "サービス・チーム実績"),
  serviceA: message("خدمت نمونه الف", "Sample service A", "示例服务 A", "Servicio de ejemplo A", "Пример услуги A", "Serviço de exemplo A", "Service exemple A", "Beispielservice A", "サンプルサービス A"),
  serviceB: message("خدمت نمونه ب", "Sample service B", "示例服务 B", "Servicio de ejemplo B", "Пример услуги B", "Serviço de exemplo B", "Service exemple B", "Beispielservice B", "サンプルサービス B"),
  teamMember: message("عضو نمونه تیم", "Sample team member", "示例团队成员", "Miembro de equipo de ejemplo", "Пример сотрудника", "Membro de equipe de exemplo", "Membre d’équipe exemple", "Beispiel-Teammitglied", "サンプルチームメンバー"),
  completedBookings: message("{{count}} رزرو تکمیل‌شده", "{{count}} completed bookings", "{{count}} 个已完成预约", "{{count}} reservas completadas", "Завершено записей: {{count}}", "{{count}} agendamentos concluídos", "{{count}} réservations terminées", "{{count}} abgeschlossene Buchungen", "完了予約 {{count}}件"),
  conversionTitle: message("تبدیل لینک و QR", "Link and QR conversion", "链接和二维码转化", "Conversión de enlaces y QR", "Конверсия ссылок и QR", "Conversão de link e QR", "Conversion lien et QR", "Link- und QR-Konversion", "リンク・QRコンバージョン"),
  publicLink: message("لینک عمومی", "Public link", "公开链接", "Enlace público", "Публичная ссылка", "Link público", "Lien public", "Öffentlicher Link", "公開リンク"),
  qrLink: message("لینک QR", "QR link", "二维码链接", "Enlace QR", "QR-ссылка", "Link QR", "Lien QR", "QR-Link", "QRリンク"),
  conversions: message("{{visits}} بازدید، {{bookings}} رزرو", "{{visits}} visits, {{bookings}} bookings", "{{visits}} 次访问，{{bookings}} 个预约", "{{visits}} visitas, {{bookings}} reservas", "Посещений: {{visits}}, записей: {{bookings}}", "{{visits}} visitas, {{bookings}} agendamentos", "{{visits}} visites, {{bookings}} réservations", "{{visits}} Besuche, {{bookings}} Buchungen", "{{visits}}回訪問、{{bookings}}件予約"),
  advancedTitle: message("گزارش‌های غنی‌تر", "Richer reporting", "更丰富的报表", "Informes ampliados", "Расширенная отчётность", "Relatórios avançados", "Rapports enrichis", "Erweiterte Berichte", "高度なレポート"),
  advancedBody: message("تحلیل پیشرفته و گزارش تیم یا شعبه در طرح‌های واجد شرایط ارائه می‌شود. دسترسی فعلی را در بخش طرح و پرداخت بررسی کنید.", "Advanced analytics and team or branch reporting are available on eligible plans. Check Plan & billing for current availability.", "高级分析以及团队或门店报表适用于符合条件的套餐。请在“套餐与账单”中查看当前可用性。", "Los análisis avanzados y los informes de equipo o sucursal están disponibles en planes compatibles. Consulta Plan y facturación.", "Расширенная аналитика и отчёты команды или филиала доступны в подходящих тарифах. Проверьте раздел тарифов и оплаты.", "Análises avançadas e relatórios de equipe ou filial estão disponíveis em planos elegíveis. Consulte Plano e cobrança.", "Les analyses avancées et les rapports d’équipe ou de succursale sont proposés avec les forfaits éligibles. Consultez Forfait et facturation.", "Erweiterte Analysen sowie Team- oder Filialberichte sind in geeigneten Tarifen verfügbar. Prüfen Sie Tarif & Abrechnung.", "高度な分析とチーム・店舗レポートは対象プランで利用できます。現在の状況はプランと請求で確認してください。"),
  entitlementPending: message("در طرح‌های واجد شرایط", "Available on eligible plans", "适用于符合条件的套餐", "Disponible en planes compatibles", "Доступно в подходящих тарифах", "Disponível em planos elegíveis", "Disponible avec les forfaits éligibles", "In geeigneten Tarifen verfügbar", "対象プランで利用可能"),
} as const;

export type ReportsMessages = Record<keyof typeof messages, string>;

export const reportsResources = Object.fromEntries(
  supportedLanguages.map((language, languageIndex) => [
    language,
    Object.fromEntries(Object.entries(messages).map(([key, values]) => [key, values[languageIndex]])),
  ]),
) as Record<AppLanguage, ReportsMessages>;

export const reportsI18n = {
  namespace: reportsNamespace,
  resources: reportsResources,
} as const;
