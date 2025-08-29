"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Loader2, Save, RotateCcw, Copy, ArrowLeft } from "lucide-react"
import { vendorsApi, type TVendor } from "@/lib/api/vendors"
import { ApiError } from "@/lib/api/client"
import { useToast } from "@/hooks/use-toast"

export default function VendorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const vendorId = Number(params?.id)

  const [vendor, setVendor] = useState<TVendor | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form
  const [name, setName] = useState("")
  const [login, setLogin] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [terms, setTerms] = useState("")
  const [commission, setCommission] = useState<number>(0)
  const [isActive, setIsActive] = useState<boolean>(true)

  // Reset password
  const [isResetOpen, setIsResetOpen] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [newLogin, setNewLogin] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    toast({ title: "Скопировано", description: `${label} скопирован` })
  }

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const v = await vendorsApi.get(vendorId)
      setVendor(v)
      setName(v.name)
      setLogin(v.login)
      setContactEmail(v.contact_email)
      setContactPhone(v.contact_phone)
      setTerms(v.terms)
      setCommission(Number(v.commission_percent))
      setIsActive(v.is_active)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Не удалось загрузить вендора"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!Number.isFinite(vendorId)) return
    load()
  }, [vendorId])

  const save = async () => {
    try {
      setSaving(true)
      const updated = await vendorsApi.update(vendorId, {
        name,
        login,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        terms,
        commission_percent: Number(commission),
        is_active: isActive,
      })
      setVendor(updated)
      toast({ title: "Сохранено", description: "Данные вендора обновлены" })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Не удалось сохранить"
      toast({ title: "Ошибка", description: message, variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const resetPassword = async () => {
    try {
      setResetLoading(true)
      const resp = await vendorsApi.resetPassword(vendorId)
      setNewLogin(resp.login)
      setNewPassword(resp.password)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Не удалось сбросить пароль"
      toast({ title: "Ошибка", description: message, variant: "destructive" })
    } finally {
      setResetLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Загрузка...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <div className="text-red-600">{error}</div>
        <Button variant="outline" onClick={load}>Повторить</Button>
      </div>
    )
  }

  if (!vendor) return null

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => router.push("/vendors")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Назад
        </Button>
        <h1 className="text-2xl font-bold">{vendor.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Профиль вендора</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Название</Label>
            <Input className="col-span-3" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Логин</Label>
            <Input className="col-span-3" value={login} onChange={(e) => setLogin(e.target.value)} />
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

          <div className="flex justify-end gap-2">
            <Button onClick={save} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} 
              Сохранить
            </Button>
            <Button variant="outline" onClick={() => load()}>
              <RotateCcw className="h-4 w-4 mr-2" /> Сбросить изменения
            </Button>
            <Button variant="secondary" onClick={() => setIsResetOpen(true)}>
              Сбросить пароль
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Сброс пароля</DialogTitle>
            <DialogDescription>Получите новый логин и пароль для вендора</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button onClick={resetPassword} disabled={resetLoading}>
              {resetLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <></>}
              Запросить новые данные
            </Button>
            {(newLogin || newPassword) && (
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Логин</div>
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-1 rounded bg-muted text-foreground text-sm">{newLogin}</code>
                    <Button variant="outline" size="icon" onClick={() => copy(newLogin, "Логин")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Пароль</div>
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-1 rounded bg-muted text-foreground text-sm">{newPassword}</code>
                    <Button variant="outline" size="icon" onClick={() => copy(newPassword, "Пароль")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setIsResetOpen(false)}>Закрыть</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


