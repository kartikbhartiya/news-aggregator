import { Article } from '@/types/news';

export const EDITORIAL_FALLBACK_ARTICLES: Article[] = [
  {
    id: 'lead-article-quantum-ai',
    title: 'The Silicon Renaissance: Next-Generation Topological Qubits Cross the Error-Threshold Barrier',
    description: 'Researchers at premier quantum physics consortiums announce an unprecedented leap in coherence times, paving the practical runway for commercial quantum error correction and pharmaceutical simulation.',
    content: `In an announcement that has reverberated across global computing laboratories, an international alliance of solid-state physicists and computing architects announced a definitive breakthrough in topological quantum error suppression.

For decades, the fragility of quantum superpositions has confined the discipline to noisy, intermediate-scale systems requiring immense cryogenics and statistical mitigation. The newly validated architecture, which couples non-Abelian anyon braids with cryogenic CMOS controllers, achieves an error suppression threshold three orders of magnitude superior to previous planar transmon geometries.

Dr. Elena Vance, principal investigator at the European Institute for High-Energy Computation, characterized the moment not merely as an engineering milestone, but as an inflection point in computational destiny. "We are no longer simulating the physics of next year; we are preparing industrial synthesis engines for molecules that humanity could previously never synthesize," she stated during the morning briefing in Geneva.

Financial markets responded immediately. Sovereign wealth funds and venture syndicates in Tokyo, London, and New York redirected capital into semiconductor lithography suppliers capable of fabricating the sub-angstrom optical pathways necessary for commercial deployment.

The implications for materials science and decarbonization are profound. Computational catalysts for nitrogen fixation and ambient-temperature electrolyte batteries—once estimated to require decades of wet-lab trial and error—may now be modeled in silico within days.`,
    url: 'https://example.com/editorial/silicon-renaissance',
    source: {
      id: 'chronicle-investigations',
      name: 'Veritas Chronicle Investigations',
      credibilityScore: 99,
      badge: 'Flagship Editorial',
      websiteUrl: 'https://veritas-dispatch.internal',
    },
    author: 'Alistair Vance, Chief Science Correspondent',
    publishedAt: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop',
    category: 'tech',
    readTime: 6,
    isBreaking: false,
    isLeadStory: true,
    bulletPoints: [
      'Topological anyon braids achieve 99.98% error suppression in controlled cryogenic benchmarks.',
      'Global capital reallocation: over $14B committed across allied semiconductor foundries.',
      'Direct pathway opens for room-temperature catalyst discovery and synthetic nitrogen fixation.',
    ],
    sentiment: 'bullish',
  },
  {
    id: 'sublead-central-bank-liquidity',
    title: 'Central Banks Navigate the Sovereign Debt Tightrope as Global Yield Curves Invert',
    description: 'Fiscal authorities in Frankfurt and Washington confront persistent supply-side volatility while balancing treasury debt maturity rollovers in a transformed interest rate regime.',
    content: `Across the major central banking corridors, governors and monetary strategy committees are grappling with what economists describe as the structural persistence of elevated neutral interest rates.

With over $8 trillion in sovereign paper requiring rollover refinancing over the subsequent eighteen months, treasuries face a delicate equilibrium. The Federal Reserve and European Central Bank have signaled a restrained posture, resisting market clamor for premature liquidity injections while remaining vigilant against emerging signs of balance sheet tightening in regional banking networks.

Senior analysts note that the resilience of labor productivity has cushioned the higher cost of capital. However, municipal infrastructure financing and commercial real estate refinancing continue to exhibit distinct localized pressures.

"We have exited the era of frictionless capital," observed Marcus Sterling, former head of sovereign risk analysis at the Bank for International Settlements. "Capital has rediscovered its price, and capital discipline has returned as the primary filter for enterprise survival."`,
    url: 'https://example.com/editorial/central-bank-sovereign-debt',
    source: {
      id: 'ft-markets',
      name: 'Financial Times & Markets',
      credibilityScore: 98,
      badge: 'Capital Markets',
      websiteUrl: 'https://ft.com',
    },
    author: 'Seraphina Lowell, Global Economics Editor',
    publishedAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format&fit=crop',
    category: 'markets',
    readTime: 5,
    isBreaking: false,
    bulletPoints: [
      '$8 trillion in sovereign debt due for rollover across the G7 economies over 18 months.',
      'Central bank neutral rates (R*) assessed to have permanently shifted upward by 125 basis points.',
      'Flight to institutional treasury liquidity accelerates as private credit spreads widen.',
    ],
    sentiment: 'analytical',
  },
  {
    id: 'sublead-geopolitics-corridors',
    title: 'The New Maritime Arteries: Redefining Global Shipping Along the Northern and Arctic Passages',
    description: 'Maritime insurers and multinational freight operators establish commercial conduits through newly navigable polar routes, reducing transit latency between Asia and Western Europe by 38%.',
    content: `Commercial freight logistics are quietly experiencing their most significant geographical transformation since the excavation of the Suez Canal.

Driven by navigational satellite telemetry and strengthened dual-fuel ice-class vessels, major maritime consortia have completed experimental voyages through high-latitude arctic corridors. The voyage between Shanghai and Rotterdam, traditionally demanding thirty-three days via the Strait of Malacca and Suez, has been achieved in under nineteen days.

Environmental monitors and maritime legal bodies, however, are urging comprehensive multilateral oversight. The fragility of polar ecosystems and the absence of rapid-response maritime salvage infrastructure present distinct operational risks that insurers are pricing into tiered underwriting premiums.`,
    url: 'https://example.com/editorial/maritime-arctic-arteries',
    source: {
      id: 'nyt-geopolitics',
      name: 'The New York Times',
      credibilityScore: 97,
      badge: 'Global Dispatch',
      websiteUrl: 'https://nytimes.com',
    },
    author: 'Christian Bergstrom, Northern Bureau',
    publishedAt: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
    category: 'world',
    readTime: 4,
    isBreaking: true,
    bulletPoints: [
      'Northern passage transit cuts 14 days and 4,800 nautical miles off Asia-Europe trade.',
      'Lloyds of London establishes experimental polar risk syndicate for reinforced cargo fleets.',
      'Arctic Council convenes emergency ministerial round in Oslo regarding environmental protocols.',
    ],
    sentiment: 'neutral',
  },
  {
    id: 'card-fusion-grid-pilot',
    title: 'Stellarator Plasma Stability Reaches 120-Second Steady-State Equilibrium',
    description: 'Magnetic confinement experiment in Greifswald maintains continuous magnetic confinement with zero thermal degradation, validating helical coil simulations.',
    content: `Physicists at the Max Planck Institute for Plasma Physics have reached a landmark operating milestone with the Wendelstein stellarator reactor, generating and maintaining a continuous 120-second microwave-heated hydrogen plasma discharge.

Unlike pulsed tokamak configurations which suffer from magnetohydrodynamic disruptions, the precisely sculpted three-dimensional helical coils achieved steady-state confinement with minimal neoclassical particle transport. The experimental data confirms supercomputing predictions generated using high-order finite element algorithms.

With commercial fusion ventures now adopting stellarator geometries, commercial grid interconnect targets for the late 2030s appear substantially more grounded in empirical magnetics.`,
    url: 'https://example.com/editorial/stellarator-fusion-milestone',
    source: {
      id: 'nature-wire',
      name: 'Nature Scientific Wire',
      credibilityScore: 99,
      badge: 'Peer Reviewed',
      websiteUrl: 'https://nature.com',
    },
    author: 'Dr. Hiroshi Tanaka',
    publishedAt: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=1200&auto=format&fit=crop',
    category: 'science',
    readTime: 4,
    sentiment: 'bullish',
  },
  {
    id: 'card-architecture-timber-skyscrapers',
    title: 'The Timber Metropolis: Mass-Engineered Cross-Laminated Timber Reshapes Urban Skylines',
    description: 'Civic planners in Scandinavia and Zurich mandate structural cross-laminated timber for mid-rise zoning, turning skyscrapers into active carbon sinks.',
    content: `The skyline of tomorrow will not be molded from Portland cement and unyielding steel, but from hyper-engineered, fire-rated Austrian spruce and Scandinavian pine.

Cross-laminated timber (CLT)—manufactured by binding alternating dimensional lumber strata under high pneumatic pressure—delivers a strength-to-weight ratio rivaling structural steel while sequestering approximately one ton of carbon dioxide per cubic meter of timber utilized.

In Stockholm and Zurich, recently completed forty-story commercial residential towers have demonstrated superior acoustic isolation and reduced foundation construction timetables by up to 40%. Building codes across twelve European municipalities have been revised to establish CLT as the default structural archetype for all municipal public works.`,
    url: 'https://example.com/editorial/mass-timber-architecture',
    source: {
      id: 'culture-monocle',
      name: 'Monocle Architecture & Design',
      credibilityScore: 95,
      badge: 'Design Dossier',
      websiteUrl: 'https://monocle.com',
    },
    author: 'Julianne Delacroix',
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    category: 'culture',
    readTime: 5,
    sentiment: 'bullish',
  },
  {
    id: 'card-ai-open-weights-inference',
    title: 'Sub-100-Watt Neural Inference Engines Democratize Edge Reasoning',
    description: 'Novel analog in-memory compute silicon achieves 140 tokens per second on 70-billion parameter transformer models without discrete high-bandwidth graphics memories.',
    content: `A decisive departure from monolithic datacenter GPU clusters has arrived from a coalition of semiconductor startups based in Grenoble and Cambridge.

By executing matrix multiplications directly inside resistive random-access memory (ReRAM) crossbar arrays, the prototype silicon circumvents the von Neumann memory transfer bottleneck entirely. In verified third-party laboratory tests, the accelerator processed continuous generative reasoning tasks at 140 tokens per second while consuming less than 85 watts of power.

This leap permits enterprise-grade reasoning models to operate entirely locally within hospital medical scanners, autonomous avionics systems, and encrypted corporate intranet appliances without sending a single byte of telemetry to cloud datacenters.`,
    url: 'https://example.com/editorial/analog-inference-edge',
    source: {
      id: 'arstechnica-deep',
      name: 'Ars Technica Pro',
      credibilityScore: 97,
      badge: 'Hardware Deep Dive',
      websiteUrl: 'https://arstechnica.com',
    },
    author: 'Samuel Croft, Silicon Architecture',
    publishedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
    category: 'tech',
    readTime: 6,
    sentiment: 'bullish',
  },
  {
    id: 'card-deep-sea-minerals',
    title: 'International Seabed Authority Debates the Moratorium on Abyssal Polymetallic Nodules',
    description: 'Tensions between battery mineral security and deep-ocean biodiversity reach fever pitch at the United Nations maritime assembly in Kingston.',
    content: `Four thousand meters beneath the surface of the central Pacific Ocean lies the Clarion-Clipperton Zone, an abyssal plain carpeted in potato-sized polymetallic nodules containing immense reserves of nickel, cobalt, copper, and manganese.

As the global transition to electrified mobility accelerates, mining consortia insist that seabed harvesting possesses a drastically smaller carbon and human footprint than equatorial strip mining. Marine biologists, however, countered with newly published benthic metagenomic surveys revealing thousands of previously cataloged endemic abyssal species whose life cycles depend on undisturbed sediment layers.

The diplomatic impasse highlights the friction between the urgent demands of the energy transition and the precautionary principle of global conservation law.`,
    url: 'https://example.com/editorial/seabed-minerals-treaty',
    source: {
      id: 'bbc-investigates',
      name: 'BBC Global Investigations',
      credibilityScore: 98,
      badge: 'Special Investigation',
      websiteUrl: 'https://bbc.com',
    },
    author: 'Charlotte Molyneux',
    publishedAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
    category: 'science',
    readTime: 5,
    sentiment: 'critical',
  },
];

