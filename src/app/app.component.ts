import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Program } from './interfaces';
import { SocketService } from './socket-service/socket.service';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public program: Program = Program.NOT_IN_LOBBY;
  public Program = Program;

  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private socketService: SocketService,
    private insomnia: Insomnia,
    private smartModalService: NgxSmartModalService
  ) {
    socketService.setAppComponent(this);
    this.initializeApp();
  }

  /* Initializes the Splash-Screen on application startup */
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.insomnia.keepAwake().then();
    });
  }

  /* Sets the currently displayed program */
  public setProgram(program: Program) {
    this.program = program;
  }

  public showNoDisplaysAvailableModal(): void {
    this.smartModalService.open('noDisplayError');
  }

  public showWrongLobbyCodeModal(): void {
    this.smartModalService.open('wrongLobbyError');
  }

  public showLobbyFullModal(): void {
    this.smartModalService.open('fullLobbyError');
  }

  public showGameRunning(): void {
    this.smartModalService.open('gameRunningError');
  }
}
