export interface UmaruAnime {
    id: number,
    bangumi_id: number,
    category_id: number,
    category_name: string,
    title: string,
    season: number,
    cover: string,
    total: number,
    rss_url: string,
    play_time: number,
    create_time: number,
    update_time: number
}


export interface UmaruVideo {
    anime_id?: number;
    path?: string;
    filename?: string;
    size?: number;
    update_time?: number;
}
