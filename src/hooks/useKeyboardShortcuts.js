import { useEffect } from 'react';

/**
 * Global keyboard shortcut handler.
 *
 * @param {Object} shortcuts - Map of key to handler function
 *   Keys can be single characters or special names: 'Space', 'ArrowRight', 'ArrowLeft', 'Escape'
 * @param {Object} options
 * @param {boolean} options.ignoreInputs - Skip shortcuts when focus is in input/textarea (default true)
 * @param {boolean} options.ignoreModifiers - Skip shortcuts when Ctrl/Meta is held (default true)
 */
export function useKeyboardShortcuts(shortcuts = {}, options = {}) {
  const { ignoreInputs = true, ignoreModifiers = true } = options;

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Skip when typing in inputs
      if (ignoreInputs) {
        const tag = e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        if (e.target.isContentEditable) return;
      }

      // Skip modifier combos unless explicitly handled
      if (ignoreModifiers && (e.ctrlKey || e.metaKey)) return;

      const key = e.key;
      const handler = shortcuts[key] || shortcuts[key.toLowerCase()];

      if (handler) {
        e.preventDefault();
        handler(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, ignoreInputs, ignoreModifiers]);
}
