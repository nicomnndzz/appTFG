"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, CheckCircle } from "lucide-react"

export function UpcomingDates() {
  const dates = [
    {
      title: "Cierre de selección de módulos",
      date: "15 de junio, 2025",
      status: "urgent",
      icon: Clock,
    },
    {
      title: "Publicación de asignaciones",
      date: "30 de junio, 2025",
      status: "warning",
      icon: Calendar,
    },
    {
      title: "Inicio del curso académico",
      date: "15 de septiembre, 2025",
      status: "success",
      icon: CheckCircle,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "urgent":
        return "text-red-600"
      case "warning":
        return "text-yellow-600"
      case "success":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case "urgent":
        return "bg-red-50"
      case "warning":
        return "bg-yellow-50"
      case "success":
        return "bg-green-50"
      default:
        return "bg-gray-50"
    }
  }

  return (
    <Card className="border-orange-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Próximas Fechas</CardTitle>
        <p className="text-sm text-gray-600">Fechas importantes para el proceso de selección</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dates.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg ${getStatusBg(item.status)}`}>
                <Icon className={`h-5 w-5 mt-0.5 ${getStatusColor(item.status)}`} />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.date}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
