/**
 * Single source of truth for every piece of CyberGreen copy on the site.
 *
 * Rule: no page or component types a stat, phone number, service bullet or
 * quote directly into JSX. Everything is declared here once, typed, and
 * imported. Facts that appear on several pages (contact details, the four
 * service areas, the e-waste figures) therefore cannot drift out of sync.
 *
 * Source material: CyberGreen Company Profile PDF plus the three brand
 * posters. Official statements (vision, mission, core purpose) are verbatim.
 */

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type IconName =
  | "recycle"
  | "shield"
  | "cpu"
  | "flask"
  | "leaf"
  | "lock"
  | "users"
  | "lightbulb"
  | "scale"
  | "graduation"
  | "heart"
  | "sprout";

export interface ServiceArea {
  /** In-page anchor id, used by homepage pillar cards to deep-link. */
  slug: string;
  /** Key into the `photos` map below, for the section's image. */
  photo?: keyof typeof photos;
  name: string;
  /** One-sentence summary, straight from the company profile. */
  summary: string;
  /** Shorter line used on the compact homepage pillar cards. */
  pillarSummary: string;
  icon: IconName;
  /** Heading for the main bullet list - the profile varies the wording. */
  itemsLabel: string;
  items: readonly string[];
  benefits?: readonly string[];
}

export interface Stat {
  /** Numeric portion, animated by <Stat> counting up from zero. */
  value: number;
  /** Rendered before the number, e.g. "<" or "UGX ". */
  prefix?: string;
  /** Rendered after the number, e.g. "%" or "+". */
  suffix?: string;
  /** Decimal places to hold while counting - used by the 22.3% figure. */
  decimals?: number;
  label: string;
  detail?: string;
}

export interface ValueItem {
  name: string;
  description: string;
  icon: IconName;
}

export interface TipGroup {
  audience: string;
  hashtag: string;
  tips: readonly { title: string; detail: string }[];
}

export interface Poster {
  title: string;
  description: string;
  /** Path under /public/downloads - the real, print-ready file once supplied. */
  file: string;
  alt: string;
  /** Key into `photos`, used for the card's preview image until the real
   *  poster artwork is dropped into /public/downloads. */
  previewPhoto: keyof typeof photos;
}

/**
 * Photography. Hosted on Unsplash (free licence, commercial use permitted,
 * no attribution required) and served through next/image, which is allowed
 * to fetch images.unsplash.com via next.config.ts. Swap any `src` for a
 * local /images/... path once CyberGreen's own photography is available.
 */
export const photos = {
  dataCentre: {
    src: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&q=80&auto=format&fit=crop",
    alt: "An engineer with a laptop inspecting server racks in a data centre.",
  },
  classroom: {
    src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80&auto=format&fit=crop",
    alt: "A teacher addressing a classroom of school pupils at their desks.",
  },
  workshop: {
    src: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200&q=80&auto=format&fit=crop",
    alt: "A trainer presenting at a whiteboard during a workshop session.",
  },
  solar: {
    src: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80&auto=format&fit=crop",
    alt: "Rows of solar panels in a field, seen from the air.",
  },
} as const;

/**
 * Full-bleed hero background photography, one per page. Dark, high-quality
 * images so a canopy-to-transparent gradient can sit over them and keep
 * white text legible - this replaces the flat canopy-green hero bands.
 */
export const heroPhotos = {
  home: {
    src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=2000&q=80&auto=format&fit=crop",
    alt: "Macro photograph of an illuminated circuit board.",
  },
  services: {
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=2000&q=80&auto=format&fit=crop",
    alt: "Close-up of electronic components on a circuit board.",
  },
  about: {
    src: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=2000&q=80&auto=format&fit=crop",
    alt: "Aerial view of forest meeting a turquoise lake.",
  },
  resources: {
    src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=2000&q=80&auto=format&fit=crop",
    alt: "City lights across the earth, seen from orbit at night.",
  },
  contact: {
    src: "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=2000&q=80&auto=format&fit=crop",
    alt: "A laptop glowing with coloured light in a dark room.",
  },
} as const;

/* ------------------------------------------------------------------ */
/* Identity and contact                                                */
/* ------------------------------------------------------------------ */

export const company = {
  registeredName: "CyberGreen Engineering Solutions Co. Ltd",
  tradingName: "CyberGreen",
  tagline: "Safer Digital Lives. Sustainable Futures.",
} as const;

