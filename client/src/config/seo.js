const trimTrailingSlash = (url) => url.replace(/\/+$/, '')

export const siteUrl =
  typeof import.meta.env.VITE_SITE_URL === 'string' && import.meta.env.VITE_SITE_URL
    ? trimTrailingSlash(import.meta.env.VITE_SITE_URL)
    : ''

export const siteName = 'Shahariar Portfolio'

import logoPath from '../assets/images/logo.svg'

export const defaultDescription =
  'Portfolio of Shahariar — React and MERN developer building dynamic web applications, responsive interfaces, and interactive experiences.'

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
