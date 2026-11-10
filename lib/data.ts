/* ---------------------------------------------------------------------------
   LUXEN content. Research-peptide / laboratory R&D vertical.
   For laboratory research and in-vitro studies only — not for human or
   veterinary consumption. All imagery routed through Unsplash CDN; swap the
   IDs in IMG to change art.
--------------------------------------------------------------------------- */

/* All imagery is saved locally under /public/images and themed to the
   research-peptide / laboratory vertical. */
export const IMG = {
  /* 2086×754 (~2.77:1) banner: carton and pen on the left, clean teal field
     on the right for the hero lockup. */
  heroBanner: "/images/hero2 (1).png",
  heroPeople: "/images/hero-webp.webp",
  discover: "/images/about-webp.webp",
  alex: "/images/scientists.webp",
  statLab: "/images/On-Time Delivery.webp",
  statDiag: "/images/On-Time Delivery (2).webp",
  process: "/images/our-process-bg.webp",
  appointment: "/images/our-process-bg.webp",
  doc1: "/images/scientists.webp",
  doc2: "/images/scientists2.webp",
  doc3: "/images/scientists3.webp",
  doc4: "/images/scientists4.webp",
  blog1: "/images/scientists2.webp",
  blog2: "/images/scientists3.webp",
  blog3: "/images/scientists4.webp",
  av1: "/images/her-review-profile.webp",
  av2: "/images/hero-review-profile2.webp",
  av3: "/images/hero-review-profile3.webp",
  av4: "/images/hero-review-profile4.webp",
  av5: "/images/her-review-profile.webp",
  test1: "/images/testimonial-1.webp",
  test2: "/images/testimonial2.webp",
  test3: "/images/testimonial3.webp",
  test4: "/images/testimonial4.webp",
  quoteRight: "/images/Quote-right-img.webp",
};

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Products", href: "#services" },
  { label: "Our Team", href: "#team" },
  { label: "Order", href: "#appointment" },
  { label: "Reviews", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

/* Rotating announcement bar messages. */
export const ANNOUNCEMENTS = [
  "EVERY BATCH INDEPENDENTLY LAB TESTED",
  "FREE TRACKED SHIPPING ON ORDERS OVER $250",
  "FOR LABORATORY RESEARCH USE ONLY",
];

/* Utility links sitting to the left of the logo in the main header bar. */
export const UTILITY_NAV = [
  { label: "Track Order", href: "/track-order" },
  { label: "Certificates", href: "/about" },
];

export type NavItem = {
  label: string;
  href: string;
  /* Rendered as a dropdown panel when present. */
  children?: { label: string; href: string }[];
};

/* Primary navigation row. Mirrors the reference's structure: a handful of
   top-level entries, two of which open a panel of sub-links. */
export const MAIN_NAV: NavItem[] = [
  { label: "New In", href: "/shop" },
  {
    label: "Catalog",
    href: "/shop",
    children: [
      { label: "BPC-157 & TB-500", href: "/product/bpc-157-tb-500" },
      { label: "Retatrutide 20mg", href: "/product/retatrutide" },
      { label: "Retatrutide 40mg", href: "/product/retatrutide-40mg" },
      { label: "Tirzepatide 40mg", href: "/product/tirzepatide" },
      { label: "Glow 70mg", href: "/product/glow-ghk-cu" },
      { label: "NAD+ 1000mg", href: "/product/nad-plus-1000mg" },
      { label: "Shop All", href: "/shop" },
    ],
  },
  {
    label: "Verification",
    href: "/about",
    children: [
      { label: "Third-Party Testing", href: "/about" },
      { label: "Our Process", href: "/about#process" },
      { label: "Batch Traceability", href: "/about#stats" },
      { label: "Research Team", href: "/about#team" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/about#testimonials" },
  { label: "Shop All", href: "/shop" },
];

export const BRAND_LOGOS = [
  "BioAssay",
  "PureChem",
  "LabVerify",
  "Cryologix",
  "AnalytiQ",
  "PeptiServe",
  "Verispec",
  "Helix Labs",
];

/* Research-grade compounds. Catalog. Every batch independently lab tested.
   Supplied lyophilised for in-vitro research only. */
export type CompoundRow = {
  compound: string;
  concentration: string;
  verifiedContent: string;
};

export type ProductAnalysis = {
  batchNumber: string;
  fillVolume: string;
  purity?: string;
  compounds: CompoundRow[];
};

export type Product = {
  slug: string;
  title: string;
  desc: string;
  long: string;
  img: string;
  /* Transparent-background cutout used on cards and banners. The reference
     sits products directly on the flat section colour, which only works with
     a cutout — `img` stays the photographic hero used by the PDP gallery. */
  card?: string;
  /* Styled packshot (carton + pen on a coloured ground) that cross-fades in
     when a featured card is hovered. */
  hover?: string;
  gallery?: string[];
  icon: string;
  price: number;
  specs: { label: string; value: string }[];
  /* Omitted until a batch has a real Janoshik report — never fabricate these. */
  janoshikUrl?: string;
  certificateImages?: string[];
  analysis?: ProductAnalysis;
  /* Suppresses the "certificate pending" notice on the product page for
     products where that messaging shouldn't show. */
  hideCertNotice?: boolean;
  packageContents: string[];
  storage: string[];
};

export const SERVICES: Product[] = [
  {
    slug: "bpc-157-tb-500",
    card: "/images/products/ALLUVI Carton and Matching Pen-9.png",
    hover: "/images/hover/ALLUVI BPC157 & TB500 packshot-8.png",
    title: "BPC-157 & TB-500 40mg (R&D Only)",
    desc: "Research reference material combining a pentadecapeptide (BPC-157) and a synthetic thymosin beta-4 fragment (TB-500), supplied in a pre-filled research device and independently characterized by Janoshik Analytical.",
    long: "A 40mg BPC-157 & TB-500 research reference material supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Delivered in sealed format to support compound identity, purity, and stability analysis. For laboratory and analytical research use only — not for human or veterinary use.",
    img: "/images/hover/research (6).png",
    gallery: [
      "/images/hover/research (6).png",
      "/images/hover/ALLUVI BPC157 & TB500 packshot-8.png",
      "/images/products/ALLUVI Carton and Matching Pen-9.png",
    ],
    icon: "flask",
    price: 130,
    specs: [
      { label: "Quantity", value: "40 mg" },
      { label: "Purity", value: "≥99% (HPLC)" },
      { label: "Form", value: "Pre-filled research device" },
      { label: "Testing", value: "Janoshik third-party" },
    ],
    janoshikUrl:
      "https://verify.janoshik.com/tests/163218-ALLUVI_BPC157_TB500_40MG_KIT_EAI125ZEF8TB",
    certificateImages: [
      "/certificates/bpc-157-tb-500-page1.jpg",
      "/certificates/bpc-157-tb-500-page2.jpg",
    ],
    analysis: {
      batchNumber: "BP1701FSR",
      fillVolume: "3 mL",
      compounds: [
        { compound: "BPC-157", concentration: "7.33 mg/mL", verifiedContent: "21.99 mg" },
        { compound: "TB-500", concentration: "6.53 mg/mL", verifiedContent: "19.59 mg" },
      ],
    },
    packageContents: [
      "Each BPC-157 & TB-500 40mg Research kit includes:",
      "Pre-filled Research pen (20mg BPC-157, 20mg TB-500)",
      "Research information sheet",
    ],
    storage: [
      "Store refrigerated (2–8°C). Do not freeze.",
      "Supplied in fixed-volume sealed format for laboratory analysis.",
    ],
  },
  {
    slug: "retatrutide",
    /* No carton + pen cutout exists for the 20mg lot, so this is the carton
       alone, trimmed and centred on a 4:3 canvas to match the others' width. */
    card: "/images/products/reta20-card.png",
    hover: "/images/hover/Alluvi Retatrutide 20mg Packshot-4.png",
    title: "Retatrutide 20mg (R&D Only)",
    desc: "Research reference peptide supplied in a pre-filled analytical device. Batch-characterized for identity, purity, and content by Janoshik Analytical.",
    long: "A 20mg Retatrutide research reference material supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Delivered in sealed format to support compound identity, purity, and stability analysis. For laboratory and analytical research use only — not for human or veterinary use.",
    img: "/images/hover/research (7).png",
    gallery: [
      "/images/hover/research (7).png",
      "/images/hover/Alluvi Retatrutide 20mg Packshot-4.png",
      "/images/promo/reta-box.png",
    ],
    icon: "dna",
    price: 100,
    specs: [
      { label: "Quantity", value: "20 mg" },
      { label: "Purity", value: "≥99% (HPLC)" },
      { label: "Form", value: "Pre-filled research device" },
      { label: "Testing", value: "Janoshik third-party" },
    ],
    janoshikUrl:
      "https://verify.janoshik.com/tests/163215-ALLUVI_RETATRUTIDE_20MG_KIT_GBHEFN58JXXZ",
    certificateImages: [
      "/certificates/retatrutide-page1.jpg",
      "/certificates/retatrutide-page2.jpg",
    ],
    analysis: {
      batchNumber: "AR1721TRT",
      fillVolume: "2.4 mL",
      purity: "99.21%",
      compounds: [
        { compound: "Retatrutide", concentration: "9.57 mg/mL", verifiedContent: "22.96 mg" },
      ],
    },
    packageContents: [
      "Each Retatrutide 20mg Research kit includes:",
      "Pre-filled Research pen (20mg Retatrutide)",
      "Research information sheet",
    ],
    storage: [
      "Store refrigerated (2–8°C). Do not freeze.",
      "Supplied in fixed-volume sealed format for laboratory analysis.",
    ],
  },
  {
    slug: "tirzepatide",
    card: "/images/products/Alluvi Tirzepatide Carton and Pen-6.png",
    hover: "/images/hover/research (8).png",
    title: "Tirzepatide 40mg (R&D Only)",
    desc: "Research reference peptide supplied in a pre-filled analytical device for in-vitro laboratory characterization. Each lot ships with a Janoshik certificate of analysis.",
    long: "A 40mg Tirzepatide research reference material supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Delivered in sealed format to support compound identity, purity, and stability analysis. For laboratory and analytical research use only — not for human or veterinary use.",
    img: "/images/hover/research (8).png",
    gallery: [
      "/images/hover/research (8).png",
      "/images/hover/Alluvi tirzepatide carton and pen-6.png",
      "/images/promo/tirz-box.png",
    ],
    icon: "microscope",
    price: 100,
    specs: [
      { label: "Quantity", value: "40 mg" },
      { label: "Purity", value: "≥99% (HPLC)" },
      { label: "Form", value: "Pre-filled research device" },
      { label: "Testing", value: "Janoshik third-party" },
    ],
    janoshikUrl:
      "https://verify.janoshik.com/tests/147174-ALLUVI_TIRZEPATIDE_40MG_KIT_T5MBWRAYD4HN",
    certificateImages: [
      "/certificates/tirzepatide-page1.jpg",
      "/certificates/tirzepatide-page2.jpg",
      "/certificates/tirzepatide-page3.jpg",
    ],
    analysis: {
      batchNumber: "TR786PAOS",
      fillVolume: "3 mL",
      purity: "99.85%",
      compounds: [
        { compound: "Tirzepatide", concentration: "13.35 mg/mL", verifiedContent: "40.05 mg" },
      ],
    },
    packageContents: [
      "Each Tirzepatide 40mg Research kit includes:",
      "Pre-filled Research pen (40mg Tirzepatide)",
      "Research information sheet",
    ],
    storage: [
      "Store refrigerated (2–8°C). Do not freeze.",
      "Supplied in fixed-volume sealed format for laboratory analysis.",
    ],
  },
  {
    slug: "glow-ghk-cu",
    card: "/images/products/ALLUVI carton and pen, isolated-8.png",
    hover: "/images/hover/Alluvi GLOW carton and blue pen-7.png",
    title: "Glow 70mg (R&D Only)",
    desc: "Copper-binding tripeptide (GHK-Cu) research reference material supplied for laboratory analytical characterization. Precisely measured and independently verified for identity and purity.",
    long: "A 70mg Glow research reference material supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Delivered in sealed format to support compound identity, purity, and stability analysis. For laboratory and analytical research use only — not for human or veterinary use.",
    img: "/images/hover/Alluvi GLOW carton and blue pen-7.png",
    gallery: [
      "/images/hover/Alluvi GLOW carton and blue pen-7.png",
      "/images/products/ALLUVI carton and pen, isolated-8.png",
    ],
    icon: "droplet",
    price: 100,
    specs: [
      { label: "Quantity", value: "70 mg" },
      { label: "Purity", value: "≥99% (HPLC)" },
      { label: "Form", value: "Pre-filled research device" },
      { label: "Testing", value: "Janoshik third-party" },
    ],
    janoshikUrl:
      "https://verify.janoshik.com/tests/163217-ALLUVI_GLOW_70MG_KIT_DCL3AJSE4JQP",
    certificateImages: [
      "/certificates/glow-ghk-cu-page1.jpg",
      "/certificates/glow-ghk-cu-page2.jpg",
    ],
    analysis: {
      batchNumber: "GL0621XSA",
      fillVolume: "3.4 mL",
      compounds: [
        { compound: "GHK-Cu", concentration: "7.59 mg/mL", verifiedContent: "25.8 mg" },
        { compound: "BPC-157", concentration: "2.39 mg/mL", verifiedContent: "8.13 mg" },
        { compound: "TB-500", concentration: "1.99 mg/mL", verifiedContent: "6.76 mg" },
      ],
    },
    packageContents: [
      "Each Glow 70mg Research kit includes:",
      "2 × Pre-filled Research pens (Each pen contains 5mg BPC-157, 5mg TB-500, 25mg GHK-Cu)",
      "Total contents: 10mg BPC-157, 10mg TB-500, 50mg GHK-Cu",
    ],
    storage: [
      "Store refrigerated (2–8°C). Do not freeze.",
      "Supplied in fixed-volume sealed format for laboratory analysis.",
    ],
  },
  {
    slug: "retatrutide-40mg",
    card: "/images/products/ALLUVI carton and pen with transparent background-5.png",
    hover: "/images/hover/Alluvi 40mg pack with turquoise pen-5.png",
    title: "Retatrutide 40mg (R&D Only)",
    desc: "Higher-fill Retatrutide research reference material supplied in a pre-filled research device for laboratories that need a larger-volume batch for identity and purity work.",
    long: "A 40mg Retatrutide research reference material supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Delivered in sealed format to support compound identity, purity, and stability analysis. For laboratory and analytical research use only — not for human or veterinary use.",
    img: "/images/hover/Alluvi 40mg pack with turquoise pen-5.png",
    gallery: [
      "/images/hover/Alluvi 40mg pack with turquoise pen-5.png",
      "/images/products/ALLUVI carton and pen with transparent background-5.png",
    ],
    icon: "test-tube",
    price: 140,
    specs: [
      { label: "Quantity", value: "40 mg" },
      { label: "Purity", value: "≥99% (HPLC)" },
      { label: "Form", value: "Pre-filled research device" },
      { label: "Testing", value: "Pending certificate" },
    ],
    packageContents: [
      "Each Retatrutide 40mg Research kit includes:",
      "Pre-filled Research pen (40mg Retatrutide, 4 doses of 10mg)",
      "Research information sheet",
    ],
    storage: [
      "Store refrigerated (2–8°C). Do not freeze.",
      "Supplied in fixed-volume sealed format for laboratory analysis.",
    ],
  },
  {
    slug: "nad-plus-1000mg",
    card: "/images/promo/nad-card.png",
    hover: "/images/hover/ALLUVI NAD+ Carton With Matching Pen-9.png",
    title: "NAD+ 1000mg (R&D Only)",
    desc: "Nicotinamide adenine dinucleotide (NAD+) research reference material supplied in pre-filled analytical devices for in-vitro laboratory characterization.",
    long: "A 1000mg NAD+ research reference material supplied across pre-filled research devices, provided exclusively for controlled laboratory R&D applications. Delivered in sealed format to support compound identity, purity, and stability analysis. For laboratory and analytical research use only — not for human or veterinary use.",
    img: "/images/hover/ALLUVI NAD+ Carton With Matching Pen-9.png",
    gallery: [
      "/images/hover/ALLUVI NAD+ Carton With Matching Pen-9.png",
      "/images/promo/nad-card.png",
    ],
    icon: "atom",
    price: 120,
    hideCertNotice: true,
    specs: [
      { label: "Quantity", value: "1,000 mg" },
      { label: "Purity", value: "≥99% (HPLC)" },
      { label: "Form", value: "Pre-filled research device" },
      { label: "Testing", value: "Pending certificate" },
    ],
    packageContents: [
      "Each NAD+ 1000mg Research kit includes:",
      "Pre-filled Research pens (100mg NAD+ per pen)",
      "Research information sheet",
    ],
    storage: [
      "Store refrigerated (2–8°C). Do not freeze.",
      "Supplied in fixed-volume sealed format for laboratory analysis.",
    ],
  },
  /* Price is a placeholder pending confirmation; no Janoshik report yet, so
     the card shows "Cert. Pending". */
  {
    slug: "tesamorelin-20mg",
    card: "/images/products/Alluvi Tesamorelin carton and pen-7.png",
    hover: "/images/hover/Alluvi Tesamorelin carton and pen-2.png",
    title: "Tesamorelin 20mg (R&D Only)",
    desc: "Synthetic growth-hormone-releasing-hormone (GHRH) analogue research reference material supplied in a pre-filled research device for in-vitro laboratory characterization.",
    long: "A 20mg Tesamorelin research reference material supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Delivered in sealed format to support compound identity, purity, and stability analysis. For laboratory and analytical research use only — not for human or veterinary use.",
    img: "/images/hover/Alluvi Tesamorelin carton and pen-2.png",
    gallery: [
      "/images/hover/Alluvi Tesamorelin carton and pen-2.png",
      "/images/products/Alluvi Tesamorelin carton and pen-7.png",
    ],
    icon: "flask",
    price: 100,
    specs: [
      { label: "Quantity", value: "20 mg" },
      { label: "Purity", value: "≥99% (HPLC)" },
      { label: "Form", value: "Pre-filled research device" },
      { label: "Testing", value: "Pending certificate" },
    ],
    packageContents: [
      "Each Tesamorelin 20mg Research kit includes:",
      "Pre-filled Research pen (20mg Tesamorelin, 10 doses of 2mg)",
      "Research information sheet",
    ],
    storage: [
      "Store refrigerated (2–8°C). Do not freeze.",
      "Supplied in fixed-volume sealed format for laboratory analysis.",
    ],
  },
  {
    slug: "cjc-1295-10mg",
    card: "/images/products/ALLUVI carton and pen with soft shadows-4.png",
    hover: "/images/hover/Alluvi carton and pen on lemon yellow-1.png",
    title: "CJC-1295 10mg (R&D Only)",
    desc: "CJC-1295 (without DAC) research reference peptide supplied in a pre-filled research device for in-vitro laboratory characterization.",
    long: "A 10mg CJC-1295 (without DAC) research reference material supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Delivered in sealed format to support compound identity, purity, and stability analysis. For laboratory and analytical research use only — not for human or veterinary use.",
    img: "/images/hover/Alluvi carton and pen on lemon yellow-1.png",
    gallery: [
      "/images/hover/Alluvi carton and pen on lemon yellow-1.png",
      "/images/products/ALLUVI carton and pen with soft shadows-4.png",
    ],
    icon: "atom",
    price: 100,
    specs: [
      { label: "Quantity", value: "10 mg" },
      { label: "Purity", value: "≥99% (HPLC)" },
      { label: "Form", value: "Pre-filled research device" },
      { label: "Testing", value: "Pending certificate" },
    ],
    packageContents: [
      "Each CJC-1295 10mg Research kit includes:",
      "Pre-filled Research pen (10mg CJC-1295 without DAC, 25 doses of 400mcg)",
      "Research information sheet",
    ],
    storage: [
      "Store refrigerated (2–8°C). Do not freeze.",
      "Supplied in fixed-volume sealed format for laboratory analysis.",
    ],
  },
];

export const getProduct = (slug: string) => SERVICES.find((p) => p.slug === slug);

export const WHY = [
  { title: "Independently verified", desc: "Every batch is third-party lab tested for identity, purity, and content before release.", icon: "flask" },
  { title: "Reference-grade stability", desc: "Temperature-controlled handling from synthesis to storage keeps reference material stable for analytical work.", icon: "snowflake" },
  { title: "Documented traceability", desc: "Batch numbers, certificates, and lot-level data logged for every research compound.", icon: "truck" },
  { title: "Research-grade purity", desc: "≥99% HPLC-verified peptides for reproducible laboratory measurements.", icon: "shield" },
];

export const PROCESS = [
  { step: "Step", num: "1", title: "Select from Catalog", desc: "Browse the research catalog and choose the reference material appropriate for your laboratory work." },
  { step: "Step", num: "2", title: "Independent Verification", desc: "Each batch is third-party lab tested for identity, purity, and content — certificates of analysis included." },
  { step: "Step", num: "3", title: "Reproducible Reference", desc: "Every lot is traceable to a certificate of analysis so your analytical work stays consistent." },
];

export const TEAM = [
  { name: "Dr. Elena Voss", role: "Head of Peptide Synthesis", img: IMG.doc1 },
  { name: "Dr. Marcus Hale", role: "Analytical Chemistry Lead", img: IMG.doc4 },
  { name: "Dr. Priya Nair", role: "Quality & Compliance Director", img: IMG.doc3 },
  { name: "Dr. Adrian Kovač", role: "Research Operations Lead", img: IMG.doc2 },
];

export const VALUE_CHIPS = [
  "Purity First",
  "Independent Testing",
  "Cold-Chain",
  "Transparency",
  "Reproducibility",
  "Compliance",
  "Batch Traceability",
  "Research Integrity",
];

export const TESTIMONIALS = [
  {
    quote:
      "The certificates of analysis matched our own HPLC readings to the decimal. Reordering reference material has become the easiest part of running the lab.",
    name: "Research Associate, Cell Biology Lab",
    avatar: IMG.test1,
  },
  {
    quote:
      "Consistent purity across batches is what we care about most for our analytical work, and the documentation confirms it every single time.",
    name: "Principal Investigator",
    avatar: IMG.test2,
  },
  {
    quote:
      "Transparent testing and honest documentation. Procurement of research reference material used to be a headache — now it's a two-minute task.",
    name: "Lab Procurement Manager",
    avatar: IMG.test3,
  },
  {
    quote:
      "Reproducible analytical work starts with well-documented reagents. The batch traceability and certificates give us complete peace of mind.",
    name: "Biochemistry PhD Candidate",
    avatar: IMG.test4,
  },
];

export const POSTS = [
  {
    title: "Understanding Peptide Purity: Why HPLC Verification Matters",
    category: "Lab Standards",
    date: { day: "20", dow: "TUE" },
    img: IMG.blog1,
  },
  {
    title: "Storing Temperature-Sensitive Research Compounds at the Bench",
    category: "Lab Practice",
    date: { day: "20", dow: "TUE" },
    img: IMG.blog2,
  },
  {
    title: "Reading a Certificate of Analysis: A Researcher's Quick Guide",
    category: "Quality",
    date: { day: "20", dow: "TUE" },
    img: IMG.blog3,
  },
];

export const STATS = {
  consultations: { pct: 99, label: "Verified Purity", desc: "Every batch is independently tested by accredited third-party laboratories, with HPLC purity verification documented on each certificate of analysis." },
  treatments: { pct: 98, label: "Batch Consistency", desc: "Our synthesis and quality controls keep content and identity consistent from lot to lot, so your research stays reproducible." },
  diagnostics: { pct: 96, label: "Batch Traceability", desc: "Every lot is documented end-to-end so your research remains fully auditable from compound to certificate." },
};
