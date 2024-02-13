import * as Enviornment from "./environment";
import axios from "axios";
import * as q from "q";

export function fetch() {
  var defer = q.defer();
  var host = Enviornment.host();
  var url = host + "/fleet/info";
  var DEBUG = Enviornment.debug();

  axios
    .get(url)
    .then(function (response) {
      var response_data = response.data;
      if (response.data !== undefined) {
        defer.resolve(response_data);
      } else {
        DEBUG && console.log("Error", response);
        defer.reject({ error: "Something went wrong!" });
      }
    })
    .catch(function (error) {
      console.log(error);

      if (
        error.response !== undefined &&
        error.response.data !== undefined &&
        error.response.data.message !== undefined
      ) {
        DEBUG && console.log("Error", error.response.data);
        defer.reject({ error: error.response.data.message });
      } else {
        DEBUG && console.log("Error", error);
        defer.reject({ error: "Something went wrong!" });
      }
    });
  return defer.promise;
}

export function DeleteFleetInfoByAcRegn(AC_REGN) {
  var defer = q.defer();

  const openDB = indexedDB.open(Enviornment.get("DB_NAME"), 1);

  openDB.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction("fleetinfo", "readwrite");
    const objectStore = transaction.objectStore("fleetinfo");

    const deleteRequest = objectStore.delete(AC_REGN);

    deleteRequest.onsuccess = function () {
      defer.resolve();
    };

    deleteRequest.onerror = function (event) {
      defer.reject(new Error("Failed to delete the FleetInfo."));
    };
  };

  openDB.onerror = function (event) {
    defer.reject(new Error("Failed to delete the FleetInfo."));
  };

  return defer.promise;
}

export function UpdateFleetInfoByAcRegn(AC_REGN, data) {
  var defer = q.defer();

  const openDB = indexedDB.open(Enviornment.get("DB_NAME"), 1);

  openDB.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction("fleetinfo", "readwrite");
    const objectStore = transaction.objectStore("fleetinfo");

    const getRequest = objectStore.get(AC_REGN);

    getRequest.onsuccess = function () {
      const existingData = getRequest.result;

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          existingData[key] = data[key];
        }
      }

      const putRequest = objectStore.put(existingData, AC_REGN);

      putRequest.onsuccess = function () {
        defer.resolve();
      };

      putRequest.onerror = function (event) {
        defer.reject(new Error("Failed to update the FleetInfo."));
      };
    };

    getRequest.onerror = function (event) {
      defer.reject(new Error("Failed to update the FleetInfo."));
    };
  };

  openDB.onerror = function (event) {
    console.error("Error opening IndexedDB:", event.target.error);
    defer.reject(new Error("Failed to update the FleetInfo."));
  };
  return defer.promise;
}
