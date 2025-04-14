// Define the language type
export type Language =
  | "en" // English
  | "ar" // Arabic
  | "zh" // Chinese (Mandarin)
  | "es" // Spanish
  | "hi" // Hindi
  | "fr" // French
  | "pt" // Portuguese
  | "bn" // Bengali
  | "ru" // Russian
  | "ja" // Japanese

// Define the language names in their native language
export const languageNames: Record<Language, string> = {
  en: "English",
  ar: "العربية",
  zh: "中文",
  es: "Español",
  hi: "हिन्दी",
  fr: "Français",
  pt: "Português",
  bn: "বাংলা",
  ru: "Русский",
  ja: "日本語",
}

// Define the direction for each language
export const languageDirections: Record<Language, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
  zh: "ltr",
  es: "ltr",
  hi: "ltr",
  fr: "ltr",
  pt: "ltr",
  bn: "ltr",
  ru: "ltr",
  ja: "ltr",
}

// Define the translations
export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Game title and modes
    game_title: "CAN YOU BEAT THE AI?",
    game_mode: "PICK YOUR GAME",
    you_vs_ai: "YOU VS AI",
    you_vs_friend: "YOU VS FRIEND",
    start_challenge: "START CHALLENGE",
    reset_challenge: "RESTART",
    round_score: "SCORE",
    edit_name: "change name",
    points: "Points",
    rank: "Rank",
    time: "Time",

    // Game status
    ai_thinking: "AI IS THINKING...",
    your_turn: "YOUR MOVE",
    friends_turn: "FRIEND'S MOVE",
    challenge_mode: "CHALLENGE MODE",
    you_win: "🏆 YOU WIN! 🏆",
    ai_wins: "🤖 AI WINS! 🤖",
    friend_wins: "🏆 FRIEND WINS! 🏆",
    draw: "🔄 IT'S A DRAW! 🔄",
    challenge_complete: "CHALLENGE DONE!",
    final_score: "Your Score",
    next_round: "Round {round} in {countdown}...",
    calculating_score: "Tallying score in {countdown}...",
    new_game: "New game in {countdown}...",
    next_round_button: "NEXT ROUND",
    skip_countdown: "SKIP",

    // Share
    share: "Share",
    share_challenge: "Share Challenge",
    challenge_friends: "Challenge Friends",
    challenge_friends_desc: "Think your friends can beat you? Share this link and let them try!",
    copy_link: "Copy Link",
    copied: "Copied!",
    share_device: "Share via Device",
    maybe_later: "Not Now",
    share_includes_image: "Sharing includes a score card image",

    // Challenge modal
    challenge_received: "You've Been Challenged!",
    round_challenge: "5-Round Challenge",
    target_score: "Target Score",
    beat_score: "Beat this score to win!",
    accept_challenge: "ACCEPT CHALLENGE",

    // Results
    challenge_results: "Your Results",
    wins: "Wins",
    ties: "Ties",
    losses: "Losses",
    leaderboard_rank: "Your Rank",
    copy_clipboard: "Copy to Clipboard",
    play_again: "Play Again",

    // Language
    select_language: "Language",

    // Leaderboard
    no_entries_yet: "No entries yet. Play against AI to appear on the leaderboard!",
  },
  ar: {
    // Game title and modes
    game_title: "هل تقدر تهزم الذكاء الاصطناعي؟",
    game_mode: "نوع اللعبة",
    you_vs_ai: "أنت ضد الذكاء الاصطناعي",
    you_vs_friend: "أنت ضد صديقك",
    start_challenge: "ابدأ التحدي",
    reset_challenge: "إعادة التحدي",
    round_score: "النتيجة",
    edit_name: "تغيير الاسم",
    points: "النقاط",
    rank: "المرتبة",
    time: "الوقت",

    // Game status
    ai_thinking: "الذكاء الاصطناعي يفكر...",
    your_turn: "دورك",
    friends_turn: "دور صديقك",
    challenge_mode: "وضع التحدي",
    you_win: "🏆 فزت! 🏆",
    ai_wins: "🤖 فاز الذكاء الاصطناعي! 🤖",
    friend_wins: "🏆 فاز صديقك! 🏆",
    draw: "🔄 تعادل! 🔄",
    challenge_complete: "انتهى التحدي!",
    final_score: "النتيجة النهائية",
    next_round: "الجولة {round} في {countdown}...",
    calculating_score: "حساب النتيجة في {countdown}...",
    new_game: "لعبة جديدة في {countdown}...",
    next_round_button: "الجولة التالية",
    skip_countdown: "تخطي",

    // Share
    share: "مشاركة",
    share_challenge: "شارك التحدي",
    challenge_friends: "تحدى أصدقاءك",
    challenge_friends_desc: "تحدى أصدقاءك للفوز عليك في لعبة إكس-أو! شارك هذا الرابط معهم.",
    copy_link: "نسخ الرابط",
    copied: "تم النسخ!",
    share_device: "مشاركة عبر الجهاز",
    maybe_later: "لاحقاً",
    share_includes_image: "المشاركة تتضمن صورة بطاقة النتيجة",

    // Challenge modal
    challenge_received: "وصلك تحدي!",
    round_challenge: "تحدي 5 جولات",
    target_score: "النتيجة المطلوبة",
    beat_score: "اهزم هذه النتيجة للفوز!",
    accept_challenge: "قبول التحدي",

    // Results
    challenge_results: "نتائج التحدي",
    wins: "فوز",
    ties: "تعادل",
    losses: "خسارة",
    leaderboard_rank: "ترتيبك",
    copy_clipboard: "نسخ",
    play_again: "العب مرة أخرى",

    // Language
    select_language: "اللغة",
  },
  zh: {
    // Game title and modes
    game_title: "你能打败AI吗？",
    game_mode: "游戏模式",
    you_vs_ai: "你 VS AI",
    you_vs_friend: "你 VS 朋友",
    start_challenge: "开始挑战",
    reset_challenge: "重置挑战",
    round_score: "分数",
    edit_name: "改名",
    points: "积分",
    rank: "排名",
    time: "时间",

    // Game status
    ai_thinking: "AI思考中...",
    your_turn: "该你了",
    friends_turn: "该朋友了",
    challenge_mode: "挑战模式",
    you_win: "🏆 你赢了！ 🏆",
    ai_wins: "🤖 AI赢了！ 🤖",
    friend_wins: "🏆 朋友赢了！ 🏆",
    draw: "🔄 平局！ 🔄",
    challenge_complete: "挑战完成！",
    final_score: "最终得分",
    next_round: "第 {round} 回合 {countdown} 秒后开始...",
    calculating_score: "计算得分中 {countdown}...",
    new_game: "新游戏 {countdown} 秒后开始...",
    next_round_button: "下一回合",
    skip_countdown: "跳过",

    // Share
    share: "分享",
    share_challenge: "分享挑战",
    challenge_friends: "挑战朋友",
    challenge_friends_desc: "挑战你的朋友在井字游戏中击败你！分享这个链接给他们。",
    copy_link: "复制链接",
    copied: "已复制！",
    share_device: "通过设备分享",
    maybe_later: "稍后再说",
    share_includes_image: "分享包含得分卡图片",

    // Challenge modal
    challenge_received: "收到挑战！",
    round_challenge: "5回合挑战",
    target_score: "目标分数",
    beat_score: "超过这个分数就赢了！",
    accept_challenge: "接受挑战",

    // Results
    challenge_results: "挑战结果",
    wins: "胜",
    ties: "平",
    losses: "负",
    leaderboard_rank: "排行榜排名",
    copy_clipboard: "复制",
    play_again: "再玩一次",

    // Language
    select_language: "语言",
  },
  es: {
    // Game title and modes
    game_title: "¿PUEDES GANARLE A LA IA?",
    game_mode: "MODO DE JUEGO",
    you_vs_ai: "TÚ VS IA",
    you_vs_friend: "TÚ VS AMIGO",
    start_challenge: "INICIAR RETO",
    reset_challenge: "REINICIAR",
    round_score: "PUNTOS",
    edit_name: "cambiar nombre",
    points: "Puntos",
    rank: "Puesto",
    time: "Tiempo",

    // Game status
    ai_thinking: "IA PENSANDO...",
    your_turn: "TU TURNO",
    friends_turn: "TURNO DE TU AMIGO",
    challenge_mode: "MODO RETO",
    you_win: "🏆 ¡GANASTE! 🏆",
    ai_wins: "🤖 ¡GANÓ LA IA! 🤖",
    friend_wins: "🏆 ¡GANÓ TU AMIGO! 🏆",
    draw: "🔄 ¡EMPATE! 🔄",
    challenge_complete: "¡RETO COMPLETADO!",
    final_score: "Puntuación Final",
    next_round: "Ronda {round} en {countdown}...",
    calculating_score: "Calculando puntos en {countdown}...",
    new_game: "Nuevo juego en {countdown}...",
    next_round_button: "SIGUIENTE",
    skip_countdown: "SALTAR",

    // Share
    share: "Compartir",
    share_challenge: "Compartir Reto",
    challenge_friends: "Reta a tus Amigos",
    challenge_friends_desc: "¡Reta a tus amigos a ganarte en el Tres en Raya! Comparte este enlace con ellos.",
    copy_link: "Copiar Link",
    copied: "¡Copiado!",
    share_device: "Compartir",
    maybe_later: "Quizás Después",
    share_includes_image: "Compartir incluye una imagen de la tarjeta de puntuación",

    // Challenge modal
    challenge_received: "¡Reto Recibido!",
    round_challenge: "Reto de 5 Rondas",
    target_score: "Puntuación Objetivo",
    beat_score: "¡Supera esta puntuación para ganar!",
    accept_challenge: "ACEPTAR RETO",

    // Results
    challenge_results: "Resultados del Reto",
    wins: "Victorias",
    ties: "Empates",
    losses: "Derrotas",
    leaderboard_rank: "Posición",
    copy_clipboard: "Copiar",
    play_again: "Jugar de Nuevo",

    // Language
    select_language: "Idioma",
  },
  hi: {
    // Game title and modes
    game_title: "क्या आप AI को हरा सकते हैं?",
    game_mode: "गेम मोड",
    you_vs_ai: "आप vs AI",
    you_vs_friend: "आप vs दोस्त",
    start_challenge: "चैलेंज शुरू करें",
    reset_challenge: "रीसेट करें",
    round_score: "स्कोर",
    edit_name: "नाम बदलें",
    points: "अंक",
    rank: "रैंक",
    time: "समय",

    // Game status
    ai_thinking: "AI सोच रहा है...",
    your_turn: "आपकी बारी",
    friends_turn: "दोस्त की बारी",
    challenge_mode: "चैलेंज मोड",
    you_win: "🏆 आप जीत गए! 🏆",
    ai_wins: "🤖 AI जीत गया! 🤖",
    friend_wins: "🏆 दोस्त जीत गया! 🏆",
    draw: "🔄 ड्रॉ! 🔄",
    challenge_complete: "चैलेंज पूरा!",
    final_score: "फाइनल स्कोर",
    next_round: "राउंड {round} {countdown} में...",
    calculating_score: "स्कोर की गणना {countdown} में...",
    new_game: "नया गेम {countdown} में...",
    next_round_button: "अगला राउंड",
    skip_countdown: "स्किप",

    // Share
    share: "शेयर",
    share_challenge: "चैलेंज शेयर करें",
    challenge_friends: "दोस्तों को चैलेंज करें",
    challenge_friends_desc: "अपने दोस्तों को टिक-टैक-टो में आपको हराने की चुनौती दें! उनके साथ यह लिंक शेयर करें।",
    copy_link: "लिंक कॉपी करें",
    copied: "कॉपी हो गया!",
    share_device: "डिवाइस से शेयर करें",
    maybe_later: "बाद में",
    share_includes_image: "शेयर करने में स्कोर कार्ड इमेज शामिल है",

    // Challenge modal
    challenge_received: "चैलेंज मिला!",
    round_challenge: "5-राउंड चैलेंज",
    target_score: "टारगेट स्कोर",
    beat_score: "जीतने के लिए इस स्कोर को हराएं!",
    accept_challenge: "चैलेंज स्वीकार करें",

    // Results
    challenge_results: "चैलेंज के नतीजे",
    wins: "जीत",
    ties: "टाई",
    losses: "हार",
    leaderboard_rank: "लीडरबोर्ड रैंक",
    copy_clipboard: "कॉपी करें",
    play_again: "फिर से खेलें",

    // Language
    select_language: "भाषा",
  },
  fr: {
    // Game title and modes
    game_title: "TU PEUX BATTRE L'IA ?",
    game_mode: "MODE DE JEU",
    you_vs_ai: "TOI VS IA",
    you_vs_friend: "TOI VS AMI",
    start_challenge: "DÉMARRER DÉFI",
    reset_challenge: "RECOMMENCER",
    round_score: "SCORE",
    edit_name: "changer nom",
    points: "Points",
    rank: "Rang",
    time: "Temps",

    // Game status
    ai_thinking: "L'IA RÉFLÉCHIT...",
    your_turn: "TON TOUR",
    friends_turn: "TOUR DE TON AMI",
    challenge_mode: "MODE DÉFI",
    you_win: "🏆 TU GAGNES ! 🏆",
    ai_wins: "🤖 L'IA GAGNE ! 🤖",
    friend_wins: "🏆 TON AMI GAGNE ! 🏆",
    draw: "🔄 ÉGALITÉ ! 🔄",
    challenge_complete: "DÉFI TERMINÉ !",
    final_score: "Score Final",
    next_round: "Tour {round} dans {countdown}...",
    calculating_score: "Calcul du score dans {countdown}...",
    new_game: "Nouvelle partie dans {countdown}...",
    next_round_button: "SUIVANT",
    skip_countdown: "PASSER",

    // Share
    share: "Partager",
    share_challenge: "Partager le Défi",
    challenge_friends: "Défie tes Amis",
    challenge_friends_desc: "Défie tes amis de te battre au Morpion ! Partage ce lien avec eux.",
    copy_link: "Copier le Lien",
    copied: "Copié !",
    share_device: "Partager",
    maybe_later: "Plus Tard",
    share_includes_image: "Le partage inclut une image de la carte de score",

    // Challenge modal
    challenge_received: "Défi Reçu !",
    round_challenge: "Défi 5 Tours",
    target_score: "Score Cible",
    beat_score: "Bats ce score pour gagner !",
    accept_challenge: "ACCEPTER DÉFI",

    // Results
    challenge_results: "Résultats du Défi",
    wins: "Victoires",
    ties: "Égalités",
    losses: "Défaites",
    leaderboard_rank: "Classement",
    copy_clipboard: "Copier",
    play_again: "Rejouer",

    // Language
    select_language: "Langue",
  },
  pt: {
    // Game title and modes
    game_title: "CONSEGUE VENCER A IA?",
    game_mode: "MODO DE JOGO",
    you_vs_ai: "VOCÊ VS IA",
    you_vs_friend: "VOCÊ VS AMIGO",
    start_challenge: "INICIAR DESAFIO",
    reset_challenge: "REINICIAR",
    round_score: "PONTOS",
    edit_name: "mudar nome",
    points: "Pontos",
    rank: "Posição",
    time: "Tempo",

    // Game status
    ai_thinking: "IA PENSANDO...",
    your_turn: "SUA VEZ",
    friends_turn: "VEZ DO SEU AMIGO",
    challenge_mode: "MODO DESAFIO",
    you_win: "🏆 VOCÊ VENCEU! 🏆",
    ai_wins: "🤖 A IA VENCEU! 🤖",
    friend_wins: "🏆 SEU AMIGO VENCEU! 🏆",
    draw: "🔄 EMPATE! 🔄",
    challenge_complete: "DESAFIO COMPLETO!",
    final_score: "Pontuação Final",
    next_round: "Rodada {round} em {countdown}...",
    calculating_score: "Calculando pontos em {countdown}...",
    new_game: "Novo jogo em {countdown}...",
    next_round_button: "PRÓXIMA",
    skip_countdown: "PULAR",

    // Share
    share: "Compartilhar",
    share_challenge: "Compartilhar Desafio",
    challenge_friends: "Desafie seus Amigos",
    challenge_friends_desc: "Desafie seus amigos a te vencer no Jogo da Velha! Compartilhe este link com eles.",
    copy_link: "Copiar Link",
    copied: "Copiado!",
    share_device: "Compartilhar",
    maybe_later: "Depois",
    share_includes_image: "O compartilhamento inclui uma imagem do cartão de pontuação",

    // Challenge modal
    challenge_received: "Desafio Recebido!",
    round_challenge: "Desafio de 5 Rodadas",
    target_score: "Pontuação Alvo",
    beat_score: "Supere esta pontuação para vencer!",
    accept_challenge: "ACEITAR DESAFIO",

    // Results
    challenge_results: "Resultados do Desafio",
    wins: "Vitórias",
    ties: "Empates",
    losses: "Derrotas",
    leaderboard_rank: "Posição no Ranking",
    copy_clipboard: "Copiar",
    play_again: "Jogar Novamente",

    // Language
    select_language: "Idioma",
  },
  bn: {
    // Game title and modes
    game_title: "আপনি কি AI কে হারাতে পারবেন?",
    game_mode: "গেম মোড",
    you_vs_ai: "আপনি vs AI",
    you_vs_friend: "আপনি vs বন্ধু",
    start_challenge: "চ্যালেঞ্জ শুরু",
    reset_challenge: "রিসেট",
    round_score: "স্কোর",
    edit_name: "নাম বদলান",
    points: "পয়েন্ট",
    rank: "র‍্যাঙ্ক",
    time: "সময়",

    // Game status
    ai_thinking: "AI ভাবছে...",
    your_turn: "আপনার পালা",
    friends_turn: "বন্ধুর পালা",
    challenge_mode: "চ্যালেঞ্জ মোড",
    you_win: "🏆 আপনি জিতেছেন! 🏆",
    ai_wins: "🤖 AI জিতেছে! 🤖",
    friend_wins: "🏆 বন্ধু জিতেছে! 🏆",
    draw: "🔄 ড্র! 🔄",
    challenge_complete: "চ্যালেঞ্জ শেষ!",
    final_score: "ফাইনাল স্কোর",
    next_round: "রাউন্ড {round} {countdown} এ...",
    calculating_score: "স্কোর হিসাব হচ্ছে {countdown} এ...",
    new_game: "নতুন গেম {countdown} এ...",
    next_round_button: "পরের রাউন্ড",
    skip_countdown: "স্কিপ",

    // Share
    share: "শেয়ার",
    share_challenge: "চ্যালেঞ্জ শেয়ার",
    challenge_friends: "বন্ধুদের চ্যালেঞ্জ করুন",
    challenge_friends_desc: "বন্ধুদের টিক-ট্যাক-টো তে আপনাকে হারাতে চ্যালেঞ্জ করুন! এই লিঙ্ক শেয়ার করুন।",
    copy_link: "লিঙ্ক কপি",
    copied: "কপি হয়েছে!",
    share_device: "ডিভাইস থেকে শেয়ার",
    maybe_later: "পরে",
    share_includes_image: "শেয়ারিং-এ স্কোর কার্ডের ছবি যুক্ত করা হয়েছে",

    // Challenge modal
    challenge_received: "চ্যালেঞ্জ পেয়েছেন!",
    round_challenge: "5-রাউন্ড চ্যালেঞ্জ",
    target_score: "টার্গেট স্কোর",
    beat_score: "জিততে এই স্কোর ছাড়িয়ে যান!",
    accept_challenge: "চ্যালেঞ্জ নিন",

    // Results
    challenge_results: "চ্যালেঞ্জের ফলাফল",
    wins: "জয়",
    ties: "ড্র",
    losses: "হার",
    leaderboard_rank: "লিডারবোর্ড র‍্যাঙ্ক",
    copy_clipboard: "কপি",
    play_again: "আবার খেলুন",

    // Language
    select_language: "ভাষা",
  },
  ru: {
    // Game title and modes
    game_title: "СМОЖЕШЬ ПОБЕДИТЬ ИИ?",
    game_mode: "РЕЖИМ ИГРЫ",
    you_vs_ai: "ТЫ ПРОТИВ ИИ",
    you_vs_friend: "ТЫ ПРОТИВ ДРУГА",
    start_challenge: "НАЧАТЬ ВЫЗОВ",
    reset_challenge: "СБРОСИТЬ",
    round_score: "СЧЁТ",
    edit_name: "изменить имя",
    points: "Очки",
    rank: "Ранг",
    time: "Время",

    // Game status
    ai_thinking: "ИИ ДУМАЕТ...",
    your_turn: "ТВОЙ ХОД",
    friends_turn: "ХОД ДРУГА",
    challenge_mode: "РЕЖИМ ВЫЗОВА",
    you_win: "🏆 ТЫ ВЫИГРАЛ! 🏆",
    ai_wins: "🤖 ИИ ВЫИГРАЛ! 🤖",
    friend_wins: "🏆 ДРУГ ВЫИГРАЛ! 🏆",
    draw: "🔄 НИЧЬЯ! 🔄",
    challenge_complete: "ВЫЗОВ ЗАВЕРШЕН!",
    final_score: "Итоговый Счет",
    next_round: "Раунд {round} через {countdown}...",
    calculating_score: "Подсчет очков через {countdown}...",
    new_game: "Новая игра через {countdown}...",
    next_round_button: "ДАЛЬШЕ",
    skip_countdown: "ПРОПУСТИТЬ",

    // Share
    share: "Поделиться",
    share_challenge: "Поделиться Вызовом",
    challenge_friends: "Вызови Друзей",
    challenge_friends_desc: "Брось вызов друзьям победить тебя в Крестики-нолики! Поделись с ними этой ссылкой.",
    copy_link: "Копировать Ссылку",
    copied: "Скопировано!",
    share_device: "Поделиться",
    maybe_later: "Позже",
    share_includes_image: "Совместное использование включает изображение карточки результатов",

    // Challenge modal
    challenge_received: "Вызов Получен!",
    round_challenge: "Вызов на 5 Раундов",
    target_score: "Целевой Счет",
    beat_score: "Побей этот счет, чтобы выиграть!",
    accept_challenge: "ПРИНЯТЬ ВЫЗОВ",

    // Results
    challenge_results: "Результаты Вызова",
    wins: "Победы",
    ties: "Ничьи",
    losses: "Поражения",
    leaderboard_rank: "Место в Таблице",
    copy_clipboard: "Копировать",
    play_again: "Играть Снова",

    // Language
    select_language: "Язык",
  },
  ja: {
    // Game title and modes
    game_title: "AIに勝てる？",
    game_mode: "ゲームモード",
    you_vs_ai: "あなたvsAI",
    you_vs_friend: "あなたvs友達",
    start_challenge: "チャレンジ開始",
    reset_challenge: "リセット",
    round_score: "スコア",
    edit_name: "名前変更",
    points: "ポイント",
    rank: "ランク",
    time: "タイム",

    // Game status
    ai_thinking: "AI考え中...",
    your_turn: "あなたの番",
    friends_turn: "友達の番",
    challenge_mode: "チャレンジモード",
    you_win: "🏆 あなたの勝ち！ 🏆",
    ai_wins: "🤖 AIの勝ち！ 🤖",
    friend_wins: "🏆 友達の勝ち！ 🏆",
    draw: "🔄 引き分け！ 🔄",
    challenge_complete: "チャレンジ完了！",

    final_score: "最終スコア",
    next_round: "ラウンド{round}まで{countdown}...",
    calculating_score: "スコア計算中 {countdown}...",
    new_game: "新しいゲームまで{countdown}...",
    next_round_button: "次へ",
    skip_countdown: "スキップ",

    // Share
    share: "シェア",
    share_challenge: "チャレンジをシェア",
    challenge_friends: "友達にチャレンジ",
    challenge_friends_desc: "友達に三目並べで勝負を挑もう！このリンクを共有してね。",
    copy_link: "リンクコピー",
    copied: "コピーした！",
    share_device: "シェアする",
    maybe_later: "あとで",
    share_includes_image: "共有にはスコアカード画像が含まれます",

    // Challenge modal
    challenge_received: "チャレンジきた！",
    round_challenge: "5ラウンドチャレンジ",
    target_score: "目標スコア",
    beat_score: "このスコアを超えて勝とう！",
    accept_challenge: "チャレンジ受ける",

    // Results
    challenge_results: "チャレンジ結果",
    wins: "勝ち",
    ties: "引分",
    losses: "負け",
    leaderboard_rank: "ランキング",
    copy_clipboard: "コピー",
    play_again: "もう一回",

    // Language
    select_language: "言語",
  },
}

// Helper function to get a translation
export const getTranslation = (
  language: Language,
  key: string,
  replacements?: Record<string, string | number>,
): string => {
  let text = translations[language][key] || translations.en[key] || key

  if (replacements) {
    Object.entries(replacements).forEach(([key, value]) => {
      text = text.replace(`{${key}}`, String(value))
    })
  }

  return text
}
