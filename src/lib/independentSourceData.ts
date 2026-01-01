// IndieSource: Independent Media Source Database

export type Platform = 'youtube' | 'substack' | 'rumble' | 'podcast' | 'x' | 'website';
export type PoliticalLean = 'Left' | 'Center-Left' | 'Center' | 'Center-Right' | 'Right';
export type CreatorType = 'Journalist' | 'Commentator' | 'Investigative' | 'Satirist' | 'Analyst';

export interface IndependentSource {
  name: string;
  platform: Platform;
  handle: string;
  url: string;
  lean: PoliticalLean;
  type: CreatorType;
  verifiedHuman: boolean;
  country: string;
  monthlyViews?: number;
}

export const INDEPENDENT_SOURCES: IndependentSource[] = [
  // CANADIAN SOURCES
  { name: 'Rebel News', platform: 'youtube', handle: '@RebelNewsOnline', url: 'https://youtube.com/@RebelNewsOnline', lean: 'Right', type: 'Journalist', verifiedHuman: true, country: 'Canada', monthlyViews: 8_500_000 },
  { name: 'True North', platform: 'youtube', handle: '@TrueNorthCentre', url: 'https://youtube.com/@TrueNorthCentre', lean: 'Right', type: 'Journalist', verifiedHuman: true, country: 'Canada' },
  { name: 'Canadaland', platform: 'podcast', handle: 'canadaland', url: 'https://www.canadaland.com/', lean: 'Center-Left', type: 'Investigative', verifiedHuman: true, country: 'Canada' },
  { name: 'The Breach', platform: 'website', handle: 'breach', url: 'https://breachmedia.ca/', lean: 'Left', type: 'Journalist', verifiedHuman: true, country: 'Canada' },
  { name: 'Western Standard', platform: 'website', handle: 'westernstandard', url: 'https://www.westernstandardonline.com/', lean: 'Right', type: 'Journalist', verifiedHuman: true, country: 'Canada' },
  { name: "Blacklock's Reporter", platform: 'website', handle: 'blacklocks', url: 'https://www.blacklocks.ca/', lean: 'Center', type: 'Investigative', verifiedHuman: true, country: 'Canada' },
  { name: 'Press Progress', platform: 'website', handle: 'pressprogress', url: 'https://pressprogress.ca/', lean: 'Left', type: 'Investigative', verifiedHuman: true, country: 'Canada' },
  { name: 'The Counter Signal', platform: 'website', handle: 'countersignal', url: 'https://thecountersignal.com/', lean: 'Right', type: 'Journalist', verifiedHuman: true, country: 'Canada' },
  // US SOURCES
  { name: 'Breaking Points', platform: 'youtube', handle: '@BreakingPoints', url: 'https://youtube.com/@BreakingPoints', lean: 'Center', type: 'Commentator', verifiedHuman: true, country: 'USA', monthlyViews: 15_000_000 },
  { name: 'Matt Taibbi', platform: 'substack', handle: 'taibbi', url: 'https://www.racket.news/', lean: 'Center-Left', type: 'Investigative', verifiedHuman: true, country: 'USA' },
  { name: 'Glenn Greenwald', platform: 'substack', handle: 'greenwald', url: 'https://greenwald.substack.com/', lean: 'Center-Left', type: 'Investigative', verifiedHuman: true, country: 'USA' },
  { name: 'The Free Press', platform: 'substack', handle: 'thefp', url: 'https://www.thefp.com/', lean: 'Center', type: 'Journalist', verifiedHuman: true, country: 'USA' },
  { name: 'The Hill', platform: 'youtube', handle: '@thehill', url: 'https://youtube.com/@thehill', lean: 'Center', type: 'Journalist', verifiedHuman: true, country: 'USA' },
  { name: 'Tim Pool', platform: 'youtube', handle: '@Timcast', url: 'https://youtube.com/@Timcast', lean: 'Right', type: 'Commentator', verifiedHuman: true, country: 'USA', monthlyViews: 30_000_000 },
  { name: 'Russell Brand', platform: 'rumble', handle: '@RussellBrand', url: 'https://rumble.com/c/russellbrand', lean: 'Center-Right', type: 'Commentator', verifiedHuman: true, country: 'UK' },
  { name: 'Joe Rogan Experience', platform: 'podcast', handle: 'joerogan', url: 'https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk', lean: 'Center-Right', type: 'Commentator', verifiedHuman: true, country: 'USA', monthlyViews: 200_000_000 },
];

export function getSourcesByCountry(country: string): IndependentSource[] {
  return INDEPENDENT_SOURCES.filter(s => s.country === country);
}

export function getSourcesByLean(lean: PoliticalLean): IndependentSource[] {
  return INDEPENDENT_SOURCES.filter(s => s.lean === lean);
}

export function getSourcesByPlatform(platform: Platform): IndependentSource[] {
  return INDEPENDENT_SOURCES.filter(s => s.platform === platform);
}
