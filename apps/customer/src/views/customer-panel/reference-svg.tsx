"use client";

import {
  assets,
  copy,
  dateOptions,
  getDate,
  getService,
  getStaff,
  getTime,
  provider,
  services,
  staff,
  timeSlots,
  type Locale,
} from "@/data/customer-fixture";
import type { BookingDraft } from "@/lib/booking/booking-context";
import { type CSSProperties, type ReactNode } from "react";

export type ColorPalette = {
  background: string;
  surface: string;
  surfaceContainer: string;
  surfaceHigh: string;
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  onSurface: string;
  muted: string;
  outline: string;
  success: string;
};

export type ScreenContext = {
  locale: Locale;
  rtl: boolean;
  strings: (typeof copy)[Locale];
  palette: ColorPalette;
};

type IconName =
  | "badge"
  | "calendar"
  | "check"
  | "chevronLeft"
  | "chevronRight"
  | "clock"
  | "funnel"
  | "heart"
  | "minus"
  | "plus"
  | "search"
  | "scissors"
  | "share"
  | "shield"
  | "user"
  | "users";

const iconPaths: Record<IconName, ReactNode> = {
  check: <path d="M20 6 9 17l-5-5" />,
  search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.5 5.5 0 0 0 0-7.8Z" />,
  funnel: <path d="M22 3H2l8 9.5V19l4 2v-8.5L22 3Z" />,
  calendar: <><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 22a8 8 0 0 1 16 0" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 1 0 7.8" /><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>,
  scissors: <><circle cx="6" cy="7" r="3" /><circle cx="6" cy="17" r="3" /><path d="m8.6 8.5 12.4 7M8.6 15.5 21 8.5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  badge: <><path d="M12 2l3 2 3.5-.5.5 3.5 2 3-2 3 .5 3.5-3.5.5-3 2-3-2-3.5.5-.5-3.5-2-3 2-3-.5-3.5L9 4l3-2Z" /><path d="m9 12 2 2 4-4" /></>,
  shield: <><path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3v8Z" /><path d="m9 12 2 2 4-4" /></>,
  plus: <path d="M5 12h14M12 5v14" />,
  minus: <path d="M5 12h14" />,
};

function classNames(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

function SvgIcon({ name, x, y, size = 24, tone = "icon-stroke" }: { name: IconName; x: number; y: number; size?: number; tone?: string }) {
  const scale = size / 24;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} className={tone} fill="none" strokeWidth="2">
      {iconPaths[name]}
    </g>
  );
}

function Text({ context, x, y, className, children, anchor }: { context: ScreenContext; x: number; y: number; className: string; children: ReactNode; anchor?: "start" | "middle" | "end" }) {
  const physicalAnchor = anchor ?? (context.rtl ? "end" : "start");
  const textAnchor = context.rtl && physicalAnchor !== "middle"
    ? physicalAnchor === "end" ? "start" : "end"
    : physicalAnchor;
  return (
    <text
      x={x}
      y={y}
      className={classNames(className, context.rtl ? "rtl" : "ltr")}
      textAnchor={textAnchor}
      direction={context.rtl ? "rtl" : "ltr"}
    >
      {children}
    </text>
  );
}

function Photo({ id, href, x, y, width, height, radius = 0, position = "xMidYMid slice" }: { id: string; href: string; x: number; y: number; width: number; height: number; radius?: number; position?: string }) {
  return (
    <>
      <defs><clipPath id={id}><rect x={x} y={y} width={width} height={height} rx={radius} /></clipPath></defs>
      <image href={href} x={x} y={y} width={width} height={height} preserveAspectRatio={position} clipPath={`url(#${id})`} />
    </>
  );
}

function CirclePhoto({ id, href, cx, cy, radius, position = "xMidYMid slice" }: { id: string; href: string; cx: number; cy: number; radius: number; position?: string }) {
  return (
    <>
      <defs><clipPath id={id}><circle cx={cx} cy={cy} r={radius} /></clipPath></defs>
      <image href={href} x={cx - radius} y={cy - radius} width={radius * 2} height={radius * 2} preserveAspectRatio={position} clipPath={`url(#${id})`} />
    </>
  );
}

