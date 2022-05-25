export class TagPriorityConfig {
    private static readonly movieTagStrategy = 11;
    private static readonly universeTagStrategy = 10;
    private static readonly companyTagStrategy = 9;
    private static readonly characterTagStrategy = 8;
    private static readonly sexTagStrategy = 7;
    private static readonly specieTagStrategy = 6;
    private static readonly bodyTagStrategy = 5;
    private static readonly ageTagStrategy = 4;
    private static readonly actionTagStrategy = 3;
    private static readonly amountTagStrategy = 2;
    private static readonly backgroundTagStrategy = 1;

    public static getTagPriorityByStrategy(tagStrategy: string): number {
        switch (tagStrategy) {
            case 'COMPANY':
                return this.companyTagStrategy;
            case 'SEX':
                return this.sexTagStrategy;
            case 'SPECIE':
                return this.specieTagStrategy;
            case 'BODY':
                return this.bodyTagStrategy;
            case 'AMOUNT':
                return this.amountTagStrategy;
            case 'AGE':
                return this.ageTagStrategy;
            case 'ACTION':
                return this.actionTagStrategy;
            case 'CHARACTER':
                return this.characterTagStrategy;
            case 'UNIVERSE':
                return this.universeTagStrategy;
            case 'MOVIE':
                return this.movieTagStrategy;
            case 'BACKGROUND':
                return this.backgroundTagStrategy;
            default:
                return 0;
        }
    }
}
