import { TestBed } from '@angular/core/testing';
import { AuroraHero } from './aurora-hero';

describe('AuroraHero', () => {
  function render(inputs: Record<string, unknown>) {
    const fixture = TestBed.createComponent(AuroraHero);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the provided copy and link', () => {
    const el = render({ eyebrow: 'Beta', heading: 'Hello', subheading: 'Sub', ctaLabel: 'Go', ctaUrl: '/go' });
    expect(el.querySelector('.heading')?.textContent).toContain('Hello');
    expect(el.querySelector('.eyebrow')?.textContent).toContain('Beta');
    expect(el.querySelector('.sub')?.textContent).toContain('Sub');
    expect(el.querySelector<HTMLAnchorElement>('.cta')?.getAttribute('href')).toBe('/go');
  });

  it('exposes a configurable heading level and hides decoration from assistive tech', () => {
    const el = render({ heading: 'Hello', headingLevel: 2 });
    expect(el.querySelector('.heading')?.getAttribute('aria-level')).toBe('2');
    expect(el.querySelectorAll('.aurora[aria-hidden="true"]').length).toBe(3);
  });
});
