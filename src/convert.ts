import type { JubeatDataRawJSON } from "./types/common.ts";
import type { BatchManualJSON } from "./types/convert.ts";

export function jubeatToTachiCompat(jubeatDataJSON: JubeatDataRawJSON[], service?: string) {
    // Thank you to https://gist.github.com/Meta-link/d01c15fc56a277becc7d67a7c1dccfa2 for the tachi structure
    let tachiCompJson: BatchManualJSON = {
        meta: {
            "game": "jubeat",
            "playtype": "Single",
            "service": service ? service : "FlowerPicker",
        },
        scores: []
    };

    jubeatDataJSON.forEach((item: JubeatDataRawJSON) => {
        tachiCompJson.scores.push({
            "score": Number(item.songNumberScore),
            "lamp": item.songClearStatus.toUpperCase(), // Values returned by the scraper are the same, just not in uppercase
            "musicRate": Number(item.songMusicRate.replace('%', '')), // Jubeat specific field :)
            "matchType": "inGameID",
            "identifier": item.songID.toString(),
            "difficulty": (item.songIsHardPlay ? "HARD " : "") + item.songChart.split(' ')[0], // Returns "ABC 1.1", so this shouldn't be a problem
            "timeAchieved": Math.floor(new Date(item.songTimestampString).getTime()),
            "judgements": {
                "perfect": Number(item.scoreData.perfects),
                "great": Number(item.scoreData.greats),
                "good": Number(item.scoreData.goods),
                "poor": Number(item.scoreData.poors),
                "miss": Number(item.scoreData.misses)
            },
            "optional": {
                "maxCombo": Number(item.songMaxCombo),
                "musicBar": item.judgeBar
            },
        });
    });

    return tachiCompJson;
}