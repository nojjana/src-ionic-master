import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../socket-service/socket.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-not-in-lobby',
  templateUrl: './not-in-lobby.component.html',
  styleUrls: ['./not-in-lobby.component.scss'],
})
export class NotInLobbyComponent implements OnInit, OnDestroy {
  private dotInterval;
  public dots = 0;

  constructor(public socketService: SocketService) { 
    this.dotInterval = setInterval(() => {
      this.dots++;
      if (this.dots === 4) {
        this.dots = 0;
      }
    }, 500);
  }
  
  ngOnDestroy(): void {
    clearInterval(this.dotInterval);
  }

  ngOnInit() {}
  
  /* Sends a request to join a lobby to the server */
  public joinLobby(joinLobbyCode): void {
    this.socketService.emit('controllerJoinsLobby', parseInt(joinLobbyCode, 0));
  }
}
