import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterStateSnapshot } from '@angular/router';
import { fetchOneEntry } from '@builder.io/sdk-angular';
import { builderContentResolver } from './builder-content.resolver';

vi.mock('@builder.io/sdk-angular', () => ({ fetchOneEntry: vi.fn() }));

describe('builderContentResolver', () => {
  const fetchMock = vi.mocked(fetchOneEntry);
  const run = (url: string, platform: 'server' | 'browser') => {
    TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: platform }] });
    return TestBed.runInInjectionContext(() =>
      builderContentResolver({} as never, { url } as RouterStateSnapshot),
    ) as Promise<unknown>;
  };

  beforeEach(() => {
    fetchMock.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('queries Builder with the URL path without query or hash', async () => {
    fetchMock.mockResolvedValue({ id: 'x' } as never);
    await expect(run('/about?x=1#top', 'browser')).resolves.toEqual({ id: 'x' });
    expect(fetchMock.mock.calls[0][0]).toMatchObject({ userAttributes: { urlPath: '/about' } });
  });

  it('returns null in the browser when the fetch fails', async () => {
    fetchMock.mockRejectedValue(new Error('boom'));
    await expect(run('/', 'browser')).resolves.toBeNull();
  });

  it('fails the build when the fetch fails on the server', async () => {
    fetchMock.mockRejectedValue(new Error('boom'));
    await expect(run('/', 'server')).rejects.toThrow('boom');
  });

  it('fails the build when the homepage is missing on the server', async () => {
    fetchMock.mockResolvedValue(undefined as never);
    await expect(run('/', 'server')).rejects.toThrow(/no published/);
  });

  it('tolerates a missing non-home page on the server', async () => {
    fetchMock.mockResolvedValue(undefined as never);
    await expect(run('/nope', 'server')).resolves.toBeNull();
  });
});
