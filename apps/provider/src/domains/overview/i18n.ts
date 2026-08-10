import {
  supportedLanguages,
  type AppLanguage,
} from "@/shared/i18n/languages";

export const overviewNamespace = "overview" as const;

type MessageTuple = readonly [
  fa: string,
  en: string,
  zh: string,
  es: string,
  ru: string,
  pt: string,
  fr: string,
  de: string,
  ja: string,
];

type Resource = { [key: string]: string | Resource };

const message = (...values: MessageTuple) => values;

const messages = {
  "service.assessment": message("ارزیابی تخصصی", "Specialist assessment", "专业评估", "Evaluación especializada", "Специализированная оценка", "Avaliação especializada", "Évaluation spécialisée", "Fachliche Beurteilung", "専門評価"),
  "customer.manual": message("مراجع ثبت دستی", "Manually added customer", "手动添加的客户", "Cliente añadido manualmente", "Клиент добавлен вручную", "Cliente adicionado manualmente", "Client ajouté manuellement", "Manuell hinzugefügter Kunde", "手動追加の顧客"),
  "page.title": message("امروز در نوبت‌نو", "Today at Nobateno", "Nobateno 今日概览", "Hoy en Nobateno", "Сегодня в Nobateno", "Hoje no Nobateno", "Aujourd’hui sur Nobateno", "Heute bei Nobateno", "Nobateno の今日"),
  "page.subtitle": message("نوبت‌های امروز، درخواست‌های در انتظار و ظرفیت قابل رزرو را یک‌جا مدیریت کنید.", "Manage today's appointments, pending requests, and bookable capacity in one place.", "集中管理今日预约、待处理请求和可预约时段。", "Gestiona en un solo lugar las citas de hoy, las solicitudes pendientes y la capacidad disponible.", "Управляйте сегодняшними записями, ожидающими запросами и доступными слотами в одном месте.", "Gerencie em um só lugar os agendamentos de hoje, as solicitações pendentes e os horários disponíveis.", "Gérez au même endroit les rendez-vous du jour, les demandes en attente et les créneaux disponibles.", "Verwalten Sie heutige Termine, offene Anfragen und buchbare Kapazitäten an einem Ort.", "本日の予約、保留中のリクエスト、予約可能枠を一か所で管理できます。"),
  "trial.title": message("۱۲ روز از دوره آزمایشی باقی مانده است", "12 days remain in your trial", "试用期还剩 12 天", "Quedan 12 días de prueba", "До конца пробного периода осталось 12 дней", "Restam 12 dias do período de avaliação", "Il reste 12 jours d’essai", "Ihre Testphase läuft noch 12 Tage", "トライアルは残り12日です"),
  "trial.body": message("برای جلوگیری از توقف رزرو آنلاین، پیش از پایان دوره آزمایشی طرح مناسب را انتخاب کنید.", "Choose a plan before the trial ends to keep online booking available.", "请在试用期结束前选择方案，以保持在线预约可用。", "Elige un plan antes de que termine la prueba para mantener activas las reservas en línea.", "Выберите тариф до окончания пробного периода, чтобы сохранить онлайн-запись.", "Escolha um plano antes do fim da avaliação para manter o agendamento online disponível.", "Choisissez une offre avant la fin de l’essai pour maintenir la réservation en ligne.", "Wählen Sie vor Ablauf der Testphase einen Tarif, damit Online-Buchungen verfügbar bleiben.", "オンライン予約を継続するには、トライアル終了前にプランを選択してください。"),
  "trial.action": message("مشاهده طرح‌ها", "View plans", "查看方案", "Ver planes", "Посмотреть тарифы", "Ver planos", "Voir les offres", "Tarife ansehen", "プランを見る"),
  "metrics.today": message("نوبت‌های امروز", "Today's appointments", "今日预约", "Citas de hoy", "Записи на сегодня", "Agendamentos de hoje", "Rendez-vous du jour", "Heutige Termine", "本日の予約"),
  "metrics.todayHint": message("۲ نوبت تا ظهر", "2 appointments before noon", "中午前有 2 个预约", "2 citas antes del mediodía", "2 записи до полудня", "2 agendamentos antes do meio-dia", "2 rendez-vous avant midi", "2 Termine vor Mittag", "正午までに2件"),
  "metrics.pending": message("در انتظار تأیید", "Pending approval", "待确认", "Pendientes de aprobación", "Ожидают подтверждения", "Aguardando aprovação", "En attente d’approbation", "Warten auf Bestätigung", "承認待ち"),
  "metrics.pendingHint": message("نیازمند بررسی شما", "Need your review", "需要您审核", "Requieren tu revisión", "Требуют проверки", "Precisam da sua análise", "À vérifier", "Ihre Prüfung ist erforderlich", "確認が必要です"),
  "metrics.upcoming": message("نوبت‌های پیش‌رو", "Upcoming appointments", "即将到来的预约", "Próximas citas", "Предстоящие записи", "Próximos agendamentos", "Prochains rendez-vous", "Anstehende Termine", "今後の予約"),
  "metrics.upcomingHint": message("در ۷ روز آینده", "In the next 7 days", "未来 7 天", "En los próximos 7 días", "В ближайшие 7 дней", "Nos próximos 7 dias", "Dans les 7 prochains jours", "In den nächsten 7 Tagen", "今後7日間"),
  "metrics.openSlots": message("ظرفیت خالی امروز", "Open slots today", "今日空闲时段", "Huecos disponibles hoy", "Свободные слоты сегодня", "Horários livres hoje", "Créneaux libres aujourd’hui", "Freie Zeitfenster heute", "本日の空き枠"),
  "metrics.openSlotsHint": message("نزدیک‌ترین زمان: ۱۴:۳۰", "Next opening: 14:30", "最近空档：14:30", "Próximo hueco: 14:30", "Ближайшее окно: 14:30", "Próximo horário: 14:30", "Prochain créneau : 14:30", "Nächster Termin: 14:30", "次の空き：14:30"),
  "sections.today": message("برنامه امروز", "Today's schedule", "今日安排", "Agenda de hoy", "Расписание на сегодня", "Agenda de hoje", "Programme du jour", "Heutiger Zeitplan", "本日の予定"),
  "sections.pending": message("درخواست‌های در انتظار", "Pending requests", "待处理请求", "Solicitudes pendientes", "Ожидающие запросы", "Solicitações pendentes", "Demandes en attente", "Offene Anfragen", "保留中のリクエスト"),
  "sections.availability": message("وضعیت ظرفیت", "Availability status", "可用时段状态", "Estado de disponibilidad", "Статус доступности", "Status de disponibilidade", "État des disponibilités", "Verfügbarkeitsstatus", "空き状況"),
  "sections.quickActions": message("دسترسی سریع", "Quick actions", "快捷操作", "Acciones rápidas", "Быстрые действия", "Ações rápidas", "Actions rapides", "Schnellaktionen", "クイック操作"),
  "schedule.time": message("زمان", "Time", "时间", "Hora", "Время", "Horário", "Heure", "Zeit", "時間"),
  "schedule.appointment": message("نوبت", "Appointment", "预约", "Cita", "Запись", "Agendamento", "Rendez-vous", "Termin", "予約"),
  "schedule.customer": message("مشتری", "Customer", "客户", "Cliente", "Клиент", "Cliente", "Client", "Kunde", "顧客"),
  "schedule.service": message("خدمت", "Service", "服务", "Servicio", "Услуга", "Serviço", "Service", "Leistung", "サービス"),
  "schedule.source": message("منبع", "Source", "来源", "Origen", "Источник", "Origem", "Source", "Quelle", "受付経路"),
  "schedule.status": message("وضعیت", "Status", "状态", "Estado", "Статус", "Status", "Statut", "Status", "ステータス"),
  "schedule.action": message("عملیات", "Action", "操作", "Acción", "Действие", "Ação", "Action", "Aktion", "操作"),
  "schedule.duration": message("{{count}} دقیقه", "{{count}} min", "{{count}} 分钟", "{{count}} min", "{{count}} мин", "{{count}} min", "{{count}} min", "{{count}} Min.", "{{count}}分"),
  "service.consultation": message("مشاوره اولیه", "Initial consultation", "初次咨询", "Consulta inicial", "Первичная консультация", "Consulta inicial", "Consultation initiale", "Erstberatung", "初回相談"),
  "service.followUp": message("پیگیری تخصصی", "Specialist follow-up", "专业复诊", "Seguimiento especializado", "Повторная консультация", "Acompanhamento especializado", "Suivi spécialisé", "Fachliche Nachsorge", "専門フォローアップ"),
  "service.wellness": message("جلسه مراقبتی", "Wellness session", "护理服务", "Sesión de bienestar", "Оздоровительный сеанс", "Sessão de bem-estar", "Séance de bien-être", "Wellness-Termin", "ウェルネスセッション"),
  "customer.new": message("مراجع جدید", "New customer", "新客户", "Cliente nuevo", "Новый клиент", "Novo cliente", "Nouveau client", "Neukunde", "新規顧客"),
  "customer.returning": message("مراجع بازگشتی", "Returning customer", "回访客户", "Cliente recurrente", "Постоянный клиент", "Cliente recorrente", "Client régulier", "Stammkunde", "リピーター"),
  "source.online": message("رزرو آنلاین", "Online booking", "在线预约", "Reserva en línea", "Онлайн-запись", "Agendamento online", "Réservation en ligne", "Online-Buchung", "オンライン予約"),
  "source.manual": message("ثبت دستی", "Manual booking", "手动创建", "Reserva manual", "Ручная запись", "Agendamento manual", "Réservation manuelle", "Manuelle Buchung", "手動予約"),
  "source.voice": message("دستیار صوتی", "Voice assistant", "语音助手", "Asistente de voz", "Голосовой помощник", "Assistente de voz", "Assistant vocal", "Sprachassistent", "音声アシスタント"),
  "status.pending": message("در انتظار", "Pending", "待处理", "Pendiente", "Ожидает", "Pendente", "En attente", "Ausstehend", "保留中"),
  "status.approved": message("تأییدشده", "Approved", "已确认", "Aprobada", "Подтверждено", "Aprovado", "Approuvé", "Bestätigt", "承認済み"),
  "common.viewAll": message("مشاهده همه", "View all", "查看全部", "Ver todo", "Посмотреть все", "Ver tudo", "Tout voir", "Alle anzeigen", "すべて表示"),
  "common.review": message("بررسی درخواست", "Review request", "审核请求", "Revisar solicitud", "Проверить запрос", "Analisar solicitação", "Examiner la demande", "Anfrage prüfen", "リクエストを確認"),
  "availability.summary": message("امروز ۶ بازه قابل رزرو باقی مانده است. ساعت کاری تا ۱۸:۰۰ تنظیم شده است.", "6 bookable slots remain today. Working hours are set through 18:00.", "今日还有 6 个可预约时段，营业时间设置至 18:00。", "Quedan 6 huecos reservables hoy. El horario está configurado hasta las 18:00.", "Сегодня осталось 6 доступных слотов. Рабочее время установлено до 18:00.", "Restam 6 horários disponíveis hoje. O expediente está configurado até 18:00.", "Il reste 6 créneaux réservables aujourd’hui. Les horaires sont définis jusqu’à 18 h.", "Heute sind noch 6 buchbare Zeitfenster frei. Die Arbeitszeit ist bis 18:00 Uhr eingestellt.", "本日は予約可能枠が6件残っています。営業時間は18:00までです。"),
  "availability.action": message("مدیریت ظرفیت", "Manage availability", "管理可用时段", "Gestionar disponibilidad", "Настроить доступность", "Gerenciar disponibilidade", "Gérer les disponibilités", "Verfügbarkeit verwalten", "空き状況を管理"),
  "quick.manualTitle": message("ثبت نوبت دستی", "Create manual booking", "创建手动预约", "Crear reserva manual", "Создать запись вручную", "Criar agendamento manual", "Créer une réservation manuelle", "Manuelle Buchung erstellen", "手動予約を作成"),
  "quick.manualBody": message("نوبت تلفنی یا حضوری را ثبت کنید.", "Record a phone or walk-in appointment.", "登记电话或到店预约。", "Registra una cita telefónica o presencial.", "Добавьте запись по телефону или при личном обращении.", "Registre um agendamento por telefone ou presencial.", "Enregistrez un rendez-vous pris par téléphone ou sur place.", "Erfassen Sie einen telefonischen oder persönlichen Termin.", "電話または来店予約を登録します。"),
  "quick.reservationsTitle": message("مدیریت نوبت‌ها", "Manage appointments", "管理预约", "Gestionar citas", "Управление записями", "Gerenciar agendamentos", "Gérer les rendez-vous", "Termine verwalten", "予約を管理"),
  "quick.reservationsBody": message("جستجو، فیلتر و پیگیری وضعیت نوبت‌ها.", "Search, filter, and update appointment statuses.", "搜索、筛选并更新预约状态。", "Busca, filtra y actualiza el estado de las citas.", "Ищите, фильтруйте и обновляйте статусы записей.", "Pesquise, filtre e atualize o status dos agendamentos.", "Recherchez, filtrez et mettez à jour le statut des rendez-vous.", "Suchen, filtern und aktualisieren Sie Terminstatus.", "予約の検索、絞り込み、ステータス更新を行います。"),
  "quick.servicesTitle": message("خدمات", "Services", "服务", "Servicios", "Услуги", "Serviços", "Services", "Leistungen", "サービス"),
  "quick.servicesBody": message("مدت، قیمت و وضعیت انتشار خدمات را بررسی کنید.", "Review service duration, pricing, and publication status.", "检查服务时长、价格和发布状态。", "Revisa la duración, los precios y el estado de publicación.", "Проверьте длительность, цены и статус публикации услуг.", "Revise duração, preços e status de publicação dos serviços.", "Vérifiez la durée, les tarifs et le statut de publication des services.", "Prüfen Sie Dauer, Preise und Veröffentlichungsstatus Ihrer Leistungen.", "サービス時間、料金、公開状態を確認します。"),
  "quick.availabilityTitle": message("ساعات کاری و ظرفیت", "Hours and availability", "营业时间与可用时段", "Horario y disponibilidad", "Часы работы и доступность", "Horários e disponibilidade", "Horaires et disponibilités", "Öffnungszeiten und Verfügbarkeit", "営業時間と空き状況"),
  "quick.availabilityBody": message("برنامه هفتگی و استثناهای تاریخ‌دار را تنظیم کنید.", "Set weekly hours and date-specific exceptions.", "设置每周营业时间和指定日期例外。", "Configura el horario semanal y las excepciones por fecha.", "Настройте недельный график и исключения по датам.", "Configure horários semanais e exceções por data.", "Définissez les horaires hebdomadaires et les exceptions datées.", "Legen Sie Wochenzeiten und datumsbezogene Ausnahmen fest.", "週間営業時間と日付別の例外を設定します。"),
  "trial.statusTitle": message("وضعیت طرح و دوره آزمایشی", "Plan and trial status", "方案和试用状态", "Estado del plan y la prueba", "Статус тарифа и пробного периода", "Status do plano e da avaliação", "État de l’offre et de l’essai", "Tarif- und Teststatus", "プランとトライアルの状態"),
  "trial.statusBody": message("وضعیت نهایی حساب پس از همگام‌سازی با سرویس تأیید می‌شود.", "Your account status will be confirmed after it syncs with the service.", "账户与服务同步后将确认最终状态。", "El estado de la cuenta se confirmará al sincronizar con el servicio.", "Статус аккаунта будет подтверждён после синхронизации с сервисом.", "O status da conta será confirmado após a sincronização com o serviço.", "L’état du compte sera confirmé après synchronisation avec le service.", "Der Kontostatus wird nach der Synchronisierung mit dem Dienst bestätigt.", "サービスとの同期後にアカウント状態が確定します。"),
  "metrics.unavailable": message("پس از اتصال به سرویس نمایش داده می‌شود", "Available after service sync", "服务同步后可用", "Disponible tras sincronizar con el servicio", "Доступно после синхронизации с сервисом", "Disponível após sincronizar com o serviço", "Disponible après synchronisation avec le service", "Nach der Dienstsynchronisierung verfügbar", "サービス同期後に利用できます"),
  // Kept as neutral compatibility copy for the reusable locale-aware slider test.
  "promotions.newFeatureTitle": message("قابلیت جدید", "New feature", "新功能", "Nueva función", "Новая функция", "Novo recurso", "Nouvelle fonctionnalité", "Neue Funktion", "新機能"),
  "promotions.stayAhead": message("همیشه به‌روز بمانید", "Stay up to date", "保持最新", "Mantente al día", "Будьте в курсе", "Mantenha-se atualizado", "Restez à jour", "Bleiben Sie auf dem Laufenden", "最新情報を確認"),
} as const;

const setNestedValue = (resource: Resource, path: string, value: string) => {
  const segments = path.split(".");
  let cursor = resource;
  segments.forEach((segment, index) => {
    if (index === segments.length - 1) {
      cursor[segment] = value;
      return;
    }
    const existing = cursor[segment];
    if (!existing || typeof existing === "string") cursor[segment] = {};
    cursor = cursor[segment] as Resource;
  });
};

const buildResource = (languageIndex: number): Resource => {
  const resource: Resource = {};
  Object.entries(messages).forEach(([key, values]) => {
    setNestedValue(resource, key, values[languageIndex]);
  });
  return resource;
};

export type OverviewResource = Resource;

export const overviewResources = Object.fromEntries(
  supportedLanguages.map((language, index) => [language, buildResource(index)]),
) as Record<AppLanguage, OverviewResource>;

export const overviewI18n = {
  namespace: overviewNamespace,
  resources: overviewResources,
} as const;
