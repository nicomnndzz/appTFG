"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen, AlertTriangle } from "lucide-react"

interface UserWorkloadProps {
  professorCode: string
}

interface Assignment {
  subject: string
  hours: number
  group: string
  level: string
}

export function UserWorkload({ professorCode }: UserWorkloadProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [totalHours, setTotalHours] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserWorkload()
  }, [professorCode])

  const loadUserWorkload = async () => {
    try {
      // Simular carga desde Asig.csv basado en el código del profesor
      // En producción, aquí cargarías y filtrarías el CSV real
      const mockAssignments: Assignment[] = [
        {
          subject: "Desarrollo Web en Entorno Cliente",
          hours: 6,
          group: "2DAW",
          level: "CFGS",
        },
        {
          subject: "Desarrollo Web en Entorno Servidor",
          hours: 8,
          group: "2DAW",
          level: "CFGS",
        },
        {
          subject: "Bases de Datos",
          hours: 4,
          group: "1DAW",
          level: "CFGS",
        },
        {
          subject: "Programación",
          hours: 7,
          group: "1DAW",
          level: "CFGS",
        },
      ]

      const total = mockAssignments.reduce((sum, assignment) => sum + assignment.hours, 0)

      setAssignments(mockAssignments)
      setTotalHours(total)
      setLoading(false)
    } catch (error) {
      console.error("Error loading user workload:", error)
      setLoading(false)
    }
  }

  const maxHours = 25 // Horas máximas semanales
  const percentage = (totalHours / maxHours) * 100

  const getStatusColor = () => {
    if (percentage > 100) return "text-red-600"
    if (percentage > 90) return "text-orange-600"
    if (percentage > 70) return "text-yellow-600"
    return "text-green-600"
  }

  const getStatusText = () => {
    if (percentage > 100) return "Sobrecargado"
    if (percentage > 90) return "Cerca del límite"
    if (percentage > 70) return "Carga alta"
    return "Carga normal"
  }

  if (loading) {
    return (
      <Card className="border-orange-200 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-orange-200 bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-orange-600" />
            Mi Carga Lectiva
          </CardTitle>
          <Badge variant="outline" className={`${getStatusColor()} border-current`}>
            {getStatusText()}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Profesor: {professorCode}</p>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-900">{totalHours}h</div>
            <p className="text-xs text-gray-600">de {maxHours}h semanales</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso de carga</span>
              <span className={`font-medium ${getStatusColor()}`}>{Math.round(percentage)}%</span>
            </div>
            <Progress
              value={percentage}
              className="h-3"
              style={{
                background: percentage > 100 ? "#fee2e2" : "#fed7aa",
              }}
            />
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-orange-600" />
              Asignaturas Asignadas
            </h4>
            {assignments.map((assignment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900 text-sm">{assignment.subject}</h5>
                  <p className="text-xs text-gray-600">
                    {assignment.group} - {assignment.level}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-orange-900">{assignment.hours}h</span>
                </div>
              </div>
            ))}
          </div>

          {percentage > 90 && (
            <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Atención</p>
                <p className="text-xs text-yellow-700">
                  Tu carga lectiva está cerca del límite máximo. Considera redistribuir algunas horas.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
