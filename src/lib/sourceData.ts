// MirrorSource Source Database - Single Source of Truth
// Political lean ratings verified against AllSides Media Bias Ratings (December 2024)
// Ownership and funding data for transparency

// =============================================================================
// TYPES
// =============================================================================

export type PoliticalLean = 'left' | 'center-left' | 'center' | 'center-right' | 'right';

export type SourceType =
  | 'wire'
  | 'public'
  | 'public-trust'
  | 'corporate'
  | 'state'
  | 'state-funded'
  | 'nonprofit'
  | 'analysis'
  | 'local'
  | 'national'
  | 'international'
  | 'magazine'
  | 'specialized'
  | 'reference'
  | 'syndication'
  | 'platform';

export type OwnershipType =
  | 'private'
  | 'public_traded'
  | 'nonprofit'
  | 'public_media'
  | 'state_owned'
  | 'cooperative'
  | 'trust';

// Legacy ownership types for backwards compatibility with existing UI
export type LegacyOwnershipType =
  | 'nonprofit'
  | 'public'
  | 'family'
  | 'billionaire'
  | 'corporate'
  | 'government'
  | 'cooperative';

export interface OwnershipInfo {
  owner: string;
  parent?: string;
  type: OwnershipType;
  note?: string;
}

export interface FundingInfo {
  model: string;
  note?: string;
}

export interface Source {
  domain: string;
  name: string;
  lean: PoliticalLean;
  legacyType: LegacyOwnershipType;  // For UI badges
  // Extended transparency data
  displayName?: string;
  sourceType?: SourceType;
  countryCode?: string;
  ownership?: OwnershipInfo;
  funding?: FundingInfo;
}

// =============================================================================
// MASTER SOURCE DATABASE
// =============================================================================

