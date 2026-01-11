import * as cheerio from "cheerio";

class FlowerPicker {
    constructor(baseURL, flowerSessionIDValue) {
        this._baseURL = baseURL;
        this._cookie = `flower_session=${flowerSessionIDValue}`;

        // Account IDs
        this._accountIDs = {
            profileID: null,
            accountID: null,
            petalWalletIDs: null, // [arcadeName, walletID, walletBalance]
        }

        // Account Info
        this._accountInfo = {
            profileName: null,
            email: null,
            homeArcade: null,
            firstPlayedDateString: null,
        }
        // Game Info
        this._gameIDs = {
            iidxAccountID: null,
            ddrAccountID: null,
            jubeatAccountID: null,
            nostalgiaAccountID: null,
            popnAccountID: null,
            rbAccountID: null,
            sdvxAccountID: null
        }

        this._gameScoreLogs = {
            jubeat: [],
        }

        // TODO: This maybe? (Object of IDs)
        this.gameIDsNEW = new Map();
        // TODO: Also this but actually do this one (Object of [Arcade, ID])
        this.arcades = new Map();
    }

    async setup() {
        await this._accountInfoSetup();
    }

    async setupJubeatScoreLog() {
        await this._fetchWithCookie(`${this._baseURL}/game/jubeat/profile/${this._gameIDs.jubeatAccountID}`)
            .then((response) => response.text())
            .then(async (text) => {
                const $ = cheerio.load(text);
                /* FIXME: Not all accounts will always have a page selector (ul.pagination) above and below the scores as they have not played enough
                // Watch out for the player news pagination as the pagination buttons are reused there
                */
                const pages = parseInt($('div.col-lg-8.col-lg-pull-4 > div.text-center > ul.pagination > li:nth-last-child(2) > a').first().text());

                // FIXME: Toggle these 2 lines for normal loop
                for (let i = pages; i > 0; i--) {
                    console.log("On page " + i)
                    await this._fetchWithCookie(`${this._baseURL}/game/jubeat/profile/${this._gameIDs.jubeatAccountID}?page=${i}`)
                        // await this._fetchWithCookie(`${this._baseURL}/game/jubeat/profile/${this._gameIDs.jubeatAccountID}?page=22`)
                        .then((response) => response.text())
                        .then((text) => {
                            const $$ = cheerio.load(text);
                            const scores = $$('tbody').children('tr.accordion-toggle');
                            const scoresDiv = $$('tbody').children('tr:not(.accordion-toggle)');

                            let scoreArray = [];
                            scores.each((j, element) => {
                                const songTr = $(element); // If it has an i element inside the first td, then "⭐ This is the player's hiscore for this chart!"
                                const songTrDiv = $(scoresDiv).eq(j).find('td > div > div');
                                let playID = this._trimToNumber(songTr.attr('data-target'));
                                let songTitle = songTr.find('td > a > b').text();
                                let songID = songTr.find('td > a').attr('href').split('/')[7];
                                let songDifficultyID = songTr.find('td > a').attr('href').split('/').pop();
                                let songIsHardPlay = songTr.children('td').eq(1).find('div.pull-right').length ? true : false;
                                let songChart = songTr.children('td').eq(2).text().trim();
                                let songLetterScore = songTr.children('td').eq(3).find('div > strong').text().trim();
                                let songNumberScore = songTr.children('td').eq(3).find('small').text().trim();
                                let songMusicRate = songTr.children('td').eq(4).find('div > strong').text().trim();
                                let songJubility = songTr.children('td').eq(4).find('small').text().trim();
                                let songClearStatus = songTr.children('td').eq(5).find('strong').text().trim();
                                let songMaxCombo = songTr.children('td').eq(6).find('strong').text().trim();
                                let songTimestampString = songTr.children('td').eq(7).find('small').text().trim();

                                // Only obtainable from other div
                                let arcadePlayedAtString = $(songTrDiv).find("div:contains('Played at')").text().replace('Played at', '');
                                let arcadePlayedAtID = $(songTrDiv).find("div:contains('Played at') > a").attr('href')?.split('/').pop();
                                let machinePlayedWithString = $(songTrDiv).find("div:contains('Played with')").text().replace('Played with', '');;
                                let scoreData = {
                                    perfects: this._trimToNumber($(songTrDiv).find("div:contains('Perfects')").text()),
                                    greats: this._trimToNumber($(songTrDiv).find("div:contains('Greats')").text()),
                                    goods: this._trimToNumber($(songTrDiv).find("div:contains('Goods')").text()),
                                    poors: this._trimToNumber($(songTrDiv).find("div:contains('Poors')").text()),
                                    misses: this._trimToNumber($(songTrDiv).find("div:contains('Misses')").text()),
                                };
                                let judgeBar = $(songTrDiv).find(".jubeat-bars").attr("data-jubeat-judge").split(" ").map(Number);
                                let onPage = i;

                                scoreArray.push({
                                    playID, songTitle, songID, songDifficultyID, songIsHardPlay, songChart,
                                    songLetterScore, songNumberScore, songMusicRate, songJubility,
                                    songClearStatus, songMaxCombo, songTimestampString,
                                    arcadePlayedAtString, arcadePlayedAtID, machinePlayedWithString, scoreData, judgeBar, onPage
                                });
                            });

                            this._gameScoreLogs.jubeat.push(...scoreArray); // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
                        })
                    // FIXME: This one as well
                }
                console.log(this._gameScoreLogs.jubeat.length)
            });
    }

