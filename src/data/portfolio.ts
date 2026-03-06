export type MediaType = 'image' | 'video' | 'link';

export interface PortfolioItem {
    id: string;
    type: MediaType;
    title: string;
    description: string;
    thumbnail: string;
    contentUrl: string; // The full image, video embed URL, or external link
    category: string;
    year: string;
}

export interface SiteSettings {
    username: string;
    profileImageUrl?: string;
    profileText?: string;
}

export interface PortfolioDataPayload {
    settings: SiteSettings;
    items: PortfolioItem[];
}

import portfolioDataRaw from './portfolio.json';

// Cast the imported generic JSON object to our strict TypeScript interface
const data = portfolioDataRaw as PortfolioDataPayload;

export const SITE_SETTINGS: SiteSettings = data.settings || { username: 'tsuchifumazu-sys' };
export const PORTFOLIO_DATA: PortfolioItem[] = data.items || [];
