export default class BlurElement {
  public constructor(options?: { strength?: number; controlSelector?: string; appSelector?: string }) {
    const { strength = 5, appSelector = '#app', controlSelector } = options || {};
    this.target = document.querySelector(appSelector);
    this.controlSelector = controlSelector;
    this.strength = strength;
  }

  private readonly strength: number;
  private readonly controlSelector: string | undefined;
  private readonly target: HTMLElement | null;

  public set(strength: number = this.strength): void {
    this.blur(strength);
  }

  public unset(): void {
    setTimeout(() => {
      if (this.controlSelector && document.body.querySelector(this.controlSelector)) {
        return;
      }

      this.set(0);
    });
  }

  private blur(strength = this.strength): void {
    if (!this.target) {
      return;
    }

    // TODO: Temporary removed effects
    this.target.style.filter = strength ? `blur(${strength}px)  brightness(0.3)` : '';
    this.target.style.backgroundColor = strength ? 'white' : '';
    // this.target.style.transform = strength ? 'scale(1.05)' : '';
  }
}
