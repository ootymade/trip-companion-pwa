import type { Locale } from "./locales";

// Static UI chrome only (nav, banner scaffolding, language switcher) —
// written directly in code, not stored in the `translations` table. An
// engineer wrote and reviewed these by committing them, so they don't need
// the needs_review workflow that gates dynamic content (today_status,
// content_documents). Branded/specific terms (E-Pass, Toy Train, OotyMade)
// are deliberately left in English across all locales, matching common
// practice in Indian tourism UI — translating a named thing's own name
// tends to confuse more than it helps.
//
// Disclosure: these translations were drafted by this session, not yet
// checked by a native speaker. Fine for UI chrome ("Explore", "Language")
// where a slightly-off word choice can't cause harm; get a native speaker
// to proof them before relying on this for anything more sensitive than
// navigation labels.
export interface Dictionary {
  siteName: string;
  nav: {
    home: string;
    ePass: string;
    toyTrain: string;
    explore: string;
    plan: string;
    travel: string;
    trekking: string;
    eatAndShop: string;
    ask: string;
    utilities: string;
  };
  home: {
    heading: string;
    subheading: string;
  };
  languageSwitcher: {
    label: string;
  };
  footer: {
    tagline: string;
    bookATrip: string;
  };
  statusBanner: {
    heading: string;
    noAlerts: string;
    updated: string;
    offline: string;
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    siteName: "OotyMade Trip Companion",
    nav: {
      home: "Home",
      ePass: "E-Pass",
      toyTrain: "Toy Train",
      explore: "Explore",
      plan: "Plan",
      travel: "Travel",
      trekking: "Trekking",
      eatAndShop: "Eat & Shop",
      ask: "Ask",
      utilities: "Utilities",
    },
    home: {
      heading: "Your Ooty trip, one link.",
      subheading:
        "No app to download. E-Pass steps, toy train timings, real attraction hours, a trip planner and an AI concierge — open it, use it, share the exact page you need with whoever you're travelling with.",
    },
    languageSwitcher: { label: "Language" },
    footer: {
      tagline: "14 years in the Nilgiris.",
      bookATrip: "Book a trip",
    },
    statusBanner: {
      heading: "Today in Ooty",
      noAlerts: "No alerts reported today.",
      updated: "Updated",
      offline: "You are offline — showing the last update we have.",
    },
  },
  ta: {
    siteName: "OotyMade Trip Companion",
    nav: {
      home: "முகப்பு",
      ePass: "E-Pass",
      toyTrain: "Toy Train",
      explore: "சுற்றுலா",
      plan: "திட்டம்",
      travel: "பயணம்",
      trekking: "மலை ஏற்றம்",
      eatAndShop: "உணவு & கடை",
      ask: "கேளுங்கள்",
      utilities: "பயன்பாடுகள்",
    },
    home: {
      heading: "உங்கள் ஊட்டி பயணம், ஒரே இணைப்பில்.",
      subheading:
        "ஆப் தேவையில்லை. E-Pass படிகள், Toy Train நேரங்கள், சுற்றுலா நேரங்கள், பயணத் திட்டமிடல் மற்றும் AI உதவியாளர் — திறந்து பயன்படுத்துங்கள், உங்களுடன் பயணிப்பவர்களுடன் தேவையான பக்கத்தை பகிருங்கள்.",
    },
    languageSwitcher: { label: "மொழி" },
    footer: {
      tagline: "நீலகிரியில் 14 ஆண்டுகள்.",
      bookATrip: "பயணம் பதிவு செய்யுங்கள்",
    },
    statusBanner: {
      heading: "இன்று ஊட்டியில்",
      noAlerts: "இன்று எந்த எச்சரிக்கையும் இல்லை.",
      updated: "புதுப்பிக்கப்பட்டது",
      offline: "நீங்கள் ஆஃப்லைனில் உள்ளீர்கள் — கிடைத்த கடைசி தகவலைக் காட்டுகிறோம்.",
    },
  },
  hi: {
    siteName: "OotyMade Trip Companion",
    nav: {
      home: "होम",
      ePass: "E-Pass",
      toyTrain: "Toy Train",
      explore: "घूमें",
      plan: "योजना",
      travel: "यात्रा",
      trekking: "ट्रेकिंग",
      eatAndShop: "खाना-पीना & खरीदारी",
      ask: "पूछें",
      utilities: "ज़रूरी सेवाएं",
    },
    home: {
      heading: "आपकी ऊटी यात्रा, एक ही लिंक में।",
      subheading:
        "कोई ऐप डाउनलोड करने की ज़रूरत नहीं। E-Pass के चरण, Toy Train का समय, पर्यटन स्थलों के खुलने का समय, यात्रा योजना और एक AI सहायक — खोलें, इस्तेमाल करें, और साथ यात्रा कर रहे लोगों के साथ ज़रूरी पेज साझा करें।",
    },
    languageSwitcher: { label: "भाषा" },
    footer: {
      tagline: "नीलगिरी में 14 साल।",
      bookATrip: "यात्रा बुक करें",
    },
    statusBanner: {
      heading: "आज ऊटी में",
      noAlerts: "आज कोई अलर्ट नहीं है।",
      updated: "अपडेट किया गया",
      offline: "आप ऑफ़लाइन हैं — आख़िरी उपलब्ध जानकारी दिखाई जा रही है।",
    },
  },
  ml: {
    siteName: "OotyMade Trip Companion",
    nav: {
      home: "ഹോം",
      ePass: "E-Pass",
      toyTrain: "Toy Train",
      explore: "കാണാനുള്ളവ",
      plan: "പ്ലാൻ",
      travel: "യാത്ര",
      trekking: "ട്രെക്കിംഗ്",
      eatAndShop: "ഭക്ഷണം & ഷോപ്പിംഗ്",
      ask: "ചോദിക്കൂ",
      utilities: "ഉപകാരപ്രദമായവ",
    },
    home: {
      heading: "നിങ്ങളുടെ ഊട്ടി യാത്ര, ഒരു ലിങ്കിൽ.",
      subheading:
        "ആപ്പ് ഡൗൺലോഡ് ചെയ്യേണ്ടതില്ല. E-Pass ഘട്ടങ്ങൾ, Toy Train സമയം, സന്ദർശന സ്ഥല സമയം, യാത്രാ പ്ലാനർ, AI സഹായി — തുറന്ന് ഉപയോഗിക്കൂ, ഒപ്പമുള്ളവരുമായി വേണ്ട പേജ് പങ്കിടൂ.",
    },
    languageSwitcher: { label: "ഭാഷ" },
    footer: {
      tagline: "നീലഗിരിയിൽ 14 വർഷം.",
      bookATrip: "യാത്ര ബുക്ക് ചെയ്യൂ",
    },
    statusBanner: {
      heading: "ഇന്ന് ഊട്ടിയിൽ",
      noAlerts: "ഇന്ന് മുന്നറിയിപ്പുകൾ ഇല്ല.",
      updated: "പുതുക്കിയത്",
      offline: "നിങ്ങൾ ഓഫ്‌ലൈനിലാണ് — ലഭ്യമായ അവസാന വിവരം കാണിക്കുന്നു.",
    },
  },
  kn: {
    siteName: "OotyMade Trip Companion",
    nav: {
      home: "ಮುಖಪುಟ",
      ePass: "E-Pass",
      toyTrain: "Toy Train",
      explore: "ಅನ್ವೇಷಿಸಿ",
      plan: "ಯೋಜನೆ",
      travel: "ಪ್ರಯಾಣ",
      trekking: "ಟ್ರೆಕ್ಕಿಂಗ್",
      eatAndShop: "ಊಟ & ಶಾಪಿಂಗ್",
      ask: "ಕೇಳಿ",
      utilities: "ಉಪಯುಕ್ತ ಸೇವೆಗಳು",
    },
    home: {
      heading: "ನಿಮ್ಮ ಊಟಿ ಪ್ರಯಾಣ, ಒಂದೇ ಲಿಂಕ್‌ನಲ್ಲಿ.",
      subheading:
        "ಆಪ್ ಡೌನ್‌ಲೋಡ್ ಬೇಕಿಲ್ಲ. E-Pass ಹಂತಗಳು, Toy Train ಸಮಯ, ಪ್ರೇಕ್ಷಣೀಯ ಸ್ಥಳಗಳ ಸಮಯ, ಪ್ರಯಾಣ ಯೋಜಕ ಮತ್ತು AI ಸಹಾಯಕ — ತೆರೆಯಿರಿ, ಬಳಸಿ, ಜೊತೆ ಪ್ರಯಾಣಿಸುವವರಿಗೆ ಬೇಕಾದ ಪುಟವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ.",
    },
    languageSwitcher: { label: "ಭಾಷೆ" },
    footer: {
      tagline: "ನೀಲಗಿರಿಯಲ್ಲಿ 14 ವರ್ಷಗಳು.",
      bookATrip: "ಪ್ರಯಾಣ ಬುಕ್ ಮಾಡಿ",
    },
    statusBanner: {
      heading: "ಇಂದು ಊಟಿಯಲ್ಲಿ",
      noAlerts: "ಇಂದು ಯಾವುದೇ ಎಚ್ಚರಿಕೆಗಳಿಲ್ಲ.",
      updated: "ಅಪ್‌ಡೇಟ್ ಆಗಿದೆ",
      offline: "ನೀವು ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿದ್ದೀರಿ — ಕೊನೆಯ ಲಭ್ಯ ಮಾಹಿತಿ ತೋರಿಸಲಾಗುತ್ತಿದೆ.",
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
