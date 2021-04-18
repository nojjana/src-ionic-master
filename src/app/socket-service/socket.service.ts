import { Injectable } from '@angular/core';
import {Socket} from 'ng-socket-io';
import { AppComponent } from '../app.component';
import { Program } from '../interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SocketService extends Socket {
    private appComponent: AppComponent;
    private connected = false;

    constructor() {
      super({url: environment.socketUrl, options: {autoConnect: true}});
      console.log('test2');

      /* Sets to default Program, if connection was lost */
      this.on('disconnect', () => {
        this.connected = false;
        this.appComponent.setProgram(Program.NOT_IN_LOBBY);
      });
  
      this.on('connect', () => {
        console.log('test');
        this.connected = true;
      });

      this.on('connect_error', (error) => {
        console.log(error);
      });
      
      /* Sets the new program and change the view accordingly */
      this.on('currentProgram', (program: Program) => {
        if (this.appComponent != null) {
          this.appComponent.setProgram(program);
        }
      });
  
      /* Gets fired when a non-existing lobby code was entered */
      this.on('wrongLobbyCode', () => {
        if (this.appComponent != null){
          this.appComponent.showWrongLobbyCodeModal();
        }
      });

      this.on('gameEndedDueToNoDisplayAvailable', () => {
        this.appComponent.showNoDisplaysAvailableModal();
        this.appComponent.setProgram(Program.NOT_IN_LOBBY);
      });

      this.on('lobbyFullControllers', () => {
        this.appComponent.showLobbyFullModal();
      });

      this.on('gameRunning', () => {
        if (this.appComponent != null) {
          this.appComponent.showGameRunning();
        }
      });
    }

    public isConnected(): boolean {
      return this.connected;
    }
  
    public setAppComponent(appComponent: AppComponent): void {
      this.appComponent = appComponent;
    }
}