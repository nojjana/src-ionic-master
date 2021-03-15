import { Component, OnInit } from '@angular/core';
import {SocketService} from '../socket-service/socket.service';
import { DBMeter } from '@ionic-native/db-meter/ngx';
import { Platform } from '@ionic/angular';
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
  selector: 'app-spaceship-game',
  templateUrl: './spaceship-game.component.html',
  styleUrls: ['./spaceship-game.component.scss'],
})
export class SpaceshipGameComponent implements OnInit {
  private loudness: number = 0;
  private sensorInterval: any;
  public tutorial: boolean = false;
  public playing: boolean = false;
  public leftSide: boolean;
  public showMainMenuButton: boolean = false;
  public devControls;
  private dbMeterSubscription;
  public dots = 0;
  private dotInterval;
  public played = false;
  public slideOptions = {
    allowTouchMove: false
  }

  constructor(private socketService: SocketService, private dbMeter: DBMeter, private platform: Platform, private vibration: Vibration) { 
    this.devControls = !this.platform.is('cordova');

    this.dotInterval = setInterval(() => {
      this.dots++;
      if (this.dots === 4) {
        this.dots = 0;
      }
    }, 500);
  }  

  // Development Controls
  public less(): void {
    if(this.loudness >= 5){
      this.loudness -= 5;
    }
  }

  public more(): void {
    this.loudness += 5;
  }

  public endTutorial(): void {
    this.socketService.emit('endedTutorial');
    this.tutorial = false;
  }

  public goToMainMenu(): void {
    this.socketService.emit('goToMainMenu');
  }

  ngOnInit() {
    this.socketService.once('controllerResponsibility', (data) => {
      this.leftSide = data;
      
      if(data){
        console.log('leftController');
      } else {
        console.log('rightController');
      }

      this.tutorial = true;

      let sub = this.dbMeter.start().subscribe(
        data => {
          console.log('already Had Permission');
          sub.unsubscribe();
        }
      );
    });

    this.socketService.once('stopSendingData', (mainControllerId) => {
      console.log('stop sending data');
      this.playing = false;
      this.played = true;
      this.showMainMenuButton = mainControllerId;
      
      if(this.showMainMenuButton){
        this.vibration.vibrate(1000);
      }

      clearInterval(this.sensorInterval);
    })

    this.socketService.emit('controllerReady');

    /*For testing*/
    this.socketService.once('startSendingData', () => {
      this.playing = true;
      console.log('start Sending data');

      if(this.devControls){
        this.startDevControls();
      } else {
        this.startSensor();
      }
    });
  }

  private startSensor(): void {
    console.log('start db sensor');
    this.dbMeterSubscription = this.dbMeter.start().subscribe(
      data => {
        data -= 45;

        if(data < 0){
          data = 0
        }

        this.socketService.emit('controllerData', data);
      }
    );
  }

  private startDevControls(): void {
    this.sensorInterval = setInterval(() => {
      if(this.playing){
        this.socketService.emit('controllerData', this.loudness);
      }
    }, 1000 / 50)
  }

  ngOnDestroy() {
    if(this.dbMeterSubscription != null){
      this.dbMeterSubscription.unsubscribe();
    }

    clearInterval(this.sensorInterval);
    this.socketService.removeListener('controllerResponsibility');
    this.socketService.removeListener('stopSendingData');
    this.socketService.removeListener('startSendingData');
    this.dbMeter.delete();
    clearInterval(this.dotInterval);
  }

}
