# Air Pollution–Weather Coupled Forecasting System

**Problem Statement ID:** 26082  
**Focus:** Delhi NCR

A production-oriented frontend prototype for an environmental monitoring and forecasting platform that represents the coupling between air pollution, meteorology, atmospheric dispersion and regional fire activity.

## Scientific architecture

The frontend intentionally does **not** derive forecast AQI from displayed weather values. Forecasts are treated as model outputs from the conceptual pipeline:

```text
Pollution observations + Weather + Atmospheric conditions + Regional fire activity
                                  ↓
                         ML forecasting model
                                  ↓
                    Predicted pollutant concentrations
                                  ↓
                         CPCB AQI computation
                                  ↓
                              Frontend
```

Phase 1 uses realistic mock data behind a typed service layer so the mock implementation can later be replaced by FastAPI REST/WebSocket endpoints without rewriting presentation components.

## Stack

- React + TypeScript + Vite
- React Router
- Recharts
- Lucide React
- Typed service layer with mock implementation
- Responsive dark environmental dashboard

## Pages

1. Dashboard
2. 72-Hour Forecast
3. Delhi NCR Map
4. Weather & Atmosphere
5. Fire & Stubble Burning
6. Insights
7. Alerts
8. Model Performance
9. About

## Run locally

```bash
npm install
npm run dev
```

## Future backend contract

The frontend consumes `EnvironmentalApi` from `src/services/api.ts`. A future FastAPI implementation should return JSON matching the interfaces in `src/types/index.ts`.

Suggested backend sources include CPCB/air-quality observations, IMD meteorology, satellite fire products such as FIRMS/VIIRS, and an ML inference service. Source attribution is surfaced in the UI so data lineage remains visible.

> Phase 1 values are demonstrative mock data, not live measurements.
