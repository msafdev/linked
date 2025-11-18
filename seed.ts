import { config } from "dotenv";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "./lib/supabase";
import { DEFAULT_PORTFOLIO_TEMPLATE_ID } from "./types/portfolio-template";

config({ path: ".env.local" });

const REQUIRED_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY",
] as const;

const missing = REQUIRED_ENV.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(
    `Missing environment variables: ${missing.join(
      ", ",
    )}. Check your .env.local file.`,
  );
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
  },
});

const seed = async () => {
  const accountId = "67e8cfae-f4e5-47eb-8a3d-619e80306b1b"; // fixed ID for demo account

  const accountPayload = {
    id: accountId,
    email: "faris.kocak@gmail.com",
    full_name: "Salman Alfarisi",
    avatar_url: null,
  };

  const contentPayload = [
    {
      account_id: accountId,
      section: "profile",
      data: {
        name: "Salman Alfarisi",
        title: "Product Designer",
        location: "Remote",
        about:
          "This seeded profile demonstrates how Linked pulls content from Supabase.",
        website: {
          label: "Website",
          url: "https://linked.demo",
        },
        avatar: {
          src: "",
          alt: "Demo avatar",
        },
      },
    },
    {
      account_id: accountId,
      section: "work",
      data: {
        work: [
          {
            role: "Lead Product Designer",
            company: "Linked",
            location: "Remote",
            range: { from: "2023-01", to: null },
            url: "https://linked.demo",
            images: [],
          },
          {
            role: "Product Designer",
            company: "Acme Co",
            location: "San Francisco, CA",
            range: { from: "2020-05", to: "2022-12" },
            url: "https://acme.example",
            images: [],
          },
        ],
      },
    },
    {
      account_id: accountId,
      section: "writing",
      data: {
        writing: [
          {
            title: "Designing for Speed",
            subtitle: "How we ship faster at Linked",
            url: "https://linked.demo/articles/designing-for-speed",
            year: "2024",
            images: [],
          },
          {
            title: "Design Systems at Scale",
            subtitle: "Lessons from a remote team",
            url: "",
            year: "2023",
            images: [],
          },
        ],
      },
    },
    {
      account_id: accountId,
      section: "speaking",
      data: {
        speaking: [
          {
            title: "Building Product Teams",
            subtitle: "Remote Design Summit",
            url: "https://remote-design-summit.com",
            date: "2024-06-12",
            location: "Virtual",
            images: [],
          },
          {
            title: "Inclusive Design Patterns",
            subtitle: "DesignOps Conf",
            url: "",
            date: "2023-09-03",
            location: "Berlin, Germany",
            images: [],
          },
        ],
      },
    },
    {
      account_id: accountId,
      section: "projects",
      data: {
        projects: [
          {
            title: "Linked Dashboard",
            subtitle: "Customizable professional profiles",
            url: "https://linked.demo",
            year: "2024",
            images: [],
          },
          {
            title: "Palette",
            subtitle: "Inspiration board for product designers",
            url: "https://palette.example",
            year: "2022",
            images: [],
          },
        ],
      },
    },
    {
      account_id: accountId,
      section: "education",
      data: {
        education: [
          {
            degree: "B.A. in Interaction Design",
            school: "State University",
            location: "Austin, TX",
            range: { from: "2014-08", to: "2018-05" },
          },
        ],
      },
    },
    {
      account_id: accountId,
      section: "contact",
      data: {
        contact: [
          {
            label: "Email",
            value: "demo@linked.dev",
            url: "mailto:demo@linked.dev",
          },
          {
            label: "LinkedIn",
            value: "linkedin.com/in/demo",
            url: "https://www.linkedin.com/in/demo",
          },
          {
            label: "X",
            value: "@linked_demo",
            url: "https://x.com/linked_demo",
          },
        ],
      },
    },
    {
      account_id: accountId,
      section: "settings",
      data: {
        domain: "salmoon",
        billingStatus: "trial",
        template: DEFAULT_PORTFOLIO_TEMPLATE_ID,
        isPublic: true,
      },
    },
  ];

  const settingPayload = {
    account_id: accountId,
    domain: "salmoon",
    billing_status: "trial",
    billing_type: "free",
    is_public: true,
    preferences: {
      theme: "dark",
      template: DEFAULT_PORTFOLIO_TEMPLATE_ID,
    },
  };

  const { error: accountError } = await supabase
    .from("account")
    .upsert(accountPayload, { onConflict: "id" });

  if (accountError) {
    throw accountError;
  }

  const { error: contentError } = await supabase
    .from("content")
    .upsert(contentPayload, { onConflict: "account_id,section" });

  if (contentError) {
    throw contentError;
  }

  const { error: settingError } = await supabase
    .from("setting")
    .upsert(settingPayload, { onConflict: "account_id" });

  if (settingError) {
    throw settingError;
  }

  console.info("Database seeded successfully.");
};

seed().catch((error) => {
  console.error("Failed to seed database.");
  console.error(error);
  process.exit(1);
});
