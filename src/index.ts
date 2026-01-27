import * as cheerio from "cheerio";
import * as parser from "./parser.js";
import * as error from "./types/errors.js";
import * as util from "./util.js";

const GAMES = ['iidx', 'jubeat', 'rb', 'gitadora', 'sdvx', 'museca', 'ddr', 'nostalgia', 'pnm'] as const;
type Game = typeof GAMES[number];
type ScoreForGame<G extends Game> =
    G extends "jubeat" ? ReturnType<typeof parser.parseJubeatScoreData> :
    G extends "pnm" ? ReturnType<typeof parser.parsePnmScoreData> :
    G extends "museca" ? ReturnType<typeof parser.parseMusecaScoreData> :
    G extends "gitadora" ? ReturnType<typeof parser.parseGitadoraScoreData> :
    G extends "nostalgia" ? ReturnType<typeof parser.parseNostalgiaScoreData> :
    G extends "ddr" ? ReturnType<typeof parser.parseDDRScoreData> :
    never;

class FlowerPicker {
    private baseURL: string;
    private cookie: string;

    constructor(baseURL: string, cookieSessionIDValue: string) {
        this.baseURL = baseURL;
        this.cookie = cookieSessionIDValue;
    }

    /**
     * Makes sure the cookie that was provided is actually valid
     * @throws {error.InvalidSessionCookieError} When the provided session cookie is invalid
     */
    async setup() {
        await this.fetchWithCookie(`${this.baseURL}/user`)
            .then((response) => {
                // Redirection means an invalid session ID
                if (response.redirected) {
                    throw new error.InvalidSessionCookieError();
                };
            });
    }

    /**
     * 
     * @param url The url to fetch from
     * @returns The completed fetch Response
     * @throws {error.TooManyRatelimitErrors} If the server returns too many 429 responses
     */
    private async fetchWithCookie(url: string): Promise<Response> {
        const retryCount = 3;
        let delayBetweenRetriesMs = 1000;

        for (let attempt = 1; attempt <= retryCount; attempt++) {
            const res = await fetch(url, {
                headers: {
                    cookie: this.cookie,
                }
            });

            if (res.status === 200) {
                return res;
            } else if (attempt <= retryCount) {
                console.warn(`Fetch attempt ${attempt} for ${url} failed with status ${res.status}. Retrying...`);
                await util.delay(delayBetweenRetriesMs);
                delayBetweenRetriesMs *= 2;
            }
        }
        throw new error.TooManyRatelimitErrors(`Failed to fetch ${url} after ${retryCount} attempts.`);
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
    public async getScoreLog<G extends Game>(
        game: G,
        profileID: string,
        options?: {
            fetchDownTo?: number,
            msTimeout?: number;
        }
    ): Promise<Array<ScoreForGame<G>>> {
        if (!GAMES.includes(game)) {
            throw new Error(`Game "${game}" is not supported.`);
        }

        const fetchDownTo = options?.fetchDownTo ?? 0;
        const msTimeout = options?.msTimeout ?? 1000;

        if (fetchDownTo > 0) { console.log(`Fetching ${profileID}'s ${game} scores down to timestamp: ${new Date(fetchDownTo).toISOString()}`) } else { console.log(`Fetching all of ${profileID}'s ${game} scores without a down-to limit.`); }

        let url = `${this.baseURL}/game/${game}${util.doesGameHaveProfileInUrl(game) ? '/profile' : ''}/${profileID}?page=`;
        const firstFetchedPage = await this.fetchWithCookie(`${url}1`)
        const firstFullPage = await firstFetchedPage.text();
        const first$ = cheerio.load(firstFullPage);
        const first$scoreLogGeneric = first$(".col-lg-8.col-lg-pull-4");

        const totalPagesRaw = parseInt(first$scoreLogGeneric.find('div.text-center > ul.pagination > li:nth-last-child(2) > a').first().text());
        const totalPages = isNaN(totalPagesRaw) ? 1 : totalPagesRaw;

        const allScores: Array<ScoreForGame<G>> = [];

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
                let score;

                if (!element || !elementCollapsed) {
                    continue;
                }

                switch (game) {
                    case "jubeat":
                        score = parser.parseJubeatScoreData(element, elementCollapsed, pageIndex) as ScoreForGame<G>;
                        break;
                    case "pnm":
                        score = parser.parsePnmScoreData(element, elementCollapsed, pageIndex) as ScoreForGame<G>;
                        break;
                    case "museca":
                        score = parser.parseMusecaScoreData(element, elementCollapsed, pageIndex) as ScoreForGame<G>;
                        break;
                    case "gitadora":
                        score = parser.parseGitadoraScoreData(element, elementCollapsed, pageIndex) as ScoreForGame<G>;
                        break;
                    case "ddr":
                        score = parser.parseDDRScoreData(element, elementCollapsed, pageIndex) as ScoreForGame<G>;
                        break;
                    case "nostalgia":
                        score = parser.parseNostalgiaScoreData(element, elementCollapsed, pageIndex) as ScoreForGame<G>;
                        break;
                    default:
                        throw new Error(`Parser not implemented for game "${game}".`);
                }

                if (new Date(score.playTimestampString).getTime() < fetchDownTo) {
                    console.log(`Reached fetch down to timestamp at score played on "${score.playTimestampString}", stopping fetch for ${profileID} on ${game}.`);
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

export * as convertTypes from "./types/convert.js";
export * as scorelogJsonTypes from "./types/scorelogJson.js";
export * as errorTypes from "./types/errors.js";
// export * as util from "./util";