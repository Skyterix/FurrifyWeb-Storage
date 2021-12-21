export class KeycloakTokenUtils {

    static parseToken(token: string): any | null {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    }
}
