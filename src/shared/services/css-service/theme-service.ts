import type { ThemeName, Themes, ColorCategory, ColorsKey } from '@/shared/services/css-service/types';

export default class ThemeService {
  public constructor(colorThemes: Themes, categoryColor: ColorCategory = 'primary', primaryColor?: ColorsKey) {
    this.colorThemes = colorThemes;
    this.categoryColor = categoryColor;
    this.primaryColor = primaryColor;
  }

  private readonly variablePrefix: string = 'color';
  private readonly primaryColor: ColorsKey | undefined;
  private readonly categoryColor: ColorCategory;
  private colorThemes: Themes;
  private activeTheme: ThemeName;

  public set(theme: ThemeName): void {
    const root = document.documentElement;

    Object.entries(this.colorThemes[theme]).forEach(([key, value]) =>
      root.style.setProperty(`--${this.variablePrefix}-${this.categoryColor}-${key}`, value)
    );
    this.activeTheme = theme;
    // this.updateStatusBar();
  }

  public clear(theme: ThemeName = this.activeTheme): void {
    if (!theme) {
      return;
    }

    const root = document.documentElement;
    Object.entries(this.colorThemes[theme]).forEach(([key]) => root.style.removeProperty(`--${this.variablePrefix}-${this.categoryColor}-${key}`));
    // this.updateStatusBar();
  }

  private updateStatusBar(): void {
    if (this.primaryColor === undefined) {
      return;
    }

    const mainTheme = getComputedStyle(document.documentElement).getPropertyValue(
      `--${this.variablePrefix}-${this.categoryColor}-${this.primaryColor}`
    );

    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mainTheme);
  }
}
