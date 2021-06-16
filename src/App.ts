import { contentView } from 'tabris';
import { CustomButton } from './CustomButton';

export class App {

  constructor() {
    contentView.background = '#E8EAF6';
  }

  public start() {
    contentView.append(
      new CustomButton({
        left: 16,
        right: 16,
        centerY: 0
      }).onSelect(async ({ target }) => this.handleButtonSelect(target).catch(error => console.error(error)))
    );
  }

  private async handleButtonSelect(button: CustomButton) {
    button.state = 'progress';
    await new Promise(resolve => setTimeout(resolve, 2000));
    button.state = 'success';
    await new Promise(resolve => setTimeout(resolve, 2000));
    button.state = 'action';
    await new Promise(resolve => setTimeout(resolve, 2000));
    button.state = 'progress';
    await new Promise(resolve => setTimeout(resolve, 2000));
    button.state = 'error';
  }

}
