import { Component, OnInit, OnDestroy, ɵɵNgOnChangesFeature } from '@angular/core';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { SocketService } from '../socket-service/socket.service';
import { Gyroscope, GyroscopeOptions, GyroscopeOrientation } from '@ionic-native/gyroscope/ngx';
import { DeviceOrientation, DeviceOrientationCompassHeading, DeviceOrientationCompassOptions } from '@ionic-native/device-orientation/ngx';
import { environment } from 'src/environments/environment';
import { Platform } from '@ionic/angular';
import { Vibration } from '@ionic-native/vibration/ngx';

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
  private devVal: number = 0;
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
      console.log("Catch controller: "+this.catchingController+" / DATA: "+data.tutorial+" / NUMBER: "+data.controllerId);

      this.tutorial = data.tutorial;

      // TODO xxx wieder löschen - tutorial wird gleich beendet fürs testing
      //this.endTutorial();

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
        // this.startDevControls();
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
    this.socketService.removeListener('vibrate');  //TODO add also in other games
    clearInterval(this.dotInterval);
  }



    /* -------------------- DEV CONTROLS --------------------*/

    private startDevControls(): void {
  //   this.sensorInterval = setInterval(() => {
  //     console.log("devVal:", this.devVal);
  //     this.socketService.emit('controllerData', [this.calculateGravity(this.devVal), this.controllerNumber]);
  //  }, 1000 / 50)
  }
  
  public left(): void {
      // this.devVal += 5;

      // TODO: interval, for better dev control. 
      //when button click and hold -> keep moving
      // use (mouseup)=left(false) to clear intervall.. or similar

      // if (doMove){
      //   this.interv = setInterval(() => {
      //     this.name = "has been long pressed"
      //     this.interv = null;
      //   }, 500);

        this.socketService.emit('controllerData', [-1, this.controllerNumber]);
      // } else {

      // }

  }

  public center(): void {
    // this.devVal -= 5;
    this.socketService.emit('controllerData', [0, this.controllerNumber]);
}

  public right(): void {
      // this.devVal -= 5;
      this.socketService.emit('controllerData', [1, this.controllerNumber]);
  }

  /* -------------------- SENSOR METHODS --------------------*/

    
  private startSensor() {
    this.startAccelerometerSensor();
  //  this.startGyroOrientationSensor();
    // this.startDeviceOrientationSensor();
  }

  // private startDeviceOrientationSensor() {
  //   // while (this.initHeadingOfController == undefined) {
  //   //   console.log("Getting initial magneticHeading heading of controller...", this.initHeadingOfController);
  //   //   this.determineInitHeadingOfController();
  //   // }
  //   // console.log("initHeadingOfController:", this.initHeadingOfController);
  //   this.sensorInterval = setInterval(() => {
  //   // Get the device current compass heading
  //   this.deviceOrientation.getCurrentHeading()
  //   .then(
  //     (data: DeviceOrientationCompassHeading) => this.processDeviceOrientationData(data),
  //     (error: any) => console.log(error)
  //   );
  //   }, 1000 / 50);

    // Watch the device compass heading change
