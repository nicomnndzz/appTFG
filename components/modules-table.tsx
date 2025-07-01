"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Users, Building2 } from "lucide-react"

interface Module {
  group: string
  course: string
  shift: string
  description: string
  tutor: string
  maxStudents: number
  department: string
}

interface ModulesTableProps {
  initialDepartmentFilter?: string
  onModuleSelect?: (groupCode: string) => void
}

// Listado oficial de departamentos según la imagen proporcionada
const OFFICIAL_DEPARTMENTS = [
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

// Función para estandarizar el nombre del departamento
const standardizeDepartmentName = (department: string): string => {
  return department.trim()
}

export function ModulesTable({ initialDepartmentFilter, onModuleSelect }: ModulesTableProps) {
  const [modules, setModules] = useState<Module[]>([])
  const [filteredModules, setFilteredModules] = useState<Module[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState(initialDepartmentFilter || "all")
  const [selectedShift, setSelectedShift] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (initialDepartmentFilter) {
      setSelectedDepartment(initialDepartmentFilter)
    }
  }, [initialDepartmentFilter])

  useEffect(() => {
    filterModules()
  }, [modules, searchTerm, selectedDepartment, selectedShift])

  const loadData = async () => {
    try {
      // Cargar datos de grupos
      const grupResponse = await fetch(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Grup-55QWRVPkG92YWA8L35lux2ox17SbME.csv",
      )
      const grupCsvText = await grupResponse.text()

      // Cargar datos de profesores para obtener departamentos
      const profResponse = await fetch(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Prof-u2Cy6S5JiuEdbOlEJMBttTLOvIzj1H.csv",
      )
      const profCsvText = await profResponse.text()

      // Procesar profesores para crear mapa de tutor -> departamento
      const profLines = profCsvText.split("\n").filter((line) => line.trim())
      const tutorDepartmentMap = new Map()

      for (let i = 1; i < profLines.length; i++) {
        const line = profLines[i]
        const parts = line.split(";")
        if (parts.length >= 6) {
          const abrev = parts[2]?.trim() || ""
          const department = parts[5]?.trim() || ""
          if (abrev && department) {
            tutorDepartmentMap.set(abrev, standardizeDepartmentName(department))
          }
        }
      }

      // Procesar grupos
      const grupLines = grupCsvText.split("\n").filter((line) => line.trim())
      const modulesData = []

      for (let i = 1; i < grupLines.length; i++) {
        const line = grupLines[i]
        const parts = line.split(";")

        if (parts.length >= 14) {
          const tutor = parts[9]?.trim() || ""
          const groupCode = parts[2]?.trim() || ""

          modulesData.push({
            group: formatTextUTF8(groupCode), // ABREV - código del grupo
            course: formatCourseNumber(parts[5]?.trim() || ""), // CURSO solo número
            shift: parts[3]?.trim() || "", // TURNO
            description: formatDescription(parts[8]?.trim() || ""), // DESCRIP con mayúscula inicial
            tutor: formatTextUTF8(parts[9]?.trim() || ""), // TUTOR
            maxStudents: Number.parseInt(parts[7]?.trim()) || 0, // MAXALUM
            department: assignDepartmentByGroupCode(groupCode), // Departamento por prefijo del código de grupo
          })
        }
      }

      // Filtrar valores únicos por grupo
      const uniqueModules = modulesData.filter(
        (module, index, self) => index === self.findIndex((m) => m.group === module.group),
      )

      setModules(uniqueModules)
      setLoading(false)
    } catch (error) {
      console.error("Error loading modules data:", error)
      setLoading(false)
    }
  }

  // Función para asignar departamento basado en el prefijo del código de grupo
  const assignDepartmentByGroupCode = (groupCode: string): string => {
    if (!groupCode) return "Sin asignar"

    // Extraer solo las letras del código, ignorando números
    const lettersOnly = groupCode
      .replace(/[^A-Za-z]/g, "")
      .toUpperCase()
      .trim()

    // Asignación por prefijo según las reglas especificadas
    if (lettersOnly.startsWith("AFD")) return "Actividades físicas y deportivas"
    if (lettersOnly.startsWith("ADG")) return "Administración y gestión"
    if (lettersOnly.startsWith("COM") || lettersOnly.startsWith("VCOM")) return "Comercio y marketing"
    if (lettersOnly.startsWith("FME")) return "Fabricación mecánica"
    if (lettersOnly.startsWith("IFC") || lettersOnly.startsWith("VIFC")) return "Informática y comunicaciones"
    if (lettersOnly.startsWith("IMA") || lettersOnly.startsWith("MSP")) return "Instalación y mantenimiento"
    if (lettersOnly.startsWith("MAM")) return "Madera, mueble y corcho"
    if (lettersOnly.startsWith("QUI")) return "Química"
    if (lettersOnly.startsWith("DMSP")) return "FOL"

    // Cualquier otro código corresponde a Inglés
    return "Inglés"
  }

  // Función mejorada para formatear texto con codificación UTF-8
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

  // Función para formatear curso solo con números 1 o 2
  const formatCourseNumber = (course: string): string => {
    if (!course) return ""

    const cleanCourse = formatTextUTF8(course.toLowerCase())

    // Extraer solo el número del curso
    if (cleanCourse.includes("1") || cleanCourse.includes("primer") || cleanCourse.includes("1º")) return "1"
    if (cleanCourse.includes("2") || cleanCourse.includes("segundo") || cleanCourse.includes("2º")) return "2"

    return ""
  }

  // Función para formatear descripción con mayúscula inicial
  const formatDescription = (description: string): string => {
    if (!description) return ""

    let cleanDescription = formatTextUTF8(description)

    // Buscar la primera letra del alfabeto (incluyendo acentos y ñ)
    const match = cleanDescription.match(/[a-záéíóúñüA-ZÁÉÍÓÚÑÜ]/i)
    if (match) {
      const firstLetterIndex = cleanDescription.indexOf(match[0])
      // Tomar solo desde la primera letra encontrada
      cleanDescription = cleanDescription.substring(firstLetterIndex)

      // Capitalizar la primera letra
      if (cleanDescription.length > 0) {
        cleanDescription = cleanDescription.charAt(0).toUpperCase() + cleanDescription.slice(1)
      }
    }

    return cleanDescription.trim()
  }

  const filterModules = () => {
    let filtered = modules

    if (selectedDepartment !== "all") {
      filtered = filtered.filter((module) => module.department === selectedDepartment)
    }

    if (selectedShift !== "all") {
      filtered = filtered.filter((module) => module.shift === selectedShift)
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (module) =>
          module.group.toLowerCase().includes(searchLower) ||
          module.description.toLowerCase().includes(searchLower) ||
          module.department.toLowerCase().includes(searchLower),
      )
    }

    setFilteredModules(filtered)
  }

  // Solo mostrar departamentos oficiales que tienen módulos
  const availableDepartments = OFFICIAL_DEPARTMENTS.filter((dept) =>
    modules.some((module) => module.department === dept),
  )

  const uniqueShifts = [...new Set(modules.map((module) => module.shift))].filter(Boolean).sort()

  const getShiftLabel = (shift: string) => {
    const shiftLabels: { [key: string]: string } = {
      M: "Mañana",
      T: "Tarde",
      V: "Vespertino",
      N: "Nocturno",
    }
    return shiftLabels[shift] || shift
  }

  const getShiftColor = (shift: string) => {
    const shiftColors: { [key: string]: string } = {
      M: "bg-blue-100 text-blue-800 border-blue-200",
      T: "bg-green-100 text-green-800 border-green-200",
      V: "bg-purple-100 text-purple-800 border-purple-200",
      N: "bg-gray-100 text-gray-800 border-gray-200",
    }
    return shiftColors[shift] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const handleModuleClick = (groupCode: string) => {
    if (onModuleSelect) {
      onModuleSelect(groupCode)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-orange-700">Cargando módulos...</p>
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
            <BookOpen className="h-5 w-5 mr-2" />
            Módulos/Grupos ({filteredModules.length} de {modules.length})
            {initialDepartmentFilter && (
              <span className="ml-2 text-sm font-normal text-orange-700">
                - Filtrado por: {initialDepartmentFilter}
              </span>
            )}
            <span className="ml-auto text-xs text-gray-500 font-normal">
              Haz clic en un módulo para ver sus asignaturas
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Buscar por grupo, descripción o departamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm border-orange-200 focus:border-orange-500 focus:ring-orange-500"
            />
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="max-w-sm border-orange-200 focus:border-orange-500 focus:ring-orange-500">
                <SelectValue placeholder="Filtrar por departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los departamentos</SelectItem>
                {availableDepartments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedShift} onValueChange={setSelectedShift}>
              <SelectTrigger className="max-w-sm border-orange-200 focus:border-orange-500 focus:ring-orange-500">
                <SelectValue placeholder="Filtrar por turno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los turnos</SelectItem>
                {uniqueShifts.map((shift) => (
                  <SelectItem key={shift} value={shift}>
                    {getShiftLabel(shift)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de módulos */}
      <Card className="border-orange-200 bg-white shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-orange-50 border-b border-orange-200">
                <TableHead className="text-orange-900 font-semibold">Código Grupo</TableHead>
                <TableHead className="text-orange-900 font-semibold">Descripción</TableHead>
                <TableHead className="text-orange-900 font-semibold">Curso</TableHead>
                <TableHead className="text-orange-900 font-semibold">Turno</TableHead>
                <TableHead className="text-orange-900 font-semibold">Departamento</TableHead>
                <TableHead className="text-orange-900 font-semibold">Max. Alumnos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModules.map((module, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-orange-50/50 border-b border-orange-100 cursor-pointer hover:shadow-sm transition-shadow"
                  onClick={() => handleModuleClick(module.group)}
                >
                  <TableCell className="font-medium text-orange-900">{module.group}</TableCell>
                  <TableCell className="text-gray-900 max-w-xs">
                    <div className="truncate" title={module.description}>
                      {module.description}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700 font-bold text-center">
                    {module.course && (
                      <span className="bg-orange-100 text-orange-900 px-2 py-1 rounded-full text-sm font-bold">
                        {module.course}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getShiftColor(module.shift)}`}
                    >
                      {getShiftLabel(module.shift)}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-700">{module.department}</TableCell>
                  <TableCell className="text-gray-700">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-orange-600" />
                      <span className="font-medium">{module.maxStudents}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredModules.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No se encontraron módulos</p>
              <p className="text-sm">Prueba ajustando los filtros de búsqueda</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas por departamento */}
      <Card className="border-orange-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-orange-900 flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Distribución por Departamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableDepartments.map((dept, index) => {
              const deptModules = modules.filter((module) => module.department === dept)
              const totalStudents = deptModules.reduce((sum, module) => sum + module.maxStudents, 0)

              return (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200 hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold text-gray-900 text-sm mb-3 flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-orange-600" />
                    <span className="truncate" title={dept}>
                      {dept}
                    </span>
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Módulos:</span>
                      <span className="font-bold text-orange-900 bg-white px-2 py-1 rounded text-sm">
                        {deptModules.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Total alumnos:</span>
                      <span className="font-bold text-orange-900 bg-white px-2 py-1 rounded text-sm">
                        {totalStudents}
                      </span>
                    </div>
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
