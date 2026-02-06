import React, { useMemo } from 'react';

// PUBLIC_INTERFACE
export default function SentenceDisplay({ sentence, typed }) {
  /** Renders sentence text with per-character status based on current typed input. */
  const chars = useMemo(() => sentence.split(''), [sentence]);
  const typedChars = typed.split('');

  return (
    <div className="tc-sentence" aria-label="Sentence to type" role="article">
      {chars.map((ch, idx) => {
        const typedCh = typedChars[idx];
        const isCurrent = idx === typedChars.length;
        const isTyped = idx < typedChars.length;

        let className = 'tc-char';
        if (isCurrent) className += ' tc-char-current';
        if (isTyped && typedCh === ch) className += ' tc-char-correct';
        if (isTyped && typedCh !== ch) className += ' tc-char-incorrect';

        // Preserve spaces for visibility & selection
        const display = ch === ' ' ? '\u00A0' : ch;

        return (
          <span key={`${idx}-${ch}`} className={className} aria-hidden="true">
            {display}
          </span>
        );
      })}
      <span className="sr-only">{sentence}</span>
    </div>
  );
}