export const SOURCES: Source[] = [
  // ===========================================================================
  // SYNDICATION
  // ===========================================================================
  {
    domain: 'finance.yahoo.com',
    name: 'Yahoo Finance',
    lean: 'center',
    legacyType: 'corporate',
    displayName: 'YAHOO FINANCE',
    sourceType: 'syndication',
    countryCode: 'US',
    ownership: { owner: 'Yahoo', parent: 'Apollo Global Management', type: 'private', note: 'Apollo acquired Yahoo from Verizon for $5B in 2021' },
    funding: { model: 'Advertising & Yahoo Finance Plus subscriptions' },
  },
  {
    domain: 'news.yahoo.com',
    name: 'Yahoo News',
    lean: 'center',
    legacyType: 'corporate',
    displayName: 'YAHOO NEWS',
    sourceType: 'syndication',
    countryCode: 'US',
    ownership: { owner: 'Yahoo', parent: 'Apollo Global Management', type: 'private', note: 'Aggregates content from partner publications' },
    funding: { model: 'Advertising' },
  },
  {
    domain: 'yahoo.com',
    name: 'Yahoo',
    lean: 'center',
    legacyType: 'corporate',
    displayName: 'YAHOO',
    sourceType: 'syndication',
    countryCode: 'US',
    ownership: { owner: 'Yahoo', parent: 'Apollo Global Management', type: 'private', note: 'Apollo acquired Yahoo from Verizon for $5B in 2021' },
    funding: { model: 'Advertising' },
  },
  {
    domain: 'msn.com',
    name: 'MSN',
    lean: 'center',
    legacyType: 'public',
    displayName: 'MSN',
    sourceType: 'syndication',
    countryCode: 'US',
    ownership: { owner: 'Microsoft Corporation', type: 'public_traded', note: 'NASDAQ (MSFT). News aggregation portal' },
    funding: { model: 'Advertising' },
  },

  // ===========================================================================
  // WIRE SERVICES
  // ===========================================================================
  {
    domain: 'apnews.com',
    name: 'Associated Press',
    lean: 'left',  // AllSides December 2024
    legacyType: 'cooperative',
    displayName: 'AP NEWS',
    sourceType: 'wire',
    countryCode: 'US',
    ownership: { owner: 'Associated Press', type: 'cooperative', note: 'Non-profit cooperative owned by ~1,300 member newspapers and broadcasters' },
    funding: { model: 'Member fees & content licensing to media outlets worldwide' },
  },
  {
    domain: 'reuters.com',
    name: 'Reuters',
    lean: 'center',
    legacyType: 'public',
    displayName: 'REUTERS',
    sourceType: 'wire',
    countryCode: 'UK',
    ownership: { owner: 'Thomson Reuters Corporation', type: 'public_traded', note: 'NYSE (TRI) and TSX. Thomson family holds ~65% voting control' },
    funding: { model: 'Financial data terminals, news licensing & professional services' },
  },
  {
    domain: 'afp.com',
    name: 'AFP',
    lean: 'center',
    legacyType: 'government',
    displayName: 'AFP',
    sourceType: 'wire',
    countryCode: 'FR',
    ownership: { owner: 'Agence France-Presse', type: 'public_media', note: 'French state provides ~40% funding; editorial independence legally protected since 1957' },
    funding: { model: 'French government contracts, news licensing & subscriptions' },
  },

  // ===========================================================================
  // PUBLIC BROADCASTING
  // ===========================================================================
  {
    domain: 'npr.org',
    name: 'NPR',
    lean: 'center-left',  // AllSides
    legacyType: 'nonprofit',
    displayName: 'NPR',
    sourceType: 'public-trust',
    countryCode: 'US',
    ownership: { owner: 'National Public Radio, Inc.', type: 'nonprofit', note: '501(c)(3) non-profit media organization founded 1970' },
    funding: { model: 'Member station fees, corporate sponsors, foundations & individual donors', note: 'Federal funding via CPB is <1% of total budget' },
  },
  {
    domain: 'pbs.org',
    name: 'PBS',
    lean: 'center-left',
    legacyType: 'nonprofit',
    displayName: 'PBS',
    sourceType: 'public-trust',
    countryCode: 'US',
    ownership: { owner: 'Public Broadcasting Service', type: 'nonprofit', note: 'Non-profit public broadcaster; member organization of 350+ local stations' },
    funding: { model: 'Member stations, corporate underwriting, foundations & viewer donations' },
  },
  {
    domain: 'opb.org',
    name: 'OPB',
    lean: 'center-left',
    legacyType: 'nonprofit',
    displayName: 'OPB',
    sourceType: 'public',
    countryCode: 'US',
    ownership: { owner: 'Oregon Public Broadcasting', type: 'nonprofit', note: 'Regional public media organization serving Oregon and SW Washington' },
    funding: { model: 'Member donations, corporate sponsors & CPB grants' },
  },
  {
    domain: 'bbc.com',
    name: 'BBC',
    lean: 'center',
    legacyType: 'government',
    displayName: 'BBC',
    sourceType: 'public-trust',
    countryCode: 'UK',
    ownership: { owner: 'British Broadcasting Corporation', type: 'public_media', note: 'UK public corporation established by Royal Charter; governed by BBC Board' },
    funding: { model: 'UK TV license fee (£159/year) & BBC Studios commercial revenue' },
  },
  {
    domain: 'bbc.co.uk',
    name: 'BBC',
    lean: 'center',
    legacyType: 'government',
    displayName: 'BBC',
    sourceType: 'public',
    countryCode: 'UK',
    ownership: { owner: 'British Broadcasting Corporation', type: 'public_media', note: 'UK public corporation established by Royal Charter' },
    funding: { model: 'UK TV license fee (£159/year) & BBC Studios commercial revenue' },
  },
  {
    domain: 'cbc.ca',
    name: 'CBC',
    lean: 'center-left',
    legacyType: 'government',
    displayName: 'CBC',
    sourceType: 'public',
    countryCode: 'CA',
    ownership: { owner: 'Canadian Broadcasting Corporation', type: 'public_media', note: 'Canadian Crown corporation established 1936; reports to Parliament' },
    funding: { model: 'Canadian federal government appropriation (~$1.2B/year) & advertising' },
  },
  {
    domain: 'abc.net.au',
    name: 'ABC Australia',
    lean: 'center-left',
    legacyType: 'government',
    displayName: 'ABC AUSTRALIA',
    sourceType: 'public',
    countryCode: 'AU',
    ownership: { owner: 'Australian Broadcasting Corporation', type: 'public_media', note: 'Australian federal government statutory authority; independent board' },
    funding: { model: 'Australian federal government funding (no advertising on domestic services)' },
  },
  {
    domain: 'sbs.com.au',
    name: 'SBS',
    lean: 'center',
    legacyType: 'government',
    displayName: 'SBS',
    sourceType: 'public',
    countryCode: 'AU',
    ownership: { owner: 'Special Broadcasting Service', type: 'public_media', note: 'Australian multicultural public broadcaster established 1978' },
    funding: { model: 'Australian government funding & limited advertising' },
  },
  {
    domain: 'channel4.com',
    name: 'Channel 4',
    lean: 'center-left',
    legacyType: 'government',
    displayName: 'CHANNEL 4',
    sourceType: 'public',
    countryCode: 'UK',
    ownership: { owner: 'Channel Four Television Corporation', type: 'public_media', note: 'UK publicly-owned but commercially-funded; cannot be sold for profit' },
    funding: { model: 'Advertising revenue (self-funded, no license fee)' },
  },
  {
    domain: 'rnz.co.nz',
    name: 'RNZ',
    lean: 'center',
    legacyType: 'government',
    displayName: 'RNZ',
    sourceType: 'public',
    countryCode: 'NZ',
    ownership: { owner: 'Radio New Zealand', type: 'public_media', note: 'New Zealand public broadcaster; Crown entity since 1995' },
    funding: { model: 'New Zealand government funding (no advertising)' },
  },
  {
    domain: 'rte.ie',
    name: 'RTE',
    lean: 'center',
    legacyType: 'government',
    displayName: 'RTE',
    sourceType: 'public',
    countryCode: 'IE',
    ownership: { owner: 'Raidió Teilifís Éireann', type: 'public_media', note: 'Ireland\'s national public broadcaster; statutory corporation' },
    funding: { model: 'TV license fee & commercial advertising' },
  },

  // ===========================================================================
  // INTERNATIONAL
  // ===========================================================================
  {
    domain: 'aljazeera.com',
    name: 'Al Jazeera',
    lean: 'center-left',  // AllSides
    legacyType: 'government',
    displayName: 'Al Jazeera',
    sourceType: 'state-funded',
    countryCode: 'QA',
    ownership: { owner: 'Al Jazeera Media Network', parent: 'Government of Qatar', type: 'state_owned', note: 'Funded by Qatar government' },
    funding: { model: 'State funding', note: 'Qatar state-backed international news' },
  },
  {
    domain: 'theguardian.com',
    name: 'The Guardian',
    lean: 'center-left',
    legacyType: 'nonprofit',
    displayName: 'THE GUARDIAN',
    sourceType: 'international',
    countryCode: 'UK',
    ownership: { owner: 'Guardian Media Group', parent: 'Scott Trust Limited', type: 'trust', note: 'Trust structure (since 1936) ensures editorial independence in perpetuity' },
    funding: { model: 'Reader contributions, advertising, events & Guardian Foundation grants', note: 'No paywall; relies on voluntary reader support (~1M+ paying supporters)' },
  },
  {
    domain: 'thehindu.com',
    name: 'The Hindu',
    lean: 'center-left',
    legacyType: 'family',
    displayName: 'THE HINDU',
    sourceType: 'international',
    countryCode: 'IN',
    ownership: { owner: 'The Hindu Group', parent: 'Kasturi & Sons Ltd.', type: 'private', note: 'Family-owned since 1878; based in Chennai' },
    funding: { model: 'Advertising & subscriptions' },
  },
  {
    domain: 'dw.com',
    name: 'DW',
    lean: 'center',
    legacyType: 'government',
    displayName: 'DW',
    sourceType: 'international',
    countryCode: 'DE',
    ownership: { owner: 'Deutsche Welle', type: 'public_media', note: 'German public international broadcaster; legally independent from government' },
    funding: { model: 'German federal tax revenue (100% publicly funded)' },
  },
  {
    domain: 'france24.com',
    name: 'France 24',
    lean: 'center',
    legacyType: 'government',
    displayName: 'FRANCE 24',
    sourceType: 'international',
    countryCode: 'FR',
    ownership: { owner: 'France Médias Monde', type: 'public_media', note: 'French international public broadcaster; editorial independence guaranteed by law' },
    funding: { model: 'French government funding via license fee revenue' },
  },
  {
    domain: 'scmp.com',
    name: 'SCMP',
    lean: 'center',
    legacyType: 'public',
    displayName: 'SCMP',
    sourceType: 'international',
    countryCode: 'HK',
    ownership: { owner: 'Alibaba Group', type: 'public_traded', note: 'Acquired by Alibaba (Jack Ma) in 2016; Alibaba trades on NYSE (BABA)' },
    funding: { model: 'Advertising & subscriptions' },
  },
  {
    domain: 'timesofisrael.com',
    name: 'Times of Israel',
    lean: 'center',
    legacyType: 'corporate',
    displayName: 'TIMES OF ISRAEL',
    sourceType: 'international',
    countryCode: 'IL',
    ownership: { owner: 'Times of Israel Ltd.', type: 'private', note: 'Founded 2012 by David Horovitz; backed by Seth Klarman (Baupost Group)' },
    funding: { model: 'Advertising, memberships & sponsored content' },
  },
  {
    domain: 'jpost.com',
    name: 'Jerusalem Post',
    lean: 'center-right',
    legacyType: 'corporate',
    displayName: 'JERUSALEM POST',
    sourceType: 'international',
    countryCode: 'IL',
    ownership: { owner: 'Jerusalem Post Group', parent: 'Eli Azur (controlling stake)', type: 'private', note: 'Israeli media entrepreneur Eli Azur acquired majority stake in 2019' },
    funding: { model: 'Advertising & subscriptions' },
  },
  {
    domain: 'ynetnews.com',
    name: 'Ynet News',
    lean: 'center',
    legacyType: 'family',
    displayName: 'YNET NEWS',
    sourceType: 'international',
    countryCode: 'IL',
    ownership: { owner: 'Yedioth Ahronoth Group', type: 'private', note: 'Owned by Moses family; largest newspaper group in Israel' },
    funding: { model: 'Advertising (free access model)' },
  },
  {
    domain: 'haaretz.com',
    name: 'Haaretz',
    lean: 'center-left',
    legacyType: 'family',
    displayName: 'HAARETZ',
    sourceType: 'international',
    countryCode: 'IL',
    ownership: { owner: 'Haaretz Group', type: 'private', note: 'Schocken family holds majority; M. DuMont Schauberg (Germany) owns 25%' },
    funding: { model: 'Subscriptions & advertising' },
  },
  {
    domain: 'i24news.tv',
    name: 'i24 News',
    lean: 'center',
    legacyType: 'billionaire',
    displayName: 'I24 NEWS',
    sourceType: 'international',
    countryCode: 'IL',
    ownership: { owner: 'i24NEWS', parent: 'Altice Group (Patrick Drahi)', type: 'private', note: 'Founded 2013; owned by telecom billionaire Patrick Drahi' },
    funding: { model: 'Parent company funding & advertising' },
  },
  {
    domain: 'thearabdailynews.com',
    name: 'Arab Daily News',
    lean: 'center',
    legacyType: 'corporate',
    displayName: 'ARAB DAILY NEWS',
    sourceType: 'international',
    countryCode: 'US',
    ownership: { owner: 'Arab Daily News LLC', type: 'private', note: 'US-based Arab American news outlet' },
    funding: { model: 'Advertising & sponsorships' },
  },
  {
    domain: 'arabnews.com',
    name: 'Arab News',
    lean: 'center',
    legacyType: 'corporate',
    displayName: 'ARAB NEWS',
    sourceType: 'international',
    countryCode: 'SA',
    ownership: { owner: 'Saudi Research and Media Group (SRMG)', type: 'private', note: 'SRMG is closely aligned with Saudi government interests' },
    funding: { model: 'Parent company funding & advertising' },
  },
  {
    domain: 'middleeasteye.net',
    name: 'Middle East Eye',
    lean: 'center-left',
    legacyType: 'corporate',
    displayName: 'MIDDLE EAST EYE',
    sourceType: 'international',
    countryCode: 'UK',
    ownership: { owner: 'Middle East Eye Ltd.', type: 'private', note: 'UK-registered; founded 2014. Funding sources not fully disclosed; Qatar links alleged' },
    funding: { model: 'Not publicly disclosed', note: 'Non-profit structure; funding transparency limited' },
  },
  {
    domain: 'straitstimes.com',
    name: 'Straits Times',
    lean: 'center',
    legacyType: 'nonprofit',
    displayName: 'STRAITS TIMES',
    sourceType: 'international',
    countryCode: 'SG',
    ownership: { owner: 'Singapore Press Holdings', parent: 'SPH Media Trust', type: 'nonprofit', note: 'Restructured 2022; media arm now held by non-profit trust' },
    funding: { model: 'Government funding, subscriptions & advertising' },
  },
  {
    domain: 'channelnewsasia.com',
    name: 'CNA',
    lean: 'center',
    legacyType: 'government',
    displayName: 'CNA',
    sourceType: 'international',
    countryCode: 'SG',
    ownership: { owner: 'Mediacorp', type: 'state_owned', note: 'Mediacorp is wholly owned by Temasek Holdings (Singapore sovereign wealth fund)' },
    funding: { model: 'Singapore government funding & advertising' },
  },
  {
    domain: 'japantimes.co.jp',
    name: 'Japan Times',
    lean: 'center',
    legacyType: 'family',
    displayName: 'JAPAN TIMES',
    sourceType: 'international',
    countryCode: 'JP',
    ownership: { owner: 'The Japan Times, Ltd.', parent: 'News2u Holdings (Ogasawara family)', type: 'private', note: 'Oldest English-language newspaper in Japan (founded 1897)' },
    funding: { model: 'Subscriptions & advertising' },
  },
  {
    domain: 'koreaherald.com',
    name: 'Korea Herald',
    lean: 'center',
    legacyType: 'corporate',
    displayName: 'KOREA HERALD',
    sourceType: 'international',
    countryCode: 'KR',
    ownership: { owner: 'Herald Corporation', type: 'private', note: 'Part of Herald Media Group; South Korea\'s largest English daily' },
    funding: { model: 'Advertising & subscriptions' },
  },
  {
    domain: 'koreatimes.co.kr',
    name: 'Korea Times',
    lean: 'center',
    legacyType: 'corporate',
    displayName: 'KOREA TIMES',
    sourceType: 'international',
    countryCode: 'KR',
    ownership: { owner: 'Hankook Ilbo', type: 'private', note: 'Owned by Hankook Ilbo media group' },
    funding: { model: 'Advertising & subscriptions' },
  },
  {
    domain: 'bangkokpost.com',
    name: 'Bangkok Post',
    lean: 'center',
    legacyType: 'public',
    displayName: 'BANGKOK POST',
    sourceType: 'international',
    countryCode: 'TH',
    ownership: { owner: 'The Post Publishing PCL', type: 'public_traded', note: 'Traded on Stock Exchange of Thailand; established 1946' },
    funding: { model: 'Advertising & subscriptions' },
  },

  // ===========================================================================
  // US CORPORATE BROADCAST
  // ===========================================================================
  {
    domain: 'cnn.com',
    name: 'CNN',
    lean: 'center-left',  // AllSides
    legacyType: 'public',
    displayName: 'CNN',
    sourceType: 'corporate',
    countryCode: 'US',
    ownership: { owner: 'Warner Bros. Discovery', type: 'public_traded', note: 'WBD trades on NASDAQ (WBD). Created from WarnerMedia-Discovery merger 2022' },
    funding: { model: 'Advertising, cable carriage fees & CNN+ subscriptions' },
  },
  {
    domain: 'foxnews.com',
    name: 'Fox News',
    lean: 'right',  // AllSides
    legacyType: 'family',
    displayName: 'Fox News',
    sourceType: 'corporate',
    countryCode: 'US',
    ownership: { owner: 'Fox Corporation', parent: 'Fox Corporation', type: 'public_traded', note: 'Owned by Murdoch family via Fox Corp (NASDAQ: FOX)' },
    funding: { model: 'Advertising, cable fees', note: 'Largest US cable news network by viewership' },
  },
  {
    domain: 'nbcnews.com',
    name: 'NBC News',
    lean: 'center-left',  // AllSides
    legacyType: 'public',
    displayName: 'NBC NEWS',
    sourceType: 'corporate',
    countryCode: 'US',
    ownership: { owner: 'NBCUniversal News Group', parent: 'Comcast Corporation', type: 'public_traded', note: 'Comcast trades on NASDAQ (CMCSA). Largest cable company in US' },
    funding: { model: 'Advertising, cable fees & Peacock streaming' },
  },
  {
    domain: 'cbsnews.com',
    name: 'CBS News',
    lean: 'center-left',  // AllSides
    legacyType: 'public',
    displayName: 'CBS NEWS',
    sourceType: 'corporate',
    countryCode: 'US',
    ownership: { owner: 'CBS News and Stations', parent: 'Paramount Global', type: 'public_traded', note: 'Paramount trades NASDAQ (PARA). Shari Redstone controls via National Amusements' },
    funding: { model: 'Advertising, affiliate fees & Paramount+ streaming' },
  },
  {
    domain: 'abcnews.go.com',
    name: 'ABC News',
    lean: 'center-left',  // AllSides
    legacyType: 'public',
    displayName: 'ABC NEWS',
    sourceType: 'corporate',
    countryCode: 'US',
    ownership: { owner: 'ABC News', parent: 'The Walt Disney Company', type: 'public_traded', note: 'Disney trades on NYSE (DIS). ABC acquired by Disney in 1996' },
    funding: { model: 'Advertising, affiliate fees & Disney+ streaming' },
  },
  {
    domain: 'msnbc.com',
    name: 'MSNBC',
    lean: 'left',  // AllSides
    legacyType: 'public',
    displayName: 'MSNBC',
    sourceType: 'corporate',
    countryCode: 'US',
    ownership: { owner: 'NBCUniversal News Group', parent: 'Comcast Corporation', type: 'public_traded', note: 'Comcast trades NASDAQ (CMCSA). Originally NBC-Microsoft joint venture (1996)' },
    funding: { model: 'Advertising & cable carriage fees' },
  },

  // ===========================================================================
  // UK CORPORATE BROADCAST
  // ===========================================================================
  {
    domain: 'sky.com',
    name: 'Sky News',
    lean: 'center',
    legacyType: 'public',
    displayName: 'SKY NEWS',
    sourceType: 'corporate',
    countryCode: 'UK',
    ownership: { owner: 'Sky Group', parent: 'Comcast Corporation', type: 'public_traded', note: 'Comcast acquired Sky in 2018 for £30B. Previously Murdoch-controlled' },
    funding: { model: 'Sky subscriptions, advertising & Comcast parent funding' },
  },
  {
    domain: 'news.sky.com',
    name: 'Sky News',
    lean: 'center',
    legacyType: 'public',
    displayName: 'SKY NEWS',
    sourceType: 'corporate',
    countryCode: 'UK',
    ownership: { owner: 'Sky Group', parent: 'Comcast Corporation', type: 'public_traded', note: 'Comcast acquired Sky in 2018 for £30B' },
    funding: { model: 'Sky subscriptions, advertising & Comcast parent funding' },
  },
  {
    domain: 'itv.com',
    name: 'ITV News',
    lean: 'center',
    legacyType: 'public',
    displayName: 'ITV NEWS',
    sourceType: 'corporate',
    countryCode: 'UK',
    ownership: { owner: 'ITV plc', type: 'public_traded', note: 'Traded on London Stock Exchange (ITV). UK\'s largest commercial broadcaster' },
    funding: { model: 'Advertising revenue (primary) & ITVX streaming' },
  },

  // ===========================================================================
  // CANADIAN CORPORATE BROADCAST
  // ===========================================================================
  {
    domain: 'globalnews.ca',
    name: 'Global News',
    lean: 'center',
    legacyType: 'public',
    displayName: 'GLOBAL NEWS',
    sourceType: 'corporate',
    countryCode: 'CA',
    ownership: { owner: 'Corus Entertainment', type: 'public_traded', note: 'Traded on TSX (CJR.B). Shaw family controls voting shares' },
    funding: { model: 'Advertising & cable carriage fees' },
  },
  {
    domain: 'ctvnews.ca',
    name: 'CTV News',
    lean: 'center',
    legacyType: 'public',
    displayName: 'CTV NEWS',
    sourceType: 'corporate',
    countryCode: 'CA',
    ownership: { owner: 'CTV', parent: 'Bell Media (BCE Inc.)', type: 'public_traded', note: 'BCE trades on TSX and NYSE (BCE). Canada\'s largest telecom company' },
    funding: { model: 'Advertising & cable carriage fees' },
  },
  {
    domain: 'citynews.ca',
    name: 'City News',
    lean: 'center',
    legacyType: 'public',
    displayName: 'CITY NEWS',
    sourceType: 'corporate',
    countryCode: 'CA',
    ownership: { owner: 'Citytv', parent: 'Rogers Communications', type: 'public_traded', note: 'Rogers trades on TSX (RCI.B). Rogers family controls voting shares' },
    funding: { model: 'Advertising & cable carriage fees' },
  },

  // ===========================================================================
  // AUSTRALIAN CORPORATE
  // ===========================================================================
  {
    domain: 'news.com.au',
    name: 'News.com.au',
    lean: 'center-right',
    legacyType: 'family',
    displayName: 'NEWS.COM.AU',
    sourceType: 'corporate',
    countryCode: 'AU',
    ownership: { owner: 'News Corp Australia', parent: 'News Corp (Murdoch family)', type: 'public_traded', note: 'News Corp trades NASDAQ (NWSA). Australia\'s largest news website' },
    funding: { model: 'Advertising (free access)' },
  },
  {
    domain: '9news.com.au',
    name: '9 News',
    lean: 'center',
    legacyType: 'public',
    displayName: '9 NEWS',
    sourceType: 'corporate',
    countryCode: 'AU',
    ownership: { owner: 'Nine Entertainment', type: 'public_traded', note: 'Traded on ASX (NEC). Merged with Fairfax Media 2018' },
    funding: { model: 'Advertising & streaming (9Now)' },
  },
  {
    domain: '7news.com.au',
    name: '7 News',
    lean: 'center',
    legacyType: 'public',
    displayName: '7 NEWS',
    sourceType: 'corporate',
    countryCode: 'AU',
    ownership: { owner: 'Seven West Media', type: 'public_traded', note: 'Traded on ASX (SWM). Kerry Stokes is chairman and major shareholder' },
    funding: { model: 'Advertising & streaming (7plus)' },
  },

  // ===========================================================================
  // US NATIONAL - MAJOR NEWSPAPERS
  // ===========================================================================
  {
    domain: 'nytimes.com',
    name: 'The New York Times',
    lean: 'center-left',  // AllSides
    legacyType: 'family',
    displayName: 'THE NEW YORK TIMES',
    sourceType: 'national',
    countryCode: 'US',
    ownership: { owner: 'The New York Times Company', type: 'public_traded', note: 'NYSE: NYT. Founded 1851, "Gray Lady"' },
    funding: { model: 'Subscriptions (10M+) & advertising' },
  },
  {
    domain: 'washingtonpost.com',
    name: 'The Washington Post',
    lean: 'center-left',  // AllSides
    legacyType: 'billionaire',
    displayName: 'THE WASHINGTON POST',
    sourceType: 'national',
    countryCode: 'US',
    ownership: { owner: 'Jeff Bezos', parent: 'Nash Holdings', type: 'private', note: 'Purchased by Bezos in 2013 for $250M' },
    funding: { model: 'Subscriptions & advertising' },
  },
  {
    domain: 'usatoday.com',
    name: 'USA Today',
    lean: 'center-left',  // AllSides
    legacyType: 'public',
    displayName: 'USA TODAY',
    sourceType: 'national',
    countryCode: 'US',
    ownership: { owner: 'Gannett Co., Inc.', type: 'public_traded', note: 'NYSE (GCI). Largest US newspaper chain by circulation; merged with GateHouse 2019' },
    funding: { model: 'Advertising, subscriptions & digital marketing services' },
  },
  {
    domain: 'latimes.com',
    name: 'Los Angeles Times',
    lean: 'center-left',  // AllSides
    legacyType: 'billionaire',
    displayName: 'LOS ANGELES TIMES',
    sourceType: 'national',
    countryCode: 'US',
    ownership: { owner: 'Patrick Soon-Shiong', type: 'private', note: 'Purchased in 2018 for $500M' },
    funding: { model: 'Subscriptions & advertising' },
  },
  {
    domain: 'axios.com',
    name: 'Axios',
    lean: 'center-left',  // AllSides
    legacyType: 'corporate',
    displayName: 'AXIOS',
    sourceType: 'national',
    countryCode: 'US',
    ownership: { owner: 'Axios Media', parent: 'Cox Enterprises', type: 'private', note: 'Cox Enterprises acquired Axios in 2022 for $525M. Founded by Politico alumni' },
    funding: { model: 'Newsletters, advertising & Axios Pro subscriptions' },
  },
  {
    domain: 'bostonglobe.com',
    name: 'Boston Globe',
    lean: 'center-left',
    legacyType: 'billionaire',
    displayName: 'Boston Globe',
    sourceType: 'national',
    countryCode: 'US',
    ownership: { owner: 'Boston Globe Media Partners', parent: 'John W. Henry', type: 'private', note: 'Owned by Red Sox owner John Henry' },
    funding: { model: 'Subscriptions, advertising', note: 'Major Northeast newspaper' },
  },

  // ===========================================================================
  // US CENTER-RIGHT / CONSERVATIVE
  // ===========================================================================
  {
    domain: 'nypost.com',
    name: 'New York Post',
    lean: 'center-right',  // AllSides "Lean Right"
    legacyType: 'family',
    displayName: 'New York Post',
    sourceType: 'national',
    countryCode: 'US',
    ownership: { owner: 'News Corp', parent: 'News Corp', type: 'public_traded', note: 'Owned by Rupert Murdoch\'s News Corp (NASDAQ: NWSA)' },
    funding: { model: 'Advertising, subscriptions', note: 'Tabloid format, conservative editorial stance' },
  },
  {
    domain: 'washingtonexaminer.com',
    name: 'Washington Examiner',
    lean: 'center-right',  // AllSides "Lean Right"
    legacyType: 'billionaire',
    displayName: 'Washington Examiner',
    sourceType: 'national',
    countryCode: 'US',
    ownership: { owner: 'Clarity Media Group', parent: 'Anschutz Corporation', type: 'private', note: 'Owned by billionaire Philip Anschutz' },
    funding: { model: 'Advertising, subscriptions', note: 'Conservative news and opinion' },
  },
  {
    domain: 'washingtontimes.com',
    name: 'Washington Times',
    lean: 'center-right',  // AllSides "Lean Right"
    legacyType: 'corporate',
    displayName: 'Washington Times',
    sourceType: 'national',
    countryCode: 'US',
    ownership: { owner: 'Operations Holdings', parent: 'Unification Church affiliates', type: 'private', note: 'Founded by Sun Myung Moon, now independent' },
    funding: { model: 'Advertising, subscriptions', note: 'Conservative daily newspaper' },
  },
  {
    domain: 'nationalreview.com',
    name: 'National Review',
    lean: 'center-right',  // AllSides "Lean Right"
    legacyType: 'nonprofit',
    displayName: 'National Review',
    sourceType: 'magazine',
    countryCode: 'US',
    ownership: { owner: 'National Review Inc', parent: 'National Review Inc', type: 'nonprofit', note: 'Founded by William F. Buckley Jr. in 1955' },
    funding: { model: 'Subscriptions, donations', note: 'Conservative intellectual magazine' },
  },
  {
    domain: 'hotair.com',
    name: 'Hot Air',
    lean: 'center-right',  // AllSides "Lean Right"
    legacyType: 'public',
    displayName: 'Hot Air',
    sourceType: 'analysis',
    countryCode: 'US',
    ownership: { owner: 'Salem Media Group', type: 'public_traded', note: 'Conservative blog' },
    funding: { model: 'Advertising' },
  },
  {
    domain: 'freebeacon.com',
    name: 'Washington Free Beacon',
    lean: 'center-right',  // AllSides "Lean Right"
    legacyType: 'nonprofit',
    displayName: 'Washington Free Beacon',
    sourceType: 'analysis',
    countryCode: 'US',
    ownership: { owner: 'Center for American Freedom', parent: 'Center for American Freedom', type: 'nonprofit', note: 'Conservative nonprofit news organization' },
    funding: { model: 'Donations', note: 'Investigative journalism, conservative perspective' },
  },
  {
    domain: 'thefp.com',
    name: 'The Free Press',
    lean: 'center-right',  // AllSides "Lean Right"
    legacyType: 'corporate',
    displayName: 'The Free Press',
    sourceType: 'magazine',
    countryCode: 'US',
    ownership: { owner: 'The Free Press', type: 'private', note: 'Founded by Bari Weiss' },
    funding: { model: 'Subscriptions' },
  },
  {
    domain: 'justthenews.com',
    name: 'Just the News',
    lean: 'center-right',  // AllSides "Lean Right"
    legacyType: 'corporate',
    displayName: 'Just the News',
    sourceType: 'national',
    countryCode: 'US',
    ownership: { owner: 'Just the News LLC', type: 'private', note: 'Founded by John Solomon' },
    funding: { model: 'Advertising' },
  },
  {
    domain: 'zerohedge.com',
    name: 'ZeroHedge',
    lean: 'center-right',  // AllSides "Lean Right"
    legacyType: 'corporate',
    displayName: 'ZeroHedge',
    sourceType: 'specialized',
    countryCode: 'US',
    ownership: { owner: 'ABC Media Ltd', type: 'private', note: 'Bulgaria-based' },
    funding: { model: 'Advertising' },
  },
  {
    domain: 'city-journal.org',
    name: 'City Journal',
    lean: 'center-right',  // AllSides "Lean Right"
    legacyType: 'nonprofit',
    displayName: 'City Journal',
    sourceType: 'magazine',
    countryCode: 'US',
    ownership: { owner: 'Manhattan Institute', type: 'nonprofit', note: 'Conservative think tank publication' },
    funding: { model: 'Donations' },
  },
  {
    domain: 'thedispatch.com',
    name: 'The Dispatch',
    lean: 'center-right',
    legacyType: 'corporate',
    displayName: 'The Dispatch',
    sourceType: 'magazine',
    countryCode: 'US',
    ownership: { owner: 'The Dispatch', parent: 'The Dispatch', type: 'private', note: 'Founded by Jonah Goldberg and Steve Hayes' },
    funding: { model: 'Subscriptions', note: 'Anti-Trump conservative analysis' },
  },
  {
    domain: 'thebulwark.com',
    name: 'The Bulwark',
    lean: 'center-right',
    legacyType: 'corporate',
    displayName: 'The Bulwark',
    sourceType: 'magazine',
    countryCode: 'US',
    ownership: { owner: 'Bulwark Media', parent: 'Bulwark Media', type: 'private', note: 'Founded by Charlie Sykes' },
    funding: { model: 'Subscriptions, advertising', note: 'Never-Trump conservative commentary' },
  },
  {
    domain: 'reason.com',
    name: 'Reason',
    lean: 'center',  // AllSides "Center" - libertarian
    legacyType: 'nonprofit',
    displayName: 'Reason',
    sourceType: 'magazine',
    countryCode: 'US',
    ownership: { owner: 'Reason Foundation', type: 'nonprofit', note: 'Libertarian magazine' },
    funding: { model: 'Donations & subscriptions' },
  },

  // ===========================================================================
  // US RIGHT
  // ===========================================================================
  {
    domain: 'dailywire.com',
    name: 'Daily Wire',
    lean: 'right',  // AllSides
    legacyType: 'corporate',
    displayName: 'Daily Wire',
    sourceType: 'corporate',
    countryCode: 'US',
    ownership: { owner: 'Daily Wire LLC', parent: 'Bentkey Ventures', type: 'private', note: 'Co-founded by Ben Shapiro and Jeremy Boreing' },
    funding: { model: 'Subscriptions, advertising', note: 'Conservative media and entertainment company' },
  },
  {
    domain: 'newsmax.com',
    name: 'Newsmax',
    lean: 'right',  // AllSides
    legacyType: 'corporate',
    displayName: 'Newsmax',
    sourceType: 'corporate',
    countryCode: 'US',
    ownership: { owner: 'Newsmax Media Inc', parent: 'Newsmax Media Inc', type: 'private', note: 'Founded by Christopher Ruddy' },
    funding: { model: 'Advertising, cable fees', note: 'Conservative cable and digital news' },
  },
  {
    domain: 'breitbart.com',
    name: 'Breitbart',
    lean: 'right',  // AllSides
    legacyType: 'corporate',
    displayName: 'Breitbart',
    sourceType: 'corporate',
    countryCode: 'US',
    ownership: { owner: 'Breitbart News Network', parent: 'Breitbart News Network', type: 'private', note: 'Founded by Andrew Breitbart, previously chaired by Steve Bannon' },
    funding: { model: 'Advertising', note: 'Right-wing news and opinion' },
  },
  {
    domain: 'dailycaller.com',
    name: 'Daily Caller',
    lean: 'right',  // AllSides
    legacyType: 'corporate',
    displayName: 'Daily Caller',
    sourceType: 'corporate',
    countryCode: 'US',
    ownership: { owner: 'Daily Caller Inc', parent: 'Daily Caller Inc', type: 'private', note: 'Co-founded by Tucker Carlson and Neil Patel' },
    funding: { model: 'Advertising', note: 'Conservative news and opinion website' },
  },
  {
    domain: 'theblaze.com',
    name: 'The Blaze',
    lean: 'right',  // AllSides
    legacyType: 'corporate',
    displayName: 'The Blaze',
    sourceType: 'corporate',
    countryCode: 'US',
    ownership: { owner: 'Blaze Media', parent: 'Blaze Media', type: 'private', note: 'Founded by Glenn Beck, merged with CRTV' },
    funding: { model: 'Subscriptions, advertising', note: 'Conservative multimedia network' },
  },
  {
    domain: 'townhall.com',
    name: 'Townhall',
    lean: 'right',  // AllSides
    legacyType: 'public',
    displayName: 'Townhall',
    sourceType: 'corporate',
    countryCode: 'US',
    ownership: { owner: 'Salem Communications', parent: 'Salem Communications', type: 'public_traded', note: 'Part of Salem Media Group (NASDAQ: SALM)' },
    funding: { model: 'Advertising', note: 'Conservative news and commentary' },
  },
  {
    domain: 'redstate.com',
    name: 'RedState',
    lean: 'right',  // AllSides
    legacyType: 'public',
    displayName: 'RedState',
    sourceType: 'corporate',
    countryCode: 'US',
    ownership: { owner: 'Salem Communications', parent: 'Salem Communications', type: 'public_traded', note: 'Part of Salem Media Group (NASDAQ: SALM)' },
    funding: { model: 'Advertising', note: 'Conservative blog and news' },
  },
  {
    domain: 'thefederalist.com',
    name: 'The Federalist',
    lean: 'right',  // AllSides
    legacyType: 'corporate',
    displayName: 'The Federalist',
    sourceType: 'magazine',
    countryCode: 'US',
    ownership: { owner: 'FDRLST Media', parent: 'FDRLST Media', type: 'private', note: 'Co-founded by Ben Domenech and Sean Davis' },
    funding: { model: 'Advertising, donations', note: 'Conservative online magazine' },
  },
  {
    domain: 'epochtimes.com',
    name: 'The Epoch Times',
    lean: 'right',  // AllSides
    legacyType: 'nonprofit',
    displayName: 'The Epoch Times',
    sourceType: 'national',
    countryCode: 'US',
    ownership: { owner: 'Epoch Media Group', type: 'nonprofit', note: 'Falun Gong-affiliated' },
    funding: { model: 'Subscriptions & donations' },
  },
  {
    domain: 'theepochtimes.com',
    name: 'The Epoch Times',
    lean: 'right',
    legacyType: 'nonprofit',
    displayName: 'The Epoch Times',
    sourceType: 'national',
    countryCode: 'US',
    ownership: { owner: 'Epoch Media Group', type: 'private', note: 'Falun Gong-affiliated' },
    funding: { model: 'Subscriptions & donations' },
  },
  {
    domain: 'thenewamerican.com',
    name: 'The New American',
    lean: 'right',  // AllSides
    legacyType: 'nonprofit',
    displayName: 'The New American',
    sourceType: 'magazine',
    countryCode: 'US',
    ownership: { owner: 'American Opinion Publishing', type: 'nonprofit', note: 'John Birch Society affiliated' },
    funding: { model: 'Subscriptions & donations' },
  },
  {
    domain: 'thepostmillennial.com',
    name: 'The Post Millennial',
    lean: 'right',  // AllSides
    legacyType: 'corporate',
    displayName: 'The Post Millennial',
    sourceType: 'national',
    countryCode: 'CA',
    ownership: { owner: 'Human Events Media Group', type: 'private' },
    funding: { model: 'Advertising' },
  },
  {
    domain: 'oann.com',
    name: 'OANN',
    lean: 'right',  // AllSides
    legacyType: 'family',
    displayName: 'OAN',
    sourceType: 'national',
    countryCode: 'US',
    ownership: { owner: 'Herring Networks', type: 'private', note: 'One America News Network' },
    funding: { model: 'Cable & advertising' },
  },
  {
    domain: 'spectator.org',
    name: 'The American Spectator',
    lean: 'right',
    legacyType: 'nonprofit',
    displayName: 'The American Spectator',
    sourceType: 'magazine',
    countryCode: 'US',
    ownership: { owner: 'American Spectator Foundation', parent: 'American Spectator Foundation', type: 'nonprofit', note: 'Founded in 1924, conservative publication' },
    funding: { model: 'Subscriptions, donations', note: 'Conservative monthly magazine' },
  },
  {
    domain: 'hotair.com',
    name: 'Hot Air',
    lean: 'right',
    legacyType: 'public',
    displayName: 'Hot Air',
    sourceType: 'analysis',
    countryCode: 'US',
    ownership: { owner: 'Salem Media Group', type: 'public_traded', note: 'Conservative blog' },
    funding: { model: 'Advertising' },
  },
  {
    domain: 'pjmedia.com',
    name: 'PJ Media',
    lean: 'right',
    legacyType: 'public',
    displayName: 'PJ Media',
    sourceType: 'analysis',
    countryCode: 'US',
    ownership: { owner: 'Salem Media Group', type: 'public_traded', note: 'Conservative commentary' },
    funding: { model: 'Advertising' },
  },

  // ===========================================================================
  // US LEFT
  // ===========================================================================
  {
    domain: 'vox.com',
    name: 'Vox',
    lean: 'left',  // AllSides
    legacyType: 'corporate',
    displayName: 'Vox',
    sourceType: 'corporate',
    countryCode: 'US',
    ownership: { owner: 'Vox Media', type: 'private', note: 'Digital media company founded 2005' },
    funding: { model: 'Advertising, sponsored content' },
  },
  {
    domain: 'huffpost.com',
    name: 'HuffPost',
    lean: 'left',  // AllSides
    legacyType: 'corporate',
    displayName: 'HuffPost',
    sourceType: 'corporate',
    countryCode: 'US',
    ownership: { owner: 'BuzzFeed', type: 'public_traded', note: 'Acquired by BuzzFeed in 2021' },
    funding: { model: 'Advertising' },
  },
  {
    domain: 'motherjones.com',
    name: 'Mother Jones',
    lean: 'left',  // AllSides
    legacyType: 'nonprofit',
    displayName: 'Mother Jones',
    sourceType: 'nonprofit',
    countryCode: 'US',
    ownership: { owner: 'Foundation for National Progress', parent: 'Foundation for National Progress', type: 'nonprofit', note: 'Reader-supported nonprofit' },
    funding: { model: 'Donations, subscriptions', note: 'Progressive investigative reporting' },
  },
  {
    domain: 'thenation.com',
    name: 'The Nation',
    lean: 'left',  // AllSides
    legacyType: 'nonprofit',
    displayName: 'The Nation',
    sourceType: 'magazine',
    countryCode: 'US',
    ownership: { owner: 'The Nation Company', type: 'private', note: 'Oldest continuously published weekly magazine in US (1865)' },
    funding: { model: 'Subscriptions, donations' },
  },
  {
    domain: 'jacobin.com',
    name: 'Jacobin',
    lean: 'left',  // AllSides
    legacyType: 'corporate',
    displayName: 'Jacobin',
    sourceType: 'magazine',
    countryCode: 'US',
    ownership: { owner: 'Jacobin Foundation', parent: 'Jacobin Foundation', type: 'nonprofit', note: 'Democratic socialist quarterly' },
    funding: { model: 'Subscriptions', note: 'Socialist perspective on politics and economics' },
  },
  {
    domain: 'dailykos.com',
    name: 'Daily Kos',
    lean: 'left',  // AllSides
    legacyType: 'corporate',
    displayName: 'Daily Kos',
    sourceType: 'analysis',
    countryCode: 'US',
    ownership: { owner: 'Kos Media', type: 'private', note: 'Progressive blog/news site' },
    funding: { model: 'Advertising & donations' },
  },
  {
    domain: 'commondreams.org',
    name: 'Common Dreams',
    lean: 'left',  // AllSides
    legacyType: 'nonprofit',
    displayName: 'Common Dreams',
    sourceType: 'nonprofit',
    countryCode: 'US',
    ownership: { owner: 'Common Dreams', type: 'nonprofit', note: 'Progressive news nonprofit' },
    funding: { model: 'Donations' },
  },
  {
    domain: 'democracynow.org',
    name: 'Democracy Now!',
    lean: 'left',  // AllSides
    legacyType: 'nonprofit',
    displayName: 'Democracy Now',
    sourceType: 'nonprofit',
    countryCode: 'US',
    ownership: { owner: 'Democracy Now! Productions', type: 'nonprofit', note: 'Independent news program since 1996' },
    funding: { model: 'Viewer donations, foundation grants' },
  },
  {
    domain: 'theintercept.com',
    name: 'The Intercept',
    lean: 'left',  // AllSides
    legacyType: 'nonprofit',
    displayName: 'The Intercept',
    sourceType: 'nonprofit',
    countryCode: 'US',
    ownership: { owner: 'First Look Media', parent: 'First Look Media', type: 'nonprofit', note: 'Founded by Pierre Omidyar' },
    funding: { model: 'Nonprofit grants', note: 'Adversarial investigative journalism' },
  },
  {
    domain: 'slate.com',
    name: 'Slate',
    lean: 'left',  // AllSides
    legacyType: 'corporate',
    displayName: 'Slate',
    sourceType: 'magazine',
    countryCode: 'US',
    ownership: { owner: 'The Slate Group', parent: 'Graham Holdings', type: 'public_traded', note: 'Online magazine founded 1996' },
    funding: { model: 'Advertising, Slate Plus subscriptions' },
  },
  {
    domain: 'salon.com',
    name: 'Salon',
    lean: 'left',  // AllSides
    legacyType: 'corporate',
    displayName: 'Salon',
    sourceType: 'magazine',
    countryCode: 'US',
    ownership: { owner: 'Salon Media Group', type: 'private', note: 'Progressive online magazine' },
    funding: { model: 'Advertising & subscriptions' },
  },
  {
    domain: 'thedailybeast.com',
    name: 'The Daily Beast',
    lean: 'left',  // AllSides
    legacyType: 'billionaire',
    displayName: 'The Daily Beast',
    sourceType: 'national',
    countryCode: 'US',
    ownership: { owner: 'The Daily Beast Company', parent: 'IAC', type: 'public_traded', note: 'Barry Diller/IAC' },
    funding: { model: 'Advertising & subscriptions' },
  },
  {
    domain: 'theatlantic.com',
    name: 'The Atlantic',
    lean: 'left',  // AllSides
    legacyType: 'billionaire',
    displayName: 'THE ATLANTIC',
    sourceType: 'magazine',
    countryCode: 'US',
    ownership: { owner: 'The Atlantic Monthly Group', parent: 'Emerson Collective (Laurene Powell Jobs)', type: 'private', note: 'Steve Jobs\' widow acquired majority stake in 2017' },
    funding: { model: 'Subscriptions, advertising & events (Atlantic Festival)' },
  },
  {
    domain: 'newyorker.com',
    name: 'The New Yorker',
    lean: 'left',  // AllSides
    legacyType: 'family',
    displayName: 'THE NEW YORKER',
    sourceType: 'magazine',
    countryCode: 'US',
    ownership: { owner: 'The New Yorker', parent: 'Condé Nast (Advance Publications)', type: 'private', note: 'Advance owned by Newhouse family since 1985' },
    funding: { model: 'Subscriptions & advertising' },
  },
  {
    domain: 'propublica.org',
    name: 'ProPublica',
    lean: 'center-left',  // AllSides
    legacyType: 'nonprofit',
    displayName: 'ProPublica',
    sourceType: 'nonprofit',
    countryCode: 'US',
    ownership: { owner: 'ProPublica Inc', parent: 'ProPublica Inc', type: 'nonprofit', note: 'Independent nonprofit newsroom' },
    funding: { model: 'Donations, foundations', note: 'Pulitzer-winning investigative journalism' },
  },
  {
    domain: 'newrepublic.com',
    name: 'The New Republic',
    lean: 'left',
    legacyType: 'billionaire',
    displayName: 'The New Republic',
    sourceType: 'magazine',
    countryCode: 'US',
    ownership: { owner: 'Win McCormack', parent: 'Win McCormack', type: 'private', note: 'Owned by investor Win McCormack' },
    funding: { model: 'Subscriptions, advertising', note: 'Progressive political magazine since 1914' },
  },
  {
    domain: 'rawstory.com',
    name: 'Raw Story',
    lean: 'left',
    legacyType: 'corporate',
    displayName: 'Raw Story',
    sourceType: 'national',
    countryCode: 'US',
    ownership: { owner: 'Raw Story Media Inc', type: 'private', note: 'Progressive news site' },
    funding: { model: 'Advertising' },
  },
  {
    domain: 'rollingstone.com',
    name: 'Rolling Stone',
    lean: 'left',
    legacyType: 'corporate',
    displayName: 'Rolling Stone',
    sourceType: 'magazine',
    countryCode: 'US',
    ownership: { owner: 'Penske Media Corporation', parent: 'Penske Media Corporation', type: 'private', note: 'Entertainment and culture magazine since 1967' },
    funding: { model: 'Advertising & subscriptions' },
  },

  // ===========================================================================
  // CENTER - ANALYSIS / THINK TANKS
  // ===========================================================================
  {
    domain: 'thehill.com',
    name: 'The Hill',
    lean: 'center',  // AllSides
    legacyType: 'corporate',
    displayName: 'THE HILL',
    sourceType: 'analysis',
    countryCode: 'US',
    ownership: { owner: 'Nexstar Media Group', type: 'public_traded', note: 'NASDAQ (NXST). Nexstar acquired The Hill in 2021 for $130M' },
    funding: { model: 'Advertising & events' },
  },
  {
    domain: 'politico.com',
    name: 'Politico',
    lean: 'center-left',  // AllSides
    legacyType: 'corporate',
    displayName: 'POLITICO',
    sourceType: 'analysis',
    countryCode: 'US',
    ownership: { owner: 'Axel Springer SE', type: 'private', note: 'German media conglomerate acquired Politico in 2021 for ~$1B. KKR is investor' },
    funding: { model: 'Advertising, Politico Pro subscriptions & events' },
  },
  {
    domain: 'semafor.com',
    name: 'Semafor',
    lean: 'center-left',  // AllSides
    legacyType: 'corporate',
    displayName: 'SEMAFOR',
    sourceType: 'national',
    countryCode: 'US',
    ownership: { owner: 'Semafor Inc', type: 'private', note: 'Founded by former BuzzFeed News and NYT journalists' },
    funding: { model: 'Advertising & subscriptions' },
  },
  {
    domain: 'bloomberg.com',
    name: 'Bloomberg',
    lean: 'center-left',  // AllSides
    legacyType: 'billionaire',
    displayName: 'BLOOMBERG',
    sourceType: 'specialized',
    countryCode: 'US',
    ownership: { owner: 'Michael Bloomberg', parent: 'Bloomberg L.P.', type: 'private', note: 'Michael Bloomberg owns ~88%. Revenue primarily from Terminal (~$10B/year)' },
    funding: { model: 'Bloomberg Terminal subscriptions (primary), news licensing & advertising' },
  },
  {
    domain: 'time.com',
    name: 'Time',
    lean: 'center-left',  // AllSides
    legacyType: 'billionaire',
    displayName: 'TIME',
    sourceType: 'magazine',
    countryCode: 'US',
    ownership: { owner: 'Time USA, LLC', parent: 'Marc Benioff', type: 'private', note: 'Purchased by Salesforce founder Marc Benioff in 2018 for $190M' },
    funding: { model: 'Advertising, subscriptions & events' },
  },
  {
    domain: 'wsj.com',
    name: 'Wall Street Journal',
    lean: 'center',  // AllSides (news section)
    legacyType: 'family',
    displayName: 'WALL STREET JOURNAL',
    sourceType: 'specialized',
    countryCode: 'US',
    ownership: { owner: 'Dow Jones & Company', parent: 'News Corp (Murdoch family)', type: 'public_traded', note: 'News Corp trades NASDAQ (NWSA). Largest US newspaper by circulation' },
    funding: { model: 'Subscriptions (3M+) & advertising' },
  },
  {
    domain: 'cnbc.com',
    name: 'CNBC',
    lean: 'center',  // AllSides
    legacyType: 'public',
    displayName: 'CNBC',
    sourceType: 'specialized',
    countryCode: 'US',
    ownership: { owner: 'NBCUniversal', parent: 'Comcast Corporation', type: 'public_traded', note: 'NASDAQ (CMCSA). Business & financial news network' },
    funding: { model: 'Advertising, cable carriage fees & CNBC Pro subscriptions' },
  },
  {
    domain: 'newsweek.com',
    name: 'Newsweek',
    lean: 'center',  // AllSides
    legacyType: 'corporate',
    displayName: 'NEWSWEEK',
    sourceType: 'magazine',
    countryCode: 'US',
    ownership: { owner: 'Newsweek Media Group', parent: 'IBT Media', type: 'private', note: 'Owned by IBT Media (Dev Pragad). Controversial ownership history' },
    funding: { model: 'Advertising (primarily digital)' },
  },
  {
    domain: 'csmonitor.com',
    name: 'Christian Science Monitor',
    lean: 'center',  // AllSides
    legacyType: 'nonprofit',
    displayName: 'Christian Science Monitor',
    sourceType: 'national',
    countryCode: 'US',
    ownership: { owner: 'The First Church of Christ, Scientist', type: 'nonprofit', note: 'Non-proselytizing news publication' },
    funding: { model: 'Donations & subscriptions' },
  },
  {
    domain: 'straightarrownews.com',
    name: 'Straight Arrow News',
    lean: 'center',  // AllSides Certified Balanced
    legacyType: 'corporate',
    displayName: 'Straight Arrow News',
    sourceType: 'national',
    countryCode: 'US',
    ownership: { owner: 'Straight Arrow News', type: 'private', note: 'Launched 2022; AllSides Certified Balanced' },
    funding: { model: 'Advertising' },
  },
  {
    domain: '1440.com',
    name: '1440 Newsletter',
    lean: 'center',  // AllSides
    legacyType: 'corporate',
    displayName: '1440 Newsletter',
    sourceType: 'national',
    countryCode: 'US',
    ownership: { owner: '1440 Media', type: 'private' },
    funding: { model: 'Advertising' },
  },
  {
    domain: 'readtangle.com',
    name: 'Tangle',
    lean: 'center',  // AllSides
    legacyType: 'corporate',
    displayName: 'Tangle',
    sourceType: 'national',
    countryCode: 'US',
    ownership: { owner: 'Tangle Media', type: 'private', note: 'Founded by Isaac Saul' },
    funding: { model: 'Subscriptions' },
  },
  {
    domain: 'allsides.com',
    name: 'AllSides',
    lean: 'center',
    legacyType: 'corporate',
    displayName: 'AllSides',
    sourceType: 'analysis',
    countryCode: 'US',
    ownership: { owner: 'AllSides Technologies', type: 'private', note: 'Media bias rating and balanced news aggregation' },
    funding: { model: 'Advertising & partnerships' },
  },
  {
    domain: 'economist.com',
    name: 'The Economist',
    lean: 'center',
    legacyType: 'family',
    displayName: 'THE ECONOMIST',
    sourceType: 'magazine',
    countryCode: 'UK',
    ownership: { owner: 'The Economist Group', type: 'private', note: 'Agnelli family (Exor) ~43%, Rothschild family ~21%' },
    funding: { model: 'Subscriptions (primary) & advertising' },
  },
  {
    domain: 'ft.com',
    name: 'Financial Times',
    lean: 'center',
    legacyType: 'corporate',
    displayName: 'FINANCIAL TIMES',
    sourceType: 'specialized',
    countryCode: 'UK',
    ownership: { owner: 'Nikkei, Inc.', type: 'private', note: 'Japanese media company acquired FT from Pearson in 2015 for $1.3B' },
    funding: { model: 'Subscriptions (1M+ paying readers) & advertising' },
  },
  {
    domain: 'mediaite.com',
    name: 'Mediaite',
    lean: 'center',
    legacyType: 'corporate',
    displayName: 'Mediaite',
    sourceType: 'specialized',
    countryCode: 'US',
    ownership: { owner: 'Mediaite LLC', type: 'private', note: 'Media news and opinion' },
    funding: { model: 'Advertising' },
  },
  {
    domain: 'theweek.com',
    name: 'The Week',
    lean: 'center',
    legacyType: 'public',
    displayName: 'The Week',
    sourceType: 'magazine',
    countryCode: 'US',
    ownership: { owner: 'Future plc', type: 'public_traded', note: 'News digest magazine' },
    funding: { model: 'Advertising & subscriptions' },
  },

  // ===========================================================================
  // THINK TANKS & ANALYSIS
  // ===========================================================================
  {
    domain: 'responsiblestatecraft.org',
    name: 'Responsible Statecraft',
    lean: 'center',
    legacyType: 'nonprofit',
    displayName: 'RESPONSIBLE STATECRAFT',
    sourceType: 'analysis',
    countryCode: 'US',
    ownership: { owner: 'Quincy Institute for Responsible Statecraft', type: 'nonprofit', note: 'Think tank founded 2019 with Koch & Soros funding' },
    funding: { model: 'Foundation grants & donations' },
  },
  {
    domain: 'foreignpolicy.com',
    name: 'Foreign Policy',
    lean: 'center',
    legacyType: 'public',
    displayName: 'FOREIGN POLICY',
    sourceType: 'analysis',
    countryCode: 'US',
    ownership: { owner: 'The FP Group', parent: 'Graham Holdings Company', type: 'public_traded', note: 'NYSE (GHC). Founded by Samuel Huntington' },
    funding: { model: 'Subscriptions, advertising & events' },
  },
  {
    domain: 'foreignaffairs.com',
    name: 'Foreign Affairs',
    lean: 'center',
    legacyType: 'nonprofit',
    displayName: 'FOREIGN AFFAIRS',
    sourceType: 'analysis',
    countryCode: 'US',
    ownership: { owner: 'Council on Foreign Relations', type: 'nonprofit', note: 'Published by CFR since 1922. Influential foreign policy journal' },
    funding: { model: 'Subscriptions & CFR funding' },
  },
  {
    domain: 'cfr.org',
    name: 'CFR',
    lean: 'center',
    legacyType: 'nonprofit',
    displayName: 'CFR',
    sourceType: 'analysis',
    countryCode: 'US',
    ownership: { owner: 'Council on Foreign Relations', type: 'nonprofit', note: 'Non-partisan think tank founded 1921. ~5,000 members' },
    funding: { model: 'Membership dues, corporate sponsors & foundation grants' },
  },
  {
    domain: 'brookings.edu',
    name: 'Brookings',
    lean: 'center-left',
    legacyType: 'nonprofit',
    displayName: 'BROOKINGS',
    sourceType: 'analysis',
    countryCode: 'US',
    ownership: { owner: 'Brookings Institution', type: 'nonprofit', note: 'Founded 1916. Centrist/center-left; largest US think tank' },
    funding: { model: 'Foundation grants, corporate donations & government contracts' },
  },
  {
    domain: 'cato.org',
    name: 'Cato Institute',
    lean: 'center',
    legacyType: 'nonprofit',
    displayName: 'CATO INSTITUTE',
    sourceType: 'analysis',
    countryCode: 'US',
    ownership: { owner: 'Cato Institute', type: 'nonprofit', note: 'Libertarian think tank founded 1977 by Charles Koch' },
    funding: { model: 'Individual donations & foundation grants (no government funding)' },
  },
  {
    domain: 'heritage.org',
    name: 'Heritage Foundation',
    lean: 'right',
    legacyType: 'nonprofit',
    displayName: 'HERITAGE FOUNDATION',
    sourceType: 'analysis',
    countryCode: 'US',
    ownership: { owner: 'The Heritage Foundation', type: 'nonprofit', note: 'Conservative think tank founded 1973. Influential in Republican circles' },
    funding: { model: 'Individual donations, foundation grants & corporate sponsors' },
  },
  {
    domain: 'carnegieendowment.org',
    name: 'Carnegie Endowment',
    lean: 'center',
    legacyType: 'nonprofit',
    displayName: 'CARNEGIE',
    sourceType: 'analysis',
    countryCode: 'US',
    ownership: { owner: 'Carnegie Endowment for International Peace', type: 'nonprofit', note: 'Founded 1910 by Andrew Carnegie. Global network' },
    funding: { model: 'Endowment income, foundation grants & government contracts' },
  },
  {
    domain: 'rand.org',
    name: 'RAND',
    lean: 'center',
    legacyType: 'nonprofit',
    displayName: 'RAND',
    sourceType: 'analysis',
    countryCode: 'US',
    ownership: { owner: 'RAND Corporation', type: 'nonprofit', note: 'Founded 1948; originally Douglas Aircraft/Air Force project' },
    funding: { model: 'US government contracts (primary), foundation grants' },
  },

  // ===========================================================================
  // CANADIAN NATIONAL & LOCAL
  // ===========================================================================
  {
    domain: 'nationalpost.com',
    name: 'National Post',
    lean: 'center-right',
    legacyType: 'public',
    displayName: 'NATIONAL POST',
    sourceType: 'national',
    countryCode: 'CA',
    ownership: { owner: 'Postmedia Network', type: 'public_traded', note: 'TSX (PNC.A). US hedge funds (Chatham Asset Management) hold significant debt position' },
    funding: { model: 'Advertising & subscriptions' },
  },
  {
    domain: 'theglobeandmail.com',
    name: 'Globe and Mail',
    lean: 'center',
    legacyType: 'family',
    displayName: 'GLOBE AND MAIL',
    sourceType: 'national',
    countryCode: 'CA',
    ownership: { owner: 'Woodbridge Company', type: 'private', note: 'Thomson family investment vehicle owns 85%. Canada\'s newspaper of record' },
    funding: { model: 'Subscriptions & advertising' },
  },
  {
    domain: 'globeandmail.com',
    name: 'Globe and Mail',
    lean: 'center',
    legacyType: 'family',
    displayName: 'GLOBE AND MAIL',
    sourceType: 'national',
    countryCode: 'CA',
    ownership: { owner: 'Woodbridge Company', type: 'private', note: 'Thomson family investment vehicle owns 85%' },
    funding: { model: 'Subscriptions & advertising' },
  },
  {
    domain: 'torontostar.com',
    name: 'Toronto Star',
    lean: 'center-left',
    legacyType: 'corporate',
    displayName: 'TORONTO STAR',
    sourceType: 'national',
    countryCode: 'CA',
    ownership: { owner: 'Torstar Corporation', parent: 'NordStar Capital', type: 'private', note: 'Acquired by NordStar (Jordan Chicken, Paul Chicken) in 2020 for $52M' },
    funding: { model: 'Subscriptions & advertising' },
  },
  {
    domain: 'thestar.com',
    name: 'Toronto Star',
    lean: 'center-left',
    legacyType: 'corporate',
    displayName: 'TORONTO STAR',
    sourceType: 'national',
    countryCode: 'CA',
    ownership: { owner: 'Torstar Corporation', parent: 'NordStar Capital', type: 'private', note: 'Acquired by NordStar in 2020 for $52M' },
    funding: { model: 'Subscriptions & advertising' },
  },
  {
    domain: 'calgaryherald.com',
    name: 'Calgary Herald',
    lean: 'center-right',
    legacyType: 'public',
    displayName: 'CALGARY HERALD',
    sourceType: 'local',
    countryCode: 'CA',
    ownership: { owner: 'Postmedia Network', type: 'public_traded', note: 'Part of Postmedia chain. TSX (PNC.A)' },
    funding: { model: 'Advertising & subscriptions' },
  },
  {
    domain: 'edmontonjournal.com',
    name: 'Edmonton Journal',
    lean: 'center-right',
    legacyType: 'public',
    displayName: 'EDMONTON JOURNAL',
    sourceType: 'local',
    countryCode: 'CA',
    ownership: { owner: 'Postmedia Network', type: 'public_traded', note: 'Part of Postmedia chain' },
    funding: { model: 'Advertising & subscriptions' },
  },
  {
    domain: 'vancouversun.com',
    name: 'Vancouver Sun',
    lean: 'center',
    legacyType: 'public',
    displayName: 'VANCOUVER SUN',
    sourceType: 'local',
    countryCode: 'CA',
    ownership: { owner: 'Postmedia Network', type: 'public_traded', note: 'Part of Postmedia chain' },
    funding: { model: 'Advertising & subscriptions' },
  },
  {
    domain: 'ottawacitizen.com',
    name: 'Ottawa Citizen',
    lean: 'center',
    legacyType: 'public',
    displayName: 'OTTAWA CITIZEN',
    sourceType: 'local',
    countryCode: 'CA',
    ownership: { owner: 'Postmedia Network', type: 'public_traded', note: 'Part of Postmedia chain' },
    funding: { model: 'Advertising & subscriptions' },
  },
  {
    domain: 'montrealgazette.com',
    name: 'Montreal Gazette',
    lean: 'center',
    legacyType: 'public',
    displayName: 'MONTREAL GAZETTE',
    sourceType: 'local',
    countryCode: 'CA',
    ownership: { owner: 'Postmedia Network', type: 'public_traded', note: 'Part of Postmedia chain' },
    funding: { model: 'Advertising & subscriptions' },
  },
  {
    domain: 'theprovince.com',
    name: 'The Province',
    lean: 'center',
    legacyType: 'public',
    displayName: 'THE PROVINCE',
    sourceType: 'local',
    countryCode: 'CA',
    ownership: { owner: 'Postmedia Network', type: 'public_traded', note: 'Vancouver tabloid. Part of Postmedia chain' },
    funding: { model: 'Advertising & subscriptions' },
  },
  {
    domain: 'windsorstar.com',
    name: 'Windsor Star',
    lean: 'center',
    legacyType: 'public',
    displayName: 'WINDSOR STAR',
    sourceType: 'local',
    countryCode: 'CA',
    ownership: { owner: 'Postmedia Network', type: 'public_traded', note: 'Part of Postmedia chain' },
    funding: { model: 'Advertising & subscriptions' },
  },
  {
    domain: 'leaderpost.com',
    name: 'Regina Leader-Post',
    lean: 'center',
    legacyType: 'public',
    displayName: 'REGINA LEADER-POST',
    sourceType: 'local',
    countryCode: 'CA',
    ownership: { owner: 'Postmedia Network', type: 'public_traded', note: 'Part of Postmedia chain' },
    funding: { model: 'Advertising & subscriptions' },
  },
  {
    domain: 'winnipegfreepress.com',
    name: 'Winnipeg Free Press',
    lean: 'center',
    legacyType: 'family',
    displayName: 'WINNIPEG FREE PRESS',
    sourceType: 'local',
    countryCode: 'CA',
    ownership: { owner: 'FP Canadian Newspapers LP', type: 'private', note: 'One of few major independent papers in Canada. Family-owned since 2001' },
    funding: { model: 'Subscriptions & advertising' },
  },
  {
    domain: 'thechronicleherald.ca',
    name: 'Chronicle Herald',
    lean: 'center',
    legacyType: 'corporate',
    displayName: 'CHRONICLE HERALD',
    sourceType: 'local',
    countryCode: 'CA',
    ownership: { owner: 'SaltWire Network', type: 'private', note: 'Largest independently owned newspaper group in Atlantic Canada' },
    funding: { model: 'Subscriptions & advertising' },
  },

  // ===========================================================================
  // UK NATIONAL
  // ===========================================================================
  {
    domain: 'telegraph.co.uk',
    name: 'The Telegraph',
    lean: 'center-right',
    legacyType: 'corporate',
    displayName: 'The Telegraph',
    sourceType: 'international',
    countryCode: 'GB',
    ownership: { owner: 'Telegraph Media Group', parent: 'RedBird IMI', type: 'private', note: 'British broadsheet, UAE-backed consortium' },
    funding: { model: 'Subscriptions, advertising', note: 'UK center-right broadsheet' },
  },
  {
    domain: 'independent.co.uk',
    name: 'The Independent',
    lean: 'center-left',
    legacyType: 'billionaire',
    displayName: 'THE INDEPENDENT',
    sourceType: 'national',
    countryCode: 'UK',
    ownership: { owner: 'Independent Digital News & Media', parent: 'Sultan Muhammad Abuljadayel', type: 'private', note: 'Saudi investor acquired majority 2023. Digital-only since 2016' },
    funding: { model: 'Advertising (free access)' },
  },
  {
    domain: 'thetimes.co.uk',
    name: 'The Times',
    lean: 'center-right',
    legacyType: 'family',
    displayName: 'THE TIMES',
    sourceType: 'national',
    countryCode: 'UK',
    ownership: { owner: 'Times Media Limited', parent: 'News UK (News Corp)', type: 'public_traded', note: 'News Corp trades NASDAQ (NWSA). Murdoch family controls voting shares' },
    funding: { model: 'Subscriptions (hard paywall) & advertising' },
  },
  {
    domain: 'dailymail.co.uk',
    name: 'Daily Mail',
    lean: 'center-right',
    legacyType: 'family',
    displayName: 'DAILY MAIL',
    sourceType: 'national',
    countryCode: 'UK',
    ownership: { owner: 'Daily Mail and General Trust (DMGT)', type: 'private', note: 'Controlled by 4th Viscount Rothermere (Jonathan Harmsworth). Delisted 2021' },
    funding: { model: 'Advertising (largest English-language newspaper website)' },
  },
  {
    domain: 'mirror.co.uk',
    name: 'The Mirror',
    lean: 'center-left',
    legacyType: 'public',
    displayName: 'THE MIRROR',
    sourceType: 'national',
    countryCode: 'UK',
    ownership: { owner: 'Reach plc', type: 'public_traded', note: 'Traded on London Stock Exchange (RCH). UK\'s largest newspaper publisher' },
    funding: { model: 'Advertising & subscriptions' },
  },
  {
    domain: 'thesun.co.uk',
    name: 'The Sun',
    lean: 'center-right',
    legacyType: 'family',
    displayName: 'THE SUN',
    sourceType: 'national',
    countryCode: 'UK',
    ownership: { owner: 'News UK', parent: 'News Corp (Murdoch family)', type: 'public_traded', note: 'News Corp trades NASDAQ (NWSA). UK\'s highest-circulation newspaper' },
    funding: { model: 'Advertising (free access)' },
  },
  {
    domain: 'express.co.uk',
    name: 'Express',
    lean: 'center-right',
    legacyType: 'public',
    displayName: 'EXPRESS',
    sourceType: 'national',
    countryCode: 'UK',
    ownership: { owner: 'Reach plc', type: 'public_traded', note: 'LSE (RCH). Acquired from Richard Desmond in 2018 for £127M' },
    funding: { model: 'Advertising & subscriptions' },
  },

  // ===========================================================================
  // AUSTRALIAN NATIONAL
  // ===========================================================================
  {
    domain: 'theaustralian.com.au',
    name: 'The Australian',
    lean: 'center-right',
    legacyType: 'family',
    displayName: 'THE AUSTRALIAN',
    sourceType: 'national',
    countryCode: 'AU',
    ownership: { owner: 'News Corp Australia', parent: 'News Corp (Murdoch family)', type: 'public_traded', note: 'News Corp trades NASDAQ (NWSA). Australia\'s only national broadsheet' },
    funding: { model: 'Subscriptions (paywall) & advertising' },
  },
  {
    domain: 'smh.com.au',
    name: 'Sydney Morning Herald',
    lean: 'center-left',
    legacyType: 'public',
    displayName: 'SYDNEY MORNING HERALD',
    sourceType: 'national',
    countryCode: 'AU',
    ownership: { owner: 'Nine Entertainment', type: 'public_traded', note: 'ASX (NEC). Part of former Fairfax Media, merged with Nine 2018' },
    funding: { model: 'Subscriptions & advertising' },
  },
  {
    domain: 'theage.com.au',
    name: 'The Age',
    lean: 'center-left',
    legacyType: 'public',
    displayName: 'THE AGE',
    sourceType: 'national',
    countryCode: 'AU',
    ownership: { owner: 'Nine Entertainment', type: 'public_traded', note: 'ASX (NEC). Melbourne broadsheet; part of former Fairfax Media' },
    funding: { model: 'Subscriptions & advertising' },
  },
  {
    domain: 'afr.com',
    name: 'AFR',
    lean: 'center',
    legacyType: 'public',
    displayName: 'AFR',
    sourceType: 'specialized',
    countryCode: 'AU',
    ownership: { owner: 'Nine Entertainment', type: 'public_traded', note: 'Australian Financial Review; acquired via Fairfax merger. ASX (NEC)' },
    funding: { model: 'Subscriptions (primary) & advertising' },
  },

  // ===========================================================================
  // NEW ZEALAND
  // ===========================================================================
  {
    domain: 'nzherald.co.nz',
    name: 'NZ Herald',
    lean: 'center',
    legacyType: 'public',
    displayName: 'NZ HERALD',
    sourceType: 'national',
    countryCode: 'NZ',
    ownership: { owner: 'New Zealand Media and Entertainment (NZME)', type: 'public_traded', note: 'Traded on NZX (NZM). New Zealand\'s largest newspaper' },
    funding: { model: 'Advertising & subscriptions' },
  },
  {
    domain: 'stuff.co.nz',
    name: 'Stuff',
    lean: 'center-left',
    legacyType: 'corporate',
    displayName: 'STUFF',
    sourceType: 'national',
    countryCode: 'NZ',
    ownership: { owner: 'Stuff Limited', type: 'private', note: 'Sold by Nine Entertainment to CEO Sinead Boucher for $1 in 2020' },
    funding: { model: 'Advertising (free access model)' },
  },

  // ===========================================================================
  // IRELAND
  // ===========================================================================
  {
    domain: 'irishtimes.com',
    name: 'Irish Times',
    lean: 'center-left',
    legacyType: 'nonprofit',
    displayName: 'IRISH TIMES',
    sourceType: 'national',
    countryCode: 'IE',
    ownership: { owner: 'The Irish Times Trust', type: 'trust', note: 'Trust structure ensures editorial independence; cannot be sold for profit' },
    funding: { model: 'Subscriptions & advertising' },
  },
  {
    domain: 'independent.ie',
    name: 'Irish Independent',
    lean: 'center',
    legacyType: 'corporate',
    displayName: 'IRISH INDEPENDENT',
    sourceType: 'national',
    countryCode: 'IE',
    ownership: { owner: 'Mediahuis', type: 'private', note: 'Belgian media group acquired from INM in 2019. Ireland\'s largest newspaper' },
    funding: { model: 'Advertising & subscriptions' },
  },

  // ===========================================================================
  // SPECIALIZED / FINANCIAL / TECH
  // ===========================================================================
  {
    domain: 'forbes.com',
    name: 'Forbes',
    lean: 'center',
    legacyType: 'billionaire',
    displayName: 'FORBES',
    sourceType: 'magazine',
    countryCode: 'US',
    ownership: { owner: 'Forbes Media', parent: 'Integrated Whale Media (Austin Russell)', type: 'private', note: 'Luminar founder Austin Russell acquired majority stake 2022' },
    funding: { model: 'Advertising, Forbes contributor network & events' },
  },
  {
    domain: 'businessinsider.com',
    name: 'Business Insider',
    lean: 'center-left',
    legacyType: 'corporate',
    displayName: 'Business Insider',
    sourceType: 'specialized',
    countryCode: 'US',
    ownership: { owner: 'Insider Inc', parent: 'Axel Springer', type: 'private' },
    funding: { model: 'Advertising & subscriptions' },
  },
  {
    domain: 'vanityfair.com',
    name: 'Vanity Fair',
    lean: 'center-left',
    legacyType: 'family',
    displayName: 'Vanity Fair',
    sourceType: 'magazine',
    countryCode: 'US',
    ownership: { owner: 'Condé Nast', parent: 'Advance Publications', type: 'private' },
    funding: { model: 'Advertising & subscriptions' },
  },
  {
    domain: 'wired.com',
    name: 'Wired',
    lean: 'center-left',
    legacyType: 'family',
    displayName: 'WIRED',
    sourceType: 'specialized',
    countryCode: 'US',
    ownership: { owner: 'Wired', parent: 'Condé Nast (Advance Publications)', type: 'private', note: 'Advance owned by Newhouse family' },
    funding: { model: 'Subscriptions & advertising' },
  },
  {
    domain: 'techcrunch.com',
    name: 'TechCrunch',
    lean: 'center',
    legacyType: 'corporate',
    displayName: 'TECHCRUNCH',
    sourceType: 'specialized',
    countryCode: 'US',
    ownership: { owner: 'TechCrunch', parent: 'Yahoo (Apollo Global Management)', type: 'private', note: 'Yahoo acquired from AOL/Verizon. Apollo acquired Yahoo 2021' },
    funding: { model: 'Advertising & TechCrunch+ subscriptions' },
  },
  {
    domain: 'theverge.com',
    name: 'The Verge',
    lean: 'center-left',
    legacyType: 'corporate',
    displayName: 'THE VERGE',
    sourceType: 'specialized',
    countryCode: 'US',
    ownership: { owner: 'Vox Media', type: 'private', note: 'Backed by NBCUniversal and venture capital' },
    funding: { model: 'Advertising & Vox Media brand partnerships' },
  },
  {
    domain: 'marketwatch.com',
    name: 'MarketWatch',
    lean: 'center',
    legacyType: 'family',
    displayName: 'MARKETWATCH',
    sourceType: 'specialized',
    countryCode: 'US',
    ownership: { owner: 'Dow Jones & Company', parent: 'News Corp (Murdoch family)', type: 'public_traded', note: 'News Corp trades NASDAQ (NWSA). Sister to WSJ' },
    funding: { model: 'Advertising (free access)' },
  },
  {
    domain: 'barrons.com',
    name: 'Barrons',
    lean: 'center',
    legacyType: 'family',
    displayName: 'BARRONS',
    sourceType: 'specialized',
    countryCode: 'US',
    ownership: { owner: 'Dow Jones & Company', parent: 'News Corp (Murdoch family)', type: 'public_traded', note: 'Premium financial weekly since 1921' },
    funding: { model: 'Subscriptions (paywall) & advertising' },
  },
  {
    domain: 'investopedia.com',
    name: 'Investopedia',
    lean: 'center',
    legacyType: 'public',
    displayName: 'INVESTOPEDIA',
    sourceType: 'specialized',
    countryCode: 'US',
    ownership: { owner: 'Investopedia', parent: 'Dotdash Meredith (IAC)', type: 'public_traded', note: 'IAC trades NASDAQ (IAC)' },
    funding: { model: 'Advertising & affiliate marketing' },
  },
  {
    domain: 'seekingalpha.com',
    name: 'Seeking Alpha',
    lean: 'center',
    legacyType: 'corporate',
    displayName: 'SEEKING ALPHA',
    sourceType: 'specialized',
    countryCode: 'US',
    ownership: { owner: 'Seeking Alpha Ltd.', type: 'private', note: 'Crowd-sourced financial analysis; venture-backed' },
    funding: { model: 'Premium subscriptions & advertising' },
  },
  {
    domain: 'fool.com',
    name: 'Motley Fool',
    lean: 'center',
    legacyType: 'family',
    displayName: 'MOTLEY FOOL',
    sourceType: 'specialized',
    countryCode: 'US',
    ownership: { owner: 'The Motley Fool Holdings, Inc.', type: 'private', note: 'Founded 1993 by Tom & David Gardner' },
    funding: { model: 'Premium subscription services (Stock Advisor, Rule Breakers)' },
  },
  {
    domain: 'morningstar.com',
    name: 'Morningstar',
    lean: 'center',
    legacyType: 'public',
    displayName: 'MORNINGSTAR',
    sourceType: 'specialized',
    countryCode: 'US',
    ownership: { owner: 'Morningstar, Inc.', type: 'public_traded', note: 'NASDAQ (MORN). Independent investment research founded 1984' },
    funding: { model: 'Data/software licensing, Morningstar Premium subscriptions' },
  },
  {
    domain: 'benzinga.com',
    name: 'Benzinga',
    lean: 'center',
    legacyType: 'corporate',
    displayName: 'BENZINGA',
    sourceType: 'specialized',
    countryCode: 'US',
    ownership: { owner: 'Benzinga', parent: 'Beringer Capital', type: 'private', note: 'Acquired by Beringer Capital 2021' },
    funding: { model: 'Advertising, data licensing & Benzinga Pro subscriptions' },
  },

  // ===========================================================================
  // REFERENCE & AGGREGATION
  // ===========================================================================
  {
    domain: 'wikipedia.org',
    name: 'Wikipedia',
    lean: 'center',
    legacyType: 'nonprofit',
    displayName: 'Wikipedia',
    sourceType: 'reference',
    countryCode: 'US',
    ownership: { owner: 'Wikimedia Foundation', type: 'nonprofit', note: 'Crowdsourced encyclopedia' },
    funding: { model: 'Donations' },
  },
  {
    domain: 'en.wikipedia.org',
    name: 'Wikipedia',
    lean: 'center',
    legacyType: 'nonprofit',
    displayName: 'Wikipedia',
    sourceType: 'reference',
    countryCode: 'US',
    ownership: { owner: 'Wikimedia Foundation', type: 'nonprofit', note: 'Crowdsourced encyclopedia' },
    funding: { model: 'Donations' },
  },
  {
    domain: 'dnyuz.com',
    name: 'DNYUZ',
    lean: 'center',
    legacyType: 'corporate',
    displayName: 'DNYUZ',
    sourceType: 'syndication',
    countryCode: 'US',
    ownership: { owner: 'Unknown', type: 'private', note: 'News aggregator' },
    funding: { model: 'Advertising' },
  },
  {
    domain: 'cleveland.com',
    name: 'Cleveland.com',
    lean: 'center-left',
    legacyType: 'family',
    displayName: 'Cleveland.com',
    sourceType: 'local',
    countryCode: 'US',
    ownership: { owner: 'Advance Local', parent: 'Advance Publications', type: 'private', note: 'Northeast Ohio regional news' },
    funding: { model: 'Advertising & subscriptions' },
  },

  // ===========================================================================
  // STATE-FUNDED (for transparency)
  // ===========================================================================
  {
    domain: 'rt.com',
    name: 'RT',
    lean: 'right',
    legacyType: 'government',
    displayName: 'RT',
    sourceType: 'state-funded',
    countryCode: 'RU',
    ownership: { owner: 'ANO TV-Novosti', type: 'state_owned', note: 'Russian state-controlled media; registered as foreign agent in US' },
    funding: { model: 'Russian government funding' },
  },

  // ===========================================================================
  // INDEPENDENT MEDIA - Creator-driven news & commentary
  // ===========================================================================

  // CANADIAN INDEPENDENT
  {
    domain: 'rebelnews.com',
    name: 'Rebel News',
    lean: 'right',
    legacyType: 'corporate',
    displayName: 'REBEL NEWS',
    sourceType: 'corporate',
    countryCode: 'CA',
    ownership: { owner: 'Rebel News Network Ltd.', type: 'private', note: 'Founded by Ezra Levant in 2015; crowdfunded independent media' },
    funding: { model: 'Viewer donations, merchandise & crowdfunding campaigns' },
  },
  {
    domain: 'tnc.news',
    name: 'True North',
    lean: 'right',
    legacyType: 'corporate',
    displayName: 'TRUE NORTH',
    sourceType: 'corporate',
    countryCode: 'CA',
    ownership: { owner: 'True North Centre for Public Policy', type: 'nonprofit', note: 'Founded by Candice Malcolm in 2018' },
    funding: { model: 'Donations & subscriptions' },
  },
  {
    domain: 'canadaland.com',
    name: 'Canadaland',
    lean: 'center-left',
    legacyType: 'corporate',
    displayName: 'CANADALAND',
    sourceType: 'corporate',
    countryCode: 'CA',
    ownership: { owner: 'Canadaland Media Inc.', type: 'private', note: 'Founded by Jesse Brown in 2013; investigative journalism focus' },
    funding: { model: 'Listener donations, Patreon & advertising' },
  },
  {
    domain: 'breachmedia.ca',
    name: 'The Breach',
    lean: 'left',
    legacyType: 'nonprofit',
    displayName: 'THE BREACH',
    sourceType: 'nonprofit',
    countryCode: 'CA',
    ownership: { owner: 'The Breach Media Inc.', type: 'nonprofit', note: 'Progressive independent outlet founded 2021' },
    funding: { model: 'Reader donations & foundation grants' },
  },
  {
    domain: 'westernstandardonline.com',
    name: 'Western Standard',
    lean: 'right',
    legacyType: 'corporate',
    displayName: 'WESTERN STANDARD',
    sourceType: 'corporate',
    countryCode: 'CA',
    ownership: { owner: 'Western Standard New Media Corp.', type: 'private', note: 'Relaunched 2019; Alberta-focused conservative news' },
    funding: { model: 'Subscriptions, advertising & donations' },
  },
  {
    domain: 'blacklocks.ca',
    name: "Blacklock's Reporter",
    lean: 'center',
    legacyType: 'corporate',
    displayName: "BLACKLOCK'S REPORTER",
    sourceType: 'specialized',
    countryCode: 'CA',
    ownership: { owner: "Blacklock's Reporter Inc.", type: 'private', note: 'Founded by Holly Doan & Tom Korski; parliamentary press gallery focus' },
    funding: { model: 'Subscriptions only - no advertising' },
  },
  {
    domain: 'pressprogress.ca',
    name: 'Press Progress',
    lean: 'left',
    legacyType: 'nonprofit',
    displayName: 'PRESS PROGRESS',
    sourceType: 'nonprofit',
    countryCode: 'CA',
    ownership: { owner: 'Broadbent Institute', type: 'nonprofit', note: 'Progressive think tank journalism project' },
    funding: { model: 'Broadbent Institute funding & donations' },
  },
  {
    domain: 'thecountersignal.com',
    name: 'The Counter Signal',
    lean: 'right',
    legacyType: 'corporate',
    displayName: 'THE COUNTER SIGNAL',
    sourceType: 'corporate',
    countryCode: 'CA',
    ownership: { owner: 'The Counter Signal Media Inc.', type: 'private', note: 'Founded by Keean Bexte; populist conservative outlet' },
    funding: { model: 'Subscriptions & donations' },
  },

  // US INDEPENDENT
  {
    domain: 'breakingpoints.com',
    name: 'Breaking Points',
    lean: 'center',
    legacyType: 'corporate',
    displayName: 'BREAKING POINTS',
    sourceType: 'corporate',
    countryCode: 'US',
    ownership: { owner: 'Breaking Points Media LLC', type: 'private', note: 'Founded by Krystal Ball & Saagar Enjeti in 2021; left-right duo format' },
    funding: { model: 'Subscriptions, YouTube ads & Superstore merchandise' },
  },
  {
    domain: 'racket.news',
    name: 'Matt Taibbi',
    lean: 'center-left',
    legacyType: 'corporate',
    displayName: 'RACKET NEWS',
    sourceType: 'corporate',
    countryCode: 'US',
    ownership: { owner: 'Matt Taibbi', type: 'private', note: 'Independent journalist; former Rolling Stone writer; Twitter Files reporter' },
    funding: { model: 'Substack subscriptions' },
  },
  {
    domain: 'greenwald.substack.com',
    name: 'Glenn Greenwald',
    lean: 'center-left',
    legacyType: 'corporate',
    displayName: 'GLENN GREENWALD',
    sourceType: 'corporate',
    countryCode: 'US',
    ownership: { owner: 'Glenn Greenwald', type: 'private', note: 'Independent journalist; Intercept co-founder; Pulitzer winner (Snowden)' },
    funding: { model: 'Substack subscriptions & Rumble partnership' },
  },
  {
    domain: 'thefp.com',
    name: 'The Free Press',
    lean: 'center',
    legacyType: 'corporate',
    displayName: 'THE FREE PRESS',
    sourceType: 'corporate',
    countryCode: 'US',
    ownership: { owner: 'The Free Press Media Inc.', type: 'private', note: 'Founded by Bari Weiss in 2021; centrist independent journalism' },
    funding: { model: 'Subscriptions & events' },
  },
  {
    domain: 'timcast.com',
    name: 'Tim Pool',
    lean: 'right',
    legacyType: 'corporate',
    displayName: 'TIMCAST',
    sourceType: 'corporate',
    countryCode: 'US',
    ownership: { owner: 'Timcast Media', type: 'private', note: 'Founded by Tim Pool; multi-show network including Timcast IRL' },
    funding: { model: 'YouTube ads, Rumble partnership & merchandise' },
  },
  {
    domain: 'rumble.com',
    name: 'Rumble',
    lean: 'center-right',
    legacyType: 'public',
    displayName: 'RUMBLE',
    sourceType: 'platform',
    countryCode: 'US',
    ownership: { owner: 'Rumble Inc.', type: 'public_traded', note: 'NASDAQ (RUM); video platform positioning as free speech alternative' },
    funding: { model: 'Advertising, creator partnerships & Rumble Cloud services' },
  },
  {
    domain: 'substack.com',
    name: 'Substack',
    lean: 'center',
    legacyType: 'corporate',
    displayName: 'SUBSTACK',
    sourceType: 'platform',
    countryCode: 'US',
    ownership: { owner: 'Substack Inc.', type: 'private', note: 'Newsletter platform founded 2017; hosts independent writers across spectrum' },
    funding: { model: '10% of paid subscriptions from writers' },
  },
];

