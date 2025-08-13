"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Smartphone,
  Plus,
  Search,
  Edit,
  Headphones,
  Monitor,
  TrendingUp,
  Users,
  Calendar,
  Upload,
  ImageIcon,
} from "lucide-react"

const techTypes = [
  {
    id: "headphones",
    name: "Беспроводные наушники",
    description: "За сдачу 100 единиц тары",
    image: "/images/headphones.png",
    icon: Headphones,
    color: "bg-blue-100 text-blue-800",
    borderColor: "border-blue-200",
    requirement: 100,
    totalIssued: 1234,
    activeUsers: 567,
    price: "150,000 сум",
  },
  {
    id: "tv",
    name: 'Телевизор 43"',
    description: "За сдачу 1000 единиц тары",
    image: "/images/tv.webp",
    icon: Monitor,
    color: "bg-purple-100 text-purple-800",
    borderColor: "border-purple-200",
    requirement: 1000,
    totalIssued: 89,
    activeUsers: 23,
    price: "3,500,000 сум",
  },
  {
    id: "phone",
    name: "Смартфон Xiaomi",
    description: "За сдачу 500 единиц тары",
    image: "/images/phone.jpeg",
    icon: Smartphone,
    color: "bg-green-100 text-green-800",
    borderColor: "border-green-200",
    requirement: 500,
    totalIssued: 345,
    activeUsers: 123,
    price: "2,200,000 сум",
  },
]

const recentTechPrizes = [
  {
    id: "1",
    userName: "Алишер Каримов",
    userAvatar: "/placeholder.svg?height=32&width=32",
    techType: "phone",
    techName: "Смартфон Xiaomi",
    issuedDate: "2024-02-20T10:30:00",
    containersCount: 523,
  },
  {
    id: "2",
    userName: "Фатима Рахимова",
    userAvatar: "/placeholder.svg?height=32&width=32",
    techType: "headphones",
    techName: "Беспроводные наушники",
    issuedDate: "2024-02-20T09:15:00",
    containersCount: 167,
  },
  {
    id: "3",
    userName: "Дилшод Усманов",
    userAvatar: "/placeholder.svg?height=32&width=32",
    techType: "headphones",
    techName: "Беспроводные наушники",
    issuedDate: "2024-02-19T16:45:00",
    containersCount: 128,
  },
  {
    id: "4",
    userName: "Нигора Абдуллаева",
    userAvatar: "/placeholder.svg?height=32&width=32",
    techType: "tv",
    techName: 'Телевизор 43"',
    issuedDate: "2024-02-19T14:20:00",
    containersCount: 1045,
  },
]

const getTechBadge = (techType: string) => {
  const tech = techTypes.find((t) => t.id === techType)
  if (!tech) return <Badge variant="secondary">Неизвестно</Badge>

  return (
    <Badge className={tech.color}>
      <tech.icon className="w-3 h-3 mr-1" />
      {tech.name}
    </Badge>
  )
}

export default function TechPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const filteredTechPrizes = recentTechPrizes.filter((prize) =>
    prize.userName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Награды</h1>
          <p className="text-muted-foreground">Управление призовой техникой и выдачей пользователям</p>
        </div>
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
                <Input id="name" placeholder="Например: Планшет Samsung" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea id="description" placeholder="Описание условий получения награды" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="requirement">Требование (единиц тары)</Label>
                <Input id="requirement" type="number" placeholder="300" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Стоимость</Label>
                <Input id="price" placeholder="1,500,000 сум" />
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
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>Добавить</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего выдано</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,668</div>
            <p className="text-xs text-muted-foreground">+12% с прошлого месяца</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные получатели</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">713</div>
            <p className="text-xs text-muted-foreground">24.9% от всех пользователей</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">За этот месяц</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+8% к прошлому месяцу</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общая стоимость</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1М</div>
            <p className="text-xs text-muted-foreground">сум выдано в месяц</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="types" className="space-y-4">
        <TabsList>
          <TabsTrigger value="types">Типы наград</TabsTrigger>
          <TabsTrigger value="history">История выдачи</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
        </TabsList>

        <TabsContent value="types" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {techTypes.map((tech) => {
              const IconComponent = tech.icon
              return (
                <Card key={tech.id} className={`${tech.borderColor} border-2`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={tech.image || "/placeholder.svg"}
                            alt={tech.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${tech.color}`}>
                            <IconComponent className="h-3 w-3" />
                          </div>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{tech.name}</CardTitle>
                          <CardDescription>{tech.description}</CardDescription>
                          <p className="text-sm font-medium text-primary mt-1">{tech.price}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Требование:</span>
                        <span className="font-medium">{tech.requirement} единиц тары</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Выдано всего:</span>
                        <span className="font-medium">{tech.totalIssued.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Активные получатели:</span>
                        <span className="font-medium">{tech.activeUsers.toLocaleString()}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Популярность:</span>
                          <span className="font-medium">
                            {Math.round((tech.activeUsers / tech.totalIssued) * 100)}%
                          </span>
                        </div>
                        <Progress value={(tech.activeUsers / tech.totalIssued) * 100} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>История выдачи наград</CardTitle>
                  <CardDescription>Последние выданные призы пользователям</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Поиск по имени..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Пользователь</TableHead>
                      <TableHead>Награда</TableHead>
                      <TableHead>Единиц тары</TableHead>
                      <TableHead>Дата выдачи</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTechPrizes.map((prize) => (
                      <TableRow key={prize.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={prize.userAvatar || "/placeholder.svg"} alt={prize.userName} />
                              <AvatarFallback>
                                {prize.userName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{prize.userName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getTechBadge(prize.techType)}</TableCell>
                        <TableCell>
                          <span className="font-medium">{prize.containersCount}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {new Date(prize.issuedDate).toLocaleDateString("ru-RU", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
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
                  {techTypes.map((tech) => {
                    const percentage = (tech.totalIssued / 1668) * 100
                    return (
                      <div key={tech.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <tech.icon className="h-4 w-4" />
                            {tech.name}
                          </span>
                          <span className="font-medium">{tech.totalIssued.toLocaleString()}</span>
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
                <CardTitle>Активность по месяцам</CardTitle>
                <CardDescription>Количество выданных наград за последние месяцы</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2 px-4">
                  {[
                    { month: "Окт", count: 45 },
                    { month: "Ноя", count: 67 },
                    { month: "Дек", count: 82 },
                    { month: "Янв", count: 94 },
                    { month: "Фев", count: 89 },
                  ].map((data, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div
                        className="bg-primary rounded-t-sm w-12 transition-all hover:bg-primary/80"
                        style={{ height: `${(data.count / 100) * 200}px` }}
                      />
                      <span className="text-xs text-muted-foreground">{data.month}</span>
                      <span className="text-xs font-medium">{data.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
