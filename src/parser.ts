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
        songDifficultyID: $main.find('td > a').attr('href')!.split('/').pop()!,
        songIsHardPlay: $main.children('td').eq(1).find('div.pull-right').length ? true : false,
        songChart: $main.children('td').eq(2).text().trim(),
        songLetterScore: $main.children('td').eq(3).find('div > strong').text().trim(),
        songNumberScore: $main.children('td').eq(3).find('small').text().trim(),
        songMusicRate: $main.children('td').eq(4).find('div > strong').text().trim(),
        songJubility: $main.children('td').eq(4).find('small').text().trim(),
        songClearStatus: $main.children('td').eq(5).find('strong').text().trim(),
        songMaxCombo: util.trimToNumber($main.children('td').eq(6).find('strong').text().trim()),
        songTimestampString: $main.children('td').eq(7).find('small').text().trim(),

        arcadePlayedAtString: $collapsed.find("div:contains('Played at')").text().replace('Played at', ''),
        arcadePlayedAtID: util.trimToNumber($collapsed.find("div:contains('Played at') > a").attr('href')?.split('/').pop()!),
        machinePlayedWithString: $collapsed.find("div:contains('Played with')").text().replace('Played with', ''),
        scoreData: {
            perfects: util.trimToNumber($collapsed.find("div:contains('Perfects')").text()),
            greats: util.trimToNumber($collapsed.find("div:contains('Greats')").text()),
            goods: util.trimToNumber($collapsed.find("div:contains('Goods')").text()),
            poors: util.trimToNumber($collapsed.find("div:contains('Poors')").text()),
            misses: util.trimToNumber($collapsed.find("div:contains('Misses')").text()),
        },
        judgeBar: $collapsed.find(".jubeat-bars").attr("data-jubeat-judge")!.split(" ").map(Number),
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
        songDifficultyID: $main.find('td > a').attr('href')!.split('/').pop()!,
        songChart: $main.children("td").eq(1).text().trim().replace(/\s{5,}/g, " ").replace(/(\d)([A-Z])/g, "$1 $2"),
        songMedal: util.trimToNumber($main.children('td').eq(2).find('img').attr('src')!.split('_').pop()!.replace('.png', '')),
        songLetterScore: $main.children('td').eq(3).find('strong').text().trim(),
        songNumberScore: $main.children('td').eq(3).find('div').text().trim(),
        songTimestampString: $main.children('td').eq(5).find('small').text().trim(),

        exScore: util.trimToNumber($collapsed.find("div:contains('EX Score')").text().trim().split(' ')[2]!),
        arcadePlayedAtString: $collapsed.find("div:contains('Played at') > a").text().replace('Played at', '').trim(),
        arcadePlayedAtID: util.trimToNumber($collapsed.find("div:contains('Played at') > a").attr('href')?.split('/').pop()!),
        machinePlayedWithString: $collapsed.find("div:contains('Played with')").text().replace('Played with', '').trim(),
        scoreData: {
            cool: util.trimToNumber($collapsed.find("div:contains('Cool')").eq(1).text()),
            great: util.trimToNumber($collapsed.find("div:contains('Great')").eq(1).text()),
            good: util.trimToNumber($collapsed.find("div:contains('Good')").text()),
            bad: util.trimToNumber($collapsed.find("div:contains('Bad')").text()),
        },
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
        songDifficultyID: $main.find('td > a').attr('href')!.split('/').pop()!,
        songChart: $main.children('td').eq(2).text().trim().replace(/\s+/g, ''),
        songNumberScore: $main.children('td').eq(3).find('strong').text().trim(),
        songGradeKanji: $main.children('td').eq(4).find('strong').text().trim(),
        songLampText: $main.children('td').eq(5).find('strong').text().trim(),
        songMaxCombo: util.trimToNumber($main.children('td').eq(6).find('strong').text().trim()),
        songTimestampString: $main.children('td').eq(7).find('small').text().trim(),

        arcadePlayedAtString: $collapsed.find("div:contains('Played at') > a").text().replace('Played at', '').trim(),
        arcadePlayedAtID: util.trimToNumber($collapsed.find("div:contains('Played at') > a").attr('href')?.split('/').pop()!),
        machinePlayedWithString: $collapsed.find("div:contains('Played with')").text().replace('Played with', '').trim(),
        missionString: $collapsed.find("h4.media-heading").text().trim() || null,
        scoreData: {
            critical: util.trimToNumber($collapsed.find("div:contains('Critical')").text()),
            near: util.trimToNumber($collapsed.find("div:contains('Near')").text()),
            error: util.trimToNumber($collapsed.find("div:contains('Error')").text()),
        },
        onPage: pageIndex,
    };

    return rawData;
}