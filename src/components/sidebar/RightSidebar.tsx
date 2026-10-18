import React from 'react';
import { useGame } from '../../context/GameContext';
import { useTranslation } from '../../data/translations';
import { sound } from '../../utils/audio';
import { CatFace } from '../common/CatFace';
import {
  Trophy,
  Target,
  RotateCcw,
  Sparkles,
  Zap,
  Lightbulb,
  CheckCircle,
  Heart,
  ChevronRight,
  Palette,
  Moon,
  Sun,
  Terminal,
  Code2,
  GraduationCap,
  User,
  Cloud,
  Crown
} from 'lucide-react';

interface Props {
  onOpenPractice: () => void;
  onOpenPlacement: () => void;
  onOpenSettings?: () => void;
  onOpenIdeaZone?: () => void;
  onOpenCodeZone?: () => void;
  onOpenAuth?: (tab?: 'login' | 'register') => void;
  filter?: 'all' | 'practice' | 'quests' | 'leaderboard' | 'settings';
}

export const RightSidebar: React.FC<Props> = ({
  onOpenPractice,
  onOpenPlacement,
  onOpenSettings,
  onOpenIdeaZone,
  onOpenCodeZone,
  onOpenAuth,
  filter = 'all',
}) => {
  const { state, toggleDarkMode } = useGame();
  const t = useTranslation(state.language);
  const isAdmin = state.role === 'admin' || state.authUser?.role === 'admin';

  const mockLeaderboard = [
    { rank: 1, name: 'Linus T.', xp: 620, avatar: '🐧', isUser: false },
    { rank: 2, name: 'Grace H.', xp: 510, avatar: '🚀', isUser: false },
    { rank: 3, name: 'Bjarne S.', xp: 440, avatar: '⚡', isUser: false },
    { rank: 4, name: 'You (ByteSized Champion)', xp: state.xp, avatar: '🐈‍⬛', isUser: true },
    { rank: 5, name: 'Ada L.', xp: 220, avatar: '✨', isUser: false },
  ];

  // Daily CS Wisdom
  const csTips = [
    'Amortized analysis proves vector capacity doubling gives O(1) average append time.',
    'RAII guarantees zero memory leaks by coupling resource lifetime to object scope.',
    'Prefer Python generator expressions ( ) over [ ] to conserve RAM on large datasets.',
    'Always use virtual destructors in polymorphic C++ base classes to avoid UB!',
    'Hash tables provide O(1) average lookup, but degrade to O(N) if collisions peak.'
  ];
  const tipOfTheDay = csTips[state.streak % csTips.length];

  const showPractice = filter === 'all' || filter === 'practice';
  const showQuests = filter === 'all' || filter === 'quests';
  const showLeaderboard = filter === 'all' || filter === 'leaderboard';
  const showSettings = filter === 'all' || filter === 'settings';

  return (
    <aside className="w-full lg:w-80 flex flex-col gap-5 py-4 lg:py-6 px-3 sm:px-4">
      {/* ByteSized Account & Student .EDU Perks Card */}
      {onOpenAuth && (filter === 'all' || filter === 'practice' || filter === 'settings') && (
        <div className="relative overflow-hidden p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-amber-500/10 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-slate-900/40 border-2 border-indigo-500/20 dark:border-indigo-500/30 shadow-sm text-left flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black shadow-md ${
                isAdmin
                  ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400/50'
                  : 'bg-indigo-600 text-white shadow-indigo-500/20'
              }`}>
                {isAdmin ? <Crown className="w-5 h-5 fill-current" /> : state.authUser ? <User className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 leading-tight truncate">
                    {state.authUser ? (state.authUser.displayName || state.authUser.email?.split('@')[0]) : 'ByteSized Account'}
                  </h4>
                  {isAdmin ? (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 border border-amber-300">
                      👑 Admin
                    </span>
                  ) : state.authUser ? (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/40">
                      User
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {isAdmin ? (
                    <span className="text-amber-500 dark:text-amber-400 font-bold flex items-center gap-1">
                      👑 Unlimited 💖 &amp; 💎
                    </span>
                  ) : state.authUser ? (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle className="w-3 h-3" /> Synced
                    </span>
                  ) : (
                    <span>Save your learning progress</span>
                  )}
                </div>
              </div>
            </div>
            {isAdmin ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse">
                👑 ♾️ Unlimited
              </span>
            ) : state.unlimitedHeartsUntil && Date.now() < state.unlimitedHeartsUntil ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 animate-pulse">
                ♾️ Unlimited
              </span>
            ) : null}
          </div>

          {!state.authUser ? (
            <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-indigo-500/20 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>🎓 .EDU Student Perk</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Register with your school <span className="font-mono font-bold text-indigo-600 dark:text-indigo-300">.edu</span> email to get <span className="font-black text-amber-500">+200 Diamonds 💎</span> &amp; <span className="font-black text-rose-500">Unlimited Hearts ❤️</span> for 2 days!
              </p>
            </div>
          ) : (
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Connected as <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">{state.authUser.email}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenAuth?.(state.authUser ? 'login' : 'register');
            }}
            className={`btn-3d w-full py-2.5 px-3 rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-2 cursor-pointer ${
              state.authUser
                ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-b-2 border-slate-300 dark:border-slate-900'
                : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:brightness-110 text-white shadow-md border-b-2 border-indigo-800'
            }`}
          >
            {state.authUser ? (
              <>
                <User className="w-3.5 h-3.5" />
                <span>Manage Profile &amp; Role</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Sign Up</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Dev Hub: IdeaZone & CodeZone */}
      {(filter === 'all' || filter === 'practice') && (
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 shadow-sm text-left flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-500 text-white flex items-center justify-center font-black shadow-sm text-sm">
                ⚡
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 leading-tight">
                  Developer Hub
                </h4>
                <span className="text-[11px] font-semibold text-slate-400">
                  Idea Vault & Playground
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-0.5">
            {onOpenIdeaZone && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenIdeaZone();
                }}
                className="btn-3d flex flex-col p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5 w-full">
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
                    <Lightbulb className="w-4 h-4 fill-white" />
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                  {t.ideaZone || 'IdeaZone'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5">
                  Notes & Vault
                </span>
              </button>
            )}

            {onOpenCodeZone && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenCodeZone();
                }}
                className="btn-3d flex flex-col p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5 w-full">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                  {t.codeZone || 'CodeZone'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5">
                  Live Compiler
                </span>
              </button>
            )}
          </div>
        </div>
      )}
      {/* Settings / Appearance Card (on mobile settings view) */}
      {filter === 'settings' && (
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 shadow-sm text-left flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-primary/15 text-brand-primary flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <h4 className="text-base font-black text-slate-800 dark:text-slate-100">
              {t.appearanceMode}
            </h4>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2.5">
              {state.darkMode ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                  {state.darkMode ? t.darkAppearance : t.lightAppearance}
                </span>
                <span className="text-[11px] text-slate-400">
                  {state.darkMode ? 'OLED Dark' : 'Crisp Light'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                toggleDarkMode();
              }}
              className="btn-3d px-3 py-1.5 rounded-xl text-xs font-black uppercase bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 border-b-2 border-slate-300 dark:border-slate-900 cursor-pointer"
            >
              {t.toggle}
            </button>
          </div>
        </div>
      )}

      {/* Hearts Low Warning Card */}
      {showPractice && state.hearts < 5 && (
        <div className="p-4 rounded-3xl bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-between gap-3 animate-wiggle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-rose text-white flex items-center justify-center">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div className="text-left">
              <div className="text-sm font-black text-slate-800 dark:text-slate-100">
                {state.hearts} / 5 {t.hearts}
              </div>
              <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                {t.practiceRefillHearts}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenPractice}
            className="btn-3d btn-3d-rose px-3 py-1.5 rounded-xl text-xs font-black uppercase cursor-pointer"
          >
            {t.refill}
          </button>
        </div>
      )}

      {/* Weak Areas / Practice Mistakes Widget */}
      {showPractice && (
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 shadow-sm text-left flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-purple/15 text-brand-purple flex items-center justify-center">
                <RotateCcw className="w-4 h-4" />
              </div>
              <h4 className="text-base font-black text-slate-800 dark:text-slate-100">
                {t.weakAreas}
              </h4>
            </div>
            <span className="text-xs font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
              {state.mistakes.length} {t.logged}
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {state.mistakes.length > 0
              ? t.pendingMistakes(state.mistakes.length)
              : t.zeroMistakes}
          </p>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenPractice();
            }}
            className="btn-3d btn-3d-purple w-full py-2.5 px-3 rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t.practiceMistakesBtn}
          </button>
        </div>
      )}

      {/* Daily Quests Widget */}
      {showQuests && (
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 shadow-sm text-left flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <h4 className="text-base font-black text-slate-800 dark:text-slate-100">
                {t.dailyQuests}
              </h4>
            </div>
            <span className="text-xs font-bold text-slate-400">{t.resetsDaily}</span>
          </div>

          <div className="flex flex-col gap-3">
            {state.quests.map(quest => (
              <div key={quest.id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <span>{quest.icon}</span>
                    <span>{quest.title}</span>
                  </span>
                  <span className="font-mono text-slate-400">
                    {quest.progress} / {quest.target}
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      quest.completed ? 'bg-brand-primary' : 'bg-brand-gold'
                    }`}
                    style={{
                      width: `${Math.min(100, (quest.progress / quest.target) * 100)}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span>Reward: +{quest.rewardXp} XP, +{quest.rewardGems} 💎</span>
                  {quest.completed && (
                    <span className="text-brand-primary font-bold flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3" /> Done
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Leaderboard Mock */}
      {showLeaderboard && (
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 shadow-sm text-left flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-800 dark:text-slate-100 leading-tight">
                  {t.diamondLeague}
                </h4>
                <span className="text-[11px] font-bold text-slate-400">
                  {t.topThreeAdvance}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {mockLeaderboard.map(user => (
              <div
                key={user.rank}
                className={`p-2.5 rounded-2xl flex items-center justify-between transition-all ${
                  user.isUser
                    ? 'bg-brand-primary/15 text-brand-primary font-black border border-brand-primary/30 dark:bg-brand-primary/20'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300 font-bold'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 text-center text-xs font-black text-slate-400">
                    {user.rank}
                  </span>
                  <span className="flex items-center justify-center">
                    {user.isUser ? <CatFace size="xs" mood="happy" /> : <span className="text-lg">{user.avatar}</span>}
                  </span>
                  <span className="text-xs md:text-sm flex items-center gap-1.5">
                    <span>{user.name}</span>
                    {user.isUser && (
                      isAdmin ? (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full font-black uppercase bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 border border-amber-300">
                          👑 Admin
                        </span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full font-black uppercase bg-purple-500/20 text-purple-400 border border-purple-500/40">
                          User
                        </span>
                      )
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-1 font-mono text-xs font-extrabold text-amber-500">
                  <Zap className="w-3 h-3 fill-current" />
                  <span>{user.xp} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CS Tip of the Day Card */}
      {(showQuests || showLeaderboard) && (
        <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500/20 text-left flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase text-indigo-500 tracking-wider">
              {t.engineersWisdom}
            </span>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {tipOfTheDay}
            </p>
          </div>
        </div>
      )}

      {/* Personalize Theme & Sounds Button */}
      {showSettings && onOpenSettings && (
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onOpenSettings();
          }}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-300 text-xs font-black uppercase transition-all cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-brand-secondary" />
            {t.themesAndSounds}
          </span>
          <ChevronRight className="w-4 h-4 text-purple-400" />
        </button>
      )}

      {/* Quick Test Out / Placement link */}
      {(showSettings || showPractice) && (
        <button
          type="button"
          onClick={onOpenPlacement}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black uppercase transition-all cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-accent" />
            {t.testOutPlacement}
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      )}
    </aside>
  );
};
