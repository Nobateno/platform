import type { AppLanguage } from "./languages";

const en = {
  quickSearch: {
    dialogTitle: "Search provider work",
    placeholder: "Search reservations, customers, services, or team",
    noResults: "No matching provider item",
    noResultsDescription: "No result was found for “{{query}}”. Try a reservation reference or a domain name.",
    start: "Suggested provider destinations",
    shortcutHint: "Press Ctrl+K or Command+K to open this search from anywhere.",
    openResult: "Open result",
    reservationResult: "Appointment NOB-2049",
    reservationDescription: "Pending voice-booking request",
    customerResult: "Customer 1024",
    customerDescription: "Provider-owned reservation history",
    serviceResult: "Haircut service",
    serviceDescription: "Duration, price, buffers, and booking state",
    teamResult: "Staff schedules",
    teamDescription: "Service assignments and account access",
  },
  activities: {
    title: "Operational activity",
    close: "Close activity",
    open: "Open",
    copyReference: "Copy reference",
    referenceCopied: "Reference copied.",
    copyFailed: "The reference could not be copied.",
    reservationTitle: "Reservation needs review",
    reservationBody: "A voice-booking request entered the shared reservation workflow.",
    availabilityTitle: "Availability updated",
    availabilityBody: "Working-hour rules were changed for the current business.",
    serviceTitle: "Service activated",
    serviceBody: "A service is now available in the public booking flow.",
    now: "Just now",
    today: "Today",
    yesterday: "Yesterday",
    imageAlt: "Activity attachment",
  },
  notifications: {
    title: "Notifications",
    markAllRead: "Mark all as read",
    close: "Close notifications",
    allRead: "All notifications marked as read.",
    unread: "Unread",
    pendingTitle: "Pending requests",
    pendingBody: "Two booking requests need an authorized decision.",
    availabilityTitle: "Availability gap",
    availabilityBody: "Tomorrow includes an unassigned two-hour gap.",
    tokensTitle: "Message tokens",
    tokensBody: "Review the token balance before enabling another SMS rule.",
    now: "Just now",
    today: "Today",
    yesterday: "Yesterday",
  },
  account: {
    title: "Switch business workspace",
    close: "Close workspace switcher",
    currentWorkspace: "Current authorized business",
    currentRole: "Your server-confirmed membership is active.",
    noOtherWorkspace: "No other authorized business membership is available. Workspace switching is enabled only from server-returned memberships.",
    done: "Done",
  },
  dataGrid: {
    search: "Search {{label}}", sort: "Sort", sortAscending: "Sorted ascending", sortDescending: "Sorted descending", filter: "Filter", cancel: "Cancel", apply: "Apply", edit: "Edit", delete: "Delete", actions: "Actions", empty: "No items to display", pagination: "{{label}} pages", firstPage: "First page", previousPage: "Previous page", nextPage: "Next page", lastPage: "Last page", page: "Page {{page}}", rowsPerPage: "Rows per page", selectAll: "Select all {{label}}", selectRow: "Select row {{id}}",
  },
  selection: { removeItem: "Remove this item", removeMany: "Are you sure you want to remove these {{count}} items?", removeOne: "Are you sure you want to remove “{{value}}”?" },
  accessibility: { breadcrumb: "Breadcrumb", close: "Close" },
};

type SharedUiResource = {
  [Section in keyof typeof en]: {
    [Key in keyof (typeof en)[Section]]: string;
  };
};
type SharedUiOverrides = {
  [Section in keyof SharedUiResource]?: Partial<SharedUiResource[Section]>;
};

const localized = (overrides: SharedUiOverrides): SharedUiResource => ({
  quickSearch: { ...en.quickSearch, ...overrides.quickSearch },
  activities: { ...en.activities, ...overrides.activities },
  notifications: { ...en.notifications, ...overrides.notifications },
  account: { ...en.account, ...overrides.account },
  dataGrid: { ...en.dataGrid, ...overrides.dataGrid },
  selection: { ...en.selection, ...overrides.selection },
  accessibility: { ...en.accessibility, ...overrides.accessibility },
});

