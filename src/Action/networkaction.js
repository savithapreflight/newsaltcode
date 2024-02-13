import { toast } from "react-toastify";
import React from "react";

export function networkOn() {
  return {
    type: "NETWORK_ON",
  };
}

export function networkOff() {
  return {
    type: "NETWORK_OFF",
  };
}

export function isNetworkUp() {
  if (window.cordova != undefined) {
    if (navigator.connection.type === "none") {
      return false;
    } else {
      return true;
    }
  } else {
    if (navigator.connection.rtt === 0) {
      return false;
    } else {
      return true;
    }
  }
}

export function showError(message) {
  toast.error(message, {
    toastId: "toast-error",
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}
