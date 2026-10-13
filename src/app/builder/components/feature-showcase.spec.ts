import { TestBed } from '@angular/core/testing';
import { FeatureShowcase } from './feature-showcase';

describe('FeatureShowcase', () => {
  it('renders one card per feature', () => {
    const fixture = TestBed.createComponent(FeatureShowcase);
    fixture.componentRef.setInput('title', 'Features');
    fixture.componentRef.setInput('features', [
      { icon: 'A', title: 'One', description: 'First' },
      { icon: 'B', title: 'Two', description: 'Second' },
    ]);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.title')?.textContent).toBe('Features');
    expect(el.querySelectorAll('.card').length).toBe(2);
    expect(el.querySelector('.card__title')?.textContent).toBe('One');
  });

  it('renders no cards for an empty list', () => {
    const fixture = TestBed.createComponent(FeatureShowcase);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('.card').length).toBe(0);
  });
});
