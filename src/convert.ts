import type * as convertType from "./types/convert.js";
import type * as scorelogJson from "./types/scorelogJson.js";

export function jubeatToTachiCompat(jubeatDataJSON: scorelogJson.JubeatDataRawJSON[], msOffset: number = 0, service?: string): convertType.BatchManualJSONJubeat {
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
            "score": Number(item.playScore),
            "lamp": item.playLamp.toUpperCase(), // Values returned by the scraper are the same, just not in uppercase
            "musicRate": Number(item.playMusicRate),
            "matchType": "inGameID",
            "identifier": item.songID.toString(),
            "difficulty": (item.playIsHardPlay ? "HARD " : "") + item.playChartDifficultyString.toUpperCase(),
            "timeAchieved": Math.floor(new Date(item.playTimestampString).getTime() - msOffset),
            "judgements": {
                "perfect": Number(item.playScoreJudgements.perfects),
                "great": Number(item.playScoreJudgements.greats),
                "good": Number(item.playScoreJudgements.goods),
                "poor": Number(item.playScoreJudgements.poors),
                "miss": Number(item.playScoreJudgements.misses)
            },
            "optional": {
                "maxCombo": Number(item.playMaxCombo),
                "musicBar": item.playJudgeBar
            },
        });
    });

    return tachiCompJson;
}

export function pnmToTachiCompat(pnmDataJSON: scorelogJson.PnmDataRawJSON[], msOffset: number = 0, service?: string): convertType.BatchManualJSONPnm {
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
        if (item.playChartDifficultyString.includes("BATTLE")) return; // Battle charts are not supported by Tachi

        const medals = ["ERROR", "failedCircle", "failedDiamond", "failedStar", "easyClear", "clearCircle", "clearDiamond", "clearStar", "fullComboCircle", "fullComboDiamond", "fullComboStar", "perfect"];

        tachiCompJson.scores.push({
            "score": item.playScore,
            "clearMedal": medals[item.playMedal]!,
            "judgements": {
                "cool": item.playScoreJudgements.cool,
                "great": item.playScoreJudgements.great,
                "good": item.playScoreJudgements.good,
                "bad": item.playScoreJudgements.bad,
            },
            // Has to turn EASY/NORMAL/HYPER/EX to Easy/Normal/Hyper/EX
            "difficulty": item.playChartDifficultyString.length > 2 ? item.playChartDifficultyString.charAt(0).toUpperCase() + item.playChartDifficultyString.slice(1).toLowerCase() : item.playChartDifficultyString.toUpperCase(),
            "matchType": "inGameID",
            "identifier": item.songID.toString(),
            "timeAchieved": Math.floor(new Date(item.playTimestampString).getTime() - msOffset),
        });
    });

    return tachiCompJson;
}

export function musecaToTachiCompat(musecaDataJSON: scorelogJson.MusecaDataRawJSON[], msOffset: number = 0, service?: string): convertType.BatchManualJSONMuseca {
    let tachiCompJson: convertType.BatchManualJSONMuseca = {
        meta: {
            "game": "museca",
            "playtype": "Single",
            "service": service ? service : "FlowerPicker",
        },
        scores: []
    };

    musecaDataJSON.forEach((item: scorelogJson.MusecaDataRawJSON) => {
        let parsedLamp = item.playLamp;
        let parsedDifficulty;

        if (parsedLamp === "CLEARED") parsedLamp = "CLEAR";
        // https://github.com/zkldi/Tachi/blob/a2f71ffcb38240089f2a0c1168ccd72afa566826/server/src/game-implementations/games/museca.ts#L75
        if (item.playScore === 1000000) parsedLamp = "PERFECT CONNECT ALL";
        if (item.playScore < 800000) parsedLamp = "FAILED";
        if (item.playScore >= 800000 && parsedLamp === "FAILED") parsedLamp = "CLEAR";

        switch (item.playChartDifficultyString) {
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
            "score": item.playScore,
            "lamp": parsedLamp,
            "judgements": {
                "critical": item.playScoreJudgements.critical,
                "near": item.playScoreJudgements.near,
                "miss": item.playScoreJudgements.error,
            },
            "difficulty": parsedDifficulty,
            "matchType": "inGameID",
            "identifier": item.songID.toString(),
            "timeAchieved": Math.floor(new Date(item.playTimestampString).getTime() - msOffset),
            optional: {
                "maxCombo": item.playMaxCombo,
            },
        });
    });

    return tachiCompJson;
}

export function gitadoraToTachiCompat(gitadoraDataJSON: scorelogJson.GitadoraDataRawJSON[], playtype: "Gita" | "Dora", msOffset: number = 0, service?: string): convertType.BatchManualJSONGitadora {
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
            percent: item.playPercentageScore,
            lamp: item.playLamp.toUpperCase(),
            judgements: {
                perfect: item.playScoreJudgements.perfect,
                great: item.playScoreJudgements.great,
                good: item.playScoreJudgements.good,
                ok: item.playScoreJudgements.ok,
                miss: item.playScoreJudgements.miss,
            },

            difficulty: (item.playInstrumentString === "Bass" ? "BASS " : "") + item.playChartDifficultyString.toUpperCase(),
            matchType: "inGameID",
            identifier: item.songID.toString(),
            timeAchieved: Math.floor(new Date(item.playTimestampString).getTime() - msOffset),
            optional: {
                maxCombo: item.playMaxCombo,
            },
        });
    });

    return tachiCompJson;
}