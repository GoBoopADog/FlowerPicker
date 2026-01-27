import * as cheerio from "cheerio";
import * as scorelogJson from "./types/scorelogJson.js";
import * as util from "./util.js";

export function parseJubeatScoreData(mainElement: cheerio.Element, collapsedElement: cheerio.Element, pageIndex: number): scorelogJson.JubeatDataRawJSON {
    const $ = cheerio.load('');
    const $main = $(mainElement);
    const $collapsed = $(collapsedElement).find('td > div > div');

    const rawData: scorelogJson.JubeatDataRawJSON = {
        playID: util.trimToNumber($main.attr('data-target')!),
        songTitle: $main.find('td > a > b').text(),
        songID: util.trimToNumber($main.find('td > a').attr('href')!.split('/')[7]!),
        playChartDifficultyID: util.trimToNumber($main.find('td > a').attr('href')!.split('/').pop()!),

        playChartDifficultyString: $main.children('td').eq(2).text().trim().split(' ').at(0)!,
        playChartDifficultyNumber: Number($main.children('td').eq(2).text().trim().split(' ').at(1)!),

        playIsHardPlay: $main.children('td').eq(1).find('div.pull-right').length ? true : false,
        playGrade: $main.children('td').eq(3).find('div > strong').text().trim(),
        playScore: util.trimToNumber($main.children('td').eq(3).find('small').text().trim()),
        playMusicRate: Number($main.children('td').eq(4).find('div > strong').text().trim().replace('%', '')),
        playJubility: Number($main.children('td').eq(4).find('small').text().trim()),
        playLamp: $main.children('td').eq(5).find('strong').text().trim(),
        playMaxCombo: util.trimToNumber($main.children('td').eq(6).find('strong').text().trim()),
        playScoreJudgements: {
            perfects: util.trimToNumber($collapsed.find("div:contains('Perfects')").text()),
            greats: util.trimToNumber($collapsed.find("div:contains('Greats')").text()),
            goods: util.trimToNumber($collapsed.find("div:contains('Goods')").text()),
            poors: util.trimToNumber($collapsed.find("div:contains('Poors')").text()),
            misses: util.trimToNumber($collapsed.find("div:contains('Misses')").text()),
        },

        playTimestampString: $main.children('td').eq(7).find('small').text().trim(),
        arcadePlayedAtString: $collapsed.find("div:contains('Played at')").text().replace('Played at', ''),
        arcadePlayedAtID: util.trimToNumber($collapsed.find("div:contains('Played at') > a").attr('href')?.split('/').pop()!),
        versionPlayedOnString: $collapsed.find("div:contains('Played with')").text().replace('Played with', ''),

        playJudgeBar: $collapsed.find(".jubeat-bars").attr("data-jubeat-judge")!.split(" ").map(Number),

        onPage: pageIndex,
    };

    return rawData;
}

