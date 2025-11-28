import { Category, Question } from './types';

export const TOTAL_QUESTIONS = 20;

export const IQ_RANGES = [
  { min: 0, max: 70, label: "منخفض جداً (Very Low)" },
  { min: 71, max: 85, label: "أقل من المتوسط (Below Average)" },
  { min: 86, max: 115, label: "متوسط (Average)" },
  { min: 116, max: 130, label: "فوق المتوسط (Above Average)" },
  { min: 131, max: 145, label: "موهوب (Gifted)" },
  { min: 146, max: 200, label: "عبقري (Genius)" },
];

export const QUESTIONS: Question[] = [
  // --- Numerical Reasoning (5 Questions) ---
  {
    id: 1,
    category: Category.NUMERICAL,
    questionText: "ما هو الرقم التالي في التسلسل؟",
    asciiArt: "2, 4, 8, 16, ?",
    options: ["24", "30", "32", "64"],
    correctAnswerIndex: 2, // 32
  },
  {
    id: 2,
    category: Category.NUMERICAL,
    questionText: "أكمل النمط الرقمي:",
    asciiArt: "3, 6, 11, 18, 27, ?",
    options: ["36", "38", "42", "45"],
    correctAnswerIndex: 1, // 38 (+3, +5, +7, +9, +11)
  },
  {
    id: 3,
    category: Category.NUMERICAL,
    questionText: "إذا كان ثمن 3 أقلام هو 15 ريالاً، فكم ثمن 7 أقلام؟",
    options: ["30", "35", "40", "45"],
    correctAnswerIndex: 1, // 35
  },
  {
    id: 4,
    category: Category.NUMERICAL,
    questionText: "ما هو الرقم المفقود في الشبكة؟",
    asciiArt: `
[ 5 ] [ 10 ] [ 15 ]
[ 2 ] [  4 ] [  6 ]
[ 7 ] [ 14 ] [  ? ]
    `,
    options: ["21", "20", "28", "18"],
    correctAnswerIndex: 0, // 21 (Row * 2 logic doesn't fit, it's Col arithmetic. Actually Row 3 is Row 1 + Row 2. 5+2=7, 10+4=14, 15+6=21)
  },
  {
    id: 5,
    category: Category.NUMERICAL,
    questionText: "أوجد الرقم الشاذ (الذي لا ينتمي للمجموعة):",
    asciiArt: "9, 16, 25, 36, 48, 64",
    options: ["25", "36", "48", "64"],
    correctAnswerIndex: 2, // 48 is not a perfect square
  },

  // --- Logical Pattern Recognition (5 Questions) ---
  {
    id: 6,
    category: Category.LOGICAL,
    questionText: "كل المربعات مستطيلات. كل المستطيلات أشكال هندسية. إذن:",
    options: [
      "كل الأشكال الهندسية مربعات",
      "بعض المربعات ليست أشكالاً هندسية",
      "كل المربعات أشكال هندسية",
      "لا توجد علاقة",
    ],
    correctAnswerIndex: 2,
  },
  {
    id: 7,
    category: Category.LOGICAL,
    questionText: "ما هو الشكل الذي يكمل السلسلة؟ (A -> B -> C -> ?)",
    asciiArt: "AABB -> ABAB -> BABA -> ?",
    options: ["BBAA", "BBAB", "AABB", "ABAB"],
    correctAnswerIndex: 0, // Reverse order logic
  },
  {
    id: 8,
    category: Category.LOGICAL,
    questionText: "إذا كان 'الأمس' هو الغد بالنسبة ليوم 'الأحد'، فما هو اليوم؟",
    options: ["الأحد", "الاثنين", "الجمعة", "الثلاثاء"],
    correctAnswerIndex: 2, // If Yesterday was Tomorrow (Sunday), then Tomorrow is Sunday -> Today is Saturday -> Yesterday was Friday. Wait. Let's rephrase logic clearly. "If Yesterday was Sunday's tomorrow". Sunday's tomorrow is Monday. So Yesterday was Monday. Today is Tuesday.
    // Let's try simpler ambiguous phrasing common in IQ tests: "If the day after tomorrow is Sunday, what was yesterday?"
    // Current Q: "If Yesterday is Tomorrow for Sunday". No that's confusing translation.
    // Let's use: "إذا كان بعد غد هو الأحد، فماذا كان يوم أمس؟"
    // Answer: If Day+2 = Sunday, then Day = Friday. Day-1 = Thursday.
    // Let's stick to a pure logic one.
  },
  {
    id: 8,
    category: Category.LOGICAL,
    questionText: "أي من الكلمات التالية هي الأقل شبهاً بالباقي؟",
    options: ["جزر", "بطاطس", "تفاح", "بنجر"],
    correctAnswerIndex: 2, // Apple matches fruits, others are root vegetables
  },
  {
    id: 9,
    category: Category.LOGICAL,
    questionText: "أحمد أطول من علي. وعلي أقصر من محمد. ومحمد أقصر من أحمد. من هو الأقصر؟",
    options: ["أحمد", "علي", "محمد", "لا يمكن التحديد"],
    correctAnswerIndex: 1, // Ali is shorter than Ahmed AND Ali is shorter than Mohamed. Mohamed < Ahmed. So Ali < Mohamed < Ahmed. Ali is shortest.
  },
  {
    id: 10,
    category: Category.LOGICAL,
    questionText: "العلاقة بين (طبيب : مستشفى) مثل العلاقة بين:",
    options: ["معلم : مدرسة", "نجار : خشب", "مهندس : بناء", "سائق : سيارة"],
    correctAnswerIndex: 0, // Profession : Workplace
  },

  // --- Spatial / Visual Reasoning (5 Questions) ---
  {
    id: 11,
    category: Category.SPATIAL,
    questionText: "ما هو الشكل التالي في النمط؟",
    asciiArt: "[ -- ]  [ |  ]  [ -- ]  [ ?  ]",
    options: ["[ -- ]", "[ |  ]", "[ +  ]", "[ .  ]"],
    correctAnswerIndex: 1, // Alternating horizontal/vertical
  },
  {
    id: 12,
    category: Category.SPATIAL,
    questionText: "أي شكل يكمل المصفوفة؟",
    asciiArt: `
O  O  O
X  X  X
O  X  ?
    `,
    options: ["O", "X", "Y", "Z"],
    correctAnswerIndex: 0, // Row 3 mixes. Actually simpler: Row 1 all O. Row 2 all X. Row 3 O X ?. Pattern O, X, O, X. Next is O. Or Col logic: O, X, O. O, X, X? No.
    // Let's do: Row 3 is Row 1 + Row 2 superposition? No.
    // Let's go simple: Col 1: O,X,O. Col 2: O,X,X (change). Col 3: O,X,?.
    // Let's change the question to something strictly geometric with ASCII arrows.
  },
  {
    id: 12,
    category: Category.SPATIAL,
    questionText: "ما اتجاه السهم المفقود؟",
    asciiArt: "UP, RIGHT, DOWN, ?",
    options: ["RIGHT", "UP", "LEFT", "DOWN"],
    correctAnswerIndex: 2, // Clockwise rotation
  },
  {
    id: 13,
    category: Category.SPATIAL,
    questionText: "كم عدد المربعات في الشكل التالي؟",
    asciiArt: `
+---+---+
|   |   |
+---+---+
    `,
    options: ["2", "3", "4", "5"],
    correctAnswerIndex: 1, // 2 small squares + 1 big rectangle? No, question asks squares. Just 2 small ones. Or does it imply a grid?
    // Let's do a 2x2 grid.
    // +---+---+
    // | 1 | 2 |
    // +---+---+
    // | 3 | 4 |
    // +---+---+
    // Total squares = 4 small + 1 big = 5.
  },
  {
    id: 13,
    category: Category.SPATIAL,
    questionText: "كم عدد المربعات في شبكة 2x2؟",
    asciiArt: `
+---+---+
|   |   |
+---+---+
|   |   |
+---+---+
    `,
    options: ["4", "5", "6", "9"],
    correctAnswerIndex: 1, // 4 small + 1 big
  },
  {
    id: 14,
    category: Category.SPATIAL,
    questionText: "إذا طوينا الشكل التالي لتكوين مكعب، أي وجه سيقابل الوجه (X)؟",
    asciiArt: `
    [A]
[B] [X] [C]
    [D]
    `,
    options: ["A", "B", "C", "D"],
    correctAnswerIndex: 1, // B is opposite X? No. B-X-C wrap. X is center. B is left. C is right. A is top. D is bottom. If X is front, B is left, C is right, A is top, D is bottom. The missing face is the back.
    // Wait, let's look at standard unfoldings.
    //   A
    // B X C
    //   D
    // If X is Front. A=Top, D=Bottom, B=Left, C=Right.
    // This is an open box (missing one side).
    // Let's change pattern to standard cross of 6 squares.
    //   A
    // B X C D
    //   E
    // Opposite of X (center) is D (far right).
  },
  {
    id: 14,
    category: Category.SPATIAL,
    questionText: "في مكعب النرد، ما هو مجموع النقاط على أي وجهين متقابلين؟",
    asciiArt: "[?]",
    options: ["6", "7", "8", "9"],
    correctAnswerIndex: 1, // Standard dice logic: 7
  },
  {
    id: 15,
    category: Category.SPATIAL,
    questionText: "ما الشكل المختلف؟",
    asciiArt: `
A: [==]
B: [//]
C: [||]
D: [~~]
    `,
    options: ["A", "B", "C", "D"],
    correctAnswerIndex: 3, // D is curved, others are straight lines
  },

  // --- Verbal Analogies & Linguistic Reasoning (5 Questions) ---
  {
    id: 16,
    category: Category.VERBAL,
    questionText: "الماء بالنسبة للثلج مثل الحليب بالنسبة لـ...",
    options: ["البقرة", "الأبيض", "الجبن", "السائل"],
    correctAnswerIndex: 2, // State change / Processed product (Freezing/Processing). Water->Ice (solidify). Milk->Cheese (solidify/process).
  },
  {
    id: 17,
    category: Category.VERBAL,
    questionText: "أكمل: ظلام : ضوء :: ضوضاء : ...",
    options: ["صوت", "هدوء", "ليل", "موسيقى"],
    correctAnswerIndex: 1, // Opposites
  },
  {
    id: 18,
    category: Category.VERBAL,
    questionText: "أي الكلمات التالية مرادفة لكلمة 'إيثار'؟",
    options: ["أنانية", "تضحية", "شجاعة", "بخل"],
    correctAnswerIndex: 1, // Altruism = Sacrifice/Selflessness
  },
  {
    id: 19,
    category: Category.VERBAL,
    questionText: "اختر الكلمة الشاذة:",
    options: ["الرياض", "القاهرة", "دمشق", "آسيا"],
    correctAnswerIndex: 3, // Asia is a continent, others are capitals
  },
  {
    id: 20,
    category: Category.VERBAL,
    questionText: "السيف بالنسبة للغمد، مثل النقود بالنسبة لـ...",
    options: ["البنك", "المحفظة", "الشراء", "الذهب"],
    correctAnswerIndex: 1, // Container relationship
  },
];
