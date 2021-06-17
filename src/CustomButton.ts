/* eslint-disable @typescript-eslint/no-floating-promises */
import { Color, Composite, EventObject, Listeners, Properties } from 'tabris';
import { component, event, getById, property } from 'tabris-decorators';
import { StateView } from './StateView';

const BUTTON_HEIGHT = 56;

@component
export class CustomButton extends Composite {

  @event onSelect: Listeners<EventObject<this>>;

  @property actionText: string;
  @property progressText: string;
  @property successText: string;
  @property errorText: string;

  @getById resultView: StateView;
  @getById progressView: StateView;
  @getById actionView: StateView;

  private _state: StateType;

  public set state(value: StateType) {
    this._state = value;
    this.updateStateViews();
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
    this.state = 'action';
  }

  private createUi(): void {
    this.append(
      new StateView({ id: 'resultView' }),
      new StateView({
        id: 'progressView',
        text: this.progressText,
        textColor: '#F57F17',
        background: '#FFFDE7',
        renderActivityIndicator: true
      }),
      new StateView({
        id: 'actionView',
        text: this.actionText,
        textColor: Color.white,
        background: '#03A9F4',
        highlightOnTouch: true
      }).onTap(() => this.onSelect.trigger())
    );
  }

  private updateStateViews(): void {
    switch (this.state) {
      case 'action': this.applyActionState(); break;
      case 'progress': this.applyProgressState(); break;
      case 'success': this.applyResultState('success'); break;
      case 'error': this.applyResultState('error'); break;
    }
  }

  private async applyActionState(): Promise<void> {
    await this.animateStateView(this.actionView, 0);
    this.animateStateView(this.progressView, -BUTTON_HEIGHT);
    this.animateStateView(this.resultView, - BUTTON_HEIGHT);
  }

  private applyProgressState(): void {
    this.animateStateView(this.actionView, BUTTON_HEIGHT);
    this.animateStateView(this.progressView, 0);
    this.animateStateView(this.resultView, -BUTTON_HEIGHT);
  }

  private applyResultState(result: 'success' | 'error'): void {
    this.animateStateView(this.actionView, BUTTON_HEIGHT);
    this.animateStateView(this.progressView, BUTTON_HEIGHT);
    this.animateStateView(this.resultView, 0);
    this.resultView.set({
      text: result === 'success' ? this.successText : this.errorText,
      background: result === 'success' ? '#E8F5E9' : '#FFEBEE',
      textColor: result === 'success' ? '#4CAF50' : '#F44336'
    });
  }

  private async animateStateView(view: StateView, translationY: number): Promise<void> {
    return view.animate(
      { transform: { translationY } },
      { easing: 'linear', duration: 150 }
    ).catch(error => console.error(error));
  }

}

type StateType = 'action' | 'progress' | 'success' | 'error';
