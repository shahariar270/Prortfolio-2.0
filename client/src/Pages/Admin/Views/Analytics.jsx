import React, { useState } from 'react'
import { AdminIcon } from '../AdminIcon'
import { ranges, kpiData, chartData, trafficSources, topPages } from '../helper'

// BACKEND: all analytics here are static mock numbers. Real data needs a
// page-view tracking endpoint (or an integration like Plausible/GA) plus
// aggregation queries per range (7d/30d/90d).

export const Analytics = () => {
    const [range, setRange] = useState('7d')

    const chart = chartData[range]
    const maxVal = Math.max(...chart.map(([, value]) => value))

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
                {kpiData[range].map((kpi) => (
                    <div className="st-admin__card st-admin__kpi" key={kpi.label}>
                        <div className="st-admin__kpi-head">
                            <span>{kpi.label}</span>
                            <span className="st-admin__kpi-icon">
                                <AdminIcon name={kpi.icon} />
                            </span>
                        </div>
                        <strong>{kpi.value}</strong>
                        <span className={`st-admin__kpi-trend ${kpi.pos ? 'is-pos' : 'is-neg'}`}>
                            {kpi.trend} <span>vs last period</span>
                        </span>
                    </div>
                ))}
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
                    <div className="st-admin__chart">
                        {chart.map(([label, value]) => (
                            <div className="st-admin__chart-col" key={label}>
                                <div
                                    className="st-admin__chart-bar"
                                    title={`${value} visitors`}
                                    style={{ height: `${Math.round((value / maxVal) * 100)}%` }}
                                ></div>
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="st-admin__card">
                    <h3 className="st-admin__card-title">Top sources</h3>
                    <div className="st-admin__sources">
                        {trafficSources.map((src) => (
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
                </div>
            </div>

            <div className="st-admin__card">
                <h3 className="st-admin__card-title">Top pages</h3>
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
                                <span>{row.views}</span>
                                <span className="st-admin__table-muted">{row.time}</span>
                                <span className={row.good ? 'is-pos' : 'is-neg'}>{row.bounce}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}
