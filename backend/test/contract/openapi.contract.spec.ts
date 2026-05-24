import { existsSync, readFileSync } from 'fs';

describe('OpenAPI contract', () => {
  it('should expose the source-of-truth spec file', () => {
    const path = 'openapi/anketa-social-vote.openapi.yaml';
    expect(existsSync(path)).toBe(true);

    const content = readFileSync(path, 'utf8');
    expect(content).toContain('openapi: 3.0.3');
    expect(content).toContain('/auth/login');
    expect(content).toContain('/polls');
    expect(content).toContain('/votes');
  });
});
