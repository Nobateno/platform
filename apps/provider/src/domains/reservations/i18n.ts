import {
  supportedLanguages,
  type AppLanguage,
} from "@/shared/i18n/languages";

export const reservationsNamespace = "reservations" as const;

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
  "filters.apply": message("اعمال فیلترها", "Apply filters", "应用筛选", "Aplicar filtros", "Применить фильтры", "Aplicar filtros", "Appliquer les filtres", "Filter anwenden", "フィルターを適用"),
  "pagination.first": message("صفحه اول", "First page", "第一页", "Primera página", "Первая страница", "Primeira página", "Première page", "Erste Seite", "最初のページ"),
  "pagination.previous": message("صفحه قبل", "Previous page", "上一页", "Página anterior", "Предыдущая страница", "Página anterior", "Page précédente", "Vorherige Seite", "前のページ"),
  "pagination.page": message("صفحه {{page}}", "Page {{page}}", "第 {{page}} 页", "Página {{page}}", "Страница {{page}}", "Página {{page}}", "Page {{page}}", "Seite {{page}}", "ページ {{page}}"),
  "pagination.next": message("صفحه بعد", "Next page", "下一页", "Página siguiente", "Следующая страница", "Próxima página", "Page suivante", "Nächste Seite", "次のページ"),
  "pagination.last": message("صفحه آخر", "Last page", "最后一页", "Última página", "Последняя страница", "Última página", "Dernière page", "Letzte Seite", "最後のページ"),
  "pagination.perPage": message("تعداد نوبت در هر صفحه", "Appointments per page", "每页预约数", "Citas por página", "Записей на странице", "Agendamentos por página", "Rendez-vous par page", "Termine pro Seite", "1ページあたりの予約数"),
  "detail.print": message("چاپ نوبت", "Print appointment", "打印预约", "Imprimir cita", "Распечатать запись", "Imprimir agendamento", "Imprimer le rendez-vous", "Termin drucken", "予約を印刷"),
  "list.title": message("نوبت‌ها", "Appointments", "预约", "Citas", "Записи", "Agendamentos", "Rendez-vous", "Termine", "予約"),
  "list.subtitle": message("درخواست‌های آنلاین، نوبت‌های ثبت‌شده توسط پذیرش و رزروهای دستیار صوتی را پیگیری کنید.", "Track online requests, front-desk bookings, and voice-assistant appointments.", "跟踪在线请求、前台预约和语音助手预约。", "Consulta solicitudes en línea, reservas de recepción y citas del asistente de voz.", "Отслеживайте онлайн-запросы, записи через администратора и голосового помощника.", "Acompanhe solicitações online, agendamentos da recepção e do assistente de voz.", "Suivez les demandes en ligne, les réservations de l’accueil et celles de l’assistant vocal.", "Verfolgen Sie Online-Anfragen, Buchungen am Empfang und Termine des Sprachassistenten.", "オンラインリクエスト、受付登録、音声アシスタント経由の予約を追跡します。"),
  "list.create": message("ثبت نوبت دستی", "Create manual booking", "创建手动预约", "Crear reserva manual", "Создать запись вручную", "Criar agendamento manual", "Créer une réservation manuelle", "Manuelle Buchung erstellen", "手動予約を作成"),
  "list.closeForm": message("بستن فرم", "Close form", "关闭表单", "Cerrar formulario", "Закрыть форму", "Fechar formulário", "Fermer le formulaire", "Formular schließen", "フォームを閉じる"),
  "filters.searchLabel": message("جستجوی نوبت", "Search appointments", "搜索预约", "Buscar citas", "Поиск записей", "Pesquisar agendamentos", "Rechercher des rendez-vous", "Termine suchen", "予約を検索"),
  "filters.searchPlaceholder": message("شناسه، خدمت یا نوع مراجع", "Reference, service, or customer type", "编号、服务或客户类型", "Referencia, servicio o tipo de cliente", "Номер, услуга или тип клиента", "Referência, serviço ou tipo de cliente", "Référence, service ou type de client", "Referenz, Leistung oder Kundentyp", "参照番号、サービス、顧客種別"),
  "filters.statusLabel": message("وضعیت", "Status", "状态", "Estado", "Статус", "Status", "Statut", "Status", "ステータス"),
  "filters.sourceLabel": message("منبع رزرو", "Booking source", "预约来源", "Origen de la reserva", "Источник записи", "Origem do agendamento", "Origine de la réservation", "Buchungsquelle", "予約経路"),
  "filters.all": message("همه", "All", "全部", "Todos", "Все", "Todos", "Tous", "Alle", "すべて"),
  "filters.reset": message("پاک‌کردن فیلترها", "Clear filters", "清除筛选", "Borrar filtros", "Сбросить фильтры", "Limpar filtros", "Effacer les filtres", "Filter zurücksetzen", "フィルターを解除"),
  "filters.resultCount": message("{{count}} نوبت", "{{count}} appointments", "{{count}} 个预约", "{{count}} citas", "Записей: {{count}}", "{{count}} agendamentos", "{{count}} rendez-vous", "{{count}} Termine", "{{count}}件の予約"),
  "empty.title": message("نوبتی پیدا نشد", "No appointments found", "未找到预约", "No se encontraron citas", "Записи не найдены", "Nenhum agendamento encontrado", "Aucun rendez-vous trouvé", "Keine Termine gefunden", "予約が見つかりません"),
  "empty.body": message("عبارت جستجو یا فیلترها را تغییر دهید.", "Try changing the search term or filters.", "请更改搜索词或筛选条件。", "Prueba a cambiar la búsqueda o los filtros.", "Измените поисковый запрос или фильтры.", "Tente alterar a pesquisa ou os filtros.", "Modifiez la recherche ou les filtres.", "Ändern Sie den Suchbegriff oder die Filter.", "検索語またはフィルターを変更してください。"),
  "table.reference": message("شناسه", "Reference", "编号", "Referencia", "Номер", "Referência", "Référence", "Referenz", "参照番号"),
  "table.appointment": message("نوبت", "Appointment", "预约", "Cita", "Запись", "Agendamento", "Rendez-vous", "Termin", "予約"),
  "table.date": message("تاریخ و زمان", "Date and time", "日期和时间", "Fecha y hora", "Дата и время", "Data e horário", "Date et heure", "Datum und Uhrzeit", "日時"),
  "table.source": message("منبع", "Source", "来源", "Origen", "Источник", "Origem", "Source", "Quelle", "受付経路"),
  "table.status": message("وضعیت", "Status", "状态", "Estado", "Статус", "Status", "Statut", "Status", "ステータス"),
  "table.actions": message("عملیات", "Actions", "操作", "Acciones", "Действия", "Ações", "Actions", "Aktionen", "操作"),
  "table.view": message("مشاهده جزئیات {{id}}", "View details for {{id}}", "查看 {{id}} 的详情", "Ver detalles de {{id}}", "Посмотреть детали {{id}}", "Ver detalhes de {{id}}", "Voir les détails de {{id}}", "Details zu {{id}} anzeigen", "{{id}} の詳細を表示"),
  "status.pending": message("در انتظار", "Pending", "待处理", "Pendiente", "Ожидает", "Pendente", "En attente", "Ausstehend", "保留中"),
  "status.approved": message("تأییدشده", "Approved", "已确认", "Aprobada", "Подтверждено", "Aprovado", "Approuvé", "Bestätigt", "承認済み"),
  "status.rejected": message("ردشده", "Rejected", "已拒绝", "Rechazada", "Отклонено", "Rejeitado", "Refusé", "Abgelehnt", "却下"),
  "status.cancelled": message("لغوشده", "Cancelled", "已取消", "Cancelada", "Отменено", "Cancelado", "Annulé", "Storniert", "キャンセル"),
  "status.completed": message("انجام‌شده", "Completed", "已完成", "Completada", "Завершено", "Concluído", "Terminé", "Abgeschlossen", "完了"),
  "status.noShow": message("عدم مراجعه", "No-show", "未到场", "No se presentó", "Неявка", "Não compareceu", "Absent", "Nicht erschienen", "来店なし"),
  "source.online": message("رزرو آنلاین", "Online booking", "在线预约", "Reserva en línea", "Онлайн-запись", "Agendamento online", "Réservation en ligne", "Online-Buchung", "オンライン予約"),
  "source.manual": message("ثبت دستی", "Manual booking", "手动创建", "Reserva manual", "Ручная запись", "Agendamento manual", "Réservation manuelle", "Manuelle Buchung", "手動予約"),
  "source.voice": message("دستیار صوتی", "Voice assistant", "语音助手", "Asistente de voz", "Голосовой помощник", "Assistente de voz", "Assistant vocal", "Sprachassistent", "音声アシスタント"),
  "service.consultation": message("مشاوره اولیه", "Initial consultation", "初次咨询", "Consulta inicial", "Первичная консультация", "Consulta inicial", "Consultation initiale", "Erstberatung", "初回相談"),
  "service.followUp": message("پیگیری تخصصی", "Specialist follow-up", "专业复诊", "Seguimiento especializado", "Повторная консультация", "Acompanhamento especializado", "Suivi spécialisé", "Fachliche Nachsorge", "専門フォローアップ"),
  "service.wellness": message("جلسه مراقبتی", "Wellness session", "护理服务", "Sesión de bienestar", "Оздоровительный сеанс", "Sessão de bem-estar", "Séance de bien-être", "Wellness-Termin", "ウェルネスセッション"),
  "service.assessment": message("ارزیابی تخصصی", "Specialist assessment", "专业评估", "Evaluación especializada", "Специализированная оценка", "Avaliação especializada", "Évaluation spécialisée", "Fachliche Beurteilung", "専門評価"),
  "staff.owner": message("مدیر مجموعه", "Business owner", "商家负责人", "Responsable del negocio", "Владелец компании", "Responsável pelo negócio", "Responsable de l’établissement", "Geschäftsinhaber", "事業責任者"),
  "staff.specialist": message("متخصص شیفت", "On-duty specialist", "值班专家", "Especialista de turno", "Дежурный специалист", "Especialista de plantão", "Spécialiste de garde", "Diensthabende Fachkraft", "担当スペシャリスト"),
  "staff.team": message("تیم خدمات", "Service team", "服务团队", "Equipo de servicio", "Команда обслуживания", "Equipe de atendimento", "Équipe de service", "Serviceteam", "サービスチーム"),
  "customer.new": message("مراجع جدید", "New customer", "新客户", "Cliente nuevo", "Новый клиент", "Novo cliente", "Nouveau client", "Neukunde", "新規顧客"),
  "customer.returning": message("مراجع بازگشتی", "Returning customer", "回访客户", "Cliente recurrente", "Постоянный клиент", "Cliente recorrente", "Client régulier", "Stammkunde", "リピーター"),
  "customer.manual": message("مراجع ثبت دستی", "Manually added customer", "手动添加的客户", "Cliente añadido manualmente", "Клиент добавлен вручную", "Cliente adicionado manualmente", "Client ajouté manuellement", "Manuell hinzugefügter Kunde", "手動追加の顧客"),
  "duration": message("{{count}} دقیقه", "{{count}} min", "{{count}} 分钟", "{{count}} min", "{{count}} мин", "{{count}} min", "{{count}} min", "{{count}} Min.", "{{count}}分"),
  "manual.title": message("نوبت دستی جدید", "New manual booking", "新建手动预约", "Nueva reserva manual", "Новая ручная запись", "Novo agendamento manual", "Nouvelle réservation manuelle", "Neue manuelle Buchung", "新しい手動予約"),
  "manual.description": message("برای نوبت تلفنی یا حضوری اطلاعات ضروری را وارد کنید. اطلاعات این فرم فقط در همین نشست نگهداری می‌شود.", "Enter the essentials for a phone or walk-in appointment. Form data is kept only for this session.", "输入电话或到店预约所需的信息。表单数据仅保留在当前会话中。", "Introduce los datos esenciales de una cita telefónica o presencial. Los datos solo se conservan durante esta sesión.", "Введите основные данные для записи по телефону или при личном обращении. Данные хранятся только в текущем сеансе.", "Informe os dados essenciais de um agendamento por telefone ou presencial. Os dados ficam apenas nesta sessão.", "Saisissez les informations essentielles d’un rendez-vous téléphonique ou sur place. Les données restent uniquement dans cette session.", "Geben Sie die wichtigsten Angaben für einen telefonischen oder persönlichen Termin ein. Die Daten bleiben nur in dieser Sitzung erhalten.", "電話または来店予約に必要な情報を入力してください。入力データはこのセッション中のみ保持されます。"),
  "manual.name": message("نام مراجع", "Customer name", "客户姓名", "Nombre del cliente", "Имя клиента", "Nome do cliente", "Nom du client", "Kundenname", "顧客名"),
  "manual.namePlaceholder": message("نام و نام خانوادگی", "Full name", "姓名", "Nombre completo", "Имя и фамилия", "Nome completo", "Nom complet", "Vollständiger Name", "氏名"),
  "manual.phone": message("شماره موبایل", "Mobile number", "手机号码", "Número de móvil", "Номер мобильного", "Número de celular", "Numéro de mobile", "Mobilnummer", "携帯電話番号"),
  "manual.phonePlaceholder": message("09xxxxxxxxx", "+98 9xx xxx xxxx", "+86 1xx xxxx xxxx", "+34 6xx xxx xxx", "+7 9xx xxx xx xx", "+55 xx 9xxxx-xxxx", "+33 6 xx xx xx xx", "+49 1xx xxxxxxx", "+81 90 xxxx xxxx"),
  "manual.service": message("خدمت", "Service", "服务", "Servicio", "Услуга", "Serviço", "Service", "Leistung", "サービス"),
  "manual.staff": message("متخصص", "Provider", "服务人员", "Profesional", "Специалист", "Profissional", "Prestataire", "Anbieter", "担当者"),
  "manual.date": message("تاریخ", "Date", "日期", "Fecha", "Дата", "Data", "Date", "Datum", "日付"),
  "manual.time": message("زمان", "Time", "时间", "Hora", "Время", "Horário", "Heure", "Uhrzeit", "時刻"),
  "manual.note": message("یادداشت داخلی", "Internal note", "内部备注", "Nota interna", "Внутренняя заметка", "Observação interna", "Note interne", "Interne Notiz", "内部メモ"),
  "manual.notePlaceholder": message("اختیاری؛ اطلاعات لازم برای ارائه خدمت", "Optional; information needed to deliver the service", "可选；提供服务所需的信息", "Opcional; información necesaria para prestar el servicio", "Необязательно; информация для оказания услуги", "Opcional; informações necessárias para prestar o serviço", "Facultatif ; informations nécessaires à la prestation", "Optional; für die Leistung erforderliche Informationen", "任意：サービス提供に必要な情報"),
  "manual.requiredHint": message("همه فیلدها به‌جز یادداشت الزامی هستند.", "All fields except the note are required.", "除备注外，所有字段均为必填项。", "Todos los campos excepto la nota son obligatorios.", "Все поля, кроме заметки, обязательны.", "Todos os campos, exceto a observação, são obrigatórios.", "Tous les champs sauf la note sont obligatoires.", "Alle Felder außer der Notiz sind erforderlich.", "メモ以外は必須です。"),
  "manual.submit": message("ثبت نوبت", "Create appointment", "创建预约", "Crear cita", "Создать запись", "Criar agendamento", "Créer le rendez-vous", "Termin erstellen", "予約を作成"),
  "manual.cancel": message("انصراف", "Cancel", "取消", "Cancelar", "Отмена", "Cancelar", "Annuler", "Abbrechen", "キャンセル"),
  "manual.success": message("نوبت {{id}} ثبت شد.", "Appointment {{id}} was created.", "预约 {{id}} 已创建。", "Se creó la cita {{id}}.", "Запись {{id}} создана.", "O agendamento {{id}} foi criado.", "Le rendez-vous {{id}} a été créé.", "Termin {{id}} wurde erstellt.", "予約 {{id}} を作成しました。"),
  "manual.conflict": message("این متخصص در تاریخ و زمان انتخابی نوبت دیگری دارد.", "This provider already has an appointment at the selected date and time.", "该服务人员在所选日期和时间已有预约。", "Este profesional ya tiene una cita en la fecha y hora seleccionadas.", "У этого специалиста уже есть запись на выбранные дату и время.", "Este profissional já tem um agendamento na data e horário selecionados.", "Ce prestataire a déjà un rendez-vous à la date et à l’heure choisies.", "Dieser Anbieter hat zum gewählten Zeitpunkt bereits einen Termin.", "この担当者には選択した日時に別の予約があります。"),
  "detail.back": message("بازگشت به نوبت‌ها", "Back to appointments", "返回预约列表", "Volver a citas", "Назад к записям", "Voltar aos agendamentos", "Retour aux rendez-vous", "Zurück zu den Terminen", "予約一覧に戻る"),
  "detail.title": message("جزئیات نوبت", "Appointment details", "预约详情", "Detalles de la cita", "Детали записи", "Detalhes do agendamento", "Détails du rendez-vous", "Termindetails", "予約詳細"),
  "detail.notFoundTitle": message("نوبت پیدا نشد", "Appointment not found", "未找到预约", "No se encontró la cita", "Запись не найдена", "Agendamento não encontrado", "Rendez-vous introuvable", "Termin nicht gefunden", "予約が見つかりません"),
  "detail.notFoundBody": message("شناسه نوبت معتبر نیست یا این نوبت دیگر در دسترس نیست.", "The appointment reference is invalid or no longer available.", "预约编号无效或该预约已不可用。", "La referencia no es válida o la cita ya no está disponible.", "Номер записи неверен или запись больше недоступна.", "A referência é inválida ou o agendamento não está mais disponível.", "La référence est invalide ou le rendez-vous n’est plus disponible.", "Die Terminreferenz ist ungültig oder nicht mehr verfügbar.", "予約参照番号が無効か、予約が利用できません。"),
  "detail.summary": message("خلاصه نوبت", "Appointment summary", "预约摘要", "Resumen de la cita", "Сводка записи", "Resumo do agendamento", "Résumé du rendez-vous", "Terminübersicht", "予約概要"),
  "detail.customer": message("مراجع", "Customer", "客户", "Cliente", "Клиент", "Cliente", "Client", "Kunde", "顧客"),
  "detail.phone": message("شماره موبایل", "Mobile number", "手机号码", "Número de móvil", "Номер мобильного", "Número de celular", "Numéro de mobile", "Mobilnummer", "携帯電話番号"),
  "detail.provider": message("متخصص", "Provider", "服务人员", "Profesional", "Специалист", "Profissional", "Prestataire", "Anbieter", "担当者"),
  "detail.service": message("خدمت", "Service", "服务", "Servicio", "Услуга", "Serviço", "Service", "Leistung", "サービス"),
  "detail.dateTime": message("تاریخ و زمان", "Date and time", "日期和时间", "Fecha y hora", "Дата и время", "Data e horário", "Date et heure", "Datum und Uhrzeit", "日時"),
  "detail.duration": message("مدت", "Duration", "时长", "Duración", "Длительность", "Duração", "Durée", "Dauer", "所要時間"),
  "detail.source": message("منبع رزرو", "Booking source", "预约来源", "Origen de la reserva", "Источник записи", "Origem do agendamento", "Origine de la réservation", "Buchungsquelle", "予約経路"),
  "detail.status": message("وضعیت", "Status", "状态", "Estado", "Статус", "Status", "Statut", "Status", "ステータス"),
  "detail.notes": message("یادداشت داخلی", "Internal note", "内部备注", "Nota interna", "Внутренняя заметка", "Observação interna", "Note interne", "Interne Notiz", "内部メモ"),
  "detail.noNotes": message("یادداشتی برای این نوبت ثبت نشده است.", "No note has been recorded for this appointment.", "此预约没有备注。", "No se ha registrado ninguna nota para esta cita.", "Для этой записи нет заметок.", "Nenhuma observação foi registrada para este agendamento.", "Aucune note n’a été enregistrée pour ce rendez-vous.", "Für diesen Termin wurde keine Notiz erfasst.", "この予約にはメモがありません。"),
  "detail.note.intake": message("برای پذیرش اولیه ۱۰ دقیقه زمان اضافه در نظر گرفته شود.", "Allow 10 extra minutes for initial intake.", "请为首次登记预留额外 10 分钟。", "Reserva 10 minutos adicionales para la recepción inicial.", "Предусмотреть 10 дополнительных минут для первичного оформления.", "Reserve 10 minutos adicionais para o atendimento inicial.", "Prévoir 10 minutes supplémentaires pour l’accueil initial.", "10 zusätzliche Minuten für die Erstaufnahme einplanen.", "初回受付のために10分追加してください。"),
  "detail.note.accessibility": message("مسیر ورودی بدون پله آماده باشد.", "Keep the step-free entrance available.", "请确保无障碍入口可用。", "Mantén disponible la entrada sin escalones.", "Обеспечить доступ к входу без ступеней.", "Mantenha disponível a entrada sem degraus.", "Maintenir l’accès sans marche disponible.", "Den stufenlosen Zugang freihalten.", "段差のない入口を利用できるようにしてください。"),
  "detail.actions": message("به‌روزرسانی وضعیت", "Update status", "更新状态", "Actualizar estado", "Обновить статус", "Atualizar status", "Mettre à jour le statut", "Status aktualisieren", "ステータスを更新"),
  "detail.approve": message("تأیید نوبت", "Approve appointment", "确认预约", "Aprobar cita", "Подтвердить запись", "Aprovar agendamento", "Approuver le rendez-vous", "Termin bestätigen", "予約を承認"),
  "detail.reject": message("رد درخواست", "Reject request", "拒绝请求", "Rechazar solicitud", "Отклонить запрос", "Rejeitar solicitação", "Refuser la demande", "Anfrage ablehnen", "リクエストを却下"),
  "detail.cancel": message("لغو نوبت", "Cancel appointment", "取消预约", "Cancelar cita", "Отменить запись", "Cancelar agendamento", "Annuler le rendez-vous", "Termin stornieren", "予約をキャンセル"),
  "detail.complete": message("ثبت انجام خدمت", "Mark completed", "标记为已完成", "Marcar como completada", "Отметить выполненной", "Marcar como concluído", "Marquer comme terminé", "Als abgeschlossen markieren", "完了にする"),
  "detail.noShow": message("ثبت عدم مراجعه", "Mark no-show", "标记未到场", "Marcar como ausente", "Отметить неявку", "Marcar não comparecimento", "Marquer absent", "Als nicht erschienen markieren", "来店なしにする"),
  "detail.terminal": message("این نوبت در وضعیت نهایی است و عملیات دیگری ندارد.", "This appointment is in a final state and has no further actions.", "此预约已处于最终状态，无其他操作。", "Esta cita está en estado final y no admite más acciones.", "Запись находится в конечном статусе, дальнейших действий нет.", "Este agendamento está em estado final e não possui outras ações.", "Ce rendez-vous est dans un état final et ne permet plus d’action.", "Dieser Termin hat einen endgültigen Status und keine weiteren Aktionen.", "この予約は最終状態のため、追加操作はありません。"),
  "detail.updated": message("وضعیت نوبت {{id}} به «{{status}}» تغییر کرد.", "Appointment {{id}} changed to {{status}}.", "预约 {{id}} 已更改为“{{status}}”。", "La cita {{id}} cambió a {{status}}.", "Статус записи {{id}} изменён на «{{status}}».", "O agendamento {{id}} mudou para {{status}}.", "Le rendez-vous {{id}} est passé au statut {{status}}.", "Termin {{id}} wurde auf {{status}} gesetzt.", "予約 {{id}} を「{{status}}」に変更しました。"),
  "detail.history": message("تاریخچه وضعیت", "Status history", "状态历史", "Historial de estado", "История статусов", "Histórico de status", "Historique des statuts", "Statusverlauf", "ステータス履歴"),
  "detail.historyCreated": message("نوبت از طریق «{{source}}» ثبت شد.", "Appointment created through {{source}}.", "预约通过“{{source}}”创建。", "Cita creada mediante {{source}}.", "Запись создана через «{{source}}».", "Agendamento criado por {{source}}.", "Rendez-vous créé via {{source}}.", "Termin über {{source}} erstellt.", "{{source}}から予約が作成されました。"),
  "detail.historyStatus": message("وضعیت به «{{status}}» تغییر کرد.", "Status changed to {{status}}.", "状态更改为“{{status}}”。", "El estado cambió a {{status}}.", "Статус изменён на «{{status}}».", "Status alterado para {{status}}.", "Statut modifié en {{status}}.", "Status geändert zu {{status}}.", "ステータスを「{{status}}」に変更しました。"),
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

export type ReservationsResource = Resource;
export const reservationsResources = Object.fromEntries(
  supportedLanguages.map((language, index) => [language, buildResource(index)]),
) as Record<AppLanguage, ReservationsResource>;

export const reservationsI18n = {
  namespace: reservationsNamespace,
  resources: reservationsResources,
} as const;
