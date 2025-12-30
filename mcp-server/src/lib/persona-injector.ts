interface Agent {
  name: string;
  expertise: string[];
  principles?: string[];
  focus?: string;
}

export function formatPersonas(
  agents: Agent[],
  detail: 'full' | 'minimal' = 'full'
): string {
  if (agents.length === 0) {
    return '';
  }

  const sections: string[] = ['# Active Expert Personas', ''];
  sections.push('The following specialized experts are available to assist with this request:');
  sections.push('');

  for (const agent of agents) {
    sections.push(`## ${toTitleCase(agent.name)}`);

    if (detail === 'full') {
      sections.push(`**Expertise:** ${agent.expertise.join(', ')}`);

      if (agent.principles && agent.principles.length > 0) {
        sections.push('**Working Principles:**');
        for (const principle of agent.principles) {
          sections.push(`- ${principle}`);
        }
      }

      if (agent.focus) {
        sections.push(`**Focus areas for this request:** ${agent.focus}`);
      }
    } else {
      // Minimal: just expertise
      sections.push(`Expertise: ${agent.expertise.slice(0, 3).join(', ')}`);
    }

    sections.push('');
  }

  sections.push('---');
  sections.push('');

  return sections.join('\n');
}

function toTitleCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
