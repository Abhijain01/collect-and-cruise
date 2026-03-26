import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, keywords, canonical, ogImage }) => {
  const currentUrl = window.location.href;
  const siteName = "Collect & Cruise";

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical || currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteName} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical || currentUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      {ogImage && <meta property="twitter:image" content={ogImage} />}

      {/* Organization JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Collect & Cruise",
          "url": "https://collect-and-cruise.vercel.app",
          "logo": "https://collect-and-cruise.vercel.app/vite.svg",
          "description": "Online diecast model car store selling Hot Wheels, Matchbox and Majorette to collectors in India.",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
