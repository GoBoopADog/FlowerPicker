import * as parser from "./parser.js";
import * as common from "./types/common.js";
import * as error from "./types/errors.js";
import * as util from "./util.js";

import * as cheerio from "cheerio";

class FlowerPicker {
    private baseURL: string;
    private cookie: string;

    constructor(baseURL: string, cookieSessionIDValue: string) {
        this.baseURL = baseURL;
        this.cookie = cookieSessionIDValue;
    }

    async setup() {
        await this.fetchWithCookie(`${this.baseURL}/user`)
            .then((response) => {
                // Redirection means an invalid session ID
                if (response.redirected) {
                    throw new error.InvalidSessionCookieError();
                };
            });
    }

    private async fetchWithCookie(url: string): Promise<Response> {
        return fetch(url, {
            headers: {
                cookie: this.cookie,
            }
        });
    }

    public async getProfileId(game: string, id: string): Promise<string | null> {
        const res = await this.fetchWithCookie(`${this.baseURL}/game/${game}${util.doesGameHaveProfileInUrl(game) ? '/profile' : ''}/${id}`);

        const html = await res.text();
        const $ = cheerio.load(html);

        const href = $("small > a").first().attr("href");
        if (!href) return null;

        return href.split("/")[4] ?? null;
    }

    /**
     * @param game The game to fetch scores from (MUST match ['iidx', 'jubeat', 'rb', 'gitadora', 'sdvx', 'museca', 'ddr', 'nostalgia', 'pnm'])
     * @param profileID The profile ID to fetch from
     * @param fetchDownTo Millisecond timestamp of the last score you want to fetch (inclusive)
    */
    public async getScoreLog(game: string, profileID: string, fetchDownTo: number = 0, msTimeout: number = 1000): Promise<common.JubeatDataRawJSON[]> {
        const Games = ['iidx', 'jubeat', 'rb', 'gitadora', 'sdvx', 'museca', 'ddr', 'nostalgia', 'pnm'];

        if (!Games.includes(game)) {
            throw new Error(`Game "${game}" is not supported.`);
        }

        if (fetchDownTo > 0) { console.log(`Fetching scores down to timestamp: ${new Date(fetchDownTo).toISOString()}`) } else { console.log(`Fetching all scores without a down-to limit.`); }

        let url = `${this.baseURL}/game/${game}/profile/${profileID}?page=`;
        const firstFetchedPage = await this.fetchWithCookie(`${url}1`)
        const firstFullPage = await firstFetchedPage.text();
        const first$ = cheerio.load(firstFullPage);
        const first$scoreLogGeneric = first$(".col-lg-8.col-lg-pull-4");

        const totalPagesRaw = parseInt(first$scoreLogGeneric.find('div.text-center > ul.pagination > li:nth-last-child(2) > a').first().text());
        const totalPages = isNaN(totalPagesRaw) ? 1 : totalPagesRaw;

        const allScores: common.JubeatDataRawJSON[] = [];

        let stop = false;

        for (let pageIndex = 1; pageIndex <= totalPages && !stop; pageIndex++) {
            console.log(`Fetching page ${pageIndex}/${totalPages}...`);

            const fetchedPage = await this.fetchWithCookie(`${url}${pageIndex}`);
            const fullPage = await fetchedPage.text();
            const $ = cheerio.load(fullPage);
            const $scoreLogGeneric = $(".col-lg-8.col-lg-pull-4");
            const $scoreLog = $scoreLogGeneric.find('tbody').children();

            // Some games have an extra element at the beginning (Currently only found iidx, sdvx has extra elements inbetween scores)
            const indexStart = $scoreLog.toArray().findIndex((elem) => {
                return first$(elem).hasClass('accordion-toggle');
            });

            for (let index = indexStart; index < $scoreLog.toArray().length; index += 2) {
                const element = $scoreLog.toArray()[index];
                const elementCollapsed = $scoreLog.toArray()[index + 1];
                const score = parser.parseJubeatScoreData(element!, elementCollapsed!, pageIndex);
                if (!element || !elementCollapsed) continue;

                // console.log(`Is ${new Date(score.songTimestampString).getTime()} < ${fetchDownTo}?: ${new Date(score.songTimestampString).getTime() < fetchDownTo}`);
                if (new Date(score.songTimestampString).getTime() < fetchDownTo) {
                    console.log(`Reached fetch down to timestamp at score played on "${score.songTimestampString}", stopping fetch.`);
                    stop = true;
                    break;
                }
                allScores.push(score);
            }

            if (!stop && msTimeout > 0 && pageIndex <= totalPages) {
                await util.delay(msTimeout);
            }
        }

        return allScores;
    }
}

/*
    Functions not yet ported:
    _accountInfoSetup
    _getPetalWalletsInfo

    Only mentioning so I don't forget they used to exist
*/

export default FlowerPicker;
export * as convert from "./convert.js";
export * as error from "./types/errors.js";
// export * as util from "./util";