function SvgShell({ context, label, children }: { context: ScreenContext; label: string; children: ReactNode }) {
  return (
    <svg className="customer-reference-svg" xmlns="http://www.w3.org/2000/svg" width="390" height="844" viewBox="0 0 390 844" role="img" aria-label={label} lang={context.locale === "fa" ? "fa-IR" : "en"} direction={context.rtl ? "rtl" : "ltr"}>
      <g>
        <rect width="390" height="844" className="screen-bg" />
        {children}
      </g>
    </svg>
  );
}

function ProviderHeader({ context, prefix }: { context: ScreenContext; prefix: string }) {
  const avatarX = context.rtl ? 346 : 44;
  const nameX = context.rtl ? 310 : 80;
  const statusDotX = context.rtl ? 67 : 327;
  const statusTextX = context.rtl ? 57 : 337;
  return <>
    <rect x="0.5" y="0.5" width="389" height="103" className="surface divider-stroke" strokeWidth="1" />
    <CirclePhoto id={`${prefix}-header-avatar`} href={assets.arman} cx={avatarX} cy={52} radius={28} position="xMidYMin slice" />
    <circle cx={avatarX} cy="52" r="29" className="photo-stroke" />
    <Text context={context} x={nameX} y={47} className="provider-name on-surface">{provider.shortName[context.locale]}</Text>
    <Text context={context} x={nameX} y={68} className="provider-meta on-surface-variant">{provider.meta[context.locale]}</Text>
    <circle cx={statusDotX} cy="40" r="6" className="success" />
    <Text context={context} x={statusTextX} y={45} className="body-medium on-surface" anchor={context.rtl ? "end" : "start"}>{context.strings.online}</Text>
  </>;
}

function StepNode({ context, x, labelX, label, ordinal, state }: { context: ScreenContext; x: number; labelX: number; label: string; ordinal: string; state: "completed" | "current" | "future" }) {
  if (state === "completed") {
    return <g>
      <circle cx={x} cy="140" r="15" className="primary-fill" />
      <SvgIcon name="check" x={x - 8} y={132} size={16} tone="icon-on-primary" />
      <Text context={context} x={labelX} y={145} className="label-large on-surface" anchor={context.rtl ? "end" : "start"}>{label}</Text>
    </g>;
  }
  const stroke = state === "current" ? "primary-stroke" : "outline-stroke";
  const textTone = state === "current" ? "primary-text" : "on-surface-variant";
  return <g>
    <circle cx={x} cy="140" r="15" fill="none" className={stroke} strokeWidth="2" />
    <Text context={context} x={x} y={145} className={classNames("label-large", textTone)} anchor="middle">{ordinal}</Text>
    <Text context={context} x={labelX} y={145} className={classNames("label-large", textTone)} anchor={context.rtl ? "end" : "start"}>{label}</Text>
  </g>;
}

