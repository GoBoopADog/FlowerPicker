// https://docs.tachi.ac/codebase/batch-manual/#meta
export const Games = [
    { name: "iidx", playtypes: ["SP", "DP"] },
    { name: "chunithm", playtypes: ["Single"] },
    { name: "museca", playtypes: ["Single"] },
    { name: "sdvx", playtypes: ["Single"] },
    { name: "wacca", playtypes: ["Single"] },
    { name: "popn", playtypes: ["9B"] },
    { name: "jubeat", playtypes: ["Single"] },
    { name: "gitadora", playtypes: ["Gita", "Dora"] },
    { name: "maimaidx", playtypes: ["Single"] },
    { name: "maimai", playtypes: ["Single"] },
    { name: "ongeki", playtypes: ["Single"] },
    { name: "ddr", playtypes: ["SP", "DP"] },
] as const;

export type GameName = typeof Games[number]["name"];

export type PlaytypeFor<G extends GameName> =
    Extract<(typeof Games)[number], { name: G }>["playtypes"][number];

export type BatchManualMeta = {
    [G in GameName]: {
        game: G;
        playtype: PlaytypeFor<G>;
        service: string;
        version?: string;
    }
}[GameName];

// https://docs.tachi.ac/codebase/batch-manual
export type BatchManualScoresJubeat = {
    score: number,
    /**
     * The lamp for this score. This should be one of the lamps as described in the config for your game + playtype.
     */
    lamp: string,
    /**
     * Only appears for jubeat. This should be set to the Percent for this score. In jubeat's case, this is your Music Rate.
     * 
     * Full match types at https://github.com/zkldi/Tachi/blob/main/common/src/types/batch-manual.ts but im not doin all that, so I'm getting it from https://docs.tachi.ac/codebase/batch-manual/#meta - This should be enough anyways since inGameID SHOULD be able to be used for everything
     * 
     * (Undocumented on the wiki, but it was changed to musicRate https://discord.com/channels/683092550160351261/683093545330147399/1067897460791451654)
     */
    musicRate?: number,
    /**  This determines how identifier will be used to match your scores' chart with Tachi's database of songs and charts.*/
    matchType: "inGameID" | "tachiSongID",
    /** A string that Tachi uses to identify what chart this is for. How this is used depends on the matchType.*/
    identifier: string,
    /**
     * If matchType is `tachiSongID`, `inGameID`, `ddrSongHash` or `songTitle`, this field must be present, and describe the difficulty of the chart this score is for.
     * 
     * Because this projects plans to only use the above, difficulty is set as required here, otherwise it is technically conditional
     */
    difficulty: string,
    /** If matchType is `songTitle`, this field can be present, and describe the artist name for less equivocal matching. This field is optional for legacy purposes. */
    artist?: string,
    /** This is when the score was achieved in unix milliseconds. This should be provided if possible, as Tachi uses it for a LOT of features. */
    timeAchieved?: number | null,
    /** A comment from the user about this score. */
    comment?: string | null,
    /** The detailed judgement counts for this score. This should be provided if possible, as Tachi uses it for a LOT of features. */
    judgements?: any,
    /** Any optional metrics you wish to provide for this game. */
    optional?: any,
    /** This can be a partial record of various scoreMeta props for this game. */
    scoreMeta?: any;
}

export interface BatchManualJSONJubeat {
    meta: BatchManualMeta;
    scores: BatchManualScoresJubeat[];
}

export interface BatchManualScoresPnm {
    score: number,
    /**
     * The clear medal for this score. This should be one of the medals as described in the config for your game + playtype.
     */
    clearMedal: string,
    judgements: any,
    difficulty: string,
    matchType: "inGameID" | "tachiSongID" | "popnChartHash",
    identifier: string,
    timeAchieved?: number | null,
}

export interface BatchManualJSONPnm {
    meta: BatchManualMeta;
    scores: BatchManualScoresPnm[];
}

export interface BatchManualScoresMuseca {
    score: number,
    lamp: string,
    judgements: any,
    difficulty: string,
    matchType: "songTitle" | "tachiSongID" | "inGameID",
    identifier: string,
    optional?: any,
    timeAchieved?: number | null,
}

export interface BatchManualJSONMuseca {
    meta: BatchManualMeta;
    scores: BatchManualScoresMuseca[];
}