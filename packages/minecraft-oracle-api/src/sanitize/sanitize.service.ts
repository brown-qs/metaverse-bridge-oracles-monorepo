import { Injectable } from '@nestjs/common';
import xss from 'xss';


export enum TextNormalizationMode {
    NFKC = "NFKC",
    NFC = "NFC"
}
export type SanitizeOptions = {
    textNormalizationMode: TextNormalizationMode,
    removeNewlineAndTab: boolean //new lines and tabs
    removeControlCharacters: boolean
    removeEmoji: boolean
    removeXss: boolean
    removeWhitespaceBeforeAfter: boolean
}

@Injectable()
export class SanitizeService {

    public sanitize(s: string, sanitizeOptions: SanitizeOptions) {

        let str = s.normalize(sanitizeOptions.textNormalizationMode)
        if (sanitizeOptions.removeControlCharacters === true) {
            //0009 - tab ; 000A new line
            str = str.replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F\u200B\u200E]/g, "")
        }

        if (sanitizeOptions.removeNewlineAndTab === true) {
            str = str.replace(/[\u0009-\u000A]/g, "")
        }

        if (sanitizeOptions.removeEmoji === true) {
            str = str.replace(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g, "")
        }

        if (sanitizeOptions.removeXss === true) {
            str = str.replace(/(<([^>]+)>)/ig, "")
            str = xss(str, {
                whiteList: {}, // empty, means filter out all tags
                stripIgnoreTag: true, // filter out all HTML not in the whitelist
                stripIgnoreTagBody: ["script"], // the script tag is a special case, we need
                // to filter out its content
            })
        }

        if (sanitizeOptions.removeWhitespaceBeforeAfter === true) {
            str = str.trim()
        }

        return str
    }
}
