import { describe, it, expect } from '@jest/globals';

describe('Complexity Detection', () => {
  it('should detect complex messages based on length', async () => {
    const { detectComplexity } = await import('../../../mcp-server/dist/lib/detection.js');

    const shortMessage = 'hello world';
    const longMessage = 'help me build a React component with state management and hooks '.repeat(5);

    expect(detectComplexity(shortMessage).isComplex).toBe(false);
    expect(detectComplexity(longMessage).isComplex).toBe(true);
    expect(detectComplexity(longMessage).reasons).toContain('length');
  });

  it('should detect technical keywords', async () => {
    const { detectComplexity } = await import('../../../mcp-server/dist/lib/detection.js');

    const message = 'optimize the React component performance';
    const result = detectComplexity(message);

    expect(result.isComplex).toBe(true);
    expect(result.reasons).toContain('keywords');
    expect(result.keywords).toEqual(expect.arrayContaining(['React', 'performance']));
  });

  it('should detect code blocks', async () => {
    const { detectComplexity } = await import('../../../mcp-server/dist/lib/detection.js');

    const messageWithCode = 'Fix this code:\n```js\nfunction test() {}\n```';
    const result = detectComplexity(messageWithCode);

    expect(result.isComplex).toBe(true);
    expect(result.reasons).toContain('code-blocks');
  });

  it('should detect multiple questions', async () => {
    const { detectComplexity } = await import('../../../mcp-server/dist/lib/detection.js');

    const message = 'How do I use React hooks? What about performance? Should I use Redux?';
    const result = detectComplexity(message);

    expect(result.isComplex).toBe(true);
    expect(result.reasons).toContain('multiple-questions');
  });
});