export const contact = {
  addressLine: "Old Portbell Road, Nakawa",
  city: "Kampala, Uganda",
  poBox: "P.O. Box 198146, Kampala",
  email: "cybergreenengineering@gmail.com",
  /**
   * The number used on the company profile, the main infographic and the
   * digital-safety poster. A second number (+256 752 320 001) appears only on
   * the e-waste hazards poster; per the brief it is withheld until the client
   * confirms which numbers are public-facing.
   */
  phone: "+256 772 888 866",
  phoneHref: "tel:+256772888866",
  website: "www.cybergreen.co.ug",
  websiteHref: "https://www.cybergreen.co.ug",
  social: {
    label: "@cybergreenuganda",
    platform: "X",
    href: "https://x.com/cybergreenuganda",
  },
} as const;

export const hashtags = [
  "#RecycleUganda",
  "#ResponsibleTech",
  "#SustainableUganda",
  "#EWasteManagement",
  "#YouthOnlineSafety",
  "#DigitalParenting",
  "#SafeSchools",
] as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
] as const;

/* ------------------------------------------------------------------ */
/* Home hero                                                           */
/* ------------------------------------------------------------------ */

export const hero = {
  headline: "Safer digital lives. Sustainable futures.",
  supporting:
    "CyberGreen keeps Uganda's discarded electronics out of the ground and its people out of harm's way online - through responsible e-waste management, secure data destruction, and cybersecurity training that communities actually use.",
  primaryCta: { label: "Partner with us", href: "/contact" },
  secondaryCta: { label: "Explore our services", href: "/services" },
} as const;

/* ------------------------------------------------------------------ */
/* 8.1 About                                                           */
/* ------------------------------------------------------------------ */

export const aboutParagraphs = [
  "CyberGreen Engineering Solutions Co. Ltd is an innovative Ugandan engineering, technology, and sustainability company committed to creating safer digital communities and a cleaner environment. We provide integrated solutions in electronic waste (e-waste) management, online safety and cybersecurity training and awareness, ICT consultancy, engineering services, research, and capacity building.",
  "As Uganda embraces rapid digital transformation, new opportunities are emerging alongside significant environmental and cybersecurity challenges. Increasing volumes of discarded electronic and electric devices, rising cybercrime, digital fraud, online exploitation, and low cybersecurity awareness continue to threaten individuals, businesses, institutions, and communities.",
  "CyberGreen was established to address these interconnected challenges through practical, sustainable, and technology-driven solutions that protect both people and the planet.",
  "Headquartered in Nakawa, Kampala, our multidisciplinary team combines engineering expertise, environmental stewardship, information security knowledge, and community engagement to promote responsible technology use across Uganda and beyond.",
] as const;

/** Condensed intro for the homepage - the dual mandate in plain language. */
export const homeIntro =
  "Two problems are growing at the same time in Uganda: the electronics we throw away, and the people who get scammed, exposed or bullied online. CyberGreen was built to work on both at once - collecting and safely processing e-waste, destroying the data still sitting on it, and training youth, parents, schools and businesses to use technology without being harmed by it.";

/* ------------------------------------------------------------------ */
/* 8.2 Vision, mission, core purpose                                   */
/* ------------------------------------------------------------------ */

export const vision = "To build a greener, safer, and digitally secure Uganda.";

export const mission =
  "To reduce electronic waste hazards while empowering communities with cyber awareness, digital resilience, and secure technology access through innovative engineering solutions, education, and sustainable partnerships.";

export const corePurposeStatement =
  "We believe technology should improve lives without compromising environmental sustainability or digital security.";

export const corePurposePoints = [
  "Promote responsible electronic waste management.",
  "Improve cybersecurity awareness.",
  "Enhance digital resilience.",
  "Support sustainable engineering practices.",
  "Build digitally responsible communities.",
] as const;

/* ------------------------------------------------------------------ */
/* 8.3 Values, impact goals, differentiators                           */
/* ------------------------------------------------------------------ */

export const coreValues: readonly ValueItem[] = [
  {
    name: "Sustainability",
    description: "Protecting our environment for future generations.",
    icon: "sprout",
  },
  {
    name: "Integrity",
    description: "Operating ethically, honestly, and transparently.",
    icon: "scale",
  },
  {
    name: "Innovation",
    description: "Delivering creative, practical, and impactful solutions.",
    icon: "lightbulb",
  },
  {
    name: "Community Impact",
    description: "Empowering communities through education and technology.",
    icon: "heart",
  },
  {
    name: "Security",
    description: "Promoting safe, resilient, and trusted digital ecosystems.",
    icon: "shield",
  },
] as const;

