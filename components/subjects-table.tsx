"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, BookOpen } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Subject {
  nomasig: string // Nombre de la asignatura
  asig: string // Código de la asignatura
  grup: string // Código del grupo
  prof: string // Código del profesor
  turno: string // Turno
  nivel: string // Nivel
  curso: string // Curso
  grupo: string // Grupo
  aula: string // Aula
  tarea: string // Tarea
  dia: string // Día
  hora: string // Hora
  sesiones: string // Sesiones
  marco: string // Marco
  concierto: string // Concierto
  alumnos: string // Número de alumnos
  department: string // Departamento calculado
}

interface SubjectsTableProps {
  initialGroupCodeFilter?: string
}

export function SubjectsTable({ initialGroupCodeFilter }: SubjectsTableProps) {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedGroupCode, setSelectedGroupCode] = useState(initialGroupCodeFilter || "all")
  const [selectedTurno, setSelectedTurno] = useState("all")
  const [loading, setLoading] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (initialGroupCodeFilter) {
      setSelectedGroupCode(initialGroupCodeFilter)
    }
  }, [initialGroupCodeFilter])

  useEffect(() => {
    filterSubjects()
  }, [subjects, searchTerm, selectedDepartment, selectedGroupCode, selectedTurno])

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

  const loadData = async () => {
    try {
      // Cargar datos de asignaturas desde el nuevo Asig.csv
      const asigResponse = await fetch(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Asig-BxsXirl84jd5UQ052WLS1VNmtnCcW9.csv",
      )
      const asigCsvText = await asigResponse.text()

      // Procesar asignaturas
      const asigLines = asigCsvText.split("\n").filter((line) => line.trim())
      const subjectsData = []

      // Procesar desde la línea 1 (saltando header en línea 0)
      for (let i = 1; i < asigLines.length; i++) {
        const line = asigLines[i]
        const parts = line.split(";")

        if (parts.length >= 16) {
          const nomasig = parts[0]?.trim() || "" // NOMASIG - Nombre de la asignatura
          const asig = parts[1]?.trim() || "" // ASIG - Código de la asignatura
          const grup = parts[2]?.trim() || "" // GRUP - Código del grupo
          const prof = parts[3]?.trim() || "" // PROF - Código del profesor
          const turno = parts[4]?.trim() || "" // TURNO
          const nivel = parts[5]?.trim() || "" // NIVEL
          const curso = parts[6]?.trim() || "" // CURSO
          const grupo = parts[7]?.trim() || "" // GRUPO
          const aula = parts[8]?.trim() || "" // AULA
          const tarea = parts[9]?.trim() || "" // TAREA
          const dia = parts[10]?.trim() || "" // DIA
          const hora = parts[11]?.trim() || "" // HORA
          const sesiones = parts[12]?.trim() || "" // SESIONES
          const marco = parts[13]?.trim() || "" // MARCO
          const concierto = parts[14]?.trim() || "" // CONCIERTO
          const alumnos = parts[15]?.trim() || "" // ALUMNOS

          if (nomasig && asig && grup) {
            subjectsData.push({
              nomasig,
              asig,
              grup,
              prof,
              turno,
              nivel,
              curso,
              grupo,
              aula,
              tarea,
              dia,
              hora,
              sesiones,
              marco,
              concierto,
              alumnos,
              department: assignDepartmentByGroupCode(grup), // Usar el código del grupo para asignar departamento
            })
          }
        }
      }

      console.log(`Cargadas ${subjectsData.length} asignaturas desde Asig.csv`)
      setSubjects(subjectsData)
      setLoading(false)
    } catch (error) {
      console.error("Error loading subjects data:", error)
      setLoading(false)
    }
  }

  const filterSubjects = () => {
    let filtered = subjects

    if (selectedDepartment !== "all") {
      filtered = filtered.filter((subject) => subject.department === selectedDepartment)
    }

    if (selectedGroupCode !== "all") {
      // Filtrar por el código de grupo exacto (campo grup)
      filtered = filtered.filter((subject) => subject.grup === selectedGroupCode)
    }

    if (selectedTurno !== "all") {
      filtered = filtered.filter((subject) => subject.turno === selectedTurno)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (subject) =>
          subject.nomasig.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subject.asig.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subject.grup.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subject.prof.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subject.department.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredSubjects(filtered)
  }

  const uniqueDepartments = [...new Set(subjects.map((subject) => subject.department))].filter(Boolean).sort()
  const uniqueGroupCodes = [...new Set(subjects.map((subject) => subject.grup))].filter(Boolean).sort()
  const uniqueTurnos = [...new Set(subjects.map((subject) => subject.turno))].filter(Boolean).sort()

  const getTurnoColor = (turno: string) => {
    const turnoColors: { [key: string]: string } = {
      M: "bg-blue-100 text-blue-800 border-blue-200",
      T: "bg-green-100 text-green-800 border-green-200",
      V: "bg-purple-100 text-purple-800 border-purple-200",
      N: "bg-gray-100 text-gray-800 border-gray-200",
    }
    return turnoColors[turno] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getTurnoLabel = (turno: string) => {
    const turnoLabels: { [key: string]: string } = {
      M: "Mañana",
      T: "Tarde",
      V: "Vespertino",
      N: "Nocturno",
    }
    return turnoLabels[turno] || turno
  }

  const handleRowClick = (subject: Subject) => {
    setSelectedSubject(subject)
    setShowDialog(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-orange-700">Cargando asignaturas...</p>
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
            <GraduationCap className="h-5 w-5 mr-2" />
            Asignaturas ({filteredSubjects.length} de {subjects.length})
            {initialGroupCodeFilter && (
              <span className="ml-2 text-sm font-normal text-orange-700">
                - Filtrado por código grupo: {initialGroupCodeFilter}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Buscar asignaturas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-orange-200 focus:border-orange-500"
            />
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="border-orange-200">
                <SelectValue placeholder="Departamento" />
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
            <Select value={selectedGroupCode} onValueChange={setSelectedGroupCode}>
              <SelectTrigger className="border-orange-200">
                <SelectValue placeholder="Código grupo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los códigos</SelectItem>
                {uniqueGroupCodes.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTurno} onValueChange={setSelectedTurno}>
              <SelectTrigger className="border-orange-200">
                <SelectValue placeholder="Turno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los turnos</SelectItem>
                {uniqueTurnos.map((turno) => (
                  <SelectItem key={turno} value={turno}>
                    {getTurnoLabel(turno)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de asignaturas */}
      <Card className="border-orange-200 bg-white shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-orange-50">
                  <TableHead className="text-orange-900">Asignatura</TableHead>
                  <TableHead className="text-orange-900">Código Grupo</TableHead>
                  <TableHead className="text-orange-900">Abreviatura</TableHead>
                  <TableHead className="text-orange-900">Departamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubjects.map((subject, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-orange-50/50 cursor-pointer"
                    onClick={() => handleRowClick(subject)}
                  >
                    <TableCell className="font-medium text-orange-700">{subject.prof}</TableCell>
                    <TableCell className="text-gray-700">{subject.turno}</TableCell>
                    <TableCell className="text-gray-700">{subject.grup}</TableCell>
                    <TableCell className="text-gray-700 text-sm">{subject.department}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredSubjects.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No se encontraron asignaturas</p>
              <p className="text-sm">Prueba ajustando los filtros de búsqueda</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detalles de la Asignatura</DialogTitle>
            <DialogDescription>Información completa de la asignatura seleccionada.</DialogDescription>
          </DialogHeader>
          {selectedSubject && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="nhoras" className="text-right text-gray-700">
                  NHORAS:
                </label>
                <div className="col-span-3 font-medium">{selectedSubject.sesiones}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="aulan" className="text-right text-gray-700">
                  AULAN:
                </label>
                <div className="col-span-3 font-medium">{selectedSubject.aula}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="profn" className="text-right text-gray-700">
                  PROFN:
                </label>
                <div className="col-span-3 font-medium">{selectedSubject.prof}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="grupn" className="text-right text-gray-700">
                  GRUPN:
                </label>
                <div className="col-span-3 font-medium">{selectedSubject.grup}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="nomasig" className="text-right text-gray-700">
                  Nombre Asignatura:
                </label>
                <div className="col-span-3 font-medium">{selectedSubject.nomasig}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="asig" className="text-right text-gray-700">
                  Código Asignatura:
                </label>
                <div className="col-span-3 font-medium">{selectedSubject.asig}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="turno" className="text-right text-gray-700">
                  Turno:
                </label>
                <div className="col-span-3 font-medium">{selectedSubject.turno}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="nivel" className="text-right text-gray-700">
                  Nivel:
                </label>
                <div className="col-span-3 font-medium">{selectedSubject.nivel}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="curso" className="text-right text-gray-700">
                  Curso:
                </label>
                <div className="col-span-3 font-medium">{selectedSubject.curso}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="grupo" className="text-right text-gray-700">
                  Grupo:
                </label>
                <div className="col-span-3 font-medium">{selectedSubject.grupo}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="tarea" className="text-right text-gray-700">
                  Tarea:
                </label>
                <div className="col-span-3 font-medium">{selectedSubject.tarea}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="dia" className="text-right text-gray-700">
                  Día:
                </label>
                <div className="col-span-3 font-medium">{selectedSubject.dia}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="hora" className="text-right text-gray-700">
                  Hora:
                </label>
                <div className="col-span-3 font-medium">{selectedSubject.hora}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="marco" className="text-right text-gray-700">
                  Marco:
                </label>
                <div className="col-span-3 font-medium">{selectedSubject.marco}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="concierto" className="text-right text-gray-700">
                  Concierto:
                </label>
                <div className="col-span-3 font-medium">{selectedSubject.concierto}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="alumnos" className="text-right text-gray-700">
                  Alumnos:
                </label>
                <div className="col-span-3 font-medium">{selectedSubject.alumnos}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
