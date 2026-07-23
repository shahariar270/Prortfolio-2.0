import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AdminIcon } from '../AdminIcon'
import { ranges } from '../helper'
import { fetchAnalytics } from '../../../store/slices/analyticsSlice'

const KPI_META = {
    visitors: { label: 'Visitors', icon: 'visitors' },
    page_views: { label: 'Page views', icon: 'views' },
    avg_session_ms: { label: 'Avg. session', icon: 'time' },
    contacts: { label: 'Contacts', icon: 'contacts' },
}

// lower bounce is better; this cutoff only drives display color
const BOUNCE_GOOD_BELOW = 40

const formatDuration = (ms) => {
    const totalSeconds = Math.round(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return minutes > 0 ? `${minutes}m ${String(seconds).padStart(2, '0')}s` : `${seconds}s`
}

const formatTrend = (pct) => `${pct >= 0 ? '▲' : '▼'} ${Math.abs(pct).toFixed(1)}%`

const formatKpiValue = (key, value) =>
    key === 'avg_session_ms' ? formatDuration(value) : value.toLocaleString()

export const Analytics = ({ onError }) => {
    const dispatch = useDispatch()
    const [range, setRange] = useState('7d')
    // condition-gated: switching back to an already-viewed range reuses the
    // cached summary instead of refetching
    const summary = useSelector((state) => state.analytics.byRange[range]?.data) ?? null

    useEffect(() => {
        dispatch(fetchAnalytics(range)).then((action) => {
            if (fetchAnalytics.rejected.match(action) && !action.meta.condition) onError(action.payload)
        })
        // onError intentionally omitted — it's a fresh function every render
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, range])

    const kpis = summary?.kpis ?? {}
    const chart = summary?.chart ?? []
    const sources = summary?.sources ?? []
    const topPages = summary?.top_pages ?? []
    const maxVal = Math.max(1, ...chart.map((bar) => bar.value))

    return (
        <main className="st-admin__view">
            <div className="st-admin__range-row">
                <div className="st-admin__range-switch">
                    {ranges.map((r) => (
                        <button
                            key={r.value}
                            type="button"
                            className={range === r.value ? 'is-active' : ''}
                            onClick={() => setRange(r.value)}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="st-admin__kpis">
                {Object.entries(KPI_META).map(([key, meta]) => {
                    const kpi = kpis[key]
                    return (
                        <div className="st-admin__card st-admin__kpi" key={key}>
                            <div className="st-admin__kpi-head">
                                <span>{meta.label}</span>
                                <span className="st-admin__kpi-icon">
                                    <AdminIcon name={meta.icon} />
                                </span>
                            </div>
                            <strong>{kpi ? formatKpiValue(key, kpi.value) : '—'}</strong>
                            {kpi && (
                                <span className={`st-admin__kpi-trend ${kpi.trend_pct >= 0 ? 'is-pos' : 'is-neg'}`}>
                                    {formatTrend(kpi.trend_pct)} <span>vs last period</span>
                                </span>
                            )}
                        </div>
                    )
                })}
            </div>

            <div className="st-admin__chart-grid">
                <div className="st-admin__card">
                    <div className="st-admin__card-head">
                        <div>
                            <h3>Visitors</h3>
                            <span>Daily unique visitors</span>
                        </div>
                        <span className="st-admin__chart-legend">
                            <span></span> This period
                        </span>
                    </div>
                    {chart.length === 0 ? (
                        <p className="st-admin__empty">No traffic recorded yet for this range.</p>
                    ) : (
                        <div className="st-admin__chart">
                            {chart.map((bar) => (
                                <div className="st-admin__chart-col" key={bar.label}>
                                    <div
                                        className="st-admin__chart-bar"
                                        title={`${bar.value} visitors`}
                                        style={{ height: `${Math.round((bar.value / maxVal) * 100)}%` }}
                                    ></div>
                                    <span>{bar.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="st-admin__card">
                    <h3 className="st-admin__card-title">Top sources</h3>
                    {sources.length === 0 ? (
                        <p className="st-admin__empty">No referral data yet.</p>
                    ) : (
                        <div className="st-admin__sources">
                            {sources.map((src) => (
                                <div className="st-admin__source" key={src.label}>
                                    <div>
                                        <span>{src.label}</span>
                                        <span>{src.pct}%</span>
                                    </div>
                                    <div className="st-admin__meter">
                                        <div style={{ width: `${src.pct}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="st-admin__card">
                <h3 className="st-admin__card-title">Top pages</h3>
                {topPages.length === 0 ? (
                    <p className="st-admin__empty">No page views recorded yet.</p>
                ) : (
                    <div className="st-admin__table-scroll">
                        <div className="st-admin__table">
                            <div className="st-admin__table-head">
                                <span>Page</span>
                                <span>Views</span>
                                <span>Avg. time</span>
                                <span>Bounce</span>
                            </div>
                            {topPages.map((row) => (
                                <div className="st-admin__table-row" key={row.page}>
                                    <span className="st-admin__table-page">{row.page}</span>
                                    <span>{row.views.toLocaleString()}</span>
                                    <span className="st-admin__table-muted">{formatDuration(row.avg_time_ms)}</span>
                                    <span className={row.bounce_pct < BOUNCE_GOOD_BELOW ? 'is-pos' : 'is-neg'}>
                                        {row.bounce_pct}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
