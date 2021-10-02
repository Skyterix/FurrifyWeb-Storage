export class TagColorsConfig {
    private static movie = '#4c0000';
    private static universe = '#4c0000';
    private static company = '#031a55';
    private static character = '#37115a';
    private static sex = '#5a114d';
    private static specie = '#5a112d';
    private static body = '#343a40';
    private static age = '#343a40';
    private static action = '#343a40';
    private static amount = '#343a40';
    private static background = '#343a40';

    public static getTagColorByStrategy(tagStrategy: string): string {
        switch (tagStrategy) {
            case 'COMPANY':
                return this.company;
            case 'SEX':
                return this.sex;
            case 'SPECIE':
                return this.specie;
            case 'BODY':
                return this.body;
            case 'AMOUNT':
                return this.amount;
            case 'AGE':
                return this.age;
            case 'ACTION':
                return this.action;
            case 'CHARACTER':
                return this.character;
            case 'UNIVERSE':
                return this.universe;
            case 'MOVIE':
                return this.movie;
            default:
                return this.background;
        }
    }
}
