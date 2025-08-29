"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Smartphone,
  Plus,
  Edit,
  Headphones,
  Monitor,
  TrendingUp,
  Users,
  Calendar,
  Upload,
  ImageIcon,
  Gift,
  AlertCircle,
  MoreHorizontal,
  Trash2,
} from "lucide-react"
import {
  getRewards,
  createReward,
  updateReward,
  deleteReward,
  type Reward,
  type UpdateRewardData,
} from "@/lib/api/rewards"
import { vendorsApi } from "@/lib/api/vendors"
import type { TVendor } from "@/lib/api/vendors"
import { useToast } from "@/hooks/use-toast"

const getRewardIcon = (name: string) => {
  const lowerName = name.toLowerCase()
  if (lowerName.includes("наушник") || lowerName.includes("headphone")) return Headphones
  if (lowerName.includes("телевизор") || lowerName.includes("tv")) return Monitor
  if (lowerName.includes("телефон") || lowerName.includes("смартфон") || lowerName.includes("phone")) return Smartphone
  return Gift
}

const getRewardColor = (name: string) => {
  const lowerName = name.toLowerCase()
  if (lowerName.includes("наушник") || lowerName.includes("headphone"))
    return {
      color: "bg-blue-100 text-blue-800",
      borderColor: "border-blue-200",
    }
  if (lowerName.includes("телевизор") || lowerName.includes("tv"))
    return {
      color: "bg-purple-100 text-purple-800",
      borderColor: "border-purple-200",
    }
  if (lowerName.includes("телефон") || lowerName.includes("смартфон") || lowerName.includes("phone"))
    return {
      color: "bg-green-100 text-green-800",
      borderColor: "border-green-200",
    }
  return {
    color: "bg-gray-100 text-gray-800",
    borderColor: "border-gray-200",
  }
}

