import { Question, LessonNode, TeachingIntro, Language, TapToFillQuestion, SpotTheBugQuestion, PredictOutputQuestion, ConceptMatchQuestion } from '../types';

/**
 * High-quality Bengali translation map for specific question IDs,
 * key explanations, prompts, mentor tips, and concept briefings.
 */
const QUESTION_TRANSLATIONS_BN: Record<string, {
  prompt?: string;
  explanation?: string;
  mentorTip?: string;
  bugExplanation?: string;
}> = {
  // C Placement
  'c-place-1': {
    prompt: 'এই C কোডটি টার্মিনালে কী আউটপুট দেবে?',
    explanation: 'C তে পূর্ণসংখ্যার ভাগ 15 / 4 শূন্যের দিকে ট্রাঙ্কেট (ভগ্নাংশ বাদ) হয়, তাই ফলাফল 3।',
    mentorTip: 'মনে রাখবেন: দুটি পূর্ণসংখ্যা ভাগ করলে C তে ফলাফল সবসময় পূর্ণসংখ্যাই থাকে!'
  },
  'c-place-2': {
    prompt: 'scanf-এ অনুপস্থিত address-of (&) অপারেটরটি চিহ্নিত করুন:',
    explanation: 'ইনপুট সংরক্ষণ করতে scanf ভ্যারিয়েবলের মেমোরি ঠিকানা (&score) চায়। & ছাড়া সরাসরি score দিলে প্রোগ্রাম ক্র্যাশ করতে পারে বা অনির্ধারিত আচরণ দেখা দেয়!',
    bugExplanation: 'ইনপুট মান মেমোরিতে সংরক্ষণ করার জন্য scanf এর &score প্রয়োজন!'
  },
  'c-place-3': {
    prompt: 'C স্ট্যান্ডার্ড লাইব্রেরি ফাংশনগুলোর সাথে তাদের কাজ মেলান:',
    explanation: 'printf stdout-এ প্রিন্ট করে, scanf ইনপুট নেয়, malloc হিপ মেমোরি বরাদ্দ করে এবং free মেমোরি মুক্ত করে।'
  },
  'c-place-4': {
    prompt: 'C তে ডায়নামিক পদ্ধতিতে ৫টি ইন্টিজারের একটি অ্যারে তৈরি করুন এবং তা সঠিকভাবে free করুন:',
    explanation: 'C তে malloc ফাংশন sizeof(type) দিয়ে হিসাব করা বাইট সাইজ গ্রহণ করে এবং free() তা মেমোরি থেকে মুক্ত করে।'
  },
  'c-place-5': {
    prompt: 'এই C পয়েন্টার ডিরিফারেন্সিং কী প্রিন্ট করবে?',
    explanation: '*ptr = 99 সরাসরি val ভ্যারিয়েবলের ঠিকানায় সংরক্ষিত মানটি পরিবর্তন করে দেয়।'
  },

  // C Unit 1 Node 1
  'c-1-1-1': {
    prompt: 'C এর মৌলিক Hello World প্রোগ্রাম স্ট্রাকচারটি পূরণ করুন:',
    explanation: 'stdio.h হেডার ফাইলে printf সহ স্ট্যান্ডার্ড ইনপুট/আউটপুট লাইব্রেরি সংজ্ঞায়িত থাকে।',
    mentorTip: 'stdio মানে Standard Input Output, যা কনসোলে লেখার জন্য প্রয়োজন!'
  },
  'c-1-1-2': {
    prompt: 'নতুন লাইন ক্যারেক্টার সহ printf-এর আউটপুট কী হবে?',
    explanation: 'নতুন লাইন ক্যারেক্টার (\\n) না থাকলে printf একাধিক স্ট্রিংকে পাশাপাশি একই লাইনে প্রিন্ট করে।'
  },
  'c-1-1-3': {
    prompt: 'এই প্রাথমিক C প্রোগ্রামের সিনট্যাক্স এররটি খুঁজে বের করুন:',
    explanation: 'C তে প্রতিটি স্টেটমেন্ট অবশ্যই একটি সেমিকোলন (;) দিয়ে শেষ করতে হয়।',
    bugExplanation: 'printf স্টেটমেন্টের শেষে সেমিকোলন (;) অনুপস্থিত!'
  },
  'c-1-1-4': {
    prompt: 'মৌলিক C টোকেনগুলোর সাথে তাদের সঠিক বিবরণ মেলান:',
    explanation: 'প্রতিটি টোকেনের C প্রোগ্রামে একটি নির্দিষ্ট কাজ রয়েছে।'
  },

  // C Unit 1 Node 2
  'c-1-2-1': {
    prompt: 'int এবং char এর জন্য সঠিক ফরম্যাট স্পেসিফায়ার বসান:',
    explanation: '%d ব্যবহৃত হয় দশমিক পূর্ণসংখ্যার জন্য এবং %c ব্যবহৃত হয় একক ক্যারেক্টারের জন্য।'
  },
  'c-1-2-2': {
    prompt: '%f ফ্লোটিং-পয়েন্ট ফরম্যাট ব্যবহার করে এই printf কী প্রিন্ট করবে?',
    explanation: '%.1f ফ্লোটিং-পয়েন্ট সংখ্যাটিকে ঠিক ১ দশমিক স্থান পর্যন্ত ফরম্যাট করে, যাতে 9.81 রূপান্তরিত হয় 9.8 এ।'
  },
  'c-1-2-3': {
    prompt: 'কোথায় ভুলবশত float ভ্যারিয়েবলকে %d দিয়ে প্রিন্ট করা হয়েছে তা চিহ্নিত করুন:',
    explanation: '%f আশা করে float বা double, অন্যদিকে %d শুধুমাত্র পূর্ণসংখ্যার (integer) জন্য নির্ধারিত।',
    bugExplanation: 'float ভ্যারিয়েবল price প্রিন্ট করতে %d ব্যবহার করা হয়েছে!'
  },
  'c-1-2-4': {
    prompt: 'C ফরম্যাট স্পেসিফায়ারগুলোর সাথে তাদের ডেটা টাইপ মেলান:',
    explanation: 'ফরম্যাট স্পেসিফায়ার কম্পাইলারকে জানায় মেমোরির বাইটগুলোকে কীভাবে পড়তে হবে।'
  },

  // C Unit 1 Node 3
  'c-1-3-1': {
    prompt: 'এই গাণিতিক হিসাবটির ফলাফল কী প্রিন্ট হবে?',
    explanation: 'পূর্ণসংখ্যার ভাগ 10 / 4 এর মান 2, যার সাথে 2 যোগ করলে 4 হয়। যোগের আগেই ভগ্নাংশ বাদ যায়।'
  },
  'c-1-3-2': {
    prompt: 'ভাগশেষ নির্ণয় করার জন্য সঠিক মডিউলো (%) অপারেটরটি বসান:',
    explanation: 'মডিউলো অপারেটর % ভাগের পর অবশিষ্ট ভাগশেষ রিটার্ন করে: 14 % 4 = 2।'
  },
  'c-1-3-3': {
    prompt: 'শূন্য দিয়ে ভাগ (division by zero) করার বাগটি চিহ্নিত করুন:',
    explanation: 'শূন্য দিয়ে ভাগ করা C তে একটি অনির্ধারিত আচরণ (undefined behavior) এবং রানটাইমে প্রোগ্রাম ক্র্যাশ করায়।',
    bugExplanation: 'ভেরিয়েবল y এর মান 0 হওয়ায় শূন্য দিয়ে ভাগ করা হচ্ছে!'
  },
  'c-1-3-4': {
    prompt: 'গাণিতিক অপারেটরগুলোর সাথে তাদের কাজ মেলান:',
    explanation: 'মৌলিক গাণিতিক অপারেটরগুলো প্রোগ্রামের গণনায় ব্যবহৃত হয়।'
  },

  // C Unit 1 Node 4
  'c-1-4-1': {
    prompt: 'if-else শর্ত পরীক্ষার স্টেটমেন্টটি পূরণ করুন:',
    explanation: 'শর্ত সত্য হলে if ব্লক এক্সিকিউট হয়, অন্যথায় else ব্লক এক্সিকিউট হয়।'
  },
  'c-1-4-2': {
    prompt: 'এই if শর্তটি কোন ব্রাঞ্চটি এক্সিকিউট করবে তা অনুমান করুন:',
    explanation: 'যদি score >= 50 সত্য হয়, তবে Pass প্রিন্ট হবে।'
  },
  'c-1-4-3': {
    prompt: 'সমান যাচাইয়ের (==) বদলে ভুলবশত অ্যাসাইনমেন্ট (=) ব্যবহারের বাগটি চিহ্নিত করুন:',
    explanation: 'মান সমান কিনা যাচাইয়ের অপারেটর হলো ==। একটিমাত্র = ব্যবহার করলে তা ভ্যারিয়েবলে মান অ্যাসাইন করে দেয়!',
    bugExplanation: 'তুলনার জন্য == এর বদলে = ব্যবহার করা হয়েছে!'
  },
  'c-1-4-4': {
    prompt: 'তুলনামূলক অপারেটরগুলোর সাথে তাদের অর্থ মেলান:',
    explanation: 'তুলনামূলক অপারেটরগুলো শর্ত নির্ধারণের মূল ভিত্তি।'
  },

  // C Unit 2
  'c-2-1-1': {
    prompt: '১ থেকে ৫ পর্যন্ত প্রিন্ট করার জন্য while লুপটি পূরণ করুন:',
    explanation: 'while লুপের শর্তটি যতক্ষণ সত্য (true) থাকে, ততক্ষণ লুপের ভেতরের কোড চলতে থাকে।'
  },
  'c-2-1-2': {
    prompt: 'এই পোস্ট-ইনক্রিমেন্ট লুপের আউটপুট কী হবে?',
    explanation: 'লুপ প্রতি ধাপে কাউন্টার বৃদ্ধি করে শর্ত পূরণ না হওয়া পর্যন্ত চলে।'
  },
  'c-2-1-3': {
    prompt: 'কাউন্টার বৃদ্ধি না করার কারণে তৈরি হওয়া ইনফিনিট লুপের বাগটি চিহ্নিত করুন:',
    explanation: 'ইনক্রিমেন্ট স্টেটমেন্ট না থাকলে লুপের সমাপ্তির শর্ত কখনোই পূরণ হয় না এবং তা অনন্তকাল চলতে থাকে।',
    bugExplanation: 'কাউন্টার বৃদ্ধি (i++) না থাকায় লুপটি কখনো থামবে না!'
  },
  'c-2-1-4': {
    prompt: 'লুপের গঠনগুলোর সাথে তাদের ব্যবহারের ক্ষেত্র মেলান:',
    explanation: 'কাজের ধরন অনুযায়ী সঠিক লুপ নির্বাচন কোডকে কার্যকর করে।'
  },

  // C Functions
  'c-2-2-1': {
    prompt: 'দুটি ইন্টিজার গ্রহণ করে তাদের যোগফল রিটার্ন করা ফাংশনটি পূরণ করুন:',
    explanation: 'ফাংশন প্যারামিটার গ্রহণ করে এবং নির্দিষ্ট টাইপের ফলাফল return করে।'
  },
  'c-2-2-2': {
    prompt: 'এই রিকার্সিভ ফাংশনটি কী রিটার্ন ভ্যালু প্রিন্ট করবে?',
    explanation: 'রিকার্সনে ফাংশনটি নিজের বেস কেস না পৌঁছানো পর্যন্ত নিজেকেই কল করতে থাকে।'
  },
  'c-2-2-3': {
    prompt: 'নন-ভয়েড ফাংশনে অনুপস্থিত return স্টেটমেন্টের বাগটি চিহ্নিত করুন:',
    explanation: 'নির্দিষ্ট রিটার্ন টাইপযুক্ত ফাংশন থেকে অবশ্যই সেই টাইপের একটি মান return করতে হয়।',
    bugExplanation: 'int রিটার্ন টাইপ থাকা সত্ত্বেও ফাংশনে কোনো return স্টেটমেন্ট নেই!'
  },

  // C Arrays & Pointers
  'c-3-1-1': {
    prompt: '৫টি ইন্টিজারের একটি অ্যারে ডিক্লেয়ার করুন এবং প্রথম উপাদানটি ইনিশিয়ালাইজ করুন:',
    explanation: 'অ্যারে একই টাইপের ডেটা ধারাবাহিকভাবে মেমোরিতে সংরক্ষণ করে।'
  },
  'c-3-1-2': {
    prompt: 'পয়েন্টার পাটিগণিতের মাধ্যমে অ্যারের উপাদান অ্যাক্সেস করলে কী আউটপুট পাওয়া যাবে?',
    explanation: '*(arr + i) সরাসরি অ্যারের i-তম উপাদানের মান নির্দেশ করে।'
  },
  'c-3-1-3': {
    prompt: 'অ্যারের সীমার বাইরে (out-of-bounds) অ্যাক্সেস করার বাগটি চিহ্নিত করুন:',
    explanation: 'অ্যারে ইনডেক্স 0 থেকে শুরু হয়ে size - 1 এ শেষ হয়। ৫ আকারের একটি অ্যারেতে ইনডেক্স 5 অ্যাক্সেস করলে সীমার বাইরে চলে যায়!',
    bugExplanation: 'অ্যারের সাইজ 5 হওয়ায় ইনডেক্স 5 অবৈধ ও সীমার বাইরে!'
  },

  // C Pointers
  'c-3-2-1': {
    prompt: 'একটি পয়েন্টার ডিক্লেয়ার করুন এবং এতে একটি ভ্যারিয়েবলের মেমোরি ঠিকানা অ্যাসাইন করুন:',
    explanation: '& অপারেটর দিয়ে কোনো ভ্যারিয়েবলের মেমোরি ঠিকানা নেওয়া হয় এবং * দিয়ে পয়েন্টার ডিক্লেয়ার করা হয়।'
  },
  'c-3-2-2': {
    prompt: 'পয়েন্টারের মাধ্যমে ডেটা পরিবর্তন করার পর কোন মানটি প্রিন্ট হবে?',
    explanation: 'পয়েন্টারের ডিরিফারেন্স (*ptr) করে মান বদলালে মূল ভ্যারিয়েবলের মানও পরিবর্তিত হয়ে যায়।'
  },
  'c-3-2-3': {
    prompt: 'নাল পয়েন্টার ডিরিফারেন্স করার বাগটি চিহ্নিত করুন:',
    explanation: 'NULL বা আন-ইনিশিয়ালাইজড পয়েন্টার ডিরিফারেন্স করলে সেগমেন্টেশন ফল্ট (Segmentation Fault) হয়ে প্রোগ্রাম ক্র্যাশ করে।',
    bugExplanation: 'NULL পয়েন্টারকে ডিরিফারেন্স (*ptr) করার চেষ্টা করা হচ্ছে!'
  },

  // C++ Course Questions
  'cpp-place-1': {
    prompt: 'এই C++ std::cout কোডটি কী আউটপুট দেবে?',
    explanation: 'C++ এ ইনসার্শন অপারেটর (<<) ডেটা আউটপুটে পাঠায়। std::endl নতুন লাইন তৈরি করে এবং বাফার ফ্লাশ করে।'
  },
  'cpp-place-2': {
    prompt: 'std::cin এ ভুল ডিরেকশন অপারেটর ব্যবহারের বাগটি চিহ্নিত করুন:',
    explanation: 'std::cin এর সাথে এক্সট্রাকশন অপারেটর >> ব্যবহার করতে হয়, << নয়!',
    bugExplanation: 'cin এর সাথে >> এর বদলে << ব্যবহার করা হয়েছে!'
  },
  'cpp-place-3': {
    prompt: 'C++ স্ট্যান্ডার্ড লাইব্রেরি উপাদানগুলোর সাথে তাদের ভূমিকা মেলান:',
    explanation: 'iostream, vector, string হলো আধুনিক C++ এর অপরিহার্য লাইব্রেরি।'
  },
  'cpp-1-1-1': {
    prompt: 'C++ Hello World স্ট্রাকচারটি পূরণ করুন:',
    explanation: '<iostream> হেডার ফাইল ইনপুট/আউটপুট স্ট্রিম সংজ্ঞা প্রদান করে; std::cout হলো স্ট্যান্ডার্ড ক্যারেক্টার আউটপুট অবজেক্ট।'
  },
  'cpp-1-1-2': {
    prompt: 'অনুপস্থিত সেমিকোলন (;) এর বাগটি খুঁজে বের করুন:',
    explanation: 'C++ এ সেমিকোলন স্টেটমেন্ট শেষ করে। এটি ভুলে গেলে কম্পাইলার কোড পার্স করতে পারে না।',
    bugExplanation: 'cout লাইনের শেষে সেমিকোলন (;) দেওয়া হয়নি!'
  },

  // Python Placement & Lessons
  'py-place-1': {
    prompt: 'এই পাইথন কোডের আউটপুট কী হবে?',
    explanation: 'পাইথনে স্লাইসিং [1:3] ইনডেক্স 1 থেকে শুরু হয়ে ইনডেক্স 3 এর আগ পর্যন্ত উপাদানগুলো নেয়।'
  },
  'py-place-2': {
    prompt: 'ইনডেন্টেশন এরর বা ভুল কোলনের বাগটি খুঁজে বের করুন:',
    explanation: 'পাইথনে if, for, def ইত্যাদি ব্লকের শেষে কোলন (:) থাকা বাধ্যতামূলক।',
    bugExplanation: 'if স্টেটমেন্টের শেষে কোলন (:) দেওয়া হয়নি!'
  },
  'py-place-3': {
    prompt: 'পাইথন ডেটা স্ট্রাকচারগুলোর সাথে তাদের বৈশিষ্ট্য মেলান:',
    explanation: 'লিস্ট পরিবর্তনশীল (mutable), টাপল অপরিবর্তনশীল (immutable), এবং ডিকশনারি কী-ভ্যালু জোড়া ধারণ করে।'
  },

  // OOP
  'oop-place-1': {
    prompt: 'ক্লাসের অবজেক্ট তৈরি এবং মেথড কল করার আউটপুট কী হবে?',
    explanation: 'অবজেক্ট তৈরির পর ডট (.) অপারেটর দিয়ে মেথড কল করলে অবজেক্টের অভ্যন্তরীণ স্টেট অনুযায়ী কোড রান হয়।'
  },
  'oop-place-2': {
    prompt: 'প্রাইভেট ফিল্ড অ্যাক্সেস সংক্রান্ত বাগটি খুঁজে বের করুন:',
    explanation: 'প্রাইভেট (private) মেম্বার ক্লাসের বাইরে থেকে সরাসরি অ্যাক্সেস করা যায় না, এর জন্য পাবলিক গেটার/সেটার দরকার।',
    bugExplanation: 'ক্লাসের বাইরে থেকে সরাসরি private ভ্যারিয়েবল অ্যাক্সেস করার চেষ্টা করা হয়েছে!'
  },

  // DSA
  'dsa-place-1': {
    prompt: 'স্ট্যাকের LIFO অপারেশন অনুযায়ী কোন উপাদানটি সবার আগে বের হবে?',
    explanation: 'স্ট্যাক লাস্ট-ইন, ফার্স্ট-আউট (LIFO) পদ্ধতিতে কাজ করে, তাই সর্বশেষে পুশ করা উপাদানটি সবার আগে পপ হয়।'
  },
  'dsa-place-2': {
    prompt: 'বাইনারি সার্চ ট্রি (BST) এর ভুল ইনসার্শন বাগটি চিহ্নিত করুন:',
    explanation: 'BST তে রুট নোডের চেয়ে ছোট মান বামে এবং বড় মান ডানে যেতে হবে।',
    bugExplanation: 'বড় মান ভুলবশত বাম সাব-ট্রিতে যুক্ত করা হয়েছে!'
  },

  // Algorithms
  'algo-place-1': {
    prompt: 'এই অ্যালগরিদমের সময় জটিলতা (Time Complexity) কী হবে?',
    explanation: 'প্রতি পদক্ষেপে সমস্যাটিকে অর্ধেক করে ফেললে মোট পদক্ষেপ সংখ্যা হয় log N, তাই জটিলতা O(log N)।'
  }
};

