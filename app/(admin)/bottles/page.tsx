"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Filter, Loader2, MoreHorizontal, Pencil, Plus, Search, Trash2, Upload, X } from "lucide-react"
import { bottlesApi, type Bottle, type BottleMaterial } from "@/lib/api/bottles"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { API_BASE_URL } from "@/lib/api/config"

const formatDate = (dateString: string) => new Date(dateString).toLocaleString("ru-RU")

const materialLabels: Record<BottleMaterial, string> = {
  plastic: "Пластик",
  aluminum: "Алюминий",
}

export default function BottlesPage() {
  const { toast } = useToast()
  const [bottles, setBottles] = useState<Bottle[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [materialFilter, setMaterialFilter] = useState<string>("all")

  // Create/Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [editingBottle, setEditingBottle] = useState<Bottle | null>(null)
  const [name, setName] = useState("")
  const [size, setSize] = useState<string>("")
  const [material, setMaterial] = useState<BottleMaterial>("plastic")
  const [sku, setSku] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingBottle, setDeletingBottle] = useState<Bottle | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchBottles = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await bottlesApi.list({
        search: search || undefined,
        material: materialFilter !== "all" ? (materialFilter as BottleMaterial) : undefined,
      })
      setBottles(data.bottles)
      setTotal(data.total)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Не удалось загрузить бутылки"
      setError(message)
      toast({ title: "Ошибка", description: message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBottles()
  }, [search, materialFilter])

  const handleOpenCreateModal = () => {
    setEditingBottle(null)
    setName("")
    setSize("")
    setMaterial("plastic")
    setSku("")
    setImageFile(null)
    setImagePreview(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (bottle: Bottle) => {
    setEditingBottle(bottle)
    setName(bottle.name)
    setSize(bottle.size)
    setMaterial(bottle.material)
    setSku(bottle.sku)
    setImageFile(null)
    setImagePreview(`${API_BASE_URL}${bottle.image}` || null)
    setIsModalOpen(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSave = async () => {
    if (!name || !size || !sku) {
      toast({ title: "Ошибка", description: "Заполните все обязательные поля", variant: "destructive" })
      return
    }

    try {
      setModalLoading(true)
      
      if (editingBottle) {
        // Update
        const updated = await bottlesApi.update(editingBottle.id, {
          name,
          size: parseFloat(size),
          material,
          sku,
          image: imageFile || undefined,
        })
        setBottles((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))
        toast({ title: "Успешно", description: "Бутылка обновлена" })
      } else {
        // Create
        const created = await bottlesApi.create({
          name,
          size: parseFloat(size),
          material,
          sku,
          image: imageFile || undefined,
        })
        setBottles((prev) => [created, ...prev])
        setTotal((prev) => prev + 1)
        toast({ title: "Успешно", description: "Бутылка создана" })
      }

      setIsModalOpen(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Не удалось сохранить бутылку"
      toast({ title: "Ошибка", description: message, variant: "destructive" })
    } finally {
      setModalLoading(false)
    }
  }

  const handleOpenDeleteDialog = (bottle: Bottle) => {
    setDeletingBottle(bottle)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingBottle) return

    try {
      setDeleteLoading(true)
      await bottlesApi.delete(deletingBottle.id)
      setBottles((prev) => prev.filter((b) => b.id !== deletingBottle.id))
      setTotal((prev) => prev - 1)
      toast({ title: "Успешно", description: "Бутылка удалена" })
      setDeleteDialogOpen(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Не удалось удалить бутылку"
      toast({ title: "Ошибка", description: message, variant: "destructive" })
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading && bottles.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Загрузка бутылок...
      </div>
    )
  }

  if (error && bottles.length === 0) {
    return (
      <div className="p-6 space-y-4">
        <div className="text-red-600">{error}</div>
        <Button variant="outline" onClick={fetchBottles}>
          Повторить
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Бутылки</h1>
          <p className="text-muted-foreground">
            Управление бутылками платформы ({total} {total === 1 ? "бутылка" : total < 5 ? "бутылки" : "бутылок"})
          </p>
        </div>
        <Button onClick={handleOpenCreateModal}>
          <Plus className="h-4 w-4 mr-2" /> Добавить бутылку
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список бутылок</CardTitle>
          <CardDescription>Поиск и фильтрация</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Поиск по названию или SKU"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <Select value={materialFilter} onValueChange={setMaterialFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Материал" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все материалы</SelectItem>
                <SelectItem value="plastic">Пластик</SelectItem>
                <SelectItem value="aluminum">Алюминий</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Изображение</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Размер</TableHead>
                  <TableHead>Материал</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Создана</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bottles.map((bottle) => (
                  <TableRow key={bottle.id}>
                    <TableCell>
                      {bottle.image ? (
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted">
                          <Image
                            src={`${API_BASE_URL}${bottle.image}`}
                            alt={bottle.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs">
                          Нет
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{bottle.name}</TableCell>
                    <TableCell>{bottle.size} л</TableCell>
                    <TableCell>
                      <Badge variant={bottle.material === "plastic" ? "default" : "secondary"}>
                        {materialLabels[bottle.material]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{bottle.sku}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(bottle.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Действия</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenEditModal(bottle)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Редактировать
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleOpenDeleteDialog(bottle)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Удалить
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>{editingBottle ? "Редактирование бутылки" : "Создание бутылки"}</DialogTitle>
            <DialogDescription>Заполните данные бутылки и сохраните</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Название <span className="text-red-500">*</span>
              </Label>
              <Input className="col-span-3" value={name} onChange={(e) => setName(e.target.value)} placeholder="Например, Coca-Cola 0.5L" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Размер (л) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                step="0.1"
                className="col-span-3"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="0.5"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Материал <span className="text-red-500">*</span>
              </Label>
              <Select value={material} onValueChange={(v) => setMaterial(v as BottleMaterial)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plastic">Пластик</SelectItem>
                  <SelectItem value="aluminum">Алюминий</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                SKU <span className="text-red-500">*</span>
              </Label>
              <Input className="col-span-3" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="COCA-05-PL" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Изображение</Label>
              <div className="col-span-3 space-y-2">
                {imagePreview ? (
                  <div className="relative w-32 h-32 rounded-md overflow-hidden bg-muted">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Загрузить изображение</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={modalLoading}>
              Отмена
            </Button>
            <Button onClick={handleSave} disabled={modalLoading}>
              {modalLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {editingBottle ? "Сохранить" : "Создать"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить бутылку?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить бутылку &quot;{deletingBottle?.name}&quot;? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteLoading} className="bg-red-600 hover:bg-red-700">
              {deleteLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

