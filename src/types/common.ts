// Game JSONs
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