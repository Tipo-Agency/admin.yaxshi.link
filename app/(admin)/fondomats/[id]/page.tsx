"use client"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
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
  Edit,
  Loader2,
} from "lucide-react"
import { getFondomat } from "@/lib/api/fandomats"
import { fandomatsApi } from "@/lib/api/fandomats"
import { ApiError } from "@/lib/api/client"
import type { DetailedFondomat } from "@/lib/api/types"

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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: "UZS",
    minimumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) {
    return "Не указано"
  }

  try {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch (error) {
    return "Неверный формат даты"
  }
}

export default function FondomatDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [fondomat, setFondomat] = useState<DetailedFondomat | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loadingDetailedFondomat, setLoadingDetailedFondomat] = useState(false)
  const [editFormData, setEditFormData] = useState({
    name: "",
    location: "",
    latitude: "",
    longitude: "",
    model: "",
    software_version: "",
    serial_number: "",
    is_active: true,
    status: "active",
  })
  const { toast } = useToast()

  useEffect(() => {
    const loadFondomat = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getFondomat(Number(params.id))
        setFondomat(data)
      } catch (err) {
        console.error("Error loading fondomat:", err)
        setError("Ошибка при загрузке данных фондомата")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadFondomat()
    }
  }, [params.id])

  const handleEditFondomat = async () => {
    if (!fondomat) return

    setLoadingDetailedFondomat(true)
    setIsEditDialogOpen(true)

    try {
      const detailedFondomat = await getFondomat(fondomat.id)

      setEditFormData({
        name: detailedFondomat.name,
        location: detailedFondomat.location,
        latitude: detailedFondomat.latitude,
        longitude: detailedFondomat.longitude,
        model: detailedFondomat.model || "",
        software_version: detailedFondomat.software_version || "",
        serial_number: detailedFondomat.serial_number || "",
        is_active: detailedFondomat.is_active,
        status: detailedFondomat.status,
      })
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : "Ошибка загрузки данных фондомата"
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      })
      setEditFormData({
        name: fondomat.name,
        location: fondomat.location,
        latitude: fondomat.latitude,
        longitude: fondomat.longitude,
        model: fondomat.model || "",
        software_version: fondomat.software_version || "",
        serial_number: fondomat.serial_number || "",
        is_active: fondomat.is_active,
        status: fondomat.status,
      })
    } finally {
      setLoadingDetailedFondomat(false)
    }
  }

  const handleUpdateFondomat = async () => {
    if (!fondomat) return

    if (!editFormData.name || !editFormData.location || !editFormData.latitude || !editFormData.longitude) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      })
      return
    }

    try {
      setIsEditing(true)
      const updatedFondomat = await fandomatsApi.updateFondomat(fondomat.id, {
        name: editFormData.name,
        location: editFormData.location,
        latitude: Number.parseFloat(editFormData.latitude),
        longitude: Number.parseFloat(editFormData.longitude),
        is_active: editFormData.is_active,
        status: editFormData.status,
        ...(editFormData.model && { model: editFormData.model }),
        ...(editFormData.software_version && { software_version: editFormData.software_version }),
        ...(editFormData.serial_number && { serial_number: editFormData.serial_number }),
      })

      setFondomat((prev) => (prev ? { ...prev, ...updatedFondomat } : null))

      setIsEditDialogOpen(false)

      toast({
        title: "Успешно",
        description: "Фондомат успешно обновлен",
      })
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : "Ошибка обновления фондомата"
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsEditing(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-20" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-2 w-full mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !fondomat) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">{error || "Фондомат не найден"}</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
        </div>
      </div>
    )
  }

  const loadPercentage = fondomat.capacity ? Math.round((fondomat.collected_today / fondomat.capacity) * 100) : 0

  const getLoadColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-green-600"
  }

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
          <Button variant="outline" onClick={handleEditFondomat}>
            <Edit className="w-4 h-4 mr-2" />
            Редактировать
          </Button>
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
              {fondomat.collected_today} из {fondomat.capacity || 500} единиц
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
            <CardTitle className="text-sm font-medium">Общий доход</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(Number(fondomat.total_income))}</div>
            <p className="text-xs text-muted-foreground">узбекских сум</p>
          </CardContent>
        </Card>
      </div>

      {/* Issues Alert - показываем если статус не активный */}
      {fondomat.status !== "active" && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Требует внимания
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700 text-sm">
              Фондомат находится в статусе: {fondomat.status === "maintenance" ? "На обслуживании" : "Не работает"}
            </p>
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
                <CardDescription>Основные характеристики устройства</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Модель</span>
                    <p className="font-medium">{fondomat.model || "Не указано"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Серийный номер</span>
                    <p className="font-medium">{fondomat.serial_number || "Не указано"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Версия ПО</span>
                    <p className="font-medium">{fondomat.software_version || "Не указано"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Вместимость</span>
                    <p className="font-medium">{fondomat.capacity || 500} единиц</p>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Редактировать фондомат</DialogTitle>
            <DialogDescription>Изменить информацию о фондомате</DialogDescription>
          </DialogHeader>
          {loadingDetailedFondomat ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Загрузка данных...</span>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Название *</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Адрес *</Label>
                <Input
                  id="edit-location"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="edit-latitude">Широта *</Label>
                  <Input
                    id="edit-latitude"
                    type="number"
                    step="any"
                    value={editFormData.latitude}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, latitude: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-longitude">Долгота *</Label>
                  <Input
                    id="edit-longitude"
                    type="number"
                    step="any"
                    value={editFormData.longitude}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, longitude: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Статус</Label>
                <Select
                  value={editFormData.status}
                  onValueChange={(value) => setEditFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Активный</SelectItem>
                    <SelectItem value="maintenance">На обслуживании</SelectItem>
                    <SelectItem value="inactive">Неактивный</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-model">Модель</Label>
                <Input
                  id="edit-model"
                  value={editFormData.model}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, model: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-serial">Серийный номер</Label>
                <Input
                  id="edit-serial"
                  value={editFormData.serial_number}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, serial_number: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-software">Версия ПО</Label>
                <Input
                  id="edit-software"
                  value={editFormData.software_version}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, software_version: e.target.value }))}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isEditing || loadingDetailedFondomat}
            >
              Отмена
            </Button>
            <Button onClick={handleUpdateFondomat} disabled={isEditing || loadingDetailedFondomat}>
              {isEditing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
