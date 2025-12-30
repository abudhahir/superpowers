const TECHNICAL_KEYWORDS = [
  'React', 'Vue', 'Angular', 'API', 'REST', 'GraphQL',
  'database', 'SQL', 'MongoDB', 'PostgreSQL',
  'performance', 'optimization', 'optimize', 'benchmark',
  'security', 'authentication', 'encryption',
  'deployment', 'CI/CD', 'Docker', 'Kubernetes',
  'testing', 'TDD', 'debugging',
  'TypeScript', 'JavaScript', 'Python', 'Node.js',
];

export interface ComplexityResult {
  isComplex: boolean;
  reasons: string[];
  keywords: string[];
  score: number;
}

export function detectComplexity(message: string, threshold: number = 3): ComplexityResult {
  const reasons: string[] = [];
  const keywords: string[] = [];
  let score = 0;

  // Check message length
  const wordCount = message.split(/\s+/).length;
  if (wordCount > 50) {
    reasons.push('length');
    score += 2;
  }

  // Check for technical keywords
  const foundKeywords = TECHNICAL_KEYWORDS.filter(keyword =>
    message.toLowerCase().includes(keyword.toLowerCase())
  );
  if (foundKeywords.length > 0) {
    reasons.push('keywords');
    keywords.push(...foundKeywords);
    score += foundKeywords.length;
  }

  // Check for code blocks
  if (/```[\s\S]*```/.test(message) || /`[^`]+`/.test(message)) {
    reasons.push('code-blocks');
    score += 3;
  }

  // Check for multiple questions
  const questionCount = (message.match(/\?/g) || []).length;
  if (questionCount > 1) {
    reasons.push('multiple-questions');
    score += 2;
  }

  // Check for file paths
  if (/\/[\w\-\.\/]+\.(js|ts|py|go|rs|java)/.test(message)) {
    reasons.push('file-paths');
    score += 1;
  }

  return {
    isComplex: score >= threshold,
    reasons,
    keywords,
    score,
  };
}
