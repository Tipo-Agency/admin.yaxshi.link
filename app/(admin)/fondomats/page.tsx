"use client"

import { useState, useEffect } from "react"
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
import { useToast } from "@/hooks/use-toast"
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
  Loader2,
} from "lucide-react"
import { fandomatsApi, type Fondomat, type FondomatsStats } from "@/lib/api/fandomats"
import { ApiError } from "@/lib/api/client"

const getStatusBadge = (status: string, isActive: boolean) => {
  if (!isActive) {
    return (
      <Badge variant="destructive">
        <XCircle className="w-3 h-3 mr-1" />
        Не работает
      </Badge>
    )
  }

  switch (status.toLowerCase()) {
    case "active":
    case "работает":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Активный
        </Badge>
      )
    case "maintenance":
    case "обслуживание":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Обслуживание
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const formatCurrency = (amount: string | number) => {
  const numAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount
  return new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: "UZS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount)
}

export default function FondomatsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingFondomat, setEditingFondomat] = useState<Fondomat | null>(null)
  const [fandomats, setFandomats] = useState<Fondomat[]>([])
  const [stats, setStats] = useState<FondomatsStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    latitude: "",
    longitude: "",
    model: "",
    software_version: "1.0.0",
    serial_number: "",
  })
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

  const [loadingDetailedFondomat, setLoadingDetailedFondomat] = useState(false)

  useEffect(() => {
    const loadFandomats = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fandomatsApi.getFandomats()
        setFandomats(data.fandomats)
        setStats(data.stats)
      } catch (err) {
        const errorMessage = err instanceof ApiError ? err.message : "Ошибка загрузки данных"
        setError(errorMessage)
        toast({
          title: "Ошибка",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadFandomats()
  }, [toast])

  const filteredFandomats = fandomats.filter((fondomat) => {
    const matchesSearch =
      fondomat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fondomat.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fondomat.id.toString().includes(searchTerm.toLowerCase())

    let matchesStatus = true
    if (statusFilter !== "all") {
      if (statusFilter === "active") {
        matchesStatus = fondomat.is_active && fondomat.status.toLowerCase() === "active"
      } else if (statusFilter === "maintenance") {
        matchesStatus = fondomat.status.toLowerCase() === "maintenance"
      } else if (statusFilter === "offline") {
        matchesStatus = !fondomat.is_active
      }
    }

    return matchesSearch && matchesStatus
  })

  const handleEditFondomat = async (fondomat: Fondomat) => {
    setEditingFondomat(fondomat)
    setLoadingDetailedFondomat(true)
    setIsEditDialogOpen(true)

    try {
      const detailedFondomat = await fandomatsApi.getFondomat(fondomat.id)

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
        model: "",
        software_version: "",
        serial_number: "",
        is_active: fondomat.is_active,
        status: fondomat.status,
      })
    } finally {
      setLoadingDetailedFondomat(false)
    }
  }

  const handleCreateFondomat = async () => {
    if (
      !formData.name ||
      !formData.location ||
      !formData.latitude ||
      !formData.longitude ||
      !formData.model ||
      !formData.serial_number
    ) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      })
      return
    }

    try {
      setIsCreating(true)
      const newFondomat = await fandomatsApi.createFondomat({
        name: formData.name,
        location: formData.location,
        latitude: Number.parseFloat(formData.latitude),
        longitude: Number.parseFloat(formData.longitude),
        is_active: true,
        status: "active",
        model: formData.model,
        software_version: formData.software_version,
        serial_number: formData.serial_number,
      })

      setFandomats((prev) => [...prev, newFondomat])
      if (stats) {
        setStats((prev) =>
          prev
            ? {
                ...prev,
                total: prev.total + 1,
                active: prev.active + 1,
              }
            : null,
        )
      }

      setFormData({
        name: "",
        location: "",
        latitude: "",
        longitude: "",
        model: "",
        software_version: "1.0.0",
        serial_number: "",
      })
      setIsCreateDialogOpen(false)

      toast({
        title: "Успешно",
        description: "Фондомат успешно добавлен в систему",
      })
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : "Ошибка создания фондомата"
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdateFondomat = async () => {
    if (!editingFondomat) return

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
      const updatedFondomat = await fandomatsApi.updateFondomat(editingFondomat.id, {
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

      setFandomats((prev) => prev.map((f) => (f.id === editingFondomat.id ? updatedFondomat : f)))

      setIsEditDialogOpen(false)
      setEditingFondomat(null)

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

  const handleDeleteFondomat = async (id: number, name: string) => {
    if (!confirm(`Вы уверены, что хотите удалить фондомат "${name}"? Это действие нельзя отменить.`)) {
      return
    }

    try {
      setDeletingId(id)
      await fandomatsApi.deleteFondomat(id)

      setFandomats((prev) => prev.filter((f) => f.id !== id))
      if (stats) {
        const deletedFondomat = fandomats.find((f) => f.id === id)
        if (deletedFondomat) {
          setStats((prev) =>
            prev
              ? {
                  ...prev,
                  total: prev.total - 1,
                  active:
                    deletedFondomat.is_active && deletedFondomat.status === "active" ? prev.active - 1 : prev.active,
                  maintenance: deletedFondomat.status === "maintenance" ? prev.maintenance - 1 : prev.maintenance,
                  inactive: !deletedFondomat.is_active ? prev.inactive - 1 : prev.inactive,
                }
              : null,
          )
        }
      }

      toast({
        title: "Успешно",
        description: `Фондомат "${name}" успешно удален`,
      })
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : "Ошибка удаления фондомата"
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

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
                <Label htmlFor="name">Название *</Label>
                <Input
                  id="name"
                  placeholder="Фондомат Центральный"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Адрес *</Label>
                <Input
                  id="location"
                  placeholder="ул. Примерная, 123, Ташкент"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="latitude">Широта *</Label>
                  <Input
                    id="latitude"
                    placeholder="41.2995"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData((prev) => ({ ...prev, latitude: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="longitude">Долгота *</Label>
                  <Input
                    id="longitude"
                    placeholder="69.2401"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData((prev) => ({ ...prev, longitude: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="model">Модель *</Label>
                <Input
                  id="model"
                  placeholder="YL-300S"
                  value={formData.model}
                  onChange={(e) => setFormData((prev) => ({ ...prev, model: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="serial_number">Серийный номер *</Label>
                <Input
                  id="serial_number"
                  placeholder="YL2024001"
                  value={formData.serial_number}
                  onChange={(e) => setFormData((prev) => ({ ...prev, serial_number: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="software_version">Версия ПО</Label>
                <Input
                  id="software_version"
                  placeholder="1.0.0"
                  value={formData.software_version}
                  onChange={(e) => setFormData((prev) => ({ ...prev, software_version: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isCreating}>
                Отмена
              </Button>
              <Button onClick={handleCreateFondomat} disabled={isCreating}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isCreating ? "Добавление..." : "Добавить"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего фондоматов</CardTitle>
            <Recycle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">Зарегистрировано в системе</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.active || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.total ? Math.round(((stats.active || 0) / stats.total) * 100) : 0}% от общего числа
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">На обслуживании</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats?.maintenance || 0}</div>
            <p className="text-xs text-muted-foreground">Требуют внимания</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Не работают</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.inactive || 0}</div>
            <p className="text-xs text-muted-foreground">Требуют ремонта</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общий доход</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.total_income || "0")}</div>
            <p className="text-xs text-muted-foreground">
              {fandomats.reduce((sum, f) => sum + f.collected_total, 0).toLocaleString()} единиц тары
            </p>
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
                      <TableHead>Координаты</TableHead>
                      <TableHead>Собрано тары</TableHead>
                      <TableHead>Доход</TableHead>
                      <TableHead>Дата установки</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFandomats.map((fondomat) => (
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
                        <TableCell>{getStatusBadge(fondomat.status, fondomat.is_active)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Lat: {fondomat.latitude}</div>
                            <div>Lng: {fondomat.longitude}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{fondomat.collected_total.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">единиц</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{formatCurrency(fondomat.total_income)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{new Date(fondomat.created_at).toLocaleDateString("ru-RU")}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0" disabled={deletingId === fondomat.id}>
                                <span className="sr-only">Открыть меню</span>
                                {deletingId === fondomat.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <MoreHorizontal className="h-4 w-4" />
                                )}
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
                              <DropdownMenuItem onClick={() => handleEditFondomat(fondomat)}>
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
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteFondomat(fondomat.id, fondomat.name)}
                                disabled={deletingId === fondomat.id}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {deletingId === fondomat.id ? "Удаление..." : "Удалить"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredFandomats.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Фондоматы не найдены</p>
                </div>
              )}
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
                <CardTitle>Производительность по статусам</CardTitle>
                <CardDescription>Распределение фондоматов по состоянию</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Активные</span>
                    <div className="flex items-center gap-2">
                      <Progress value={stats?.total ? (stats.active / stats.total) * 100 : 0} className="w-24" />
                      <span className="text-sm font-medium">{stats?.active || 0}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">На обслуживании</span>
                    <div className="flex items-center gap-2">
                      <Progress value={stats?.total ? (stats.maintenance / stats.total) * 100 : 0} className="w-24" />
                      <span className="text-sm font-medium">{stats?.maintenance || 0}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Не работают</span>
                    <div className="flex items-center gap-2">
                      <Progress value={stats?.total ? (stats.inactive / stats.total) * 100 : 0} className="w-24" />
                      <span className="text-sm font-medium">{stats?.inactive || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Общая статистика</CardTitle>
                <CardDescription>Ключевые показатели системы</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Общий доход</span>
                    <span className="font-medium">{formatCurrency(stats?.total_income || "0")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Всего собрано тары</span>
                    <span className="font-medium">
                      {fandomats.reduce((sum, f) => sum + f.collected_total, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Средний доход на фондомат</span>
                    <span className="font-medium">
                      {stats?.total
                        ? formatCurrency((Number.parseFloat(stats.total_income) / stats.total).toString())
                        : formatCurrency("0")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Активность системы</span>
                    <span className="font-medium text-green-600">
                      {stats?.total ? Math.round((stats.active / stats.total) * 100) : 0}%
                    </span>
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
