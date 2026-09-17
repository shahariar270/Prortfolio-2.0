const trimTrailingSlash = (url) => url.replace(/\/+$/, '')

export const siteUrl =
  typeof import.meta.env.VITE_SITE_URL === 'string' && import.meta.env.VITE_SITE_URL
    ? trimTrailingSlash(import.meta.env.VITE_SITE_URL)
    : ''

export const siteName = 'Shahariar Portfolio'

/** Person / brand name used across the site and in structured data. */
export const siteAuthor = 'Shahariar'

/** Handle used on social profiles and as the Person alternateName. */
export const siteAlternateName = 'shahariar270'

/** Brand / organization name. */
export const siteBrand = 'Novakrift'

/** Flagship product / application name. */
export const siteProduct = 'Hisabox'

import logoPath from '../assets/images/logo.svg'

export const defaultDescription =
  'Official portfolio of Shahariar (shahariar270) — Founder of Novakrift and creator of Hisabox. Full-stack React & MERN developer building scalable web applications.'

/**
 * Core keywords surfaced on every page. The name, handle, brand, and product lead so
 * search engines associate the site with all target terms; page-level keywords are
 * merged in ahead of these via SeoHead.
 */
export const defaultKeywords = [
  'shahariar',
  'shahariar270',
  'Novakrift',
  'hisabox',
  'Hisabox',
  'Novakrift agency',
  'Shahariar developer',
  'Shahariar portfolio',
  'React developer',
  'MERN developer',
  'full-stack developer',
  'frontend developer',
]

/** Merge, dedupe (case-insensitively), and join keywords into a meta string. */
export function buildKeywords(pageKeywords = []) {
  const seen = new Set()
  const merged = []
  for (const kw of [...pageKeywords, ...defaultKeywords]) {
    const key = String(kw).trim().toLowerCase()
    if (!key || seen.has(key)) continue
    seen.add(key)
    merged.push(String(kw).trim())
  }
  return merged.join(', ')
}

export const defaultLogo = logoPath

/** Absolute URL for Open Graph / Twitter when using a root-relative asset path from Vite. */
export function absoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return undefined
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  const path = String(pathOrUrl).startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  if (!siteUrl) return path
  return `${siteUrl}${path}`
}

export const defaultOgImage =
  typeof import.meta.env.VITE_OG_IMAGE === 'string' && import.meta.env.VITE_OG_IMAGE
    ? import.meta.env.VITE_OG_IMAGE
    : defaultLogo
