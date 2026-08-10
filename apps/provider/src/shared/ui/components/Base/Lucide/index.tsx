import { useContext, type ComponentPropsWithoutRef } from "react";
import {
  ArchiveIcon, ArmchairIcon, ArrowLeftIcon, ArrowRightIcon, ArrowSquareLeftIcon,
  ArrowSquareOutIcon, BellIcon, BellRingingIcon, BookIcon,
  BookmarksIcon, BroadcastIcon, BrowserIcon, BuildingsIcon, CalendarCheckIcon,
  CalendarIcon, CaretDoubleLeftIcon, CaretDoubleRightIcon, CaretDownIcon,
  CaretLeftIcon, CaretRightIcon, CaretUpIcon, ChartBarIcon, CheckIcon,
  CheckSquareIcon, ClipboardIcon, ClockIcon, CookieIcon, CopyIcon, CornersOutIcon,
  DatabaseIcon, DeviceMobileIcon, DiamondIcon, DoorOpenIcon, DotsThreeVerticalIcon,
  DownloadIcon, EnvelopeSimpleIcon, FileIcon, FilesIcon, FileXIcon,
  FingerprintIcon, FunnelIcon, GameControllerIcon, GaugeIcon, GearIcon, GlobeIcon,
  HourglassIcon, InfoIcon, KeyIcon, LaptopIcon, LightbulbIcon, LightningIcon,
  ListIcon, LockIcon, MagnifyingGlassIcon, MaskHappyIcon, MoonIcon, PackageIcon,
  PencilLineIcon, PlusIcon, PowerIcon, PresentationChartIcon, PrinterIcon,
  ShieldCheckIcon, SortDescendingIcon, SquaresFourIcon, SunIcon, ToggleLeftIcon,
  TrashIcon, TrayIcon, TrophyIcon, TruckIcon, TShirtIcon, UserIcon, UsersIcon,
  UsersThreeIcon, WalletIcon, WarningCircleIcon, WarningIcon, XIcon,
} from "@phosphor-icons/react";
import { twMerge } from "tailwind-merge";
import { DirectionContext } from "@/shared/lib/utils/direction-context";

export const icons = {
  AlertCircle: WarningCircleIcon,
  AlertTriangle: WarningIcon,
  AlignJustify: ListIcon,
  AppWindow: BrowserIcon,
  Armchair: ArmchairIcon,
  ArrowDownWideNarrow: SortDescendingIcon,
  ArrowLeft: ArrowLeftIcon,
  ArrowLeftSquare: ArrowSquareLeftIcon,
  ArrowRight: ArrowRightIcon,
  Bell: BellIcon,
  BellDot: BellRingingIcon,
  Book: BookIcon,
  BookMarked: BookmarksIcon,
  Building2: BuildingsIcon,
  Calendar: CalendarIcon,
  CalendarCheck2: CalendarCheckIcon,
  Check: CheckIcon,
  CheckSquare: CheckSquareIcon,
  ChevronDown: CaretDownIcon,
  ChevronLeft: CaretLeftIcon,
  ChevronRight: CaretRightIcon,
  ChevronUp: CaretUpIcon,
  ChevronsLeft: CaretDoubleLeftIcon,
  ChevronsRight: CaretDoubleRightIcon,
  Clipboard: ClipboardIcon,
  Clock: ClockIcon,
  Clock4: ClockIcon,
  Cookie: CookieIcon,
  Copy: CopyIcon,
  Database: DatabaseIcon,
  DoorOpen: DoorOpenIcon,
  Download: DownloadIcon,
  Expand: CornersOutIcon,
  ExternalLink: ArrowSquareOutIcon,
  FileBarChart: ChartBarIcon,
  FileBarChart2: ChartBarIcon,
  FileCheck: FileIcon,
  FileX2: FileXIcon,
  Files: FilesIcon,
  Filter: FunnelIcon,
  Fingerprint: FingerprintIcon,
  Gamepad2: GameControllerIcon,
  Gauge: GaugeIcon,
  Gem: DiamondIcon,
  Globe: GlobeIcon,
  Hourglass: HourglassIcon,
  Inbox: TrayIcon,
  Info: InfoIcon,
  KeyRound: KeyIcon,
  Laptop: LaptopIcon,
  LayoutGrid: SquaresFourIcon,
  Lightbulb: LightbulbIcon,
  ListFilter: FunnelIcon,
  Lock: LockIcon,
  MailCheck: EnvelopeSimpleIcon,
  MoreVertical: DotsThreeVerticalIcon,
  Moon: MoonIcon,
  Package: PackageIcon,
  PackageCheck: PackageIcon,
  PackageSearch: PackageIcon,
  PackageX: PackageIcon,
  PenLine: PencilLineIcon,
  Plus: PlusIcon,
  Pocket: ArchiveIcon,
  Podcast: BroadcastIcon,
  Power: PowerIcon,
  Presentation: PresentationChartIcon,
  Printer: PrinterIcon,
  Search: MagnifyingGlassIcon,
  SearchX: MagnifyingGlassIcon,
  Settings: GearIcon,
  ShieldCheck: ShieldCheckIcon,
  Shirt: TShirtIcon,
  Smartphone: DeviceMobileIcon,
  Sun: SunIcon,
  ToggleLeft: ToggleLeftIcon,
  Trash2: TrashIcon,
  Trophy: TrophyIcon,
  Truck: TruckIcon,
  User: UserIcon,
  Users: UsersIcon,
  UsersRound: UsersThreeIcon,
  VenetianMask: MaskHappyIcon,
  Wallet: WalletIcon,
  WalletCards: WalletIcon,
  X: XIcon,
  Zap: LightningIcon,
} as const;

interface IconProps extends ComponentPropsWithoutRef<"svg"> {
  icon: keyof typeof icons;
  title?: string;
}

function Lucide({ icon, className, ...props }: IconProps) {
  const direction = useContext(DirectionContext)?.direction ?? "ltr";
  const mirroredNames: Partial<Record<keyof typeof icons, keyof typeof icons>> = {
    ArrowLeft: "ArrowRight",
    ArrowRight: "ArrowLeft",
    ChevronLeft: "ChevronRight",
    ChevronRight: "ChevronLeft",
    ChevronsLeft: "ChevronsRight",
    ChevronsRight: "ChevronsLeft",
  };
  const resolvedName = direction === "rtl" ? mirroredNames[icon] ?? icon : icon;
  const Component = icons[resolvedName];

  return (
    <Component
      {...props}
      weight="regular"
      className={twMerge("h-5 w-5 shrink-0", className)}
    />
  );
}

export default Lucide;
