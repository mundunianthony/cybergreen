/**
 * Single source of truth for organisation details, routes and navigation.
 * The original site repeated these on all eight pages.
 */

export const routes = {
  home: "/",
  about: "/about",
  services: "/services",
  ewaste: "/e-waste",
  onlineSafety: "/online-safety",
  childProtection: "/child-online-protection",
  resources: "/resources",
  contact: "/contact",
} as const;

export type RoutePath = (typeof routes)[keyof typeof routes];

/** In-page anchors that other pages and the footer link to. Changing these breaks inbound links. */
export const anchors = {
  pickup: "pickup",
  accept: "accept",
  help: "help",
} as const;

export const site = {
  name: "CyberGreen",
  legalName: "CyberGreen Engineering Solutions Co. Ltd",
  url: "https://www.cybergreen.co.ug",
  displayDomain: "www.cybergreen.co.ug",
  description: "A Ugandan engineering company working on e-waste, online safety and child online protection.",
  logoAlt: "CyberGreen: Safer Digital Lives. Sustainable Futures.",
  phone: {
    display: "+256 772 888 866",
    tel: "+256772888866",
    /** International number without "+" as required by wa.me links. */
    whatsapp: "256772888866",
  },
  email: "cybergreenengineering@gmail.com",
  address: {
    venue: "National ICT Innovation Hub",
    street: "Old Portbell Road, Nakawa, Kampala",
    postal: "P.O. Box 198146, Kampala",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=National+ICT+Innovation+Hub+Nakawa+Kampala",
  },
  x: { handle: "@cybergreenuganda", url: "https://x.com/cybergreenuganda" },
  hours: "Monday to Friday, 8:30am to 5:30pm",
  hashtags: [
    "#RecycleUganda",
    "#ResponsibleTech",
    "#SustainableUganda",
    "#EWasteManagement",
    "#YouthOnlineSafety",
    "#DigitalParenting",
    "#SafeSchools",
  ],
  defaultOgImage: "/assets/posters/01_ewaste_by_the_numbers.jpg",
} as const;

export interface NavItem {
  href: RoutePath;
  label: string;
}

/** Main menu, in order. The "Contact us" button is rendered separately. */
export const mainNav: readonly NavItem[] = [
  { href: routes.home, label: "Home" },
  { href: routes.about, label: "About" },
  { href: routes.services, label: "Services" },
  { href: routes.ewaste, label: "E-waste pickup" },
  { href: routes.onlineSafety, label: "Online safety" },
  { href: routes.childProtection, label: "Child online protection" },
  { href: routes.resources, label: "Resources" },
];

export const contactNav: NavItem = { href: routes.contact, label: "Contact us" };

/** Footer "Site" column. */
export const footerNav: readonly NavItem[] = [
  { href: routes.about, label: "About" },
  { href: routes.services, label: "Services" },
  { href: routes.ewaste, label: "E-waste pickup" },
  { href: routes.onlineSafety, label: "Online safety" },
  { href: routes.childProtection, label: "Child online protection" },
  { href: routes.resources, label: "Resources" },
  { href: routes.contact, label: "Contact" },
];

/** Items shown in the "What we collect" marquee (home and e-waste pages). */
export const collectedItems = [
  "Mobile phones",
  "Feature phones",
  "Laptops",
  "Desktop computers",
  "Monitors",
  "Chargers and cables",
  "Solar lanterns",
  "Solar home system batteries",
  "Routers and modems",
  "TV decoders",
  "Radios",
  "Printers",
  "UPS units",
  "Old TVs",
  "Tablets",
  "Power banks",
] as const;
