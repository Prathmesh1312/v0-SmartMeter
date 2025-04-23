export interface Meter {
  id: string
  current: number
  voltage: number
  power: number // Power in kW
  energy: number // Energy in kWh
  powerFactor: number // Power factor (0-1)
  frequency: number // Frequency in Hz
  temperature: number // Temperature in °C
  timestamp: string
  status: "online" | "offline"
}

export interface Alert {
  id: string
  meterId: string
  parameter: string
  value: number
  threshold: number
  timestamp: string
  severity: "low" | "medium" | "high"
  read: boolean
  notified: boolean // Add this property
}

interface HistoricalDataPoint {
  time: string
  current: number
  voltage: number
  power: number
  energy: number
  powerFactor: number
  frequency: number
  temperature: number
}

// Generate random meter data
export function generateMeterData(count: number): Meter[] {
  const meters: Meter[] = []

  for (let i = 1; i <= count; i++) {
    const id = `meter${i.toString().padStart(3, "0")}`
    const current = Math.random() * 80 + 10 // 10-90A
    const voltage = Math.random() * 40 + 200 // 200-240V
    const powerFactor = Math.random() * 0.2 + 0.8 // 0.8-1.0
    const power = (current * voltage * powerFactor) / 1000 // kW
    const energy = Math.random() * 1000 + 500 // 500-1500 kWh
    const frequency = Math.random() * 1 + 49.5 // 49.5-50.5 Hz
    const temperature = Math.random() * 30 + 20 // 20-50°C
    const now = new Date()
    const timestamp = now.toLocaleTimeString()
    const status = Math.random() > 0.1 ? "online" : "offline" // 90% chance of being online

    meters.push({
      id,
      current,
      voltage,
      power,
      energy,
      powerFactor,
      frequency,
      temperature,
      timestamp,
      status,
    })
  }

  return meters
}

// Generate historical data for a specific meter
export function generateHistoricalData(meterId: string, hours: number): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = []
  const now = new Date()

  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    const timeString = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    // Create some realistic patterns with some randomness
    const hourOfDay = time.getHours()
    const baselineCurrent = 30 + Math.sin((hourOfDay / 24) * Math.PI * 2) * 20 // Higher during day
    const baselineVoltage = 220 + Math.cos((hourOfDay / 24) * Math.PI * 2) * 5 // Slight variation

    const current = baselineCurrent + (Math.random() * 10 - 5) // Add some noise
    const voltage = baselineVoltage + (Math.random() * 6 - 3) // Add some noise
    const powerFactor = 0.85 + Math.random() * 0.15
    const power = (current * voltage * powerFactor) / 1000
    const energy = 500 + hourOfDay * 40 + Math.random() * 20 // Increases throughout the day
    const frequency = 50 + (Math.random() * 0.6 - 0.3)
    const temperature = 25 + Math.sin((hourOfDay / 24) * Math.PI * 2) * 10 + (Math.random() * 4 - 2)

    data.push({
      time: timeString,
      current,
      voltage,
      power,
      energy,
      powerFactor,
      frequency,
      temperature,
    })
  }

  return data
}