export const impactGoals = [
  "Divert more than 10 tonnes of e-waste from landfills annually.",
  "Train over 5,000 individuals in online safety and cybersecurity awareness.",
  "Support schools in implementing digital safety programmes.",
  "Promote secure disposal of ICT assets.",
  "Create green employment opportunities.",
  "Advance Uganda's digital resilience and environmental sustainability agenda.",
] as const;

/**
 * The two headline goals that carry a figure, for the homepage. The third
 * homepage goal - supporting schools - has no number in the source profile,
 * so it is rendered as a statement rather than invented as a metric.
 */
export const impactGoalStats: readonly Stat[] = [
  {
    value: 10,
    suffix: "+",
    label: "Tonnes of e-waste",
    detail: "Targeted for diversion from landfills every year.",
  },
  {
    value: 5000,
    suffix: "+",
    label: "People trained",
    detail: "In online safety and cybersecurity awareness.",
  },
] as const;

/** Non-numeric companion goal shown alongside the two figures above. */
export const impactGoalStatement = {
  title: "Schools supported",
  detail:
    "Helping schools across Uganda put digital safety programmes into practice.",
} as const;

export const whyChooseUs = [
  "Qualified engineering professionals",
  "Community-centered approach",
  "Strong commitment to sustainability",
  "Data security expertise",
  "Innovative training methodologies",
  "Affordable, scalable solutions",
  "Reliable partnerships",
  "Customer-focused service",
] as const;

/* ------------------------------------------------------------------ */
/* 8.4 Challenges addressed                                            */
/* ------------------------------------------------------------------ */

export const challenges = [
  {
    title: "Electronic waste",
    icon: "recycle" as IconName,
    intro:
      "Uganda generates more than 10,000 tonnes of electronic waste annually, much of which is disposed of through unsafe methods that pollute the environment and expose sensitive data.",
    items: [
      "Unsafe disposal",
      "Environmental pollution",
      "Data leakage",
      "Loss of recyclable materials",
      "Low public awareness",
      "Weak circular economy practices",
    ],
  },
  {
    title: "Online safety & cybersecurity",
    icon: "shield" as IconName,
    intro:
      "As internet access, mobile money, cloud computing, and digital services continue expanding, cyber risks have grown significantly.",
    items: [
      "Mobile money fraud",
      "Phishing attacks",
      "Identity theft",
      "Online scams",
      "Cyberbullying",
      "Digital misinformation",
      "Social engineering attacks",
      "Poor cybersecurity hygiene",
    ],
  },
] as const;

export const cybercrimeStat = {
  quote:
    "Cybercriminals reportedly stole more than UGX 72 billion from Ugandans in 2024.",
  value: 72,
  prefix: "UGX ",
  suffix: " billion",
  label: "Stolen from Ugandans by cybercriminals in 2024",
} as const;

/* ------------------------------------------------------------------ */
/* 8.5 Services                                                        */
/* ------------------------------------------------------------------ */