// =============================================================================
// LOOKUP MAPS FOR FAST ACCESS
// =============================================================================

// Build domain lookup map
const domainMap = new Map<string, Source>();
for (const source of SOURCES) {
  domainMap.set(source.domain.toLowerCase(), source);
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Normalize a domain for lookup (removes www., m., amp. prefixes)
 */
function normalizeDomain(domain: string): string {
  return domain
    .toLowerCase()
    .replace(/^www\./, '')
    .replace(/^m\./, '')
    .replace(/^amp\./, '')
    .replace(/\/$/, '');
}

/**
 * Get source info from URL or domain
 */
export function getSourceInfo(urlOrDomain: string): Source | undefined {
  let domain: string;

  try {
    // If it looks like a URL, extract the hostname
    if (urlOrDomain.includes('://')) {
      domain = new URL(urlOrDomain).hostname;
    } else {
      domain = urlOrDomain;
    }
  } catch {
    domain = urlOrDomain;
  }

  const normalized = normalizeDomain(domain);

  // Exact match first
  const exactMatch = domainMap.get(normalized);
  if (exactMatch) return exactMatch;

  // Handle special subdomains (e.g., abcnews.go.com)
  if (normalized.includes('abcnews')) {
    return domainMap.get('abcnews.go.com');
  }
  if (normalized.includes('washingtonpost')) {
    return domainMap.get('washingtonpost.com');
  }
  if (normalized.includes('nytimes')) {
    return domainMap.get('nytimes.com');
  }

  // Partial match for major domains
  for (const source of SOURCES) {
    if (normalized.includes(source.domain) || source.domain.includes(normalized)) {
      return source;
    }
  }

  return undefined;
}

/**
 * Get political lean for a domain (defaults to 'center' if unknown)
 */
export function getPoliticalLean(urlOrDomain: string): PoliticalLean {
  const source = getSourceInfo(urlOrDomain);
  return source?.lean ?? 'center';
}

/**
 * Get display name for a domain
 */
export function getSourceName(urlOrDomain: string): string | null {
  const source = getSourceInfo(urlOrDomain);
  return source?.name ?? null;
}

/**
 * Get legacy ownership type for a domain (for UI badges)
 */
export function getOwnershipType(urlOrDomain: string): LegacyOwnershipType | null {
  const source = getSourceInfo(urlOrDomain);
  return source?.legacyType ?? null;
}

/**
 * Get ownership type label for display
 */
export function getOwnershipLabel(type: LegacyOwnershipType): string {
  const labels: Record<LegacyOwnershipType, string> = {
    nonprofit: 'Nonprofit',
    public: 'Public Company',
    family: 'Family-Controlled',
    billionaire: 'Billionaire-Owned',
    corporate: 'Corporate',
    government: 'State-Funded',
    cooperative: 'Member Cooperative',
  };
  return labels[type];
}

// =============================================================================
// FULL SOURCE INFO FOR API (used by route.ts)
// =============================================================================

export interface FullSourceInfo {
  displayName: string;
  type: SourceType;
  countryCode: string;
  ownership?: OwnershipInfo;
  funding?: FundingInfo;
  lean?: PoliticalLean;
}

/**
 * Get full source info with transparency data for API responses
 * This is the function route.ts should use instead of its local getSourceInfo
 */
export function getFullSourceInfo(domain: string): FullSourceInfo {
  if (!domain) return { displayName: 'SOURCE', type: 'local', countryCode: 'US', lean: 'center' };

  const source = getSourceInfo(domain);

  if (source) {
    return {
      displayName: source.displayName || source.name.toUpperCase(),
      type: source.sourceType || 'local',
      countryCode: source.countryCode || 'US',
      ownership: source.ownership,
      funding: source.funding,
      lean: source.lean,
    };
  }

  // Smart fallback for unknown sources
  const normalized = normalizeDomain(domain);

  // Country from TLD for unknown sources
  let countryCode = 'US';
  if (normalized.endsWith('.uk') || normalized.endsWith('.co.uk')) countryCode = 'UK';
  else if (normalized.endsWith('.ca')) countryCode = 'CA';
  else if (normalized.endsWith('.au') || normalized.endsWith('.com.au')) countryCode = 'AU';
  else if (normalized.endsWith('.de')) countryCode = 'DE';
  else if (normalized.endsWith('.in') || normalized.endsWith('.co.in')) countryCode = 'IN';
  else if (normalized.endsWith('.nz') || normalized.endsWith('.co.nz')) countryCode = 'NZ';
  else if (normalized.endsWith('.ie')) countryCode = 'IE';
  else if (normalized.endsWith('.fr')) countryCode = 'FR';
  else if (normalized.endsWith('.il') || normalized.endsWith('.co.il')) countryCode = 'IL';
  else if (normalized.endsWith('.jp') || normalized.endsWith('.co.jp')) countryCode = 'JP';
  else if (normalized.endsWith('.kr') || normalized.endsWith('.co.kr')) countryCode = 'KR';
  else if (normalized.endsWith('.cn') || normalized.endsWith('.com.cn')) countryCode = 'CN';
  else if (normalized.endsWith('.ru')) countryCode = 'RU';
  else if (normalized.endsWith('.br') || normalized.endsWith('.com.br')) countryCode = 'BR';
  else if (normalized.endsWith('.mx') || normalized.endsWith('.com.mx')) countryCode = 'MX';
  else if (normalized.endsWith('.sg')) countryCode = 'SG';
  else if (normalized.endsWith('.hk') || normalized.endsWith('.com.hk')) countryCode = 'HK';
  else if (normalized.endsWith('.th') || normalized.endsWith('.co.th')) countryCode = 'TH';

  // Smart fallback: detect type from domain name patterns
  let type: SourceType = 'local';
  if (normalized.includes('financial') || normalized.includes('finance') ||
      normalized.includes('business') || normalized.includes('market') ||
      normalized.includes('trading') || normalized.includes('invest')) {
    type = 'specialized';
  }

  const parts = domain.split('.');
  return {
    displayName: parts[0].toUpperCase(),
    type,
    countryCode,
    lean: 'center'
  };
}

// =============================================================================
// UI CONSTANTS - Colors and labels for consistent rendering
// =============================================================================

export const LEAN_COLORS: Record<PoliticalLean, { bar: string; headerBg: string; bg: string; border: string; text: string }> = {
  'left': { bar: 'bg-blue-600', headerBg: 'bg-blue-600', bg: 'bg-blue-100', border: 'border-blue-200', text: 'text-blue-800' },
  'center-left': { bar: 'bg-cyan-500', headerBg: 'bg-cyan-500', bg: 'bg-cyan-100', border: 'border-cyan-200', text: 'text-cyan-800' },
  'center': { bar: 'bg-purple-500', headerBg: 'bg-purple-500', bg: 'bg-purple-100', border: 'border-purple-200', text: 'text-purple-800' },
  'center-right': { bar: 'bg-orange-500', headerBg: 'bg-orange-500', bg: 'bg-orange-100', border: 'border-orange-200', text: 'text-orange-800' },
  'right': { bar: 'bg-red-600', headerBg: 'bg-red-600', bg: 'bg-red-100', border: 'border-red-200', text: 'text-red-800' },
};

export const LEAN_LABELS: Record<PoliticalLean, string> = {
  'left': 'Left',
  'center-left': 'Center-Left',
  'center': 'Center',
  'center-right': 'Center-Right',
  'right': 'Right',
};

// =============================================================================
// GROUPED DATA - For Sources page display
// =============================================================================

export function getSourcesByLean(): Record<PoliticalLean, Array<{ name: string; domain: string; type: LegacyOwnershipType }>> {
  const grouped: Record<PoliticalLean, Array<{ name: string; domain: string; type: LegacyOwnershipType }>> = {
    'left': [],
    'center-left': [],
    'center': [],
    'center-right': [],
    'right': [],
  };

  // Use a Set to track domains we've already added (avoid duplicates)
  const seen = new Set<string>();

  for (const source of SOURCES) {
    if (!seen.has(source.domain)) {
      seen.add(source.domain);
      grouped[source.lean].push({
        name: source.name,
        domain: source.domain,
        type: source.legacyType,
      });
    }
  }

  return grouped;
}

// =============================================================================
// DOMAIN LISTS - For Gap Fill targeting (5-category system)
// =============================================================================

// Individual category lists (for precise gap fill targeting)
export const LEFT_DOMAINS = SOURCES
  .filter(s => s.lean === 'left')
  .map(s => s.domain);

export const CENTER_LEFT_DOMAINS = SOURCES
  .filter(s => s.lean === 'center-left')
  .map(s => s.domain);

export const CENTER_DOMAINS = SOURCES
  .filter(s => s.lean === 'center')
  .map(s => s.domain);

export const CENTER_RIGHT_DOMAINS = SOURCES
  .filter(s => s.lean === 'center-right')
  .map(s => s.domain);

export const RIGHT_DOMAINS = SOURCES
  .filter(s => s.lean === 'right')
  .map(s => s.domain);

// Combined lists (for broader searches - legacy compatibility)
export const RIGHT_LEANING_DOMAINS = SOURCES
  .filter(s => s.lean === 'right' || s.lean === 'center-right')
  .map(s => s.domain);

export const LEFT_LEANING_DOMAINS = SOURCES
  .filter(s => s.lean === 'left' || s.lean === 'center-left')
  .map(s => s.domain);

// =============================================================================
// BALANCED DOMAINS - Optimized distribution for single-query balanced search
// Distribution: 2 Left, 3 Center-Left, 3 Center, 3 Center-Right, 3 Right
// Includes mainstream + independent media for diversity
// =============================================================================
export const BALANCED_DOMAINS = [
  // Left (2) - mainstream + indie
  'huffpost.com',
  'pressprogress.ca',
  // Center-Left (3) - mainstream + indie
  'nytimes.com',
  'cnn.com',
  'canadaland.com',
  // Center (3) - mainstream + indie
  'reuters.com',
  'bbc.com',
  'breakingpoints.com',
  // Center-Right (3) - mainstream + indie
  'washingtonexaminer.com',
  'nypost.com',
  'thefp.com',
  // Right (3) - mainstream + indie
  'foxnews.com',
  'dailywire.com',
  'rebelnews.com',
];

// =============================================================================
// HELPER: Wikipedia Link Generator
// =============================================================================
export const getWikiLink = (sourceName: string): string =>
  `https://en.wikipedia.org/wiki/${sourceName.replace(/ /g, '_')}`;