    async getProfileId(game, id) {
        const res = await this._fetchWithCookie(`${this._baseURL}/game/${game}${this._doesGameHaveProfileInUrl(game) ? '/profile' : ''}/${id}`);
        const html = await res.text();
        const $ = cheerio.load(html);

        const href = $("small > a").first().attr("href");
        if (!href) return null;

        return href.split("/")[4] ?? null;
    }

    _doesGameHaveProfileInUrl(game) {
        switch (game) {
            case 'iidx':
            case 'jubeat':
            case 'rb':
            case 'gitadora':
            case 'sdvx':
            case 'museca':
                return true;
            case 'ddr':
            case 'nostalgia':
            case 'pnm':
                return false;
            default:
                return null;
        }
    }

    async _fetchWithCookie(url) {
        return fetch(url, {
            headers: {
                cookie: this._cookie,
            }
        });
    }

    async _accountInfoSetup() {
        const userPage = await this._verifySessionIDValidityReturnUserBody();
        const $ = cheerio.load(userPage)

        // Account IDs
        // Gets 1234 from https://base.url/account/1234/petals
        this._accountIDs.profileID = $("a[title='Profile & Settings']").attr('href').split('/').pop();
        this._accountIDs.accountID = $('.fa-money').parent().attr('href').split('/')[4];
        this._accountIDs.petalWalletIDs = await this._getPetalWalletsInfo();

        // Account Info
        this._accountInfo.profileName = $("a[title='Profile & Settings'] > b").text();
        this._accountInfo.email = $("tbody > tr:nth-child(2) > td.text-right").text();
        this._accountInfo.homeArcade = $("tbody > tr:nth-child(3) > td.text-right").text();
        this._accountInfo.firstPlayedDateString = $("tbody > tr:nth-child(4) > td.text-right").text();

        // Game IDs
        this._gameIDs.iidxAccountID = $("a[title='beatmania IIDX']").attr('href')?.split('/').pop();
        this._gameIDs.ddrAccountID = $("a[title='DanceDanceRevolution']").attr('href')?.split('/').pop();
        this._gameIDs.jubeatAccountID = $("a[title='Jubeat']").attr('href')?.split('/').pop();
        this._gameIDs.nostalgiaAccountID = $("a[title='NOSTALGIA']").attr('href')?.split('/').pop();
        this._gameIDs.popnAccountID = $(`a[title="pop'n music"]`).attr('href')?.split('/').pop();
        this._gameIDs.rbAccountID = $("a[title='REFLEC BEAT']").attr('href')?.split('/').pop();
        this._gameIDs.sdvxAccountID = $("a[title='Sound Voltex']").attr('href')?.split('/').pop();
    }

    // TODO: Remove
    async __logData() {
        console.log('\nAccount IDs:');
        console.log(`  profileID: ${this._accountIDs.profileID}`);
        console.log(`  accountID: ${this._accountIDs.accountID}`);
        console.log(`  petalWalletIDs: ${this._accountIDs.petalWalletIDs}`);

        console.log('\nAccount Info:');
        console.log(`  profileName: ${this._accountInfo.profileName}`);
        console.log(`  email: ${this._accountInfo.email}`);
        console.log(`  homeArcade: ${this._accountInfo.homeArcade}`);
        console.log(`  firstPlayedDateString: ${this._accountInfo.firstPlayedDateString}`);

        console.log('\nGame IDs:')
        console.log(`  IIDX Account ID: ${this._gameIDs.iidxAccountID}`)
        console.log(`  DDR Account ID: ${this._gameIDs.ddrAccountID}`)
        console.log(`  Jubeat Account ID: ${this._gameIDs.jubeatAccountID}`)
        console.log(`  Nostalgia Account ID: ${this._gameIDs.nostalgiaAccountID}`)
        console.log(`  Pop'n Account ID: ${this._gameIDs.popnAccountID}`)
        console.log(`  RB Account ID: ${this._gameIDs.rbAccountID}`)
        console.log(`  SDVX Account ID: ${this._gameIDs.sdvxAccountID}`)

        console.log('\nGame Scores:')
        console.log(`  Jubeat: ${this._gameScoreLogs.jubeat}`)
    }
    /**
     * Verifies whether a given session is valid by making a request
     * @returns Response body text (If an error isn't fired first)
     */
    async _verifySessionIDValidityReturnUserBody() {
        return await this._fetchWithCookie(`${this._baseURL}/user`)
            .then((response) => {
                // Redirection means an invalid session ID
                if (response.redirected) {
                    throw new Error("The Session ID is not valid.");
                };

                return response.text();
            });
    }

    async _getPetalWalletsInfo() {
        return await this._fetchWithCookie(`${this._baseURL}/account/${this._accountIDs.accountID}/petals`)
            .then((response) => response.text())
            .then((text) => {
                const $ = cheerio.load(text);
                // return $('.list-group-item').attr('href').split('/')[6]; // Works for singular
                const walletIDs = [];
                $('.list-group').children().each((i, element) => {
                    const theElement = $(element);
                    let arcadeName = theElement.children('.list-group-item-heading').text().trim();
                    let walletID = theElement.attr('href')?.split('/').pop();
                    let walletBalance = this._trimToNumber(theElement.children('.list-group-item-text').text());

                    walletIDs.push({ arcadeName, walletID, walletBalance });
                });

                return walletIDs;
            })
    }

    _trimToNumber(string) {
        return string.replace(/\D/g, '');
    }
}

export default FlowerPicker;
export * as convert from "./convert.js";