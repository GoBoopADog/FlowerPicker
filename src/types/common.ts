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