function Stepper({ context, current }: { context: ScreenContext; current: number }) {
  const nodes = context.rtl
    ? [[548, 524], [415, 391], [265, 241], [115, 91]]
    : [[32, 56], [165, 189], [315, 339], [465, 489]];
  const connectors = context.rtl ? [[452, 435], [338, 300], [200, 150]] : [[128, 145], [242, 280], [380, 430]];
  const offset = (context.rtl ? [-190, -190, -80, 110] : [0, 0, -130, -240])[current];
  const ordinals = context.rtl ? ["۱", "۲", "۳", "۴"] : ["1", "2", "3", "4"];
  const state = (index: number) => index < current ? "completed" as const : index === current ? "current" as const : "future" as const;
  const connectorTone = (after: number) => after <= current ? "primary-stroke" : "outline-stroke";
  return <>
    <rect x="0.5" y="108.5" width="389" height="63" className="surface divider-stroke" strokeWidth="1" />
    <g clipPath="inset(0 0 0 0)">
      <g transform={`translate(${offset} 0)`}>
        <StepNode context={context} x={nodes[0][0]} labelX={nodes[0][1]} label={context.strings.steps[0]} ordinal={ordinals[0]} state={state(0)} />
        <line x1={connectors[0][0]} y1="140" x2={connectors[0][1]} y2="140" className={connectorTone(1)} strokeWidth="1.5" />
        <StepNode context={context} x={nodes[1][0]} labelX={nodes[1][1]} label={context.strings.steps[1]} ordinal={ordinals[1]} state={state(1)} />
        <line x1={connectors[1][0]} y1="140" x2={connectors[1][1]} y2="140" className={connectorTone(2)} strokeWidth="1.5" />
        <StepNode context={context} x={nodes[2][0]} labelX={nodes[2][1]} label={context.strings.steps[2]} ordinal={ordinals[2]} state={state(2)} />
        <line x1={connectors[2][0]} y1="140" x2={connectors[2][1]} y2="140" className={connectorTone(3)} strokeWidth="1.5" />
        <StepNode context={context} x={nodes[3][0]} labelX={nodes[3][1]} label={context.strings.steps[3]} ordinal={ordinals[3]} state={state(3)} />
      </g>
    </g>
  </>;
}

function BookingFooter({ context, label, value, cta, review = false }: { context: ScreenContext; label: string; value: string; cta: string; review?: boolean }) {
  const footerY = review ? 712.5 : 728.5;
  const height = review ? 131 : 115;
  const labelY = review ? 742 : 759;
  const buttonY = review ? 772 : 779;
  const buttonLabelY = review ? 807 : 814;
  return <>
    <rect x="0.5" y={footerY} width="389" height={height} className="surface divider-stroke" strokeWidth="1" />
    <Text context={context} x={context.rtl ? 374 : 16} y={labelY} className="label-large on-surface-variant" anchor={context.rtl ? "end" : "start"}>{label}</Text>
    <Text context={context} x={context.rtl ? 16 : 374} y={labelY} className="title-medium on-surface" anchor={context.rtl ? "start" : "end"}>{value}</Text>
    <rect x="16" y={buttonY} width="358" height="56" rx="12" className="primary-fill elevated" />
    <Text context={context} x={195} y={buttonLabelY} className="button-label on-primary" anchor="middle">{cta}</Text>
  </>;
}

