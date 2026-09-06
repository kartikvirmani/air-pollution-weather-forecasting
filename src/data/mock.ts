import type { AirQualitySnapshot, AlertItem, FireEvent, ForecastResponse, ModelMetric, Station, WeatherSnapshot } from '../types'

export const stations: Station[] = [
  { id: 'anand-vihar', name: 'Anand Vihar', area: 'East Delhi', latitude: 28.6469, longitude: 77.3160 },
  { id: 'rk-puram', name: 'R.K. Puram', area: 'South Delhi', latitude: 28.5630, longitude: 77.1869 },
  { id: 'sector-51-gurugram', name: 'Sector 51, Gurugram', area: 'Gurugram', latitude: 28.4293, longitude: 77.0656 },
  { id: 'sector-125-noida', name: 'Sector 125, Noida', area: 'Noida', latitude: 28.5448, longitude: 77.3271 },
]

export const currentAir: AirQualitySnapshot = {
  stationId: 'anand-vihar',
  stationName: 'Anand Vihar',
  timestamp: '2026-09-06T14:00:00+05:30',
  aqi: 238,
  category: 'Poor',
  pollutants: [
    { pollutant: 'PM2.5', value: 112, unit: 'µg/m³' },
    { pollutant: 'PM10', value: 196, unit: 'µg/m³' },
    { pollutant: 'O3', value: 58, unit: 'µg/m³' },
    { pollutant: 'NO2', value: 64, unit: 'µg/m³' },
  ],
  source: 'Mock CPCB-style station feed',
}

export const currentWeather: WeatherSnapshot = {
  stationId: 'anand-vihar',
  timestamp: '2026-09-06T14:00:00+05:30',
  temperatureC: 32.4,
  humidityPct: 61,
  windSpeedKmh: 8.6,
  windDirection: 'WNW',
  boundaryLayerHeightM: 710,
  ventilationIndex: 2840,
  inversionStatus: 'Weak',
  dispersion: 'Poor',
  source: 'Mock IMD-style meteorology',
}

const start = new Date('2026-09-06T15:00:00+05:30').getTime()
export const forecast: ForecastResponse = {
  stationId: 'anand-vihar',
  generatedAt: '2026-09-06T14:15:00+05:30',
  modelVersion: 'coupled-forecast-v0.1-mock',
  horizonHours: 72,
  source: 'ML model output (mock)',
  points: Array.from({ length: 25 }, (_, i) => {
    const hour = i * 3
    const wave = Math.sin(i / 2.2) * 30
    const trend = i * 1.3
    const predictedAqi = Math.round(225 + wave + trend)
    return {
      timestamp: new Date(start + hour * 3600000).toISOString(),
      predictedAqi,
      lower95: predictedAqi - 24,
      upper95: predictedAqi + 29,
      predictedPm25: Math.round(98 + wave * 0.55 + trend * 0.7),
      predictedPm10: Math.round(178 + wave * 0.7 + trend),
    }
  }),
}

export const history = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  aqi: Math.round(180 + Math.sin(i / 3) * 42 + i * 2),
  pm25: Math.round(78 + Math.sin(i / 3) * 18 + i),
}))

export const fires: FireEvent[] = [
  { id: 'F-101', latitude: 30.33, longitude: 75.57, region: 'Punjab', detectedAt: '2026-09-06T10:20:00+05:30', confidence: 89, frpMw: 18.4, source: 'Mock VIIRS/FIRMS' },
  { id: 'F-102', latitude: 29.68, longitude: 76.99, region: 'Haryana', detectedAt: '2026-09-06T11:05:00+05:30', confidence: 82, frpMw: 12.7, source: 'Mock VIIRS/FIRMS' },
  { id: 'F-103', latitude: 30.77, longitude: 76.11, region: 'Punjab', detectedAt: '2026-09-06T12:15:00+05:30', confidence: 93, frpMw: 22.1, source: 'Mock VIIRS/FIRMS' },
]

export const alerts: AlertItem[] = [
  { id: 'A-1', severity: 'critical', title: 'Poor air quality persists', message: 'AQI is above 200 at the selected station. Sensitive groups should reduce prolonged outdoor exertion.', timestamp: '14:10' },
  { id: 'A-2', severity: 'warning', title: 'Dispersion conditions weakening', message: 'Low ventilation and a shallow boundary layer may favour pollutant accumulation.', timestamp: '13:45' },
  { id: 'A-3', severity: 'info', title: 'Regional fire signal detected', message: 'Satellite-style mock feed shows elevated fire activity northwest of Delhi NCR.', timestamp: '12:30' },
]

export const modelMetrics: ModelMetric[] = [
  { name: 'MAE', value: 18.6, unit: 'AQI' },
  { name: 'RMSE', value: 24.2, unit: 'AQI' },
  { name: 'R²', value: 0.84 },
]

export const modelValidation = Array.from({ length: 18 }, (_, i) => ({
  index: i + 1,
  actual: Math.round(160 + Math.sin(i / 2.5) * 55 + i * 4),
  predicted: Math.round(164 + Math.sin((i + 0.3) / 2.5) * 49 + i * 3.7),
}))

export const fireTrend = [8, 13, 17, 12, 28, 41, 53, 47, 64, 72, 58, 49].map((count, i) => ({ day: `D-${11 - i}`, count }))
