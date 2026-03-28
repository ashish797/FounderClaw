export type Host = 'claude' | 'codex';

export interface HostPaths {
  skillRoot: string;
  localSkillRoot: string;
  binDir: string;
  browseDir: string;
  designDir: string;
}

export const HOST_PATHS: Record<Host, HostPaths> = {
  claude: {
    skillRoot: '~/.claude/skills/founderclaw',
    localSkillRoot: '.claude/skills/founderclaw',
    binDir: 'founderclaw/bin',
    browseDir: 'founderclaw/browse/dist',
    designDir: 'founderclaw/design/dist',
  },
  codex: {
    skillRoot: '$FOUNDERCLAW_ROOT',
    localSkillRoot: '.agents/skills/founderclaw',
    binDir: '$FOUNDERCLAW_BIN',
    browseDir: '$FOUNDERCLAW_BROWSE',
    designDir: '$FOUNDERCLAW_DESIGN',
  },
};

export interface TemplateContext {
  skillName: string;
  tmplPath: string;
  benefitsFrom?: string[];
  host: Host;
  paths: HostPaths;
  preambleTier?: number;  // 1-4, controls which preamble sections are included
}