function ProfileScreen({ context }: { context: ScreenContext }) {
  const prefix = "profile";
  const avatarX = context.rtl ? 318 : 72;
  const shareCenter = context.rtl ? 84 : 306;
  const heartCenter = context.rtl ? 36 : 354;
  const nameX = context.rtl ? 374 : 16;
  const statusDotX = context.rtl ? 65 : 325;
  const statusTextX = context.rtl ? 55 : 337;
  const filterX = context.rtl ? 16 : 334;
  const centers = context.rtl ? [350, 246, 142, 38] : [40, 144, 248, 352];
  const highlightImages = [assets.fade, assets.beard, assets.trim, assets.cover];
  return <SvgShell context={context} label={provider.name[context.locale]}>
    <Photo id={`${prefix}-cover`} href={assets.cover} x={16} y={16} width={358} height={136} radius={20} />
    <rect x="16.5" y="16.5" width="357" height="135" rx="19.5" fill="none" className="outline-stroke" strokeWidth="1" />
    <circle cx={avatarX} cy="152" r="47" className="surface elevated" />
    <CirclePhoto id={`${prefix}-avatar`} href={assets.arman} cx={avatarX} cy={152} radius={42} position="xMidYMin slice" />
    <circle cx={avatarX} cy="152" r="43" className="photo-stroke" />
    <SvgIcon name="share" x={shareCenter - 12} y={168} />
    <SvgIcon name="heart" x={heartCenter - 12} y={168} />
    <Text context={context} x={nameX} y={228} className="profile-name on-surface">{provider.name[context.locale]}</Text>
    <circle cx={statusDotX} cy="219" r="6" className="success" />
    <Text context={context} x={statusTextX} y={224} className="body-medium on-surface" anchor={context.rtl ? "end" : "start"}>{context.strings.online}</Text>
    <Text context={context} x={nameX} y={253} className="body-medium on-surface-variant">{provider.meta[context.locale]}</Text>
    <Text context={context} x={nameX} y={275} className="body-small on-surface-variant">{context.locale === "fa" ? "کوتاهی، اصلاح ریش و خدمات مراقبتی آقایان در تهرانپارس" : "Modern haircuts, beard care and grooming in Tehranpars."}</Text>
    <Text context={context} x={nameX} y={319} className="title-large on-surface">{context.strings.highlights}</Text>
    {context.strings.highlightItems.map((item, index) => <g key={item}>
      <CirclePhoto id={`${prefix}-highlight-${index}`} href={highlightImages[index]} cx={centers[index]} cy={370} radius={34} />
      <circle cx={centers[index]} cy="370" r="35" className="photo-stroke" />
      <Text context={context} x={centers[index]} y={421} className="label-small on-surface-variant" anchor="middle">{item}</Text>
    </g>)}
    <rect x="0" y="449" width="390" height="44" className="surface" />
    {context.strings.tabs.map((item, index) => {
      const logical = context.rtl ? 3 - index : index;
      const x = logical * 97.5 + 48.75;
      return <g key={item}>
        <Text context={context} x={x} y={480} className={classNames("label-large", index === 0 ? "primary-text" : "on-surface")} anchor="middle">{item}</Text>
        {index === 0 && <line x1={logical * 97.5 + 16} y1="493" x2={(logical + 1) * 97.5 - 16} y2="493" className="primary-stroke" strokeWidth="2" />}
      </g>;
    })}
    <line x1="0" y1="493" x2="390" y2="493" className="divider-stroke" strokeWidth="1" />
    <Text context={context} x={nameX} y={530} className="title-large on-surface">{context.strings.gallery}</Text>
    <rect x={filterX} y="505" width="40" height="40" rx="12" className="primary-fill" />
    <SvgIcon name="funnel" x={filterX + 8} y={513} tone="icon-on-primary" />
    <Photo id={`${prefix}-fade`} href={assets.fade} x={16} y={552} width={171} height={210} radius={8} />
    <Photo id={`${prefix}-beard`} href={assets.beard} x={203} y={552} width={171} height={92} radius={8} />
    <Photo id={`${prefix}-trim`} href={assets.trim} x={203} y={660} width={171} height={142} radius={8} />
    <rect x="0.5" y="772.5" width="389" height="71" className="surface divider-stroke" strokeWidth="1" />
    <rect x="16" y="779" width="358" height="56" rx="12" className="primary-fill elevated" />
    <SvgIcon name="calendar" x={context.rtl ? 242 : 96} y={795} tone="icon-on-primary" />
    <Text context={context} x={195} y={814} className="button-label on-primary" anchor="middle">{context.strings.book}</Text>
  </SvgShell>;
}

function ChoiceCard({ context, y, title, body, selected, image, providerChoice }: { context: ScreenContext; y: number; title: string; body: string; selected: boolean; image?: string; providerChoice?: boolean }) {
  const mediaX = context.rtl ? 310 : 24;
  const textX = context.rtl ? 302 : 88;
  const radioX = context.rtl ? 40 : 350;
  const stroke = selected ? "primary-stroke" : "outline-stroke";
  const titleTone = selected ? "on-primary-container" : "on-surface";
  const bodyTone = selected ? "on-primary-container" : "on-surface-variant";
  return <g>
    <rect x="16.5" y={y + 0.5} width="357" height="79" rx="12" className={classNames(selected ? "selected-surface" : "surface", stroke)} strokeWidth={selected ? 1.5 : 1} />
    <rect x={mediaX} y={y + 12} width="56" height="56" rx="12" className="surface-high" />
    {providerChoice ? <SvgIcon name="users" x={mediaX + 16} y={y + 28} tone="icon-variant" /> : image ? <Photo id={`staff-${y}`} href={image} x={mediaX} y={y + 12} width={56} height={56} radius={12} position="xMidYMin slice" /> : null}
    <Text context={context} x={textX} y={y + 37} className={classNames("title-medium", titleTone)}>{title}</Text>
    <Text context={context} x={textX} y={y + 61} className={classNames("body-small", bodyTone)}>{body}</Text>
    <circle cx={radioX} cy={y + 40} r="12" fill="none" className={stroke} strokeWidth="2" />
    {selected && <circle cx={radioX} cy={y + 40} r="8" className="primary-fill" />}
  </g>;
}

