import React, { useEffect, useRef } from 'react';

// PUBLIC_INTERFACE
export default function TypingInput({
  value,
  onChange,
  disabled,
  onEnter,
  placeholder = 'Start typing here…',
  autoFocus = false,
}) {
  /** Controlled input for typing. Handles Enter key optionally and supports auto-focus. */
  const ref = useRef(null);

  useEffect(() => {
    if (autoFocus && ref.current && !disabled) {
      ref.current.focus();
    }
  }, [autoFocus, disabled]);

  return (
    <div>
      <label className="tc-label" htmlFor="typing-input">
        Your input
      </label>
      <input
        id="typing-input"
        ref={ref}
        className="tc-input"
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onEnter) onEnter();
        }}
        aria-describedby="typing-hint"
      />
      <div id="typing-hint" className="tc-muted" style={{ marginTop: 8 }}>
        Tip: Accuracy matters—errors lower your WPM.
      </div>
    </div>
  );
}
