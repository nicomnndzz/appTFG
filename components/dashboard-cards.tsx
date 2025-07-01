"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, GraduationCap, BookOpen, Users } from "lucide-react"

interface DashboardCardsProps {
  stats: {
    departamentos: number
    ciclosFormativos: number
    modulosAsignados: number
    totalProfesores: number
  }
}

export function DashboardCards({ stats }: DashboardCardsProps) {
  const cards = [
    {
      title: "Departamentos",
      value: stats.departamentos,
      description: "Departamentos en el centro",
      icon: Building2,
      color: "text-orange-600",
    },
    {
      title: "Ciclos Formativos",
      value: stats.ciclosFormativos,
      description: "Ciclos formativos activos",
      icon: GraduationCap,
      color: "text-orange-600",
    },
    {
      title: "Módulos Asignados",
      value: stats.modulosAsignados,
      description: "Módulos asignados para el próximo curso",
      icon: BookOpen,
      color: "text-orange-600",
    },
    {
      title: "Total Profesores",
      value: stats.totalProfesores,
      description: "Profesores registrados en el sistema",
      icon: Users,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="border-orange-200 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">{card.title}</CardTitle>
              <Icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">{card.value}</div>
              <p className="text-xs text-gray-600">{card.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
