import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-aurora-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero">
      <div class="aurora aurora--a" aria-hidden="true"></div>
      <div class="aurora aurora--b" aria-hidden="true"></div>
      <div class="aurora aurora--c" aria-hidden="true"></div>
      <div class="grid-overlay" aria-hidden="true"></div>

      <div class="content">
        <span class="eyebrow"><i class="dot" aria-hidden="true"></i>{{ eyebrow() }}</span>
        <div class="heading" role="heading" [attr.aria-level]="headingLevel()">{{ heading() }}</div>
        <p class="sub">{{ subheading() }}</p>
        <a class="cta" [href]="ctaUrl()">
          <span class="cta__label">{{ ctaLabel() }}</span>
          <span class="cta__arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
      --bg: var(--brand-bg, #070914);
      --accent-1: var(--brand-accent-1, #7c5cff);
      --accent-2: var(--brand-accent-2, #19d3ff);
      --accent-3: var(--brand-accent-3, #ff5ca8);
    }
    .hero {
      position: relative;
      isolation: isolate;
      overflow: hidden;
      min-height: 640px;
      display: grid;
      place-items: center;
      padding: 120px 24px;
      color: #fff;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      background:
        radial-gradient(1200px 600px at 50% -10%, rgb(124 92 255 / 25%), transparent 60%),
        radial-gradient(900px 500px at 100% 100%, rgb(25 211 255 / 15%), transparent 60%),
        var(--bg);
    }
    .aurora {
      position: absolute;
      z-index: -1;
      width: 55vw;
      height: 55vw;
      max-width: 780px;
      max-height: 780px;
      border-radius: 50%;
      filter: blur(90px) saturate(140%);
      opacity: 0.55;
      mix-blend-mode: screen;
      animation: drift 18s ease-in-out infinite alternate;
    }
    .aurora--a {
      top: -20%;
      left: -10%;
      background: conic-gradient(from 90deg, var(--accent-1), var(--accent-2), var(--accent-1));
    }
    .aurora--b {
      right: -15%;
      bottom: -30%;
      background: conic-gradient(from 200deg, var(--accent-3), var(--accent-1), var(--accent-3));
      animation-duration: 24s;
      animation-delay: -6s;
    }
    .aurora--c {
      top: 30%;
      left: 35%;
      width: 30vw;
      height: 30vw;
      background: radial-gradient(circle, var(--accent-2), transparent 65%);
      animation-duration: 14s;
      animation-direction: alternate-reverse;
    }
    .grid-overlay {
      position: absolute;
      inset: 0;
      z-index: -1;
      background-image:
        linear-gradient(rgb(255 255 255 / 5%) 1px, transparent 1px),
        linear-gradient(90deg, rgb(255 255 255 / 5%) 1px, transparent 1px);
      background-size: 56px 56px;
      mask-image: radial-gradient(ellipse at center, #000 20%, transparent 70%);
    }
    .content {
      max-width: 880px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 28px;
    }
    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 8px 16px;
      border-radius: 999px;
      font-size: 13px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      background: rgb(255 255 255 / 7%);
      border: 1px solid rgb(255 255 255 / 16%);
      backdrop-filter: blur(14px) saturate(160%);
      box-shadow: inset 0 1px 0 rgb(255 255 255 / 18%), 0 10px 30px -10px rgb(124 92 255 / 60%);
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-2);
      box-shadow: 0 0 0 0 rgb(25 211 255 / 70%);
      animation: pulse 2s infinite;
    }
    .heading {
      margin: 0;
      font-size: clamp(2.6rem, 7vw, 5.5rem);
      line-height: 1.02;
      letter-spacing: -0.035em;
      font-weight: 800;
      background: linear-gradient(120deg, #fff 20%, #c9bcff 45%, var(--accent-2) 75%, #fff 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      animation: shine 8s linear infinite;
    }
    .sub {
      margin: 0;
      max-width: 620px;
      font-size: clamp(1.05rem, 2vw, 1.3rem);
      line-height: 1.6;
      color: rgb(226 230 255 / 78%);
    }
    .cta {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 16px 32px;
      border-radius: 16px;
      font-weight: 600;
      font-size: 1.05rem;
      color: #fff;
      text-decoration: none;
      background: linear-gradient(135deg, var(--accent-1), #5b3df0 55%, var(--accent-2));
      box-shadow:
        0 1px 0 rgb(255 255 255 / 35%) inset,
        0 18px 40px -12px rgb(124 92 255 / 80%),
        0 0 0 1px rgb(255 255 255 / 12%);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .cta::before {
      content: '';
      position: absolute;
      inset: -2px;
      z-index: -1;
      border-radius: 18px;
      background: linear-gradient(135deg, var(--accent-3), var(--accent-2));
      filter: blur(16px);
      opacity: 0.5;
      transition: opacity 0.25s ease;
    }
    .cta:hover {
      transform: translateY(-3px) scale(1.02);
    }
    .cta:hover::before {
      opacity: 0.9;
    }
    .cta__arrow {
      display: inline-block;
      transition: transform 0.25s ease;
    }
    .cta:hover .cta__arrow {
      transform: translateX(6px);
    }
    @keyframes drift {
      from { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); }
      to { transform: translate3d(6%, 8%, 0) rotate(40deg) scale(1.15); }
    }
    @keyframes shine {
      to { background-position: 200% center; }
    }
    @keyframes pulse {
      70% { box-shadow: 0 0 0 10px rgb(25 211 255 / 0%); }
      100% { box-shadow: 0 0 0 0 rgb(25 211 255 / 0%); }
    }
    @media (prefers-reduced-motion: reduce) {
      .aurora, .heading, .dot { animation: none; }
    }
  `,
})
export class AuroraHero {
  readonly eyebrow = input('');
  readonly heading = input('');
  readonly subheading = input('');
  readonly ctaLabel = input('');
  readonly ctaUrl = input('#');
  /** Semantic heading level; use 2 when another heading is the page's h1. */
  readonly headingLevel = input(1);
}
