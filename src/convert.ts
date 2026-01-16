import type { JubeatDataRawJSON, PnmDataRawJSON } from "./types/common.ts";
import type { BatchManualJSONJubeat, BatchManualJSONPnm } from "./types/convert.ts";

export function jubeatToTachiCompat(jubeatDataJSON: JubeatDataRawJSON[], service?: string) {
    // Thank you to https://gist.github.com/Meta-link/d01c15fc56a277becc7d67a7c1dccfa2 for the tachi structure
    let tachiCompJson: BatchManualJSONJubeat = {
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
            "difficulty": (item.songIsHardPlay ? "HARD " : "") + item.songChart.split(' ')[0], // Gets from "ABC 1.1"
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

export function pnmToTachiCompat(pnmDataJSON: PnmDataRawJSON[], service?: string) {
    // Thank you to https://github.com/HutchyBen/flower-tachi/blob/main/games/popn.py for helping me figure out how to parse the lamp thing
    let tachiCompJson: BatchManualJSONPnm = {
        meta: {
            "game": "popn",
            "playtype": "9B",
            "service": service ? service : "FlowerPicker",
        },
        scores: []
    };

    pnmDataJSON.forEach((item: PnmDataRawJSON) => {
        if (item.songChart.includes("BATTLE")) return; // Battle charts are not supported by Tachi

        const medals = ["error", "failedCircle", "failedDiamond", "failedStar", "easyClear", "clearCircle", "clearDiamond", "clearStar", "fullComboCircle", "fullComboDiamond", "fullComboStar", "perfect"];
        // Gets from either "1 HYPER" or "(BATTLE) 1 HYPER"
        const parsedDifficultyRaw = item.songChart.split(' ')[item.songChart.split(' ').length - 1]!;
        // Has to turn EASY/NORMAL/HYPER/EX to Easy/Normal/Hyper/EX
        const parsedDifficulty = parsedDifficultyRaw.length > 2 ?
            parsedDifficultyRaw.charAt(0).toUpperCase() + parsedDifficultyRaw.slice(1).toLowerCase()
            : parsedDifficultyRaw.toUpperCase();

        tachiCompJson.scores.push({
            "score": Number(item.songNumberScore),
            "clearMedal": medals[item.songMedal]!,
            "judgements": {
                "cool": item.scoreData.cool,
                "great": item.scoreData.great,
                "good": item.scoreData.good,
                "bad": item.scoreData.bad,
            },
            "difficulty": parsedDifficulty,
            "matchType": "inGameID",
            "identifier": item.songID.toString(),
            "timeAchieved": Math.floor(new Date(item.songTimestampString).getTime()),
        });
    });

    return tachiCompJson;
}