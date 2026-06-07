export const SITE_URL =
  import.meta.env.VITE_SITE_URL || "https://nandhinicrafts.netlify.app";

export const SITE_NAME = "Nandhini Brass & Metals";

export const DEFAULT_TITLE =
  "Nandhini Brass & Metals | Buy Brass & Silver Idols Online India";

export const DEFAULT_DESCRIPTION =
  "Shop premium handcrafted brass idols, silver god statues, pooja items & temple gajastambham work. Lord Ganesha, Shiva, Krishna idols. PAN India shipping from Hyderabad.";

export const DEFAULT_KEYWORDS = [
  "brass idols",
  "silver idols",
  "brass god statues",
  "silver god idols",
  "buy brass idols online",
  "buy silver idols online india",
  "brass pooja items",
  "temple gajastambham",
  "dhvajastambha cladding",
  "handcrafted brass idols hyderabad",
  "nandhini brass metals",
  "metal idols india",
].join(", ");

export const BUSINESS = {
  name: SITE_NAME,
  legalName: "Nandhini Brass & Metals",
  email: "heritage@nandhini.com",
  phone: "+919848012345",
  address: {
    street: "Uppal Industrial Estate",
    city: "Hyderabad",
    region: "Telangana",
    postalCode: "500039",
    country: "IN",
  },
  gstin: "36ANUPY8270B1ZB",
  foundingYear: "1998",
  social: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    youtube: "https://www.youtube.com/",
  },
};

export const absoluteUrl = (path = "") => {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL.replace(/\/$/, "")}${clean === "/" ? "" : clean}`;
};
