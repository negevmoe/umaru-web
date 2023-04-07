export interface getSubjectRequest {
    id: number;
}

export interface getCharactersRequest {
    id: number;
}

export interface searchRequest {
    page: number;
    size: number;
    keyword: string;
    sort: string;
    filter: searchFilter;
}

export interface searchFilter {
    type: number[];
    tag: string[];
    air_date: string[];
    rating: string[];
    rank: string[];
    nsfw?: boolean;
}