function StaffScreen({ context, draft }: { context: ScreenContext; draft: BookingDraft }) {
  const contentX = context.rtl ? 374 : 16;
  return <SvgShell context={context} label={context.strings.staffTitle}>
    <ProviderHeader context={context} prefix="staff" />
    <Stepper context={context} current={0} />
    <rect x="0.5" y="176.5" width="389" height="547" className="surface divider-stroke" strokeWidth="1" />
    <Text context={context} x={contentX} y={207} className="heading on-surface">{context.strings.staffTitle}</Text>
    <Text context={context} x={contentX} y={230} className="body-medium on-surface-variant">{context.strings.staffSubtitle}</Text>
    <ChoiceCard context={context} y={248} title={context.strings.providerChoice} body={context.strings.providerChoiceBody} selected={draft.staffId === null} providerChoice />
    {staff.map((member, index) => <ChoiceCard key={member.id} context={context} y={336 + index * 88} title={member.name[context.locale]} body={member.role[context.locale]} selected={draft.staffId === member.id} image={member.image} />)}
    <BookingFooter context={context} label={context.strings.staffLabel} value={draft.staffId ? getStaff(draft.staffId)?.name[context.locale] ?? "" : context.strings.providerChoice} cta={context.strings.staffCta} />
  </SvgShell>;
}

function ServiceCard({ context, y, service, selected }: { context: ScreenContext; y: number; service: (typeof services)[number]; selected: boolean }) {
  const mediaX = context.rtl ? 310 : 24;
  const textX = context.rtl ? 302 : 88;
  const radioX = context.rtl ? 40 : 350;
  const stroke = selected ? "primary-stroke" : "outline-stroke";
  const titleTone = selected ? "on-primary-container" : "on-surface";
  const supportingTone = selected ? "on-primary-container" : "on-surface-variant";
  return <g>
    <rect x="16.5" y={y + 0.5} width="357" height="79" rx="12" className={classNames(selected ? "selected-surface" : "surface", stroke)} strokeWidth={selected ? 1.5 : 1} />
    <rect x={mediaX} y={y + 12} width="56" height="56" rx="8" className="surface-high" />
    <Photo id={`service-${service.id}`} href={service.image} x={mediaX} y={y + 12} width={56} height={56} radius={8} />
    <Text context={context} x={textX} y={y + 27} className={classNames("title-medium", titleTone)}>{service.name[context.locale]}</Text>
    <Text context={context} x={textX} y={y + 47} className={classNames("body-small", supportingTone)}>{service.description[context.locale]}</Text>
    <Text context={context} x={textX} y={y + 67} className={classNames("label-medium", selected ? "on-primary-container" : "on-surface")}>{service.detail[context.locale]}</Text>
    <circle cx={radioX} cy={y + 40} r="12" fill="none" className={stroke} strokeWidth="2" />
    <SvgIcon name={selected ? "minus" : "plus"} x={radioX - 8} y={y + 32} size={16} tone={selected ? "icon-primary" : "icon-variant"} />
  </g>;
}

