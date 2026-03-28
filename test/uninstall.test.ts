import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const ROOT = path.resolve(import.meta.dir, '..');
const UNINSTALL = path.join(ROOT, 'bin', 'founderclaw-uninstall');

describe('founderclaw-uninstall', () => {
  test('syntax check passes', () => {
    const result = spawnSync('bash', ['-n', UNINSTALL], { stdio: 'pipe' });
    expect(result.status).toBe(0);
  });

  test('--help prints usage and exits 0', () => {
    const result = spawnSync('bash', [UNINSTALL, '--help'], { stdio: 'pipe' });
    expect(result.status).toBe(0);
    const output = result.stdout.toString();
    expect(output).toContain('founderclaw-uninstall');
    expect(output).toContain('--force');
    expect(output).toContain('--keep-state');
  });

  test('unknown flag exits with error', () => {
    const result = spawnSync('bash', [UNINSTALL, '--bogus'], {
      stdio: 'pipe',
      env: { ...process.env, HOME: '/nonexistent' },
    });
    expect(result.status).toBe(1);
    expect(result.stderr.toString()).toContain('Unknown option');
  });

  describe('integration tests with mock layout', () => {
    let tmpDir: string;
    let mockHome: string;
    let mockGitRoot: string;

    beforeEach(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'founderclaw-uninstall-test-'));
      mockHome = path.join(tmpDir, 'home');
      mockGitRoot = path.join(tmpDir, 'repo');

      // Create mock founderclaw install layout
      fs.mkdirSync(path.join(mockHome, '.claude', 'skills', 'founderclaw'), { recursive: true });
      fs.writeFileSync(path.join(mockHome, '.claude', 'skills', 'founderclaw', 'SKILL.md'), 'test');

      // Create per-skill symlinks (both old unprefixed and new prefixed)
      fs.symlinkSync('founderclaw/review', path.join(mockHome, '.claude', 'skills', 'review'));
      fs.symlinkSync('founderclaw/ship', path.join(mockHome, '.claude', 'skills', 'founderclaw-ship'));

      // Create a non-founderclaw symlink (should NOT be removed)
      fs.mkdirSync(path.join(mockHome, '.claude', 'skills', 'other-tool'), { recursive: true });

      // Create state directory
      fs.mkdirSync(path.join(mockHome, '.founderclaw', 'projects'), { recursive: true });
      fs.writeFileSync(path.join(mockHome, '.founderclaw', 'config.json'), '{}');

      // Create mock git repo
      fs.mkdirSync(mockGitRoot, { recursive: true });
      spawnSync('git', ['init', '-b', 'main'], { cwd: mockGitRoot, stdio: 'pipe' });
    });

    afterEach(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    test('--force removes global Claude skills and state', () => {
      const result = spawnSync('bash', [UNINSTALL, '--force'], {
        stdio: 'pipe',
        env: {
          ...process.env,
          HOME: mockHome,
          FOUNDERCLAW_DIR: path.join(mockHome, '.claude', 'skills', 'founderclaw'),
          FOUNDERCLAW_STATE_DIR: path.join(mockHome, '.founderclaw'),
        },
        cwd: mockGitRoot,
      });

      expect(result.status).toBe(0);
      const output = result.stdout.toString();
      expect(output).toContain('founderclaw uninstalled');

      // Global skill dir should be removed
      expect(fs.existsSync(path.join(mockHome, '.claude', 'skills', 'founderclaw'))).toBe(false);

      // Per-skill symlinks pointing into founderclaw/ should be removed
      expect(fs.existsSync(path.join(mockHome, '.claude', 'skills', 'review'))).toBe(false);
      expect(fs.existsSync(path.join(mockHome, '.claude', 'skills', 'founderclaw-ship'))).toBe(false);

      // Non-founderclaw tool should still exist
      expect(fs.existsSync(path.join(mockHome, '.claude', 'skills', 'other-tool'))).toBe(true);

      // State should be removed
      expect(fs.existsSync(path.join(mockHome, '.founderclaw'))).toBe(false);
    });

    test('--keep-state preserves state directory', () => {
      const result = spawnSync('bash', [UNINSTALL, '--force', '--keep-state'], {
        stdio: 'pipe',
        env: {
          ...process.env,
          HOME: mockHome,
          FOUNDERCLAW_DIR: path.join(mockHome, '.claude', 'skills', 'founderclaw'),
          FOUNDERCLAW_STATE_DIR: path.join(mockHome, '.founderclaw'),
        },
        cwd: mockGitRoot,
      });

      expect(result.status).toBe(0);

      // Skills should be removed
      expect(fs.existsSync(path.join(mockHome, '.claude', 'skills', 'founderclaw'))).toBe(false);

      // State should still exist
      expect(fs.existsSync(path.join(mockHome, '.founderclaw'))).toBe(true);
      expect(fs.existsSync(path.join(mockHome, '.founderclaw', 'config.json'))).toBe(true);
    });

    test('clean system outputs nothing to remove', () => {
      const cleanHome = path.join(tmpDir, 'clean-home');
      fs.mkdirSync(cleanHome, { recursive: true });

      const result = spawnSync('bash', [UNINSTALL, '--force'], {
        stdio: 'pipe',
        env: {
          ...process.env,
          HOME: cleanHome,
          FOUNDERCLAW_DIR: path.join(cleanHome, 'nonexistent'),
          FOUNDERCLAW_STATE_DIR: path.join(cleanHome, '.founderclaw'),
        },
        cwd: mockGitRoot,
      });

      expect(result.status).toBe(0);
      expect(result.stdout.toString()).toContain('Nothing to remove');
    });

    test('upgrade path: prefixed install + uninstall cleans both old and new symlinks', () => {
      // Simulate the state after setup --no-prefix followed by setup (with prefix):
      // Both old unprefixed and new prefixed symlinks exist
      // (mockHome already has both 'review' and 'founderclaw-ship' symlinks)

      const result = spawnSync('bash', [UNINSTALL, '--force'], {
        stdio: 'pipe',
        env: {
          ...process.env,
          HOME: mockHome,
          FOUNDERCLAW_DIR: path.join(mockHome, '.claude', 'skills', 'founderclaw'),
          FOUNDERCLAW_STATE_DIR: path.join(mockHome, '.founderclaw'),
        },
        cwd: mockGitRoot,
      });

      expect(result.status).toBe(0);

      // Both old (review) and new (founderclaw-ship) symlinks should be gone
      expect(fs.existsSync(path.join(mockHome, '.claude', 'skills', 'review'))).toBe(false);
      expect(fs.existsSync(path.join(mockHome, '.claude', 'skills', 'founderclaw-ship'))).toBe(false);

      // Non-founderclaw should survive
      expect(fs.existsSync(path.join(mockHome, '.claude', 'skills', 'other-tool'))).toBe(true);
    });
  });
});
