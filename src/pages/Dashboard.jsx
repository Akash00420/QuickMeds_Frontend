import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, AlertTriangle, Clock, TrendingUp, ArrowUpRight, Sparkles, MapPin, Clock3 } from 'lucide-react'
import { usePharmacy } from '../../contexts/PharmacyContext'
import { demandChartData } from '../../data/mockData'
import { formatCurrency, formatRelativeTime } from '../../lib/utils'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import '../assets/custom.css'

const COLORS = ['#0d9488', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6']

const productOptions = [
  { id: 'paracetamol', label: 'Paracetamol 500mg' },
  { id: 'azithromycin', label: 'Azithromycin 500mg' },
  { id: 'vitamin-d3', label: 'Vitamin D3 60k' },
  { id: 'metformin', label: 'Metformin 500mg' },
]

const demandBoard = [
  { name: 'Paracetamol', requests: 1240, growth: 18, badge: 'High Demand' },
  { name: 'Azithromycin', requests: 892, growth: 24, badge: 'Trending' },
  { name: 'Vitamin D3', requests: 654, growth: 31, badge: 'Urgent Need' },
]

const regionalDemand = [
  { city: 'Kolkata', demand: 88 },
  { city: 'Delhi', demand: 76 },
  { city: 'Mumbai', demand: 72 },
  { city: 'Bangalore', demand: 65 },
  { city: 'Hyderabad', demand: 58 },
]

const fastestGrowing = [
  { name: 'Vitamin D3', growth: 31 },
  { name: 'Azithromycin', growth: 24 },
  { name: 'Paracetamol', growth: 18 },
  { name: 'Metformin', growth: 15 },
]

const liveRequests = [
  { id: 'r1', label: 'Paracetamol demand spiked from East Clinic', time: 'Just now' },
  { id: 'r2', label: 'Urgent request for Azithromycin from city hospital', time: '2m ago' },
  { id: 'r3', label: 'Vitamin D3 prescription flow increasing', time: '5m ago' },
  { id: 'r4', label: 'Metformin refill requests rising', time: '8m ago' },
]

const lifecyclePredictions = [
  { product: 'Azithromycin', status: 'Rising', variant: 'success' },
  { product: 'Paracetamol', status: 'Stable', variant: 'info' },
  { product: 'Vitamin D3', status: 'Falling', variant: 'warning' },
]

const executiveKpis = [
  { label: 'Active Demand Signals', value: 3, icon: TrendingUp },
  { label: 'Average ROI', value: '162%', icon: ArrowUpRight },
  { label: 'Regional Hotspots', value: 5, icon: MapPin },
  { label: 'Lifecycle Alerts', value: 3, icon: Sparkles },
]

function Badge({ variant = 'info', children }) {
  return <span className={`badge badge-${variant}`}>{children}</span>
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { stats, activityFeed } = usePharmacy()
  const [chartPeriod, setChartPeriod] = useState('daily')
  const [selectedProduct, setSelectedProduct] = useState(productOptions[0].id)
  const [purchaseQty, setPurchaseQty] = useState(100)
  const [purchasePrice, setPurchasePrice] = useState(25)
  const [sellingPrice, setSellingPrice] = useState(45)
  const [logisticsCost, setLogisticsCost] = useState(1200)
  const [marketingCost, setMarketingCost] = useState(900)
  const chartData = demandChartData[chartPeriod]

  const calculator = useMemo(() => {
    const totalPurchaseCost = purchaseQty * purchasePrice
    const expectedRevenue = purchaseQty * sellingPrice
    const grossProfit = expectedRevenue - totalPurchaseCost
    const netProfit = grossProfit - logisticsCost - marketingCost
    const investment = totalPurchaseCost + logisticsCost + marketingCost
    const roi = investment > 0 ? (netProfit / investment) * 100 : 0
    const unitMargin = sellingPrice - purchasePrice
    const breakEvenPoint = unitMargin > 0 ? Math.ceil(investment / unitMargin) : null

    return {
      expectedRevenue,
      grossProfit,
      netProfit,
      roi,
      breakEvenPoint,
      investment,
    }
  }, [purchaseQty, purchasePrice, sellingPrice, logisticsCost, marketingCost])

  const kpis = [
    { label: 'Total Medicines', value: stats.totalMedicines, icon: Package, link: '/inventory' },
    { label: 'Low Stock Alerts', value: stats.lowStock + stats.criticalStock, icon: AlertTriangle, link: '/inventory?filter=low' },
    { label: 'Pending Reservations', value: stats.pendingReservations, icon: Clock, link: '/reservations' },
  ]

  const typeIcons = { reservation: Clock, stockout: TrendingUp, expiry: AlertTriangle }

  const badgeForDemand = item =>
    item.badge === 'Urgent Need' ? 'danger' : item.badge === 'High Demand' ? 'success' : 'warning'

  return (
    <div className="dashboard">
      {/* Hero */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1>Welcome to your Pharmacy Hub</h1>
          <p>Your smart inventory and prediction system is fully operational.</p>
        </div>
        <div className="hero-image-wrap">
          <img src="/medicine-bottle.png" alt="Medicine" className="hero-image" />
        </div>
      </div>

      {/* Executive KPIs */}
      <div className="kpi-grid">
        {executiveKpis.map(item => (
          <div key={item.label} className="kpi-card">
            <div className="kpi-icon">
              <item.icon className="icon-md" />
            </div>
            <div>
              <p className="kpi-label">{item.label}</p>
              <p className="kpi-value">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2col">
        <div className="card">
          <div className="card-header row">
            <div>
              <h2 className="card-title">Investment vs Return Calculator</h2>
              <p className="card-subtitle">Estimate revenue, net profit, ROI and break-even in real time.</p>
            </div>
            <Badge variant="info">ROI Intelligence</Badge>
          </div>
          <div className="card-content">
            <div className="calc-grid">
              <label className="field">
                <span className="field-label">Product Name</span>
                <select
                  value={selectedProduct}
                  onChange={e => setSelectedProduct(e.target.value)}
                  className="field-input"
                >
                  {productOptions.map(product => (
                    <option key={product.id} value={product.id}>{product.label}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span className="field-label">Purchase Quantity</span>
                <input
                  type="number"
                  min="1"
                  value={purchaseQty}
                  onChange={e => setPurchaseQty(Number(e.target.value))}
                  className="field-input"
                />
              </label>
              <label className="field">
                <span className="field-label">Purchase Price</span>
                <input
                  type="number"
                  min="0"
                  value={purchasePrice}
                  onChange={e => setPurchasePrice(Number(e.target.value))}
                  className="field-input"
                />
              </label>
              <label className="field">
                <span className="field-label">Selling Price</span>
                <input
                  type="number"
                  min="0"
                  value={sellingPrice}
                  onChange={e => setSellingPrice(Number(e.target.value))}
                  className="field-input"
                />
              </label>
              <label className="field">
                <span className="field-label">Logistics Cost</span>
                <input
                  type="number"
                  min="0"
                  value={logisticsCost}
                  onChange={e => setLogisticsCost(Number(e.target.value))}
                  className="field-input"
                />
              </label>
              <label className="field">
                <span className="field-label">Marketing Cost</span>
                <input
                  type="number"
                  min="0"
                  value={marketingCost}
                  onChange={e => setMarketingCost(Number(e.target.value))}
                  className="field-input"
                />
              </label>
            </div>

            <div className="result-grid">
              <div className="result-card">
                <p className="result-label">Expected Revenue</p>
                <p className="result-value">{formatCurrency(calculator.expectedRevenue)}</p>
              </div>
              <div className="result-card">
                <p className="result-label">Gross Profit</p>
                <p className="result-value">{formatCurrency(calculator.grossProfit)}</p>
              </div>
              <div className="result-card">
                <p className="result-label">Net Profit</p>
                <p className="result-value">{formatCurrency(calculator.netProfit)}</p>
              </div>
              <div className="result-card">
                <p className="result-label">ROI</p>
                <p className="result-value">{calculator.roi.toFixed(1)}%</p>
              </div>
              <div className="result-card result-card-wide">
                <p className="result-label">Break-even Point</p>
                <p className="result-value">
                  {calculator.breakEvenPoint ? `${calculator.breakEvenPoint} units` : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="stack">
          <div className="card">
            <div className="card-header row">
              <div>
                <h2 className="card-title">Live Product Demand Board</h2>
                <p className="card-subtitle">Medicines currently being requested.</p>
              </div>
              <Badge variant="success">Killer Feature</Badge>
            </div>
            <div className="card-content table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Requests</th>
                    <th>Growth</th>
                    <th>Signal</th>
                  </tr>
                </thead>
                <tbody>
                  {demandBoard.map(item => (
                    <tr key={item.name}>
                      <td className="medicine">{item.name}</td>
                      <td>{item.requests}</td>
                      <td>+{item.growth}%</td>
                      <td>
                        <Badge variant={badgeForDemand(item)}>{item.badge}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Product Lifecycle Prediction</h2>
            </div>
            <div className="card-content list">
              {lifecyclePredictions.map(item => (
                <div key={item.product} className="list-row">
                  <div>
                    <p className="list-row-label">{item.product}</p>
                    <p className="list-row-value">{item.status}</p>
                  </div>
                  <Badge variant={item.variant}>{item.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2col-alt">
        <div className="card">
          <div className="card-header row">
            <div>
              <h2 className="card-title">Regional Demand Heatmap</h2>
              <p className="card-subtitle">High-demand regions across major cities.</p>
            </div>
            <div className="eyebrow">Live view</div>
          </div>
          <div className="card-content">
            <div className="region-grid">
              {regionalDemand.map(region => (
                <div key={region.city} className="region-card">
                  <p className="region-city">{region.city}</p>
                  <p className="region-value">{region.demand}%</p>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${region.demand}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="stack">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Fastest Growing Products</h2>
            </div>
            <div className="card-content list">
              {fastestGrowing.map(item => (
                <div key={item.name} className="list-row">
                  <div>
                    <p className="list-row-label">{item.name}</p>
                    <p className="list-row-value">{item.growth}% growth</p>
                  </div>
                  <TrendingUp className="icon-md icon-accent" />
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Live Product Requests Feed</h2>
            </div>
            <div className="card-content feed">
              {liveRequests.map(item => (
                <div key={item.id} className="feed-card">
                  <div className="feed-row">
                    <p className="feed-label">{item.label}</p>
                    <span className="feed-time">{item.time}</span>
                  </div>
                  <div className="feed-live">
                    <Clock3 className="icon-sm" /> Live
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header row">
          <h2 className="card-title">Demand Trend — Top 5 Medicines</h2>
          <div className="tabs">
            {['daily', 'weekly', 'monthly'].map(p => (
              <button
                key={p}
                onClick={() => setChartPeriod(p)}
                className={`tab-btn${chartPeriod === p ? ' active' : ''}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="card-content">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              {Object.keys(chartData[0]).filter(k => k !== 'day').map((key, i) => (
                <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Live Activity Feed</h2>
        </div>
        <div className="card-content activity">
          {activityFeed.length === 0 ? (
            <p className="empty-state">No recent activity</p>
          ) : (
            activityFeed.map(item => {
              const Icon = typeIcons[item.type] || Clock
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.link)}
                  className="activity-row"
                >
                  <div className="activity-icon">
                    <Icon className="icon-sm" />
                  </div>
                  <div className="activity-text">
                    <p className="activity-message">{item.message}</p>
                    <p className="activity-time">{formatRelativeTime(item.time)}</p>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}