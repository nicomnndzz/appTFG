"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, Users, Clock } from "lucide-react"
import { loadProfessorsData, loadAssignmentsData } from "@/scripts/load-csv-data"

interface Professor {
  id: string
  abrev: string
  maxHours: number
  minHours: number
  department: string
  email: string
  currentLoad?: number
}

interface Assignment {
  subject: string
  professor: string
  groupCode: string
  shift: string
  level: string
  course: string
  group: string
  classroom: string
  sessions: number
}

// Actualizar la función normalizeDepartment para incluir corrección UTF-8 y mapeo completo

const formatTextUTF8 = (text: string): string => {
  if (!text) return ""

  return (
    text
      // Entidades HTML comunes
      .replace(/&ntilde;/gi, "ñ")
      .replace(/&Ntilde;/gi, "Ñ")
      .replace(/&aacute;/gi, "á")
      .replace(/&eacute;/gi, "é")
      .replace(/&iacute;/gi, "í")
      .replace(/&oacute;/gi, "ó")
      .replace(/&uacute;/gi, "ú")
      .replace(/&Aacute;/gi, "Á")
      .replace(/&Eacute;/gi, "É")
      .replace(/&Iacute;/gi, "Í")
      .replace(/&Oacute;/gi, "Ó")
      .replace(/&Uacute;/gi, "Ú")
      .replace(/&uuml;/gi, "ü")
      .replace(/&Uuml;/gi, "Ü")
      .replace(/&ccedil;/gi, "ç")
      .replace(/&Ccedil;/gi, "Ç")
      // Códigos numéricos HTML
      .replace(/&#241;/g, "ñ")
      .replace(/&#209;/g, "Ñ")
      .replace(/&#225;/g, "á")
      .replace(/&#233;/g, "é")
      .replace(/&#237;/g, "í")
      .replace(/&#243;/g, "ó")
      .replace(/&#250;/g, "ú")
      .replace(/&#193;/g, "Á")
      .replace(/&#201;/g, "É")
      .replace(/&#205;/g, "Í")
      .replace(/&#211;/g, "Ó")
      .replace(/&#218;/g, "Ú")
      .replace(/&#252;/g, "ü")
      .replace(/&#220;/g, "Ü")
      .replace(/&#186;/g, "º")
      .replace(/&#170;/g, "ª")
      // Caracteres especiales mal codificados (ISO-8859-1 a UTF-8)
      .replace(/Ã±/g, "ñ")
      .replace(/Ã¡/g, "á")
      .replace(/Ã©/g, "é")
      .replace(/Ã­/g, "í")
      .replace(/Ã³/g, "ó")
      .replace(/Ãº/g, "ú")
      .replace(/Ã/g, "Á")
      .replace(/Ã‰/g, "É")
      .replace(/Ã/g, "Í")
      .replace(/Ã"/g, "Ó")
      .replace(/Ãš/g, "Ú")
      .replace(/Ã'/g, "Ñ")
      .replace(/Â°/g, "º")
      .replace(/Âª/g, "ª")
      // Caracteres de Windows-1252
      .replace(/\u00F1/g, "ñ")
      .replace(/\u00D1/g, "Ñ")
      .replace(/\u00E1/g, "á")
      .replace(/\u00E9/g, "é")
      .replace(/\u00ED/g, "í")
      .replace(/\u00F3/g, "ó")
      .replace(/\u00FA/g, "ú")
      .replace(/\u00C1/g, "Á")
      .replace(/\u00C9/g, "É")
      .replace(/\u00CD/g, "Í")
      .replace(/\u00D3/g, "Ó")
      .replace(/\u00DA/g, "Ú")
      .replace(/\u00BA/g, "º")
      .replace(/\u00AA/g, "ª")
      // Limpiar espacios extra y caracteres de control
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
      .replace(/\s+/g, " ")
      .trim()
  )
}

const normalizeDepartment = (professorAbrev: string): string => {
  if (!professorAbrev) return "Inglés"

  // Limpiar y convertir a mayúsculas para comparación
  const cleanAbrev = professorAbrev.trim().toUpperCase()

  // Asignación por prefijo del código ABREV
  if (cleanAbrev.startsWith("AE") || cleanAbrev.startsWith("PGA")) {
    return "Administración y gestión"
  }

  if (cleanAbrev.startsWith("AQI")) {
    return "Química"
  }

  if (cleanAbrev.startsWith("EF")) {
    return "Actividades físicas y deportivas"
  }

  if (
    cleanAbrev.startsWith("FO") ||
    cleanAbrev.startsWith("ETF") ||
    cleanAbrev.startsWith("ESP") ||
    cleanAbrev.startsWith("SAI") ||
    cleanAbrev.startsWith("PPM") ||
    cleanAbrev.startsWith("OSE") ||
    cleanAbrev.startsWith("ORI") ||
    cleanAbrev.startsWith("PSA")
  ) {
    return "FOL"
  }

  if (cleanAbrev.startsWith("FIC") || cleanAbrev.startsWith("INF") || cleanAbrev.startsWith("SEA")) {
    return "Informática y comunicaciones"
  }

  if (
    cleanAbrev.startsWith("IE") ||
    cleanAbrev.startsWith("MAT") ||
    cleanAbrev.startsWith("MV") ||
    cleanAbrev.startsWith("SOL")
  ) {
    return "Instalación y mantenimiento"
  }

  if (cleanAbrev.startsWith("MM") || cleanAbrev.startsWith("OF")) {
    return "Fabricación mecánica"
  }

  if (cleanAbrev.startsWith("OGC") || cleanAbrev.startsWith("PC")) {
    return "Comercio y marketing"
  }

  if (cleanAbrev.startsWith("ING")) {
    return "Inglés"
  }

  // Por defecto, asignar Inglés
  return "Inglés"
}

const getWorkloadStatus = (currentLoad: number) => {
  const maxHours = 20
  const percentage = (currentLoad / maxHours) * 100
  if (currentLoad > maxHours)
    return { status: "overloaded", color: "bg-red-500", text: "Sobrecargado", textColor: "text-red-700" }
  if (percentage > 90)
    return { status: "near-limit", color: "bg-orange-500", text: "Cerca del límite", textColor: "text-orange-700" }
  if (percentage > 70)
    return { status: "high", color: "bg-yellow-500", text: "Carga alta", textColor: "text-yellow-700" }
  return { status: "balanced", color: "bg-green-500", text: "Carga normal", textColor: "text-green-700" }
}

export function ProfessorsTable() {
  const [professors, setProfessors] = useState<Professor[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [filteredProfessors, setFilteredProfessors] = useState<Professor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterProfessors()
  }, [professors, searchTerm, selectedDepartment])

  const loadData = async () => {
    try {
      const [professorsData, assignmentsData] = await Promise.all([loadProfessorsData(), loadAssignmentsData()])

      // Calcular carga actual para cada profesor
      const professorsWithLoad = professorsData.map((prof) => {
        const profAssignments = assignmentsData.filter((assignment) => assignment.professor === prof.abrev)
        const currentLoad = profAssignments.reduce((total, assignment) => total + assignment.sessions, 0)

        return {
          ...prof,
          department: normalizeDepartment(prof.abrev), // Usar abrev en lugar de department
          currentLoad,
        }
      })

      setProfessors(professorsWithLoad)
      setAssignments(assignmentsData)
      setLoading(false)
    } catch (error) {
      console.error("Error loading data:", error)
      setLoading(false)
    }
  }

  const filterProfessors = () => {
    let filtered = professors

    if (selectedDepartment !== "all") {
      filtered = filtered.filter((prof) => prof.department === selectedDepartment)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (prof) =>
          prof.abrev.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prof.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prof.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredProfessors(filtered)
  }

  const getProfessorAssignments = (professorCode: string) => {
    return assignments.filter((assignment) => assignment.professor === professorCode)
  }

  const uniqueDepartments = [...new Set(professors.map((prof) => prof.department))].filter(Boolean)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-orange-700">Cargando profesores...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="border-orange-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-orange-900 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Profesores ({filteredProfessors.length} de {professors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Buscar por código, departamento o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm border-orange-200 focus:border-orange-500"
            />
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="max-w-sm border-orange-200">
                <SelectValue placeholder="Filtrar por departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los departamentos</SelectItem>
                {uniqueDepartments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de profesores */}
      <Card className="border-orange-200 bg-white shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-orange-50">
                <TableHead className="text-orange-900">Código</TableHead>
                <TableHead className="text-orange-900">Departamento</TableHead>
                <TableHead className="text-orange-900">Email</TableHead>
                <TableHead className="text-orange-900">Carga Semanal</TableHead>
                <TableHead className="text-orange-900">Estado</TableHead>
                <TableHead className="text-orange-900">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfessors.map((professor) => {
                const status = getWorkloadStatus(professor.currentLoad || 0)
                const maxHours = 20
                const percentage = ((professor.currentLoad || 0) / maxHours) * 100

                return (
                  <TableRow key={professor.id} className="hover:bg-orange-50/50">
                    <TableCell className="font-medium text-orange-900">{professor.abrev}</TableCell>
                    <TableCell className="text-gray-700">{professor.department}</TableCell>
                    <TableCell className="text-gray-600 text-sm">{professor.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-orange-900">{professor.currentLoad || 0}h</span>
                        <div className="w-16">
                          <Progress
                            value={percentage}
                            className="h-2"
                            style={{
                              background: percentage > 100 ? "#fee2e2" : "#fed7aa",
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs border-current ${status.textColor}`}>
                        {status.text}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedProfessor(professor)}
                            className="border-orange-200 hover:bg-orange-50"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Carga
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-orange-900">Carga Lectiva - {professor.abrev}</DialogTitle>
                            <DialogDescription>Detalle de asignaciones y carga horaria</DialogDescription>
                          </DialogHeader>
                          <ProfessorWorkloadDetail
                            professor={professor}
                            assignments={getProfessorAssignments(professor.abrev)}
                          />
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function ProfessorWorkloadDetail({ professor, assignments }: { professor: Professor; assignments: Assignment[] }) {
  const status = getWorkloadStatus(professor.currentLoad || 0)
  const maxHours = 20
  const percentage = ((professor.currentLoad || 0) / maxHours) * 100

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Carga Total</p>
                <p className="text-2xl font-bold text-orange-900">{professor.currentLoad || 0}h</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <Badge variant="outline" className={`${status.textColor} border-current`}>
                  {status.text}
                </Badge>
              </div>
              <div className="w-16">
                <Progress value={percentage} className="h-3" />
                <p className="text-xs text-gray-500 mt-1">{Math.round(percentage)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asignaciones */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-lg text-orange-900">Asignaciones ({assignments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {assignments.length > 0 ? (
            <div className="space-y-3">
              {assignments.map((assignment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{assignment.subject}</h4>
                    <p className="text-sm text-gray-600">
                      {assignment.groupCode} - {assignment.level} {assignment.course}
                    </p>
                    <p className="text-xs text-gray-500">
                      Aula: {assignment.classroom} | Turno: {assignment.shift}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-orange-900">{assignment.sessions}h</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No hay asignaciones registradas para este profesor</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
