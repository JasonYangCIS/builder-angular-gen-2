import type { RegisteredComponent } from '@builder.io/sdk-angular';
import { AuroraHero } from './components/aurora-hero';
import { FeatureShowcase } from './components/feature-showcase';

export const CUSTOM_COMPONENTS: RegisteredComponent[] = [
  {
    name: 'AuroraHero',
    component: AuroraHero,
    inputs: [
      { name: 'eyebrow', type: 'text', defaultValue: 'Now in public beta' },
      { name: 'heading', type: 'text', defaultValue: 'Build faster with visual content' },
      {
        name: 'subheading',
        type: 'longText',
        defaultValue: 'Compose pages from your own Angular components, edited visually.',
      },
      { name: 'ctaLabel', type: 'text', defaultValue: 'Get started' },
      { name: 'ctaUrl', type: 'url', defaultValue: '#features' },
      {
        name: 'headingLevel',
        type: 'number',
        defaultValue: 1,
        min: 1,
        max: 6,
        helperText: 'Use 2 if another heading on the page is already the h1.',
      },
    ],
  },
  {
    name: 'FeatureShowcase',
    component: FeatureShowcase,
    inputs: [
      { name: 'title', type: 'text', defaultValue: 'Everything you need' },
      {
        name: 'features',
        type: 'list',
        defaultValue: [
          { icon: '⚡', title: 'Fast', description: 'Server-rendered or prerendered HTML.' },
        ],
        subFields: [
          { name: 'icon', type: 'text', defaultValue: '✨' },
          { name: 'title', type: 'text', defaultValue: 'Feature' },
          { name: 'description', type: 'longText', defaultValue: 'Describe it.' },
        ],
      },
    ],
  },
];