export const EDITORIAL_INDIAN_FALLBACK_ARTICLES: Article[] = [
  {
    id: 'india-lead-semiconductor',
    title: 'India Semiconductor Mission Breaks Ground on Commercial Silicon and Advanced Packaging Ecosystem in Gujarat & Assam',
    description: 'With capital investments surpassing $15 billion, premier fabrication consortiums commence installation of ultra-cleanroom infrastructure and EUV lithography tooling, positioning India as a resilient pillar in the global chip supply chain.',
    content: `In a landmark stride for domestic industrial capability, the India Semiconductor Mission today formalized the operational phase of its flagship mega-fabs and testing facilities in Dholera and Sanand.
    
The initiative, backed by sovereign fiscal incentives and strategic partnerships with Taiwanese and Japanese silicon engineering leaders, establishes the subcontinent's first high-volume commercial foundry ecosystem. Initial manufacturing lines will focus on 28-nanometer logic and power management integrated circuits critical for automotive electrification, 5G telecommunications, and defense aerospace systems.

Ashwini Vaishnaw, Union Minister for Electronics and IT, characterized the milestone as an inflection point: "We are transforming India from a premier consumer of digital silicon into a sovereign fabrication powerhouse. The cleanrooms now rising will anchor employment for over 100,000 engineers and secure domestic industrial supply against geopolitical volatility."`,
    url: 'https://thehindu.com/news/national/india-semiconductor-ecosystem-dholera',
    source: {
      id: 'the-hindu',
      name: 'The Hindu',
      credibilityScore: 98,
      badge: 'National Flagship',
      websiteUrl: 'https://thehindu.com',
    },
    author: 'Sanjay Suri, Technology & Industrial Policy',
    publishedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    category: 'tech',
    readTime: 5,
    isLeadStory: true,
    bulletPoints: [
      '$15B in committed capital operationalized across Dholera and Sanand silicon corridors.',
      'High-volume production lines targeting automotive logic and 5G transceiver shipsets.',
      'Strategic workforce pipeline establishes 100+ semiconductor training institutes nationwide.',
    ],
    sentiment: 'bullish',
  },
  {
    id: 'india-economy-upi',
    title: 'UPI Processes Record 16.5 Billion Monthly Transactions as Bilateral Cross-Border Linkages Expand to Europe & ASEAN',
    description: 'The National Payments Corporation of India reports unprecedented transaction velocity, with real-time merchant settlement and bilateral instant remittances expanding across Singapore, UAE, and the Eurozone.',
    content: `India's real-time digital payments architecture has achieved another unprecedented milestone, processing over 16.5 billion individual transactions valued at more than ₹22 lakh crore in the preceding month.
    
Reserve Bank of India Governor Shaktikanta Das emphasized during the monetary policy address that the Unified Payments Interface has transcended national borders to become a benchmark for frictionless cross-border retail remittances and sovereign digital public infrastructure.`,
    url: 'https://livemint.com/technology/personal-tech/upi-cross-border-settlement-record',
    source: {
      id: 'livemint',
      name: 'Livemint Intelligence',
      credibilityScore: 97,
      badge: 'Financial Wire',
      websiteUrl: 'https://livemint.com',
    },
    author: 'Priya Narayanan, Financial Infrastructure',
    publishedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop',
    category: 'business',
    readTime: 4,
    sentiment: 'bullish',
  },
  {
    id: 'india-science-isro-gaganyaan',
    title: 'ISRO Successfully Validates Cryogenic Upper Stage for Gaganyaan Human Spaceflight Mission',
    description: 'The Indian Space Research Organisation completes hot-fire qualification tests of the human-rated CE-20 cryogenic engine at Mahendragiri Propulsion Complex, clearing the path for uncrewed orbital tests.',
    content: `In a decisive step toward placing Indian astronauts into low-Earth orbit, the Indian Space Research Organisation (ISRO) successfully concluded the hot-fire endurance validation of the CE-20 cryogenic engine at the Liquid Propulsion Systems Centre in Mahendragiri, Tamil Nadu.
    
The engine operated flawlessly for its full flight duration of 720 seconds under simulated high-altitude thrust vacuum conditions, meeting all performance metrics for the LVM3 human-rated launch vehicle.`,
    url: 'https://ndtv.com/science/isro-gaganyaan-ce20-cryogenic-engine-test-success',
    source: {
      id: 'ndtv',
      name: 'NDTV News Wire',
      credibilityScore: 96,
      badge: 'Science Desk',
      websiteUrl: 'https://ndtv.com',
    },
    author: 'Pallava Bagla, Space Sciences Editor',
    publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?q=80&w=1200&auto=format&fit=crop',
    category: 'science',
    readTime: 4,
    sentiment: 'bullish',
  },
  {
    id: 'india-markets-nifty-rally',
    title: 'Dalal Street Reaches Historic Valuations as Domestic Institutional Inflows Mirror Sustained GDP Trajectory',
    description: 'The BSE Sensex and Nifty 50 surge to fresh all-time highs driven by capital goods, renewable infrastructure, and private banking liquidity as retail SIP flows cross ₹21,000 crore monthly.',
    content: `Indian capital markets continued their relentless upward march today, with the benchmark indices setting fresh all-time closing highs amidst broad-based participation across capital goods, defense, and power infrastructure sectors.
    
Foreign Portfolio Investors (FPIs) reversed earlier quarterly caution, pumping net inflows of $2.4 billion into Indian equities as domestic institutional investors maintained record systematic investment plan (SIP) allocations.`,
    url: 'https://timesofindia.indiatimes.com/business/markets/sensex-nifty-all-time-high-fpi-inflows',
    source: {
      id: 'toi',
      name: 'Times of India',
      credibilityScore: 95,
      badge: 'Markets Desk',
      websiteUrl: 'https://timesofindia.indiatimes.com',
    },
    author: 'Rajesh Sharma, Senior Financial Markets Writer',
    publishedAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop',
    category: 'markets',
    readTime: 3,
    sentiment: 'bullish',
  },
  {
    id: 'india-culture-cinema',
    title: 'New Wave of Indian Independent Filmmakers Gains Prominence Across International Cinema Circuits',
    description: 'From Cannes to Venice, an emerging cadre of independent directors from Kerala, Bengal, and the Northeast reimagines realistic narrative forms, winning prestigious festival juries and streaming acquisitions.',
    content: `At film festivals from Rotterdam to Busan, international critics and programmers are heralding what many describe as a golden renaissance in regional Indian cinema.
    
Moving beyond conventional song-and-dance spectacles, independent storytellers are crafting nuanced, hyper-local cinematic masterworks that explore contemporary social questions with exceptional emotional authenticity and visual lyricism.`,
    url: 'https://indianexpress.com/article/entertainment/indian-indie-cinema-global-acclaim',
    source: {
      id: 'indian-express',
      name: 'The Indian Express',
      credibilityScore: 96,
      badge: 'Arts & Culture',
      websiteUrl: 'https://indianexpress.com',
    },
    author: 'Shubhra Gupta, Senior Film Critic',
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop',
    category: 'culture',
    readTime: 4,
    sentiment: 'analytical',
  },
];
