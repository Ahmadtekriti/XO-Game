// Define the language type
export type Language =
  | "en" // English
  | "ar" // Arabic

// Define the language names in their native language
export const languageNames: Record<Language, string> = {
  en: "English",
  ar: "العربية",
}

// Define the direction for each language
export const languageDirections: Record<Language, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
}

// Define the translations
const translations = {
  en: {
    // Game title and modes
    game_title: "TIC-TAC-TOE",
    game_mode: "PICK YOUR GAME",
    you_vs_ai: "YOU VS AI",
    you_vs_friend: "YOU VS FRIEND",
    start_challenge: "START CHALLENGE",
    reset_challenge: "RESET CHALLENGE",
    round_score: "SCORE",
    edit_name: "change name",
    ties: "Ties",
    next_round: "Round {round} of {countdown}",
    points: "Points",
    rank: "Rank",
    ai_challenge_board: "AI Challenge Board",
    no_entries_yet: "No entries yet. Be the first!",
    wins: "Wins",
    losses: "Losses",
    time: "Time",
    your_move: "YOUR MOVE",
    ai_thinking: "AI is thinking...",
    your_turn: "YOUR TURN",
    friends_turn: "FRIEND'S TURN",
    draw: "It's a Draw!",
    you_win: "You Win!",
    ai_wins: "AI Wins!",
    friend_wins: "Friend Wins!",
    new_game: "New game in {countdown}...",
    challenge_mode: "CHALLENGE MODE",
    calculating_score: "Calculating score in {countdown}...",
    next_round_button: "Next Round",
    skip_countdown: "Skip Countdown",
    challenge_complete: "CHALLENGE COMPLETE!",
    final_score: "Final Score",
    share_challenge: "Share Challenge",
    challenge_results: "Challenge Results",
    leaderboard_rank: "Leaderboard Rank",
    copy_clipboard: "Copy to Clipboard",
    share_includes_image: "(Includes image for social media)",
    challenge_friends: "Challenge Friends",
    challenge_friends_desc: "Copy the link or share directly to challenge your friends to beat your score!",
    copy_link: "Copy Link",
    share_device: "Share via Device",
    copied: "Copied!",
    challenge_received: "CHALLENGE RECEIVED!",
    round_challenge: "Round Challenge",
    target_score: "Target Score",
    beat_score: "Can you beat this score?",
    accept_challenge: "Accept Challenge",
    maybe_later: "Maybe Later",
    loading_leaderboard_data: "Loading leaderboard data...",
  },
  ar: {
    game_title: "إكس-أو",
    game_mode: "اختر وضع اللعب",
    you_vs_ai: "أنت ضد الذكاء الاصطناعي",
    you_vs_friend: "أنت ضد صديق",
    start_challenge: "ابدأ التحدي",
    reset_challenge: "إعادة تعيين التحدي",
    round_score: "النتيجة",
    edit_name: "تغيير الاسم",
    ties: "تعادلات",
    next_round: "الجولة {round} من {countdown}",
    points: "نقاط",
    rank: "الترتيب",
    ai_challenge_board: "لوحة تحدي الذكاء الاصطناعي",
    no_entries_yet: "لا توجد إدخالات بعد. كن الأول!",
    wins: "انتصارات",
    losses: "خسائر",
    time: "الوقت",
    your_move: "دورك",
    ai_thinking: "الذكاء الاصطناعي يفكر...",
    your_turn: "دورك",
    friends_turn: "دور الصديق",
    draw: "تعادل!",
    you_win: "لقد فزت!",
    ai_wins: "الذكاء الاصطناعي فاز!",
    friend_wins: "الصديق فاز!",
    new_game: "لعبة جديدة في {countdown}...",
    challenge_mode: "وضع التحدي",
    calculating_score: "حساب النتيجة في {countdown}...",
    next_round_button: "الجولة التالية",
    skip_countdown: "تخطي العد التنازلي",
    challenge_complete: "اكتمل التحدي!",
    final_score: "النتيجة النهائية",
    share_challenge: "مشاركة التحدي",
    challenge_results: "نتائج التحدي",
    leaderboard_rank: "ترتيب لوحة المتصدرين",
    copy_clipboard: "نسخ إلى الحافظة",
    share_includes_image: "(يتضمن صورة لوسائل التواصل الاجتماعي)",
    challenge_friends: "تحدي الأصدقاء",
    challenge_friends_desc: "انسخ الرابط أو شاركه مباشرة لتحدي أصدقائك للتغلب على نتيجتك!",
    copy_link: "نسخ الرابط",
    share_device: "مشاركة عبر الجهاز",
    copied: "تم النسخ!",
    challenge_received: "تم استلام التحدي!",
    round_challenge: "تحدي الجولة",
    target_score: "النتيجة المستهدفة",
    beat_score: "هل يمكنك التغلب على هذه النتيجة؟",
    accept_challenge: "قبول التحدي",
    maybe_later: "ربما لاحقًا",
    loading_leaderboard_data: "جاري تحميل بيانات لوحة المتصدرين...",
  },
}

// Helper function to get a translation
export function getTranslation(lang: Language, key: string, replacements?: Record<string, string | number>): string {
  let translation = translations[lang][key as keyof typeof translations.en] || key

  if (replacements) {
    for (const [placeholder, value] of Object.entries(replacements)) {
      translation = translation.replace(`{${placeholder}}`, String(value))
    }
  }

  return translation
}