function ServiceScreen({ context, draft }: { context: ScreenContext; draft: BookingDraft }) {
  const contentX = context.rtl ? 374 : 16;
  const searchIconX = context.rtl ? 339 : 28;
  const searchTextX = context.rtl ? 326 : 60;
  const chips = context.rtl ? [[318, 56, 346], [246, 64, 278], [166, 72, 202], [86, 72, 122]] : [[16, 56, 44], [80, 64, 112], [152, 72, 188], [232, 72, 268]];
  const chosen = getService(draft.serviceId);
  return <SvgShell context={context} label={context.strings.serviceTitle}>
    <ProviderHeader context={context} prefix="service-header" />
    <Stepper context={context} current={1} />
    <rect x="0.5" y="176.5" width="389" height="547" className="surface divider-stroke" strokeWidth="1" />
    <Text context={context} x={contentX} y={207} className="heading on-surface">{context.strings.serviceTitle}</Text>
    <Text context={context} x={contentX} y={230} className="body-medium on-surface-variant">{context.strings.serviceSubtitle}</Text>
    <rect x="16" y="248" width="358" height="48" rx="16" className="surface-container" />
    <SvgIcon name="search" x={searchIconX} y={260} tone="icon-variant" />
    <Text context={context} x={searchTextX} y={278} className="body-medium on-surface-variant">{context.strings.search}</Text>
    {chips.map(([x, width, center], index) => <g key={context.strings.categories[index]}>
      <rect x={x + (index === 0 ? 0 : 0.5)} y={304 + (index === 0 ? 0 : 0.5)} width={width - (index === 0 ? 0 : 1)} height={32 - (index === 0 ? 0 : 1)} rx="16" className={index === 0 ? "primary-fill" : "surface outline-stroke"} strokeWidth={index === 0 ? undefined : 1} />
      <Text context={context} x={center} y={325} className={classNames("label-medium", index === 0 ? "on-primary" : "on-surface")} anchor="middle">{context.strings.categories[index]}</Text>
    </g>)}
    {services.map((service, index) => <ServiceCard key={service.id} context={context} y={352 + index * 88} service={service} selected={draft.serviceId === service.id} />)}
    <BookingFooter context={context} label={context.strings.serviceLabel} value={chosen?.name[context.locale] ?? "—"} cta={context.strings.serviceCta} />
  </SvgShell>;
}

function DateStrip({ context, draft }: { context: ScreenContext; draft: BookingDraft }) {
  const centers = context.rtl ? [350, 298, 246, 194, 142, 90, 38] : [38, 90, 142, 194, 246, 298, 350];
  const itemX = [16, 68, 120, 172, 224, 276, 328];
  const monthX = context.rtl ? 374 : 16;
  return <>
    <Text context={context} x={monthX} y={266} className="title-medium on-surface">{context.strings.month}</Text>
    {context.rtl ? <><SvgIcon name="chevronLeft" x={24} y={248} /><SvgIcon name="chevronRight" x={64} y={248} /></> : <><SvgIcon name="chevronLeft" x={302} y={248} /><SvgIcon name="chevronRight" x={342} y={248} /></>}
    {dateOptions.map((date, index) => {
      const center = centers[index];
      const selected = date.id === draft.dateId;
      return <g key={date.id}>
        <rect x={itemX[index]} y="288" width="44" height="68" fill="transparent" />
        <circle cx={center} cy="310" r="20" className={selected ? "primary-fill" : "surface outline-stroke"} strokeWidth={selected ? undefined : 1} />
        <Text context={context} x={center} y={315} className={classNames("label-large", selected ? "on-primary" : "on-surface", "ltr")} anchor="middle">{date.day[context.locale]}</Text>
        <Text context={context} x={center} y={350} className={classNames("label-small", selected ? "primary-text" : "on-surface-variant")} anchor="middle">{date.weekday[context.locale]}</Text>
      </g>;
    })}
  </>;
}

function TimeSlot({ context, x, y, slot, selected }: { context: ScreenContext; x: number; y: number; slot: (typeof timeSlots)[number]; selected: boolean }) {
  return <g>
    <rect x={x + (selected ? 0 : 0.5)} y={y + (selected ? 0 : 0.5)} width={selected ? 114 : 113} height={selected ? 48 : 47} rx="12" className={selected ? "primary-fill" : "surface outline-stroke"} strokeWidth={selected ? undefined : 1} />
    <Text context={context} x={x + 57} y={y + 29} className={classNames("label-medium", selected ? "on-primary" : "on-surface", "ltr")} anchor="middle">{slot.value[context.locale]}</Text>
  </g>;
}