export function parsePnmScoreData(mainElement: cheerio.Element, collapsedElement: cheerio.Element, pageIndex: number): scorelogJson.PnmDataRawJSON {
    const $ = cheerio.load('');
    const $main = $(mainElement);
    const $collapsed = $(collapsedElement).find('td > div > div');

    const rawData: scorelogJson.PnmDataRawJSON = {
        playID: util.trimToNumber($main.attr('data-target')!),
        songTitle: $main.find('td > a > b').text(),
        songArtist: $main.children('td').eq(0).find('small').text().trim(),
        songID: util.trimToNumber($main.find('td > a').attr('href')!.split('/')[7]!),
        playChartDifficultyID: util.trimToNumber($main.find('td > a').attr('href')!.split('/').pop()!),

        playChartDifficultyString: $main.children("td").eq(1).text().trim().replace(/\s*\d+\s*/g, " ").trim().toString(),
        playChartDifficultyNumber: util.trimToNumber($main.children("td").eq(1).text().trim().replace(/\s{5,}/g, " ").replace(/(\d)([A-Z])/g, "$1 $2")),

        playMedal: util.trimToNumber($main.children('td').eq(2).find('img').attr('src')!.split('_').pop()!.replace('.png', '')),
        playGrade: $main.children('td').eq(3).find('strong').text().trim(),
        playScore: util.trimToNumber($main.children('td').eq(3).find('div').text().trim()),
        playExScore: util.trimToNumber($collapsed.find("div:contains('EX Score')").text().trim().split(' ').at(2)!),
        playScoreJudgements: {
            cool: util.trimToNumber($collapsed.find("div:contains('Cool')").eq(1).text()),
            great: util.trimToNumber($collapsed.find("div:contains('Great')").eq(1).text()),
            good: util.trimToNumber($collapsed.find("div:contains('Good')").text()),
            bad: util.trimToNumber($collapsed.find("div:contains('Bad')").text()),
        },

        playTimestampString: $main.children('td').eq(5).find('small').text().trim(),
        arcadePlayedAtString: $collapsed.find("div:contains('Played at') > a").text().replace('Played at', '').trim(),
        arcadePlayedAtID: util.trimToNumber($collapsed.find("div:contains('Played at') > a").attr('href')?.split('/').pop()!),
        versionPlayedOnString: $collapsed.find("div:contains('Played with')").text().replace('Played with', '').trim(),

        onPage: pageIndex,
    };

    return rawData;
}

export function parseMusecaScoreData(mainElement: cheerio.Element, collapsedElement: cheerio.Element, pageIndex: number): scorelogJson.MusecaDataRawJSON {
    const $ = cheerio.load('');
    const $main = $(mainElement);
    const $collapsed = $(collapsedElement).find('td > div > div');

    const rawData: scorelogJson.MusecaDataRawJSON = {
        playID: util.trimToNumber($main.attr('data-target')!),
        songTitle: $main.find('td > a > b').text(),
        songID: util.trimToNumber($main.find('td > a').attr('href')!.split('/')[7]!),
        playChartDifficultyID: util.trimToNumber($main.find('td > a').attr('href')!.split('/').pop()!),

        playChartDifficultyString: $main.children('td').eq(2).text().trim().replace(/\s+/g, '').at(0)!,
        playChartDifficultyNumber: Number($main.children('td').eq(2).text().trim().replace(/\s+/g, '').slice(1)),

        missionString: $collapsed.find("h4.media-heading").text().trim() || null,
        playScore: util.trimToNumber($main.children('td').eq(3).find('strong').text().trim()),
        playGrade: $main.children('td').eq(4).find('strong').text().trim(),
        playLamp: $main.children('td').eq(5).find('strong').text().trim(),
        playMaxCombo: util.trimToNumber($main.children('td').eq(6).find('strong').text().trim()),
        playScoreJudgements: {
            critical: util.trimToNumber($collapsed.find("div:contains('Critical')").text()),
            near: util.trimToNumber($collapsed.find("div:contains('Near')").text()),
            error: util.trimToNumber($collapsed.find("div:contains('Error')").text()),
        },

        playTimestampString: $main.children('td').eq(7).find('small').text().trim(),
        arcadePlayedAtString: $collapsed.find("div:contains('Played at') > a").text().replace('Played at', '').trim(),
        arcadePlayedAtID: util.trimToNumber($collapsed.find("div:contains('Played at') > a").attr('href')?.split('/').pop()!),
        versionPlayedOnString: $collapsed.find("div:contains('Played with')").text().replace('Played with', '').trim(),

        onPage: pageIndex,
    };

    return rawData;
}

