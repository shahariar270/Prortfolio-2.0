import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import {
  absoluteUrl,
  buildKeywords,
  defaultDescription,
  defaultOgImage,
  defaultLogo,
  siteAlternateName,
  siteAuthor,
  siteBrand,
  siteName,
  siteUrl,
} from '../../config/seo'

export default function SeoHead({
  title,
  description = defaultDescription,
  image,
  type = 'website',
  keywords = [],
  noIndex = false,
}) {
  const { pathname } = useLocation()
  const pageTitle = title ? `${title} | ${siteName}` : siteName
  const canonical = siteUrl ? `${siteUrl}${pathname}` : undefined
  const resolvedImage = absoluteUrl(image || defaultOgImage)
  const logoUrl = absoluteUrl(defaultLogo) ?? defaultLogo
  const twitterCard = resolvedImage ? 'summary_large_image' : 'summary'
  const keywordsContent = buildKeywords(keywords)

  const personLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteAuthor,
    alternateName: siteAlternateName,
    jobTitle: 'React & MERN Developer',
    description: defaultDescription,
    ...(siteUrl ? { url: siteUrl } : {}),
    image: resolvedImage || logoUrl,
    worksFor: {
      '@type': 'Organization',
      name: siteBrand,
      ...(siteUrl ? { url: siteUrl } : {}),
    },
  }

  return (
    <Helmet prioritizeSeoTags>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsContent} />
      <meta name="author" content={siteAuthor} />
      {noIndex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow" />
      )}
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      <link rel="icon" href={logoUrl} />
      <link rel="apple-touch-icon" href={logoUrl} />

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      <meta property="og:site_name" content={siteName} />
      {resolvedImage ? <meta property="og:image" content={resolvedImage} /> : null}

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      {resolvedImage ? <meta name="twitter:image" content={resolvedImage} /> : null}

      <script type="application/ld+json">{JSON.stringify(personLd)}</script>
    </Helmet>
  )
}
