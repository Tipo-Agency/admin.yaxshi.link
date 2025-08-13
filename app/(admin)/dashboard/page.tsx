import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Users, Award, Recycle, TrendingUp, Calendar, MapPin, AlertTriangle } from "lucide-react"

export default function DashboardPage() {
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
            <div className="text-2xl font-bold text-primary">2,847</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +12% с прошлого месяца
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
            <div className="text-2xl font-bold text-green-600">156</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +3 новых на этой неделе
            </p>
            <div className="flex justify-between text-xs mt-2">
              <span>Работают: 142</span>
              <span className="text-yellow-600">Обслуживание: 14</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Выданные награды</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">8,924</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +18% с прошлого месяца
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 whitespace-nowrap">
                Наушники: 5,234
              </Badge>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 whitespace-nowrap">
                Телевизор: 2,890
              </Badge>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 whitespace-nowrap">
                Телефон: 800
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Доход</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₽124,580</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +8% с прошлого месяца
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
                  <p className="text-xs text-muted-foreground">ID: #2847 • Ташкент</p>
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
                  <p className="text-sm font-medium">Выдана золотая награда</p>
                  <p className="text-xs text-muted-foreground">Пользователь #1247 • 500 единиц тары</p>
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
                    <p className="text-xs text-muted-foreground">Онлайн: 142/156</p>
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