export function parseGitadoraScoreData(mainElement: cheerio.Element, collapsedElement: cheerio.Element, pageIndex: number): scorelogJson.GitadoraDataRawJSON {
    const $ = cheerio.load('');
    const $main = $(mainElement);
    const $collapsed = $(collapsedElement).find('td > div > div');

    const rawData: scorelogJson.GitadoraDataRawJSON = {
        playID: util.trimToNumber($main.attr('data-target')!),
        songTitle: $main.find('td > a > strong').text(),
        // Url is /music/version?/songID/instrument/difficulty
        // 0 is drum, 1 is guitar, 2 is bass
        songID: util.trimToNumber($main.find('td > a').attr('href')!.split('/')[7]!),
        playChartDifficultyID: util.trimToNumber($main.find('td > a').attr('href')!.split('/')[9]!),
        playInstrumentID: util.trimToNumber($main.find('td > a').attr('href')!.split('/')[8]!),

        playInstrumentString: $main.children('td').eq(2).text().trim().split('\n').at(0)!,
        playChartDifficultyString: $main.children('td').eq(2).text().trim().split('\n').at(-1)!.trim(),
        playChartDifficultyNumber: Number($main.children('td').eq(2).find('strong').text().trim()),

        playSkillRating: Number($main.children('td').eq(4).find('strong').text().trim()),
        playPercentageScore: Number($main.children('td').eq(4).find('small').text().trim().replace('%', '')),
        playLamp: $main.children('td').eq(5).find('strong').text().trim(),
        playGrade: $main.children('td').eq(3).find('strong').text().trim(),
        playScore: util.trimToNumber($collapsed.find("div:contains('Score')").text().trim()),
        playMaxCombo: util.trimToNumber($collapsed.find("div:contains('Max combo')").text().trim()),
        playScoreJudgements: {
            perfect: util.trimToNumber($collapsed.find("div:contains('Perfect')").text()),
            great: util.trimToNumber($collapsed.find("div:contains('Great')").text()),
            good: util.trimToNumber($collapsed.find("div:contains('Good')").text()),
            ok: util.trimToNumber($collapsed.find("div:contains('OK')").text()),
            miss: util.trimToNumber($collapsed.find("div:contains('Miss')").text()),
        },

        playTimestampString: $main.children('td').eq(6).find('small').text().trim(),
        arcadePlayedAtString: $collapsed.find("div:contains('Played at') > div > a").text().replace('Played at', '').trim(),
        arcadePlayedAtID: util.trimToNumber($collapsed.find("div:contains('Played at') > div > a").attr('href')?.split('/').pop()!),
        versionPlayedOnString: $collapsed.find("div:contains('Played with')").text().replace('Played with', '').trim(),

        playJudgeBar: $collapsed.find("svg").children().toArray().map(el => {
            const fill = $(el).attr('fill')
            switch (fill) {
                case "#feff00": // Seems to be anything OTHER than a miss
                    return 3;
                case "#7598ff": // Miss, don't believe it's anything else
                    return 2;
                case "#ff0000": // Failed here
                    return 1;
                case "#000000": // Unplayed
                    return 0;
                default: // Unknown or error
                    return -1;
            }
        }),

        onPage: pageIndex,
    };

    return rawData;
}

export function parseNostalgiaScoreData(mainElement: cheerio.Element, collapsedElement: cheerio.Element, pageIndex: number): scorelogJson.NostalgiaDataRawJSON {
    const $ = cheerio.load('');
    const $main = $(mainElement);
    const $collapsed = $(collapsedElement).find('td > div > div');

    const fastSlowText = $collapsed.find("div:contains('Fast / Slow')").text();

    const rawData: scorelogJson.NostalgiaDataRawJSON = {
        playID: util.trimToNumber($main.attr('data-target')!),
        songTitle: $main.find('td > a > strong').text().trim(),
        songID: util.trimToNumber($main.find('td > a').attr('href')!.split('/')[7]!),
        playChartDifficultyID: util.trimToNumber($main.find('td > a').attr('href')!.split('/').pop()!),

        playChartDifficultyString: $main.children('td').eq(2).text().trim().split('\n').at(0)!,
        playChartDifficultyNumber: util.trimToNumber($main.children('td').eq(2).text().trim().split('\n').at(1)!.trim()),

        playGrade: $main.children('td').eq(3).find('strong').text().trim(),
        playScore: util.trimToNumber($main.children('td').eq(3).find('div > small').text().trim()),
        playScoreJudgements: {
            pJust: util.trimToNumber($collapsed.find("div:contains('◆Just')").text()),
            just: util.trimToNumber($collapsed.find("div:contains('Just'):not(:contains('◆'))").text()),
            good: util.trimToNumber($collapsed.find("div:contains('Good')").text()),
            near: util.trimToNumber($collapsed.find("div:contains('Near')").text()),
            miss: util.trimToNumber($collapsed.find("div:contains('Miss')").text()),
            fast: fastSlowText ? util.trimToNumber(fastSlowText.split('/').at(1)! ?? 0) : 0, // The element only doesn't exist if all notes were hit perfectly
            slow: fastSlowText ? util.trimToNumber(fastSlowText.split('/').at(2)! ?? 0) : 0,
        },

        playTimestampString: $main.children('td').eq(5).find('div > small').text().trim(),
        arcadePlayedAtString: $collapsed.find("div:contains('Played at') > div > a").text().replace('Played at', '').trim(),
        arcadePlayedAtID: util.trimToNumber($collapsed.find("div:contains('Played at') > div > a").attr('href')?.split('/').pop()!),
        versionPlayedOnString: $collapsed.find("div:contains('Played with')").text().replace('Played with', '').trim(),

        onPage: pageIndex,
    };

    return rawData;
}

