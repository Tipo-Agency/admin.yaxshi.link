"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Users, Award, Recycle, TrendingUp, Calendar, MapPin, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"
import { getStats, type DashboardStats } from "@/lib/api/dashboard"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await getStats()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки данных")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatCurrency = (amount: string) => {
    const num = Number.parseFloat(amount)
    return new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(num)
      .replace("UZS", "сум")
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Дашборд</h1>
          <p className="text-muted-foreground">Обзор системы Yaxshi Link</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-red-500">Ошибка: {error}</p>
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Дашборд</h1>
        <p className="text-muted-foreground">Обзор системы Yaxshi Link</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.total_users.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              Активные пользователи
            </p>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные фондоматы</CardTitle>
            <Recycle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active_fandomats}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />В работе
            </p>
            <div className="flex justify-between text-xs mt-2">
              <span>Работают: {stats.active_fandomats}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Выданные награды</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.total_issued_rewards.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              Всего выдано
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {stats.rewards.slice(0, 3).map((reward) => (
                <Badge key={reward.id} variant="secondary" className="text-[10px] px-1.5 py-0.5 whitespace-nowrap">
                  {reward.name}: {reward.issued_total}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Доход</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.total_income)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              Общий доход
            </p>
            <Progress value={68} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Активность пользователей</CardTitle>
            <CardDescription>Количество сданной тары по дням</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2 px-4">
              {[45, 78, 65, 89, 92, 67, 84, 76, 95, 88, 72, 91, 85, 79].map((value, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className="bg-primary rounded-t-sm w-6 transition-all hover:bg-primary/80"
                    style={{ height: `${(value / 100) * 200}px` }}
                  />
                  <span className="text-xs text-muted-foreground">{index + 1}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-muted-foreground mt-4">
              <span>Последние 14 дней</span>
              <span>Среднее: 79 единиц/день</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Топ регионы</CardTitle>
            <CardDescription>По количеству активных фондоматов</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Ташкент</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={85} className="w-16" />
                  <span className="text-sm font-medium">67</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Самарканд</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={65} className="w-16" />
                  <span className="text-sm font-medium">34</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Бухара</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={45} className="w-16" />
                  <span className="text-sm font-medium">28</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Андижан</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={35} className="w-16" />
                  <span className="text-sm font-medium">19</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Фергана</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={20} className="w-16" />
                  <span className="text-sm font-medium">8</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and System Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Последняя активность
            </CardTitle>
            <CardDescription>Недавние действия в системе</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-lg bg-accent/50">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Новый пользователь зарегистрирован</p>
                  <p className="text-xs text-muted-foreground">ID: #{stats.total_users} • Ташкент</p>
                  <p className="text-xs text-muted-foreground">2 минуты назад</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Новый
                </Badge>
              </div>
              <div className="flex items-start gap-4 p-3 rounded-lg bg-yellow-50">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Фондомат требует обслуживания</p>
                  <p className="text-xs text-muted-foreground">ID: #45 • ул. Навои, 12</p>
                  <p className="text-xs text-muted-foreground">15 минут назад</p>
                </div>
                <Badge variant="secondary" className="text-xs bg-yellow-100">
                  Внимание
                </Badge>
              </div>
              <div className="flex items-start gap-4 p-3 rounded-lg bg-green-50">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Выдана награда</p>
                  <p className="text-xs text-muted-foreground">Пользователь • {stats.rewards[0]?.name || "Награда"}</p>
                  <p className="text-xs text-muted-foreground">1 час назад</p>
                </div>
                <Badge variant="secondary" className="text-xs bg-green-100">
                  Награда
                </Badge>
              </div>
              <div className="flex items-start gap-4 p-3 rounded-lg bg-accent/50">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Обновление системы завершено</p>
                  <p className="text-xs text-muted-foreground">Версия 2.1.4 • Все сервисы</p>
                  <p className="text-xs text-muted-foreground">3 часа назад</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Система
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Статус системы
            </CardTitle>
            <CardDescription>Текущее состояние сервисов</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <span className="text-sm font-medium">API сервер</span>
                    <p className="text-xs text-muted-foreground">Время отклика: 45ms</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Работает
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <span className="text-sm font-medium">База данных</span>
                    <p className="text-xs text-muted-foreground">Подключений: 23/100</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Работает
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <div>
                    <span className="text-sm font-medium">Система платежей</span>
                    <p className="text-xs text-muted-foreground">Высокая нагрузка</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Предупреждение
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <span className="text-sm font-medium">Мониторинг фондоматов</span>
                    <p className="text-xs text-muted-foreground">Онлайн: {stats.active_fandomats}/156</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Работает
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