export const sharedUiResources: Record<AppLanguage, SharedUiResource> = {
  en,
  fa: localized({
    quickSearch: { dialogTitle: "جست‌وجو در پنل کسب‌وکار", placeholder: "جست‌وجوی رزرو، مشتری، خدمت یا تیم", noResults: "موردی پیدا نشد", noResultsDescription: "نتیجه‌ای برای «{{query}}» پیدا نشد؛ شناسه رزرو یا نام یک بخش را امتحان کنید.", start: "مقصدهای پیشنهادی پنل", shortcutHint: "برای باز کردن جست‌وجو در هرجا Ctrl+K یا Command+K را بزنید.", openResult: "باز کردن نتیجه", reservationResult: "نوبت NOB-2049", reservationDescription: "درخواست در انتظار از تلفن گویا", customerResult: "مشتری ۱۰۲۴", customerDescription: "سابقه رزرو این کسب‌وکار", serviceResult: "خدمت کوتاهی مو", serviceDescription: "مدت، قیمت، فاصله و وضعیت رزرو", teamResult: "برنامه همکاران", teamDescription: "تخصیص خدمت و دسترسی حساب" },
    activities: { title: "فعالیت عملیاتی", close: "بستن فعالیت", open: "باز کردن", copyReference: "کپی شناسه", referenceCopied: "شناسه کپی شد.", copyFailed: "شناسه کپی نشد.", reservationTitle: "رزرو نیازمند بررسی", reservationBody: "درخواست تلفن گویا وارد روند یکپارچه رزرو شد.", availabilityTitle: "زمان‌های کاری به‌روز شد", availabilityBody: "قواعد ساعت کاری این کسب‌وکار تغییر کرد.", serviceTitle: "خدمت فعال شد", serviceBody: "خدمت در روند رزرو عمومی در دسترس قرار گرفت.", now: "همین حالا", today: "امروز", yesterday: "دیروز", imageAlt: "پیوست فعالیت" },
    notifications: { title: "اعلان‌ها", markAllRead: "خواندن همه", close: "بستن اعلان‌ها", allRead: "همه اعلان‌ها خوانده شدند.", unread: "خوانده‌نشده", pendingTitle: "درخواست‌های در انتظار", pendingBody: "دو درخواست رزرو به تصمیم فرد مجاز نیاز دارد.", availabilityTitle: "شکاف ظرفیت", availabilityBody: "فردا یک بازه دو ساعته بدون تخصیص دارد.", tokensTitle: "توکن پیام", tokensBody: "پیش از فعال کردن قاعده پیامکی جدید، موجودی را بررسی کنید.", now: "همین حالا", today: "امروز", yesterday: "دیروز" },
    account: { title: "تغییر فضای کاری کسب‌وکار", close: "بستن تغییر فضای کاری", currentWorkspace: "کسب‌وکار مجاز فعلی", currentRole: "عضویت تأییدشده سرور فعال است.", noOtherWorkspace: "عضویت مجاز دیگری در دسترس نیست. تغییر فضای کاری فقط برای عضویت‌های برگشتی از سرور فعال می‌شود.", done: "تمام" },
    dataGrid: { search: "جستجوی {{label}}", sort: "مرتب‌سازی", filter: "فیلتر", cancel: "لغو", apply: "اعمال", edit: "ویرایش", delete: "حذف", actions: "عملیات", empty: "موردی برای نمایش وجود ندارد", pagination: "صفحات {{label}}", firstPage: "صفحه نخست", previousPage: "صفحه قبل", nextPage: "صفحه بعد", lastPage: "صفحه آخر", page: "صفحه {{page}}", rowsPerPage: "تعداد ردیف در هر صفحه", selectAll: "انتخاب همه {{label}}", selectRow: "انتخاب ردیف {{id}}" },
    selection: { removeItem: "حذف این مورد", removeMany: "آیا از حذف این {{count}} مورد مطمئن هستید؟", removeOne: "آیا از حذف «{{value}}» مطمئن هستید؟" },
    accessibility: { breadcrumb: "مسیر راهنما", close: "بستن" },
  }),
  zh: localized({
    quickSearch: { dialogTitle: "搜索服务商工作", placeholder: "搜索预约、客户、服务或团队", noResults: "没有匹配项目", start: "建议的面板位置", shortcutHint: "随时按 Ctrl+K 或 Command+K 打开搜索。", openResult: "打开结果", reservationResult: "预约 NOB-2049", reservationDescription: "待处理的语音预约请求", customerResult: "客户 1024", customerDescription: "服务商拥有的预约记录", serviceResult: "理发服务", serviceDescription: "时长、价格、缓冲与预约状态", teamResult: "员工排班", teamDescription: "服务分配与账户访问" },
    activities: { title: "运营活动", close: "关闭活动", open: "打开", copyReference: "复制编号", referenceCopied: "编号已复制。", copyFailed: "无法复制编号。", reservationTitle: "预约待审核", reservationBody: "语音预约请求已进入统一预约流程。", availabilityTitle: "可用时间已更新", availabilityBody: "当前企业的营业时间规则已更改。", serviceTitle: "服务已启用", serviceBody: "服务现已出现在公开预约流程中。", now: "刚刚", today: "今天", yesterday: "昨天", imageAlt: "活动附件" },
    notifications: { title: "通知", markAllRead: "全部标为已读", close: "关闭通知", allRead: "所有通知已标为已读。", unread: "未读", pendingTitle: "待处理请求", pendingBody: "两项预约请求需要授权决定。", availabilityTitle: "可用时间缺口", availabilityBody: "明天有两小时未分配时段。", tokensTitle: "消息令牌", tokensBody: "启用新的短信规则前请检查余额。", now: "刚刚", today: "今天", yesterday: "昨天" },
    account: { title: "切换业务工作区", close: "关闭工作区切换器", currentWorkspace: "当前授权业务", currentRole: "服务器确认的成员资格已生效。", noOtherWorkspace: "没有其他授权业务。仅可切换服务器返回的成员资格。", done: "完成" },
    dataGrid: { search: "搜索{{label}}", sort: "排序", filter: "筛选", cancel: "取消", apply: "应用", edit: "编辑", delete: "删除", actions: "操作", empty: "没有可显示的项目", pagination: "{{label}}分页", firstPage: "第一页", previousPage: "上一页", nextPage: "下一页", lastPage: "最后一页", page: "第{{page}}页", rowsPerPage: "每页行数", selectAll: "选择所有{{label}}", selectRow: "选择第{{id}}行" },
    selection: { removeItem: "移除此项", removeMany: "确定要移除这 {{count}} 项吗？", removeOne: "确定要移除“{{value}}”吗？" }, accessibility: { breadcrumb: "面包屑导航", close: "关闭" },
  }),
  es: localized({
    quickSearch: { dialogTitle: "Buscar trabajo del proveedor", placeholder: "Buscar reservas, clientes, servicios o equipo", noResults: "No hay coincidencias", start: "Destinos sugeridos", shortcutHint: "Pulsa Ctrl+K o Comando+K para abrir la búsqueda.", openResult: "Abrir resultado", reservationResult: "Cita NOB-2049", reservationDescription: "Solicitud de voz pendiente", customerResult: "Cliente 1024", customerDescription: "Historial propiedad del proveedor", serviceResult: "Servicio de corte", serviceDescription: "Duración, precio, márgenes y estado", teamResult: "Horarios del personal", teamDescription: "Asignaciones y acceso" },
    activities: { title: "Actividad operativa", close: "Cerrar actividad", open: "Abrir", copyReference: "Copiar referencia", referenceCopied: "Referencia copiada.", copyFailed: "No se pudo copiar.", reservationTitle: "Reserva por revisar", reservationBody: "Una solicitud de voz entró en el flujo común.", availabilityTitle: "Disponibilidad actualizada", availabilityBody: "Se cambiaron las reglas horarias del negocio.", serviceTitle: "Servicio activado", serviceBody: "El servicio ya está disponible en la reserva pública.", now: "Ahora", today: "Hoy", yesterday: "Ayer", imageAlt: "Adjunto de actividad" },
    notifications: { title: "Notificaciones", markAllRead: "Marcar todo como leído", close: "Cerrar notificaciones", allRead: "Todas las notificaciones se marcaron como leídas.", unread: "Sin leer", pendingTitle: "Solicitudes pendientes", pendingBody: "Dos solicitudes necesitan una decisión autorizada.", availabilityTitle: "Hueco de disponibilidad", availabilityBody: "Mañana hay un hueco de dos horas sin asignar.", tokensTitle: "Tokens de mensajes", tokensBody: "Revisa el saldo antes de activar otra regla SMS.", now: "Ahora", today: "Hoy", yesterday: "Ayer" },
    account: { title: "Cambiar espacio de negocio", close: "Cerrar selector", currentWorkspace: "Negocio autorizado actual", currentRole: "La membresía confirmada por el servidor está activa.", noOtherWorkspace: "No hay otra membresía autorizada. Solo se muestran membresías devueltas por el servidor.", done: "Listo" },
    dataGrid: { search: "Buscar {{label}}", sort: "Ordenar", filter: "Filtrar", cancel: "Cancelar", apply: "Aplicar", edit: "Editar", delete: "Eliminar", actions: "Acciones", empty: "No hay elementos para mostrar", pagination: "Páginas de {{label}}", firstPage: "Primera página", previousPage: "Página anterior", nextPage: "Página siguiente", lastPage: "Última página", page: "Página {{page}}", rowsPerPage: "Filas por página", selectAll: "Seleccionar todo en {{label}}", selectRow: "Seleccionar fila {{id}}" },
    selection: { removeItem: "Eliminar este elemento", removeMany: "¿Seguro que quieres eliminar estos {{count}} elementos?", removeOne: "¿Seguro que quieres eliminar «{{value}}»?" }, accessibility: { breadcrumb: "Ruta de navegación", close: "Cerrar" },
  }),
  ru: localized({
    quickSearch: { dialogTitle: "Поиск работы поставщика", placeholder: "Поиск бронирований, клиентов, услуг и команды", noResults: "Совпадений нет", start: "Предлагаемые разделы", shortcutHint: "Нажмите Ctrl+K или Command+K, чтобы открыть поиск.", openResult: "Открыть", reservationResult: "Запись NOB-2049", reservationDescription: "Ожидающий голосовой запрос", customerResult: "Клиент 1024", customerDescription: "История бронирований бизнеса", serviceResult: "Услуга стрижки", serviceDescription: "Длительность, цена, интервалы и статус", teamResult: "Графики сотрудников", teamDescription: "Назначения услуг и доступ" },
    activities: { title: "Операционные действия", close: "Закрыть действия", open: "Открыть", copyReference: "Копировать номер", referenceCopied: "Номер скопирован.", copyFailed: "Не удалось скопировать.", reservationTitle: "Запись требует проверки", reservationBody: "Голосовой запрос поступил в общий процесс бронирований.", availabilityTitle: "Доступность обновлена", availabilityBody: "Правила рабочего времени изменены.", serviceTitle: "Услуга активирована", serviceBody: "Услуга доступна в публичной записи.", now: "Только что", today: "Сегодня", yesterday: "Вчера", imageAlt: "Вложение действия" },
    notifications: { title: "Уведомления", markAllRead: "Отметить все прочитанными", close: "Закрыть уведомления", allRead: "Все уведомления прочитаны.", unread: "Непрочитано", pendingTitle: "Ожидающие запросы", pendingBody: "Два запроса требуют решения.", availabilityTitle: "Пробел в доступности", availabilityBody: "Завтра есть двухчасовой незанятый интервал.", tokensTitle: "Токены сообщений", tokensBody: "Проверьте баланс перед новой SMS-настройкой.", now: "Только что", today: "Сегодня", yesterday: "Вчера" },
    account: { title: "Сменить рабочее пространство", close: "Закрыть переключатель", currentWorkspace: "Текущий разрешенный бизнес", currentRole: "Подтвержденное сервером членство активно.", noOtherWorkspace: "Других разрешенных членств нет. Доступны только членства от сервера.", done: "Готово" },
    dataGrid: { search: "Поиск: {{label}}", sort: "Сортировка", filter: "Фильтр", cancel: "Отмена", apply: "Применить", edit: "Изменить", delete: "Удалить", actions: "Действия", empty: "Нет элементов для отображения", pagination: "Страницы: {{label}}", firstPage: "Первая страница", previousPage: "Предыдущая страница", nextPage: "Следующая страница", lastPage: "Последняя страница", page: "Страница {{page}}", rowsPerPage: "Строк на странице", selectAll: "Выбрать все: {{label}}", selectRow: "Выбрать строку {{id}}" },
    selection: { removeItem: "Удалить этот элемент", removeMany: "Удалить эти элементы ({{count}})?", removeOne: "Удалить «{{value}}»?" }, accessibility: { breadcrumb: "Навигационная цепочка", close: "Закрыть" },
  }),
  pt: localized({
    quickSearch: { dialogTitle: "Buscar trabalho do prestador", placeholder: "Buscar reservas, clientes, serviços ou equipe", noResults: "Nenhum item encontrado", start: "Destinos sugeridos", shortcutHint: "Pressione Ctrl+K ou Command+K para abrir a busca.", openResult: "Abrir resultado", reservationResult: "Agendamento NOB-2049", reservationDescription: "Solicitação de voz pendente", customerResult: "Cliente 1024", customerDescription: "Histórico pertencente ao prestador", serviceResult: "Serviço de corte", serviceDescription: "Duração, preço, intervalos e status", teamResult: "Escalas da equipe", teamDescription: "Atribuições e acesso" },
    activities: { title: "Atividade operacional", close: "Fechar atividade", open: "Abrir", copyReference: "Copiar referência", referenceCopied: "Referência copiada.", copyFailed: "Não foi possível copiar.", reservationTitle: "Reserva para análise", reservationBody: "Uma solicitação por voz entrou no fluxo único.", availabilityTitle: "Disponibilidade atualizada", availabilityBody: "As regras de horário foram alteradas.", serviceTitle: "Serviço ativado", serviceBody: "O serviço está disponível no agendamento público.", now: "Agora", today: "Hoje", yesterday: "Ontem", imageAlt: "Anexo da atividade" },
    notifications: { title: "Notificações", markAllRead: "Marcar tudo como lido", close: "Fechar notificações", allRead: "Todas as notificações foram lidas.", unread: "Não lida", pendingTitle: "Solicitações pendentes", pendingBody: "Duas solicitações precisam de decisão.", availabilityTitle: "Lacuna de disponibilidade", availabilityBody: "Amanhã há duas horas sem atribuição.", tokensTitle: "Tokens de mensagens", tokensBody: "Revise o saldo antes de outra regra de SMS.", now: "Agora", today: "Hoje", yesterday: "Ontem" },
    account: { title: "Trocar espaço do negócio", close: "Fechar seletor", currentWorkspace: "Negócio autorizado atual", currentRole: "A participação confirmada pelo servidor está ativa.", noOtherWorkspace: "Não há outra participação autorizada. Só participações retornadas pelo servidor podem ser escolhidas.", done: "Concluir" },
    dataGrid: { search: "Pesquisar {{label}}", sort: "Ordenar", filter: "Filtrar", cancel: "Cancelar", apply: "Aplicar", edit: "Editar", delete: "Excluir", actions: "Ações", empty: "Não há itens para exibir", pagination: "Páginas de {{label}}", firstPage: "Primeira página", previousPage: "Página anterior", nextPage: "Próxima página", lastPage: "Última página", page: "Página {{page}}", rowsPerPage: "Linhas por página", selectAll: "Selecionar tudo em {{label}}", selectRow: "Selecionar linha {{id}}" },
    selection: { removeItem: "Remover este item", removeMany: "Deseja remover estes {{count}} itens?", removeOne: "Deseja remover “{{value}}”?" }, accessibility: { breadcrumb: "Trilha de navegação", close: "Fechar" },
  }),
  fr: localized({
    quickSearch: { dialogTitle: "Rechercher le travail prestataire", placeholder: "Rechercher réservations, clients, services ou équipe", noResults: "Aucun élément correspondant", start: "Destinations suggérées", shortcutHint: "Appuyez sur Ctrl+K ou Commande+K pour ouvrir la recherche.", openResult: "Ouvrir", reservationResult: "Rendez-vous NOB-2049", reservationDescription: "Demande vocale en attente", customerResult: "Client 1024", customerDescription: "Historique appartenant au prestataire", serviceResult: "Service de coupe", serviceDescription: "Durée, tarif, marges et statut", teamResult: "Horaires de l’équipe", teamDescription: "Affectations et accès" },
    activities: { title: "Activité opérationnelle", close: "Fermer l’activité", open: "Ouvrir", copyReference: "Copier la référence", referenceCopied: "Référence copiée.", copyFailed: "Impossible de copier.", reservationTitle: "Réservation à examiner", reservationBody: "Une demande vocale a rejoint le flux commun.", availabilityTitle: "Disponibilité mise à jour", availabilityBody: "Les règles d’horaires ont été modifiées.", serviceTitle: "Service activé", serviceBody: "Le service est disponible dans la réservation publique.", now: "À l’instant", today: "Aujourd’hui", yesterday: "Hier", imageAlt: "Pièce jointe de l’activité" },
    notifications: { title: "Notifications", markAllRead: "Tout marquer comme lu", close: "Fermer les notifications", allRead: "Toutes les notifications sont lues.", unread: "Non lu", pendingTitle: "Demandes en attente", pendingBody: "Deux demandes nécessitent une décision.", availabilityTitle: "Créneau non attribué", availabilityBody: "Demain comprend deux heures non attribuées.", tokensTitle: "Jetons de messages", tokensBody: "Vérifiez le solde avant une nouvelle règle SMS.", now: "À l’instant", today: "Aujourd’hui", yesterday: "Hier" },
    account: { title: "Changer d’espace professionnel", close: "Fermer le sélecteur", currentWorkspace: "Activité autorisée actuelle", currentRole: "L’adhésion confirmée par le serveur est active.", noOtherWorkspace: "Aucune autre adhésion autorisée. Seules les adhésions du serveur peuvent être choisies.", done: "Terminé" },
    dataGrid: { search: "Rechercher {{label}}", sort: "Trier", filter: "Filtrer", cancel: "Annuler", apply: "Appliquer", edit: "Modifier", delete: "Supprimer", actions: "Actions", empty: "Aucun élément à afficher", pagination: "Pages de {{label}}", firstPage: "Première page", previousPage: "Page précédente", nextPage: "Page suivante", lastPage: "Dernière page", page: "Page {{page}}", rowsPerPage: "Lignes par page", selectAll: "Tout sélectionner dans {{label}}", selectRow: "Sélectionner la ligne {{id}}" },
    selection: { removeItem: "Supprimer cet élément", removeMany: "Voulez-vous supprimer ces {{count}} éléments ?", removeOne: "Voulez-vous supprimer « {{value}} » ?" }, accessibility: { breadcrumb: "Fil d’Ariane", close: "Fermer" },
  }),
  de: localized({
    quickSearch: { dialogTitle: "Anbieterarbeit durchsuchen", placeholder: "Buchungen, Kunden, Leistungen oder Team suchen", noResults: "Kein passender Eintrag", start: "Vorgeschlagene Bereiche", shortcutHint: "Mit Strg+K oder Befehl+K öffnen Sie die Suche.", openResult: "Ergebnis öffnen", reservationResult: "Termin NOB-2049", reservationDescription: "Offene Sprachbuchungsanfrage", customerResult: "Kunde 1024", customerDescription: "Anbietereigener Buchungsverlauf", serviceResult: "Haarschnitt-Leistung", serviceDescription: "Dauer, Preis, Puffer und Status", teamResult: "Mitarbeiterpläne", teamDescription: "Leistungszuweisung und Zugriff" },
    activities: { title: "Betriebliche Aktivität", close: "Aktivität schließen", open: "Öffnen", copyReference: "Referenz kopieren", referenceCopied: "Referenz kopiert.", copyFailed: "Kopieren nicht möglich.", reservationTitle: "Buchung muss geprüft werden", reservationBody: "Eine Sprachbuchung ist im gemeinsamen Ablauf eingegangen.", availabilityTitle: "Verfügbarkeit aktualisiert", availabilityBody: "Die Arbeitszeitregeln wurden geändert.", serviceTitle: "Leistung aktiviert", serviceBody: "Die Leistung ist öffentlich buchbar.", now: "Gerade eben", today: "Heute", yesterday: "Gestern", imageAlt: "Aktivitätsanhang" },
    notifications: { title: "Benachrichtigungen", markAllRead: "Alle als gelesen markieren", close: "Benachrichtigungen schließen", allRead: "Alle Benachrichtigungen wurden gelesen.", unread: "Ungelesen", pendingTitle: "Offene Anfragen", pendingBody: "Zwei Anfragen benötigen eine Entscheidung.", availabilityTitle: "Verfügbarkeitslücke", availabilityBody: "Morgen gibt es eine zweistündige Lücke.", tokensTitle: "Nachrichten-Token", tokensBody: "Prüfen Sie den Saldo vor einer neuen SMS-Regel.", now: "Gerade eben", today: "Heute", yesterday: "Gestern" },
    account: { title: "Geschäftsbereich wechseln", close: "Wechsler schließen", currentWorkspace: "Aktuell autorisiertes Geschäft", currentRole: "Die serverbestätigte Mitgliedschaft ist aktiv.", noOtherWorkspace: "Keine weitere autorisierte Mitgliedschaft. Nur Server-Mitgliedschaften können gewählt werden.", done: "Fertig" },
    dataGrid: { search: "{{label}} durchsuchen", sort: "Sortieren", filter: "Filtern", cancel: "Abbrechen", apply: "Anwenden", edit: "Bearbeiten", delete: "Löschen", actions: "Aktionen", empty: "Keine Einträge vorhanden", pagination: "Seiten für {{label}}", firstPage: "Erste Seite", previousPage: "Vorherige Seite", nextPage: "Nächste Seite", lastPage: "Letzte Seite", page: "Seite {{page}}", rowsPerPage: "Zeilen pro Seite", selectAll: "Alle in {{label}} auswählen", selectRow: "Zeile {{id}} auswählen" },
    selection: { removeItem: "Dieses Element entfernen", removeMany: "Möchten Sie diese {{count}} Elemente entfernen?", removeOne: "Möchten Sie „{{value}}“ entfernen?" }, accessibility: { breadcrumb: "Brotkrümelnavigation", close: "Schließen" },
  }),
  ja: localized({
    quickSearch: { dialogTitle: "事業者の業務を検索", placeholder: "予約、顧客、サービス、チームを検索", noResults: "一致する項目がありません", start: "おすすめの移動先", shortcutHint: "Ctrl+K または Command+K で検索を開けます。", openResult: "結果を開く", reservationResult: "予約 NOB-2049", reservationDescription: "保留中の音声予約リクエスト", customerResult: "顧客 1024", customerDescription: "事業者所有の予約履歴", serviceResult: "カットサービス", serviceDescription: "時間、価格、バッファ、予約状態", teamResult: "スタッフ予定", teamDescription: "サービス割当とアクセス" },
    activities: { title: "運用アクティビティ", close: "アクティビティを閉じる", open: "開く", copyReference: "参照をコピー", referenceCopied: "参照をコピーしました。", copyFailed: "コピーできませんでした。", reservationTitle: "予約の確認が必要", reservationBody: "音声予約が共通の予約フローに入りました。", availabilityTitle: "空き時間を更新", availabilityBody: "営業時間ルールが変更されました。", serviceTitle: "サービスを有効化", serviceBody: "公開予約で選択できるようになりました。", now: "たった今", today: "今日", yesterday: "昨日", imageAlt: "アクティビティの添付ファイル" },
    notifications: { title: "通知", markAllRead: "すべて既読にする", close: "通知を閉じる", allRead: "すべて既読にしました。", unread: "未読", pendingTitle: "保留中のリクエスト", pendingBody: "2件の予約に承認された判断が必要です。", availabilityTitle: "空き時間の隙間", availabilityBody: "明日に2時間の未割当枠があります。", tokensTitle: "メッセージトークン", tokensBody: "SMSルール追加前に残高を確認してください。", now: "たった今", today: "今日", yesterday: "昨日" },
    account: { title: "事業ワークスペースを切り替え", close: "切り替えを閉じる", currentWorkspace: "現在の承認済み事業", currentRole: "サーバー確認済みのメンバーシップが有効です。", noOtherWorkspace: "他の承認済み事業はありません。サーバーから返されたメンバーシップのみ切り替え可能です。", done: "完了" },
    dataGrid: { search: "{{label}}を検索", sort: "並べ替え", filter: "絞り込み", cancel: "キャンセル", apply: "適用", edit: "編集", delete: "削除", actions: "操作", empty: "表示する項目がありません", pagination: "{{label}}のページ", firstPage: "最初のページ", previousPage: "前のページ", nextPage: "次のページ", lastPage: "最後のページ", page: "{{page}}ページ", rowsPerPage: "1ページあたりの行数", selectAll: "{{label}}をすべて選択", selectRow: "行{{id}}を選択" },
    selection: { removeItem: "この項目を削除", removeMany: "この {{count}} 件を削除しますか？", removeOne: "「{{value}}」を削除しますか？" }, accessibility: { breadcrumb: "パンくずリスト", close: "閉じる" },
  }),
};
