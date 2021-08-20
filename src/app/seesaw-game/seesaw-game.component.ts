import { Component, OnDestroy, OnInit } from '@angular/core';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { DeviceOrientation } from '@ionic-native/device-orientation/ngx';
import { Gyroscope } from '@ionic-native/gyroscope/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Platform } from '@ionic/angular';
import { SocketService } from '../socket-service/socket.service';

@Component({
  selector: 'app-seesaw-game',
  templateUrl: './seesaw-game.component.html',
  styleUrls: ['./seesaw-game.component.scss'],
})
export class SeesawGameComponent implements OnInit, OnDestroy {
  private controllerNumber: number;
  private sensorInterval: any;
  public tutorial = false;
  public playing = false;
  public countdown = false;
  public catchingController = true;
  public showMainMenuButton: boolean = false;
  public devControls;
  public dots = 0;
  private dotInterval;
  public played = false;
  public slideOptions = {
    allowTouchMove: false
  }
  controllerQuitGame = false;
  currentOX = 0;
  currentOY = 0;
  currentOZ = 0;
  justSendedData: any;
  initHeadingOfController: number;
  private seesawAngle: any;

  constructor(private socketService: SocketService, private gyroscope: Gyroscope,
    private deviceMotion: DeviceMotion, private deviceOrientation: DeviceOrientation, 
    private platform: Platform, private vibration: Vibration) {
    this.devControls = !this.platform.is('cordova');

    this.dotInterval = setInterval(() => {
      this.dots++;
      if (this.dots === 4) {
        this.dots = 0;
      }
    }, 500);
  }


  ngOnInit() {
    this.socketService.once('controllerResponsibility', (data) => {
      this.catchingController = data.tutorial;
      this.tutorial = data.tutorial;
      this.controllerNumber = data.controllerId;
    });

    this.socketService.once('stopSendingData', (mainControllerId) => {
      this.playing = false;
      this.played = true;
      this.showMainMenuButton = mainControllerId;

      if (this.showMainMenuButton) {
        this.vibration.vibrate(1000);
      }

      clearInterval(this.sensorInterval);
    });
    
    this.socketService.on('vibrate', (nrArray) => {
      let controllerId = nrArray[0];
      if (controllerId == this.controllerNumber) {
        this.vibration.vibrate(100);
      }
    });
    
    this.socketService.emit('controllerReady');

    this.socketService.once('startSendingData', () => {
      this.playing = true;
      console.log('start sending data');

      if (!this.devControls) {
        this.startSensor();
      }
    });
  }

  
  ngOnDestroy() {
    clearInterval(this.sensorInterval);
    this.socketService.removeListener('controllerResponsibility');
    this.socketService.removeListener('stopSendingData');
    this.socketService.removeListener('startSendingData');
    this.socketService.removeListener('vibrate');
    clearInterval(this.dotInterval);
  }



    /* -------------------- DEV CONTROLS --------------------*/
  
  public left(): void {
    this.socketService.emit('controllerData', [-0.6, this.controllerNumber]);
  }

  public center(): void {
    this.socketService.emit('controllerData', [0, this.controllerNumber]);
}

  public right(): void {
    this.socketService.emit('controllerData', [0.6, this.controllerNumber]);
  }

  /* -------------------- SENSOR METHODS --------------------*/

    
  private startSensor() {
    this.startAccelerometerSensor();
  }

  // accelerometer in x y z axis
  // docs: https://ionicframework.com/docs/native/device-motion
  private startAccelerometerSensor(): void {
    this.sensorInterval = setInterval(() => {
      this.deviceMotion.getCurrentAcceleration()
        .then(
          (acceleration: DeviceMotionAccelerationData) => this.processAccelData(acceleration),
          (error: any) => console.log(error)
        );
    }, 1000 / 60);   
  }

  private processAccelData(acceleration: DeviceMotionAccelerationData) { 
    // right -> > 1 
    if (acceleration.y >= 3 && this.seesawAngle != 0.6){
      this.seesawAngle = 0.6 
      this.socketService.emit('controllerData', [this.seesawAngle, this.controllerNumber]);
    } 
    // left -> > -1
    else if (acceleration.y <= -3 && this.seesawAngle != -0.6){
      this.seesawAngle = -0.6
      this.socketService.emit('controllerData', [this.seesawAngle, this.controllerNumber]);
    } 
    // center when between 1 and -1
    else if (acceleration.y < 3 && acceleration.y > -3 && this.seesawAngle != 0){
      this.seesawAngle = 0 
      this.socketService.emit('controllerData', [this.seesawAngle, this.controllerNumber]);
    }
  }

    /* -------------------- BASIC GAME METHODS --------------------*/

    public endTutorial(): void {
      this.socketService.emit('endedTutorial');
      this.tutorial = false;
    }
  
    public goToMainMenu(): void {
      this.socketService.emit('goToMainMenu');
    }
  
    public quitGame(): void {
      this.socketService.emit('quitGame');
    }

}
