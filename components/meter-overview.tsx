"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Meter } from "@/lib/data-generator"
import { CircleGauge } from "@/components/circle-gauge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Activity, Gauge } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface MeterOverviewProps {
  meter: Meter
  onClick: () => void
  alerts: number
}

export default function MeterOverview({ meter, onClick, alerts }: MeterOverviewProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="bg-muted/50 pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <span>{meter.id}</span>
            {alerts > 0 && (
              <Badge variant="destructive" className="text-xs">
                {alerts} {alerts === 1 ? "alert" : "alerts"}
              </Badge>
            )}
          </div>
          <span className="flex h-2 w-2 items-center">
            <span
              className={`absolute inline-flex h-2 w-2 animate-ping rounded-full ${meter.status === "online" ? "bg-green-400" : "bg-red-400"} opacity-75`}
            ></span>
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${meter.status === "online" ? "bg-green-500" : "bg-red-500"}`}
            ></span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <CircleGauge
              value={meter.power}
              maxValue={25}
              label="Power"
              unit="kW"
              color="#10b981"
              icon={<Gauge className="h-3 w-3" />}
            />
          </div>
          <div className="flex flex-col items-center">
            <CircleGauge
              value={meter.energy}
              maxValue={1500}
              label="Energy"
              unit="kWh"
              color="#6366f1"
              icon={<Activity className="h-3 w-3" />}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-md bg-muted/50 p-2">
            <div className="font-medium text-muted-foreground">Current</div>
            <div className="font-bold">{meter.current.toFixed(1)} A</div>
          </div>
          <div className="rounded-md bg-muted/50 p-2">
            <div className="font-medium text-muted-foreground">Voltage</div>
            <div className="font-bold">{meter.voltage.toFixed(1)} V</div>
          </div>
          <div className="rounded-md bg-muted/50 p-2">
            <div className="font-medium text-muted-foreground">Temp</div>
            <div className="font-bold">{meter.temperature.toFixed(1)} °C</div>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">Last updated: {meter.timestamp}</div>
      </CardContent>
      <CardFooter className="bg-muted/30 p-2">
        <Button variant="ghost" size="sm" className="w-full" onClick={onClick}>
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
