export class AttachmentIconsConfig {
    private static epub = 'assets/icons/epub.png';
    private static pdf = 'assets/icons/pdf.png';
    private static xcf = 'assets/icons/xcf.png';
    private static zip = 'assets/icons/zip.png';
    private static psd = 'assets/icons/psd.png';
    private static sai = 'assets/icons/sai.png';
    private static unknown = 'assets/icons/unknown.png';

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
