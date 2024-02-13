import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { HashRouter as Router } from 'react-router-dom';
import { createHashHistory } from 'history';
import * as Cordova from "./utils/cordova";
import { Provider } from 'react-redux';
import Store from './store';

const StoreInstance = Store();

function askForCameraPermissions() {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function (stream) {
      // Camera access is granted. You can do something with the camera stream if needed.
      console.log("Camera access granted!");
    })
    .catch(function (error) {
      // Camera access is denied or an error occurred.
      console.error("Error accessing the camera:", error);
    });
}

function checkAndRequestPermission() {
  var permission = cordova.plugins.permissions.CAMERA; // Replace with the permission you need

  cordova.plugins.permissions.checkPermission(permission, function (status) {
    if (status.hasPermission) {
      // Permission is already granted
      console.log('Permission already granted');
      // Perform actions that require this permission
    } else {
      // Request the permission
      cordova.plugins.permissions.requestPermission(permission, function (status) {
        if (status.hasPermission) {
          // Permission granted
          console.log('Permission granted');
          // Perform actions that require this permission
        } else {
          // Permission denied
          console.log('Permission denied');
          // Handle the denial of permission (e.g., show a message to the user)
        }
      }, function () {
        // Error occurred while requesting the permission
        console.log('Error requesting permission');
      });
    }
  }, function () {
    // Error occurred while checking the permission
    console.log('Error checking permission');
  });
}

function onDeviceReady() {
  const platform = window.cordova?.platformId; // Use the Cordova platformId instead of device.platform
  console.log(platform)
  console.log(window.cordova)
  if (platform === "Android" || platform === "iOS") {
    askForCameraPermissions();
    checkAndRequestPermission();
  } else {
    console.log("This app is not running on a mobile device.");
  }

  const history = createHashHistory({ queryKey: false });

  ReactDOM.render(
    <Provider store={StoreInstance}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>,
    document.getElementById('root')
  );
  serviceWorker.unregister();
}

var url = document.URL;
if (url.indexOf("http://") !== -1 || url.indexOf("https://") !== -1) {
  onDeviceReady();
} else {
  document.addEventListener("deviceready", onDeviceReady, false);
}
