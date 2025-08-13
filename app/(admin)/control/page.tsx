"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Settings,
  Save,
  RefreshCw,
  Shield,
  Bell,
  DollarSign,
  Database,
  Users,
  Activity,
  CheckCircle,
  Download,
  Upload,
} from "lucide-react"

export default function ControlPanelPage() {
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      pushNotifications: true,
      maintenanceAlerts: true,
    },
    rewards: {
      bronzeThreshold: 50,
      silverThreshold: 150,
      goldThreshold: 500,
      ecoHeroThreshold: 1000,
      autoRewardIssue: true,
    },
    pricing: {
      containerPrice: 2,
      bonusMultiplier: 1.5,
      premiumUserBonus: 0.2,
    },
    system: {
      maintenanceMode: false,
      autoBackup: true,
      logRetention: 90,
      apiRateLimit: 1000,
    },
  })

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  const handleSaveSettings = () => {
    // Here you would save settings to backend
    console.log("Saving settings:", settings)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Панель управления</h1>
          <p className="text-muted-foreground">Системные настройки и конфигурация Yaxshi Link</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Сбросить
          </Button>
          <Button size="sm" onClick={handleSaveSettings} className="bg-primary hover:bg-primary/90">
            <Save className="h-4 w-4 mr-2" />
            Сохранить изменения
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">Общие</TabsTrigger>
          <TabsTrigger value="rewards">Награды</TabsTrigger>
          <TabsTrigger value="pricing">Тарифы</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="security">Безопасность</TabsTrigger>
          <TabsTrigger value="system">Система</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Основные настройки
                </CardTitle>
                <CardDescription>Общие параметры системы</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Название компании</Label>
                  <Input id="company-name" defaultValue="Yaxshi Link" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Email поддержки</Label>
                  <Input id="support-email" type="email" defaultValue="support@yaxshilink.uz" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-phone">Телефон поддержки</Label>
                  <Input id="support-phone" defaultValue="+998 71 123 45 67" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="working-hours">Часы работы</Label>
                  <Input id="working-hours" defaultValue="Пн-Пт: 9:00-18:00" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Региональные настройки</CardTitle>
                <CardDescription>Локализация и региональные параметры</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Часовой пояс</Label>
                  <Select defaultValue="asia-tashkent">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia-tashkent">Asia/Tashkent (UTC+5)</SelectItem>
                      <SelectItem value="asia-samarkand">Asia/Samarkand (UTC+5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Валюта</Label>
                  <Select defaultValue="uzs">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uzs">Узбекский сум (UZS)</SelectItem>
                      <SelectItem value="usd">Доллар США (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Язык по умолчанию</Label>
                  <Select defaultValue="ru">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ru">Русский</SelectItem>
                      <SelectItem value="uz">Узбекский</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Настройки системы наград
              </CardTitle>
              <CardDescription>Управление критериями получения наград</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Пороги для наград</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="bronze-threshold">Бронзовая награда</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="bronze-threshold"
                          type="number"
                          value={settings.rewards.bronzeThreshold}
                          onChange={(e) =>
                            handleSettingChange("rewards", "bronzeThreshold", Number.parseInt(e.target.value))
                          }
                          className="w-20"
                        />
                        <span className="text-sm text-muted-foreground">единиц</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="silver-threshold">Серебряная награда</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="silver-threshold"
                          type="number"
                          value={settings.rewards.silverThreshold}
                          onChange={(e) =>
                            handleSettingChange("rewards", "silverThreshold", Number.parseInt(e.target.value))
                          }
                          className="w-20"
                        />
                        <span className="text-sm text-muted-foreground">единиц</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="gold-threshold">Золотая награда</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="gold-threshold"
                          type="number"
                          value={settings.rewards.goldThreshold}
                          onChange={(e) =>
                            handleSettingChange("rewards", "goldThreshold", Number.parseInt(e.target.value))
                          }
                          className="w-20"
                        />
                        <span className="text-sm text-muted-foreground">единиц</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="eco-hero-threshold">Эко-герой</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="eco-hero-threshold"
                          type="number"
                          value={settings.rewards.ecoHeroThreshold}
                          onChange={(e) =>
                            handleSettingChange("rewards", "ecoHeroThreshold", Number.parseInt(e.target.value))
                          }
                          className="w-20"
                        />
                        <span className="text-sm text-muted-foreground">единиц</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Дополнительные настройки</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Автоматическая выдача наград</Label>
                        <p className="text-sm text-muted-foreground">
                          Награды выдаются автоматически при достижении порога
                        </p>
                      </div>
                      <Switch
                        checked={settings.rewards.autoRewardIssue}
                        onCheckedChange={(checked) => handleSettingChange("rewards", "autoRewardIssue", checked)}
                      />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="reward-message">Сообщение при получении награды</Label>
                      <Textarea
                        id="reward-message"
                        placeholder="Поздравляем! Вы получили награду за активное участие в программе переработки."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Настройки тарифов</CardTitle>
              <CardDescription>Управление ценами и бонусными коэффициентами</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Базовые тарифы</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="container-price">Цена за единицу тары</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="container-price"
                          type="number"
                          step="0.1"
                          value={settings.pricing.containerPrice}
                          onChange={(e) =>
                            handleSettingChange("pricing", "containerPrice", Number.parseFloat(e.target.value))
                          }
                          className="w-20"
                        />
                        <span className="text-sm text-muted-foreground">сум</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="bonus-multiplier">Бонусный коэффициент</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="bonus-multiplier"
                          type="number"
                          step="0.1"
                          value={settings.pricing.bonusMultiplier}
                          onChange={(e) =>
                            handleSettingChange("pricing", "bonusMultiplier", Number.parseFloat(e.target.value))
                          }
                          className="w-20"
                        />
                        <span className="text-sm text-muted-foreground">x</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="premium-bonus">Бонус премиум пользователей</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="premium-bonus"
                          type="number"
                          step="0.1"
                          value={settings.pricing.premiumUserBonus}
                          onChange={(e) =>
                            handleSettingChange("pricing", "premiumUserBonus", Number.parseFloat(e.target.value))
                          }
                          className="w-20"
                        />
                        <span className="text-sm text-muted-foreground">сум</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Специальные предложения</h3>
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Акция "Двойные баллы"</span>
                        <Badge variant="secondary">Неактивна</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Удвоенные баллы за сдачу тары в выходные дни</p>
                      <Button variant="outline" size="sm">
                        Активировать
                      </Button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Новогодняя акция</span>
                        <Badge className="bg-green-100 text-green-800">Активна</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">+50% к базовой стоимости до 31 декабря</p>
                      <Button variant="outline" size="sm">
                        Настроить
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Настройки уведомлений
              </CardTitle>
              <CardDescription>Управление системой оповещений</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Типы уведомлений</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email уведомления</Label>
                        <p className="text-sm text-muted-foreground">Отправка уведомлений на email</p>
                      </div>
                      <Switch
                        checked={settings.notifications.emailAlerts}
                        onCheckedChange={(checked) => handleSettingChange("notifications", "emailAlerts", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>SMS уведомления</Label>
                        <p className="text-sm text-muted-foreground">Отправка SMS сообщений</p>
                      </div>
                      <Switch
                        checked={settings.notifications.smsAlerts}
                        onCheckedChange={(checked) => handleSettingChange("notifications", "smsAlerts", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Push уведомления</Label>
                        <p className="text-sm text-muted-foreground">Уведомления в мобильном приложении</p>
                      </div>
                      <Switch
                        checked={settings.notifications.pushNotifications}
                        onCheckedChange={(checked) =>
                          handleSettingChange("notifications", "pushNotifications", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Уведомления о техобслуживании</Label>
                        <p className="text-sm text-muted-foreground">Алерты о необходимости обслуживания фондоматов</p>
                      </div>
                      <Switch
                        checked={settings.notifications.maintenanceAlerts}
                        onCheckedChange={(checked) =>
                          handleSettingChange("notifications", "maintenanceAlerts", checked)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Настройки безопасности
              </CardTitle>
              <CardDescription>Управление безопасностью и доступом</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Администраторы системы</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">admin@yaxshilink.uz</div>
                        <div className="text-sm text-muted-foreground">Суперадминистратор</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Активен</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">manager@yaxshilink.uz</div>
                        <div className="text-sm text-muted-foreground">Менеджер</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Активен</Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Добавить администратора
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Настройки доступа</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Время сессии (минуты)</Label>
                      <Input id="session-timeout" type="number" defaultValue="60" className="w-32" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-login-attempts">Максимум попыток входа</Label>
                      <Input id="max-login-attempts" type="number" defaultValue="5" className="w-32" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Системные настройки
                </CardTitle>
                <CardDescription>Конфигурация системы и производительность</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Режим обслуживания</Label>
                    <p className="text-sm text-muted-foreground">Временно отключить систему для пользователей</p>
                  </div>
                  <Switch
                    checked={settings.system.maintenanceMode}
                    onCheckedChange={(checked) => handleSettingChange("system", "maintenanceMode", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Автоматическое резервное копирование</Label>
                    <p className="text-sm text-muted-foreground">Ежедневное создание резервных копий</p>
                  </div>
                  <Switch
                    checked={settings.system.autoBackup}
                    onCheckedChange={(checked) => handleSettingChange("system", "autoBackup", checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="log-retention">Хранение логов (дни)</Label>
                  <Input
                    id="log-retention"
                    type="number"
                    value={settings.system.logRetention}
                    onChange={(e) => handleSettingChange("system", "logRetention", Number.parseInt(e.target.value))}
                    className="w-32"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-rate-limit">Лимит API запросов/час</Label>
                  <Input
                    id="api-rate-limit"
                    type="number"
                    value={settings.system.apiRateLimit}
                    onChange={(e) => handleSettingChange("system", "apiRateLimit", Number.parseInt(e.target.value))}
                    className="w-32"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Мониторинг системы
                </CardTitle>
                <CardDescription>Текущее состояние и производительность</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Статус системы</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Работает</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Использование CPU</span>
                    <span className="text-sm font-medium">23%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Использование памяти</span>
                    <span className="text-sm font-medium">67%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Свободное место</span>
                    <span className="text-sm font-medium">2.4 ТБ</span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Скачать логи
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Upload className="h-4 w-4 mr-2" />
                          Создать бэкап
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Создать резервную копию?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Будет создана полная резервная копия системы. Процесс может занять несколько минут.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction>Создать</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
