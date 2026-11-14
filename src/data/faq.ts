export interface FaqItem {
  question: string;
  answer: string;
  open?: boolean;
}

export const ewasteFaq: readonly FaqItem[] = [
  {
    question: "Do you charge for collection?",
    answer:
      "Households can bring items to our community drop-off days for free. For organisations we quote per job, based on the number of devices to wipe, the volume and the distance. You will always see the price before we collect.",
    open: true,
  },
  {
    question: "Will I get anything back for old laptops?",
    answer:
      "Devices recent enough to refurbish have some value left. Where that applies, we offset part of it against your service fee and tell you upfront which items qualify.",
  },
  {
    question: "Where does everything go after you?",
    answer:
      "Working devices are refurbished and go back into use, often in schools. Parts are recovered for repairs. The rest is sorted by material and passed to licensed downstream handlers. Nothing is burnt or dumped.",
  },
  {
    question: "Is a factory reset enough before I sell my phone?",
    answer:
      "For most modern phones a reset after signing out of every account and removing the SIM and memory card is a good start. For work devices, or any device holding other people's data, ask for a verified wipe and a record of it.",
  },
  {
    question: "Do you work outside Kampala?",
    answer:
      "Yes. Kampala, Wakiso and Mukono are covered as standard. For other districts we combine collections or work with local partners such as schools and district offices.",
  },
];