function TimeScreen({ context, draft }: { context: ScreenContext; draft: BookingDraft }) {
  const contentX = context.rtl ? 374 : 16;
  const chosen = getService(draft.serviceId) ?? services[0];
  const chosenTime = getTime(draft.timeId);
  const xs = [16, 138, 260];
  const morning = timeSlots.filter((slot) => slot.group === "morning");
  const afternoon = timeSlots.filter((slot) => slot.group === "afternoon");
  return <SvgShell context={context} label={context.strings.timeTitle}>
    <ProviderHeader context={context} prefix="time-header" />
    <Stepper context={context} current={2} />
    <rect x="0.5" y="176.5" width="389" height="547" className="surface divider-stroke" strokeWidth="1" />
    <Text context={context} x={contentX} y={207} className="heading on-surface">{context.strings.timeTitle}</Text>
    <Text context={context} x={contentX} y={230} className="body-medium on-surface-variant">{context.strings.timeSubtitle}</Text>
    <DateStrip context={context} draft={draft} />
    <Text context={context} x={contentX} y={379} className="title-medium on-surface">{context.strings.morning}</Text>
    {morning.map((slot, index) => <TimeSlot key={slot.id} context={context} slot={slot} x={xs[index % 3]} y={[391, 447][Math.floor(index / 3)]} selected={chosenTime?.id === slot.id} />)}
    <Text context={context} x={contentX} y={519} className="title-medium on-surface">{context.strings.afternoon}</Text>
    {afternoon.map((slot, index) => <TimeSlot key={slot.id} context={context} slot={slot} x={xs[index % 3]} y={[531, 587][Math.floor(index / 3)]} selected={chosenTime?.id === slot.id} />)}
    <rect x="16" y="648" width="358" height="56" rx="12" className="surface-high" />
    <Text context={context} x={context.rtl ? 362 : 28} y={672} className="label-large on-surface">{chosen.name[context.locale]} · {chosen.duration[context.locale]}</Text>
    <Text context={context} x={context.rtl ? 362 : 28} y={692} className="body-small on-surface-variant">{draft.staffId ? getStaff(draft.staffId)?.name[context.locale] : context.strings.providerChoice}</Text>
    <BookingFooter context={context} label={context.strings.timeLabel} value={`${getDate(draft.dateId).label[context.locale]}، ${chosenTime?.value[context.locale] ?? "—"}`} cta={context.strings.timeCta} />
  </SvgShell>;
}

function ReviewRow({ context, y, icon, label, value, detail, image }: { context: ScreenContext; y: number; icon: IconName; label: string; value: string; detail?: string; image?: string }) {
  const iconCenter = context.rtl ? 346 : 44;
  const textX = context.rtl ? 314 : 76;
  const detailX = context.rtl ? 28 : 358;
  const dividerStart = context.rtl ? 32 : 76;
  const dividerEnd = context.rtl ? 314 : 358;
  return <>
    {image ? <><CirclePhoto id={`review-${y}`} href={image} cx={iconCenter} cy={y + 31} radius={20} /><circle cx={iconCenter} cy={y + 31} r="21" className="photo-stroke" /></> : <><circle cx={iconCenter} cy={y + 31} r="20" className="surface-high" /><SvgIcon name={icon} x={iconCenter - 10} y={y + 21} size={20} tone="icon-variant" /></>}
    <Text context={context} x={textX} y={y + 24} className="label-small on-surface-variant">{label}</Text>
    <Text context={context} x={textX} y={y + 46} className="title-small on-surface">{value}</Text>
    {detail && <Text context={context} x={detailX} y={y + 46} className="label-medium on-surface" anchor={context.rtl ? "start" : "end"}>{detail}</Text>}
    <line x1={dividerStart} y1={y + 62} x2={dividerEnd} y2={y + 62} className="divider-stroke" strokeWidth="1" />
  </>;
}

