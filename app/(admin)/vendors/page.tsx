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
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Copy, Filter, Loader2, MoreHorizontal, Plus, RefreshCw, Search } from "lucide-react"
import { vendorsApi, type TVendor } from "@/lib/api/vendors"
import { ApiError } from "@/lib/api/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const formatDate = (dateString: string) => new Date(dateString).toLocaleString("ru-RU")

export default function VendorsPage() {
  const { toast } = useToast()
  const [vendors, setVendors] = useState<TVendor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Create modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [name, setName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [terms, setTerms] = useState("")
  const [commission, setCommission] = useState<number>(0)
  const [isActive, setIsActive] = useState(true)

  // Success modal for credentials
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [createdVendorName, setCreatedVendorName] = useState("")
  const [generatedLogin, setGeneratedLogin] = useState("")
  const [generatedPassword, setGeneratedPassword] = useState("")

  const fetchVendors = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await vendorsApi.list()
      setVendors(data)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Не удалось загрузить вендоров"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return vendors.filter((v) => {
      const matchesQ =
        v.name.toLowerCase().includes(q) ||
        v.login.toLowerCase().includes(q) ||
        v.contact_email.toLowerCase().includes(q) ||
        v.contact_phone.toLowerCase().includes(q)

      const matchesStatus = statusFilter === "all" ? true : statusFilter === "active" ? v.is_active : !v.is_active
      return matchesQ && matchesStatus
    })
  }, [vendors, search, statusFilter])

  const handleCreate = async () => {
    try {
      setCreateLoading(true)
      const res = await vendorsApi.create({
        name,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        terms,
        commission_percent: commission,
        is_active: isActive,
      })

      setIsCreateOpen(false)
      setCreatedVendorName(res.vendor.name)
      setGeneratedLogin(res.login)
      setGeneratedPassword(res.password)
      setIsSuccessOpen(true)
      setVendors((prev) => [res.vendor, ...prev])
      toast({ title: "Вендор создан", description: `Вендор «${res.vendor.name}» успешно создан` })

      // reset form
      setName("")
      setContactEmail("")
      setContactPhone("")
      setTerms("")
      setCommission(0)
      setIsActive(true)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Не удалось создать вендора"
      toast({ title: "Ошибка", description: message, variant: "destructive" })
    } finally {
      setCreateLoading(false)
    }
  }

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    toast({ title: "Скопировано", description: `${label} скопирован в буфер обмена` })
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Загрузка вендоров...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <div className="text-red-600">{error}</div>
        <Button variant="outline" onClick={fetchVendors}>
          Повторить
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Вендоры</h1>
          <p className="text-muted-foreground">Управление вендорами платформы</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Создать вендора
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список вендоров</CardTitle>
          <CardDescription>Поиск и фильтрация</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Поиск по имени, логину, email, телефону" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="active">Активные</SelectItem>
                <SelectItem value="inactive">Неактивные</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Логин</TableHead>
                  <TableHead>Контакты</TableHead>
                  <TableHead>Комиссия</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Создан</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.name}</TableCell>
                    <TableCell className="text-muted-foreground">{v.login}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{v.contact_email}</div>
                        <div className="text-muted-foreground">{v.contact_phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{v.commission_percent}%</TableCell>
                    <TableCell>
                      {v.is_active ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Активный</Badge>
                      ) : (
                        <Badge variant="secondary">Неактивный</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(v.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Действия</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => window.location.assign(`/vendors/${v.id}`)}>Просмотр</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.location.assign(`/vendors/${v.id}`)}>Редактировать</DropdownMenuItem>
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

      {/* Create Vendor Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Создание вендора</DialogTitle>
            <DialogDescription>Заполните данные вендора и сохраните</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Название</Label>
              <Input className="col-span-3" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Email</Label>
              <Input type="email" className="col-span-3" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Телефон</Label>
              <Input className="col-span-3" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Условия</Label>
              <Input className="col-span-3" value={terms} onChange={(e) => setTerms(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Комиссия, %</Label>
              <Input type="number" className="col-span-3" value={commission} onChange={(e) => setCommission(Number(e.target.value))} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Статус</Label>
              <Select value={isActive ? "true" : "false"} onValueChange={(v) => setIsActive(v === "true")}> 
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Активный</SelectItem>
                  <SelectItem value="false">Неактивный</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Отмена</Button>
            <Button onClick={handleCreate} disabled={createLoading}>
              {createLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Создать
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Вендор «{createdVendorName}» успешно создан</DialogTitle>
            <DialogDescription>Ниже логин и пароль. Сохраните их — они показываются один раз.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Логин</div>
              <div className="flex items-center gap-2">
                <code className="px-2 py-1 rounded bg-muted text-foreground text-sm">{generatedLogin}</code>
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(generatedLogin, "Логин")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Пароль</div>
              <div className="flex items-center gap-2">
                <code className="px-2 py-1 rounded bg-muted text-foreground text-sm">{generatedPassword}</code>
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(generatedPassword, "Пароль")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setIsSuccessOpen(false)}>Понятно</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


