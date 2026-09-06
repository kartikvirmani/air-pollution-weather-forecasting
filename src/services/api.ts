import type { DashboardBundle, ForecastResponse, Station } from '../types'
import { alerts, currentAir, currentWeather, fires, forecast, stations } from '../data/mock'

export interface EnvironmentalApi {
  getStations(): Promise<Station[]>
  getDashboard(stationId: string): Promise<DashboardBundle>
  getForecast(stationId: string): Promise<ForecastResponse>
}

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

class MockEnvironmentalApi implements EnvironmentalApi {
  async getStations() {
    await delay(120)
    return stations
  }

  async getDashboard(_stationId: string) {
    await delay()
    return { current: currentAir, weather: currentWeather, forecast, fires, alerts }
  }

  async getForecast(_stationId: string) {
    await delay(180)
    return forecast
  }
}

// Swap only this implementation when FastAPI is ready.
// Components consume the EnvironmentalApi contract rather than mock data directly.
export const api: EnvironmentalApi = new MockEnvironmentalApi()
