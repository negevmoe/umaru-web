import axios from "@/lib/api/bangumi";
import {getSubjectRequest, getCharactersRequest, searchFilter, searchRequest} from "@/model/request/bangumi";

const bangumiApi = {
    getCalendar: () => {
        return axios({url: "/calendar", method: "get"})
    },
    getSubject: (req: getSubjectRequest) => {
        return axios({url: `/v0/subjects/${req.id}`, method: "get"})
    },
    getCharacters: (req: getCharactersRequest) => {
        return axios({url: `/v0/subjects/${req.id}/characters`, method: "get"})
    },
    search: (req: searchRequest) => {
        if (req.page <= 0) {
            req.page = 1
        }
        const limit = req.size
        const offset = (req.page - 1) * req.size


        return axios({
            url: "/v0/search/subjects", method: "post",
            params: {
                limit: limit,
                offset: offset
            },
            data: {
                keyword: req.keyword,
                sort: req.sort,
                filter: req.filter
            }
        })
    }
}

export default bangumiApi;
