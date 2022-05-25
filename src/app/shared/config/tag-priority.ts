export class TagPriorityConfig {
    private static movieTagStrategy = 11;
    private static universeTagStrategy = 10;
    private static companyTagStrategy = 9;
    private static characterTagStrategy = 8;
    private static sexTagStrategy = 7;
    private static specieTagStrategy = 6;
    private static bodyTagStrategy = 5;
    private static ageTagStrategy = 4;
    private static actionTagStrategy = 3;
    private static amountTagStrategy = 2;
    private static backgroundTagStrategy = 1;

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