export const services: readonly ServiceArea[] = [
  {
    slug: "e-waste-management",
    photo: "solar",
    name: "E-Waste Management",
    summary:
      "We provide environmentally responsible electronic waste solutions that support sustainability while protecting sensitive information.",
    pillarSummary:
      "Collection, refurbishment and certified data destruction for end-of-life electronics.",
    icon: "recycle",
    itemsLabel: "Services",
    items: [
      "E-waste collection",
      "Transportation",
      "Sorting and segregation",
      "Device refurbishment",
      "Secure data sanitization",
      "Certified data destruction",
      "Asset disposal",
      "Sustainability reporting",
      "Regulatory compliance support",
    ],
    benefits: [
      "Environmental protection",
      "Secure information disposal",
      "Circular economy promotion",
      "Reduced landfill waste",
      "Corporate ESG compliance",
    ],
  },
  {
    slug: "online-safety-cybersecurity",
    photo: "classroom",
    name: "Online Safety & Cybersecurity",
    summary:
      "We empower individuals and organizations with practical digital safety knowledge.",
    pillarSummary:
      "Training and awareness for youth, parents, schools and SMEs across Uganda.",
    icon: "shield",
    itemsLabel: "Services",
    items: [
      "Online safety education",
      "Cybersecurity awareness training",
      "Digital citizenship",
      "Parent awareness programmes",
      "Child online protection",
      "Social media safety",
      "Phishing awareness",
      "Cyber hygiene workshops",
      "School internet safety programmes",
      "SME cybersecurity awareness",
      "Community digital literacy campaigns",
    ],
  },
  {
    slug: "engineering-ict-consultancy",
    photo: "dataCentre",
    name: "Engineering & ICT Consultancy",
    summary:
      "Our consultancy services help organizations adopt secure, efficient, and sustainable technologies.",
    pillarSummary:
      "Advisory on digital transformation, risk management and infrastructure planning.",
    icon: "cpu",
    itemsLabel: "Areas of expertise",
    items: [
      "ICT consultancy",
      "Engineering advisory",
      "Digital transformation",
      "Information security awareness",
      "Technology policy guidance",
      "Risk management",
      "Infrastructure planning",
      "Sustainable technology implementation",
    ],
  },
  {
    slug: "research-capacity-building",
    photo: "workshop",
    name: "Research & Capacity Building",
    summary:
      "CyberGreen undertakes applied research to support evidence-based policy and sustainable technology adoption.",
    pillarSummary:
      "Applied research, workshops and school engagements that build lasting local capability.",
    icon: "flask",
    itemsLabel: "Activities",
    items: [
      "Research studies",
      "Training programmes",
      "Community outreach",
      "School engagements",
      "Awareness campaigns",
      "Educational content development",
      "Workshops and seminars",
    ],
  },
] as const;

/* ------------------------------------------------------------------ */
/* 8.6 Uganda e-waste statistics                                       */
/* ------------------------------------------------------------------ */

/** The three gut-punch figures used on the homepage. */
export const headlineEwasteStats: readonly Stat[] = [
  {
    value: 41000,
    label: "Tonnes generated",
    detail: "E-waste produced in Uganda in 2022.",
  },
  {
    value: 200,
    label: "Tonnes recycled",
    detail: "The share of that total formally collected and recycled.",
  },
  {
    value: 1,
    prefix: "<",
    suffix: "%",
    label: "Formally recycled in Africa",
    detail:
      "Less than one percent of Africa's e-waste is documented as formally collected and recycled.",
  },
] as const;

/** The fuller set, used on the Resources hazards section. */
export const ewasteStats: readonly Stat[] = [
  {
    value: 41000,
    label: "Tonnes in Uganda (2022)",
    detail:
      "Up from 33,000 tonnes in 2019 - roughly 24% growth in three years.",
  },
  {
    value: 200,
    label: "Tonnes formally recycled",
    detail: "Out of the 41,000 tonnes Uganda generated.",
  },
  {
    value: 45.9,
    decimals: 1,
    suffix: "M+",
    label: "Uganda's population (2024)",
    detail: "More people, more devices, more e-waste.",
  },
  {
    value: 62,
    suffix: "M",
    label: "Tonnes generated globally (2022)",
    detail: "A world record, of which only 22.3% was formally recycled.",
  },
  {
    value: 82,
    suffix: "M",
    label: "Tonnes projected by 2030",
    detail: "Global e-waste, if current trends continue.",
  },
  {
    value: 2500,
    label: "Tonnes of waste daily in Kampala",
    detail:
      "The city generates 2,000-2,500 tonnes a day, raising the risk of e-waste reaching dumpsites.",
  },
] as const;

export const fastestGrowingStreams =
  "Computers, mobile phones, TVs, batteries, and refrigerators are among the fastest-growing waste streams in the country.";

/* ------------------------------------------------------------------ */
/* 8.7 Target clients                                                  */
/* ------------------------------------------------------------------ */

export const targetClients = [
  "Government Ministries",
  "Local Governments",
  "Schools",
  "Universities",
  "NGOs",
  "Development Partners",
  "Financial Institutions",
  "SMEs",
  "Corporate Organizations",
  "Telecommunication Companies",
  "Healthcare Facilities",
  "Community Organizations",
  "Households",
] as const;

/* ------------------------------------------------------------------ */
/* 8.8 Health, environmental impacts, calls to action                  */
/* ------------------------------------------------------------------ */

export const healthImpacts = [
  {
    group: "Children",
    impacts: [
      "1 in 3 children exposed to e-waste risk lead poisoning",
      "Brain damage and respiratory illnesses",
    ],
  },
  {
    group: "Pregnant women",
    impacts: [
      "Increased risk of miscarriage and birth defects",
      "Developmental delays in children",
    ],
  },
  {
    group: "E-waste workers",
    impacts: [
      "Toxic exposure to hazardous substances",
      "Increased risk of severe health conditions",
    ],
  },
] as const;

