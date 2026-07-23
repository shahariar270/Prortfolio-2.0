const PageView = require('../../model/page_view/index');
const ContactMessage = require('../../model/contact_message/index');
const ApiResponse = require('../../utils/api_response');

const RANGES = { '7d': 7, '30d': 30, '90d': 90 };
const CHART_UNIT = { '7d': 'day', '30d': 'week', '90d': 'month' };

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const pct_change = (current, previous) => {
    if (previous === 0) return current === 0 ? 0 : 100;
    return Math.round(((current - previous) / previous) * 1000) / 10;
};

class analytics_controller {
    // public beacon from the live site: { path, visitor_id, referrer, duration_ms }
    async track(req, res) {
        try {
            const { path, visitor_id, referrer, duration_ms } = req.body;

            if (typeof path !== 'string' || !path.startsWith('/') || path.length > 300) {
                return ApiResponse.error(res, 'Invalid path', 400);
            }
            if (typeof visitor_id !== 'string' || !/^[a-zA-Z0-9-]{8,100}$/.test(visitor_id)) {
                return ApiResponse.error(res, 'Invalid visitor id', 400);
            }

            let referrer_host = '';
            if (typeof referrer === 'string' && referrer) {
                try {
                    const host = new URL(referrer).hostname.replace(/^www\./, '');
                    // own-site navigation is not an external source
                    const own = process.env.FRONTEND_URL
                        ? new URL(process.env.FRONTEND_URL).hostname.replace(/^www\./, '')
                        : 'localhost';
                    if (host && host !== own) referrer_host = host;
                } catch {
                    referrer_host = '';
                }
            }

            const duration = Number(duration_ms);
            await PageView.create({
                path,
                visitor_id,
                referrer_host,
                duration_ms: Number.isFinite(duration) ? Math.max(0, Math.min(duration, 3 * 60 * 60 * 1000)) : 0,
            });

            return ApiResponse.success(res, 'Tracked', null, 201);
        } catch (error) {
            return ApiResponse.error(res, 'Error tracking view', 500, error.message);
        };
    }

    // admin: everything the Site Analytics view renders, for one range
    async summary(req, res) {
        try {
            const range = RANGES[req.query.range] ? req.query.range : '7d';
            const days = RANGES[range];

            const now = new Date();
            const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
            const prev_since = new Date(since.getTime() - days * 24 * 60 * 60 * 1000);

            const kpis_for = async (from, to) => {
                const [counts] = await PageView.aggregate([
                    { $match: { createdAt: { $gte: from, $lt: to } } },
                    {
                        $group: {
                            _id: null,
                            page_views: { $sum: 1 },
                            visitors: { $addToSet: '$visitor_id' },
                        }
                    },
                    {
                        $project: {
                            page_views: 1,
                            visitors: { $size: '$visitors' },
                        }
                    },
                ]);

                // a "session" is one visitor's activity within one day
                const [session] = await PageView.aggregate([
                    { $match: { createdAt: { $gte: from, $lt: to } } },
                    {
                        $group: {
                            _id: {
                                visitor: '$visitor_id',
                                day: { $dateTrunc: { date: '$createdAt', unit: 'day' } },
                            },
                            duration: { $sum: '$duration_ms' },
                        }
                    },
                    { $group: { _id: null, avg_session_ms: { $avg: '$duration' } } },
                ]);

                const contacts = await ContactMessage.countDocuments({ createdAt: { $gte: from, $lt: to } });

                return {
                    visitors: counts?.visitors ?? 0,
                    page_views: counts?.page_views ?? 0,
                    avg_session_ms: Math.round(session?.avg_session_ms ?? 0),
                    contacts,
                };
            };

            const current = await kpis_for(since, now);
            const previous = await kpis_for(prev_since, since);

            const kpis = Object.fromEntries(
                Object.keys(current).map((key) => [key, {
                    value: current[key],
                    trend_pct: pct_change(current[key], previous[key]),
                }])
            );

            // chart: unique visitors bucketed by day / week / month
            const unit = CHART_UNIT[range];
            const buckets = await PageView.aggregate([
                { $match: { createdAt: { $gte: since, $lt: now } } },
                {
                    $group: {
                        _id: { $dateTrunc: { date: '$createdAt', unit } },
                        visitors: { $addToSet: '$visitor_id' },
                    }
                },
                { $project: { visitors: { $size: '$visitors' } } },
                { $sort: { _id: 1 } },
            ]);
            const chart = buckets.map((bucket, i) => {
                const date = new Date(bucket._id);
                const label = unit === 'day' ? DAY_LABELS[date.getUTCDay()]
                    : unit === 'month' ? MONTH_LABELS[date.getUTCMonth()]
                        : `W${i + 1}`;
                return { label, value: bucket.visitors };
            });

            // top sources by unique visitors; empty referrer = direct traffic
            const source_rows = await PageView.aggregate([
                { $match: { createdAt: { $gte: since, $lt: now } } },
                {
                    $group: {
                        _id: { $ifNull: ['$referrer_host', ''] },
                        visitors: { $addToSet: '$visitor_id' },
                    }
                },
                { $project: { visitors: { $size: '$visitors' } } },
                { $sort: { visitors: -1 } },
                { $limit: 4 },
            ]);
            const source_total = source_rows.reduce((sum, row) => sum + row.visitors, 0);
            const sources = source_rows.map((row) => ({
                label: row._id || 'Direct',
                pct: source_total ? Math.round((row.visitors / source_total) * 100) : 0,
            }));

            // top pages: views + avg time from views, bounce from sessions
            const page_rows = await PageView.aggregate([
                { $match: { createdAt: { $gte: since, $lt: now } } },
                {
                    $group: {
                        _id: '$path',
                        views: { $sum: 1 },
                        avg_time_ms: { $avg: '$duration_ms' },
                    }
                },
                { $sort: { views: -1 } },
                { $limit: 5 },
            ]);
            const sessions = await PageView.aggregate([
                { $match: { createdAt: { $gte: since, $lt: now } } },
                {
                    $group: {
                        _id: {
                            visitor: '$visitor_id',
                            day: { $dateTrunc: { date: '$createdAt', unit: 'day' } },
                        },
                        paths: { $addToSet: '$path' },
                        views: { $sum: 1 },
                    }
                },
            ]);
            const top_pages = page_rows.map((row) => {
                const touching = sessions.filter((s) => s.paths.includes(row._id));
                const bounced = touching.filter((s) => s.views === 1).length;
                return {
                    page: row._id,
                    views: row.views,
                    avg_time_ms: Math.round(row.avg_time_ms ?? 0),
                    bounce_pct: touching.length ? Math.round((bounced / touching.length) * 100) : 0,
                };
            });

            return ApiResponse.success(res, 'Analytics summary retrieved successfully', {
                range,
                kpis,
                chart,
                sources,
                top_pages,
            });
        } catch (error) {
            return ApiResponse.error(res, 'Error building analytics summary', 500, error.message);
        };
    }
}

module.exports = new analytics_controller;
