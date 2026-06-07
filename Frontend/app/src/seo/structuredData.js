import { absoluteUrl, BUSINESS, SITE_NAME, SITE_URL } from "./siteConfig";

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: BUSINESS.legalName,
  url: SITE_URL,
  logo: absoluteUrl("/nandini.png"),
  email: BUSINESS.email,
  telephone: BUSINESS.phone,
  foundingDate: BUSINESS.foundingYear,
  address: {
    "@type": "PostalAddress",
    streetAddress: BUSINESS.address.street,
    addressLocality: BUSINESS.address.city,
    addressRegion: BUSINESS.address.region,
    postalCode: BUSINESS.address.postalCode,
    addressCountry: BUSINESS.address.country,
  },
  sameAs: Object.values(BUSINESS.social),
});

export const localBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Store",
  name: SITE_NAME,
  image: absoluteUrl("/nandini.png"),
  url: SITE_URL,
  telephone: BUSINESS.phone,
  email: BUSINESS.email,
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    streetAddress: BUSINESS.address.street,
    addressLocality: BUSINESS.address.city,
    addressRegion: BUSINESS.address.region,
    postalCode: BUSINESS.address.postalCode,
    addressCountry: BUSINESS.address.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 17.4015,
    longitude: 78.5682,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:00",
    closes: "19:00",
  },
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

export const productSchema = (product, imageUrl) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description || product.long_description,
  image: imageUrl,
  sku: String(product.id),
  brand: {
    "@type": "Brand",
    name: SITE_NAME,
  },
  offers: {
    "@type": "Offer",
    url: absoluteUrl(`/product/${product.id}`),
    priceCurrency: "INR",
    price: product.discount_price || product.price,
    availability:
      product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    seller: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  },
});

export const breadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});
