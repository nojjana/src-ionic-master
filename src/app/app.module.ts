import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Gyroscope } from '@ionic-native/gyroscope/ngx';
import { DBMeter } from '@ionic-native/db-meter/ngx';
import { NotInLobbyComponent } from './not-in-lobby/not-in-lobby.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { LabyrinthGameComponent } from './labyrinth-game/labyrinth-game.component';
import { SpaceshipGameComponent } from './spaceship-game/spaceship-game.component';
import { WhackAMoleGameComponent } from './whack-a-mole-game/whack-a-mole-game.component';
import { ShakerGameComponent } from './shaker-game/shaker-game.component';
import { DeviceOrientation } from '@ionic-native/device-orientation/ngx';
import { DeviceMotion } from '@ionic-native/device-motion/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { NoDisplaysErrorComponent } from './modals/no-displays-error/no-displays-error.component';
import { LobbyFullComponent } from './modals/lobby-full/lobby-full.component';
import { WrongLobbyCodeComponent } from './modals/wrong-lobby-code/wrong-lobby-code.component';
import { VarianzTestComponent } from './varianz-test/varianz-test.component';
import { Vibration } from '@ionic-native/vibration/ngx';
import { GameRunningComponent } from './modals/game-running/game-running.component';

@NgModule({
  declarations: [AppComponent, NotInLobbyComponent, MainMenuComponent, LabyrinthGameComponent, 
    SpaceshipGameComponent, WhackAMoleGameComponent, ShakerGameComponent, NoDisplaysErrorComponent,
    LobbyFullComponent, WrongLobbyCodeComponent, VarianzTestComponent, GameRunningComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, NgxSmartModalModule.forRoot()],
  providers: [
    StatusBar,
    SplashScreen,
    DBMeter,
    Gyroscope,
    DeviceMotion,
    DeviceOrientation,
    Insomnia,
    Vibration,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
