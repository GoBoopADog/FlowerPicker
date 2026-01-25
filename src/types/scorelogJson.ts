//TODO: Make the variables more consistent (Anything relating to the song itself should start with song, play with play, etc) - Started a bit with gitadora but still needs work
export interface JubeatDataRawJSON {
    playID: number
    songTitle: string
    songID: number
    songDifficultyID: string
    songIsHardPlay: boolean
    songChart: string
    songLetterScore: string
    songNumberScore: string
    songMusicRate: string
    songJubility: string
    songClearStatus: string
    songMaxCombo: number
    songTimestampString: string
    arcadePlayedAtString: string
    arcadePlayedAtID: number
    machinePlayedWithString: string
    scoreData: {
        perfects: number
        greats: number
        goods: number
        poors: number
        misses: number
    }
    judgeBar: number[]
    onPage: number
}

export interface PnmDataRawJSON {
    playID: number
    songTitle: string
    songArtist: string
    songID: number
    songDifficultyID: string
    songChart: string
    songMedal: number
    songLetterScore: string
    songNumberScore: string
    songTimestampString: string
    exScore: number
    arcadePlayedAtString: string
    arcadePlayedAtID: number
    machinePlayedWithString: string
    scoreData: {
        cool: number
        great: number
        good: number
        bad: number
    }
    onPage: number
}

export interface MusecaDataRawJSON {
    playID: number
    songTitle: string
    songID: number
    songDifficultyID: string
    songChart: string
    songNumberScore: string
    songGradeKanji: string
    songLampText: string
    songMaxCombo: number
    songTimestampString: string
    arcadePlayedAtString: string
    arcadePlayedAtID: number
    machinePlayedWithString: string
    // I'm not 100% sure how the story mode/missions work, nor what the extra graficas are, so I'll just be using the string to determine if it's a story play or not
    missionString: string | null
    scoreData: {
        critical: number
        near: number
        error: number
    }
    onPage: number
}

export interface GitadoraDataRawJSON {
    playID: number
    songTitle: string
    songID: number
    songDifficultyID: number
    playinstrumentId: number
    playInstrumentString: string
    songDifficultyNumber: string
    songDifficultyString: string
    playLetter: string
    playSkillRating: string
    playPercentageScore: string
    playLamp: string
    songTimestampString: string // Needs changing to play but can't because TS wants to complain

    playScore: number
    arcadePlayedAtString: string
    arcadePlayedAtID: number
    machinePlayedWithString: string
    playMaxCombo: number
    scoreData: {
        perfect: number
        great: number
        good: number
        ok: number
        miss: number
    }
    playBar: any[]

    onPage: number
}