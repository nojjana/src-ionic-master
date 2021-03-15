# Mobile Front End of the Shared Remote Controller (SRC) Platform
This project is one of three projects of the shared remote controller platform. It is responsible for controlling the games, navigating through the lobby and choosing games. It also send the sensor data from the smartphones to the game-server. The mobile application is written with the [Ionic Framework](https://ionicframework.com/). This allows building the application for iOS and Android platforms. The mobile front end needs customs plugins to get the sensordata with the right sampling rate. Those plugins are only available for the android application.
The image below shows, how the projects works together. The browser front end is displaying the platform and rendering the games. The game server sends update events to the browser front end. The game server receives sensor data from the mobile front end. It computes the games with this data. Furthermore the game server handles the websocket connections and is resposnible for the lobby management.

![Image of the SRC Platform](https://github.com/andreasumbricht/src-browser/blob/master/src/assets/Plattform%20Aufbau.PNG)

## Installation
### Environment
First, you must install node, npm and Ionic. The exact steps to install node and npm are platform dependent. 

To install Ionic, please follow this [tutorial](https://ionicframework.com/docs/intro/cli).

Since Ionic works with Angular, you also may need to install it following this [tutorial](https://cli.angular.io/).

The project was written with the following versions:
| Name          | Version        |
| ------------- |:-------------:|
| Node     | 10.14.2 |
| npm     | 6.4.1      |
| Ionic | 5.2.3     |
| Angular CLI | 8.3.26 |

### Source code
You can get the source code of this repository with the command:

```bash
git clone https://github.com/andreasumbricht/src-db-server.git
```

After that, install all packages assocciated with the project with the command:
```bash
npm install
```

### Verification
If you type `ionic serve` in the terminal, inside your cloned repository, you should see a black screen, with a white text "Connecting to service...".

At this stage, you should consider setting up the [src-db-server](https://github.com/andreasumbricht/src-db-server) repository.

If you already have the src-db-server repository up and running, change the url of the src-db-server inside the ./src/environments/environments.ts file. Now you should be able to see an input field and a button on your browser window.

## Development
You can start the development server with the command:
```bash
ionic serve
```
This will start a live-reload server on your default browser.

## Deployment
Ensure that ./src/environments/environments.ts is set correctly.

If you let the app run on your Android phone, you need to enter the command:
```bash
ionic cordova build android
```
You must have an active and working installation of Android Studio and the Android SDK. For more infos check out [this article](https://ionicframework.com/docs/developing/android). If you do this for the first time, it may take a while to complete.

Connect your phone to your computer and Android Studio, so you can deploy the app on it. You need to enable the developer mode on your Android phone.

If everything is set up correctly, you should be able to see the app running on your phone. Now to the last part:

## Deployment with custom plugins
The app runs on your phone, but the sensor won't send the right values to the server. You need to add our own custom plugins to the Android code base manually.

1. Copy and replace ./AccelListener.java with ./platforms/android/app/src/main/java/org/apache/cordova/devicemotion/AccelListener.java
2. Copy and replace ./DBMeter.java with ./platforms/android/app/src/main/java/org/apache/cordova/devicemotion/AccelListener.java
3. Copy and replace ./GyroscopeListener.java with ./platforms/android/app/src/main/java/org/apache/cordova/dbmeter/DBMeter.java

These steps only need to be done once, after the creation of the Android Studio Project.

Now, everything is setup and you are ready to go!
