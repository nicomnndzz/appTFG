"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { UpcomingDates } from "@/components/upcoming-dates"
import { Calendar } from "@/components/calendar"

// Importar los componentes reorganizados
import { ProfessorsTable } from "@/components/professors-table"
import { SubjectsTable } from "@/components/subjects-table"
import { ModulesTable } from "@/components/modules-table"
import { DepartmentsList } from "@/components/departments-list"

interface Professor {
  id: string
  abrev: string
  maxHours: number
  minHours: number
  department: string
  email: string
  currentLoad: number
}

interface Classroom {
  id: string
  abrev: string
  name: string
  maxStudents: number
  building: string
  occupancy: number
}

interface Department {
  id: string
  name: string
  professorCount: number
  totalHours: number
}

export default function TeacherWorkloadBalancer() {
  const [activeTab, setActiveTab] = useState("inicio")
  const [professors, setProfessors] = useState<Professor[]>([])
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string | undefined>(undefined)
  const [groupCodeFilter, setGroupCodeFilter] = useState<string | undefined>(undefined)

  const [stats, setStats] = useState({
    departamentos: 0,
    ciclosFormativos: 15,
    modulosAsignados: 4,
    totalProfesores: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Importar las funciones de carga de datos
      const { loadProfessorsData, loadAssignmentsData } = await import("@/scripts/load-csv-data")

      const [professorsData, assignmentsData] = await Promise.all([loadProfessorsData(), loadAssignmentsData()])

      // Función para normalizar departamento basado en abreviatura
      const normalizeDepartment = (professorAbrev: string): string => {
        if (!professorAbrev) return "Inglés"
        const cleanAbrev = professorAbrev.trim().toUpperCase()

        if (cleanAbrev.startsWith("AE") || cleanAbrev.startsWith("PGA")) return "Administración y gestión"
        if (cleanAbrev.startsWith("AQI")) return "Química"
        if (cleanAbrev.startsWith("EF")) return "Actividades físicas y deportivas"
        if (
          cleanAbrev.startsWith("FO") ||
          cleanAbrev.startsWith("ETF") ||
          cleanAbrev.startsWith("ESP") ||
          cleanAbrev.startsWith("SAI") ||
          cleanAbrev.startsWith("PPM") ||
          cleanAbrev.startsWith("OSE") ||
          cleanAbrev.startsWith("ORI") ||
          cleanAbrev.startsWith("PSA")
        )
          return "FOL"
        if (cleanAbrev.startsWith("FIC") || cleanAbrev.startsWith("INF") || cleanAbrev.startsWith("SEA"))
          return "Informática y comunicaciones"
        if (
          cleanAbrev.startsWith("IE") ||
          cleanAbrev.startsWith("MAT") ||
          cleanAbrev.startsWith("MV") ||
          cleanAbrev.startsWith("SOL")
        )
          return "Instalación y mantenimiento"
        if (cleanAbrev.startsWith("MM") || cleanAbrev.startsWith("OF")) return "Fabricación mecánica"
        if (cleanAbrev.startsWith("OGC") || cleanAbrev.startsWith("PC")) return "Comercio y marketing"
        if (cleanAbrev.startsWith("ING")) return "Inglés"

        return "Inglés"
      }

      // Calcular carga actual para cada profesor
      const professorsWithLoad = professorsData.map((prof) => {
        const profAssignments = assignmentsData.filter((assignment) => assignment.professor === prof.abrev)
        const currentLoad = profAssignments.reduce((total, assignment) => total + assignment.sessions, 0)

        return {
          ...prof,
          department: normalizeDepartment(prof.abrev),
          currentLoad,
        }
      })

      setProfessors(professorsWithLoad)
      setLoading(false)
    } catch (error) {
      console.error("Error loading data:", error)
      setLoading(false)
    }
  }

  const getWorkloadStatus = (currentLoad: number, maxHours: number, minHours: number) => {
    const percentage = (currentLoad / maxHours) * 100
    if (currentLoad > maxHours) return { status: "overloaded", color: "bg-red-500", text: "Sobrecargado" }
    if (currentLoad < minHours) return { status: "underloaded", color: "bg-yellow-500", text: "Subcargado" }
    if (percentage > 90) return { status: "near-limit", color: "bg-orange-500", text: "Cerca del límite" }
    return { status: "balanced", color: "bg-green-500", text: "Balanceado" }
  }

  const filteredProfessors = professors.filter(
    (prof) =>
      prof.abrev.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const workloadData = professors.map((prof) => ({
    name: prof.abrev,
    current: prof.currentLoad,
    max: prof.maxHours,
    min: prof.minHours,
    percentage: (prof.currentLoad / prof.maxHours) * 100,
  }))

  const occupancyData = classrooms.map((room) => ({
    name: room.abrev,
    occupancy: room.occupancy,
    capacity: room.maxStudents,
  }))

  const COLORS = ["#ff6b35", "#f7931e", "#ffb347", "#ffd700", "#ff8c42"]

  const handleDepartmentClick = (department: string) => {
    setDepartmentFilter(department)
    setActiveTab("modulos")
  }

  const handleModuleSelect = (groupCode: string) => {
    console.log("Seleccionado código de grupo:", groupCode) // Para debug
    setGroupCodeFilter(groupCode)
    setActiveTab("asignaturas")
  }

  const handleTabChange = (tab: string) => {
    if (tab !== "modulos") {
      setDepartmentFilter(undefined)
    }
    if (tab !== "asignaturas") {
      setGroupCodeFilter(undefined)
    }
    setActiveTab(tab)
  }

  const renderContent = () => {
    switch (activeTab) {
      case "inicio":
        return (
          <div className="space-y-8">
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <h2 className="text-2xl font-bold text-orange-900 mb-2">Inicio</h2>
              <p className="text-orange-700">
                Bienvenido al sistema de balanceo de carga lectiva para el profesorado de FP.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UpcomingDates />
              <Calendar />
            </div>
          </div>
        )

      case "departamentos":
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <h2 className="text-2xl font-bold text-orange-900 mb-2">Departamentos</h2>
              <p className="text-orange-700">Gestión y análisis de departamentos del centro.</p>
            </div>
            <DepartmentsList onDepartmentClick={handleDepartmentClick} professorsData={professors} />
          </div>
        )

      case "modulos":
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <h2 className="text-2xl font-bold text-orange-900 mb-2">Módulos</h2>
              <p className="text-orange-700">Gestión de grupos y módulos formativos.</p>
            </div>
            <ModulesTable initialDepartmentFilter={departmentFilter} onModuleSelect={handleModuleSelect} />
          </div>
        )

      case "asignaturas":
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <h2 className="text-2xl font-bold text-orange-900 mb-2">Asignaturas</h2>
              <p className="text-orange-700">Gestión de asignaturas y ciclos formativos por departamento.</p>
            </div>
            <SubjectsTable initialGroupCodeFilter={groupCodeFilter} />
          </div>
        )

      case "profesorado":
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <h2 className="text-2xl font-bold text-orange-900 mb-2">Profesorado</h2>
              <p className="text-orange-700">Gestión de carga lectiva del profesorado.</p>
            </div>
            <ProfessorsTable />
          </div>
        )

      default:
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <h2 className="text-2xl font-bold text-orange-900 mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
              <p className="text-orange-700">Sección en desarrollo.</p>
            </div>
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-orange-700">Cargando sistema...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="container mx-auto px-6 py-8">{renderContent()}</main>
    </div>
  )
}