// Generate alerts based on meter data
export function generateAlerts(meters: Meter[]): Alert[] {
  const alerts: Alert[] = []
  const now = new Date()

  // Define thresholds
  const thresholds = {
    current: { high: 80, medium: 70 },
    voltage: { high: 240, medium: 235, low: 205 },
    temperature: { high: 45, medium: 40 },
    frequency: { high: 50.5, low: 49.5 },
    powerFactor: { low: 0.85 },
  }

  meters.forEach((meter) => {
    // Check current
    if (meter.current > thresholds.current.high) {
      alerts.push({
        id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        meterId: meter.id,
        parameter: "current",
        value: meter.current,
        threshold: thresholds.current.high,
        timestamp: now.toLocaleTimeString(),
        severity: "high",
        read: false,
        notified: false,
      })
    } else if (meter.current > thresholds.current.medium) {
      alerts.push({
        id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        meterId: meter.id,
        parameter: "current",
        value: meter.current,
        threshold: thresholds.current.medium,
        timestamp: now.toLocaleTimeString(),
        severity: "medium",
        read: false,
        notified: false,
      })
    }

    // Check voltage
    if (meter.voltage > thresholds.voltage.high) {
      alerts.push({
        id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        meterId: meter.id,
        parameter: "voltage",
        value: meter.voltage,
        threshold: thresholds.voltage.high,
        timestamp: now.toLocaleTimeString(),
        severity: "high",
        read: false,
        notified: false,
      })
    } else if (meter.voltage < thresholds.voltage.low) {
      alerts.push({
        id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        meterId: meter.id,
        parameter: "voltage",
        value: meter.voltage,
        threshold: thresholds.voltage.low,
        timestamp: now.toLocaleTimeString(),
        severity: "medium",
        read: false,
        notified: false,
      })
    }

    // Check temperature
    if (meter.temperature > thresholds.temperature.high) {
      alerts.push({
        id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        meterId: meter.id,
        parameter: "temperature",
        value: meter.temperature,
        threshold: thresholds.temperature.high,
        timestamp: now.toLocaleTimeString(),
        severity: "high",
        read: false,
        notified: false,
      })
    }

    // Check frequency
    if (meter.frequency > thresholds.frequency.high || meter.frequency < thresholds.frequency.low) {
      alerts.push({
        id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        meterId: meter.id,
        parameter: "frequency",
        value: meter.frequency,
        threshold: meter.frequency > thresholds.frequency.high ? thresholds.frequency.high : thresholds.frequency.low,
        timestamp: now.toLocaleTimeString(),
        severity: "medium",
        read: false,
        notified: false,
      })
    }

    // Check power factor
    if (meter.powerFactor < thresholds.powerFactor.low) {
      alerts.push({
        id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        meterId: meter.id,
        parameter: "powerFactor",
        value: meter.powerFactor,
        threshold: thresholds.powerFactor.low,
        timestamp: now.toLocaleTimeString(),
        severity: "low",
        read: false,
        notified: false,
      })
    }
  })

  return alerts
}

// Update meter data to simulate real-time changes
export function updateMeterData(meters: Meter[]): Meter[] {
  return meters.map((meter) => {
    // Only update if meter is online
    if (meter.status === "online") {
      // Small random changes to simulate real-time updates
      const currentChange = Math.random() * 6 - 3 // -3 to +3
      const voltageChange = Math.random() * 2 - 1 // -1 to +1
      const powerFactorChange = Math.random() * 0.04 - 0.02 // -0.02 to +0.02
      const frequencyChange = Math.random() * 0.2 - 0.1 // -0.1 to +0.1
      const temperatureChange = Math.random() * 1 - 0.5 // -0.5 to +0.5

      const current = Math.max(5, Math.min(100, meter.current + currentChange))
      const voltage = Math.max(190, Math.min(250, meter.voltage + voltageChange))
      const powerFactor = Math.max(0.7, Math.min(1, meter.powerFactor + powerFactorChange))
      const power = (current * voltage * powerFactor) / 1000
      const energy = meter.energy + power / 60 // Increment energy based on power (assuming 1 minute)
      const frequency = Math.max(49, Math.min(51, meter.frequency + frequencyChange))
      const temperature = Math.max(15, Math.min(60, meter.temperature + temperatureChange))

      return {
        ...meter,
        current,
        voltage,
        power,
        energy,
        powerFactor,
        frequency,
        temperature,
        timestamp: new Date().toLocaleTimeString(),
      }
    }
    return meter
  })
}

// Export data to CSV
export function exportToCSV(data: any[], filename: string): void {
  // Get headers from first object
  const headers = Object.keys(data[0])

  // Convert data to CSV format
  const csvRows = []

  // Add headers
  csvRows.push(headers.join(","))

  // Add rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header]
      // Handle strings with commas by wrapping in quotes
      return typeof value === "string" && value.includes(",") ? `"${value}"` : value
    })
    csvRows.push(values.join(","))
  }

  // Combine into a single string
  const csvString = csvRows.join("\n")

  // Create a blob and download
  const blob = new Blob([csvString], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.setAttribute("hidden", "")
  a.setAttribute("href", url)
  a.setAttribute("download", filename)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
