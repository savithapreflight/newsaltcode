import * as Enviornment from "./environment";
import * as q from "q";
import * as SQL from "./SQL";
import axios from "axios";
//Method to check device status
export function fetch(data) {
  var defer = q.defer();
  var host = Enviornment.host();
  var url = host + "/flighteditionNo";
  var DEBUG = Enviornment.debug();

  axios
    .post(url, data)
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

//Method to add transaction into database
export function add(data) {
  console.log(data);
  const data1 = {
    Id: data.Id,

    Flight_Date: data.Flight_Date,

    Flight_no: data.Flight_no,

    Destination: data.Destination,

    source: data.Source,

    EdNo: data.EDNO,

    Regn_no: data.Acft_Regn,

    ActcrewStr: data.ActcrewStr,

    cmpt1: data.cmpt1,

    cmpt2: data.cmpt2,

    cmpt3: data.cmpt3,

    cmpt4: data.cmpt4,

    ZFW: data.ZFW,

    FOB: data.FOB,

    TOW: data.TOW,

    TripFuel: data.TRIP_FUEL,

    underLoadLMC: data.underLoadLMC,

    ZFWindex: data.ZFWindex,

    TOWindex: data.TOWindex,

    LWindex: data.LWindex,

    ZFWMAC: data.ZFWMAC,

    TOWMAC: data.TOWMAC,

    LWMAC: data.LWMAC,

    LoadOfficer: data.Load_Officer,
    specialStr: data.specialStr,

    Captain: data.CAPTAIN,

    OEW: data.OEW,

    OEW_Index: data.OEW_Index,

    AdjustStr: data.AdjustStr,

    ActCabStr: data.ActCabStr,

    ActCompStr: data.ActCompStr,

    OLW: data.OLW,

    OTOW: data.OTOW,

    RTOW: data.RTOW,

    AdjustStrv2: data.AdjustStrv2,

    LW: data.LW,

    TrimOfficer: data.Trim_Officer,

    UTCtime: data.UTCtime,

    ISTtime: data.ISTtime,

    FlapValues: data.FlapValues,

    ThrustValues: data.ThrustValues,

    StabValues: data.StabValues,

    AppType: data.AppType,

    ZFWMACFWD: data.ZFWMACFWD,

    ZFWMACAFT: data.ZFWMACAFT,

    TOWMACFWD: data.TOWMACFWD,

    TOWMACAFT: data.TOWMACAFT,

    LWMACFWD: data.LWMACFWD,

    LWMACAFT: data.LWMACAFT,

    Userid: data.LTLoginId,

    isSync: data.isSync,
  };
  var defer = q.defer();
  var host = Enviornment.host();
  var url = host + "/flighteditionNo/insert";
  var DEBUG = Enviornment.debug();

  axios
    .post(url, data1)
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

export function DeleteFlightEditionNoByFlightNoDate(Flight_no, Flight_Date) {
  var defer = q.defer();

  var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);
  let db;

  request.onsuccess = (event) => {
    db = event.target.result;

    const transaction = db.transaction("flighteditionno", "readwrite");
    const objectStore = transaction.objectStore("flighteditionno");

    const deleteRequest = objectStore.delete(
      IDBKeyRange.bound([Flight_no, Flight_Date], [Flight_no, Flight_Date])
    );

    deleteRequest.onsuccess = () => {
      defer.resolve();
    };

    deleteRequest.onerror = (event) => {
      console.log(event.error);
      defer.reject(new Error("Failed to delete FlightEditionNo."));
    };
  };

  request.onerror = (event) => {
    console.log(event.error);
    defer.reject(new Error("Failed to open the database."));
  };

  return defer.promise;
}

export function UpdateFlightEditionNoByFlightNoDate(
  Flight_no,
  Flight_Date,
  data
) {
  var defer = q.defer();

  var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);
  let db;

  request.onsuccess = (event) => {
    db = event.target.result;

    const transaction = db.transaction("flighteditionno", "readwrite");
    const objectStore = transaction.objectStore("flighteditionno");

    const getRequest = objectStore.get(
      IDBKeyRange.bound([Flight_no, Flight_Date], [Flight_no, Flight_Date])
    );

    getRequest.onsuccess = (event) => {
      const existingData = event.target.result;

      if (existingData) {
        existingData.EdNo = data.EdNo;
        existingData.OLW = data.OLW;
        existingData.OTOW = data.OTOW;

        const putRequest = objectStore.put(existingData);

        putRequest.onsuccess = () => {
          defer.resolve();
        };

        putRequest.onerror = (event) => {
          console.log(event.error);
          defer.reject(new Error("Failed to update FlightEditionNo."));
        };
      } else {
        defer.reject(new Error("FlightEditionNo not found."));
      }
    };

    getRequest.onerror = (event) => {
      console.log(event.error);
      defer.reject(new Error("Failed to find FlightEditionNo."));
    };
  };

  request.onerror = (event) => {
    console.log(event.error);
    defer.reject(new Error("Failed to open the database."));
  };

  return defer.promise;
}
