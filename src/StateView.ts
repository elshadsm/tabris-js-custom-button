import {
  ActivityIndicator, ColorValue, Composite, Font,
  LayoutData, Properties, TextView, Widget
} from 'tabris';
import { bind, component, property } from 'tabris-decorators';

const CONTENT_FONT = Font.from({ size: 18, weight: 'medium' });

@component
export class StateView extends Composite {

  @property @bind('TextView.text') text: string;
  @property @bind('TextView.textColor') textColor: ColorValue;
  @property({ default: false }) renderActivityIndicator: boolean;

  constructor(properties: Properties<StateView>) {
    super({
      layoutData: LayoutData.stretch,
      ...properties
    });
    this.append(...this.createComponents());
  }

  private createComponents(): Widget[] {
    if (this.renderActivityIndicator) {
      return [
        new TextView({
          top: 16,
          bottom: 16,
          centerX: 0,
          font: CONTENT_FONT
        }),
        new ActivityIndicator({
          left: [LayoutData.prev, 16],
          width: 24,
          height: 24,
          centerY: 2,
          tintColor: this.textColor
        })
      ];
    }
    return [
      new TextView({
        left: 16,
        top: 16,
        right: 16,
        bottom: 16,
        alignment: 'centerX',
        font: CONTENT_FONT
      })
    ];
  }

}
