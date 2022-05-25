interface TagColor {
    background: string,
    color: string
}

export class TagColorsConfig {
    private static movie: TagColor = {
        background: '#924915',
        color: '#fff'
    };
    private static universe: TagColor = {
        background: '#4c0000',
        color: '#fff'
    };
    private static company: TagColor = {
        background: '#37115a',
        color: '#fff'
    };
    private static character: TagColor = {
        background: '#37115a',
        color: '#fff'
    };
    private static sex: TagColor = {
        background: '#5a114d',
        color: '#fff'
    };
    private static specie: TagColor = {
        background: '#5a112d',
        color: '#fff'
    };
    private static body: TagColor = {
        background: '#636363',
        color: '#fff'
    };
    private static age: TagColor = {
        background: '#636363',
        color: '#fff'
    };
    private static action: TagColor = {
        background: '#636363',
        color: '#fff'
    };
    private static amount: TagColor = {
        background: '#636363',
        color: '#fff'
    };
    private static background: TagColor = {
        background: '#636363',
        color: '#fff'
    };

    public static getTagColorByType(tagType: string): TagColor {
        switch (tagType) {
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
