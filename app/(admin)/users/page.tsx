"use client"

import { useState } from "react"
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
import { Search, Filter, MoreHorizontal, UserPlus, Download, Eye, Edit, Ban, CheckCircle } from "lucide-react"

const mockUsers = [
  {
    id: "1",
    name: "Алишер Каримов",
    email: "alisher.karimov@email.com",
    phone: "+998 90 123 45 67",
    status: "active",
    registrationDate: "2024-01-15",
    balance: 125000, // в сумах
    bottlesSubmitted: 245,
    aluminumBottlesSubmitted: 89,
    totalPayout: 450000, // в сумах
    totalContainersSubmitted: 334,
    points: 1250,
    totalRewards: 12,
    location: "Ташкент",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    name: "Фатима Рахимова",
    email: "fatima.rahimova@email.com",
    phone: "+998 91 234 56 78",
    status: "active",
    registrationDate: "2024-01-20",
    balance: 89000,
    bottlesSubmitted: 189,
    aluminumBottlesSubmitted: 67,
    totalPayout: 320000,
    totalContainersSubmitted: 256,
    points: 890,
    totalRewards: 8,
    location: "Самарканд",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    name: "Дилшод Усманов",
    email: "dilshod.usmanov@email.com",
    phone: "+998 93 345 67 89",
    status: "blocked",
    registrationDate: "2024-02-01",
    balance: 15000,
    bottlesSubmitted: 67,
    aluminumBottlesSubmitted: 23,
    totalPayout: 95000,
    totalContainersSubmitted: 90,
    points: 150,
    totalRewards: 3,
    location: "Бухара",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "4",
    name: "Нигора Абдуллаева",
    email: "nigora.abdullaeva@email.com",
    phone: "+998 94 456 78 90",
    status: "pending",
    registrationDate: "2024-02-10",
    balance: 34000,
    bottlesSubmitted: 23,
    aluminumBottlesSubmitted: 12,
    totalPayout: 45000,
    totalContainersSubmitted: 35,
    points: 340,
    totalRewards: 1,
    location: "Андижан",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "5",
    name: "Шерзод Турсунов",
    email: "sherzod.tursunov@email.com",
    phone: "+998 95 567 89 01",
    status: "active",
    registrationDate: "2024-02-15",
    balance: 78000,
    bottlesSubmitted: 156,
    aluminumBottlesSubmitted: 45,
    totalPayout: 234000,
    totalContainersSubmitted: 201,
    points: 780,
    totalRewards: 7,
    location: "Фергана",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
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

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [users] = useState(mockUsers)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+12% с прошлого месяца</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">2,654</div>
            <p className="text-xs text-muted-foreground">93.2% от общего числа</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Заблокированные</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">156</div>
            <p className="text-xs text-muted-foreground">5.5% от общего числа</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Новые за месяц</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">342</div>
            <p className="text-xs text-muted-foreground">+18% к прошлому месяцу</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
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
                  placeholder="Поиск по имени, email или телефону..."
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

          {/* Users Table */}
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
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">ID: #{user.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{user.email}</div>
                        <div className="text-muted-foreground">{user.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      <div className="font-medium text-green-600">{formatCurrency(user.balance)}</div>
                      <div className="text-sm text-muted-foreground">текущий баланс</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{user.bottlesSubmitted}</div>
                      <div className="text-sm text-muted-foreground">штук</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{user.aluminumBottlesSubmitted}</div>
                      <div className="text-sm text-muted-foreground">штук</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{user.totalContainersSubmitted}</div>
                      <div className="text-sm text-muted-foreground">единиц</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-blue-600">{formatCurrency(user.totalPayout)}</div>
                      <div className="text-sm text-muted-foreground">всего выплачено</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-purple-600">{user.points}</div>
                      <div className="text-sm text-muted-foreground">баллов</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Открыть меню</span>
                            <MoreHorizontal className="h-4 w-4" />
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
                          {user.status === "active" ? (
                            <DropdownMenuItem className="text-red-600">
                              <Ban className="mr-2 h-4 w-4" />
                              Заблокировать
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-green-600">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Активировать
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

          {/* Pagination */}
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
