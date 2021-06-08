import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { SocketService } from '../socket-service/socket.service';
import { Gyroscope, GyroscopeOptions, GyroscopeOrientation } from '@ionic-native/gyroscope/ngx';
import { environment } from 'src/environments/environment';
import { Platform } from '@ionic/angular';
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
  selector: 'app-catcher-game',
  templateUrl: './catcher-game.component.html',
  styleUrls: ['./catcher-game.component.scss'],
})
export class CatcherGameComponent implements OnInit, OnDestroy {
  private sensorInterval: any;
  public tutorial = false;
  public playing = false;
  public catchingController = true;
  public showMainMenuButton: boolean = false;
  private devValY: number = 0;
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

  constructor(private socketService: SocketService, private gyroscope: Gyroscope,
    private deviceMotion: DeviceMotion, private platform: Platform, private vibration: Vibration) {
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
      this.catchingController = data;
      console.log('Catch Controller');

      this.tutorial = true;
      // TODO xxx wieder löschen - tutorial wird gleich beendet fürs testing
      // this.endTutorial();

    });

    this.socketService.once('stopSendingData', (mainControllerId) => {
      console.log('stop sending data');
      this.playing = false;
      this.played = true;
      this.showMainMenuButton = mainControllerId;

      if (this.showMainMenuButton) {
        this.vibration.vibrate(1000);
      }

      clearInterval(this.sensorInterval);
    });

    this.socketService.emit('controllerReady');

    // dev controls for testing
    this.socketService.once('startSendingData', () => {
      this.playing = true;
      console.log('start Sending data');

      if (this.devControls && this.catchingController) {
        // this.sensorInterval = setInterval(() => {
        //   this.socketService.emit('controllerData', [this.devValY]);
        // }, 1000 / 50)
      } else if (!this.devControls && this.catchingController) {
        // this.startAccelerometerSensor();
        this.startGyroRotationSensor();
      }
    });
  }


  ngOnDestroy() {
    clearInterval(this.sensorInterval);
    this.socketService.removeListener('controllerResponsibility');
    this.socketService.removeListener('stopSendingData');
    this.socketService.removeListener('startSendingData');
    clearInterval(this.dotInterval);
  }



  /* Development Controls (Buttons) */
  public left(): void {
    if (this.catchingController) {
      this.devValY += 5;  // to camera left
      this.socketService.emit('controllerData', [this.devValY]);
    }
  }

  public right(): void {
    if (this.catchingController) {
      this.devValY -= 5;  // to home button right
      this.socketService.emit('controllerData', [this.devValY]);
    }
  }

  public endTutorial(): void {
    this.socketService.emit('endedTutorial');
    this.tutorial = false;
  }

  public goToMainMenu(): void {
    this.socketService.emit('goToMainMenu');
  }

  public quitGame(): void {
    console.log("ionic: quitGame() called");
    this.controllerQuitGame = true;
    this.socketService.emit('quitGame');
  }

  // accelerometer: beschleunigung in 3 achsen
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
    if (acceleration.y > 3 || acceleration.y < -3) {
      if (!this.justSendedData) {
        console.log("acceleration", acceleration.x, acceleration.y, acceleration.z);
        this.socketService.emit('controllerData', [acceleration.y]);
        this.vibration.vibrate(100);
        this.justSendedData = true;
        setTimeout(() => {
          this.justSendedData = false;
        }, 500);
      }
    }
  }

  // gyro: rotation/twist of phone
  private startGyroRotationSensor(): void {
    let options: GyroscopeOptions = {
      frequency: 1000
    }

    this.sensorInterval = setInterval(() => {
      this.gyroscope.getCurrent(options)
        .then(
          (orientation: GyroscopeOrientation) => {
            this.processGyroData(orientation);
          })
        .catch()
    }, 1000 / 50);
  }

  private processGyroData(orientation: GyroscopeOrientation) {
    // console.log("orientation", orientation.x, orientation.y, orientation.z);
    this.socketService.emit('controllerData', [orientation.z]);
  }

}
