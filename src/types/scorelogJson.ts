interface BaseDataRawJSON {
    playID: number
    songTitle: string
    songID: number
    playChartDifficultyID: number

    playChartDifficultyString: string
    playChartDifficultyNumber: number

    playGrade: string;
    playScore: number;

    playTimestampString: string
    arcadePlayedAtString: string
    arcadePlayedAtID: number

    onPage: number
}

export interface JubeatDataRawJSON extends BaseDataRawJSON {
    playIsHardPlay: boolean
    playMusicRate: number
    playJubility: number
    playLamp: string
    playMaxCombo: number
    playScoreJudgements: {
        perfects: number
        greats: number
        goods: number
        poors: number
        misses: number
    }

    playJudgeBar: number[]

    versionPlayedOnString: string
}

export interface PnmDataRawJSON extends BaseDataRawJSON {
    songArtist: string

    playMedal: number
    playExScore: number
    playScoreJudgements: {
        cool: number
        great: number
        good: number
        bad: number
    }

    versionPlayedOnString: string
}

export interface MusecaDataRawJSON extends BaseDataRawJSON {
    // I'm not 100% sure how the story mode/missions work, nor what the extra graficas are, so I'll just be using the string to determine if it's a story play or not
    missionString: string | null
    playLamp: string
    playMaxCombo: number
    playScoreJudgements: {
        critical: number
        near: number
        error: number
    }

    versionPlayedOnString: string
}

export interface GitadoraDataRawJSON extends BaseDataRawJSON {
    playInstrumentID: number

    playInstrumentString: string

    playSkillRating: number
    playPercentageScore: number
    playLamp: string
    playMaxCombo: number
    playScoreJudgements: {
        perfect: number
        great: number
        good: number
        ok: number
        miss: number
    }

    playJudgeBar: number[]

    versionPlayedOnString: string
}

export interface NostalgiaDataRawJSON extends BaseDataRawJSON {
    playScoreJudgements: {
        pJust: number;
        just: number;
        good: number;
        near: number;
        miss: number;

        fast: number;
        slow: number;
    }

    versionPlayedOnString: string
}

export interface DDRDataRawJSON extends BaseDataRawJSON {
    playPlaystyle: string;
    playLamp?: string;
    flare?: number;
    playMaxCombo: number;

    playScoreJudgements: {
        marvelous: number;
        perfect: number;
        great: number;
        good: number;
        ok: number;
        ng: number;
        miss: number;
    }

    versionPlayedOnString: string
}

export interface PocoDataRawJSON extends BaseDataRawJSON {
    playLamp: string;
    playMaxCombo: number;
    playComboRank: string;

    playScoreJudgements: {
        perfect: number;
        great: number;
        good: number;
        bad: number;
        miss: number;
    };

    playJudgeBreakdown: {
        fastBad: number;
        fastBadPercent: number;

        fastGood: number;
        fastGoodPercent: number;

        fastGreat: number;
        fastGreatPercent: number;

        perfect: number;
        perfectPercent: number;

        slowGreat: number;
        slowGreatPercent: number;

        slowGood: number;
        slowGoodPercent: number;

        slowBad: number;
        slowBadPercent: number;


        hold: number;
        holdMax: number;

        flick: number;
        flickMax: number;

        fader: number;
        faderMax: number;

        honeycomb: number;
        honeycombMax: number;
    }

    extraData: {
        likes: number;
        likesGrade: string;
    };
}