import { NavConfig } from "@/types/generic";

const publicNavigationConfig = (sessionCode: number): Array<NavConfig> => ([
    {
        title: "The Jam",
        href: `/jams/${sessionCode}`
    },
    {
        title: "Playlists",
        href: `/jams/${sessionCode}/playlists`
    },
    {
        title: "Explore",
        href: `/jams/${sessionCode}/explore`
    }
])

export default publicNavigationConfig;