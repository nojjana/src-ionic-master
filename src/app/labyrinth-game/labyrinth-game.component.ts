import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../socket-service/socket.service';
import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope/ngx';
import { Platform } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { Vibration } from '@ionic-native/vibration/ngx';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';

@Component({
  selector: 'app-labyrinth-game',
  templateUrl: './labyrinth-game.component.html',
  styleUrls: ['./labyrinth-game.component.scss'],
})
export class LabyrinthGameComponent implements OnInit, OnDestroy {
  private sensorInterval: any;
  public tutorial: boolean = false;
  public playing: boolean = false;
  public xAxis: boolean;
  public showMainMenuButton: boolean = false;
  private devVal: number = 0;
  public devControls;
  public dots = 0;
  private dotInterval;
  public played = false;
  public slideOptions = {
    allowTouchMove: false
  }

  constructor(private deviceMotion: DeviceMotion, private socketService: SocketService, private gyroscope: Gyroscope, private platform: Platform, private vibration: Vibration) {
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
    if(this.xAxis){
      this.devVal -= 5;
    }
  }

  public right(): void {
    if(this.xAxis){
      this.devVal += 5;
    }
  }

  public up(): void {
    if(!this.xAxis){
      this.devVal += 5;
    }
  }

  public down(): void {
    if(!this.xAxis){
      this.devVal -= 5;
    }
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
      this.xAxis = data;
      this.tutorial = true;
    })

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

  private calculateGravity(val: number): number {
    let threshold = 20;

    if(!this.xAxis){
      threshold = 10;
      val = -val;
    }

    if(val > threshold){
      val = 1;
    } else if(val < -threshold){
      val = -1;
    } else {
      val = 1 / threshold * val;
    }

    return val;
  }

  private startDevControls(): void {
    this.sensorInterval = setInterval(() => {
      let val = this.devVal;

      console.log(val);
      this.socketService.emit('controllerData', this.calculateGravity(val));
   }, 1000 / 50)
  }

  private startSensor(): void {
    let options: GyroscopeOptions = {
      frequency: 1000
    }

    
    this.sensorInterval = setInterval(() => {
      this.gyroscope.getCurrent(options)
      .then((orientation: GyroscopeOrientation) => {
        let val = 0;
        console.log()

        if(this.xAxis){
          val = orientation.z;
        } else {
          val = orientation.y;
        }
        
        this.socketService.emit('controllerData', this.calculateGravity(val));
    })
      .catch()
   }, 1000 / 50)

   //INPUT ANDI FÜR ACCELEROMETER
     /*
   this.sensorInterval = setInterval(() => {
    this.deviceMotion.getCurrentAcceleration().then(
      (acceleration: DeviceMotionAccelerationData) => this.processData(acceleration),
      (error: any) => console.log(error)
    );
  }, 1000 / 60);*/
  }

  //INPUT ANDI
  /*
  processData(acceleration: DeviceMotionAccelerationData) {
    console.log(acceleration.x, acceleration.y, acceleration.z);
  }*/

  ngOnDestroy() {
    clearInterval(this.sensorInterval);
    this.socketService.removeListener('controllerResponsibility');
    this.socketService.removeListener('stopSendingData');
    this.socketService.removeListener('startSendingData');
    clearInterval(this.dotInterval);
  }
}
