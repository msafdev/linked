import {
  HiMiniBolt,
  HiMiniEye,
  HiMiniLockClosed,
  HiMiniRss,
  HiMiniSparkles,
  HiMiniUser,
} from "react-icons/hi2";

const features = [
  {
    title: "Personalized Page",
    icon: (
      <div className="rounded-full border border-blue-600 bg-blue-500 p-2">
        <HiMiniUser size={16} className="shrink-0 text-white" />
      </div>
    ),
  },
  {
    title: "Shareable Profile",
    icon: (
      <div className="rounded-full border border-sky-600 bg-sky-500 p-2">
        <HiMiniRss size={16} className="shrink-0 text-white" />
      </div>
    ),
  },
  {
    title: "Contact Made Easy",
    icon: (
      <div className="rounded-full border border-green-600 bg-green-500 p-2">
        <HiMiniEye size={16} className="shrink-0 text-white" />
      </div>
    ),
  },
  {
    title: "Data Privacy",
    icon: (
      <div className="rounded-full border border-purple-600 bg-purple-500 p-2">
        <HiMiniLockClosed size={16} className="shrink-0 text-white" />
      </div>
    ),
  },
  {
    title: "Instant Updates",
    icon: (
      <div className="rounded-full border border-yellow-600 bg-yellow-500 p-2">
        <HiMiniBolt size={16} className="shrink-0 text-white" />
      </div>
    ),
  },
  {
    title: "Built for Creators",
    icon: (
      <div className="rounded-full border border-violet-600 bg-violet-500 p-2">
        <HiMiniSparkles size={16} className="shrink-0 text-white" />
      </div>
    ),
  },
];

export function FeaturesSection() {
  return (
    <section className="w-full max-w-xl space-y-8 text-center">
      <div className="space-y-3">
        <h2 className="font-heading text-left text-xl font-semibold sm:text-2xl">
          Your portfolio should be simple, beautiful, and yours.
        </h2>
        <p className="text-muted-foreground text-left text-sm sm:text-base">
          Showcase your work in minutes, not hours. Highlight your story, keep
          your details synced everywhere, and share a polished profile that
          always feels current.
        </p>
      </div>

      <div className="grid gap-4 xs:gap-6 xs:grid-cols-2">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="flex items-center gap-4 text-left"
          >
            {feature.icon}
            <h3 className="text-base font-medium text-nowrap">
              {feature.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
