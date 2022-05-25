export class ProvidersConfig {
    public static readonly PROVIDERS: Provider[] = [
        {
            name: "DeviantArt",
            id: 'deviantart',
            color: "#06070d",
            accent: "#fff",
            logoUrl: "./assets/providers/deviantart.png"
        },
        {
            name: "Patreon",
            id: 'patreon',
            color: "#fff",
            accent: "#052d49",
            logoUrl: "./assets/providers/patreon.png"
        }
    ];

    public static readonly PROVIDER_PREFIX: string = "provider_";
}

export interface Provider {
    name: string,
    id: string,
    color: string,
    accent: string,
    logoUrl: string
}