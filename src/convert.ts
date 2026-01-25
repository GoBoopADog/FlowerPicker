import type * as convertType from "./types/convert.js";
import type * as scorelogJson from "./types/scorelogJson.js";
import { trimToNumber } from "./util.js";

export function jubeatToTachiCompat(jubeatDataJSON: scorelogJson.JubeatDataRawJSON[], service?: string): convertType.BatchManualJSONJubeat {
    // Thank you to https://gist.github.com/Meta-link/d01c15fc56a277becc7d67a7c1dccfa2 for the tachi structure
    let tachiCompJson: convertType.BatchManualJSONJubeat = {
        meta: {
            "game": "jubeat",
            "playtype": "Single",
            "service": service ? service : "FlowerPicker",
        },
        scores: []
    };

    jubeatDataJSON.forEach((item: scorelogJson.JubeatDataRawJSON) => {
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

export function pnmToTachiCompat(pnmDataJSON: scorelogJson.PnmDataRawJSON[], service?: string): convertType.BatchManualJSONPnm {
    // Thank you to https://github.com/HutchyBen/flower-tachi/blob/main/games/popn.py for helping me figure out how to parse the lamp thing
    let tachiCompJson: convertType.BatchManualJSONPnm = {
        meta: {
            "game": "popn",
            "playtype": "9B",
            "service": service ? service : "FlowerPicker",
        },
        scores: []
    };

    pnmDataJSON.forEach((item: scorelogJson.PnmDataRawJSON) => {
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

export function musecaToTachiCompat(musecaDataJSON: scorelogJson.MusecaDataRawJSON[], service?: string): convertType.BatchManualJSONMuseca {
    let tachiCompJson: convertType.BatchManualJSONMuseca = {
        meta: {
            "game": "museca",
            "playtype": "Single",
            "service": service ? service : "FlowerPicker",
        },
        scores: []
    };

    musecaDataJSON.forEach((item: scorelogJson.MusecaDataRawJSON) => {
        let parsedLamp = item.songLampText;
        let parsedDifficulty;

        if (parsedLamp === "CLEARED") parsedLamp = "CLEAR";
        // https://github.com/zkldi/Tachi/blob/a2f71ffcb38240089f2a0c1168ccd72afa566826/server/src/game-implementations/games/museca.ts#L75
        if (trimToNumber(item.songNumberScore) === 1000000) parsedLamp = "PERFECT CONNECT ALL";
        if (trimToNumber(item.songNumberScore) < 800000) parsedLamp = "FAILED";
        if (trimToNumber(item.songNumberScore) >= 800000 && parsedLamp === "FAILED") parsedLamp = "CLEAR";

        switch (item.songChart.charAt(0)) {
            case "翠":
                parsedDifficulty = "Green";
                break;
            case "橙":
                parsedDifficulty = "Yellow";
                break;
            case "朱":
                parsedDifficulty = "Red";
                break;
            default:
                parsedDifficulty = "ERROR";
        }

        tachiCompJson.scores.push({
            "score": trimToNumber(item.songNumberScore),
            "lamp": parsedLamp,
            "judgements": {
                "critical": item.scoreData.critical,
                "near": item.scoreData.near,
                "miss": item.scoreData.error,
            },
            "difficulty": parsedDifficulty,
            "matchType": "inGameID",
            "identifier": item.songID.toString(),
            "timeAchieved": Math.floor(new Date(item.songTimestampString).getTime()),
            optional: {
                "maxCombo": item.songMaxCombo,
            },
        });
    });

    return tachiCompJson;
}

export function gitadoraToTachiCompat(gitadoraDataJSON: scorelogJson.GitadoraDataRawJSON[], playtype: "Gita" | "Dora", service?: string): convertType.BatchManualJSONGitadora {
    let tachiCompJson: convertType.BatchManualJSONGitadora = {
        meta: {
            "game": "gitadora",
            "playtype": playtype,
            "service": service ? service : "FlowerPicker",
        },
        scores: []
    };
    gitadoraDataJSON.forEach((item: scorelogJson.GitadoraDataRawJSON) => {
        if (playtype === "Gita" && item.playInstrumentString === "Drum") return;
        if (playtype === "Dora" && item.playInstrumentString !== "Drum") return;

        tachiCompJson.scores.push({
            percent: Number(item.playPercentageScore.replace('%', '')),
            lamp: item.playLamp.toUpperCase(),
            judgements: {
                perfect: item.scoreData.perfect,
                great: item.scoreData.great,
                good: item.scoreData.good,
                ok: item.scoreData.ok,
                miss: item.scoreData.miss,
            },

            difficulty: (item.playInstrumentString === "Bass" ? "BASS " : "") + item.songDifficultyString.toUpperCase(),
            matchType: "inGameID",
            identifier: item.songID.toString(),
            timeAchieved: Math.floor(new Date(item.songTimestampString).getTime()),
            optional: {
                maxCombo: item.playMaxCombo,
            },
        });
    });

    return tachiCompJson;
}