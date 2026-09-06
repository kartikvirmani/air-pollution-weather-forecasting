import { useEffect, useState, type ReactNode } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import {
  Activity, AlertTriangle, BarChart3, BrainCircuit, CloudSun, Flame, Gauge,
  Info, LayoutDashboard, MapPinned, Menu, ShieldAlert, Sparkles, Wind, X
} from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis
} from 'recharts'
import { api } from './services/api'
import { alerts, currentAir, currentWeather, fireTrend, fires, forecast, history, modelMetrics, modelValidation, stations } from './data/mock'
import type { DashboardBundle } from './types'

const nav = [
  ['/', 'Dashboard', LayoutDashboard], ['/forecast', '72-Hour Forecast', Activity],
  ['/map', 'Delhi NCR Map', MapPinned], ['/weather', 'Weather & Atmosphere', CloudSun],
  ['/fires', 'Fire & Stubble Burning', Flame], ['/insights', 'Insights', Sparkles],
  ['/alerts', 'Alerts', ShieldAlert], ['/model', 'Model Performance', BrainCircuit],
  ['/about', 'About', Info],
] as const

function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return <div className="shell">
    <aside className={open ? 'sidebar open' : 'sidebar'}>
      <div className="brand"><div className="brandmark"><Wind size={21}/></div><div><b>AirIntel NCR</b><small>Coupled Forecasting</small></div></div>
      <button className="close" onClick={() => setOpen(false)}><X/></button>
      <nav>{nav.map(([to,label,Icon]) => <NavLink key={to} to={to} onClick={()=>setOpen(false)} className={({isActive})=>isActive?'active':''}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
      <div className="side-note"><span className="pulse"/> Phase 1 · Mock feeds<br/><small>Backend-ready architecture</small></div>
    </aside>
    <main className="main">
      <header><button className="menu" onClick={()=>setOpen(true)}><Menu/></button><div><span className="eyebrow">PROBLEM STATEMENT 26082</span><h1>Delhi NCR Environmental Intelligence</h1></div><div className="live"><span className="pulse"/> Mock live</div></header>
      {children}
      <footer>Phase 1 demonstration · Values shown are mock data · Architecture prepared for CPCB / IMD / FIRMS-style feeds and ML inference APIs.</footer>
    </main>
  </div>
}

function Card({ title, children, source, className='' }: { title?: string; children: ReactNode; source?: string; className?: string }) {
  return <section className={`card ${className}`}>{title && <h3>{title}</h3>}{children}{source && <div className="source">Source: {source}</div>}</section>
}

function Metric({ label, value, sub, icon }: { label:string; value:string|number; sub?:string; icon?:ReactNode }) {
  return <Card className="metric"><div className="metric-top"><span>{label}</span>{icon}</div><strong>{value}</strong>{sub&&<small>{sub}</small>}</Card>
}

function ForecastChart({ large=false }: { large?:boolean }) {
  const data = forecast.points.map((p,i)=>({time:i%4===0?new Date(p.timestamp).toLocaleString('en-IN',{weekday:'short',hour:'2-digit'}):'', aqi:p.predictedAqi, low:p.lower95, high:p.upper95}))
  return <div className={large?'chart tall':'chart'}><ResponsiveContainer width="100%" height="100%"><AreaChart data={data}><defs><linearGradient id="band" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="currentColor" stopOpacity={.22}/><stop offset="95%" stopColor="currentColor" stopOpacity={.02}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="time"/><YAxis domain={['dataMin - 30','dataMax + 30']}/><Tooltip/><Area type="monotone" dataKey="high" stroke="none" fill="url(#band)"/><Area type="monotone" dataKey="low" stroke="none" fill="var(--panel)"/><Line type="monotone" dataKey="aqi" stroke="currentColor" strokeWidth={3} dot={false}/></AreaChart></ResponsiveContainer></div>
}

function Dashboard() {
  const [data,setData] = useState<DashboardBundle|null>(null)
  const [error,setError] = useState('')
  useEffect(()=>{api.getDashboard('anand-vihar').then(setData).catch(()=>setError('Environmental feed unavailable.'))},[])
  if(error) return <div className="state error"><AlertTriangle/> {error}</div>
  if(!data) return <div className="state"><span className="spinner"/> Loading environmental data…</div>
  const p = Object.fromEntries(data.current.pollutants.map(x=>[x.pollutant,x.value]))
  return <div className="page">
    <div className="hero"><div><span className="eyebrow">SELECTED STATION</span><h2>Anand Vihar, Delhi</h2><p>Last synchronized 14:15 IST · Forecast from coupled ML pipeline</p></div><select defaultValue="anand-vihar">{stations.map(s=><option value={s.id} key={s.id}>{s.name}</option>)}</select></div>
    <div className="grid stats"><Card className="aqi"><span>Current AQI</span><div className="aqi-row"><strong>{data.current.aqi}</strong><em>{data.current.category}</em></div><div className="aqi-scale"><i/><i/><i/><i className="selected"/><i/><i/></div><small>Dominant pollutant · PM2.5</small></Card>
      <Metric label="PM2.5" value={`${p['PM2.5']} µg/m³`} sub="Elevated particulate load" icon={<Gauge/>}/><Metric label="PM10" value={`${p['PM10']} µg/m³`} sub="Coarse particulate matter" icon={<Gauge/>}/><Metric label="O₃" value={`${p['O3']} µg/m³`} sub="Ground-level ozone" icon={<Activity/>}/><Metric label="NO₂" value={`${p['NO2']} µg/m³`} sub="Combustion marker" icon={<Activity/>}/>
    </div>
    <div className="grid weather-strip"><Metric label="Temperature" value={`${data.weather.temperatureC}°C`} icon={<CloudSun/>}/><Metric label="Humidity" value={`${data.weather.humidityPct}%`}/><Metric label="Wind" value={`${data.weather.windSpeedKmh} km/h`} sub={data.weather.windDirection} icon={<Wind/>}/><Metric label="Boundary layer" value={`${data.weather.boundaryLayerHeightM} m`} sub={`Inversion: ${data.weather.inversionStatus}`}/><Metric label="Dispersion" value={data.weather.dispersion} sub={`VI ${data.weather.ventilationIndex}`}/></div>
    <div className="grid two"><Card title="72-hour AQI forecast" source={data.forecast.source}><div className="chart-head"><span>Model trajectory</span><small>95% confidence envelope</small></div><ForecastChart/></Card><Card title="Active intelligence" source="Rule engine · mock"><div className="alerts">{data.alerts.map(a=><div className={`alert ${a.severity}`} key={a.id}><AlertTriangle size={17}/><div><b>{a.title}</b><p>{a.message}</p></div><time>{a.timestamp}</time></div>)}</div></Card></div>
    <div className="grid two"><Card title="24-hour pollution trend" source="Mock station history"><div className="chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={history}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="time"/><YAxis/><Tooltip/><Line type="monotone" dataKey="aqi" stroke="currentColor" strokeWidth={3} dot={false}/></LineChart></ResponsiveContainer></div></Card><Card title="Delhi NCR spatial snapshot" source="Mock station feed"><div className="mini-map"><div className="ring r1"/><div className="ring r2"/><span className="pin p1">238</span><span className="pin p2">184</span><span className="pin p3">156</span><span className="pin p4">201</span><div className="map-label">DELHI NCR</div></div><div className="fire-summary"><Flame/> {data.fires.length} high-confidence regional fire detections in sample feed</div></Card></div>
  </div>
}

function ForecastPage(){return <div className="page"><Title k="MODEL OUTPUT" h="72-Hour Forecast" p="Predicted pollutant concentrations are produced by the forecasting model first; AQI is derived afterward using the CPCB methodology."/><div className="grid three"><Metric label="Current AQI" value={238}/><Metric label="Forecast peak" value={Math.max(...forecast.points.map(x=>x.predictedAqi))}/><Metric label="Model version" value="v0.1" sub="Mock coupled model"/></div><Card title="AQI trajectory with confidence bands" source={forecast.source}><ForecastChart large/></Card><Card title="Forecast contract"><pre>{`Pollution + Weather + Atmosphere + Fire activity\n                    ↓\n             ML inference API\n                    ↓\n      Predicted PM2.5 / PM10 / O₃ / NO₂\n                    ↓\n             CPCB AQI computation`}</pre></Card></div>}

function MapPage(){return <div className="page"><Title k="GEOSPATIAL MONITORING" h="Delhi NCR Map" p="Station and hotspot layers are separated so future GIS endpoints can replace the visual mock without changing page composition."/><Card><div className="big-map">{stations.map((s,i)=><div className={`station s${i+1}`} key={s.id}><span>{[238,184,156,201][i]}</span><small>{s.name}</small></div>)}<div className="roads">NCR monitoring layer</div></div></Card><div className="grid two"><Card title="Monitoring stations">{stations.map(s=><div className="row" key={s.id}><MapPinned size={16}/><b>{s.name}</b><span>{s.area}</span></div>)}</Card><Card title="Regional fire hotspots">{fires.map(f=><div className="row" key={f.id}><Flame size={16}/><b>{f.region}</b><span>{f.confidence}% confidence · {f.frpMw} MW</span></div>)}</Card></div></div>}

function WeatherPage(){return <div className="page"><Title k="DISPERSION DRIVERS" h="Weather & Atmosphere" p="These variables inform the forecasting model. The UI never directly turns displayed weather into predicted AQI."/><div className="grid stats"><Metric label="Temperature" value={`${currentWeather.temperatureC}°C`}/><Metric label="Humidity" value={`${currentWeather.humidityPct}%`}/><Metric label="Wind" value={`${currentWeather.windSpeedKmh} km/h`} sub={currentWeather.windDirection}/><Metric label="PBL height" value={`${currentWeather.boundaryLayerHeightM} m`}/><Metric label="Ventilation index" value={currentWeather.ventilationIndex}/></div><div className="grid two"><Card title="Atmospheric stability"><div className="status-orb"><Wind size={40}/><strong>{currentWeather.dispersion} dispersion</strong><span>{currentWeather.inversionStatus} inversion detected</span></div></Card><Card title="Why it matters"><p className="body-copy">Boundary-layer depth, temperature structure, humidity and winds affect transport, mixing and accumulation. In the production system these variables enter the ML feature pipeline alongside pollution observations and regional source signals.</p></Card></div></div>}

function FiresPage(){return <div className="page"><Title k="SATELLITE SIGNAL" h="Fire & Stubble Burning" p="Regional fire activity is treated as a model input, not as a direct AQI conversion."/><div className="grid three"><Metric label="Sample detections" value={fires.length}/><Metric label="Highest confidence" value={`${Math.max(...fires.map(f=>f.confidence))}%`}/><Metric label="Peak FRP" value={`${Math.max(...fires.map(f=>f.frpMw))} MW`}/></div><Card title="Regional burning trend" source="Mock FIRMS / VIIRS-style feed"><div className="chart tall"><ResponsiveContainer width="100%" height="100%"><AreaChart data={fireTrend}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="day"/><YAxis/><Tooltip/><Area dataKey="count" type="monotone" fill="currentColor" fillOpacity={.15} stroke="currentColor"/></AreaChart></ResponsiveContainer></div></Card></div>}

function Insights(){return <div className="page"><Title k="EXPLANATORY ANALYTICS" h="Insights" p="Correlations are descriptive evidence, not proof of direct causation."/><div className="grid three"><Card><span className="eyebrow">PATTERN</span><h2>Night-time accumulation</h2><p className="body-copy">Mock history shows pollutant build-up during weaker mixing periods.</p></Card><Card><span className="eyebrow">ASSOCIATION</span><h2>Wind ↔ PM2.5</h2><p className="body-copy">Higher wind speeds often align with improved dispersion in the sample analytics.</p></Card><Card><span className="eyebrow">SOURCE SIGNAL</span><h2>Fire activity</h2><p className="body-copy">Regional burning can contribute useful context when combined with transport and meteorology.</p></Card></div><Card title="Explainability architecture"><div className="pipeline"><span>Observed pollution</span><b>+</b><span>Meteorology</span><b>+</b><span>Atmosphere</span><b>+</b><span>Fire signals</span><b>→</b><span>ML + attribution</span></div></Card></div>}

function AlertsPage(){return <div className="page"><Title k="THRESHOLD ENGINE" h="Alerts" p="Warnings can later be generated server-side from station thresholds, forecast probabilities, fire spikes and adverse dispersion."/><Card><div className="alerts large-alerts">{alerts.map(a=><div className={`alert ${a.severity}`} key={a.id}><AlertTriangle/><div><b>{a.title}</b><p>{a.message}</p></div><time>{a.timestamp}</time></div>)}</div></Card></div>}

function ModelPage(){return <div className="page"><Title k="VALIDATION" h="Model Performance" p="A forecasting system is only useful if its predictions are continuously compared with later observations."/><div className="grid three">{modelMetrics.map(m=><Metric key={m.name} label={m.name} value={`${m.value}${m.unit?' '+m.unit:''}`}/>)}</div><Card title="Historical predicted vs actual" source="Synthetic validation set"><div className="chart tall"><ResponsiveContainer width="100%" height="100%"><LineChart data={modelValidation}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="index"/><YAxis/><Tooltip/><Line dataKey="actual" stroke="currentColor" strokeWidth={3} dot={false}/><Line dataKey="predicted" stroke="var(--accent2)" strokeWidth={2} strokeDasharray="6 5" dot={false}/></LineChart></ResponsiveContainer></div><div className="legend"><span>— Actual</span><span>--- Predicted</span></div></Card></div>}

function About(){return <div className="page"><Title k="PS 26082" h="About the System" p="Air Pollution–Weather Coupled Forecasting System · Delhi NCR Focus"/><div className="grid two"><Card title="Methodology"><p className="body-copy">The production vision combines air-quality observations, meteorology, atmospheric structure and regional fire activity in a machine-learning forecasting pipeline. The model predicts pollutant concentrations; AQI is then calculated using CPCB breakpoints. Phase 1 demonstrates the frontend contract using mock data.</p></Card><Card title="Planned integration"><div className="stack"><span>FastAPI · REST + WebSocket</span><span>PostgreSQL / TimescaleDB</span><span>CPCB / SAFAR-style observations</span><span>IMD weather + atmospheric inputs</span><span>NASA FIRMS / VIIRS-style fire data</span><span>ML inference service</span></div></Card></div><Card title="Scientific constraint"><blockquote>Forecast AQI is never created by directly combining dashboard weather values. Weather is one input to the forecasting model; predicted pollutant concentrations are the model output from which AQI is computed.</blockquote></Card></div>}

function Title({k,h,p}:{k:string;h:string;p:string}){return <div className="title"><span className="eyebrow">{k}</span><h2>{h}</h2><p>{p}</p></div>}

export default function App(){return <BrowserRouter><Layout><Routes><Route path="/" element={<Dashboard/>}/><Route path="/forecast" element={<ForecastPage/>}/><Route path="/map" element={<MapPage/>}/><Route path="/weather" element={<WeatherPage/>}/><Route path="/fires" element={<FiresPage/>}/><Route path="/insights" element={<Insights/>}/><Route path="/alerts" element={<AlertsPage/>}/><Route path="/model" element={<ModelPage/>}/><Route path="/about" element={<About/>}/></Routes></Layout></BrowserRouter>}
