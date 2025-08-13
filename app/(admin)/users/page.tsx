"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Search, Filter, MoreHorizontal, UserPlus, Download, Eye, Edit, Ban, CheckCircle, Loader2 } from "lucide-react"

import { usersApi } from "@/lib/api/users"
import type { User, UsersStats } from "@/lib/api/types"
import { ApiError } from "@/lib/api/client"

const getStatusBadge = (status: string, isActive: boolean) => {
  if (!isActive) {
    return <Badge variant="destructive">Заблокирован</Badge>
  }

  switch (status.toLowerCase()) {
    case "active":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Активный</Badge>
    case "blocked":
      return <Badge variant="destructive">Заблокирован</Badge>
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Ожидание</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("uz-UZ").format(amount) + " сум"
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("ru-RU")
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<UsersStats>({
    total: 0,
    active: 0,
    blocked: 0,
    new_this_month: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<{ [key: number]: boolean }>({})
  const { toast } = useToast()

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await usersApi.getUsers()
      setUsers(data.users)
      setStats(data.stats)
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : "Произошла ошибка при загрузке данных"
      setError(errorMessage)
      console.error("Error fetching users:", err)
    } finally {
      setLoading(false)
    }
  }

  const blockUser = async (userId: number) => {
    try {
      setActionLoading((prev) => ({ ...prev, [userId]: true }))

      await usersApi.blockUser(userId)

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? { ...user, is_active: false, status: "blocked" } : user)),
      )

      setStats((prevStats) => ({
        ...prevStats,
        active: prevStats.active - 1,
        blocked: prevStats.blocked + 1,
      }))

      toast({
        title: "Пользователь заблокирован",
        description: "Пользователь успешно заблокирован",
      })
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : "Не удалось заблокировать пользователя"

      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      })
      console.error("Error blocking user:", err)
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }))
    }
  }

  const unblockUser = async (userId: number) => {
    try {
      setActionLoading((prev) => ({ ...prev, [userId]: true }))

      await usersApi.unblockUser(userId)

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? { ...user, is_active: true, status: "active" } : user)),
      )

      setStats((prevStats) => ({
        ...prevStats,
        active: prevStats.active + 1,
        blocked: prevStats.blocked - 1,
      }))

      toast({
        title: "Пользователь разблокирован",
        description: "Пользователь успешно разблокирован",
      })
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : "Не удалось разблокировать пользователя"

      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      })
      console.error("Error unblocking user:", err)
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }))
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase()
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)

    let matchesStatus = true
    if (statusFilter === "active") {
      matchesStatus = user.is_active && user.status.toLowerCase() === "active"
    } else if (statusFilter === "blocked") {
      matchesStatus = !user.is_active || user.status.toLowerCase() === "blocked"
    } else if (statusFilter === "pending") {
      matchesStatus = user.status.toLowerCase() === "pending"
    }

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Загрузка пользователей...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <div className="text-red-600">Ошибка загрузки данных: {error}</div>
          <Button onClick={fetchUsers} variant="outline">
            Попробовать снова
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Пользователи</h1>
          <p className="text-muted-foreground">Управление пользователями системы Yaxshi Link</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <UserPlus className="h-4 w-4 mr-2" />
            Добавить пользователя
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">общее количество</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}% от общего числа
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Заблокированные</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.blocked.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? ((stats.blocked / stats.total) * 100).toFixed(1) : 0}% от общего числа
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Новые за месяц</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.new_this_month.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">за текущий месяц</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список пользователей</CardTitle>
          <CardDescription>Поиск и управление пользователями</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Поиск по имени, username, email или телефону..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="active">Активные</SelectItem>
                <SelectItem value="blocked">Заблокированные</SelectItem>
                <SelectItem value="pending">Ожидание</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Пользователь</TableHead>
                  <TableHead>Контакты</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Баланс</TableHead>
                  <TableHead>Бутылки</TableHead>
                  <TableHead>Алюминий</TableHead>
                  <TableHead>Всего тары</TableHead>
                  <TableHead>Выплаты</TableHead>
                  <TableHead>Баллы</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user.avatar ? `https://api.yaxshi.link${user.avatar}` : "/placeholder.svg"}
                            alt={`${user.first_name} ${user.last_name}`}
                          />
                          {/* <AvatarFallback>
                            {user.first_name?.[0]}
                            {user.last_name?.[0]}
                          </AvatarFallback> */}
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">@{user.username}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{user.email}</div>
                        <div className="text-muted-foreground">{user.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status, user.is_active)}</TableCell>
                    <TableCell>
                      <div className="font-medium text-green-600">{formatCurrency(user.balance)}</div>
                      <div className="text-sm text-muted-foreground">текущий баланс</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{user.bottle_count}</div>
                      <div className="text-sm text-muted-foreground">штук</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{user.aluminum_bottle_count}</div>
                      <div className="text-sm text-muted-foreground">штук</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{user.total_bottles_submitted}</div>
                      <div className="text-sm text-muted-foreground">единиц</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-blue-600">{formatCurrency(user.total_payout)}</div>
                      <div className="text-sm text-muted-foreground">всего выплачено</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-purple-600">{user.points}</div>
                      <div className="text-sm text-muted-foreground">баллов</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" disabled={actionLoading[user.id]}>
                            <span className="sr-only">Открыть меню</span>
                            {actionLoading[user.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Действия</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Просмотр
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Редактировать
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.is_active ? (
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => blockUser(user.id)}
                              disabled={actionLoading[user.id]}
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Заблокировать
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-green-600"
                              onClick={() => unblockUser(user.id)}
                              disabled={actionLoading[user.id]}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Разблокировать
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Показано {filteredUsers.length} из {users.length} пользователей
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Предыдущая
              </Button>
              <Button variant="outline" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Следующая
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
