import { SkillParser } from '../../../lib/skill-parser.js';

describe('SkillParser', () => {
  it('should extract steps from markdown headers', () => {
    const markdown = `
# TDD
## Red-Green-Refactor
### RED - Write Failing Test
Write a test.
### GREEN - Pass
Write code.
    `;
    const steps = SkillParser.parseSteps(markdown);
    expect(steps[0].name).toBe('RED - Write Failing Test');
    expect(steps[1].name).toBe('GREEN - Pass');
    expect(steps[0].context[0]).toBe('Write a test.');
  });
});
