import NotFound from "@/views/404.vue";
import Login from "@/views/Login.vue";
import {
    HomeOutlined,
    SettingOutlined,
    CalendarOutlined,
    UnorderedListOutlined,
    PlaySquareOutlined,
} from "@ant-design/icons-vue";

const routerList = [
    {
        path: '/404',
        name: 'not_found',
        component: NotFound,
        meta: {
            auth: false,
        },
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            auth: false,
        },
    },
    {
        path: '/',
        name: 'index',
        component: () => import("@/views/umaru/Index.vue"),
        children: [
            {
                path: "/",
                name: "home",
                component: () => import("@/views/umaru/Home.vue"),
                meta: {
                    nav: {
                        icon: HomeOutlined,
                        title: "首页"
                    },
                    auth: true
                }
            },
            {
                path: "/calendar",
                name: "calendar",
                component: () => import("@/views/umaru/BangumiCalendar.vue"),
                meta: {
                    nav: {
                        icon: CalendarOutlined,
                        title: "新番日历"
                    },
                    auth: true
                }
            },

            {
                path: "/search",
                name: "search",
                component: () => import("@/views/umaru/BangumiSearch.vue"),
                meta: {
                    nav: {
                        icon: PlaySquareOutlined,
                        title: "番剧索引"
                    },
                    auth: true
                }
            },
            {
                path: "/anime",
                name: "anime",
                component: () => import("@/views/umaru/AnimeList.vue"),
                meta: {
                    nav: {
                        icon: UnorderedListOutlined,
                        title: "订阅列表"
                    },
                    auth: true
                }
            },

            {
                path: "/setting",
                name: "setting",
                component: () => import("@/views/umaru/Setting.vue"),
                meta: {
                    nav: {
                        icon: SettingOutlined,
                        title: "设置"
                    },
                    auth: true
                }
            },
            {
                path: "/detail",
                name: "detail",
                component: () => import("@/views/umaru/BangumiDetail.vue"),
                meta: {
                    auth: true
                }
            }
        ],
    }
]

export default routerList;
