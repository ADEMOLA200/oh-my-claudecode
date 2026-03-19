import { describe, expect, it } from 'vitest';
import { createMagicKeywordProcessor, detectMagicKeywords } from '../features/magic-keywords.js';

describe('magic keyword regex safety', () => {
  it('detects escaped punctuation triggers literally without regex injection', () => {
    expect(detectMagicKeywords('please c++ this', { ultrawork: ['c++'] })).toEqual(['c++']);
    expect(detectMagicKeywords('please (.*){10} this', { ultrawork: ['(.*){10}'] })).toEqual(['(.*){10}']);
  });

  it('processes punctuation triggers without throwing or compiling attacker regex', () => {
    const processPrompt = createMagicKeywordProcessor({ ultrawork: ['c++'] });
    expect(() => processPrompt('c++ fix this')).not.toThrow();
    expect(processPrompt('c++ fix this')).toContain('ULTRAWORK MODE ENABLED!');
  });

  it('does not match punctuation triggers inside larger word characters', () => {
    expect(detectMagicKeywords('xc++y', { ultrawork: ['c++'] })).toEqual([]);
  });
});
