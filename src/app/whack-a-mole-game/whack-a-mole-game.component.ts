import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { SocketService } from '../socket-service/socket.service';
import {Gyroscope, GyroscopeOptions, GyroscopeOrientation} from '@ionic-native/gyroscope/ngx';
import { environment } from 'src/environments/environment';
import { Platform } from '@ionic/angular';
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
  selector: 'app-whack-a-mole-game',
  templateUrl: './whack-a-mole-game.component.html',
  styleUrls: ['./whack-a-mole-game.component.scss'],
})
export class WhackAMoleGameComponent implements OnInit, OnDestroy {
  private sensorInterval: any;
  public tutorial: boolean = false;
  public playing: boolean = false;
  public moving: boolean;
  public showMainMenuButton: boolean = false;
  private devValX: number = 0;
  private devValY: number = 0;
  public devControls;
  private hitting: boolean = false;
  public dots = 0;
  private dotInterval;
  public played = false;
  public slideOptions = {
    allowTouchMove: false
  }

  constructor( private socketService: SocketService, private gyroscope: Gyroscope, 
    private deviceMotion: DeviceMotion, private platform: Platform, private vibration: Vibration) { 
    this.devControls = !this.platform.is('cordova');

    this.dotInterval = setInterval(() => {
      this.dots++;
      if (this.dots === 4) {
        this.dots = 0;
      }
    }, 500);
  }

  // Development Controls
  public left(): void {
    if(this.moving){
      this.devValX -= 5;
    }
  }

  public right(): void {
    if(this.moving){
      this.devValX += 5;
    }
  }

  public up(): void {
    if(this.moving){
      this.devValY += 5;
    }
  }

  public down(): void {
    if(this.moving){
      this.devValY -= 5;
    }
  }

  public hit(): void {
    if(!this.moving){
      console.log('hit now');
      this.socketService.emit('controllerData');
    }
  }

  public endTutorial(): void {
    this.socketService.emit('endedTutorial');
    this.tutorial = false;
  }

  public goToMainMenu(): void {
    this.socketService.emit('goToMainMenu');
  }

  ngOnDestroy() {
    clearInterval(this.sensorInterval);
    this.socketService.removeListener('controllerResponsibility');
    this.socketService.removeListener('stopSendingData');
    this.socketService.removeListener('startSendingData');
    clearInterval(this.dotInterval);
  }

  ngOnInit() {
    this.socketService.once('controllerResponsibility', (data) => {
      this.moving = data;
      
      if(this.moving){
        console.log('move Controller');
      } else {
        console.log('hit Controller');
      }

      this.tutorial = true;
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
    });

    this.socketService.emit('controllerReady');

    /*For testing*/
    this.socketService.once('startSendingData', () => {
      this.playing = true;
      console.log('start Sending data');
      
      if(this.devControls && this.moving){
        this.sensorInterval = setInterval(() => {
          let x = this.calculateXGravity(this.devValX);
          let y = this.caluclateYGravity(this.devValY);

          this.socketService.emit('controllerData', [x, y]);
        }, 1000 / 50)
      } else if(!this.devControls && this.moving){
        this.startMovementSensor();
      } else if(!this.devControls && !this.moving){
        this.startAccelerometerSensor();
      }
    });
  }

  private startAccelerometerSensor(): void {
    this.sensorInterval = setInterval(() => {
      this.deviceMotion.getCurrentAcceleration().then(
        (acceleration: DeviceMotionAccelerationData) => this.processData(acceleration),
        (error: any) => console.log(error)
      );
    }, 1000 / 60);
  }

  private startMovementSensor(): void {
    let options: GyroscopeOptions = {
      frequency: 1000
    }

    this.sensorInterval = setInterval(() => {
      this.gyroscope.getCurrent(options)
          .then((orientation: GyroscopeOrientation) => {
            let x = this.calculateXGravity(orientation.z);
            let y  = this.caluclateYGravity(orientation.y);

            this.socketService.emit('controllerData', [x, y]);
          })
          .catch()
    }, 1000 / 50);
  }

  private calculateXGravity(val: number) {
    let threshold = 20;
  
    if(val > threshold){
      val = 1;
    } else if(val < -threshold){
      val = -1;
    } else {
      val = 1 / threshold * val;
    }

    return val;
  }

  private caluclateYGravity(val: number) {
    let threshold = 20;

    threshold = 10;
    val = -val;
  
    if(val > threshold){
      val = 1;
    } else if(val < -threshold){
      val = -1;
    } else {
      val = 1 / threshold * val;
    }

    return val;
  }

  processData(acceleration: DeviceMotionAccelerationData) {
    if(!this.hitting && acceleration.x > 60){
      this.hitting = true;
      this.socketService.emit('controllerData', null);
    } else if(this.hitting && acceleration.x < 20){
      this.hitting = false;
    }
  }
}
