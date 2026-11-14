import { useEffect } from 'react';

interface MetaOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

function setMetaTag(selector: string, attrName: string, attrVal: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrVal);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function useMeta({ title, description, path = '/', image = '/og-image.png' }: MetaOptions): void {
  useEffect(() => {
    document.title = title;
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);

    const configuredSiteUrl =
      (import.meta.env.VITE_SITE_URL as string | undefined)?.trim() ||
      (typeof window !== 'undefined' ? window.location.origin : '');
    if (configuredSiteUrl && configuredSiteUrl.trim().length > 0) {
      const normalizedBase = configuredSiteUrl.replace(/\/+$/, '');
      const normalizedPath = path.startsWith('/') ? path : `/${path}`;
      const canonicalHref = `${normalizedBase}${normalizedPath}`;
      let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = canonicalHref;
      setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalHref);

      const absoluteImageUrl = image.startsWith('http')
        ? image
        : `${normalizedBase}${image.startsWith('/') ? image : `/${image}`}`;
      setMetaTag('meta[property="og:image"]', 'property', 'og:image', absoluteImageUrl);
      setMetaTag('meta[property="og:image:secure_url"]', 'property', 'og:image:secure_url', absoluteImageUrl);
      setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', absoluteImageUrl);
    }
  }, [title, description, path, image]);
}