/**
 * Universal phrase & syntax explanation patterns in computer science
 */
const EXPLANATION_PATTERNS_BN: [RegExp, string][] = [
  // Semicolon
  [/Statements in [a-zA-Z+]+ must end with a semicolon.*$/i, 'এই প্রোগ্রামিং ভাষায় প্রতিটি স্টেটমেন্ট অবশ্যই একটি সেমিকোলন (;) দিয়ে শেষ করতে হয়।'],
  [/A semicolon terminates instructions.*$/i, 'সেমিকোলন কোডের নির্দেশ বা স্টেটমেন্ট শেষ করে। এটি ভুলে গেলে কম্পাইলার কোড পার্স করতে পারে না।'],
  [/every command sentence MUST end with a semicolon.*$/i, 'প্রতিটি নির্দেশ বাক্য অবশ্যই একটি সেমিকোলন (;) দিয়ে শেষ করতে হবে।'],
  
  // Format specifiers & printf
  [/In C, printf\(\) outputs text and is declared inside <stdio\.h>\./i, 'C তে printf() টেক্সট আউটপুট দেয় এবং এটি <stdio.h> এর ভেতরে ডিক্লেয়ার করা থাকে।'],
  [/printf does not automatically add a newline unless you include.*\\n/i, 'printf নিজে থেকে নতুন লাইন যুক্ত করে না যতক্ষণ না আপনি "\\n" ব্যবহার করেন, তাই পরপর কল করলে একই লাইনে প্রিন্ট হয়।'],
  [/stdio\.h defines the standard input\/output library.*$/i, 'stdio.h হেডার ফাইলে printf সহ স্ট্যান্ডার্ড ইনপুট/আউটপুট লাইব্রেরি সংজ্ঞায়িত থাকে।'],
  [/Line 1 includes <iostream>, which is a C\+\+ header! Pure C uses <stdio\.h>\./i, '১ম লাইনে <iostream> যুক্ত করা হয়েছে যা C++ হেডার! বিশুদ্ধ C তে <stdio.h> ব্যবহার করতে হয়।'],
  [/<iostream> is a C\+\+ header! Pure C programs must use #include <stdio\.h>\./i, '<iostream> হলো C++ হেডার! বিশুদ্ধ C প্রোগ্রামে অবশ্যই #include <stdio.h> ব্যবহার করতে হবে।'],
  [/printf outputs formatted strings.*stdio\.h is the C I\/O header/i, 'printf ফরম্যাট করা স্ট্রিং আউটপুট দেয়, \\n নতুন লাইন তৈরি করে, stdio.h হলো C ইনপুট/আউটপুট হেডার এবং return 0 সফলতার নির্দেশ দেয়।'],
  [/iostream provides input\/output stream.*$/i, '<iostream> হেডার ফাইল ইনপুট/আউটপুট স্ট্রিম সুবিধা প্রদান করে।'],
  [/%d is used for .* and %c is for .*/i, '%d ব্যবহৃত হয় পূর্ণসংখ্যার জন্য এবং %c ব্যবহৃত হয় ক্যারেক্টারের জন্য।'],
  [/%d prints integer numbers, and %c prints single characters\./i, '%d পূর্ণসংখ্যা প্রিন্ট করে এবং %c একক ক্যারেক্টার প্রিন্ট করে।'],
  [/%.1f formats the floating-point number.*$/i, '%.1f ফ্লোটিং-পয়েন্ট সংখ্যাটিকে ঠিক ১ দশমিক স্থান পর্যন্ত ফরম্যাট করে।'],
  [/%.1f formats the floating point number to 1 decimal place/i, '%.1f ফ্লোটিং-পয়েন্ট সংখ্যাটিকে ১ দশমিক স্থান পর্যন্ত ফরম্যাট করে (যেমন: 9.8)।'],
  [/Line \d+ passes a floating-point number .* to %d/i, '%d তে ফ্লোটিং-পয়েন্ট মান পাস করায় C তে অনির্ধারিত আচরণ (undefined behavior) বা গারবেজ আউটপুট তৈরি হয়!'],
  [/Passing a float to %d causes a format specifier mismatch/i, '%d তে float পাস করলে ফরম্যাট স্পেসিফায়ার অমিল হয় এবং ভুল গারবেজ আউটপুট দেয়! দশমিকের জন্য %f ব্যবহার করুন।'],
  [/%d matches int, %f matches float\/double, %c matches char, %s matches string\./i, '%d ইনটিজারের জন্য, %f ফ্লোট/ডাবলের জন্য, %c ক্যারেক্টারের জন্য এবং %s স্ট্রিংয়ের জন্য নির্ধারিত।'],
  [/%f expects a float.*while %d is.*/i, '%f আশা করে float বা double, অন্যদিকে %d শুধুমাত্র পূর্ণসংখ্যার (integer) জন্য নির্ধারিত।'],

  // Math & Operations
  [/In C(\+\+)?, integer division .* truncates towards zero.*$/i, 'পূর্ণসংখ্যার ভাগে দশমিকের পরের অংশ শূন্যের দিকে ট্রাঙ্কেট (বাদ) হয়ে যায়।'],
  [/The modulo operator % returns.*$/i, 'মডিউলো অপারেটর (%) পূর্ণসংখ্যার ভাগের পর অবশিষ্ট ভাগশেষ রিটার্ন করে।'],
  [/Division by zero is undefined behavior.*$/i, 'শূন্য দিয়ে ভাগ করা একটি অনির্ধারিত আচরণ (undefined behavior) এবং রানটাইমে প্রোগ্রাম ক্র্যাশ করায়।'],

  // Conditionals
  [/The equality comparison operator is ==.*$/i, 'মান সমান কিনা যাচাইয়ের অপারেটর হলো ==। একটিমাত্র = ব্যবহার করলে তা অ্যাসাইনমেন্ট হয়ে যায়!'],
  [/A while loop continues executing as long as.*$/i, 'while লুপের শর্তটি যতক্ষণ সত্য (true) থাকে, ততক্ষণ লুপের ভেতরের কোড চলতে থাকে।'],
  [/Loops without an increment statement.*$/i, 'কাউন্টার বৃদ্ধি না করলে লুপের সমাপ্তির শর্ত কখনোই পূরণ হয় না এবং তা অনন্তকাল চলতে থাকে (ইনফিনিট লুপ)।'],

  // Pointers & Memory
  [/\*p = \d+ modifies the memory location where .* lives/i, '*p দিয়ে পয়েন্টার ডিরিফারেন্স করে মেমোরি ঠিকানার মান সরাসরি পরিবর্তন করা যায়।'],
  [/Line \d+ passes .* directly instead of &\w+! scanf requires the pointer/i, 'scanf এ সরাসরি ভ্যারিয়েবল নয়, ইনপুট সংরক্ষণের জন্য মেমোরি পয়েন্টার (&) পাঠাতে হয়।'],
  [/scanf requires the memory address .* Passing .* directly crashes with Segmentation Fault!/i, 'scanf মেমোরি ঠিকানা চায়। সরাসরি ভ্যারিয়েবল দিলে সেগমেন্টেশন ফল্ট হয়ে প্রোগ্রাম ক্র্যাশ করে!'],
  [/scanf expects the memory address.*$/i, 'ইনপুট সংরক্ষণের জন্য scanf মেমোরি ঠিকানা (&score) প্রত্যাশা করে। & ছাড়া সরাসরি ভ্যারিয়েবল দিলে ক্র্যাশ হতে পারে!'],
  [/Dereferencing a (NULL|null|nullptr).*$/i, 'NULL বা nullptr ডিরিফারেন্স করলে সেগমেন্টেশন ফল্ট হয়ে ক্র্যাশ করে।'],
  [/Array indexing starts at 0 and ends at size - 1.*$/i, 'অ্যারে ইনডেক্স 0 থেকে শুরু হয়ে size - 1 এ শেষ হয়। এর বাইরের ইনডেক্স অ্যাক্সেস করলে এরর দেখা দেয়!'],
  [/malloc takes byte size.*and free\(\) releases it.*$/i, 'malloc ফাংশন মেমোরি সাইজ নিয়ে হিপে জায়গা বরাদ্দ করে এবং free() তা মেমোরি থেকে মুক্ত করে।'],
  [/malloc\(\) allocates raw bytes from <stdlib\.h> and free\(\) deallocates\./i, 'malloc() <stdlib.h> থেকে হিপ বাইট বরাদ্দ করে এবং free() মেমোরি মুক্ত করে।'],
  [/malloc allocates uninitialized bytes, calloc zeroes memory, realloc resizes, free deallocates\./i, 'malloc মেমোরি বরাদ্দ করে, calloc শূন্য দিয়ে পূর্ণ করে, realloc সাইজ বদলায় এবং free মেমোরি মুক্ত করে।'],
  [/delete should only be used on memory allocated with "new"/i, 'delete শুধুমাত্র new দিয়ে বরাদ্দ করা হিপ মেমোরিতেই ব্যবহার করা যায়, স্ট্যাক ভ্যারিয়েবলে নয়!'],
  [/Stack is fast and automatic, Heap is dynamically allocated, and nullptr represents zero address\./i, 'স্ট্যাক হলো দ্রুত ও স্বয়ংক্রিয়, হিপ হলো ডায়নামিক ও ম্যানুয়াল, আর nullptr শূন্য মেমোরি ঠিকানা নির্দেশ করে।'],
  [/arr is an array\. \*\([a-zA-Z]+ \+ \d+\) is equivalent to/i, 'পয়েন্টার পাটিগণিতে *(arr + i) সরাসরি arr[i] এর সমান মান নির্দেশ করে।'],

  // C++ std::cout & cin & vector
  [/In C\+\+, std::cout sends output to the terminal, and << inserts data into the stream\./i, 'C++ এ std::cout টার্মিনালে টেক্সট পাঠায় এবং << স্ট্রিমে ডেটা প্রবেশ করায়।'],
  [/Chaining << outputs each text piece consecutively without spaces/i, 'পরপর << ব্যবহার করলে প্রতিটি টেক্সট কোনো স্পেস ছাড়া ধারাবাহিকভাবে প্রিন্ট হয়।'],
  [/Line \d+ uses >> \(stream extraction for input\) instead of <</i, 'আউটপুট দিতে std::cout এর সাথে ইনসার্শন অপারেটর << ব্যবহার করতে হয়, >> ইনপুটের জন্য!'],
  [/std::cout requires the insertion operator <<\. Using >> causes a compilation error!/i, 'std::cout এর সাথে ইনসার্শন অপারেটর << প্রয়োজন। >> ব্যবহার করলে কম্পাইলেশন এরর দেখা দেয়!'],
  [/std::cout prints characters, << is the stream insertion operator, std::endl creates a new line/i, 'std::cout ক্যারেক্টার প্রিন্ট করে, << ইনসার্শন অপারেটর, std::endl নতুন লাইন দেয় এবং #include স্ট্রিম টুলস আনে।'],
  [/int holds whole numbers, and std::string holds text\./i, 'int পূর্ণসংখ্যা ধারণ করে এবং std::string টেক্সট ধারণ করে।'],
  [/The variable .* starts at \d+, and .* updates it to \d+\./i, 'ভ্যারিয়েবলটি পূর্বের মান থেকে পরিবর্তিত হয়ে নতুন মান ধারণ করেছে।'],
  [/Line \d+ assigns a string to an integer variable!/i, 'ইন্টিজার ভ্যারিয়েবলে সরাসরি স্ট্রিং রাখা যায় না! C++ একটি স্ট্রংলি-টাইপড ভাষা।'],
  [/std::cin uses >> to extract user input from the keyboard into a variable\./i, 'কীবোর্ড থেকে ইনপুট নিতে std::cin এক্সট্রাকশন অপারেটর >> ব্যবহার করে।'],
  [/std::cin requires >> \(extraction\), not << \(insertion\)!/i, 'ইনপুট গ্রহণের জন্য std::cin এর সাথে >> প্রয়োজন, << নয়!'],
  [/Functions must specify a return type, or void if they return nothing\./i, 'ফাংশনের অবশ্যই একটি রিটার্ন টাইপ থাকতে হয়, কিছু রিটার্ন না করলে void ব্যবহার করতে হয়।'],
  [/A function declared with int must return an integer value!/i, 'int রিটার্ন টাইপযুক্ত ফাংশন থেকে অবশ্যই একটি পূর্ণসংখ্যা return করতে হবে!'],
  [/In C\+\+, std::vector uses push_back to append elements, and size\(\) or range-for to iterate\./i, 'C++ এ std::vector এ নতুন উপাদান যোগ করতে push_back ব্যবহার করা হয় এবং মোট সংখ্যা জানতে size() ব্যবহার করা হয়।'],
  [/vector uses push_back\(\), not push\(\) or append\(\)!/i, 'ভেক্টরে উপাদান যুক্ত করতে push_back() ব্যবহার করতে হয়, push() বা append() নয়!'],

  // Python
  [/In Python, print\(\) outputs text to the screen\./i, 'পাইথনে স্ক্রিনে আউটপুট প্রদর্শনের জন্য print() ফাংশন ব্যবহার করা হয়।'],
  [/f-strings format expressions inside \{curly brackets\}\./i, 'পাইথনে f-strings দিয়ে দ্বিতীয় বন্ধনীর {expression} ভেতরের যেকোনো ভ্যারিয়েবল বা মান সরাসরি স্ট্রিংয়ে বসানো যায়।'],
  [/Python indentation defines code blocks.*$/i, 'পাইথনে দ্বিতীয় বন্ধনী {} এর বদলে ইনডেন্টেশন দিয়ে কোড ব্লক নির্ধারণ করা হয়।'],
  [/list is mutable, tuple is immutable, and dict stores key-value pairs\./i, 'লিস্ট পরিবর্তনযোগ্য (mutable), টাপল অপরিবর্তনশীল (immutable), এবং ডিকশনারি কী-ভ্যালু জোড়া ধারণ করে।'],

  // OOP
  [/In OOP, a class is a blueprint and an object is an instance\./i, 'OOP তে ক্লাস হলো একটি ব্লুপ্রিন্ট বা নকশা এবং অবজেক্ট হলো সেই নকশার একটি বাস্তব উদাহরণ।'],
  [/Private members cannot be accessed directly from outside the class\./i, 'প্রাইভেট (private) মেম্বার ক্লাসের বাইরে থেকে সরাসরি অ্যাক্সেস করা যায় না।'],
  [/Encapsulation bundles data and methods together inside an object\./i, 'এনক্যাপসুলেশন ডেটা এবং মেথডগুলোকে একটি একক অবজেক্টের ভেতরে সুরক্ষিতভাবে আবদ্ধ রাখে।'],

  // DSA & Algorithms
  [/Binary search divides the search space in half.*$/i, 'বাইনারি সার্চ প্রতি ধাপে খোঁজার পরিধি অর্ধেক করে ফেলে, যার ফলে এর সময় জটিলতা হয় O(log N)।'],
  [/Binary search takes O\(log N\) time because it halves the search space\./i, 'বাইনারি সার্চের সময় জটিলতা O(log N) কারণ এটি প্রতি ধাপে অনুসন্ধানের পরিধি অর্ধেক করে ফেলে।'],
  [/A stack operates on Last-In, First-Out.*$/i, 'স্ট্যাক চলে লাস্ট-ইন, ফার্স্ট-আউট (LIFO) নীতিতে এবং কিউ চলে ফার্স্ট-ইন, ফার্স্ট-আউট (FIFO) নীতিতে।'],
  [/Big-O notation measures how time or space requirements grow as input size grows\./i, 'Big-O নোটেশন পরিমাপ করে ডেটার আকার বৃদ্ধির সাথে সাথে কোডের রানটাইম কত দ্রুত বৃদ্ধি পায়।'],
];

/**
 * Node Title and Description Translations
 */
const NODE_TRANSLATIONS_BN: Record<string, { title: string; description: string }> = {
  // C Unit 1
  'c-u1-n1': {
    title: 'Hello World ও কাঠামোগত ভিত্তি',
    description: 'stdio.h, main() ফাংশন, printf এবং সেমিকোলনের মৌলিক গঠন শিখুন।'
  },
  'c-u1-n2': {
    title: 'ভ্যারিয়েবল ও মেমোরি ডেটা টাইপ',
    description: 'int, float, char দিয়ে র‍্যাম মেমোরিতে তথ্য সংরক্ষণ ও আপডেট করা শিখুন।'
  },
  'c-u1-n3': {
    title: 'Printf ফরম্যাট স্পেসিফায়ার',
    description: '%d, %f, %c ফরম্যাট স্পেসিফায়ার দিয়ে ভ্যারিয়েবল প্রিন্ট করা শিখুন।'
  },
  'c-u1-n4': {
    title: 'পাটিগণিত ও মডিউলো অপারেটর',
    description: 'পূর্ণসংখ্যার ভাগ, মডিউলো (%) অপারেটর ও গাণিতিক নিয়ম বুঝুন।'
  },

  // C Unit 2
  'c-u2-n1': {
    title: 'scanf ও ব্যবহারকারীর ইনপুট',
    description: 'scanf দিয়ে কীবোর্ড থেকে ইনপুট নেওয়া এবং & অপারেটরের ভূমিকা শিখুন।'
  },
  'c-u2-n2': {
    title: 'If-Else ও শর্ত পরীক্ষা',
    description: 'রিলেশনাল অপারেটর (==, !=, <, >) এবং সিদ্ধান্ত গ্রহণের নিয়ম শিখুন।'
  },
  'c-u2-n3': {
    title: 'লজিক্যাল অপারেটর (&&, ||, !)',
    description: 'একাধিক শর্ত একসাথে যাচাই ও else if ল্যাডার তৈরি শিখুন।'
  },
  'c-u2-n4': {
    title: 'চেকপয়েন্ট: লজিক মাস্টার',
    description: 'ইনপুট, কন্ডিশনাল এবং ফরম্যাটিং এর সমন্বিত চ্যালেঞ্জ সমাধান করুন।'
  },

  // C Unit 3
  'c-u3-n1': {
    title: 'While লুপ ও পুনরাবৃত্তি',
    description: 'পুনরাবৃত্তিমূলক কাজ সমাধান ও ইনফিনিট লুপের সমাধান শিখুন।'
  },
  'c-u3-n2': {
    title: 'For লুপ ও কাউন্টিং',
    description: 'এক লাইনে ইনিশিয়ালাইজেশন, কন্ডিশন ও ইনক্রিমেন্ট দিয়ে গোনার কাজ সহজ করুন।'
  },
  'c-u3-n3': {
    title: 'লুপ কন্ট্রোল: break ও continue',
    description: 'লুপ থেকে দ্রুত বের হওয়া ও নির্দিষ্ট ধাপ এড়িয়ে যাওয়ার কৌশল শিখুন।'
  },

  // C Unit 4
  'c-u4-n1': {
    title: 'ফাংশন তৈরি ও রিটার্ন ভ্যালু',
    description: 'প্যারামিটার পাস করা, রিটার্ন টাইপ এবং কোড পুনঃব্যবহারযোগ্য করা শিখুন।'
  },
  'c-u4-n2': {
    title: 'Void ফাংশন ও ভ্যারিয়েবল স্কোপ',
    description: 'রিটার্নহীন প্রসিডিউর ও লোকাল ভ্যারিয়েবলের সীমানা বুঝুন।'
  },

  // C Unit 5
  'c-u5-n1': {
    title: 'অ্যারে ও ইনডেক্সিং',
    description: 'ধারাবাহিক মেমোরি সংরক্ষণ ও অ্যারের সীমার মধ্যে কাজ করা শিখুন।'
  },
  'c-u5-n2': {
    title: 'অ্যারে পুনরাবৃত্তি ও C-স্ট্রিং',
    description: 'লুপ দিয়ে অ্যারে ভ্রমণ এবং নাল-টার্মিনেটর (\\0) যুক্ত স্ট্রিং বুঝুন।'
  },

  // C Unit 6
  'c-u6-n1': {
    title: 'মেমোরি ঠিকানা ও & অপারেটর',
    description: 'র‍্যামের হেক্সাডেসিমেল মেমোরি অ্যাড্রেস (%p) ও & অপারেটরের রহস্য শিখুন।'
  },
  'c-u6-n2': {
    title: 'পয়েন্টার ও ডিরিফারেন্সিং (*)',
    description: 'মেমোরি ঠিকানা পয়েন্টারে সংরক্ষণ ও *ptr দিয়ে মূল মান পরিবর্তনের মানসিক মডেল বুঝুন।'
  },
  'c-u6-n3': {
    title: 'পয়েন্টার দিয়ে ফাংশন কল (Pass-by-Pointer)',
    description: 'পয়েন্টার পাস করে মূল ভ্যারিয়েবলের মান অদলবদল (swap) করা শিখুন।'
  },
  'c-u6-n4': {
    title: 'অ্যারে ও পয়েন্টার সমতুল্যতা',
    description: 'অ্যারের নাম ও পয়েন্টার পাটিগণিতের *(arr + i) গভীর সম্পর্ক বুঝুন।'
  },

  // C Unit 7
  'c-u7-n1': {
    title: 'ডায়নামিক হিপ মেমোরি: malloc ও free',
    description: 'হিপ মেমোরি বরাদ্দ ও মেমোরি লিক প্রতিরোধের সোনালী নিয়ম শিখুন।'
  },
  'c-u7-n2': {
    title: 'স্ট্রাকচার (struct) ও কাস্টম টাইপ',
    description: 'একাধিক তথ্য একসাথে গ্রুপ করে নিজস্ব ডেটা টাইপ তৈরি করুন।'
  },
  'c-u7-n3': {
    title: 'চেকপয়েন্ট: সিস্টেমস মাস্টারি',
    description: 'পয়েন্টার, স্ট্রাকচার ও ডায়নামিক মেমোরির চূড়ান্ত চ্যালেঞ্জ জয় করুন।'
  },

  // C++ Nodes
  'cpp-u1-n1': {
    title: 'C++ এর সূচনা ও std::cout',
    description: '<iostream>, নেমস্পেস এবং স্ট্রিম ইনসার্শন অপারেটর (<<) শিখুন।'
  },
  'cpp-u1-n2': {
    title: 'ভ্যারিয়েবল ও মেমোরি স্টোরেজ',
    description: 'int, double, string এবং টাইপ সুরক্ষার ভিত্তি মজবুত করুন।'
  },
  'cpp-u1-n3': {
    title: 'std::cin ও ইনপুট স্ট্রিম',
    description: 'এক্সট্রাকশন অপারেটর (>>) দিয়ে কীবোর্ড ইনপুট নেওয়া শিখুন।'
  },
  'cpp-u1-n4': {
    title: 'অপারেটর ও হিসাব-নিকাশ',
    description: 'গাণিতিক গণনা এবং স্ট্রিং কনক্যাটেনেশন শিখুন।'
  },
  'cpp-u2-n1': {
    title: 'শর্ত ও সিদ্ধান্ত গ্রহণ',
    description: 'if, else if, else দিয়ে প্রোগ্রামের গতিপথ নিয়ন্ত্রণ করুন।'
  },
  'cpp-u2-n2': {
    title: 'লুপ ও পুনরাবৃত্তি',
    description: 'for ও while লুপ দিয়ে কাজ সহজ করুন।'
  },
  'cpp-u2-n3': {
    title: 'মডার্ন রেঞ্জ-বেসড ফর লুপ',
    description: 'for (auto x : items) দিয়ে আধুনিক C++ লুপের সুবিধা নিন।'
  },
  'cpp-u3-n1': {
    title: 'ফাংশন ও রিটার্ন টাইপ',
    description: 'সিগনেচার ও প্যারামিটার দিয়ে কোডকে মডুলার বানান।'
  },
  'cpp-u3-n2': {
    title: 'পাস-বাই-রেফারেন্স (&)',
    description: 'কপি না করে সরাসরি মূল ভ্যারিয়েবল পরিবর্তনের আধুনিক C++ কৌশল।'
  },
  'cpp-u4-n1': {
    title: 'std::vector ডায়নামিক অ্যারে',
    description: 'স্বয়ংক্রিয়ভাবে আকার বৃদ্ধি পাওয়া আধুনিক STL ভেক্টর শিখুন।'
  },
  'cpp-u4-n2': {
    title: 'ভেক্টর অপারেশন ও সীমানা',
    description: 'push_back, pop_back, size() ইত্যাদির কার্যকর ব্যবহার।'
  },
  'cpp-u5-n1': {
    title: 'পয়েন্টার ও nullptr',
    description: 'টাইপ-সেফ nullptr ও মেমোরি পয়েন্টারের আধুনিক নিয়ম।'
  },
  'cpp-u5-n2': {
    title: 'ডায়নামিক অ্যালোকেশন: new ও delete',
    description: 'হিপ মেমোরি বরাদ্দ ও মেমোরি লিক এড়িয়ে চলা।'
  },
  'cpp-u5-n3': {
    title: 'স্মার্ট পয়েন্টার ও RAII (std::unique_ptr)',
    description: 'স্বয়ংক্রিয় মেমোরি মুক্তকারী আধুনিক C++ স্মার্ট পয়েন্টার।'
  },
  'cpp-u6-n1': {
    title: 'ক্লাস ও এনক্যাপসুলেশন',
    description: 'public ও private দিয়ে অবজেক্ট-ওরিয়েন্টেড C++ প্রোগ্রামিং।'
  },
  'cpp-u6-n2': {
    title: 'কনস্ট্রাক্টর ও ডিস্ট্রাক্টর',
    description: 'অবজেক্ট তৈরির সময় স্বয়ংক্রিয় প্রারম্ভিক মান নির্ধারণ ও পরিচ্ছন্নতা।'
  },
  'cpp-u7-n1': {
    title: 'ফাংশন টেমপ্লেট',
    description: 'যেকোনো ডেটা টাইপের জন্য একটিমাত্র জেনেরিক অ্যালগরিদম তৈরি।'
  },

  // Python
  'py-u1-n1': {
    title: 'পাইথনের সহজ সিনট্যাক্স ও F-Strings',
    description: 'print() এবং f-strings দিয়ে সহজে আউটপুট ফরম্যাট করুন।'
  },
  'py-u1-n2': {
    title: 'ভ্যারিয়েবল ও ডায়নামিক টাইপ',
    description: 'টাইপ ডিক্লেয়ারেশন ছাড়াই ভ্যারিয়েবল ব্যবহারের স্বাধীনতা।'
  },
  'py-u1-n3': {
    title: 'ইনপুট ও টাইপ কাস্টিং',
    description: 'input() দিয়ে পড়া এবং int(), float() দিয়ে রূপান্তর।'
  },
  'py-u2-n1': {
    title: 'কন্ডিশনাল: if, elif, else',
    description: '৪-স্পেস ইনডেন্টেশন এবং কোলন দিয়ে শর্ত পরীক্ষা।'
  },
  'py-u2-n2': {
    title: 'For লুপ ও range()',
    description: 'range() দিয়ে গোনার কাজ এবং পুনরাবৃত্তি করা।'
  },
  'py-u3-n1': {
    title: 'পাইথন লিস্টের ভিত্তি',
    description: 'লিস্ট তৈরি, append() এবং pop() এর ব্যবহার।'
  },
  'py-u3-n2': {
    title: 'স্লাইসিং ও নেগেটিভ ইনডেক্সিং',
    description: '[start:stop] এবং পিছন থেকে পড়ার নিয়ম।'
  },
  'py-u4-n1': {
    title: 'ডিকশনারি: কি-ভ্যালু ম্যাপিং',
    description: 'O(1) দ্রুতগতির লুকআপ এবং get() এর ব্যবহার।'
  },
  'py-u4-n2': {
    title: 'ডিকশনারি কৌশল ও সেট',
    description: 'অনন্য উপাদানের সেট (set) এবং মেম্বারশিপ চেকিং।'
  },
  'py-u5-n1': {
    title: 'লিস্ট কম্প্রিহেনশন',
    description: 'এক লাইনে সিকোয়েন্স রূপান্তর ও ফিল্টার করার পাইথনিক কৌশল।'
  },

  // OOP
  'oop-u1-n1': {
    title: 'ব্লুপ্রিন্ট রূপক: ক্লাস ও অবজেক্ট',
    description: 'ক্লাসের নকশা থেকে বাস্তব অবজেক্ট তৈরির মৌলিক ধারণা।'
  },
  'oop-u1-n2': {
    title: 'কনস্ট্রাক্টর ও প্রারম্ভিক স্টেট',
    description: '__init__ দিয়ে অবজেক্টের বৈশিষ্ট্য নির্ধারণ।'
  },
  'oop-u2-n1': {
    title: 'এনক্যাপসুলেশন ও অ্যাক্সেস কন্ট্রোল',
    description: 'অভ্যন্তরীণ স্টেট সুরক্ষিত রাখা এবং মেথড দিয়ে নিয়ন্ত্রণ।'
  },
  'oop-u3-n1': {
    title: 'ইনহেরিটেন্স ও কোড পুনঃব্যবহার',
    description: 'প্যারেন্ট ক্লাস থেকে গুণাবলি উত্তরাধিকার সূত্রে পাওয়া।'
  },
  'oop-u3-n2': {
    title: 'পলিমরফিজম ও মেথড ওভাররাইডিং',
    description: 'একই নামের মেথডে ভিন্ন ভিন্ন আচরণের প্রকাশ।'
  },
  'oop-u4-n1': {
    title: 'কম্পোজিশন ও SOLID প্রিন্সিপাল',
    description: 'ইনহেরিটেন্সের চেয়ে কম্পোজিশন প্রাধান্য দেওয়া ও ক্লিন আর্কিটেকচার।'
  },

  // DSA
  'dsa-u1-n1': {
    title: 'ডায়নামিক অ্যারে ও ক্যাপাসিটি ডাবলিং',
    description: 'অ্যারে লুকআপ কেন O(1) এবং সাইজ বৃদ্ধির মেমোরি মডেল।'
  },
  'dsa-u2-n1': {
    title: 'সিঙ্গলি লিংকড লিস্ট',
    description: 'পয়েন্টার দিয়ে নোড সংযোগ ও ট্রাভার্সালের নিয়ম।'
  },
  'dsa-u3-n1': {
    title: 'স্ট্যাক ও LIFO নীতি',
    description: 'লাস্ট-ইন ফার্স্ট-আউট মেকানিজম ও পুশ/পপ অপারেশন।'
  },
  'dsa-u4-n1': {
    title: 'হ্যাশ টেবিল ও কলিশন রেজোলিউশন',
    description: 'হ্যাশ ফাংশন এবং ও(১) লুকআপের রহস্য।'
  },

  // Algorithms
  'algo-u1-n1': {
    title: 'বাইনারি সার্চ O(log N)',
    description: 'প্রতি পদক্ষেপে অর্ধেক পরিধি বাদ দিয়ে বিদ্যুতগতিতে অনুসন্ধান।'
  },
  'algo-u1-n2': {
    title: 'টু পয়েন্টার টেকনিক',
    description: 'দুই প্রান্ত থেকে ইনডেক্স চালিয়ে লিনিয়ার টাইমে সমস্যা সমাধান।'
  },
  'algo-u2-n1': {
    title: 'ডিভাইড অ্যান্ড কনকার: মার্জ সর্ট',
    description: 'সমস্যা ছোট ছোট খণ্ডে ভাগ করে সাজানোর O(N log N) অ্যালগরিদম।'
  },
  'algo-u3-n1': {
    title: 'গ্রাফ ট্রাভার্সাল: ব্রেডথ-ফার্স্ট সার্চ (BFS)',
    description: 'কিউ (queue) ব্যবহার করে লেভেল বাই লেভেল সর্বনিম্ন দূরত্বের পথ খোঁজা।'
  }
};

/**
 * Common prompt translation dictionary
 */
const COMMON_PROMPTS_BN: Record<string, string> = {
  'Type the missing code directly into the blanks with your keyboard:': 'আপনার কিবোর্ড দিয়ে সরাসরি ফাঁকা স্থানে প্রয়োজনীয় কোড টাইপ করুন:',
  'Tap tokens from the word bank below to complete the code:': 'কোড সম্পন্ন করতে নিচের শব্দভাণ্ডার থেকে টোকেনগুলো ট্যাপ করুন:',
  'Click directly on the line of code that introduces a bug or crash:': 'যে কোডের লাইনে বাগ বা ক্র্যাশ তৈরি হচ্ছে সরাসরি সেখানে ক্লিক করুন:',
  'Analyze the code and choose the exact stdout console output:': 'কোডটি বিশ্লেষণ করে কনসোলের সঠিক আউটপুট নির্বাচন করুন:',
  'Match all pairs to proceed': 'সব জোড়া মেলাতে হবে',
  'Select your answer and press Check': 'উত্তর নির্বাচন করে যাচাই করুন',
  'What does this C code output to the terminal?': 'এই C কোডটি টার্মিনালে কী আউটপুট দেবে?',
  'Spot the missing address-of (&) operator in scanf:': 'scanf-এ অনুপস্থিত address-of (&) অপারেটরটি চিহ্নিত করুন:',
  'Match foundational C standard library functions with their purpose:': 'C স্ট্যান্ডার্ড লাইব্রেরি ফাংশনগুলোর সাথে তাদের কাজ মেলান:',
  'What does this C pointer dereference print?': 'এই C পয়েন্টার ডিরিফারেন্সিং কী প্রিন্ট করবে?',
};

/**
 * Translates explanation text into natural Bengali when lang === 'bn'.
 * Preserves code syntax, variable names, keywords, and symbols.
 */
export function translateExplanation(text: string, lang: Language): string {
  if (lang !== 'bn' || !text) return text;

  // Direct pattern matching
  for (const [pattern, bnText] of EXPLANATION_PATTERNS_BN) {
    if (pattern.test(text)) {
      return bnText;
    }
  }

  // Common phrase replacements while keeping English code keywords
  return text;
}

/**
 * Translates prompt text into natural Bengali when lang === 'bn'.
 */
export function translatePrompt(prompt: string, lang: Language): string {
  if (lang !== 'bn' || !prompt) return prompt;

  if (COMMON_PROMPTS_BN[prompt]) {
    return COMMON_PROMPTS_BN[prompt];
  }

  return prompt;
}

/**
 * Returns a fully localized copy of a Question.
 * Keeps English code syntax intact while translating the explanation, prompt, mentor tip, and bug explanation.
 */
export function getLocalizedQuestion<T extends Question>(question: T, lang: Language): T {
  if (lang !== 'bn' || !question) return question;

  const qBn = QUESTION_TRANSLATIONS_BN[question.id];

  const localized: Question = {
    ...question,
    prompt: qBn?.prompt || translatePrompt(question.prompt, lang),
    explanation: qBn?.explanation || translateExplanation(question.explanation, lang),
    mentorTip: qBn?.mentorTip || (question.mentorTip ? translateExplanation(question.mentorTip, lang) : undefined),
  };

  if (question.type === 'spot-the-bug') {
    const sb = question as SpotTheBugQuestion;
    (localized as SpotTheBugQuestion).bugExplanation =
      qBn?.bugExplanation || translateExplanation(sb.bugExplanation, lang);
  }

  if (question.type === 'predict-output') {
    const po = question as PredictOutputQuestion;
    (localized as PredictOutputQuestion).options = po.options.map(opt => {
      let text = opt.text;
      if (opt.text === 'Compilation Error') text = 'কম্পাইলেশন এরর (Compilation Error)';
      else if (opt.text === 'Undefined Behavior') text = 'অনির্ধারিত আচরণ (Undefined Behavior)';
      else if (opt.text === 'Garbage Value') text = 'গারবেজ ভ্যালু (Garbage Value)';
      else if (opt.text === 'Address of val') text = 'val-এর মেমোরি ঠিকানা';
      return { ...opt, text };
    });
  }

  if (question.type === 'concept-match') {
    const cm = question as ConceptMatchQuestion;
    (localized as ConceptMatchQuestion).pairs = cm.pairs.map(pair => ({
      ...pair,
      definition: translateExplanation(pair.definition, lang),
    }));
  }

  return localized as T;
}

/**
 * Teaching Intro translations for nodes with character dialogues
 */
const TEACHING_INTRO_TRANSLATIONS_BN: Record<string, Partial<TeachingIntro>> = {
  'c-u1-n1': {
    title: 'বিশুদ্ধ C প্রোগ্রামিং এর সূচনা',
    steps: [
      {
        characterId: 'lin',
        characterMood: 'happy',
        speech: "বিশুদ্ধ C প্রোগ্রামিংয়ে স্বাগতম! 🕶️ C তে কোনো ক্লাস নেই, কোনো নেমস্পেস নেই এবং কোনো 'std::cout' নেই।\n\nC সরাসরি হার্ডওয়্যারের সাথে কাজ করে এবং অবিশ্বাস্য দ্রুত। লিনাক্স এবং উইন্ডোজের মতো অপারেটিং সিস্টেমের কার্নেল C তে লেখা! স্ক্রিনে প্রিন্ট করতে আমরা <stdio.h> (Standard Input/Output) যুক্ত করি এবং printf() ফাংশন ব্যবহার করি।",
        codeSnippet: '#include <stdio.h>\n\nint main(void) {\n    printf("Hello Coder!\\n");\n    return 0;\n}',
        anatomy: [
          { token: '#include <stdio.h>', explanation: 'Standard C I/O Header: printf, scanf সহ ইনপুট/আউটপুট টুলস লোড করে।' },
          { token: 'printf("...")', explanation: 'Formatted Print: টার্মিনাল স্ক্রিনে ফরম্যাট করা টেক্সট প্রদর্শন করে।' },
          { token: '\\n', explanation: 'Newline character: কার্সারকে পরের লাইনে নিয়ে যায়।' },
          { token: 'return 0;', explanation: 'Return code: অপারেটিং সিস্টেমকে জানায় কোডটি ০ এররে সফলভাবে চলেছে।' }
        ]
      },
      {
        characterId: 'junior',
        characterMood: 'thinking',
        speech: "দাঁড়ান লিন! 🧢 \\n কী আর main কেন return 0 করে?",
      },
      {
        characterId: 'byte',
        characterMood: 'cheering',
        speech: "অসাধারণ! 🎉 আপনি বিশুদ্ধ C এর প্রথম আসল কোড লিখে ফেলেছেন!\n\nএবার নিচের প্রশ্নগুলোতে আপনার প্রোগ্রামিং দক্ষতা পরীক্ষা করুন!",
        interactiveTry: {
          prompt: 'টার্মিনালে আউটপুট পাঠানোর কোড লাইনটি সাজান',
          tokens: ['printf(', '"Hello, World!\\n"', ');'],
          targetOrder: ['printf(', '"Hello, World!\\n"', ');'],
          previewOutput: 'Hello, World!'
        }
      }
    ]
  },
  'c-u1-n2': {
    title: 'Printf ফরম্যাট স্পেসিফায়ার',
    steps: [
      {
        characterId: 'ada',
        characterMood: 'happy',
        speech: "C তে printf কিন্তু নিজে থেকে বুঝতে পারে না আপনি কোন ডেটা টাইপ পাস করছেন! তাই Format Specifiers ব্যবহার করতে হয়:\n\n• %d : Integer (দশমিক int)\n• %f : Float / Double (দশমিক সংখ্যা)\n• %c : Character (একক char বর্ণ)\n• %s : String (টেক্সট স্ট্রিং)",
      }
    ]
  },
  'c-u6-n2': {
    title: 'পয়েন্টার ও র‍্যাম মেমোরি ঠিকানা',
    steps: [
      {
        characterId: 'byte',
        characterMood: 'happy',
        speech: "C তে প্রতিটি ভ্যারিয়েবল র‍্যামের একটি নির্দিষ্ট সংখ্যাভিত্তিক মেমোরি ঠিকানায় থাকে।\n\n• &variable : Address-of অপারেটর, ভ্যারিয়েবলের মেমোরি ঠিকানা বের করে।\n• int* ptr : Pointer variable, সেই ঠিকানা সংরক্ষণের জন্য ডিক্লেয়ার করে।\n• *ptr : Dereference operator, সেই ঠিকানায় থাকা মূল মানটি পড়ে বা পরিবর্তন করে!",
      }
    ]
  },
  'cpp-u1-n1': {
    title: 'C++ এর সূচনা ও std::cout',
    steps: [
      {
        characterId: 'byte',
        characterMood: 'happy',
        speech: "হ্যালো কোডার! 🐈‍⬛ আমি নিয়ান (Nyan), তোমার কিউট ব্ল্যাক ক্যাট কোডিং কম্প্যানিয়ন। C++ এ স্বাগতম!\n\nকুইজ শুরুর আগে চলুন শিখি কীভাবে কম্পিউটারকে স্ক্রিনে কথা বলাতে হয়। C++ এ আমরা std::cout (pronounced 'see-out') কমান্ড দিয়ে এটি করি!",
        codeSnippet: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
        anatomy: [
          { token: 'std::', explanation: 'Standard namespace. C++ এর স্ট্যান্ডার্ড লাইব্রেরি টুলস ব্যবহারের নির্দেশ।' },
          { token: 'cout', explanation: 'Character Output (pronounced "see-out"). টার্মিনালে টেক্সট পাঠায়।' },
          { token: '<<', explanation: 'Stream Insertion operator. তীরচিহ্নের মতো টেক্সটকে স্ক্রিনে ঠেলে দেয়!' },
          { token: '"Hello, World!"', explanation: 'String literal. ডাবল কোটেশনের ভেতরের টেক্সট বার্তা।' },
          { token: 'std::endl', explanation: 'End Line. টার্মিনালে পরের লাইনে যাওয়ার জন্য এন্টার প্রেস করে।' },
          { token: ';', explanation: 'Semicolon. C++ এ প্রতিটি নির্দেশ অবশ্যই সেমিকোলন দিয়ে শেষ করতে হয়।' }
        ]
      },
      {
        characterId: 'junior',
        characterMood: 'thinking',
        speech: "দাঁড়ান নিয়ান! 🧢 তীরচিহ্নগুলো ডানদিকে না গিয়ে বামদিকে (<<) কেন যাচ্ছে?",
        anatomy: [
          { token: 'std::cout << "Data"', explanation: 'Stream Insertion: তীর বামে নির্দেশ করে কারণ ডেটা ডান থেকে স্ক্রিনের ভেতরে প্রবেশ করে!' },
          { token: 'std::cin >> variable', explanation: 'Stream Extraction: ইনপুটের ক্ষেত্রে তীর ডানে যায় কারণ কীবোর্ড থেকে ডেটা ভ্যারিয়েবলে যায়।' }
        ]
      },
      {
        characterId: 'byte',
        characterMood: 'cheering',
        speech: "দারুণ! 🎉 আপনি C++ এর প্রথম আসল লাইন লিখে ফেললেন!\n\nপ্রতিটি C++ প্রোগ্রাম একে #include <iostream> এবং int main() { ... } এর ভেতর রাখে।\n\nএবার নিচের মাইক্রো-চ্যালেঞ্জগুলো দিয়ে নিজের ধারণা ঝালিয়ে নিন!",
        interactiveTry: {
          prompt: 'টার্মিনালে প্রথম বার্তা পাঠানোর কোড লাইনটি সাজান',
          tokens: ['std::cout', '<<', '"Hello, World!"', '<<', 'std::endl', ';'],
          targetOrder: ['std::cout', '<<', '"Hello, World!"', '<<', 'std::endl', ';'],
          previewOutput: 'Hello, World!'
        }
      }
    ]
  },
  'cpp-u1-n2': {
    title: 'ভ্যারিয়েবল ও মেমোরি বক্স',
    steps: [
      {
        characterId: 'ada',
        characterMood: 'happy',
        speech: "হাই! আমি অ্যাডা 👧। মেমোরি ছাড়া কম্পিউটার সবকিছু সাথে সাথে ভুলে যেত!\n\nC++ এ ভ্যারিয়েবল হলো নামযুক্ত বাক্সের মতো যেখানে সংখ্যা, শব্দ ইত্যাদি রাখি। তবে C++ এ বাক্সের ধরন (Data Type) আগে থেকেই বলে দিতে হয়!",
        anatomy: [
          { token: 'int', explanation: 'Integer type: পূর্ণসংখ্যা (যেমন: 42, -5, 0)। মেমোরিতে ৪ বাইট নেয়।' },
          { token: 'double', explanation: 'Double floating-point: দশমিক সংখ্যা (যেমন: 3.14, 9.99)। মেমোরিতে ৮ বাইট নেয়।' },
          { token: 'char', explanation: 'Character type: একক ক্যারেক্টার বা বর্ণ (যেমন: \'A\', \'z\')।' },
          { token: 'std::string', explanation: 'String object: টেক্সট বা স্ট্রিং (যেমন: "CoderBhai")।' }
        ]
      }
    ]
  },
  'py-u1-n1': {
    title: 'পাইথনের সহজ সিনট্যাক্স',
    steps: [
      {
        characterId: 'byte',
        characterMood: 'happy',
        speech: "পাইথনে স্বাগতম! 🐍 C++ যদি হয় ফর্মুলা ওয়ান রেস কার, তবে পাইথন হলো অত্যাধুনিক ইলেকট্রিক স্পেসশিপ।\n\nএখানে কোনো সেমিকোলন নেই, জটিল বয়লারপ্লেট নেই। সরাসরি স্ক্রিনে লিখতে print() ব্যবহার করলেই চলে!",
        codeSnippet: 'print("Hello, Coder!")',
      }
    ]
  },
  'oop-u1-n1': {
    title: 'অবজেক্ট ওরিয়েন্টেড প্রোগ্রামিং',
    steps: [
      {
        characterId: 'turing',
        characterMood: 'happy',
        speech: "OOP তে স্বাগতম! 🤖 সাধারণ কোডে ডেটা আর ফাংশন আলাদা ঘুরে বেড়ায়। OOP তে আমরা তাদের একসাথে অবজেক্ট হিসেবে সাজিয়ে রাখি!\n\nক্লাস হলো একটি বাড়ির ব্লুপ্রিন্ট বা নকশা, আর অবজেক্ট হলো সেই নকশা অনুযায়ী তৈরি আসল বাড়ি।",
      }
    ]
  },
  'dsa-u1-n1': {
    title: 'ডেটা স্ট্রাকচার ও মেমোরি',
    steps: [
      {
        characterId: 'lin',
        characterMood: 'happy',
        speech: "ডেটা স্ট্রাকচারে স্বাগতম! 🕶️ র‍্যামে অ্যারে হলো পাশাপাশি সাজানো লকারের মতো।\n\n৪২ নম্বর লকার খুঁজতে ০, ১, ২ ধরে খোঁজার দরকার নেই—সরাসরি ৪২ এ যাওয়া যায়! তাই অ্যারে ইনডেক্সিং হলো তাত্ক্ষণিক O(1) সময়ের ব্যাপার!",
      }
    ]
  },
  'algo-u1-n1': {
    title: 'অ্যালগরিদম ও সময় জটিলতা',
    steps: [
      {
        characterId: 'ada',
        characterMood: 'happy',
        speech: "অ্যালগরিদমে স্বাগতম! 👧 অ্যালগরিদম হলো সমস্যা সমাধানের রেসিপি।\n\n১,০০০ পাতার ফোনবইয়ে নাম খুঁজতে পাতা ধরে ধরে খুঁজলে ১,০০০ ধাপ লাগে (O(N))। কিন্তু প্রতিবার অর্ধেক করে খুঁজলে মাত্র ১০ ধাপেই পাওয়া যায় (O(log N))!",
      }
    ]
  }
};

/**
 * Returns a fully localized copy of a LessonNode.
 */
export function getLocalizedNode(node: LessonNode, lang: Language): LessonNode {
  if (lang !== 'bn' || !node) return node;

  const nodeBn = NODE_TRANSLATIONS_BN[node.id];
  const introBn = TEACHING_INTRO_TRANSLATIONS_BN[node.id];

  const localizedQuestions = node.questions.map(q => getLocalizedQuestion(q, lang));

  let localizedIntro: TeachingIntro | undefined = node.teachingIntro;
  if (node.teachingIntro) {
    if (introBn) {
      localizedIntro = {
        ...node.teachingIntro,
        title: introBn.title || node.teachingIntro.title,
        steps: node.teachingIntro.steps.map((step, idx) => {
          const stepBn = introBn.steps?.[idx];
          return {
            ...step,
            speech: stepBn?.speech || translateExplanation(step.speech, lang),
            anatomy: stepBn?.anatomy || step.anatomy?.map(a => ({
              ...a,
              explanation: translateExplanation(a.explanation, lang),
            })),
            interactiveTry: stepBn?.interactiveTry || step.interactiveTry,
          };
        }),
      };
    } else {
      localizedIntro = {
        ...node.teachingIntro,
        steps: node.teachingIntro.steps.map(step => ({
          ...step,
          speech: translateExplanation(step.speech, lang),
          anatomy: step.anatomy?.map(a => ({
            ...a,
            explanation: translateExplanation(a.explanation, lang),
          })),
        })),
      };
    }
  }

  return {
    ...node,
    title: nodeBn?.title || node.title,
    description: nodeBn?.description || translateExplanation(node.description, lang),
    teachingIntro: localizedIntro,
    questions: localizedQuestions,
  };
}
