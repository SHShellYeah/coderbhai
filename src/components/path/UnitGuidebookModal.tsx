import React from 'react';
import { Unit } from '../../types';
import { BookOpen, X, CheckCircle, Code2 } from 'lucide-react';

interface Props {
  unit: Unit;
  onClose: () => void;
}

export const UnitGuidebookModal: React.FC<Props> = ({ unit, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop">
      <div className="w-full max-w-lg bg-white dark:bg-[#1A282F] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative flex flex-col gap-5 max-h-[85vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-blue/15 text-brand-blue flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-brand-blue">
              Unit Guidebook
            </span>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">
              {unit.title}
            </h3>
          </div>
        </div>

        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          {unit.description}
        </p>

        {/* Key Takeaways */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Unit Key Concepts
          </span>
          {unit.nodes.map(node => (
            <div
              key={node.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3"
            >
              <div className="w-7 h-7 rounded-lg bg-brand-green/20 text-brand-green flex items-center justify-center shrink-0 mt-0.5">
                <Code2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-800 dark:text-slate-200">
                  {node.title}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  {node.description}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Complete all nodes in this unit to unlock advanced mastery!
        </div>

        <button
          type="button"
          onClick={onClose}
          className="btn-3d btn-3d-green w-full py-3 rounded-2xl text-sm font-black uppercase tracking-wider"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};
