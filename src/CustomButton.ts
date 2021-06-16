import { Color, Composite, EventObject, Listeners, Properties } from 'tabris';
import { component, event, getById } from 'tabris-decorators';
import { StateView } from './StateView';

const BUTTON_HEIGHT = 56;

@component
export class CustomButton extends Composite {

  @event onSelect: Listeners<EventObject<this>>;

  @getById resultView: StateView;
  @getById progressView: StateView;
  @getById actionView: StateView;

  private _state: StateType;

  public set state(value: StateType) {
    this._state = value;
    this.updateState();
  }

  public get state(): StateType {
    return this._state;
  }

  constructor(propertie: Properties<CustomButton>) {
    super({
      height: BUTTON_HEIGHT,
      cornerRadius: BUTTON_HEIGHT / 2,
      ...propertie
    });
    this.createUi();
    this.state = 'action'
  }

  private createUi(): void {
    this.append(
      new StateView({ id: 'resultView' }),
      new StateView({
        id: 'progressView',
        text: 'Progress State',
        textColor: '#F57F17',
        background: '#FFFDE7',
        renderActivityIndicator: true
      }),
      new StateView({
        id: 'actionView',
        text: 'Active State',
        textColor: Color.white,
        background: '#03A9F4',
        highlightOnTouch: true
      }).onTap(() => this.onSelect.trigger())
    );
  }

  private updateState(): void {
    switch (this.state) {
      case 'action': this.handleActionState().catch(error => console.error(error)); break;
      case 'progress': this.handleProgressState(); break;
      case 'success': this.handleSuccessState(); break;
      case 'error': this.handleErrorState(); break;
    }
  }

  private async handleActionState(): Promise<void> {
    await this.animateStateView(this.actionView, 0);
    this.animateStateView(this.progressView, - BUTTON_HEIGHT).catch(error => console.error(error));
    this.animateStateView(this.resultView, - BUTTON_HEIGHT).catch(error => console.error(error));
  }

  private handleProgressState(): void {
    this.animateStateView(this.actionView, BUTTON_HEIGHT).catch(error => console.error(error));
    this.animateStateView(this.progressView, 0).catch(error => console.error(error));
    this.animateStateView(this.resultView, - BUTTON_HEIGHT).catch(error => console.error(error));
  }

  private handleSuccessState(): void {
    this.animateStateView(this.actionView, BUTTON_HEIGHT).catch(error => console.error(error));
    this.animateStateView(this.progressView, BUTTON_HEIGHT).catch(error => console.error(error));
    this.animateStateView(this.resultView, 0).catch(error => console.error(error));
    this.resultView.set({
      text: 'Success State',
      background: '#E8F5E9',
      textColor: '#4CAF50'
    });
  }

  private handleErrorState(): void {
    this.animateStateView(this.actionView, BUTTON_HEIGHT).catch(error => console.error(error));
    this.animateStateView(this.progressView, BUTTON_HEIGHT).catch(error => console.error(error));
    this.animateStateView(this.resultView, 0).catch(error => console.error(error));
    this.resultView.set({
      text: 'Error State',
      background: '#FFEBEE',
      textColor: '#F44336'
    });
  }

  private async animateStateView(view: StateView, translationY: number): Promise<void> {
    return view.animate(
      { transform: { translationY } },
      { easing: 'linear', duration: 150 }
    );
  }

}

type StateType = 'action' | 'progress' | 'success' | 'error';
