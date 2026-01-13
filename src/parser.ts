import * as common from "./types/common.js";
import * as util from "./util.js";

import * as cheerio from "cheerio";

export function parseJubeatScoreData(mainElement: cheerio.Element, collapsedElement: cheerio.Element, pageIndex: number): common.JubeatDataRawJSON {
    const $ = cheerio.load('');
    const $main = $(mainElement);
    const $collapsed = $(collapsedElement).find('td > div > div');

    const rawData: common.JubeatDataRawJSON = {
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