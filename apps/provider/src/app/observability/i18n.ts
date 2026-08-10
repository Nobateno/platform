import type { AppLanguage } from "@/shared/i18n";

type ErrorBoundaryTranslations = {
  title: string;
  description: string;
  retry: string;
  reload: string;
};

export const observabilityI18n = {
  namespace: "observability",
  resources: {
    fa: {
      errorBoundary: {
        title: "مشکلی پیش آمد",
        description:
          "این بخش به‌درستی بارگذاری نشد. دوباره تلاش کنید یا برنامه را تازه‌سازی کنید.",
        retry: "تلاش دوباره",
        reload: "تازه‌سازی برنامه",
      },
    },
    en: {
      errorBoundary: {
        title: "Something went wrong",
        description:
          "This part of the app could not load correctly. Try again or reload the app.",
        retry: "Try again",
        reload: "Reload app",
      },
    },
    zh: {
      errorBoundary: {
        title: "出现了问题",
        description: "此部分未能正确加载。请重试或重新加载应用。",
        retry: "重试",
        reload: "重新加载应用",
      },
    },
    es: {
      errorBoundary: {
        title: "Algo salió mal",
        description:
          "Esta parte de la aplicación no se pudo cargar correctamente. Inténtalo de nuevo o recarga la aplicación.",
        retry: "Intentar de nuevo",
        reload: "Recargar la aplicación",
      },
    },
    ru: {
      errorBoundary: {
        title: "Что-то пошло не так",
        description:
          "Не удалось правильно загрузить эту часть приложения. Повторите попытку или перезагрузите приложение.",
        retry: "Повторить",
        reload: "Перезагрузить приложение",
      },
    },
    pt: {
      errorBoundary: {
        title: "Algo deu errado",
        description:
          "Não foi possível carregar esta parte do aplicativo corretamente. Tente novamente ou recarregue o aplicativo.",
        retry: "Tentar novamente",
        reload: "Recarregar aplicativo",
      },
    },
    fr: {
      errorBoundary: {
        title: "Un problème est survenu",
        description:
          "Cette partie de l’application n’a pas pu se charger correctement. Réessayez ou rechargez l’application.",
        retry: "Réessayer",
        reload: "Recharger l’application",
      },
    },
    de: {
      errorBoundary: {
        title: "Etwas ist schiefgelaufen",
        description:
          "Dieser Teil der App konnte nicht richtig geladen werden. Versuchen Sie es erneut oder laden Sie die App neu.",
        retry: "Erneut versuchen",
        reload: "App neu laden",
      },
    },
    ja: {
      errorBoundary: {
        title: "問題が発生しました",
        description:
          "この部分を正しく読み込めませんでした。もう一度試すか、アプリを再読み込みしてください。",
        retry: "もう一度試す",
        reload: "アプリを再読み込み",
      },
    },
  } satisfies Record<
    AppLanguage,
    { errorBoundary: ErrorBoundaryTranslations }
  >,
} as const;
