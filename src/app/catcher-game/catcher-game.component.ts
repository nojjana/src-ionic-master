import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { SocketService } from '../socket-service/socket.service';
import { Gyroscope, GyroscopeOptions, GyroscopeOrientation } from '@ionic-native/gyroscope/ngx';
import { DeviceOrientation, DeviceOrientationCompassHeading, DeviceOrientationCompassOptions } from '@ionic-native/device-orientation/ngx';
import { environment } from 'src/environments/environment';
import { Platform } from '@ionic/angular';
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
  selector: 'app-catcher-game',
  templateUrl: './catcher-game.component.html',
  styleUrls: ['./catcher-game.component.scss'],
})
export class CatcherGameComponent implements OnInit, OnDestroy {
  private controllerNumber: number;
  private sensorInterval: any;
  public tutorial = false;
  public playing = false;
  public countdown = false;
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
  currentOX = 0;
  currentOY = 0;
  currentOZ = 0;
  justSendedData: any;
  private devVal: number = 0;
  initHeadingOfController: number;

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
      console.log("Catch controller: "+this.catchingController+" / DATA: "+data.tutorial+" / NUMBER: "+data.controllerId);

      this.tutorial = data.tutorial;

      this.controllerNumber = data.controllerId;
      console.log("controller number: "+data.controllerId);

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

    
    this.socketService.on('vibrate', (nrArray) => {
      let controllerId = nrArray[0];
      if (controllerId == this.controllerNumber) {
        this.vibration.vibrate(100);
        console.log("controller vibrate (sendID, setID): ", controllerId, this.controllerNumber)
      }
    });
    
    this.socketService.emit('controllerReady');

    this.socketService.once('startSendingData', () => {
      this.playing = true;
      console.log('start Sending data');

      if (this.devControls) {
      } else {
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
    this.socketService.emit('controllerData', [-1, this.controllerNumber]);

  }

  public center(): void {
    this.socketService.emit('controllerData', [0, this.controllerNumber]);
}

  public right(): void {
      this.socketService.emit('controllerData', [1, this.controllerNumber]);
  }

  /* -------------------- SENSOR METHODS --------------------*/

    
  private startSensor() {
    this.startDeviceOrientationSensor();
  }
  private startDeviceOrientationSensor() {
    this.sensorInterval = setInterval(() => {
    this.deviceOrientation.getCurrentHeading()
    .then(
      (data: DeviceOrientationCompassHeading) => this.processDeviceOrientationData(data),
      (error: any) => console.log(error)
    );
    }, 1000 / 50);
  }

  private processDeviceOrientationData(data: DeviceOrientationCompassHeading): any {
    if (this.initHeadingOfController == undefined || this.initHeadingOfController <= 0) {
      this.determineInitHeadingOfController(data);
    } else {
      let currentHeading = data.magneticHeading;
      if (currentHeading != null && currentHeading >= 1) {
        console.log("magneticHeading:", currentHeading);
        this.socketService.emit('controllerData', [this.calculateOrientation(currentHeading), this.controllerNumber]);
      }
    }

  }

  private determineInitHeadingOfController(data: DeviceOrientationCompassHeading) {
    this.initHeadingOfController = data.magneticHeading;
    console.log("Getting initial magneticHeading of controller...", this.initHeadingOfController);
  }

  private calculateOrientation(currentHeading: number): any {

    let val = null;
    let threshold = 20;

    let currentHeadingNormed = currentHeading - this.initHeadingOfController;
    if (currentHeadingNormed > 360) {
      currentHeadingNormed = 360 - currentHeadingNormed;
    } else if (currentHeadingNormed < 0) {
      currentHeadingNormed = currentHeadingNormed + 360;
    }
    
    // left or right?
    if (currentHeadingNormed > threshold && currentHeadingNormed < (90+threshold)) {
      // right
      val = 1;
    } else if (currentHeadingNormed < (360-threshold) && currentHeadingNormed > (270-threshold)) {
      // left
      val = -1;
    } else if (currentHeadingNormed < threshold || currentHeadingNormed > (360-threshold)) {
      // center
      val = 0;
    } else {
      // do nothing
      val = null;
    }

    return val;
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
