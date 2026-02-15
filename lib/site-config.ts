/** Site-wide contact and legal info */

export const SITE_NAME = "PodScript";

/** Canonical base URL for SEO (no trailing slash) */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pod-script.vercel.app";

export const SUPPORT_WHATSAPP = "+971 50 608 63 90";
const WHATSAPP_NUMBER = SUPPORT_WHATSAPP.replace(/\s/g, "").replace(/^\+/, "");
export const SUPPORT_WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

export const SUPPORT_EMAIL = "memetali159@gmail.com";
export const SUPPORT_EMAIL_LINK = `mailto:${SUPPORT_EMAIL}`;

/** Pre-filled messages for feedback */
const enc = encodeURIComponent;
export const BUG_REPORT_EMAIL_SUBJECT = "Bug Report - PodScript";
export const BUG_REPORT_EMAIL_LINK = `mailto:${SUPPORT_EMAIL}?subject=${enc(BUG_REPORT_EMAIL_SUBJECT)}`;
export const BUG_REPORT_WHATSAPP_TEXT = "Hi, I'd like to report a bug on PodScript:\n\n[Describe the issue here]";
export const BUG_REPORT_WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${enc(BUG_REPORT_WHATSAPP_TEXT)}`;

export const FEATURE_REQUEST_EMAIL_SUBJECT = "Feature Request - PodScript";
export const FEATURE_REQUEST_EMAIL_LINK = `mailto:${SUPPORT_EMAIL}?subject=${enc(FEATURE_REQUEST_EMAIL_SUBJECT)}`;
export const FEATURE_REQUEST_WHATSAPP_TEXT = "Hi, I'd like to suggest a feature for PodScript:\n\n[Describe the feature you need here]";
export const FEATURE_REQUEST_WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${enc(FEATURE_REQUEST_WHATSAPP_TEXT)}`;
