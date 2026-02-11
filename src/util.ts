export function trimToNumber(inputString: string): number {
    return Number(inputString.replace(/\D/g, ''));
}

export function doesGameHaveProfileInUrl(game: string): boolean {
    switch (game) {
        case 'iidx':
        case 'jubeat':
        case 'rb':
        case 'gitadora':
        case 'sdvx':
        case 'museca':
        case 'poco':
            return true;
        case 'ddr':
        case 'nostalgia':
        case 'pnm':
            return false;
        default:
            return false;
    }
}

export function doesGameHaveGameInUrl(game: string): boolean {
    switch (game) {
        case 'iidx':
        case 'jubeat':
        case 'rb':
        case 'gitadora':
        case 'sdvx':
        case 'museca':
        case 'ddr':
        case 'nostalgia':
        case 'pnm':
            return true;
        case 'poco': // Why do you have to be special
            return false;
        default:
            return true;
    }
}

export async function delay(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
}