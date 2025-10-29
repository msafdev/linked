export type Country = {
  value: string;
  label: string;
  flag: string;
  region: string;
};

export const COUNTRIES: Country[] = [
  { value: "us", label: "United States", flag: "🇺🇸", region: "North America" },
  { value: "ca", label: "Canada", flag: "🇨🇦", region: "North America" },
  { value: "mx", label: "Mexico", flag: "🇲🇽", region: "North America" },
  { value: "gb", label: "United Kingdom", flag: "🇬🇧", region: "Europe" },
  { value: "de", label: "Germany", flag: "🇩🇪", region: "Europe" },
  { value: "fr", label: "France", flag: "🇫🇷", region: "Europe" },
  { value: "it", label: "Italy", flag: "🇮🇹", region: "Europe" },
  { value: "es", label: "Spain", flag: "🇪🇸", region: "Europe" },
  { value: "au", label: "Australia", flag: "🇦🇺", region: "Asia Pacific" },
  { value: "jp", label: "Japan", flag: "🇯🇵", region: "Asia Pacific" },
  { value: "kr", label: "South Korea", flag: "🇰🇷", region: "Asia Pacific" },
  { value: "sg", label: "Singapore", flag: "🇸🇬", region: "Asia Pacific" },
  { value: "id", label: "Indonesia", flag: "🇮🇩", region: "Asia Pacific" },
  { value: "br", label: "Brazil", flag: "🇧🇷", region: "South America" },
];

export const groupCountriesByRegion = (list: Country[]) =>
  list.reduce<Record<string, Country[]>>((acc, c) => {
    (acc[c.region] ||= []).push(c);
    return acc;
  }, {});
