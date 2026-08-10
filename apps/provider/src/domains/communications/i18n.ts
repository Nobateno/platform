import {
  supportedLanguages,
  type AppLanguage,
} from "@/shared/i18n/languages";

export const communicationsNamespace = "communications" as const;

type MessageTuple = readonly [string, string, string, string, string, string, string, string, string];
const message = (...values: MessageTuple) => values;

const messages = {
  eyebrow: message("ارتباطات", "Communications", "通信", "Comunicaciones", "Коммуникации", "Comunicações", "Communications", "Kommunikation", "通知連携"),
  title: message("یادآوری‌ها و پیام‌های عملیاتی", "Operational reminders and messages", "运营提醒与消息", "Recordatorios y mensajes operativos", "Операционные напоминания и сообщения", "Lembretes e mensagens operacionais", "Rappels et messages opérationnels", "Betriebliche Erinnerungen und Nachrichten", "運用リマインダーとメッセージ"),
  description: message("قواعد پیام‌های رزرو را تنظیم کنید و پیش از فعال‌سازی پیامک، نیاز به استعلام هزینه را ببینید.", "Configure booking-message rules and see when a live token quote is required before SMS activation.", "配置预约消息规则，并在启用短信前查看是否需要实时费用报价。", "Configura reglas de mensajes y comprueba si se necesita una cotización antes de activar SMS.", "Настройте правила сообщений и проверьте, нужен ли расчёт токенов перед SMS.", "Configure regras de mensagens e veja quando é necessária uma cotação antes de ativar SMS.", "Configurez les règles et vérifiez si un devis de jetons est requis avant les SMS.", "Konfigurieren Sie Nachrichtenregeln und sehen Sie, wann vor SMS-Aktivierung ein Tokenangebot nötig ist.", "予約メッセージのルールを設定し、SMS有効化前に見積もりが必要か確認します。"),
  boundaryTitle: message("فقط پیام‌های تراکنشی", "Transactional messages only", "仅限事务消息", "Solo mensajes transaccionales", "Только транзакционные сообщения", "Somente mensagens transacionais", "Messages transactionnels uniquement", "Nur transaktionale Nachrichten", "取引通知のみ"),
  boundaryBody: message("کد ورود و احراز هویت را پلتفرم مدیریت می‌کند؛ کمپین تبلیغاتی در حوزه رشد است.", "The platform controls OTP and authentication messages; promotional campaigns belong to Growth.", "平台管理验证码与认证消息；推广活动属于增长工具。", "La plataforma controla OTP y autenticación; las campañas pertenecen a Crecimiento.", "OTP и сообщения входа контролирует платформа; кампании относятся к росту.", "A plataforma controla OTP e autenticação; campanhas pertencem a Crescimento.", "La plateforme gère l’OTP et l’authentification ; les campagnes relèvent de Croissance.", "OTP und Authentifizierung steuert die Plattform; Kampagnen gehören zu Wachstum.", "OTPと認証メッセージはプラットフォームが管理し、販促は成長機能に属します。"),
  rulesTitle: message("قواعد پیام", "Message rules", "消息规则", "Reglas de mensajes", "Правила сообщений", "Regras de mensagens", "Règles de message", "Nachrichtenregeln", "メッセージルール"),
  reminder24Title: message("یادآوری ۲۴ ساعت قبل", "24-hour customer reminder", "提前24小时提醒客户", "Recordatorio 24 horas antes", "Напоминание за 24 часа", "Lembrete 24 horas antes", "Rappel client 24 heures avant", "Kundenerinnerung 24 Stunden vorher", "24時間前の顧客リマインダー"),
  reminder24Body: message("اگر نوبت هنوز فعال است، یادآوری برای مشتری آماده شود.", "Prepare a reminder when the appointment is still active.", "预约仍有效时准备提醒。", "Prepara un recordatorio si la cita sigue activa.", "Подготовить напоминание, если запись активна.", "Preparar lembrete se o agendamento estiver ativo.", "Préparer un rappel si le rendez-vous est actif.", "Erinnerung vorbereiten, wenn der Termin aktiv ist.", "予約が有効な場合にリマインダーを準備します。"),
  reminder1Title: message("یادآوری ۱ ساعت قبل", "1-hour customer reminder", "提前1小时提醒客户", "Recordatorio 1 hora antes", "Напоминание за 1 час", "Lembrete 1 hora antes", "Rappel client 1 heure avant", "Kundenerinnerung 1 Stunde vorher", "1時間前の顧客リマインダー"),
  reminder1Body: message("نزدیک زمان نوبت، یک یادآوری نهایی آماده شود.", "Prepare a final reminder close to the appointment time.", "临近预约时准备最终提醒。", "Prepara un recordatorio final cerca de la cita.", "Подготовить последнее напоминание перед записью.", "Preparar lembrete final próximo ao horário.", "Préparer un dernier rappel peu avant le rendez-vous.", "Kurz vor dem Termin eine letzte Erinnerung vorbereiten.", "予約時刻の近くに最終リマインダーを準備します。"),
  staffAlertTitle: message("هشدار رزرو برای تیم", "Provider and staff booking alert", "服务商与员工预约提醒", "Aviso de reserva al equipo", "Оповещение команды о записи", "Alerta de agendamento para equipe", "Alerte de réservation pour l’équipe", "Buchungswarnung für Team", "事業者・スタッフへの予約通知"),
  staffAlertBody: message("ثبت یا تغییر وضعیت نوبت را به افراد مجاز اطلاع دهید.", "Notify permitted team members about booking submissions and status changes.", "向获授权团队成员通知预约提交与状态变化。", "Avisa al equipo autorizado de solicitudes y cambios de estado.", "Сообщать уполномоченным сотрудникам о заявках и статусах.", "Avisar membros autorizados sobre solicitações e mudanças.", "Informer les membres autorisés des demandes et changements d’état.", "Berechtigte Teammitglieder über Anfragen und Statusänderungen informieren.", "権限のあるスタッフに予約申請と状態変更を通知します。"),
  enabledLabel: message("فعال‌سازی {{rule}}", "Enable {{rule}}", "启用{{rule}}", "Activar {{rule}}", "Включить: {{rule}}", "Ativar {{rule}}", "Activer {{rule}}", "{{rule}} aktivieren", "{{rule}}を有効化"),
  channel: message("کانال تحویل", "Delivery channel", "发送渠道", "Canal de entrega", "Канал доставки", "Canal de entrega", "Canal d’envoi", "Zustellkanal", "配信チャネル"),
  channelLabel: message("کانال {{rule}}", "Channel for {{rule}}", "{{rule}}的渠道", "Canal de {{rule}}", "Канал: {{rule}}", "Canal de {{rule}}", "Canal pour {{rule}}", "Kanal für {{rule}}", "{{rule}}のチャネル"),
  inApp: message("داخل پنل", "In-app", "应用内", "En la aplicación", "В приложении", "No aplicativo", "Dans l’application", "In-App", "アプリ内"),
  sms: message("پیامک", "SMS", "短信", "SMS", "SMS", "SMS", "SMS", "SMS", "SMS"),
  tokenPreviewTitle: message("پیش‌نمایش هزینه توکن", "Token cost preview", "令牌费用预览", "Vista previa de tokens", "Предпросмотр стоимости токенов", "Prévia de custo de tokens", "Aperçu du coût en jetons", "Vorschau der Tokenkosten", "トークン費用プレビュー"),
  quoteRequired: message("{{count}} قاعده پیامکی فعال برای قیمت نهایی به استعلام زنده نیاز دارد.", "{{count}} enabled SMS rule(s) require a live quote for the final token cost.", "{{count}}条已启用短信规则需要实时报价才能确定最终令牌费用。", "{{count}} regla(s) SMS activa(s) requieren cotización en vivo.", "Для {{count}} активных SMS-правил нужен актуальный расчёт токенов.", "{{count}} regra(s) SMS ativa(s) exigem cotação ao vivo.", "{{count}} règle(s) SMS active(s) nécessitent un devis en direct.", "Für {{count}} aktive SMS-Regel(n) ist ein Liveangebot erforderlich.", "有効なSMSルール{{count}}件は最終費用のライブ見積もりが必要です。"),
  noTokenRules: message("هیچ قاعده پیامکی فعالی وجود ندارد؛ هزینه توکن صفر است.", "No SMS rule is enabled; token cost is zero.", "未启用短信规则；令牌费用为零。", "No hay reglas SMS activas; el coste es cero.", "SMS-правила выключены; расход токенов нулевой.", "Nenhuma regra SMS está ativa; custo zero.", "Aucune règle SMS active ; coût nul.", "Keine SMS-Regel aktiv; Tokenkosten null.", "SMSルールが無効のためトークン費用はゼロです。"),
  balanceUnavailable: message("موجودی و قیمت بسته‌ها پس از اتصال سرویس صورتحساب نمایش داده می‌شود.", "Balance and pack prices appear after the billing service is connected.", "连接计费服务后显示余额与套餐价格。", "El saldo y los precios aparecen al conectar facturación.", "Баланс и цены появятся после подключения биллинга.", "Saldo e preços aparecem após conectar o faturamento.", "Le solde et les prix apparaissent après connexion à la facturation.", "Guthaben und Paketpreise erscheinen nach Verbindung mit der Abrechnung.", "残高とパック価格は請求サービス接続後に表示されます。"),
  noSpend: message("تا دریافت و تأیید قیمت زنده، توکنی مصرف نمی‌شود.", "No token is spent until a live quote is received and accepted.", "收到并接受实时报价前不会消耗令牌。", "No se gastan tokens hasta aceptar una cotización en vivo.", "Токены не списываются до получения и принятия расчёта.", "Nenhum token é gasto antes de aceitar a cotação.", "Aucun jeton n’est dépensé avant acceptation du devis.", "Vor Annahme eines Liveangebots werden keine Token verbraucht.", "ライブ見積もりを承認するまでトークンは消費されません。"),
  save: message("ذخیره قواعد", "Save rules", "保存规则", "Guardar reglas", "Сохранить правила", "Salvar regras", "Enregistrer les règles", "Regeln speichern", "ルールを保存"),
  saved: message("قواعد ارتباطی ذخیره شد.", "Communication rules saved.", "通信规则已保存。", "Reglas guardadas.", "Правила сохранены.", "Regras salvas.", "Règles enregistrées.", "Kommunikationsregeln gespeichert.", "通知ルールを保存しました。"),
  deliveryLog: message("گزارش تحویل", "Delivery log", "发送记录", "Registro de entregas", "Журнал доставки", "Registro de entregas", "Journal de livraison", "Zustellprotokoll", "配信ログ"),
  event: message("رویداد", "Event", "事件", "Evento", "Событие", "Evento", "Événement", "Ereignis", "イベント"),
  reference: message("مرجع", "Reference", "参考号", "Referencia", "Ссылка", "Referência", "Référence", "Referenz", "参照"),
  status: message("وضعیت", "Status", "状态", "Estado", "Статус", "Status", "Statut", "Status", "状態"),
  time: message("زمان", "Time", "时间", "Hora", "Время", "Horário", "Heure", "Zeit", "時刻"),
  bookingApproved: message("تأیید رزرو", "Booking approved", "预约已确认", "Reserva aprobada", "Запись подтверждена", "Agendamento aprovado", "Réservation approuvée", "Buchung bestätigt", "予約承認"),
  reminderPreview: message("پیش‌نمایش یادآوری", "Reminder preview", "提醒预览", "Vista previa del recordatorio", "Предпросмотр напоминания", "Prévia do lembrete", "Aperçu du rappel", "Erinnerungsvorschau", "リマインダープレビュー"),
  staffAlert: message("هشدار تیم", "Staff alert", "员工提醒", "Aviso al equipo", "Оповещение команды", "Alerta da equipe", "Alerte équipe", "Teamwarnung", "スタッフ通知"),
  delivered: message("تحویل‌شده", "Delivered", "已送达", "Entregado", "Доставлено", "Entregue", "Livré", "Zugestellt", "配信済み"),
  queued: message("در صف", "Queued", "队列中", "En cola", "В очереди", "Na fila", "En file", "In Warteschlange", "待機中"),
  previewOnly: message("فقط پیش‌نمایش", "Preview only", "仅预览", "Solo vista previa", "Только предпросмотр", "Somente prévia", "Aperçu uniquement", "Nur Vorschau", "プレビューのみ"),
  today: message("امروز", "Today", "今天", "Hoy", "Сегодня", "Hoje", "Aujourd’hui", "Heute", "今日"),
} as const;

export type CommunicationsMessages = Record<keyof typeof messages, string>;

export const communicationsResources = Object.fromEntries(
  supportedLanguages.map((language, languageIndex) => [
    language,
    Object.fromEntries(Object.entries(messages).map(([key, values]) => [key, values[languageIndex]])),
  ]),
) as Record<AppLanguage, CommunicationsMessages>;

export const communicationsI18n = {
  namespace: communicationsNamespace,
  resources: communicationsResources,
} as const;
