import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../socket-service/socket.service';
import { MainMenuState } from '../interfaces';
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnDestroy, OnDestroy {
  public mainMenuState: MainMenuState;
  public mainController: boolean;
  private dotInterval;
  public dots: number = 0;

  constructor(private socketService: SocketService, private vibration: Vibration) {
    /* Set listener, if this controller is the main-controller of the main-menu */
    /* Investigate if this listener is set early enough, before first event gets fired */
    this.socketService.on('mainController', (mainController: boolean) => {
      this.mainController = mainController;
      if(this.mainController){
        this.vibration.vibrate(1000);
      }
    });

    this.dotInterval = setInterval(() => {
      this.dots++;
      if (this.dots === 4) {
        this.dots = 0;
      }
    }, 500);

    this.socketService.emit('controllerMainMenuReady');
  }
  
  /* Sends button click "Enter" to the server */
  public pressedEnter(): void {
    this.socketService.emit('controllerPressedEnter');
  }

  /* Sends button click "Up" to the server */
  public pressedUp(): void {
    this.socketService.emit('controllerPressedUp');
  }

  /* Sends button click "Down" to the server */
  public pressedDown(): void {
    this.socketService.emit('controllerPressedDown');
  }

  /* Listener gets removed, once the program changes, so that later on there aren't two listeners */
  ngOnDestroy(): void {
    this.socketService.removeListener('mainController');
    clearInterval(this.dotInterval);
  }
}
