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
            return true;
        case 'ddr':
        case 'nostalgia':
        case 'pnm':
            return false;
        default:
            return false;
    }
}

export async function delay(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
}