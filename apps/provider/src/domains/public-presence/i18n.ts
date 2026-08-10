import {
  supportedLanguages,
  type AppLanguage,
} from "@/shared/i18n/languages";

export const publicPresenceNamespace = "publicPresence" as const;

type MessageTuple = readonly [string, string, string, string, string, string, string, string, string];
const message = (...values: MessageTuple) => values;

const messages = {
  eyebrow: message("حضور عمومی", "Public presence", "公开页面", "Presencia pública", "Публичная страница", "Presença pública", "Présence publique", "Öffentlicher Auftritt", "公開ページ"),
  title: message("صفحه رزرو متعلق به کسب‌وکار شما", "Your provider-owned booking presence", "属于您企业的预约页面", "Tu presencia de reservas propia", "Ваша собственная страница записи", "Sua presença própria de reservas", "Votre présence de réservation", "Ihr eigener Buchungsauftritt", "事業者専用の予約ページ"),
  description: message("مشخصات عمومی، مقصد پیوند رزرو و وضعیت انتشار را در یک جا مرور کنید.", "Review public profile details, booking-link destination, and publication state in one place.", "在一处查看公开资料、预约链接目标和发布状态。", "Revisa el perfil público, el destino del enlace y el estado de publicación.", "Проверьте профиль, назначение ссылки и статус публикации.", "Revise o perfil público, o destino do link e o estado de publicação.", "Vérifiez le profil public, la destination du lien et l’état de publication.", "Prüfen Sie Profil, Linkziel und Veröffentlichungsstatus an einem Ort.", "公開プロフィール、リンク先、公開状態を一か所で確認します。"),
  profileSection: message("اطلاعات صفحه", "Page details", "页面信息", "Datos de la página", "Данные страницы", "Dados da página", "Informations de la page", "Seitendetails", "ページ情報"),
  businessName: message("نام کسب‌وکار", "Business name", "企业名称", "Nombre del negocio", "Название бизнеса", "Nome do negócio", "Nom de l’établissement", "Geschäftsname", "事業者名"),
  businessNamePlaceholder: message("نامی که مشتری می‌بیند", "Name shown to customers", "向客户显示的名称", "Nombre visible para clientes", "Название для клиентов", "Nome exibido aos clientes", "Nom affiché aux clients", "Für Kunden sichtbarer Name", "顧客に表示する名前"),
  descriptionLabel: message("معرفی کوتاه", "Short description", "简短介绍", "Descripción breve", "Краткое описание", "Descrição curta", "Description courte", "Kurzbeschreibung", "短い紹介文"),
  descriptionPlaceholder: message("کوتاه و روشن توضیح دهید چه خدماتی ارائه می‌کنید", "Briefly explain the services you provide", "简要说明您提供的服务", "Explica brevemente los servicios que ofreces", "Кратко опишите ваши услуги", "Explique brevemente os serviços oferecidos", "Décrivez brièvement vos services", "Beschreiben Sie kurz Ihre Leistungen", "提供するサービスを簡潔に説明"),
  neighborhood: message("شهر یا محله", "City or neighbourhood", "城市或街区", "Ciudad o barrio", "Город или район", "Cidade ou bairro", "Ville ou quartier", "Stadt oder Viertel", "市区町村・地域"),
  neighborhoodPlaceholder: message("برای نمایش محلی و نشانی", "For local context and address", "用于本地信息和地址", "Para el contexto local y la dirección", "Для местного контекста и адреса", "Para contexto local e endereço", "Pour le contexte local et l’adresse", "Für lokalen Kontext und Adresse", "地域情報と住所のため"),
  completion: message("تکمیل پروفایل: {{percent}}٪", "Profile completion: {{percent}}%", "资料完成度：{{percent}}%", "Perfil completado: {{percent}}%", "Профиль заполнен на {{percent}}%", "Perfil concluído: {{percent}}%", "Profil complété : {{percent}} %", "Profil vollständig: {{percent}} %", "プロフィール完成度：{{percent}}%"),
  requiredHint: message("برای انتشار، هر سه مورد را کامل کنید.", "Complete all three fields before publishing.", "发布前请完成三个字段。", "Completa los tres campos antes de publicar.", "Заполните все три поля перед публикацией.", "Preencha os três campos antes de publicar.", "Remplissez les trois champs avant de publier.", "Füllen Sie vor der Veröffentlichung alle drei Felder aus.", "公開前に3項目をすべて入力してください。"),
  linkSection: message("پیوند و QR", "Booking link and QR", "预约链接与二维码", "Enlace y QR", "Ссылка и QR", "Link e QR", "Lien et QR", "Buchungslink und QR", "予約リンクとQR"),
  bookingLink: message("پیوند رزرو", "Booking link", "预约链接", "Enlace de reservas", "Ссылка для записи", "Link de reservas", "Lien de réservation", "Buchungslink", "予約リンク"),
  copyLink: message("کپی پیوند", "Copy link", "复制链接", "Copiar enlace", "Копировать ссылку", "Copiar link", "Copier le lien", "Link kopieren", "リンクをコピー"),
  shareLink: message("اشتراک‌گذاری", "Share", "分享", "Compartir", "Поделиться", "Compartilhar", "Partager", "Teilen", "共有"),
  copied: message("پیوند کپی شد.", "Booking link copied.", "预约链接已复制。", "Enlace copiado.", "Ссылка скопирована.", "Link copiado.", "Lien copié.", "Buchungslink kopiert.", "予約リンクをコピーしました。"),
  copyFailed: message("کپی خودکار در دسترس نیست؛ پیوند را از کادر انتخاب کنید.", "Automatic copy is unavailable; select the link in the field.", "无法自动复制，请在字段中选择链接。", "La copia automática no está disponible; selecciona el enlace.", "Автокопирование недоступно; выделите ссылку в поле.", "A cópia automática não está disponível; selecione o link.", "La copie automatique est indisponible ; sélectionnez le lien.", "Automatisches Kopieren ist nicht verfügbar; wählen Sie den Link im Feld.", "自動コピーを利用できません。入力欄からリンクを選択してください。"),
  destination: message("مقصد پیوند و QR", "Link and QR destination", "链接与二维码目标", "Destino del enlace y QR", "Назначение ссылки и QR", "Destino do link e QR", "Destination du lien et du QR", "Ziel von Link und QR", "リンクとQRの遷移先"),
  publicPage: message("ابتدا صفحه عمومی", "Public page first", "先打开公开页面", "Primero la página pública", "Сначала публичная страница", "Página pública primeiro", "Page publique d’abord", "Zuerst öffentliche Seite", "公開ページを先に表示"),
  bookingFlow: message("مستقیم به شروع رزرو", "Start booking directly", "直接开始预约", "Iniciar la reserva directamente", "Сразу начать запись", "Iniciar reserva diretamente", "Commencer directement la réservation", "Buchung direkt starten", "予約を直接開始"),
  qrPreview: message("پیش‌نمایش مقصد QR", "QR destination preview", "二维码目标预览", "Vista previa del destino QR", "Предпросмотр назначения QR", "Prévia do destino do QR", "Aperçu de la destination QR", "Vorschau des QR-Ziels", "QR遷移先プレビュー"),
  qrNote: message("این نقش فقط پیش‌نمایش است؛ QR قابل اسکن پس از انتشار توسط سرویس تولید می‌شود.", "This pattern is a preview only; the service generates a scannable QR after publication.", "此图案仅供预览；发布后由服务生成可扫描二维码。", "Este patrón es solo una vista previa; el servicio genera el QR tras publicar.", "Это только макет; сканируемый QR создаётся сервисом после публикации.", "Este padrão é apenas uma prévia; o serviço gera o QR após a publicação.", "Ce motif est un aperçu ; le service génère le QR après publication.", "Dieses Muster ist nur eine Vorschau; der scanbare QR wird nach Veröffentlichung erzeugt.", "この模様はプレビューです。読み取り可能なQRは公開後に生成されます。"),
  previewSection: message("پیش‌نمایش صفحه", "Page preview", "页面预览", "Vista previa", "Предпросмотр страницы", "Prévia da página", "Aperçu de la page", "Seitenvorschau", "ページプレビュー"),
  previewFallbackName: message("نام کسب‌وکار شما", "Your business name", "您的企业名称", "Nombre de tu negocio", "Название вашего бизнеса", "Nome do seu negócio", "Nom de votre établissement", "Ihr Geschäftsname", "事業者名"),
  previewFallbackDescription: message("معرفی کوتاه شما اینجا دیده می‌شود.", "Your short description will appear here.", "您的简短介绍将显示在这里。", "Tu descripción breve aparecerá aquí.", "Здесь появится краткое описание.", "Sua descrição curta aparecerá aqui.", "Votre courte description apparaîtra ici.", "Ihre Kurzbeschreibung erscheint hier.", "短い紹介文がここに表示されます。"),
  statusDraft: message("پیش‌نویس", "Draft", "草稿", "Borrador", "Черновик", "Rascunho", "Brouillon", "Entwurf", "下書き"),
  statusPublished: message("منتشرشده", "Published", "已发布", "Publicado", "Опубликовано", "Publicado", "Publié", "Veröffentlicht", "公開済み"),
  saveDraft: message("ذخیره پیش‌نویس", "Save draft", "保存草稿", "Guardar borrador", "Сохранить черновик", "Salvar rascunho", "Enregistrer le brouillon", "Entwurf speichern", "下書きを保存"),
  saved: message("پیش‌نویس ذخیره شد.", "Draft saved.", "草稿已保存。", "Borrador guardado.", "Черновик сохранён.", "Rascunho salvo.", "Brouillon enregistré.", "Entwurf gespeichert.", "下書きを保存しました。"),
  publish: message("انتشار صفحه", "Publish page", "发布页面", "Publicar página", "Опубликовать страницу", "Publicar página", "Publier la page", "Seite veröffentlichen", "ページを公開"),
  unpublish: message("بازگشت به پیش‌نویس", "Return to draft", "返回草稿", "Volver a borrador", "Вернуть в черновики", "Voltar para rascunho", "Revenir au brouillon", "Auf Entwurf zurücksetzen", "下書きに戻す"),
  published: message("صفحه منتشر شد و مقصد پیوند به‌روز است.", "Page published and the booking destination is up to date.", "页面已发布，预约目标已更新。", "Página publicada y destino actualizado.", "Страница опубликована, назначение ссылки обновлено.", "Página publicada e destino atualizado.", "Page publiée et destination mise à jour.", "Seite veröffentlicht und Linkziel aktualisiert.", "ページを公開し、リンク先を更新しました。"),
  unpublished: message("صفحه به حالت پیش‌نویس برگشت.", "Page returned to draft.", "页面已恢复为草稿。", "La página volvió a borrador.", "Страница возвращена в черновики.", "A página voltou a rascunho.", "La page est revenue au brouillon.", "Seite wurde zum Entwurf zurückgesetzt.", "ページを下書きに戻しました。"),
} as const;

export type PublicPresenceMessages = Record<keyof typeof messages, string>;

export const publicPresenceResources = Object.fromEntries(
  supportedLanguages.map((language, languageIndex) => [
    language,
    Object.fromEntries(Object.entries(messages).map(([key, values]) => [key, values[languageIndex]])),
  ]),
) as Record<AppLanguage, PublicPresenceMessages>;

export const publicPresenceI18n = {
  namespace: publicPresenceNamespace,
  resources: publicPresenceResources,
} as const;
