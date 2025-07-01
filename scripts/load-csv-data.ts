// Script para cargar y procesar los datos de los CSV
export async function loadProfessorsData() {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Prof-u2Cy6S5JiuEdbOlEJMBttTLOvIzj1H.csv",
    )
    const csvText = await response.text()

    const lines = csvText.split("\n").filter((line) => line.trim())
    const professors = []

    for (let i = 1; i < lines.length; i++) {
      // Skip header
      const line = lines[i]
      const parts = line.split(";")

      if (parts.length >= 11) {
        professors.push({
          id: parts[1]?.trim() || "",
          abrev: parts[2]?.trim() || "",
          maxHours: Number.parseInt(parts[3]?.trim()) || 0,
          minHours: Number.parseInt(parts[4]?.trim()) || 0,
          department: parts[5]?.trim() || "",
          email: parts[8]?.trim() || "",
        })
      }
    }

    return professors
  } catch (error) {
    console.error("Error loading professors data:", error)
    return []
  }
}

export async function loadSubjectsData() {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NomAsg-gApKoi7sxeisAl7l1EErg4IfSpR9lm.csv",
    )
    const csvText = await response.text()

    const lines = csvText.split("\n").filter((line) => line.trim())
    const subjects = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      const parts = line.split(";")

      if (parts.length >= 4) {
        subjects.push({
          id: parts[0]?.trim() || "",
          code: parts[1]?.trim() || "",
          name: parts[2]?.trim() || "", // Esta es la columna NOMBRE
          department: parts[3]?.trim() || "",
        })
      }
    }

    return subjects
  } catch (error) {
    console.error("Error loading subjects data:", error)
    return []
  }
}

export async function loadAssignmentsData() {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/soluc-Vbl2sNFTD6tGNDBsLZ2YRG1MdEkQR3.csv",
    )
    const csvText = await response.text()

    const lines = csvText.split("\n").filter((line) => line.trim())
    const assignments = []

    for (let i = 1; i < lines.length; i++) {
      // Skip header
      const line = lines[i]
      const parts = line.split(";")

      if (parts.length >= 15) {
        assignments.push({
          subject: parts[0]?.trim() || "",
          professor: parts[1]?.trim() || "",
          groupCode: parts[2]?.trim() || "",
          shift: parts[3]?.trim() || "",
          level: parts[4]?.trim() || "",
          course: parts[5]?.trim() || "",
          group: parts[6]?.trim() || "",
          classroom: parts[7]?.trim() || "",
          task: parts[8]?.trim() || "",
          day: Number.parseInt(parts[9]?.trim()) || 0,
          hour: Number.parseInt(parts[10]?.trim()) || 0,
          sessions: Number.parseInt(parts[11]?.trim()) || 0,
          frame: parts[12]?.trim() || "",
          concert: parts[13]?.trim() || "",
          students: Number.parseInt(parts[14]?.trim()) || 0,
        })
      }
    }

    return assignments
  } catch (error) {
    console.error("Error loading assignments data:", error)
    return []
  }
}
