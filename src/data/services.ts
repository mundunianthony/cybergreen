import type { IconName } from "../components/icons";
import { routes } from "./site";

export interface ServiceList {
  heading: string;
  items: readonly string[];
}

export interface Service {
  /** Anchor id on /services. Linked from the footer and home page; do not rename. */
  id: "e-waste" | "online-safety" | "consultancy" | "research" | "child-protection";
  /** Short name used in the services sub-nav, footer and home cards. */
  label: string;
  /** Heading on the services page. */
  heading: string;
  icon: IconName;
  lead: string;
  body: string;
  cta: { label: string; href: string };
  lists: readonly ServiceList[];
  /** Home page card summary. Services without one are not shown as a home card. */
  card?: { num: string; text: string };
}

export const services: readonly Service[] = [
  {
    id: "e-waste",
    label: "E-waste management",
    heading: "E-waste management",
    icon: "recycle",
    lead: "Environmentally responsible handling of electronic waste that also protects the information stored on it.",
    body: "We serve institutions retiring whole computer labs and households with a drawer of old phones. Everything is logged, data is dealt with first, working devices are refurbished, and the rest goes to licensed handlers.",
    cta: { label: "E-waste pickup and data destruction", href: routes.ewaste },
    lists: [
      {
        heading: "Services",
        items: [
          "E-waste collection",
          "Transportation",
          "Sorting and segregation",
          "Device repair and refurbishment",
          "Secure data sanitisation",
          "Certified data destruction",
          "Asset disposal",
          "Sustainability reporting",
          "Regulatory compliance support",
        ],
      },
      {
        heading: "Benefits",
        items: [
          "Environmental protection",
          "Secure disposal of information",
          "Circular economy",
          "Less waste in dumpsites and landfill",
          "Support for ESG reporting",
        ],
      },
    ],
    card: {
      num: "01",
      text: "Collection, sorting, refurbishment and certified data destruction for retired electronics.",
    },
  },
  {
    id: "online-safety",
    label: "Online safety and cybersecurity",
    heading: "Online safety and cybersecurity training",
    icon: "shield",
    lead: "Practical digital safety knowledge for individuals, families, schools and organisations.",
    body: "Our sessions use real examples from Uganda: mobile money reversal scams, fake job and scholarship offers, WhatsApp account takeovers and cyberbullying among learners. People leave knowing what to do, not just what to fear.",
    cta: { label: "Programmes for schools and communities", href: routes.onlineSafety },
    lists: [
      {
        heading: "Services",
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
    ],
    card: { num: "02", text: "Practical sessions for learners, parents, teachers, communities and small businesses." },
  },
  {
    id: "consultancy",
    label: "Engineering and ICT consultancy",
    heading: "Engineering and ICT consultancy",
    icon: "chip",
    lead: "Helping organisations adopt secure, efficient and sustainable technology.",
    body: "From planning a school ICT lab that will be easy to maintain, to writing a device disposal policy, to advising on how to extend the life of equipment, we bring an engineer's view to decisions that are usually made on price alone.",
    cta: { label: "Discuss a project", href: routes.contact },
    lists: [
      {
        heading: "Areas of expertise",
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
    ],
    card: { num: "03", text: "Advice on secure, efficient and sustainable technology, from infrastructure to policy." },
  },
  {
    id: "research",
    label: "Research and capacity building",
    heading: "Research and capacity building",
    icon: "book",
    lead: "Applied research that supports evidence-based policy and sustainable technology adoption.",
    body: "Uganda has good e-waste policies on paper but little data on what actually happens to devices at the end of their life. We gather that evidence, share it with partners and turn it into training and learning materials.",
    cta: { label: "Partner on research", href: routes.contact },
    lists: [
      {
        heading: "Activities",
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
    ],
    card: {
      num: "04",
      text: "Applied studies, training programmes and learning materials that support better policy.",
    },
  },
  {
    id: "child-protection",
    label: "Child online protection",
    heading: "Child online protection",
    icon: "child",
    lead: "Helping children in Uganda use the internet safely, and helping the adults around them protect them.",
    body: "Most online abuse of children is carried out by someone the child already knows, and most children tell no one. Our programmes give schools, parents and child-focused organisations the knowledge, policies and referral routes to prevent harm and act quickly when it happens.",
    cta: { label: "Child online protection", href: routes.childProtection },
    lists: [
      {
        heading: "Services",
        items: [
          "School child online protection programmes",
          "Teacher and counsellor training",
          "Parent and caregiver sessions",
          "Safeguarding and online safety policies",
          "Child-friendly learning materials",
          "Digital Safety Clubs",
          "Community and radio campaigns",
          "Research on children's online experiences",
        ],
      },
    ],
  },
];

export const serviceHref = (id: Service["id"]): string => `${routes.services}#${id}`;
