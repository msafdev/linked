export type ExternalLink = {
  label: string;
  url: string;
};

export type DateRange = {
  from: string;
  to?: string;
};

export type MediaResource = {
  src: string;
  alt: string;
};

export type Profile = {
  name: string;
  title: string;
  location: string;
  about: string;
  website?: ExternalLink;
};

export type WorkEntry = {
  role: string;
  company: string;
  location: string;
  range: DateRange;
  url?: string;
  images?: MediaResource[];
};

export type WritingEntry = {
  title: string;
  year: number;
  subtitle?: string;
  url?: string;
};

export type SpeakingEntry = {
  title: string;
  date: string;
  location: string;
  subtitle?: string;
  url?: string;
};

export type SideProjectEntry = {
  title: string;
  year: number;
  subtitle?: string;
  url?: string;
};

export type EducationEntry = {
  degree: string;
  school: string;
  location: string;
  range: DateRange;
};

export type ContactEntry = {
  label: string;
  value: string;
  url?: string;
};

export type ReadCV = {
  id: string;
  profile: Profile;
  work: WorkEntry[];
  writing: WritingEntry[];
  speaking: SpeakingEntry[];
  sideProjects: SideProjectEntry[];
  education: EducationEntry[];
  contact: ContactEntry[];
};

export const LINK: ReadCV = {
  id: "bfc74a00-3173-49d3-b891-e3d86101c1ac",
  profile: {
    name: "Salman Alfarisi",
    title: "Product Designer",
    location: "Jakarta",
    about:
      "Product designer focusing on AI-assisted workflows, practical systems, and shipping velocity for lean teams.",
    website: {
      label: "website.com",
      url: "https://salmoon.vercel.app",
    },
  },
  work: [
    {
      role: "Senior Product Designer",
      company: "Atlas Labs",
      location: "San Francisco, CA",
      range: { from: "2023", to: "Present" },
      url: "https://atlaslabs.ai",
      images: [
        { src: "/images/placeholder.webp", alt: "Placeholder" },
        { src: "/images/placeholder.webp", alt: "Placeholder" },
      ],
    },
    {
      role: "Product Designer",
      company: "Northwind Commerce",
      location: "Jakarta, Indonesia",
      range: { from: "2020", to: "2023" },
    },
    {
      role: "Interaction Designer",
      company: "Studio Kinetic",
      location: "Bangkok, Thailand",
      range: { from: "2017", to: "2020" },
    },
    {
      role: "Freelance Designer",
      company: "Self-initiated",
      location: "Remote",
      range: { from: "2014", to: "2017" },
    },
  ],
  writing: [
    {
      title: "Designing With Guardrails",
      year: 2024,
      subtitle: "Collaboration with Mia Rahma and Dimas Putra",
      url: "https://read.cv/writing/designing-with-guardrails",
    },
    {
      title: "Building Narrative Prototypes",
      year: 2023,
      subtitle: "Zeroheight Field Notes",
      url: "https://read.cv/writing/narrative-prototypes",
    },
    {
      title: "Mapping the First Five Minutes",
      year: 2022,
      subtitle: "Personal essay",
    },
  ],
  speaking: [
    {
      title: "Designing With Guardrails",
      date: "2024",
      location: "San Francisco, CA",
      subtitle: "Config 2024",
      url: "https://read.cv/speaking/config-2024",
    },
    {
      title: "Design Ops, Practically",
      date: "2023",
      location: "New York, NY",
      subtitle: "NYC Product Nights",
    },
    {
      title: "Scaling Research Rituals",
      date: "2022",
      location: "Jakarta, Indonesia",
      subtitle: "Product Circle",
    },
  ],
  sideProjects: [
    {
      title: "Nature Walks",
      year: 2021,
      subtitle: "Photo journal exploring city greens",
    },
    {
      title: "Interactive Art Installation",
      year: 2020,
      subtitle: "Collaboration with Kinetic Studio",
    },
  ],
  education: [
    {
      degree: "MFA Interaction Design",
      school: "School of Visual Arts",
      location: "New York, NY",
      range: { from: "2018", to: "2020" },
    },
    {
      degree: "BFA Graphic Design",
      school: "University of Toronto",
      location: "Toronto, ON",
      range: { from: "2014", to: "2018" },
    },
  ],
  contact: [
    { label: "Threads", value: "@salmoon" },
    { label: "Instagram", value: "@salmoon.design" },
    { label: "X", value: "@salmoon" },
  ],
};
