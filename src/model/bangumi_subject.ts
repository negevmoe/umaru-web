export interface SubjectImage {
    small: string;
    grid: string;
    large: string;
    medium: string;
    common: string;
}

export interface SubjectTag {
    name: string;
    count: number;
}

export interface SubjectInfobox {
    key: string;
    value: string;
}

export interface SubjectCount {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
    8: number;
    9: number;
    10: number;
}

export interface SubjectRating {
    rank: number;
    total: number;
    count: SubjectCount;
    score: number;
}

export interface SubjectCollection {
    on_hold: number;
    dropped: number;
    wish: number;
    collect: number;
    doing: number;
}

export interface Subject {
    date: string;
    platform: string;
    images: SubjectImage;
    summary: string;
    name: string;
    name_cn: string;
    tags: SubjectTag[];
    infobox: SubjectInfobox[];
    rating: SubjectRating;
    total_episodes: number;
    collection: SubjectCollection;
    id: number;
    eps: number;
    volumes: number;
    locked: boolean;
    nsfw: boolean;
    type: number;
}

export interface SearchResponse {
    data: SearchItem[]
    total: number
    limit: number
    offset: number
}

export interface SearchItem {
    date: string
    image: string
    name: string
    name_cn: string
    tags: SearchTagItem[]
    score: number
    id: number
    rank: number
}

export interface SearchTagItem {
    name: string
    count: number
}
