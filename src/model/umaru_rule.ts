export interface UmaruRule {
    id: number,
    name: string,
    must_contain: string,
    must_not_contain: string,
    use_regex: boolean,
    episode_filter: string,
    smart_filter: boolean,
    create_time: number,
    update_time: number
}