// var subscription = this.deviceOrientation.watchHeading().subscribe(
//   (data: DeviceOrientationCompassHeading) => console.log(data)
// );

  // }

  // private processDeviceOrientationData(data: DeviceOrientationCompassHeading): any {
  //   if (this.initHeadingOfController == undefined || this.initHeadingOfController <= 0) {
  //     this.determineInitHeadingOfController(data);
  //   } else {
  //     let currentHeading = data.magneticHeading;
  //     if (currentHeading != null && currentHeading >= 1) {
  //       console.log("magneticHeading:", currentHeading);
  //       this.socketService.emit('controllerData', [this.calculateOrientation(currentHeading), this.controllerNumber]);
  //     }
  //   }

  // }

  // private determineInitHeadingOfController(data: DeviceOrientationCompassHeading) {
  //   // startposition of phone (reference for center)
  //   // -> after countdown: hold it pointing to the center of the screen!
  //   this.initHeadingOfController = data.magneticHeading;
  //   console.log("Getting initial magneticHeading of controller...", this.initHeadingOfController);
  // }

  // private calculateOrientation(currentHeading: number): any {

  //   let val = null;
  //   let threshold = 20;

  //   // norm currentHeading as if initHeadingOfController was 0
  //   // if > 0 && < 180 --> right, if < 360 &&  > 180 --> left
  //   let currentHeadingNormed = currentHeading - this.initHeadingOfController;
  //   if (currentHeadingNormed > 360) {
  //     currentHeadingNormed = 360 - currentHeadingNormed;
  //   } else if (currentHeadingNormed < 0) {
  //     currentHeadingNormed = currentHeadingNormed + 360;
  //   }
    
  //   // left or right?
  //   if (currentHeadingNormed > threshold && currentHeadingNormed < (90+threshold)) {
  //     // right
  //     val = 1;
  //   } else if (currentHeadingNormed < (360-threshold) && currentHeadingNormed > (270-threshold)) {
  //     // left
  //     val = -1;
  //   } else if (currentHeadingNormed < threshold || currentHeadingNormed > (360-threshold)) {
  //     // center
  //     val = 0;
  //   } else {
  //     // do nothing
  //     val = null;
  //   }


    // // initial calculation version: beachted sprung 360 zu 0 nicht...
    // let diff = currentHeading - this.initHeadingOfController;
    // if (diff > threshold) {
    //   // right
    //   val = 1;
    // } else if (diff < -threshold) {
    //   // left
    //   val = -1;
    // } else {
    //   // center
    //   val = 0;
    // }


    // // fix, other calculation version: calculate opposite degree, check if on right or left side
    // let oppositeDegree = this.initHeadingOfController + 180;
    // if (this.initHeadingOfController < oppositeDegree) {
    //   // left: change 360 to 0
    //   // right: normally increasing
    //   if (this.initHeadingOfController < currentHeading && currentHeading < oppositeDegree) {
    //     // moved to the right
    //     val = 1;
    //   } else {
    //     val = -1;
    //   }
    // } else {
    //   // left: normally decreasing
    //   // right: change 360 to 0
    //   if (this.initHeadingOfController > currentHeading && currentHeading > oppositeDegree) {
    //     // moved to the left
    //     val = -1;
    //   } else {
    //     val = 1;
    //   }
    // }

  //   return val;
  // }


  // gyro: rotation/twist of phone
  // private startGyroOrientationSensor(): void {
  //   let options: GyroscopeOptions = {
  //     frequency: 100
  //   }

  //   this.sensorInterval = setInterval(() => {
  //     this.gyroscope.getCurrent(options)
  //       .then(
  //         (orientation: GyroscopeOrientation) => {
  //           this.processGyroOrientationData(orientation);
  //         })
  //       .catch()
  //   }, 1000 / 50);
  // }

  // private processGyroOrientationData(orientation: GyroscopeOrientation) {
  //   let val = orientation.x;

  //   if (orientation.x > 2 || orientation.x < -2) {

  //  // if (val != null && val != 0) {
  //     this.socketService.emit('controllerData', [orientation.x, this.controllerNumber]);
  //     //this.socketService.emit('controllerData', [this.calculateGravity(val), this.controllerNumber]);
  //     console.log("orientation", orientation.x, orientation.y, orientation.z);
  //   }
  //   // this.socketService.emit('controllerData', [orientation.y]);
  //   // console.log("orientation z", orientation.z);
  //   // this.socketService.emit('controllerData', [orientation.z]);
  // }


  
  // private calculateGravity(val: number): number {
  //   let threshold = 20;

  //   threshold = 10;
  //   val = -val;
  
  //   if(val > threshold){
  //     val = 1;
  //   } else if(val < -threshold){
  //     val = -1;
  //   } else {
  //     val = 1 / threshold * val;
  //   }

  //   return val;
  // }


  // accelerometer: beschleunigung in 3 achsen
  // doku von ionic: https://ionicframework.com/docs/native/device-motion
  private startAccelerometerSensor(): void {
    this.sensorInterval = setInterval(() => {
      this.deviceMotion.getCurrentAcceleration()
        .then(
          (acceleration: DeviceMotionAccelerationData) => this.processAccelData(acceleration),
          (error: any) => console.log(error)
        );
    }, 1000 / 60);   
  }

  //round acceleration to full value to avoid .xx values
  private processAccelData(acceleration: DeviceMotionAccelerationData) {
    console.log("acceleration.y: "+acceleration.y);
  //  let seesawAngle;

  //  let accelerationY = Math.floor(acceleration.y * 10000)/10000;

  //  let calculatedAngle = this.calculateAngle(accelerationY);
    this.calculateAngle(acceleration.y)
  
    //TODO: SWITCH CASE
    // rechts -> > 1 
    if (acceleration.y >= 3 && this.seesawAngle != 0.6){
      this.seesawAngle = 0.6 // 4.0 
      this.socketService.emit('controllerData', [this.seesawAngle, this.controllerNumber]);
      console.log("Sended seesawAngle (plus):" + this.seesawAngle);
    } 
    // links -> >-1
    else if (acceleration.y <= -3 && this.seesawAngle != -0.5){
      this.seesawAngle = -0.6 //-4.0 
      this.socketService.emit('controllerData', [this.seesawAngle, this.controllerNumber]);
      console.log("Sended seesawAngle (minus):" + this.seesawAngle);
    } 
    // center when between 1 and -1
    else if (acceleration.y < 3 && acceleration.y > -3 && this.seesawAngle != 0){
      this.seesawAngle = 0 
      this.socketService.emit('controllerData', [this.seesawAngle, this.controllerNumber]);
      console.log("Sended seesawAngle (zero)): " + this.seesawAngle);
    }

    /* if (acceleration.y < 5 && acceleration.y > -5) {
      //  if (!this.justSendedData) {
          console.log("acceleration Y", acceleration.y);
          
          this.socketService.emit('controllerData', [acceleration.y, this.controllerNumber]);
        //  this.vibration.vibrate(100);
          this.justSendedData = true;

/*           setTimeout(() => {
            this.justSendedData = false;
          }, 500); //500 */
        //}
     // } 
  }

  private calculateAngle(accelerationY){
    let val = accelerationY*-9;
    //console.log("Calculation of Angle: "+val);
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
      //console.log("ionic: quitGame() called");
      //this.controllerQuitGame = true;
      this.socketService.emit('quitGame');
    }

}
