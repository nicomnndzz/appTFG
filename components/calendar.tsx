"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Actualizar para usar fecha real actual
  const getCurrentMadridDate = () => {
    return new Date().toLocaleDateString("es-ES", {
      timeZone: "Europe/Madrid",
    })
  }

  // Obtener fecha actual de Madrid
  const madridDate = new Date().toLocaleDateString("es-ES", {
    timeZone: "Europe/Madrid",
  })
  const today = new Date()

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const dayNames = ["L", "M", "X", "J", "V", "S", "D"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7 // Ajustar para que lunes sea 0

    const days = []

    // Días vacíos al inicio
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const isToday = (day: number | null) => {
    if (!day) return false
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return checkDate.toDateString() === today.toDateString()
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const days = getDaysInMonth(currentDate)

  return (
    <Card className="border-orange-200 bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth("prev")}
              className="h-8 w-8 border-orange-200 hover:bg-orange-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth("next")}
              className="h-8 w-8 border-orange-200 hover:bg-orange-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600">Calendario académico - Zona horaria Madrid</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div
              key={index}
              className={`
                text-center p-2 text-sm rounded-md cursor-pointer transition-colors
                ${day ? "hover:bg-orange-50" : ""}
                ${isToday(day) ? "bg-orange-500 text-white font-bold shadow-md" : day ? "text-gray-700" : ""}
              `}
            >
              {day || ""}
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-gray-500 text-center">
          Hoy:{" "}
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "Europe/Madrid",
          })}
        </div>
      </CardContent>
    </Card>
  )
}
