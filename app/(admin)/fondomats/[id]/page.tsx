"use client"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Settings,
  Activity,
  TrendingUp,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wrench,
  BarChart3,
  Coins,
} from "lucide-react"

// Mock detailed data based on the database model
const getFondomat = (id: string) => {
  const fondomats = {
    "FDM-001": {
      id: "FDM-001",
      name: "Фондомат Навои-12",
      location: "ул. Навои, 12, Ташкент",
      latitude: 41.2995,
      longitude: 69.2401,
      is_active: true,
      status: "active",
      model: "EcoBot Pro 500X",
      software_version: "v2.1.4",
      serial_number: "YL500X-2023-001",
      installation_date: "2023-08-15T10:30:00Z",
      last_maintenance: "2024-02-15T14:20:00Z",
      collected_today: 45,
      collected_week: 287,
      collected_month: 1240,
      collected_total: 12450,
      avg_collected_per_day: 42,
      peak_hour_start: "18:00",
      peak_hour_end: "19:00",
      min_activity_hour_start: "03:00",
      min_activity_hour_end: "04:00",
      points_issued: 24900,
      capacity: 500,
      currentLoad: 387,
      revenue: 24900,
      issues: [],
    },
    "FDM-002": {
      id: "FDM-002",
      name: "Фондомат Амир Темур-45",
      location: "пр. Амир Темур, 45, Ташкент",
      latitude: 41.3111,
      longitude: 69.2797,
      is_active: true,
      status: "maintenance",
      model: "EcoBot Pro 500X",
      software_version: "v2.1.3",
      serial_number: "YL500X-2023-002",
      installation_date: "2023-09-20T09:15:00Z",
      last_maintenance: "2024-01-28T11:45:00Z",
      collected_today: 23,
      collected_week: 156,
      collected_month: 720,
      collected_total: 8920,
      avg_collected_per_day: 35,
      peak_hour_start: "17:30",
      peak_hour_end: "18:30",
      min_activity_hour_start: "02:30",
      min_activity_hour_end: "03:30",
      points_issued: 17840,
      capacity: 500,
      currentLoad: 456,
      revenue: 17840,
      issues: ["Заполнен на 91%", "Требуется очистка"],
    },
    "FDM-003": {
      id: "FDM-003",
      name: "Фондомат Мустакиллик-78",
      location: "ул. Мустакиллик, 78, Ташкент",
      latitude: 41.2856,
      longitude: 69.2034,
      is_active: false,
      status: "offline",
      model: "EcoBot Lite 300S",
      software_version: "v1.9.2",
      serial_number: "YL300S-2023-003",
      installation_date: "2023-10-05T13:20:00Z",
      last_maintenance: "2024-02-10T16:30:00Z",
      collected_today: 0,
      collected_week: 0,
      collected_month: 234,
      collected_total: 5670,
      avg_collected_per_day: 28,
      peak_hour_start: "19:00",
      peak_hour_end: "20:00",
      min_activity_hour_start: "04:00",
      min_activity_hour_end: "05:00",
      points_issued: 11340,
      capacity: 300,
      currentLoad: 234,
      revenue: 11340,
      issues: ["Нет связи", "Возможна поломка"],
    },
  }
  return fondomats[id as keyof typeof fondomats] || null
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-4 h-4 mr-2" />
          Активный
        </Badge>
      )
    case "maintenance":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <AlertTriangle className="w-4 h-4 mr-2" />
          На обслуживании
        </Badge>
      )
    case "offline":
      return (
        <Badge variant="destructive">
          <XCircle className="w-4 h-4 mr-2" />
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function FondomatDetailPage() {
  const params = useParams()
  const router = useRouter()
  const fondomat = getFondomat(params.id as string)

  if (!fondomat) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Фондомат не найден</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
        </div>
      </div>
    )
  }

  const loadPercentage = getLoadPercentage(fondomat.currentLoad, fondomat.capacity)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{fondomat.name}</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {fondomat.location}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(fondomat.status)}
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Настройки
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Заполненность</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              <span className={getLoadColor(loadPercentage)}>{loadPercentage}%</span>
            </div>
            <Progress value={loadPercentage} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">
              {fondomat.currentLoad} из {fondomat.capacity} единиц
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Сегодня собрано</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fondomat.collected_today}</div>
            <p className="text-xs text-muted-foreground">Среднее: {fondomat.avg_collected_per_day} в день</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего собрано</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fondomat.collected_total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">единиц тары</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Баллы выдано</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fondomat.points_issued.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">баллов пользователям</p>
          </CardContent>
        </Card>
      </div>

      {/* Issues Alert */}
      {fondomat.issues.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Требует внимания ({fondomat.issues.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {fondomat.issues.map((issue, index) => (
                <li key={index} className="text-yellow-700 text-sm">
                  • {issue}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="statistics">Статистика</TabsTrigger>
          <TabsTrigger value="technical">Техническая информация</TabsTrigger>
          <TabsTrigger value="maintenance">Обслуживание</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Статистика сбора</CardTitle>
                <CardDescription>Данные по сбору тары за разные периоды</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">За сегодня</span>
                  <span className="font-medium">{fondomat.collected_today} единиц</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm">За неделю</span>
                  <span className="font-medium">{fondomat.collected_week} единиц</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm">За месяц</span>
                  <span className="font-medium">{fondomat.collected_month} единиц</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm">Всего</span>
                  <span className="font-medium text-green-600">{fondomat.collected_total.toLocaleString()} единиц</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Активность по времени</CardTitle>
                <CardDescription>Пиковые и минимальные часы работы</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Пиковые часы</span>
                  </div>
                  <p className="text-lg font-bold text-green-600">
                    {fondomat.peak_hour_start} - {fondomat.peak_hour_end}
                  </p>
                </div>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Минимальная активность</span>
                  </div>
                  <p className="text-lg font-bold text-blue-600">
                    {fondomat.min_activity_hour_start} - {fondomat.min_activity_hour_end}
                  </p>
                </div>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">Среднее в день</span>
                  </div>
                  <p className="text-lg font-bold text-purple-600">{fondomat.avg_collected_per_day} единиц</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Недельная статистика</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day, index) => {
                    const value = Math.floor(Math.random() * 60) + 20
                    return (
                      <div key={day} className="flex justify-between items-center">
                        <span className="text-sm">{day}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={value} className="w-16" />
                          <span className="text-sm font-medium w-8">{value}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Почасовая активность</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from({ length: 6 }, (_, i) => {
                    const hour = i * 4
                    const value =
                      hour >= 16 && hour <= 20
                        ? Math.floor(Math.random() * 40) + 60
                        : Math.floor(Math.random() * 30) + 10
                    return (
                      <div key={hour} className="flex justify-between items-center">
                        <span className="text-sm">
                          {hour}:00-{hour + 4}:00
                        </span>
                        <div className="flex items-center gap-2">
                          <Progress value={value} className="w-16" />
                          <span className="text-sm font-medium w-8">{value}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Эффективность</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Время работы</span>
                    <span>94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Производительность</span>
                    <span>87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Надежность</span>
                    <span>96%</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Техническая информация</CardTitle>
                <CardDescription>Основные характеристики устройства</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Модель</span>
                    <p className="font-medium">{fondomat.model}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Серийный номер</span>
                    <p className="font-medium">{fondomat.serial_number}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Версия ПО</span>
                    <p className="font-medium">{fondomat.software_version}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Вместимость</span>
                    <p className="font-medium">{fondomat.capacity} единиц</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <span className="text-sm text-muted-foreground">Дата установки</span>
                  <p className="font-medium">{formatDate(fondomat.installation_date)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Местоположение</CardTitle>
                <CardDescription>Географические координаты</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Широта</span>
                    <p className="font-medium">{fondomat.latitude}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Долгота</span>
                    <p className="font-medium">{fondomat.longitude}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <span className="text-sm text-muted-foreground">Адрес</span>
                  <p className="font-medium">{fondomat.location}</p>
                </div>
                <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Карта местоположения</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>История обслуживания</CardTitle>
                <CardDescription>Последние технические работы</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Последнее ТО</span>
                  </div>
                  <p className="font-medium">{formatDate(fondomat.last_maintenance)}</p>
                  <p className="text-sm text-muted-foreground">Плановое техническое обслуживание</p>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Следующее ТО</span>
                    <span className="text-sm font-medium">через 12 дней</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Интервал ТО</span>
                    <span className="text-sm font-medium">30 дней</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Всего ТО</span>
                    <span className="text-sm font-medium">8 раз</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Планирование ТО</CardTitle>
                <CardDescription>Управление техническим обслуживанием</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Запланировать ТО
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Zap className="w-4 h-4 mr-2" />
                  Экстренный вызов
                </Button>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Рекомендации</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Проверить уровень заполнения</li>
                    <li>• Очистить сенсоры</li>
                    <li>• Обновить программное обеспечение</li>
                    <li>• Проверить механизмы сортировки</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
