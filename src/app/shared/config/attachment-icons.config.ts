export class AttachmentIconsConfig {
    private static epubAttachmentStrategy = 'assets/icons/epub.png';
    private static pdfAttachmentStrategy = 'assets/icons/pdf.png';
    private static xcfAttachmentStrategy = 'assets/icons/xcf.png';
    private static zipAttachmentStrategy = 'assets/icons/zip.png';
    private static psdAttachmentStrategy = 'assets/icons/psd.png';
    private static saiAttachmentStrategy = 'assets/icons/sai.png';
    private static unknownIcon = 'assets/icons/unknown.png';

    public static getAttachmentIcon(extension: string): string {
        switch (extension.toLowerCase()) {
            case 'epub':
                return this.epubAttachmentStrategy;
            case 'pdf':
                return this.pdfAttachmentStrategy;
            case 'xcf':
                return this.xcfAttachmentStrategy;
            case 'zip':
                return this.zipAttachmentStrategy;
            case 'sai':
                return this.saiAttachmentStrategy;
            case 'psd':
                return this.psdAttachmentStrategy;
            default:
                return this.unknownIcon;
        }
    }
}
