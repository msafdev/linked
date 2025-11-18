export type Country = {
  value: string;
  label: string;
  flag: string;
  region: string;
};

export const COUNTRIES: Country[] = [
  {
    value: "us",
    label: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    region: "North America",
  },
  {
    value: "ca",
    label: "Canada",
    flag: "\uD83C\uDDE8\uD83C\uDDE6",
    region: "North America",
  },
  {
    value: "mx",
    label: "Mexico",
    flag: "\uD83C\uDDF2\uD83C\uDDFD",
    region: "North America",
  },
  {
    value: "gb",
    label: "United Kingdom",
    flag: "\uD83C\uDDEC\uD83C\uDDE7",
    region: "Europe",
  },
  {
    value: "de",
    label: "Germany",
    flag: "\uD83C\uDDE9\uD83C\uDDEA",
    region: "Europe",
  },
  {
    value: "fr",
    label: "France",
    flag: "\uD83C\uDDEB\uD83C\uDDF7",
    region: "Europe",
  },
  {
    value: "it",
    label: "Italy",
    flag: "\uD83C\uDDEE\uD83C\uDDF9",
    region: "Europe",
  },
  {
    value: "es",
    label: "Spain",
    flag: "\uD83C\uDDEA\uD83C\uDDF8",
    region: "Europe",
  },
  {
    value: "nl",
    label: "Netherlands",
    flag: "\uD83C\uDDF3\uD83C\uDDF1",
    region: "Europe",
  },
  {
    value: "se",
    label: "Sweden",
    flag: "\uD83C\uDDF8\uD83C\uDDEA",
    region: "Europe",
  },
  {
    value: "ch",
    label: "Switzerland",
    flag: "\uD83C\uDDE8\uD83C\uDDED",
    region: "Europe",
  },
  {
    value: "au",
    label: "Australia",
    flag: "\uD83C\uDDE6\uD83C\uDDFA",
    region: "Asia Pacific",
  },
  {
    value: "jp",
    label: "Japan",
    flag: "\uD83C\uDDEF\uD83C\uDDF5",
    region: "Asia Pacific",
  },
  {
    value: "kr",
    label: "South Korea",
    flag: "\uD83C\uDDF0\uD83C\uDDF7",
    region: "Asia Pacific",
  },
  {
    value: "sg",
    label: "Singapore",
    flag: "\uD83C\uDDF8\uD83C\uDDEC",
    region: "Asia Pacific",
  },
  {
    value: "id",
    label: "Indonesia",
    flag: "\uD83C\uDDEE\uD83C\uDDE9",
    region: "Asia Pacific",
  },
  {
    value: "in",
    label: "India",
    flag: "\uD83C\uDDEE\uD83C\uDDF3",
    region: "Asia Pacific",
  },
  {
    value: "cn",
    label: "China",
    flag: "\uD83C\uDDE8\uD83C\uDDF3",
    region: "Asia Pacific",
  },
  {
    value: "nz",
    label: "New Zealand",
    flag: "\uD83C\uDDF3\uD83C\uDDFF",
    region: "Asia Pacific",
  },
  {
    value: "br",
    label: "Brazil",
    flag: "\uD83C\uDDE7\uD83C\uDDF7",
    region: "South America",
  },
  {
    value: "ar",
    label: "Argentina",
    flag: "\uD83C\uDDE6\uD83C\uDDF7",
    region: "South America",
  },
  {
    value: "cl",
    label: "Chile",
    flag: "\uD83C\uDDE8\uD83C\uDDF1",
    region: "South America",
  },
  {
    value: "ae",
    label: "United Arab Emirates",
    flag: "\uD83C\uDDE6\uD83C\uDDEA",
    region: "Middle East & Africa",
  },
  {
    value: "ng",
    label: "Nigeria",
    flag: "\uD83C\uDDF3\uD83C\uDDEC",
    region: "Middle East & Africa",
  },
  {
    value: "za",
    label: "South Africa",
    flag: "\uD83C\uDDFF\uD83C\uDDE6",
    region: "Middle East & Africa",
  },
];

export const groupCountriesByRegion = (list: Country[]) =>
  list.reduce<Record<string, Country[]>>((acc, country) => {
    const regionGroup = acc[country.region];
    if (regionGroup) {
      regionGroup.push(country);
    } else {
      acc[country.region] = [country];
    }

    return acc;
  }, {});
