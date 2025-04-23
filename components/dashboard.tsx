"use client"

import { useState, useEffect, useCallback } from "react"
import { Activity, BarChart3, Bell, Download, Gauge, Home, Menu, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import MeterOverview from "@/components/meter-overview"
import MeterDetail from "@/components/meter-detail"
import AlertPanel from "@/components/alert-panel"
import {
  generateMeterData,
  updateMeterData,
  generateAlerts,
  exportToCSV,
  type Meter,
  type Alert,
} from "@/lib/data-generator"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter,
  SidebarMenuBadge,
} from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"

// Generate initial mock data for multiple meters
const initialMeterData = generateMeterData(8)

export default function Dashboard() {
  const [meterData, setMeterData] = useState<Meter[]>(initialMeterData)
  const [selectedMeter, setSelectedMeter] = useState<string | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [showAlerts, setShowAlerts] = useState(false)
  const [activeView, setActiveView] = useState("overview")
  const { toast } = useToast()

  // Function to update meter data in real-time
  const updateData = useCallback(() => {
    setMeterData((prevData) => {
      const updatedData = updateMeterData(prevData)

      // Generate new alerts based on updated data
      const newAlerts = generateAlerts(updatedData)

      // If there are new alerts, add them to the state
      if (newAlerts.length > 0) {
        // Add new alerts to the existing alerts
        setAlerts((prev) => [...newAlerts, ...prev].slice(0, 100)) // Keep only the latest 100 alerts
      }

      return updatedData
    })
  }, [])

  // Use a separate effect to handle toast notifications when alerts change
  useEffect(() => {
    // Find alerts that haven't been notified yet
    const unnotifiedAlerts = alerts.filter((alert) => !alert.notified)

    // Only show toast for the most recent unnotified alerts (up to 3)
    const alertsToNotify = unnotifiedAlerts.slice(0, 3)

    if (alertsToNotify.length > 0) {
      // Mark these alerts as notified
      setAlerts((currentAlerts) =>
        currentAlerts.map((alert) =>
          alertsToNotify.some((a) => a.id === alert.id) ? { ...alert, notified: true } : alert,
        ),
      )

      // Show toast notifications
      alertsToNotify.forEach((alert) => {
        toast({
          title: `${alert.severity.toUpperCase()} Alert: ${alert.meterId}`,
          description: `${alert.parameter}: ${alert.value.toFixed(2)} (Threshold: ${alert.threshold})`,
          variant: alert.severity === "high" ? "destructive" : alert.severity === "medium" ? "default" : "secondary",
        })
      })
    }
  }, [alerts, toast])

  // Set up interval for real-time updates
  useEffect(() => {
    const interval = setInterval(updateData, 10000) // Update every 10 seconds
    return () => clearInterval(interval)
  }, [updateData])

  // Handle export functionality
  const handleExport = () => {
    if (selectedMeter) {
      // Export data for selected meter
      const meterToExport = meterData.find((m) => m.id === selectedMeter)
      if (meterToExport) {
        exportToCSV([meterToExport], `${selectedMeter}_data_${new Date().toISOString().split("T")[0]}.csv`)
      }
    } else {
      // Export all meter data
      exportToCSV(meterData, `all_meters_data_${new Date().toISOString().split("T")[0]}.csv`)
    }

    toast({
      title: "Export Successful",
      description: "Data has been exported to CSV",
    })
  }

  // Count unread alerts
  const unreadAlertCount = alerts.filter((alert) => !alert.read).length

  // Mark all alerts as read
  const markAllAlertsAsRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, read: true })))
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar>
          <SidebarHeader className="flex h-14 items-center border-b px-4">
            <div className="flex items-center gap-2 font-semibold">
              <Gauge className="h-6 w-6" />
              <span>Meter Dashboard</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeView === "overview"}
                  onClick={() => {
                    setActiveView("overview")
                    setSelectedMeter(null)
                    setShowAlerts(false)
                  }}
                >
                  <Home className="h-4 w-4" />
                  <span>Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeView === "alerts"}
                  onClick={() => {
                    setActiveView("alerts")
                    setSelectedMeter(null)
                    setShowAlerts(true)
                  }}
                >
                  <Bell className="h-4 w-4" />
                  <span>Alerts</span>
                </SidebarMenuButton>
                {unreadAlertCount > 0 && <SidebarMenuBadge>{unreadAlertCount}</SidebarMenuBadge>}
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Activity className="h-4 w-4" />
                  <span>Monitoring</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
            <SidebarTrigger />
            <div className="w-full flex-1">
              <h1 className="text-lg font-semibold">Meter Monitoring System</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="relative"
                onClick={() => {
                  setShowAlerts(!showAlerts)
                  setActiveView("alerts")
                }}
              >
                <Bell className="h-4 w-4" />
                {unreadAlertCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {unreadAlertCount > 9 ? "9+" : unreadAlertCount}
                  </span>
                )}
              </Button>
              <Button variant="outline" size="sm">
                <Menu className="mr-2 h-4 w-4" />
                Actions
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4 md:p-6">
            {showAlerts ? (
              <AlertPanel
                alerts={alerts}
                setAlerts={setAlerts}
                onSelectMeter={(meterId) => {
                  setSelectedMeter(meterId)
                  setShowAlerts(false)
                  setActiveView("overview")
                }}
                onMarkAllRead={markAllAlertsAsRead}
              />
            ) : selectedMeter ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Button variant="outline" onClick={() => setSelectedMeter(null)} className="mb-4">
                    Back to Overview
                  </Button>
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export {selectedMeter} Data
                  </Button>
                </div>
                <MeterDetail meter={meterData.find((m) => m.id === selectedMeter)!} />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Meters Overview</h2>
                    <p className="text-muted-foreground">Monitor real-time data from all connected meters.</p>
                  </div>
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export All Data
                  </Button>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {meterData.map((meter) => (
                    <MeterOverview
                      key={meter.id}
                      meter={meter}
                      onClick={() => setSelectedMeter(meter.id)}
                      alerts={alerts.filter((a) => a.meterId === meter.id && !a.read).length}
                    />
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
