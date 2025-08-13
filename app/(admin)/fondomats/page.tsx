"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import {
  Recycle,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Eye,
  Edit,
  Trash2,
  Activity,
  DollarSign,
} from "lucide-react"

// Mock data for fondomats
const fondomats = [
  {
    id: "FDM-001",
    name: "Фондомат Навои-12",
    location: "ул. Навои, 12, Ташкент",
    coordinates: { lat: 41.2995, lng: 69.2401 },
    status: "active",
    capacity: 500,
    currentLoad: 387,
    totalCollected: 12450,
    revenue: 24900,
    lastMaintenance: "2024-02-15",
    installDate: "2023-08-15",
    model: "YL-500X",
    issues: [],
  },
  {
    id: "FDM-002",
    name: "Фондомат Амир Темур-45",
    location: "пр. Амир Темур, 45, Ташкент",
    coordinates: { lat: 41.3111, lng: 69.2797 },
    status: "maintenance",
    capacity: 500,
    currentLoad: 456,
    totalCollected: 8920,
    revenue: 17840,
    lastMaintenance: "2024-01-28",
    installDate: "2023-09-20",
    model: "YL-500X",
    issues: ["Заполнен на 91%", "Требуется очистка"],
  },
  {
    id: "FDM-003",
    name: "Фондомат Мустакиллик-78",
    location: "ул. Мустакиллик, 78, Ташкент",
    coordinates: { lat: 41.2856, lng: 69.2034 },
    status: "offline",
    capacity: 300,
    currentLoad: 234,
    totalCollected: 5670,
    revenue: 11340,
    lastMaintenance: "2024-02-10",
    installDate: "2023-10-05",
    model: "YL-300S",
    issues: ["Нет связи", "Возможна поломка"],
  },
  {
    id: "FDM-004",
    name: "Фондомат Самарканд Центр",
    location: "ул. Регистан, 23, Самарканд",
    coordinates: { lat: 39.6542, lng: 66.9597 },
    status: "active",
    capacity: 500,
    currentLoad: 123,
    totalCollected: 9840,
    revenue: 19680,
    lastMaintenance: "2024-02-18",
    installDate: "2023-11-12",
    model: "YL-500X",
    issues: [],
  },
  {
    id: "FDM-005",
    name: "Фондомат Бухара Плаза",
    location: "ул. Накшбанди, 67, Бухара",
    coordinates: { lat: 39.7747, lng: 64.4286 },
    status: "active",
    capacity: 300,
    currentLoad: 89,
    totalCollected: 4560,
    revenue: 9120,
    lastMaintenance: "2024-02-12",
    installDate: "2023-12-01",
    model: "YL-300S",
    issues: [],
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Активный
        </Badge>
      )
    case "maintenance":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Обслуживание
        </Badge>
      )
    case "offline":
      return (
        <Badge variant="destructive">
          <XCircle className="w-3 h-3 mr-1" />
          Не работает
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getLoadPercentage = (current: number, capacity: number) => {
  return Math.round((current / capacity) * 100)
}

const getLoadColor = (percentage: number) => {
  if (percentage >= 90) return "text-red-600"
  if (percentage >= 70) return "text-yellow-600"
  return "text-green-600"
}

export default function FondomatsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const filteredFondomats = fondomats.filter((fondomat) => {
    const matchesSearch =
      fondomat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fondomat.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fondomat.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || fondomat.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const activeCount = fondomats.filter((f) => f.status === "active").length
  const maintenanceCount = fondomats.filter((f) => f.status === "maintenance").length
  const offlineCount = fondomats.filter((f) => f.status === "offline").length
  const totalRevenue = fondomats.reduce((sum, f) => sum + f.revenue, 0)
  const totalCollected = fondomats.reduce((sum, f) => sum + f.totalCollected, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Управление фондоматами</h1>
          <p className="text-muted-foreground">Мониторинг и управление автоматами для сдачи тары</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Добавить фондомат
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Добавить новый фондомат</DialogTitle>
              <DialogDescription>Зарегистрируйте новый автомат в системе</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Название</Label>
                <Input id="name" placeholder="Фондомат Центральный" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Адрес</Label>
                <Input id="location" placeholder="ул. Примерная, 123, Ташкент" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="model">Модель</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите модель" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YL-300S">YL-300S (300 единиц)</SelectItem>
                    <SelectItem value="YL-500X">YL-500X (500 единиц)</SelectItem>
                    <SelectItem value="YL-1000P">YL-1000P (1000 единиц)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>Добавить</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего фондоматов</CardTitle>
            <Recycle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fondomats.length}</div>
            <p className="text-xs text-muted-foreground">+3 за этот месяц</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((activeCount / fondomats.length) * 100)}% от общего числа
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">На обслуживании</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{maintenanceCount}</div>
            <p className="text-xs text-muted-foreground">Требуют внимания</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Не работают</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{offlineCount}</div>
            <p className="text-xs text-muted-foreground">Требуют ремонта</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общий доход</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₽{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{totalCollected.toLocaleString()} единиц тары</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Список</TabsTrigger>
          <TabsTrigger value="map">Карта</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Список фондоматов</CardTitle>
                  <CardDescription>Управление и мониторинг всех автоматов</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Поиск по названию, адресу или ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-80"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все статусы</SelectItem>
                      <SelectItem value="active">Активные</SelectItem>
                      <SelectItem value="maintenance">На обслуживании</SelectItem>
                      <SelectItem value="offline">Не работают</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Фондомат</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Заполненность</TableHead>
                      <TableHead>Собрано тары</TableHead>
                      <TableHead>Доход</TableHead>
                      <TableHead>Последнее ТО</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFondomats.map((fondomat) => {
                      const loadPercentage = getLoadPercentage(fondomat.currentLoad, fondomat.capacity)
                      return (
                        <TableRow key={fondomat.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{fondomat.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {fondomat.location}
                              </div>
                              <div className="text-xs text-muted-foreground">ID: {fondomat.id}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {getStatusBadge(fondomat.status)}
                              {fondomat.issues.length > 0 && (
                                <div className="text-xs text-red-600">{fondomat.issues.length} проблем</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className={getLoadColor(loadPercentage)}>
                                  {fondomat.currentLoad}/{fondomat.capacity}
                                </span>
                                <span className={`font-medium ${getLoadColor(loadPercentage)}`}>{loadPercentage}%</span>
                              </div>
                              <Progress value={loadPercentage} className="h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{fondomat.totalCollected.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">единиц</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">₽{fondomat.revenue.toLocaleString()}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(fondomat.lastMaintenance).toLocaleDateString("ru-RU")}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Открыть меню</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                  <Link href={`/fondomats/${fondomat.id}`} className="flex items-center">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Подробности
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Редактировать
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Settings className="mr-2 h-4 w-4" />
                                  Настройки
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Activity className="mr-2 h-4 w-4" />
                                  Запланировать ТО
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Удалить
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Карта фондоматов</CardTitle>
              <CardDescription>Географическое расположение всех автоматов</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">Интерактивная карта</p>
                  <p className="text-sm text-muted-foreground">
                    Здесь будет отображена карта с расположением всех фондоматов
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Производительность по регионам</CardTitle>
                <CardDescription>Сбор тары по городам</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Ташкент</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="w-24" />
                      <span className="text-sm font-medium">26,860</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Самарканд</span>
                    <div className="flex items-center gap-2">
                      <Progress value={65} className="w-24" />
                      <span className="text-sm font-medium">9,840</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Бухара</span>
                    <div className="flex items-center gap-2">
                      <Progress value={30} className="w-24" />
                      <span className="text-sm font-medium">4,560</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Статистика обслуживания</CardTitle>
                <CardDescription>Частота технического обслуживания</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Среднее время между ТО</span>
                    <span className="font-medium">18 дней</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Запланированных ТО</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Экстренных вызовов</span>
                    <span className="font-medium text-red-600">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Время простоя (среднее)</span>
                    <span className="font-medium">2.4 часа</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
