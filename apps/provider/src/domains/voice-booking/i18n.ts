import {
  supportedLanguages,
  type AppLanguage,
} from "@/shared/i18n/languages";

export const voiceBookingNamespace = "voiceBooking" as const;

type MessageTuple = readonly [string, string, string, string, string, string, string, string, string];
const message = (...values: MessageTuple) => values;

const messages = {
  eyebrow: message("تلفن گویا", "Voice booking", "语音预约", "Reserva por voz", "Голосовая запись", "Agendamento por voz", "Réservation vocale", "Sprachbuchung", "音声予約"),
  title: message("ورودی تلفنی نوبت‌ها", "Phone booking intake", "电话预约受理", "Recepción de reservas telefónicas", "Приём записи по телефону", "Recepção de agendamentos por telefone", "Prise de rendez-vous par téléphone", "Telefonische Buchungsannahme", "電話予約の受付"),
  description: message("رفتار تلفن گویا و درخواست‌های حاصل از تماس را بدون نمایش اطلاعات شخصی مدیریت کنید.", "Review voice-channel behavior and call-derived requests without exposing personal data.", "管理语音渠道行为和来电预约请求，不显示个人数据。", "Revisa el canal de voz y las solicitudes de llamadas sin exponer datos personales.", "Проверяйте правила голосового канала и заявки из звонков без персональных данных.", "Revise o canal de voz e solicitações de chamadas sem expor dados pessoais.", "Contrôlez le canal vocal et les demandes issues des appels sans données personnelles.", "Prüfen Sie Sprachkanal und Anfragen aus Anrufen ohne personenbezogene Daten.", "個人情報を表示せず、音声チャネルと通話由来の依頼を確認します。"),
  boundaryTitle: message("وضعیت یکپارچه‌سازی تلفنی", "Telephony integration status", "电话集成状态", "Estado de integración telefónica", "Статус интеграции телефонии", "Status da integração telefônica", "État de l’intégration téléphonique", "Status der Telefonie-Integration", "電話連携の状態"),
  boundaryBody: message("اتصال سرویس‌دهنده تلفنی و اجرای تماس به سرویس سمت سرور نیاز دارد. این صفحه اتصال یا تماس موفق را شبیه‌سازی نمی‌کند.", "A telephony provider and server service are required to place or receive calls. This page never simulates a successful connection or call.", "拨打或接听电话需要电话供应商和服务器服务。本页不会模拟连接或通话成功。", "Se requiere un proveedor telefónico y un servicio del servidor. Esta página no simula conexiones ni llamadas exitosas.", "Для звонков нужны телефония и серверный сервис. Страница не имитирует успешное подключение или звонок.", "É necessário um provedor de telefonia e serviço no servidor. A página não simula conexão ou chamada bem-sucedida.", "Un opérateur téléphonique et un service serveur sont requis. Cette page ne simule jamais une connexion ou un appel réussi.", "Für Anrufe sind Telefonieanbieter und Serverdienst nötig. Diese Seite simuliert keine erfolgreiche Verbindung oder Anrufe.", "通話には電話事業者とサーバーサービスが必要です。この画面は接続や通話成功を模擬しません。"),
  disconnected: message("متصل نیست", "Not connected", "未连接", "Sin conexión", "Не подключено", "Não conectado", "Non connecté", "Nicht verbunden", "未接続"),
  checkConnection: message("بررسی اتصال", "Check integration", "检查集成", "Comprobar integración", "Проверить интеграцию", "Verificar integração", "Vérifier l’intégration", "Integration prüfen", "連携を確認"),
  checkResult: message("بررسی زنده پس از اتصال سرویس سمت سرور در دسترس است.", "A live integration check becomes available after the server service is connected.", "服务器服务连接后即可进行实时检查。", "La comprobación estará disponible al conectar el servicio del servidor.", "Проверка станет доступна после подключения серверного сервиса.", "A verificação ficará disponível após conectar o serviço do servidor.", "La vérification sera disponible après connexion du service serveur.", "Die Live-Prüfung ist nach Verbindung des Serverdiensts verfügbar.", "サーバーサービス接続後に確認できます。"),
  policyTitle: message("رفتار رزرو", "Booking behavior", "预约行为", "Comportamiento de reserva", "Правила бронирования", "Comportamento da reserva", "Comportement de réservation", "Buchungsverhalten", "予約動作"),
  activeServices: message("فقط خدمات فعال به تماس‌گیرنده ارائه می‌شود.", "Only active services are offered to callers.", "仅向来电者提供启用的服务。", "Solo se ofrecen servicios activos.", "Звонящим предлагаются только активные услуги.", "Somente serviços ativos são oferecidos.", "Seuls les services actifs sont proposés.", "Nur aktive Leistungen werden angeboten.", "有効なサービスのみ案内します。"),
  availabilityRules: message("همان قواعد ظرفیت، ساعت کاری و تداخل پنل اعمال می‌شود.", "The same capacity, working-hours, and conflict rules as the panel apply.", "采用与面板相同的容量、工作时间和冲突规则。", "Se aplican las mismas reglas de capacidad, horario y conflictos del panel.", "Действуют те же правила вместимости, часов работы и конфликтов.", "Aplicam-se as mesmas regras de capacidade, horário e conflitos.", "Les mêmes règles de capacité, horaires et conflits s’appliquent.", "Es gelten dieselben Kapazitäts-, Arbeitszeit- und Konfliktregeln.", "管理画面と同じ定員・営業時間・重複ルールを適用します。"),
  approvalRules: message("درخواست تلفنی تا بازبینی کسب‌وکار در انتظار تأیید می‌ماند.", "A call-derived request remains pending until provider review.", "来电请求在服务商审核前保持待确认。", "La solicitud de llamada queda pendiente hasta la revisión del proveedor.", "Заявка из звонка остаётся на подтверждении до проверки.", "A solicitação da chamada fica pendente até revisão do prestador.", "La demande issue d’un appel reste en attente jusqu’à la vérification.", "Eine Anrufanfrage bleibt bis zur Anbieterprüfung ausstehend.", "通話由来の依頼は事業者確認まで承認待ちです。"),
  fallbackLabel: message("نتیجه اطمینان پایین", "Low-confidence fallback", "低置信度处理", "Alternativa de baja confianza", "Действие при низкой уверенности", "Ação para baixa confiança", "Traitement en cas de faible confiance", "Fallback bei geringer Sicherheit", "低信頼時の処理"),
  manualReview: message("ارسال به بازبینی دستی؛ رزرو ایجاد نشود", "Send to manual review; create no booking", "发送人工审核；不创建预约", "Enviar a revisión manual; no crear reserva", "Передать на ручную проверку; не создавать запись", "Enviar para revisão manual; não criar agendamento", "Envoyer en vérification manuelle ; ne pas créer de réservation", "Zur manuellen Prüfung; keine Buchung erstellen", "手動確認へ送り、予約は作成しない"),
  fallbackHelp: message("برای ایمنی، درخواست‌های با اطمینان پایین همیشه به بازبینی دستی می‌روند و خودکار رزرو ایجاد نمی‌کنند.", "For safety, low-confidence requests always go to manual review and never create a booking automatically.", "为确保安全，低置信度请求始终转交人工审核，且不会自动创建预约。", "Por seguridad, las solicitudes de baja confianza siempre pasan a revisión manual y nunca crean una reserva automáticamente.", "Для безопасности запросы с низкой уверенностью всегда отправляются на ручную проверку и не создают запись автоматически.", "Por segurança, solicitações de baixa confiança sempre passam por revisão manual e nunca criam um agendamento automaticamente.", "Par sécurité, les demandes peu fiables passent toujours en vérification manuelle et ne créent jamais de réservation automatiquement.", "Aus Sicherheitsgründen werden Anfragen mit geringer Sicherheit immer manuell geprüft und erstellen nie automatisch eine Buchung.", "安全のため、信頼度の低い依頼は必ず手動確認に回され、自動で予約を作成しません。"),
  notifyLabel: message("اعلان داخل پنل برای درخواست نیازمند بازبینی", "In-app alert for requests needing review", "对需审核请求发送应用内提醒", "Aviso interno para solicitudes a revisar", "Уведомлять в приложении о заявках на проверку", "Alerta no aplicativo para solicitações em revisão", "Alerte dans l’application pour les demandes à vérifier", "In-App-Hinweis für zu prüfende Anfragen", "要確認依頼をアプリ内通知"),
  save: message("ذخیره سیاست بازبینی", "Save review policy", "保存审核策略", "Guardar política de revisión", "Сохранить правила проверки", "Salvar política de revisão", "Enregistrer la règle de vérification", "Prüfrichtlinie speichern", "確認ポリシーを保存"),
  saved: message("سیاست بازبینی تلفن گویا ذخیره شد.", "Voice-booking review policy saved.", "语音预约审核策略已保存。", "Política de revisión guardada.", "Правила проверки голосовой записи сохранены.", "Política de revisão salva.", "Règle de vérification enregistrée.", "Prüfrichtlinie gespeichert.", "音声予約の確認ポリシーを保存しました。"),
  historyTitle: message("سابقه درخواست‌های تلفنی", "Call-derived request history", "来电请求历史", "Historial de solicitudes por llamada", "История заявок из звонков", "Histórico de solicitações por chamada", "Historique des demandes téléphoniques", "Verlauf der Anrufanfragen", "通話由来リクエスト履歴"),
  demoNotice: message("داده نمایشی بدون نام یا شماره تماس", "Demonstration data with no names or phone numbers", "演示数据，不含姓名或电话号码", "Datos de demostración sin nombres ni teléfonos", "Демонстрационные данные без имён и телефонов", "Dados de demonstração sem nomes ou telefones", "Données de démonstration sans noms ni numéros", "Demodaten ohne Namen oder Telefonnummern", "氏名・電話番号を含まないデモデータ"),
  reference: message("مرجع", "Reference", "参考号", "Referencia", "Ссылка", "Referência", "Référence", "Referenz", "参照"),
  received: message("دریافت", "Received", "接收时间", "Recibida", "Получено", "Recebida", "Reçue", "Eingang", "受付"),
  confidence: message("اطمینان", "Confidence", "置信度", "Confianza", "Уверенность", "Confiança", "Confiance", "Sicherheit", "信頼度"),
  outcome: message("نتیجه", "Outcome", "结果", "Resultado", "Результат", "Resultado", "Résultat", "Ergebnis", "結果"),
  low: message("پایین", "Low", "低", "Baja", "Низкая", "Baixa", "Faible", "Gering", "低"),
  medium: message("متوسط", "Medium", "中", "Media", "Средняя", "Média", "Moyenne", "Mittel", "中"),
  needsReview: message("نیازمند بازبینی؛ رزروی ایجاد نشد", "Needs review; no booking created", "需审核；未创建预约", "Requiere revisión; no se creó reserva", "Нужна проверка; запись не создана", "Requer revisão; agendamento não criado", "À vérifier ; aucune réservation créée", "Prüfung nötig; keine Buchung erstellt", "要確認；予約未作成"),
  today: message("امروز", "Today", "今天", "Hoy", "Сегодня", "Hoje", "Aujourd’hui", "Heute", "今日"),
} as const;

export type VoiceBookingMessages = Record<keyof typeof messages, string>;

export const voiceBookingResources = Object.fromEntries(
  supportedLanguages.map((language, languageIndex) => [
    language,
    Object.fromEntries(Object.entries(messages).map(([key, values]) => [key, values[languageIndex]])),
  ]),
) as Record<AppLanguage, VoiceBookingMessages>;

export const voiceBookingI18n = {
  namespace: voiceBookingNamespace,
  resources: voiceBookingResources,
} as const;