export function parseDDRScoreData(mainElement: cheerio.Element, collapsedElement: cheerio.Element, pageIndex: number): scorelogJson.DDRDataRawJSON {
    {
        const $ = cheerio.load('');
        const $main = $(mainElement);
        const $collapsed = $(collapsedElement).find('td > div > div');

        const hasLamp = $main.children('td').eq(5).find('small').attr('title') ? true : false;
        const flare = $main.children('td').eq(6).text().trim();

        const rawData: scorelogJson.DDRDataRawJSON = {
            playID: util.trimToNumber($main.attr('data-target')!),
            songTitle: $main.find('td > a > b').text().trim(),
            songID: util.trimToNumber($main.find('td > a').attr('href')!.split('/')[7]!),
            playChartDifficultyID: util.trimToNumber($main.find('td > a').attr('href')!.split('/').pop()!),

            playPlaystyle: $main.children('td').eq(2).text().trim().split('\n').at(0)!.split(' ').at(0)!,
            playChartDifficultyString: $main.children('td').eq(2).text().trim().split('\n').at(0)!.split(' ').at(1)!,
            playChartDifficultyNumber: util.trimToNumber($main.children('td').eq(2).text().trim().split('\n').at(1)!.trim()),

            playLamp: hasLamp ? $main.children('td').eq(5).find('small').attr('title')!.trim() : undefined,
            playScore: util.trimToNumber($main.children('td').eq(3).find('strong').text().trim()),
            playGrade: $main.children('td').eq(4).find('strong').text().trim(),

            flare: flare ? util.trimToNumber(flare) : undefined,
            playMaxCombo: util.trimToNumber($main.children('td').eq(7).text().trim()),

            playScoreJudgements: {
                marvelous: util.trimToNumber($collapsed.find("strong:contains('Marvelous')").parent().text()),
                perfect: util.trimToNumber($collapsed.find("strong:contains('Perfect')").parent().text()),
                great: util.trimToNumber($collapsed.find("strong:contains('Great')").parent().text()),
                good: util.trimToNumber($collapsed.find("strong:contains('Good')").parent().text()),
                ok: util.trimToNumber($collapsed.find("strong:contains('OK')").parent().text()),
                ng: util.trimToNumber($collapsed.find("strong:contains('NG')").parent().text()),
                miss: util.trimToNumber($collapsed.find("strong:contains('Miss')").parent().text()),
            },

            playTimestampString: $main.children('td').eq(8).find('small').text().trim(),
            arcadePlayedAtString: $collapsed.find("div:contains('Played at') > div > a").text().replace('Played at', '').trim(),
            arcadePlayedAtID: util.trimToNumber($collapsed.find("div:contains('Played at') > div > a").attr('href')?.split('/').pop()!),
            versionPlayedOnString: $collapsed.find("div:contains('Played with')").text().replace('Played with', '').trim(),

            onPage: pageIndex,
        }

        return rawData;
    }
}