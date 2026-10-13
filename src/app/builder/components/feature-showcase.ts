import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-feature-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="showcase" id="features">
      <h2 class="title">{{ title() }}</h2>
      <div class="grid">
        @for (f of features(); track $index) {
          <article class="card">
            <div class="card__glow" aria-hidden="true"></div>
            <div class="icon" aria-hidden="true">{{ f.icon }}</div>
            <h3 class="card__title">{{ f.title }}</h3>
            <p class="card__text">{{ f.description }}</p>
            <span class="card__line" aria-hidden="true"></span>
          </article>
        }
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
      background: var(--brand-bg-alt, #0b0e1f);
    }
    .showcase {
      max-width: 1180px;
      margin: 0 auto;
      padding: 112px 24px;
      color: #eef0ff;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    }
    .title {
      margin: 0 0 64px;
      text-align: center;
      font-size: clamp(2rem, 4.5vw, 3.25rem);
      letter-spacing: -0.03em;
      font-weight: 800;
      background: linear-gradient(90deg, #fff, #a99bff 60%, var(--brand-accent-2, #19d3ff));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 24px;
    }
    .card {
      position: relative;
      overflow: hidden;
      padding: 36px 28px 40px;
      border-radius: 24px;
      background:
        linear-gradient(160deg, rgb(255 255 255 / 9%), rgb(255 255 255 / 2%) 60%),
        rgb(20 24 48 / 70%);
      border: 1px solid rgb(255 255 255 / 10%);
      backdrop-filter: blur(18px) saturate(150%);
      box-shadow:
        0 1px 0 rgb(255 255 255 / 12%) inset,
        0 30px 60px -30px rgb(0 0 0 / 80%);
      transform: translateY(0);
      transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.35s, box-shadow 0.35s;
    }
    .card:hover {
      transform: translateY(-8px);
      border-color: rgb(124 92 255 / 60%);
      box-shadow:
        0 1px 0 rgb(255 255 255 / 18%) inset,
        0 40px 80px -30px rgb(124 92 255 / 55%);
    }
    .card__glow {
      position: absolute;
      top: -40%;
      right: -30%;
      width: 260px;
      height: 260px;
      border-radius: 50%;
      background: radial-gradient(circle, rgb(124 92 255 / 45%), transparent 65%);
      filter: blur(30px);
      opacity: 0.6;
      transition: opacity 0.35s, transform 0.6s;
      pointer-events: none;
    }
    .card:hover .card__glow {
      opacity: 1;
      transform: translate(-20px, 20px) scale(1.2);
    }
    .icon {
      position: relative;
      display: grid;
      place-items: center;
      width: 60px;
      height: 60px;
      margin-bottom: 24px;
      font-size: 28px;
      border-radius: 18px;
      background: linear-gradient(135deg, rgb(124 92 255 / 35%), rgb(25 211 255 / 25%));
      border: 1px solid rgb(255 255 255 / 18%);
      box-shadow: 0 10px 30px -8px rgb(124 92 255 / 70%), inset 0 1px 0 rgb(255 255 255 / 30%);
    }
    .card__title {
      position: relative;
      margin: 0 0 12px;
      font-size: 1.3rem;
      letter-spacing: -0.01em;
    }
    .card__text {
      position: relative;
      margin: 0;
      line-height: 1.65;
      color: rgb(214 219 255 / 72%);
    }
    .card__line {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 3px;
      width: 0;
      background: linear-gradient(90deg, var(--brand-accent-1, #7c5cff), var(--brand-accent-2, #19d3ff), var(--brand-accent-3, #ff5ca8));
      transition: width 0.5s ease;
    }
    .card:hover .card__line {
      width: 100%;
    }
    @media (prefers-reduced-motion: reduce) {
      .card { transition: none; }
    }
  `,
})
export class FeatureShowcase {
  readonly title = input('');
  readonly features = input<Feature[]>([]);
}
