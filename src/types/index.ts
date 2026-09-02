export interface Publication {
  id: string;
  title: string;
  category?: any;
  author?: string;
  role?: string;
  date?: string;
  excerpt?: string;
  pages?: number;
  coverImage?: string;
  pdfUrl?: string | null;
  featured?: boolean;
  doi?: string | null;
  downloadCount?: number;

  slug?: string;
  abstract?: string;
  description?: string | null;
  type?: string;
  status?: string;
  publicationDate?: string | null;
  publishedAt?: string | null;
  year?: number | null;
  coverImageUrl?: string | null;
  pdfFileName?: string | null;
  pdfFileSize?: number | null;
  pdfMimeType?: string | null;
  journalIssue?: any;
  authors?: Array<{ id?: string; name: string; slug?: string; photoUrl?: string }>;
  tags?: Array<{ id?: string; name: string; slug?: string }>;
}

export interface Insight {
  id: string;
  title: string;
  category: "Commentary" | "Expert Perspective" | "Article" | "Analysis";
  author: string;
  role: string;
  avatar: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
  featured?: boolean;
}

export interface Program {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: "Simulation" | "Workshop" | "Strategic Summit" | "Fellowship";
  image: string;
  location: string;
  dates: string;
  participants: string;
  featured?: boolean;
}

export interface Pillar {
  id: string;
  number: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  features: string[];
  linkText: string;
  linkHref: string;
}

export interface StrategicStat {
  value: string;
  label: string;
  description: string;
}
