"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Meter, generateHistoricalData, exportToCSV } from "@/lib/data-generator"
import { CircleGauge } from "@/components/circle-gauge"
import { Activity, Clock, Download, Gauge, Thermometer, Zap } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface MeterDetailProps {
  meter: Meter
}

export default function MeterDetail({ meter }: MeterDetailProps) {
  const [historicalData] = useState(() => generateHistoricalData(meter.id, 24))
  const [selectedTab, setSelectedTab] = useState("overview")
  const { toast } = useToast()

  const handleExport = () => {
    exportToCSV(historicalData, `${meter.id}_historical_data_${new Date().toISOString().split("T")[0]}.csv`)
    toast({
      title: "Export Successful",
      description: "Historical data has been exported to CSV",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">{meter.id}</h2>
          <p className="text-muted-foreground">Detailed meter information and historical data</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex h-2.5 w-2.5 rounded-full ${meter.status === "online" ? "bg-green-500" : "bg-red-500"}`}
          ></span>
          <span className="text-sm font-medium capitalize">{meter.status}</span>
        </div>
      </div>

      <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="power">Power & Energy</TabsTrigger>
            <TabsTrigger value="electrical">Electrical</TabsTrigger>
            <TabsTrigger value="historical">Historical Data</TabsTrigger>
          </TabsList>

          {selectedTab === "historical" && (
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Historical Data
            </Button>
          )}
        </div>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Power</CardTitle>
                <CardDescription>Real-time power consumption</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-4">
                <CircleGauge
                  value={meter.power}
                  maxValue={25}
                  label="Power"
                  unit="kW"
                  color="#10b981"
                  size={120}
                  icon={<Gauge className="h-4 w-4" />}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Energy</CardTitle>
                <CardDescription>Total energy consumption</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-4">
                <CircleGauge
                  value={meter.energy}
                  maxValue={1500}
                  label="Energy"
                  unit="kWh"
                  color="#6366f1"
                  size={120}
                  icon={<Activity className="h-4 w-4" />}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                <CardDescription>Device temperature</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-4">
                <CircleGauge
                  value={meter.temperature}
                  maxValue={60}
                  label="Temperature"
                  unit="°C"
                  color="#ef4444"
                  size={120}
                  icon={<Thermometer className="h-4 w-4" />}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
                <CardDescription>Time of last reading</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center gap-4 py-6">
                <Clock className="h-8 w-8 text-muted-foreground" />
                <div className="text-2xl font-bold">{meter.timestamp}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Meter Status</CardTitle>
              <CardDescription>Current status and parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div className="flex flex-col space-y-1.5 rounded-lg border p-4">
                  <span className="text-sm font-medium text-muted-foreground">Current</span>
                  <span className="text-2xl font-bold">{meter.current.toFixed(2)} A</span>
                </div>
                <div className="flex flex-col space-y-1.5 rounded-lg border p-4">
                  <span className="text-sm font-medium text-muted-foreground">Voltage</span>
                  <span className="text-2xl font-bold">{meter.voltage.toFixed(2)} V</span>
                </div>
                <div className="flex flex-col space-y-1.5 rounded-lg border p-4">
                  <span className="text-sm font-medium text-muted-foreground">Power Factor</span>
                  <span className="text-2xl font-bold">{meter.powerFactor.toFixed(2)}</span>
                </div>
                <div className="flex flex-col space-y-1.5 rounded-lg border p-4">
                  <span className="text-sm font-medium text-muted-foreground">Frequency</span>
                  <span className="text-2xl font-bold">{meter.frequency.toFixed(2)} Hz</span>
                </div>
                <div className="flex flex-col space-y-1.5 rounded-lg border p-4">
                  <span className="text-sm font-medium text-muted-foreground">Power</span>
                  <span className="text-2xl font-bold">{meter.power.toFixed(2)} kW</span>
                </div>
                <div className="flex flex-col space-y-1.5 rounded-lg border p-4">
                  <span className="text-sm font-medium text-muted-foreground">Energy</span>
                  <span className="text-2xl font-bold">{meter.energy.toFixed(2)} kWh</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="power" className="space-y-4 pt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Power Consumption</CardTitle>
                <CardDescription>Real-time power usage</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <CircleGauge
                  value={meter.power}
                  maxValue={25}
                  label="Power"
                  unit="kW"
                  color="#10b981"
                  size={200}
                  icon={<Gauge className="h-5 w-5" />}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Energy Consumption</CardTitle>
                <CardDescription>Total energy used</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <CircleGauge
                  value={meter.energy}
                  maxValue={1500}
                  label="Energy"
                  unit="kWh"
                  color="#6366f1"
                  size={200}
                  icon={<Activity className="h-5 w-5" />}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Power Factor</CardTitle>
              <CardDescription>Efficiency of electrical power usage</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0.7, 1]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="powerFactor"
                    name="Power Factor"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="electrical" className="space-y-4 pt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Current</CardTitle>
                <CardDescription>Amperage reading</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <CircleGauge
                  value={meter.current}
                  maxValue={100}
                  label="Current"
                  unit="A"
                  color="#3b82f6"
                  size={200}
                  icon={<Zap className="h-5 w-5" />}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Voltage</CardTitle>
                <CardDescription>Voltage reading</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <CircleGauge
                  value={meter.voltage}
                  maxValue={250}
                  label="Voltage"
                  unit="V"
                  color="#f97316"
                  size={200}
                  icon={<Activity className="h-5 w-5" />}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Frequency</CardTitle>
              <CardDescription>Line frequency</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[49, 51]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="frequency"
                    name="Frequency (Hz)"
                    stroke="#f59e0b"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historical" className="pt-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Historical Data</CardTitle>
              <CardDescription>Meter readings over the past 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="chart">
                <TabsList className="mb-4">
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                  <TabsTrigger value="table">Table</TabsTrigger>
                </TabsList>
                <TabsContent value="chart" className="h-[500px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis yAxisId="current" orientation="left" stroke="#3b82f6" />
                      <YAxis yAxisId="voltage" orientation="right" stroke="#f97316" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="current"
                        type="monotone"
                        dataKey="current"
                        name="Current (A)"
                        stroke="#3b82f6"
                        activeDot={{ r: 8 }}
                      />
                      <Line yAxisId="voltage" type="monotone" dataKey="voltage" name="Voltage (V)" stroke="#f97316" />
                      <Line yAxisId="current" type="monotone" dataKey="power" name="Power (kW)" stroke="#10b981" />
                      <Line
                        yAxisId="current"
                        type="monotone"
                        dataKey="temperature"
                        name="Temperature (°C)"
                        stroke="#ef4444"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="table">
                  <div className="max-h-[500px] overflow-auto rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-2 text-left font-medium">Time</th>
                          <th className="p-2 text-left font-medium">Current (A)</th>
                          <th className="p-2 text-left font-medium">Voltage (V)</th>
                          <th className="p-2 text-left font-medium">Power (kW)</th>
                          <th className="p-2 text-left font-medium">Energy (kWh)</th>
                          <th className="p-2 text-left font-medium">PF</th>
                          <th className="p-2 text-left font-medium">Freq (Hz)</th>
                          <th className="p-2 text-left font-medium">Temp (°C)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historicalData.map((entry, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2">{entry.time}</td>
                            <td className="p-2">{entry.current.toFixed(2)}</td>
                            <td className="p-2">{entry.voltage.toFixed(2)}</td>
                            <td className="p-2">{entry.power.toFixed(2)}</td>
                            <td className="p-2">{entry.energy.toFixed(2)}</td>
                            <td className="p-2">{entry.powerFactor.toFixed(2)}</td>
                            <td className="p-2">{entry.frequency.toFixed(2)}</td>
                            <td className="p-2">{entry.temperature.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
