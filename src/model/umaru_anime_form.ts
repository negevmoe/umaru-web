export interface UmaruAnimeForm {
    id: number,
    bangumi_id: number,
    title: string,
    category_id: number,
    season: number,
    cover: string,
    total: number,
    rss_url: string,
    play_time: number,
    torrent_list: string[],
    must_contain: string,
    must_not_contain: string,
    episode_filter: string,
    use_regex: boolean,
    smart_filter: boolean
}
