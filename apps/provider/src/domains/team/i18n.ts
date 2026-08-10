import {
  supportedLanguages,
  type AppLanguage,
} from "@/shared/i18n/languages";

export const teamNamespace = "team" as const;

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

const message = (...values: MessageTuple) => values;

const messages = {
  eyebrow: message("تیم", "Team", "团队", "Equipo", "Команда", "Equipe", "Équipe", "Team", "チーム"),
  title: message("کارکنان و دسترسی", "Staff and access", "员工与访问权限", "Personal y acceso", "Сотрудники и доступ", "Equipe e acesso", "Équipe et accès", "Mitarbeitende und Zugriff", "スタッフとアクセス"),
  description: message(
    "برای هر کارمند حساب ورود بسازید، سپس خدمات و برنامه او را تنظیم کنید.",
    "Create a sign-in account for each staff member, then assign their services and schedule.",
    "为每位员工创建登录账户，然后分配服务和排班。",
    "Crea una cuenta de acceso para cada empleado y luego asigna sus servicios y horario.",
    "Создайте учётную запись для каждого сотрудника, затем назначьте услуги и расписание.",
    "Crie uma conta de acesso para cada membro e depois atribua serviços e horários.",
    "Créez un compte de connexion pour chaque membre, puis attribuez ses services et horaires.",
    "Erstellen Sie für jedes Teammitglied ein Anmeldekonto und weisen Sie danach Leistungen und Zeiten zu.",
    "スタッフごとにログインアカウントを作成し、サービスと勤務時間を割り当てます。",
  ),
  distinctionTitle: message("هر کارمند جدید حساب ورود دارد", "Every new staff member gets a sign-in account", "每位新员工都会获得登录账户", "Cada nuevo empleado recibe una cuenta", "Каждый новый сотрудник получает учётную запись", "Cada novo membro recebe uma conta", "Chaque nouveau membre reçoit un compte", "Jedes neue Teammitglied erhält ein Anmeldekonto", "新しいスタッフにはログインアカウントが作成されます"),
  distinctionBody: message(
    "نام، شماره موبایل و گذرواژه اولیه الزامی است. گذرواژه پس از ایجاد حساب دوباره نمایش داده نمی‌شود.",
    "Name, mobile number, and an initial password are required. The password is never shown again after account creation.",
    "姓名、手机号和初始密码为必填项。账户创建后不会再次显示密码。",
    "El nombre, el móvil y una contraseña inicial son obligatorios. La contraseña no vuelve a mostrarse tras crear la cuenta.",
    "Имя, мобильный номер и начальный пароль обязательны. После создания пароль больше не показывается.",
    "Nome, celular e senha inicial são obrigatórios. A senha não será exibida novamente após a criação.",
    "Le nom, le mobile et un mot de passe initial sont obligatoires. Le mot de passe ne sera plus affiché après la création.",
    "Name, Mobilnummer und ein Startpasswort sind erforderlich. Das Passwort wird nach der Erstellung nicht erneut angezeigt.",
    "氏名、携帯番号、初期パスワードは必須です。作成後にパスワードが再表示されることはありません。",
  ),
  addStaffTitle: message("افزودن کارمند", "Add staff member", "添加员工", "Añadir empleado", "Добавить сотрудника", "Adicionar membro", "Ajouter un membre", "Teammitglied hinzufügen", "スタッフを追加"),
  addStaffDescription: message("اطلاعات ورود کارمند را تعریف کنید. حساب او بلافاصله با نقش کارمند فعال می‌شود.", "Define the staff member's sign-in details. Their account is created immediately with the Staff role.", "设置员工的登录信息。账户将立即以员工角色创建。", "Define los datos de acceso. La cuenta se crea inmediatamente con el rol Personal.", "Укажите данные для входа. Учётная запись сразу создаётся с ролью сотрудника.", "Defina os dados de acesso. A conta será criada imediatamente com a função de equipe.", "Définissez les informations de connexion. Le compte est créé immédiatement avec le rôle Personnel.", "Legen Sie die Anmeldedaten fest. Das Konto wird sofort mit der Rolle Mitarbeitende erstellt.", "ログイン情報を設定します。スタッフ権限のアカウントがすぐに作成されます。"),
  fullName: message("نام و نام خانوادگی", "Full name", "姓名", "Nombre completo", "Полное имя", "Nome completo", "Nom complet", "Vollständiger Name", "氏名"),
  phoneNumber: message("شماره موبایل", "Mobile number", "手机号", "Número de móvil", "Мобильный номер", "Número de celular", "Numéro de mobile", "Mobilnummer", "携帯番号"),
  phonePlaceholder: message("912 345 6789", "912 345 6789", "912 345 6789", "912 345 6789", "912 345 6789", "912 345 6789", "912 345 6789", "912 345 6789", "912 345 6789"),
  phoneRegionLabel: message("کشور یا منطقه", "Country or region", "国家或地区", "País o región", "Страна или регион", "País ou região", "Pays ou région", "Land oder Region", "国または地域"),
  iranRegionName: message("ایران", "Iran", "伊朗", "Irán", "Иран", "Irã", "Iran", "Iran", "イラン"),
  phoneHint: message("شماره را با ۹ وارد کنید؛ صفر ابتدای آن اختیاری است (۱۰ یا ۱۱ رقم).", "Start with 9; the leading zero is optional (10 or 11 digits).", "请输入以 9 开头的号码；开头的 0 可省略（10 或 11 位）。", "Empieza por 9; el cero inicial es opcional (10 u 11 dígitos).", "Введите номер с 9; начальный 0 необязателен (10 или 11 цифр).", "Comece com 9; o zero inicial é opcional (10 ou 11 dígitos).", "Commencez par 9 ; le zéro initial est facultatif (10 ou 11 chiffres).", "Beginnen Sie mit 9; die führende 0 ist optional (10 oder 11 Ziffern).", "9から入力してください。先頭の0は省略できます（10桁または11桁）。"),
  initialPassword: message("گذرواژه اولیه", "Initial password", "初始密码", "Contraseña inicial", "Начальный пароль", "Senha inicial", "Mot de passe initial", "Startpasswort", "初期パスワード"),
  confirmPassword: message("تکرار گذرواژه", "Confirm password", "确认密码", "Confirmar contraseña", "Подтвердите пароль", "Confirmar senha", "Confirmer le mot de passe", "Passwort bestätigen", "パスワード確認"),
  passwordHelp: message("حداقل ۸ نویسه؛ ترکیب واژه‌ها، عددها و نمادها بهتر است.", "Use at least 8 characters; a mix of words, numbers, and symbols is stronger.", "至少使用8个字符；组合文字、数字和符号会更安全。", "Usa al menos 8 caracteres; combina palabras, números y símbolos.", "Используйте не менее 8 символов; сочетайте буквы, цифры и знаки.", "Use pelo menos 8 caracteres; combine palavras, números e símbolos.", "Utilisez au moins 8 caractères ; combinez mots, chiffres et symboles.", "Verwenden Sie mindestens 8 Zeichen und kombinieren Sie Wörter, Zahlen und Symbole.", "8文字以上を使用し、文字・数字・記号を組み合わせてください。"),
  showPassword: message("نمایش", "Show", "显示", "Mostrar", "Показать", "Mostrar", "Afficher", "Anzeigen", "表示"),
  hidePassword: message("پنهان", "Hide", "隐藏", "Ocultar", "Скрыть", "Ocultar", "Masquer", "Ausblenden", "隠す"),
  capsLockOn: message("Caps Lock روشن است", "Caps Lock is on", "大写锁定已开启", "Bloq Mayús está activado", "Caps Lock включен", "Caps Lock está ativado", "Verr. Maj est activé", "Feststelltaste ist aktiv", "Caps Lock がオンです"),
  passwordStrength: message("قدرت گذرواژه", "Password strength", "密码强度", "Seguridad de la contraseña", "Надежность пароля", "Força da senha", "Robustesse du mot de passe", "Passwortstärke", "パスワード強度"),
  strengthVeryWeak: message("بسیار ضعیف", "Very weak", "很弱", "Muy débil", "Очень слабый", "Muito fraca", "Très faible", "Sehr schwach", "非常に弱い"),
  strengthWeak: message("ضعیف", "Weak", "弱", "Débil", "Слабый", "Fraca", "Faible", "Schwach", "弱い"),
  strengthGood: message("خوب", "Good", "良好", "Buena", "Хороший", "Boa", "Bonne", "Gut", "良好"),
  strengthStrong: message("قوی", "Strong", "强", "Fuerte", "Надежный", "Forte", "Forte", "Stark", "強い"),
  nameRequired: message("نام کارمند را وارد کنید.", "Enter the staff member's name.", "请输入员工姓名。", "Introduce el nombre del empleado.", "Введите имя сотрудника.", "Informe o nome do membro.", "Saisissez le nom du membre.", "Geben Sie den Namen des Teammitglieds ein.", "スタッフの氏名を入力してください。"),
  phoneInvalid: message("شماره موبایل معتبر ایران وارد کنید.", "Enter a valid Iranian mobile number.", "请输入有效的伊朗手机号。", "Introduce un número móvil iraní válido.", "Введите действительный иранский мобильный номер.", "Informe um celular iraniano válido.", "Saisissez un numéro mobile iranien valide.", "Geben Sie eine gültige iranische Mobilnummer ein.", "有効なイランの携帯番号を入力してください。"),
  passwordWeak: message("گذرواژه باید حداقل ۸ نویسه داشته باشد.", "Password must contain at least 8 characters.", "密码至少需要8个字符。", "La contraseña debe tener al menos 8 caracteres.", "Пароль должен содержать не менее 8 символов.", "A senha deve ter pelo menos 8 caracteres.", "Le mot de passe doit contenir au moins 8 caractères.", "Das Passwort muss mindestens 8 Zeichen enthalten.", "パスワードは8文字以上にしてください。"),
  passwordMismatch: message("تکرار گذرواژه یکسان نیست.", "Passwords do not match.", "两次输入的密码不一致。", "Las contraseñas no coinciden.", "Пароли не совпадают.", "As senhas não coincidem.", "Les mots de passe ne correspondent pas.", "Die Passwörter stimmen nicht überein.", "パスワードが一致しません。"),
  phoneInUse: message("این شماره موبایل قبلاً استفاده شده است.", "This mobile number is already in use.", "该手机号已被使用。", "Este número ya está en uso.", "Этот мобильный номер уже используется.", "Este número já está em uso.", "Ce numéro est déjà utilisé.", "Diese Mobilnummer wird bereits verwendet.", "この携帯番号は既に使用されています。"),
  createFailed: message("ایجاد حساب کارمند انجام نشد. دوباره تلاش کنید.", "The staff account could not be created. Try again.", "无法创建员工账户，请重试。", "No se pudo crear la cuenta. Inténtalo de nuevo.", "Не удалось создать учётную запись. Повторите попытку.", "Não foi possível criar a conta. Tente novamente.", "Le compte n’a pas pu être créé. Réessayez.", "Das Konto konnte nicht erstellt werden. Versuchen Sie es erneut.", "スタッフアカウントを作成できませんでした。もう一度お試しください。"),
  staffCreated: message("حساب {{name}} ایجاد شد.", "Account for {{name}} was created.", "已为{{name}}创建账户。", "Se creó la cuenta de {{name}}.", "Учётная запись {{name}} создана.", "A conta de {{name}} foi criada.", "Le compte de {{name}} a été créé.", "Das Konto für {{name}} wurde erstellt.", "{{name}}のアカウントを作成しました。"),
  createStaff: message("ایجاد حساب کارمند", "Create staff account", "创建员工账户", "Crear cuenta", "Создать учётную запись", "Criar conta", "Créer le compte", "Mitarbeiterkonto erstellen", "スタッフアカウントを作成"),
  creatingStaff: message("در حال ایجاد...", "Creating account…", "正在创建账户…", "Creando cuenta…", "Создание учётной записи…", "Criando conta…", "Création du compte…", "Konto wird erstellt…", "アカウントを作成中…"),
  roster: message("فهرست کارکنان", "Staff roster", "员工名单", "Lista de personal", "Список сотрудников", "Lista da equipe", "Liste de l’équipe", "Mitarbeiterliste", "スタッフ一覧"),
  profile: message("پروفایل", "Profile", "档案", "Perfil", "Профиль", "Perfil", "Profil", "Profil", "プロフィール"),
  services: message("خدمات قابل ارائه", "Assigned services", "已分配服务", "Servicios asignados", "Назначенные услуги", "Serviços atribuídos", "Services attribués", "Zugewiesene Leistungen", "担当サービス"),
  schedule: message("برنامه", "Schedule", "排班", "Horario", "Расписание", "Horário", "Horaires", "Zeitplan", "勤務時間"),
  access: message("دسترسی پنل", "Panel access", "面板访问", "Acceso al panel", "Доступ к панели", "Acesso ao painel", "Accès au panneau", "Panelzugriff", "管理画面アクセス"),
  ownerProfile: message("مالک کسب‌وکار", "Business owner", "企业所有者", "Propietario del negocio", "Владелец бизнеса", "Proprietário do negócio", "Propriétaire", "Geschäftsinhaber", "事業者オーナー"),
  leadProfile: message("متخصص ارشد", "Lead specialist", "高级专业人员", "Especialista principal", "Ведущий специалист", "Especialista principal", "Spécialiste principal", "Leitende Fachkraft", "リードスペシャリスト"),
  assistantProfile: message("متخصص همکار", "Associate specialist", "协作专业人员", "Especialista asociado", "Специалист", "Especialista associado", "Spécialiste associé", "Weitere Fachkraft", "アソシエイトスタッフ"),
  ownerRole: message("مالک", "Owner", "所有者", "Propietario", "Владелец", "Proprietário", "Propriétaire", "Inhaber", "オーナー"),
  staffRole: message("کارمند", "Staff", "员工", "Personal", "Сотрудник", "Equipe", "Personnel", "Mitarbeiter", "スタッフ"),
  fullWeek: message("همه روزهای کاری", "All business days", "所有营业日", "Todos los días laborables", "Все рабочие дни", "Todos os dias úteis", "Tous les jours ouvrés", "Alle Geschäftstage", "全営業日"),
  weekdays: message("شنبه تا چهارشنبه", "Core weekdays", "主要工作日", "Días laborables principales", "Основные рабочие дни", "Dias úteis principais", "Jours ouvrés principaux", "Kernarbeitstage", "主要営業日"),
  flexible: message("برنامه شناور", "Flexible schedule", "灵活排班", "Horario flexible", "Гибкое расписание", "Horário flexível", "Horaires flexibles", "Flexibler Zeitplan", "柔軟な勤務時間"),
  serviceCut: message("کوتاهی و پیرایش", "Cut and styling", "剪发与造型", "Corte y peinado", "Стрижка и укладка", "Corte e finalização", "Coupe et coiffage", "Schnitt und Styling", "カットとスタイリング"),
  serviceColor: message("رنگ و مراقبت", "Colour and care", "染发与护理", "Color y cuidado", "Окрашивание и уход", "Coloração e cuidados", "Couleur et soin", "Farbe und Pflege", "カラーとケア"),
  serviceConsultation: message("مشاوره", "Consultation", "咨询", "Consulta", "Консультация", "Consulta", "Consultation", "Beratung", "カウンセリング"),
  ownerAccess: message("دسترسی کامل مالک", "Owner access", "所有者访问权限", "Acceso de propietario", "Доступ владельца", "Acesso do proprietário", "Accès propriétaire", "Inhaberzugriff", "オーナーアクセス"),
  activeAccess: message("حساب فعال", "Active account", "账户已启用", "Cuenta activa", "Активный аккаунт", "Conta ativa", "Compte actif", "Aktives Konto", "有効なアカウント"),
  invitationPending: message("دعوت در انتظار", "Invitation pending", "邀请待处理", "Invitación pendiente", "Приглашение ожидает", "Convite pendente", "Invitation en attente", "Einladung ausstehend", "招待保留中"),
  profileOnly: message("فقط پروفایل کاری", "Profile only", "仅员工档案", "Solo perfil", "Только профиль", "Somente perfil", "Profil uniquement", "Nur Profil", "プロフィールのみ"),
  serviceLabel: message("خدمات {{name}}", "Services for {{name}}", "{{name}} 的服务", "Servicios de {{name}}", "Услуги: {{name}}", "Serviços de {{name}}", "Services de {{name}}", "Leistungen für {{name}}", "{{name}}のサービス"),
  accessLabel: message("وضعیت دسترسی {{name}}", "Access state for {{name}}", "{{name}} 的访问状态", "Acceso de {{name}}", "Доступ: {{name}}", "Acesso de {{name}}", "Accès de {{name}}", "Zugriff für {{name}}", "{{name}}のアクセス状態"),
  save: message("ذخیره تغییرات تیم", "Save team changes", "保存团队更改", "Guardar cambios", "Сохранить изменения", "Salvar alterações", "Enregistrer les modifications", "Teamänderungen speichern", "チームの変更を保存"),
  saved: message("تغییرات تیم ذخیره شد.", "Team changes saved.", "团队更改已保存。", "Cambios guardados.", "Изменения сохранены.", "Alterações salvas.", "Modifications enregistrées.", "Teamänderungen gespeichert.", "チームの変更を保存しました。"),
  unsaved: message("تغییر ذخیره‌نشده دارید.", "You have unsaved changes.", "有未保存的更改。", "Hay cambios sin guardar.", "Есть несохранённые изменения.", "Há alterações não salvas.", "Des modifications ne sont pas enregistrées.", "Es gibt ungespeicherte Änderungen.", "未保存の変更があります。"),
} as const;

export type TeamMessages = Record<keyof typeof messages, string>;

export const teamResources = Object.fromEntries(
  supportedLanguages.map((language, languageIndex) => [
    language,
    Object.fromEntries(
      Object.entries(messages).map(([key, values]) => [key, values[languageIndex]]),
    ),
  ]),
) as Record<AppLanguage, TeamMessages>;

export const teamI18n = {
  namespace: teamNamespace,
  resources: teamResources,
} as const;
