"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, ExternalLink } from "lucide-react"
import type { Alert } from "@/lib/data-generator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AlertPanelProps {
  alerts: Alert[]
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>
  onSelectMeter: (meterId: string) => void
  onMarkAllRead: () => void
}

export default function AlertPanel({ alerts, setAlerts, onSelectMeter, onMarkAllRead }: AlertPanelProps) {
  const [filter, setFilter] = useState<"all" | "unread" | "high" | "medium" | "low">("all")

  // Filter alerts based on the selected filter
  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "unread") return !alert.read
    if (filter === "high") return alert.severity === "high"
    if (filter === "medium") return alert.severity === "medium"
    if (filter === "low") return alert.severity === "low"
    return true
  })

  // Mark a single alert as read
  const markAsRead = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, read: true } : alert)))
  }

  // Get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge variant="default">Medium</Badge>
      case "low":
        return <Badge variant="secondary">Low</Badge>
      default:
        return null
    }
  }

  // Count alerts by severity
  const highAlerts = alerts.filter((a) => a.severity === "high").length
  const mediumAlerts = alerts.filter((a) => a.severity === "medium").length
  const lowAlerts = alerts.filter((a) => a.severity === "low").length
  const unreadAlerts = alerts.filter((a) => !a.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Alerts</h2>
          <p className="text-muted-foreground">Monitor and manage system alerts.</p>
        </div>
        <Button variant="outline" onClick={onMarkAllRead}>
          <Check className="mr-2 h-4 w-4" />
          Mark All as Read
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className={highAlerts > 0 ? "border-red-200 bg-red-50 dark:bg-red-950/10" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highAlerts}</div>
            <p className="text-xs text-muted-foreground">Critical issues requiring immediate attention</p>
          </CardContent>
        </Card>

        <Card className={mediumAlerts > 0 ? "border-amber-200 bg-amber-50 dark:bg-amber-950/10" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Medium Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediumAlerts}</div>
            <p className="text-xs text-muted-foreground">Issues that should be addressed soon</p>
          </CardContent>
        </Card>

        <Card className={lowAlerts > 0 ? "border-blue-200 bg-blue-50 dark:bg-blue-950/10" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowAlerts}</div>
            <p className="text-xs text-muted-foreground">Minor issues for routine maintenance</p>
          </CardContent>
        </Card>

        <Card className={unreadAlerts > 0 ? "border-purple-200 bg-purple-50 dark:bg-purple-950/10" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unread Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadAlerts}</div>
            <p className="text-xs text-muted-foreground">Alerts that haven't been acknowledged</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alert History</CardTitle>
          <CardDescription>View and manage system alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={filter} onValueChange={(value) => setFilter(value as any)}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Alerts</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="high">High Priority</TabsTrigger>
              <TabsTrigger value="medium">Medium Priority</TabsTrigger>
              <TabsTrigger value="low">Low Priority</TabsTrigger>
            </TabsList>

            <TabsContent value={filter}>
              {filteredAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="mb-2 h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No alerts found</h3>
                  <p className="text-sm text-muted-foreground">
                    {filter === "all"
                      ? "There are no alerts in the system."
                      : `There are no ${filter} alerts at this time.`}
                  </p>
                </div>
              ) : (
                <div className="max-h-[500px] overflow-auto rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left font-medium">Meter</th>
                        <th className="p-2 text-left font-medium">Parameter</th>
                        <th className="p-2 text-left font-medium">Value</th>
                        <th className="p-2 text-left font-medium">Threshold</th>
                        <th className="p-2 text-left font-medium">Time</th>
                        <th className="p-2 text-left font-medium">Severity</th>
                        <th className="p-2 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAlerts.map((alert) => (
                        <tr key={alert.id} className={`border-b ${!alert.read ? "bg-muted/20" : ""}`}>
                          <td className="p-2 font-medium">{alert.meterId}</td>
                          <td className="p-2 capitalize">{alert.parameter}</td>
                          <td className="p-2">{alert.value.toFixed(2)}</td>
                          <td className="p-2">{alert.threshold.toFixed(2)}</td>
                          <td className="p-2">{alert.timestamp}</td>
                          <td className="p-2">{getSeverityBadge(alert.severity)}</td>
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onSelectMeter(alert.meterId)}
                                title="View Meter"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              {!alert.read && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => markAsRead(alert.id)}
                                  title="Mark as Read"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
