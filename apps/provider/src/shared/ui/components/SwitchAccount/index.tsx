import { useId } from "react";
import { useTranslation } from "react-i18next";
import Lucide from "@/shared/ui/components/Base/Lucide";
import { FormCheck } from "@/shared/ui/components/Base/Form";
import { Dialog } from "@/shared/ui/components/Base/Headless";

interface SwitchAccountProps {
  switchAccount: boolean;
  setSwitchAccount: (value: boolean) => void;
}

export default function SwitchAccount({
  switchAccount,
  setSwitchAccount,
}: SwitchAccountProps) {
  const { t } = useTranslation("sharedUi");
  const workspaceId = useId();

  return (
    <Dialog
      open={switchAccount}
      onClose={() => setSwitchAccount(false)}
    >
      <Dialog.Panel>
        <Dialog.Title className="justify-center h-14">
          <h2 className="text-base font-medium">{t("account.title")}</h2>
        </Dialog.Title>
        <Dialog.Description className="px-2.5 pt-3.5 pb-4">
          <div className="flex flex-col gap-1.5">
            <FormCheck.Label
              htmlFor={workspaceId}
              className="flex items-center px-2.5 py-1 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <div className="flex items-center justify-center overflow-hidden rounded-full w-11 h-11 image-fit border-[3px] border-slate-200/70">
                <Lucide
                  icon="Building2"
                  className="w-5 h-5 text-theme-1 stroke-[1.3]"
                  aria-hidden="true"
                />
              </div>
              <div className="ms-3.5">
                <div className="font-medium">
                  {t("account.currentWorkspace")}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {t("account.currentRole")}
                </div>
              </div>
              <div className="relative ms-auto w-7 h-7">
                <FormCheck.Input
                  id={workspaceId}
                  type="radio"
                  name="provider-workspace"
                  checked
                  readOnly
                  className="absolute z-10 w-full h-full opacity-0 peer"
                />
                <div className="absolute inset-0 flex items-center justify-center w-6 h-6 m-auto text-white transition-all border rounded-full opacity-0 bg-theme-1/80 border-theme-1 peer-checked:opacity-100">
                  <Lucide icon="Check" className="stroke-[1.5] w-3 h-3" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center w-6 h-6 m-auto transition-all border rounded-full text-primary border-theme-1/20 bg-theme-1/5 peer-checked:opacity-0 peer-hover:bg-theme-1/10" />
              </div>
            </FormCheck.Label>
          </div>
        </Dialog.Description>
        <Dialog.Footer className="flex items-center justify-center text-center h-14">
          <button
            type="button"
            className="block -mt-1 text-primary"
            onClick={() => setSwitchAccount(false)}
          >
            {t("account.done")}
          </button>
        </Dialog.Footer>
      </Dialog.Panel>
    </Dialog>
  );
}
