import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {LOCALE} from "@app/variables";

export const resources = {
    en: {
        translation: {
            "title": "title"
        }
    },
    ua: {
        translation: {
            "title": "Назва"
        }
    }
};

i18n.use(initReactI18next).init({
        resources,
        lng: LOCALE.EN,
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;