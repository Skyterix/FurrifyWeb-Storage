export class AttachmentIconsConfig {
    private static readonly epub = 'assets/icons/epub.png';
    private static readonly pdf = 'assets/icons/pdf.png';
    private static readonly xcf = 'assets/icons/xcf.png';
    private static readonly zip = 'assets/icons/zip.png';
    private static readonly psd = 'assets/icons/psd.png';
    private static readonly sai = 'assets/icons/sai.png';
    private static readonly unknown = 'assets/icons/unknown.png';

    public static getAttachmentIcon(extension: string): string {
        switch (extension.toLowerCase()) {
            case 'epub':
                return this.epub;
            case 'pdf':
                return this.pdf;
            case 'xcf':
                return this.xcf;
            case 'zip':
                return this.zip;
            case 'sai':
                return this.sai;
            case 'psd':
                return this.psd;
            default:
                return this.unknown;
        }
    }
}
