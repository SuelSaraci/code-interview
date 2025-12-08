import { Helmet } from "react-helmet-async";

interface PageMetaProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

/**
 * Component for setting page-specific meta tags
 * Usage: <PageMeta title="Page Title" description="Page description" />
 */
export function PageMeta({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  twitterTitle,
  twitterDescription,
  twitterImage,
}: PageMetaProps) {
  const baseTitle = "CodeInterview - Master Coding Interviews";
  const baseDescription =
    "Practice coding interview questions, improve your skills, and land your dream job. 200+ questions across multiple languages and difficulty levels.";
  const baseUrl = "https://codeinterview.app";
  const defaultImage = "/og-image.png";

  const pageTitle = title ? `${title} | ${baseTitle}` : baseTitle;
  const pageDescription = description || baseDescription;
  const pageOgTitle = ogTitle || title || baseTitle;
  const pageOgDescription = ogDescription || description || baseDescription;
  const pageOgImage = ogImage || defaultImage;
  const pageOgUrl = ogUrl || baseUrl;
  const pageTwitterTitle = twitterTitle || ogTitle || title || baseTitle;
  const pageTwitterDescription =
    twitterDescription || ogDescription || description || baseDescription;
  const pageTwitterImage = twitterImage || ogImage || defaultImage;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageOgUrl} />
      <meta property="og:title" content={pageOgTitle} />
      <meta property="og:description" content={pageOgDescription} />
      <meta property="og:image" content={pageOgImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={pageOgUrl} />
      <meta property="twitter:title" content={pageTwitterTitle} />
      <meta property="twitter:description" content={pageTwitterDescription} />
      <meta property="twitter:image" content={pageTwitterImage} />
    </Helmet>
  );
}