export const environmentalImpacts = [
  {
    title: "Contaminated soil and reduced land productivity",
    detail:
      "Heavy metals from e-waste contaminate soil and reduce its ability to support crops.",
  },
  {
    title: "Polluted water sources",
    detail:
      "Toxic chemicals leach into rivers, lakes, and groundwater, threatening communities.",
  },
  {
    title: "Toxic air emissions from improper disposal and burning",
    detail:
      "Burning e-waste releases poisonous fumes linked to cancer, asthma, and respiratory diseases.",
  },
  {
    title: "Ecosystem contamination and biodiversity loss",
    detail:
      "Toxins harm wildlife, reduce biodiversity, and upset the balance of ecosystems.",
  },
] as const;

export const whatYouCanDo = [
  {
    title: "Repair and reuse devices",
    detail: "Extend the life of your devices and reduce waste.",
  },
  {
    title: "Dispose of e-waste responsibly",
    detail: "Never dump e-waste in bins, drains, or on land.",
  },
  {
    title: "Hand over obsolete electronics to certified recyclers",
    detail: "Use authorized collectors and recycling centers.",
  },
  {
    title: "Reduce landfill waste through recycling and recovery",
    detail: "Help recover valuable materials and protect nature.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* 8.9 Leadership                                                      */
/* ------------------------------------------------------------------ */

export const leadership = {
  name: "Eng. Muhangi Robert",
  title: "Managing Director & Lead Consultant",
  bio: [
    "A Telecommunications Engineer, Information Security specialist, researcher, and technology consultant with extensive experience in engineering systems, ICT infrastructure, aviation electronics, online safety and cybersecurity training and awareness, digital transformation, and environmental sustainability.",
    "He leads CyberGreen's strategic direction, partnerships, innovation, and technical service delivery, supported by a multidisciplinary team of engineers, technicians, trainers, researchers, marketing professionals, and data analysts committed to excellence and sustainable impact.",
  ],
  expertise: [
    "Electronic Waste Management",
    "Secure Data Sanitization",
    "Certified Data Destruction",
    "Online Safety training and Awareness",
    "Cybersecurity training and Awareness",
    "ICT Consultancy",
    "Engineering Consultancy",
    "Sustainability Solutions",
    "Research",
    "Capacity Building",
    "Community Engagement",
  ],
} as const;

/* ------------------------------------------------------------------ */
/* 8.10 Tech superpowers and safety basics                             */
/* ------------------------------------------------------------------ */

export const techSuperpowers = [
  { title: "Learn cool skills", detail: "Coding, design, digital art." },
  { title: "Find new interests", detail: "Explore hobbies." },
  { title: "Make friends everywhere", detail: "Talk to people globally." },
  {
    title: "Learn anything online",
    detail: "Ask questions, use web resources.",
  },
] as const;

export const safetyBasics = [
  { title: "Be kind online", detail: "No cyberbullying, respect peers." },
  {
    title: "Keep secrets safe",
    detail: "Use strong passwords, private profiles.",
  },
  { title: "Spot sneaky scams", detail: "Avoid scams and phishing." },
  {
    title: "Balance screen time",
    detail: "Play outside, screen breaks are good.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* 8.11 Guidance by audience                                           */
/* ------------------------------------------------------------------ */

export const audienceGuidance: readonly TipGroup[] = [
  {
    audience: "For Youth",
    hashtag: "#YouthOnlineSafety",
    tips: [
      { title: "Think before you post", detail: "Once shared, it's forever." },
      {
        title: "Protect your privacy",
        detail: "Strong passwords and settings.",
      },
      { title: "Speak up", detail: "Report cyberbullying." },
      {
        title: "Verify information",
        detail: "Check sources before sharing.",
      },
    ],
  },
  {
    audience: "For Parents & Guardians",
    hashtag: "#DigitalParenting",
    tips: [
      { title: "Talk openly", detail: "Discuss online experiences." },
      { title: "Set limits on screen time", detail: "Manage device use." },
      { title: "Be a role model", detail: "Practice safe habits." },
      { title: "Stay informed", detail: "Learn about digital trends." },
    ],
  },
  {
    audience: "For Schools & Educators",
    hashtag: "#SafeSchools",
    tips: [
      { title: "Teach online safety", detail: "Integrate into curriculum." },
      {
        title: "Establish clear policies",
        detail: "Encourage responsible use.",
      },
      {
        title: "Foster digital citizenship",
        detail: "Teach respect and empathy.",
      },
      { title: "Collaborate", detail: "Work with CyberGreen." },
    ],
  },
] as const;

/* ------------------------------------------------------------------ */
/* 8.12 Trainings offered                                              */
/* ------------------------------------------------------------------ */

export const trainings = [
  {
    name: "Workshops",
    detail: "Hands-on sessions for teams, communities and organisations.",
    icon: "users" as IconName,
  },
  {
    name: "School Programs",
    detail: "Internet safety programmes delivered with teachers and pupils.",
    icon: "graduation" as IconName,
  },
  {
    name: "Parent Sessions",
    detail: "Practical digital parenting guidance for families.",
    icon: "heart" as IconName,
  },
  {
    name: "Youth Clubs",
    detail: "Ongoing peer groups building digital citizenship and skills.",
    icon: "lightbulb" as IconName,
  },
] as const;

/* ------------------------------------------------------------------ */
/* 8.13 Downloadable posters                                           */
/* ------------------------------------------------------------------ */

export interface ExternalResource {
  title: string;
  publisher: string;
  description: string;
  href: string;
}

/**
 * Authoritative external references, for readers who want the primary sources
 * behind the statistics on this page or the regulators involved in Uganda.
 * Every URL was checked before being added - re-check if they go stale.
 */
export const externalResources: readonly ExternalResource[] = [
  {
    title: "The Global E-waste Monitor 2024",
    publisher: "ITU & UNITAR",
    description:
      "The primary source for the global figures quoted on this page, including the 62 million tonnes generated in 2022 and the 82 million tonne projection for 2030.",
    href: "https://ewastemonitor.info/the-global-e-waste-monitor-2024/",
  },
  {
    title: "National Environment Management Authority",
    publisher: "NEMA Uganda",
    description:
      "Uganda's environmental regulator - waste handling regulations, compliance requirements and licensing for organisations disposing of electronic equipment.",
    href: "https://www.nema.go.ug/",
  },
  {
    title: "Uganda Communications Commission",
    publisher: "UCC",
    description:
      "The national communications regulator, including consumer guidance on online safety, digital fraud and reporting cybercrime in Uganda.",
    href: "https://ucc.co.ug/",
  },
  {
    title: "Child Online Protection",
    publisher: "International Telecommunication Union",
    description:
      "ITU's global guidance for parents, educators and policymakers on keeping children safe online - the framework behind much of our schools programme.",
    href: "https://www.itu.int/en/ITU-D/Cybersecurity/Pages/COP.aspx",
  },
] as const;

export const posters: readonly Poster[] = [
  {
    title: "Responsible Tech: Securing Our Future, Greening Our Planet",
    description:
      "A comprehensive guide for empowered youth and informed parents - tech superpowers, online safety habits, and the e-waste call to action in one sheet.",
    file: "/downloads/responsible-tech-guide.jpg",
    alt: "CyberGreen poster titled Responsible Tech: Securing Our Future, Greening Our Planet, showing tech superpowers, online safety tips and e-waste guidance for youth and parents.",
    previewPhoto: "classroom",
  },
  {
    title: "Responsible Tech & Digital Safety: Building a Safer Digital Uganda",
    description:
      "Side-by-side guidance for youth, parents and guardians, and schools and educators, with the digital safety habits each group should build.",
    file: "/downloads/digital-safety-guide.jpg",
    alt: "CyberGreen poster titled Responsible Tech and Digital Safety, with three columns of guidance for youth, parents and guardians, and schools and educators.",
    previewPhoto: "workshop",
  },
  {
    title: "E-Waste Hazards & Call to Action",
    description:
      "The health and environmental impacts of e-waste in Uganda, the national and global statistics behind them, and what individuals can do.",
    file: "/downloads/ewaste-hazards.jpg",
    alt: "CyberGreen poster titled E-Waste Hazards and Call to Action, showing Uganda e-waste statistics, health impacts and environmental impacts.",
    previewPhoto: "solar",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Contact form                                                        */
/* ------------------------------------------------------------------ */

export const contactSubjects = [
  "E-waste pickup",
  "Training request",
  "Consultancy",
  "General inquiry",
] as const;
