"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function CurrentWorkload() {
  const modules = [
    {
      name: "Desarrollo Web en Entorno Cliente",
      hours: 6,
      maxHours: 8,
      percentage: 75,
    },
    {
      name: "Sistemas Informáticos",
      hours: 5,
      maxHours: 6,
      percentage: 83,
    },
    {
      name: "FOL",
      hours: 4,
      maxHours: 5,
      percentage: 80,
    },
    {
      name: "Bases de Datos",
      hours: 3,
      maxHours: 6,
      percentage: 50,
    },
    {
      name: "Programación",
      hours: 7,
      maxHours: 8,
      percentage: 87,
    },
  ]

  return (
    <Card className="border-orange-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Carga Lectiva Actual</CardTitle>
        <p className="text-sm text-gray-600">Distribución de horas por módulo</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {modules.map((module, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900 text-sm">{module.name}</h4>
                <span className="text-sm font-semibold text-gray-700">{module.hours}h</span>
              </div>
              <Progress
                value={module.percentage}
                className="h-2"
                style={{
                  background: "#fed7aa",
                }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
