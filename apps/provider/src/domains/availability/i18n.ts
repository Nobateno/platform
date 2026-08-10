import {
  supportedLanguages,
  type AppLanguage,
} from "@/shared/i18n/languages";

export const availabilityNamespace = "availability" as const;

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
  "page.title": message("ساعات کاری و ظرفیت", "Hours and availability", "营业时间与可用时段", "Horario y disponibilidad", "Часы работы и доступность", "Horários e disponibilidade", "Horaires et disponibilités", "Öffnungszeiten und Verfügbarkeit", "営業時間と空き状況"),
  "page.subtitle": message("زمان‌های قابل رزرو، فاصله ثبت نوبت و استثناهای تقویم را تنظیم کنید.", "Configure bookable hours, booking windows, and calendar exceptions.", "设置可预约时间、预约窗口和日历例外。", "Configura el horario reservable, las ventanas de reserva y las excepciones del calendario.", "Настройте доступные часы, окна записи и исключения календаря.", "Configure horários disponíveis, janelas de agendamento e exceções do calendário.", "Configurez les heures réservables, les fenêtres de réservation et les exceptions du calendrier.", "Konfigurieren Sie buchbare Zeiten, Buchungsfenster und Kalenderausnahmen.", "予約可能時間、予約受付期間、カレンダーの例外を設定します。"),
  "page.save": message("ذخیره ظرفیت", "Save availability", "保存可用时段", "Guardar disponibilidad", "Сохранить доступность", "Salvar disponibilidade", "Enregistrer les disponibilités", "Verfügbarkeit speichern", "空き状況を保存"),
  "page.saved": message("تنظیمات ظرفیت برای این نشست ذخیره شد.", "Availability settings were saved for this session.", "可用时段设置已保存至当前会话。", "La disponibilidad se guardó para esta sesión.", "Настройки доступности сохранены для текущего сеанса.", "As configurações foram salvas para esta sessão.", "Les disponibilités ont été enregistrées pour cette session.", "Die Verfügbarkeit wurde für diese Sitzung gespeichert.", "空き状況の設定をこのセッションに保存しました。"),
  "weekly.title": message("برنامه هفتگی", "Weekly hours", "每周营业时间", "Horario semanal", "Недельный график", "Horário semanal", "Horaires hebdomadaires", "Wochenzeiten", "週間営業時間"),
  "weekly.description": message("روزهای فعال و ساعت شروع و پایان ارائه خدمت را مشخص کنید.", "Choose active days and the start and end of service hours.", "选择营业日以及服务开始和结束时间。", "Elige los días activos y el inicio y fin del horario de servicio.", "Выберите рабочие дни, а также время начала и окончания работы.", "Escolha os dias ativos e o início e fim do atendimento.", "Choisissez les jours actifs ainsi que le début et la fin du service.", "Wählen Sie aktive Tage sowie Beginn und Ende der Servicezeiten.", "営業日とサービスの開始・終了時刻を選択します。"),
  "weekly.open": message("فعال", "Open", "营业", "Abierto", "Открыто", "Aberto", "Ouvert", "Geöffnet", "営業"),
  "weekly.closed": message("تعطیل", "Closed", "休息", "Cerrado", "Закрыто", "Fechado", "Fermé", "Geschlossen", "休業"),
  "weekly.start": message("شروع", "Start", "开始", "Inicio", "Начало", "Início", "Début", "Beginn", "開始"),
  "weekly.end": message("پایان", "End", "结束", "Fin", "Окончание", "Fim", "Fin", "Ende", "終了"),
  "day.saturday": message("شنبه", "Saturday", "星期六", "Sábado", "Суббота", "Sábado", "Samedi", "Samstag", "土曜日"),
  "day.sunday": message("یکشنبه", "Sunday", "星期日", "Domingo", "Воскресенье", "Domingo", "Dimanche", "Sonntag", "日曜日"),
  "day.monday": message("دوشنبه", "Monday", "星期一", "Lunes", "Понедельник", "Segunda-feira", "Lundi", "Montag", "月曜日"),
  "day.tuesday": message("سه‌شنبه", "Tuesday", "星期二", "Martes", "Вторник", "Terça-feira", "Mardi", "Dienstag", "火曜日"),
  "day.wednesday": message("چهارشنبه", "Wednesday", "星期三", "Miércoles", "Среда", "Quarta-feira", "Mercredi", "Mittwoch", "水曜日"),
  "day.thursday": message("پنجشنبه", "Thursday", "星期四", "Jueves", "Четверг", "Quinta-feira", "Jeudi", "Donnerstag", "木曜日"),
  "day.friday": message("جمعه", "Friday", "星期五", "Viernes", "Пятница", "Sexta-feira", "Vendredi", "Freitag", "金曜日"),
  "windows.title": message("قواعد رزرو", "Booking windows", "预约规则", "Ventanas de reserva", "Окна записи", "Janelas de agendamento", "Fenêtres de réservation", "Buchungsfenster", "予約受付期間"),
  "windows.description": message("حداقل زمان لازم تا شروع نوبت، بازه پیش‌رزرو و فاصله زمانی گزینه‌ها را تعیین کنید.", "Set minimum notice, how far ahead customers can book, and the slot interval.", "设置最短提前时间、可提前预约的天数和时段间隔。", "Define el aviso mínimo, la antelación máxima y el intervalo entre huecos.", "Задайте минимальное уведомление, максимальный срок записи и интервал слотов.", "Defina a antecedência mínima, o período máximo e o intervalo dos horários.", "Définissez le préavis minimum, l’horizon de réservation et l’intervalle des créneaux.", "Legen Sie Mindestvorlauf, maximalen Buchungsvorlauf und Zeitraster fest.", "最短受付時間、予約可能な先の日数、枠の間隔を設定します。"),
  "windows.notice": message("حداقل فاصله تا نوبت", "Minimum notice", "最短提前时间", "Aviso mínimo", "Минимальное уведомление", "Antecedência mínima", "Préavis minimum", "Mindestvorlauf", "最短受付時間"),
  "windows.advance": message("حداکثر پیش‌رزرو", "Maximum advance booking", "最长提前预约", "Reserva máxima anticipada", "Максимальный срок записи", "Antecedência máxima", "Horizon de réservation", "Maximaler Buchungsvorlauf", "最大予約可能期間"),
  "windows.interval": message("فاصله گزینه‌های زمانی", "Time-slot interval", "时段间隔", "Intervalo de horarios", "Интервал слотов", "Intervalo dos horários", "Intervalle des créneaux", "Zeitraster", "時間枠の間隔"),
  "windows.noticeNow": message("بدون محدودیت", "No minimum", "无最短限制", "Sin mínimo", "Без ограничения", "Sem mínimo", "Sans minimum", "Kein Mindestvorlauf", "制限なし"),
  "windows.hours": message("{{count}} ساعت", "{{count}} hours", "{{count}} 小时", "{{count}} horas", "{{count}} ч", "{{count}} horas", "{{count}} heures", "{{count}} Stunden", "{{count}}時間"),
  "windows.days": message("{{count}} روز", "{{count}} days", "{{count}} 天", "{{count}} días", "{{count}} дней", "{{count}} dias", "{{count}} jours", "{{count}} Tage", "{{count}}日"),
  "windows.minutes": message("{{count}} دقیقه", "{{count}} minutes", "{{count}} 分钟", "{{count}} minutos", "{{count}} мин", "{{count}} minutos", "{{count}} minutes", "{{count}} Minuten", "{{count}}分"),
  "exceptions.title": message("استثناهای تقویم", "Calendar exceptions", "日历例外", "Excepciones del calendario", "Исключения календаря", "Exceções do calendário", "Exceptions du calendrier", "Kalenderausnahmen", "カレンダーの例外"),
  "exceptions.description": message("برای تعطیلی یا ساعت کاری متفاوت در یک تاریخ مشخص، استثنا اضافه کنید.", "Add an exception for a closure or different hours on a specific date.", "为特定日期的休息或不同营业时间添加例外。", "Añade una excepción para un cierre o un horario distinto en una fecha concreta.", "Добавьте исключение для выходного или особого графика в конкретную дату.", "Adicione uma exceção para fechamento ou horários diferentes em uma data específica.", "Ajoutez une exception pour une fermeture ou des horaires différents à une date précise.", "Fügen Sie für Schließungen oder abweichende Zeiten an einem Datum eine Ausnahme hinzu.", "特定日の休業または営業時間変更を例外として追加します。"),
  "exceptions.date": message("تاریخ", "Date", "日期", "Fecha", "Дата", "Data", "Date", "Datum", "日付"),
  "exceptions.type": message("نوع استثنا", "Exception type", "例外类型", "Tipo de excepción", "Тип исключения", "Tipo de exceção", "Type d’exception", "Ausnahmetyp", "例外の種類"),
  "exceptions.fullClosure": message("تعطیلی کامل", "Closed all day", "全天休息", "Cerrado todo el día", "Закрыто весь день", "Fechado o dia todo", "Fermé toute la journée", "Ganztägig geschlossen", "終日休業"),
  "exceptions.customHours": message("ساعت کاری متفاوت", "Custom hours", "自定义时间", "Horario personalizado", "Особые часы", "Horários personalizados", "Horaires personnalisés", "Abweichende Zeiten", "営業時間を変更"),
  "exceptions.start": message("شروع", "Start", "开始", "Inicio", "Начало", "Início", "Début", "Beginn", "開始"),
  "exceptions.end": message("پایان", "End", "结束", "Fin", "Окончание", "Fim", "Fin", "Ende", "終了"),
  "exceptions.add": message("افزودن استثنا", "Add exception", "添加例外", "Añadir excepción", "Добавить исключение", "Adicionar exceção", "Ajouter l’exception", "Ausnahme hinzufügen", "例外を追加"),
  "exceptions.remove": message("حذف استثنای {{date}}", "Remove exception for {{date}}", "删除 {{date}} 的例外", "Eliminar excepción del {{date}}", "Удалить исключение на {{date}}", "Remover exceção de {{date}}", "Supprimer l’exception du {{date}}", "Ausnahme für {{date}} entfernen", "{{date}} の例外を削除"),
  "exceptions.empty": message("هنوز استثنایی ثبت نشده است.", "No exceptions have been added yet.", "尚未添加例外。", "Aún no se han añadido excepciones.", "Исключения пока не добавлены.", "Nenhuma exceção foi adicionada.", "Aucune exception n’a encore été ajoutée.", "Noch keine Ausnahmen hinzugefügt.", "例外はまだ追加されていません。"),
  "exceptions.added": message("استثنای تقویم اضافه شد.", "Calendar exception added.", "日历例外已添加。", "Se añadió la excepción del calendario.", "Исключение календаря добавлено.", "Exceção adicionada ao calendário.", "L’exception a été ajoutée au calendrier.", "Kalenderausnahme hinzugefügt.", "カレンダーの例外を追加しました。"),
  "exceptions.duplicate": message("برای این تاریخ قبلاً استثنا ثبت شده است.", "An exception already exists for this date.", "该日期已有例外。", "Ya existe una excepción para esta fecha.", "На эту дату уже есть исключение.", "Já existe uma exceção para esta data.", "Une exception existe déjà pour cette date.", "Für dieses Datum gibt es bereits eine Ausnahme.", "この日付にはすでに例外があります。"),
  "conflicts.title": message("بررسی تداخل", "Conflict check", "冲突检查", "Comprobación de conflictos", "Проверка конфликтов", "Verificação de conflitos", "Vérification des conflits", "Konfliktprüfung", "競合チェック"),
  "conflicts.clear": message("تداخلی در ساعات هفتگی و استثناهای تقویم پیدا نشد.", "No conflicts were found in weekly hours or calendar exceptions.", "每周营业时间和日历例外中未发现冲突。", "No se encontraron conflictos en el horario semanal ni en las excepciones.", "Конфликтов в недельном графике и исключениях не найдено.", "Nenhum conflito encontrado nos horários semanais ou nas exceções.", "Aucun conflit détecté dans les horaires ou les exceptions.", "Keine Konflikte in Wochenzeiten oder Kalenderausnahmen gefunden.", "週間営業時間とカレンダー例外に競合はありません。"),
  "conflicts.warning": message("پیش از ذخیره، تداخل‌های زیر را برطرف کنید.", "Resolve the following conflicts before saving.", "保存前请解决以下冲突。", "Resuelve los siguientes conflictos antes de guardar.", "Устраните следующие конфликты перед сохранением.", "Resolva os conflitos abaixo antes de salvar.", "Résolvez les conflits suivants avant d’enregistrer.", "Beheben Sie vor dem Speichern die folgenden Konflikte.", "保存前に次の競合を解消してください。"),
  "conflicts.weekly": message("در {{day}} ساعت پایان باید بعد از ساعت شروع باشد.", "On {{day}}, the end time must be after the start time.", "{{day}} 的结束时间必须晚于开始时间。", "El {{day}}, la hora de fin debe ser posterior a la de inicio.", "В день «{{day}}» время окончания должно быть позже начала.", "Em {{day}}, o horário final deve ser posterior ao inicial.", "Le {{day}}, l’heure de fin doit être postérieure à l’heure de début.", "Am {{day}} muss die Endzeit nach der Startzeit liegen.", "{{day}}は終了時刻を開始時刻より後にしてください。"),
  "conflicts.exception": message("در استثنای {{date}} ساعت پایان باید بعد از ساعت شروع باشد.", "For the {{date}} exception, the end time must be after the start time.", "{{date}} 例外的结束时间必须晚于开始时间。", "En la excepción del {{date}}, la hora de fin debe ser posterior a la de inicio.", "В исключении на {{date}} время окончания должно быть позже начала.", "Na exceção de {{date}}, o horário final deve ser posterior ao inicial.", "Pour l’exception du {{date}}, l’heure de fin doit être postérieure au début.", "Bei der Ausnahme am {{date}} muss die Endzeit nach der Startzeit liegen.", "{{date}}の例外は終了時刻を開始時刻より後にしてください。"),
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

export type AvailabilityResource = Resource;
export const availabilityResources = Object.fromEntries(
  supportedLanguages.map((language, index) => [language, buildResource(index)]),
) as Record<AppLanguage, AvailabilityResource>;

export const availabilityI18n = {
  namespace: availabilityNamespace,
  resources: availabilityResources,
} as const;
