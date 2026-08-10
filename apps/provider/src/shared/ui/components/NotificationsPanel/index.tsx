import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Slideover } from "@/shared/ui/components/Base/Headless";
import Button from "@/shared/ui/components/Base/Button";
import Lucide, { type icons } from "@/shared/ui/components/Base/Lucide";

interface NotificationsPanelProps {
  notificationsPanel: boolean;
  setNotificationsPanel: (value: boolean) => void;
  canNavigateTo?: (target: string) => boolean;
}

const initialNotifications: Array<{
  id: string;
  titleKey: string;
  bodyKey: string;
  timeKey: string;
  path: string;
  icon: keyof typeof icons;
  unread: boolean;
}> = [
  {
    id: "pending",
    titleKey: "notifications.pendingTitle",
    bodyKey: "notifications.pendingBody",
    timeKey: "notifications.now",
    path: "/transaction-list?status=pending",
    icon: "CalendarCheck2",
    unread: true,
  },
  {
    id: "availability",
    titleKey: "notifications.availabilityTitle",
    bodyKey: "notifications.availabilityBody",
    timeKey: "notifications.today",
    path: "/availability",
    icon: "Clock",
    unread: true,
  },
  {
    id: "tokens",
    titleKey: "notifications.tokensTitle",
    bodyKey: "notifications.tokensBody",
    timeKey: "notifications.yesterday",
    path: "/communications",
    icon: "BellDot",
    unread: false,
  },
];

const allowAllTargets = () => true;

export default function NotificationsPanel({
  notificationsPanel,
  setNotificationsPanel,
  canNavigateTo = allowAllTargets,
}: NotificationsPanelProps) {
  const { t } = useTranslation("sharedUi");
  const [items, setItems] = useState(initialNotifications);
  const [feedback, setFeedback] = useState("");
  const visibleItems = items.filter((item) => canNavigateTo(item.path));

  const markAllRead = () => {
    setItems((current) =>
      current.map((item) =>
        canNavigateTo(item.path) ? { ...item, unread: false } : item,
      ),
    );
    setFeedback(t("notifications.allRead"));
  };

  const openNotification = (id: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, unread: false } : item,
      ),
    );
    setNotificationsPanel(false);
  };

  return (
    <div>
      <Slideover
        open={notificationsPanel}
        onClose={() => setNotificationsPanel(false)}
      >
        <Slideover.Panel className="w-72 rounded-[0.75rem_0_0_0.75rem/1.1rem_0_0_1.1rem] rtl:rounded-[0_0.75rem_0.75rem_0/0_1.1rem_1.1rem_0]">
          <button
            type="button"
            aria-label={t("notifications.close")}
            title={t("notifications.close")}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white hover:bg-white/10 bg-white/5 transition-all hover:rotate-180 absolute inset-y-0 start-0 right-auto flex items-center justify-center my-auto -ms-[60px] sm:-ms-[105px] border rounded-full text-white/90 w-8 h-8 sm:w-14 sm:h-14 border-white/90 hover:scale-105"
            onClick={() => setNotificationsPanel(false)}
          >
            <Lucide
              className="w-8 h-8 stroke-[1]"
              icon="X"
              aria-hidden="true"
            />
          </button>
          <Slideover.Title className="px-6 py-5">
            <h2 className="me-auto text-base font-medium">
              {t("notifications.title")}
            </h2>
            <Button
              type="button"
              variant="outline-secondary"
              className="hidden sm:flex"
              onClick={markAllRead}
              disabled={visibleItems.every((item) => !item.unread)}
            >
              <Lucide
                icon="ShieldCheck"
                className="w-4 h-4 me-2"
                aria-hidden="true"
              />
              {t("notifications.markAllRead")}
            </Button>
          </Slideover.Title>
          <Slideover.Description className="p-0">
            <p className="sr-only" aria-live="polite">
              {feedback}
            </p>
            <div className="flex flex-col p-3 gap-0.5">
              {visibleItems.map((item) => (
                <Link
                  to={item.path}
                  key={item.id}
                  className="flex items-center px-3 py-2.5 rounded-xl hover:bg-slate-100/80"
                  onClick={() => openNotification(item.id)}
                >
                  <div>
                    <div className="flex items-center justify-center overflow-hidden border-2 rounded-full w-11 h-11 image-fit border-slate-200/70">
                      <Lucide
                        icon={item.icon}
                        className="w-5 h-5 text-theme-1 stroke-[1.3]"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <div className="sm:ms-5">
                    <div className="font-medium">{t(item.titleKey)}</div>
                    <div className="text-slate-500 mt-0.5">
                      {t(item.bodyKey)}
                    </div>
                    <div className="mt-1.5 text-xs text-slate-500">
                      {t(item.timeKey)}
                    </div>
                  </div>
                  {item.unread && (
                    <>
                      <span
                        className="flex-none w-2 h-2 ms-auto border rounded-full bg-primary/40 border-primary/40"
                        aria-hidden="true"
                      />
                      <span className="sr-only">
                        {t("notifications.unread")}
                      </span>
                    </>
                  )}
                </Link>
              ))}
            </div>
          </Slideover.Description>
        </Slideover.Panel>
      </Slideover>
    </div>
  );
}
