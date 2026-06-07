import { Helmet } from "react-helmet-async";
import {
  absoluteUrl,
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_TITLE,
  SITE_NAME,
} from "./siteConfig";

const Seo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  path = "/",
  image = "/nandini.png",
  type = "website",
  noindex = false,
  children,
}) => {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const canonical = absoluteUrl(path);
  const ogImage = image.startsWith("http") ? image : absoluteUrl(image);

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />

      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      )}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {import.meta.env.VITE_GOOGLE_SITE_VERIFICATION && (
        <meta
          name="google-site-verification"
          content={import.meta.env.VITE_GOOGLE_SITE_VERIFICATION}
        />
      )}

      {children}
    </Helmet>
  );
};

export const JsonLd = ({ data }) => (
  <Helmet>
    <script type="application/ld+json">{JSON.stringify(data)}</script>
  </Helmet>
);

export default Seo;
