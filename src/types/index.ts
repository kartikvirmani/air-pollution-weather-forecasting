export type AqiCategory = 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe'

export interface PollutantReading {
  pollutant: 'PM2.5' | 'PM10' | 'O3' | 'NO2'
  value: number
  unit: 'µg/m³'
}

export interface AirQualitySnapshot {
  stationId: string
  stationName: string
  timestamp: string
  aqi: number
  category: AqiCategory
  pollutants: PollutantReading[]
  source: string
}

export interface WeatherSnapshot {
  stationId: string
  timestamp: string
  temperatureC: number
  humidityPct: number
  windSpeedKmh: number
  windDirection: string
  boundaryLayerHeightM: number
  ventilationIndex: number
  inversionStatus: 'None' | 'Weak' | 'Moderate' | 'Strong'
  dispersion: 'Favourable' | 'Neutral' | 'Poor'
  source: string
}

export interface ForecastPoint {
  timestamp: string
  predictedAqi: number
  lower95: number
  upper95: number
  predictedPm25: number
  predictedPm10: number
}

export interface ForecastResponse {
  stationId: string
  generatedAt: string
  modelVersion: string
  horizonHours: number
  points: ForecastPoint[]
  source: 'ML model output (mock)'
}

export interface FireEvent {
  id: string
  latitude: number
  longitude: number
  region: string
  detectedAt: string
  confidence: number
  frpMw: number
  source: string
}

export interface AlertItem {
  id: string
  severity: 'info' | 'warning' | 'critical'
  title: string
  message: string
  timestamp: string
}

export interface Station {
  id: string
  name: string
  area: string
  latitude: number
  longitude: number
}

export interface ModelMetric {
  name: 'MAE' | 'RMSE' | 'R²'
  value: number
  unit?: string
}

export interface DashboardBundle {
  current: AirQualitySnapshot
  weather: WeatherSnapshot
  forecast: ForecastResponse
  fires: FireEvent[]
  alerts: AlertItem[]
}
