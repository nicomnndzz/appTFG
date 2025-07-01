"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, ChevronRight } from "lucide-react"

// Listado oficial de departamentos según la imagen proporcionada
const departments = [
  "Actividades físicas y deportivas",
  "Administración y gestión",
  "Comercio y marketing",
  "Fabricación mecánica",
  "Informática y comunicaciones",
  "Instalación y mantenimiento",
  "Madera, mueble y corcho",
  "Química",
  "FOL",
  "Inglés",
]

interface DepartmentsListProps {
  onDepartmentClick?: (department: string) => void
  professorsData?: Professor[]
}

interface Professor {
  id: string
  abrev: string
  department: string
  currentLoad: number
}

export function DepartmentsList({ onDepartmentClick, professorsData }: DepartmentsListProps) {
  const handleDepartmentClick = (department: string) => {
    if (onDepartmentClick) {
      onDepartmentClick(department)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-orange-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-orange-900 flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Departamentos del Centro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {departments.map((dept, index) => (
              <div
                key={index}
                onClick={() => handleDepartmentClick(dept)}
                className="flex items-center p-3 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer border border-orange-100 hover:border-orange-300 hover:shadow-sm"
              >
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                <span className="text-gray-900 font-medium flex-1">{dept}</span>
                <ChevronRight className="h-4 w-4 text-orange-400" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-orange-900">Estadísticas por Departamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept, index) => {
              const deptProfessors = (professorsData || []).filter((prof) => prof.department === dept)
              const totalLoad = deptProfessors.reduce((sum, prof) => sum + (prof.currentLoad || 0), 0)

              return (
                <div
                  key={index}
                  onClick={() => handleDepartmentClick(dept)}
                  className="p-4 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors border border-orange-200 hover:border-orange-300"
                >
                  <h4 className="font-semibold text-gray-900 text-sm mb-2">{dept}</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Profesores:</span>
                    <span className="font-medium text-orange-900">{deptProfessors.length}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">Carga total:</span>
                    <span className="font-medium text-orange-900">{totalLoad}h</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
