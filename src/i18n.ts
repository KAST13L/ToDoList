import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import {Locale} from "@app/common/enum/common.enums";

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
    lng: Locale.Eng,
    interpolation: {
        escapeValue: false
    }
});

export default i18n;