function ReviewScreen({ context, draft }: { context: ScreenContext; draft: BookingDraft }) {
  const contentX = context.rtl ? 374 : 16;
  const noticeIconX = context.rtl ? 330 : 28;
  const noticeTextX = context.rtl ? 314 : 76;
  const service = getService(draft.serviceId) ?? services[0];
  const time = getTime(draft.timeId);
  return <SvgShell context={context} label={context.strings.reviewTitle}>
    <ProviderHeader context={context} prefix="review-header" />
    <Stepper context={context} current={3} />
    <rect x="0.5" y="176.5" width="389" height="530" className="surface divider-stroke" strokeWidth="1" />
    <Text context={context} x={contentX} y={207} className="heading on-surface">{context.strings.reviewTitle}</Text>
    <Text context={context} x={contentX} y={230} className="body-medium on-surface-variant">{context.strings.reviewSubtitle}</Text>
    <rect x="16" y="244" width="358" height="248" rx="12" className="surface-container" />
    <ReviewRow context={context} y={244} icon="scissors" label={context.strings.reviewLabels[0]} value={`${service.name[context.locale]} · ${service.duration[context.locale]}`} detail={service.price[context.locale]} image={service.image} />
    <ReviewRow context={context} y={306} icon="user" label={context.strings.reviewLabels[1]} value={draft.staffId ? getStaff(draft.staffId)?.name[context.locale] ?? "" : context.strings.providerChoice} />
    <ReviewRow context={context} y={368} icon="calendar" label={context.strings.reviewLabels[2]} value={getDate(draft.dateId).label[context.locale]} />
    <ReviewRow context={context} y={430} icon="clock" label={context.strings.reviewLabels[3]} value={time?.value[context.locale] ?? "—"} />
    <rect x="16" y="508" width="358" height="72" rx="12" className="primary-container" />
    <SvgIcon name="badge" x={noticeIconX} y={532} tone="icon-primary" />
    <Text context={context} x={noticeTextX} y={535} className="title-small on-primary-container">{context.strings.instantTitle}</Text>
    <Text context={context} x={noticeTextX} y={558} className="body-small on-primary-container">{context.strings.instantBody}</Text>
    <rect x="16" y="596" width="358" height="72" rx="12" className="surface-high" />
    <SvgIcon name="shield" x={noticeIconX} y={620} tone="icon-variant" />
    <Text context={context} x={noticeTextX} y={632} className="body-medium on-surface">{context.strings.cancellation}</Text>
    <BookingFooter context={context} label={context.strings.estimatedTotal} value={service.price[context.locale]} cta={context.strings.confirm} review />
  </SvgShell>;
}

export function screenPaletteStyle(palette: ColorPalette): CSSProperties {
  return {
    "--customer-background": palette.background,
    "--customer-surface": palette.surface,
    "--customer-surface-container": palette.surfaceContainer,
    "--customer-surface-high": palette.surfaceHigh,
    "--customer-primary": palette.primary,
    "--customer-on-primary": palette.onPrimary,
    "--customer-primary-container": palette.primaryContainer,
    "--customer-on-primary-container": palette.onPrimaryContainer,
    "--customer-on-surface": palette.onSurface,
    "--customer-muted": palette.muted,
    "--customer-outline": palette.outline,
    "--customer-success": palette.success,
  } as CSSProperties;
}

export function CustomerReferenceScreen({ screen, context, draft }: { screen: "profile" | "staff" | "service" | "time" | "review"; context: ScreenContext; draft: BookingDraft }) {
  if (screen === "profile") return <ProfileScreen context={context} />;
  if (screen === "staff") return <StaffScreen context={context} draft={draft} />;
  if (screen === "service") return <ServiceScreen context={context} draft={draft} />;
  if (screen === "time") return <TimeScreen context={context} draft={draft} />;
  return <ReviewScreen context={context} draft={draft} />;
}
