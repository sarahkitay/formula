'use client'

import {
  LayoutDashboard,
  Activity,
  Calendar,
  UserCheck,
  Users,
  CreditCard,
  DollarSign,
  MapPin,
  TrendingUp,
  Settings,
  ClipboardList,
  FileText,
  BarChart2,
  BookOpen,
  ShoppingBag,
  Map,
  Layers,
  Gauge,
  Trophy,
  Building2,
  Flame,
  Network,
  CalendarClock,
  Timer,
  Target,
  Zap,
  MessageCircle,
  Receipt,
} from 'lucide-react'

const MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  Activity: <Activity className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  Calendar: <Calendar className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  UserCheck: <UserCheck className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  Users: <Users className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  CreditCard: <CreditCard className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  DollarSign: <DollarSign className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  MapPin: <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  TrendingUp: <TrendingUp className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  Settings: <Settings className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  ClipboardList: <ClipboardList className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  FileText: <FileText className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  BarChart2: <BarChart2 className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  BookOpen: <BookOpen className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  ShoppingBag: <ShoppingBag className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  Map: <Map className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  Layers: <Layers className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  Gauge: <Gauge className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  Trophy: <Trophy className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  Building2: <Building2 className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  Flame: <Flame className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  Network: <Network className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  CalendarClock: <CalendarClock className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  Timer: <Timer className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  Target: <Target className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  Zap: <Zap className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  MessageCircle: <MessageCircle className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
  Receipt: <Receipt className="h-4 w-4 shrink-0" strokeWidth={1.75} />,
}

export function NavIcon({ name, className }: { name: string; className?: string }) {
  const node = MAP[name]
  if (!node) return null
  if (!className) return node
  return <span className={className}>{node}</span>
}