const formatCurrency = (amount: string) => {
  return `${Number.parseInt(amount).toLocaleString()} сум`
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [stats, setStats] = useState<{ total_issued: number }>({ total_issued: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [vendorNames, setVendorNames] = useState<Record<number, string>>({})
  const [vendors, setVendors] = useState<TVendor[]>([])
  const [selectedVendorFilter, setSelectedVendorFilter] = useState<string>("all")

  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    points_required: "",
    price_uzs: "",
  })
  const [isCreating, setIsCreating] = useState(false)

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingReward, setEditingReward] = useState<Reward | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    points_required: "",
    price_uzs: "",
  })
  const [editSelectedImage, setEditSelectedImage] = useState<File | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const [deletingRewards, setDeletingRewards] = useState<Set<number>>(new Set())

  const { toast } = useToast()

  useEffect(() => {
    const loadRewards = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getRewards()
        setRewards(data.rewards)
        setStats(data.stats)
      } catch (err) {
        console.error("Failed to load rewards:", err)
        setError("Не удалось загрузить данные наград")
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные наград",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadRewards()
  }, [toast])

  useEffect(() => {
    const loadVendors = async () => {
      try {
        const list = await vendorsApi.list()
        setVendors(list)
      } catch (e) {
        // ignore vendor list errors in UI
      }
    }
    loadVendors()
  }, [])

  useEffect(() => {
    const fetchVendors = async () => {
      const uniqueVendorIds = Array.from(new Set(rewards.map((r) => r.vendor_id)))
      const idsToFetch = uniqueVendorIds.filter((id) => vendorNames[id] === undefined)
      if (idsToFetch.length === 0) return

      try {
        const entries = await Promise.all(
          idsToFetch.map(async (id) => {
            try {
              const vendor = await vendorsApi.get(id)
              return [id, vendor.name] as const
            } catch (e) {
              return [id, `Поставщик #${id}`] as const
            }
          }),
        )
        setVendorNames((prev) => ({ ...prev, ...Object.fromEntries(entries) }))
      } catch (e) {
        // ignore batch errors; names will fallback
      }
    }

    if (rewards.length > 0) {
      fetchVendors()
    }
  }, [rewards, vendorNames])

  const filteredRewards = rewards
    .filter((reward) => reward.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((reward) => selectedVendorFilter === "all" || reward.vendor_id === Number(selectedVendorFilter))

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  const handleCreateReward = async () => {
    if (!createForm.name || !createForm.points_required || !createForm.price_uzs || !selectedImage) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля и выберите изображение",
        variant: "destructive",
      })
      return
    }

    try {
      setIsCreating(true)
      const newReward = await createReward({
        name: createForm.name,
        description: createForm.description || null,
        points_required: Number.parseInt(createForm.points_required),
        price_uzs: createForm.price_uzs,
        image: selectedImage,
      })

      // Update local state
      setRewards((prev) => [...prev, newReward])
      setStats((prev) => ({ ...prev, total_issued: prev.total_issued }))

      // Reset form
      setCreateForm({ name: "", description: "", points_required: "", price_uzs: "" })
      setSelectedImage(null)
      setIsCreateDialogOpen(false)

      toast({
        title: "Успешно",
        description: "Награда успешно добавлена",
      })
    } catch (error) {
      console.error("Failed to create reward:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось создать награду",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleEditReward = (reward: Reward) => {
    setEditingReward(reward)
    setEditForm({
      name: reward.name,
      description: reward.description,
      points_required: reward.points_required.toString(),
      price_uzs: reward.price_uzs,
    })
    setEditSelectedImage(null)
    setIsEditDialogOpen(true)
  }

  const handleEditImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setEditSelectedImage(file)
    }
  }

  const handleUpdateReward = async () => {
    if (!editingReward || !editForm.name || !editForm.points_required || !editForm.price_uzs) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUpdating(true)
      const updateData: UpdateRewardData = {
        name: editForm.name,
        description: editForm.description || null,
        points_required: Number.parseInt(editForm.points_required),
        price_uzs: editForm.price_uzs,
      }

      if (editSelectedImage) {
        updateData.image = editSelectedImage
      }

      const updatedReward = await updateReward(editingReward.id, updateData)

      // Update local state
      setRewards((prev) => prev.map((reward) => (reward.id === editingReward.id ? updatedReward : reward)))

      // Reset form
      setEditForm({ name: "", description: "", points_required: "", price_uzs: "" })
      setEditSelectedImage(null)
      setEditingReward(null)
      setIsEditDialogOpen(false)

      toast({
        title: "Успешно",
        description: "Награда успешно обновлена",
      })
    } catch (error) {
      console.error("Failed to update reward:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось обновить награду",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteReward = async (reward: Reward) => {
    if (!confirm(`Вы уверены, что хотите удалить награду "${reward.name}"?`)) {
      return
    }

    try {
      setDeletingRewards((prev) => new Set(prev).add(reward.id))
      await deleteReward(reward.id)

      // Update local state
      setRewards((prev) => prev.filter((r) => r.id !== reward.id))
      setStats((prev) => ({
        ...prev,
        total_issued: prev.total_issued - reward.issued_total,
      }))

      toast({
        title: "Успешно",
        description: "Награда успешно удалена",
      })
    } catch (error) {
      console.error("Failed to delete reward:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить награду",
        variant: "destructive",
      })
    } finally {
      setDeletingRewards((prev) => {
        const newSet = new Set(prev)
        newSet.delete(reward.id)
        return newSet
      })
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Награды</h1>
            <p className="text-muted-foreground">Управление призовой техникой и выдачей пользователям</p>
          </div>
        </div>

        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ошибка загрузки данных</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Попробовать снова</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Награды</h1>
          <p className="text-muted-foreground">Управление призовой техникой и выдачей пользователям</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedVendorFilter} onValueChange={setSelectedVendorFilter}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Фильтр по поставщику" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все поставщики</SelectItem>
              {vendors.map((v) => (
                <SelectItem key={v.id} value={String(v.id)}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Добавить награду
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Добавить новую награду</DialogTitle>
              <DialogDescription>Добавьте новый тип награды для пользователей</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Название награды</Label>
                <Input
                  id="name"
                  placeholder="Например: Планшет Samsung"
                  value={createForm.name}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  placeholder="Описание условий получения награды"
                  value={createForm.description}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="requirement">Требование (баллов)</Label>
                <Input
                  id="requirement"
                  type="number"
                  placeholder="300"
                  value={createForm.points_required}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, points_required: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Стоимость (сум)</Label>
                <Input
                  id="price"
                  placeholder="1500000"
                  value={createForm.price_uzs}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, price_uzs: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Фотография награды</Label>
                <div className="flex items-center gap-2">
                  <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image")?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {selectedImage ? selectedImage.name : "Выбрать фото"}
                  </Button>
                </div>
                {selectedImage && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ImageIcon className="h-4 w-4" />
                    <span>Выбрано: {selectedImage.name}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isCreating}>
                Отмена
              </Button>
              <Button onClick={handleCreateReward} disabled={isCreating}>
                {isCreating ? "Добавление..." : "Добавить"}
              </Button>
            </div>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего выдано</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_issued.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Общее количество наград</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Типов наград</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rewards.length}</div>
            <p className="text-xs text-muted-foreground">Доступных типов</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Средняя популярность</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rewards.length > 0 ? Math.round(rewards.reduce((acc, r) => acc + r.popularity, 0) / rewards.length) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">По всем наградам</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общая стоимость</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                rewards.reduce((acc, r) => acc + Number.parseInt(r.price_uzs) * r.issued_total, 0) / 1000000,
              ).toFixed(1)}
              М
            </div>
            <p className="text-xs text-muted-foreground">сум общая стоимость</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="types" className="space-y-4">
        <TabsList>
          <TabsTrigger value="types">Типы наград</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
        </TabsList>

        <TabsContent value="types" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRewards.map((reward) => {
              const IconComponent = getRewardIcon(reward.name)
              const colors = getRewardColor(reward.name)
              const isDeleting = deletingRewards.has(reward.id)
              return (
                <Card key={reward.id} className={`${colors.borderColor} border-2 ${isDeleting ? "opacity-50" : ""}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={
                              reward.image
                                ? `https://api.yaxshi.link${reward.image}`
                                : "/placeholder.svg?height=64&width=64"
                            }
                            alt={reward.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${colors.color}`}>
                            <IconComponent className="h-3 w-3" />
                          </div>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{reward.name}</CardTitle>
                          <CardDescription>{reward.description}</CardDescription>
                          <p className="text-sm font-medium text-primary mt-1">{formatCurrency(reward.price_uzs)}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Поставщик: <span className="font-medium text-foreground">{vendorNames[reward.vendor_id] ?? "Загрузка..."}</span>
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" disabled={isDeleting}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditReward(reward)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Редактировать
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteReward(reward)}
                            className="text-red-600 focus:text-red-600"
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {isDeleting ? "Удаление..." : "Удалить"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Требование:</span>
                        <span className="font-medium">{reward.points_required} баллов</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Количество:</span>
                        <span className="font-medium">{reward.quantity?.toLocaleString?.() ?? reward.quantity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Выдано всего:</span>
                        <span className="font-medium">{reward.issued_total.toLocaleString()}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Популярность:</span>
                          <span className="font-medium">{reward.popularity}%</span>
                        </div>
                        <Progress value={reward.popularity} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Распределение наград</CardTitle>
                <CardDescription>Количество выданных наград по типам</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRewards.map((reward) => {
                    const IconComponent = getRewardIcon(reward.name)
                    const totalIssuedFiltered = filteredRewards.reduce((acc, r) => acc + r.issued_total, 0)
                    const percentage = totalIssuedFiltered > 0 ? (reward.issued_total / totalIssuedFiltered) * 100 : 0
                    return (
                      <div key={reward.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            <span>
                              {reward.name}
                              <span className="text-muted-foreground"> · {vendorNames[reward.vendor_id] ?? `Поставщик #${reward.vendor_id}`}</span>
                            </span>
                          </span>
                          <span className="font-medium">{reward.issued_total.toLocaleString()}</span>
                        </div>
                        <Progress value={percentage} />
                        <div className="text-xs text-muted-foreground text-right">
                          {percentage.toFixed(1)}% от общего числа
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Популярность наград</CardTitle>
                <CardDescription>Рейтинг популярности по типам наград</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRewards
                    .sort((a, b) => b.popularity - a.popularity)
                    .map((reward, index) => {
                      const IconComponent = getRewardIcon(reward.name)
                      return (
                        <div key={reward.id} className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {index + 1}
                          </div>
                          <IconComponent className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                {reward.name}
                                <span className="ml-1 text-xs text-muted-foreground">({vendorNames[reward.vendor_id] ?? `Поставщик #${reward.vendor_id}`})</span>
                              </span>
                              <span className="text-sm text-muted-foreground">{reward.popularity}%</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Редактировать награду</DialogTitle>
            <DialogDescription>Изменить информацию о награде</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Название награды</Label>
              <Input
                id="edit-name"
                placeholder="Например: Планшет Samsung"
                value={editForm.name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Описание</Label>
              <Textarea
                id="edit-description"
                placeholder="Описание условий получения награды"
                value={editForm.description}
                onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-requirement">Требование (баллов)</Label>
              <Input
                id="edit-requirement"
                type="number"
                placeholder="300"
                value={editForm.points_required}
                onChange={(e) => setEditForm((prev) => ({ ...prev, points_required: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-price">Стоимость (сум)</Label>
              <Input
                id="edit-price"
                placeholder="1500000"
                value={editForm.price_uzs}
                onChange={(e) => setEditForm((prev) => ({ ...prev, price_uzs: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-image">Фотография награды</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("edit-image")?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {editSelectedImage ? editSelectedImage.name : "Изменить фото"}
                </Button>
              </div>
              {editSelectedImage && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ImageIcon className="h-4 w-4" />
                  <span>Выбрано: {editSelectedImage.name}</span>
                </div>
              )}
              {editingReward && !editSelectedImage && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ImageIcon className="h-4 w-4" />
                  <span>Текущее фото сохранится</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isUpdating}>
              Отмена
            </Button>
            <Button onClick={handleUpdateReward} disabled={isUpdating}>
              {isUpdating ? "Обновление..." : "Обновить"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
