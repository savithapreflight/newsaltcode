import moment from "moment";
import * as q from "q";
import * as SQL from "./SQL";
import * as Enviornment from "./environment";

import { fetch as fetchNsCheckIn } from "./nscheckindetail";
import { fetch as fetchNsLnt } from "./nslntdetail";
import { fetch as fetchThrust } from "./thrustarchive";
import { fetch as fetchEdition } from "./flighteditionno";

export const syncFlight = () => {
  return async function (dispatch) {
    try {
      dispatch({ type: "RAMP_SYNC_STARTED" });
      nsCheckInDetail();
      nsLntDetail();
      thrustArchive();
      await flighteditionNo();
      dispatch({ type: "RAMP_SYNC_COMPLETED" });
    } catch (err) {
      console.log(err);
      dispatch({ type: "RAMP_SYNC_COMPLETED" });
    }
  };
};

const nsCheckInDetail = async () => {
  var user = window.localStorage.getItem("auth_user");
  if (user == null || user == undefined) {
    return;
  }
  user = JSON.parse(user);
  const flightData = JSON.parse(window.localStorage.getItem("selected_flight"));
  const result = await fetchNsCheckIn({
    airport_code: user.airport_code,
    date: moment(flightData.Flight_Date).format("YYYY-MM-DD HH:mm:ss"),
    flight_no: flightData.Flight_no,
    last_sync_time: window.localStorage.getItem("last_sync", null),
  });
  //console.log("nsCheck: ", result.data.data[0]);
  if (result.data.data.length > 0) {
    result.data.data.map((item) => {
      insertToNsCheckInDetail(item);
    });
  }
  return;
};

const nsLntDetail = async () => {
  var user = window.localStorage.getItem("auth_user");
  if (user == null || user == undefined) {
    return;
  }
  user = JSON.parse(user);
  const flightData = JSON.parse(window.localStorage.getItem("selected_flight"));
  const result = await fetchNsLnt({
    airport_code: user.airport_code,
    date: moment(flightData.Flight_Date).format("YYYY-MM-DD HH:mm:ss"),
    flight_no: flightData.Flight_no,
    last_sync_time: window.localStorage.getItem("last_sync", null),
  });
  //console.log("nsLntDetail: ", result.data.data.length);
  if (result.data.data.length > 0) {
    result.data.data.map((item) => {
      insertToNsLntDetails(item);
    });
  }
  return;
};

const thrustArchive = async () => {
  var user = window.localStorage.getItem("auth_user");
  if (user == null || user == undefined) {
    return;
  }
  user = JSON.parse(user);
  const flightData = JSON.parse(window.localStorage.getItem("selected_flight"));
  const result = await fetchThrust({
    airport_code: user.airport_code,
    date: moment(flightData.Flight_Date).format("YYYY-MM-DD HH:mm:ss"),
    flight_no: flightData.Flight_no,
    last_sync_time: window.localStorage.getItem("last_sync", null),
  });
  if (result.data.data.length > 0) {
    result.data.data.map((item) => {
      insertThrustArchive(item);
    });
  }
  return;
};

const flighteditionNo = async () => {
  var user = window.localStorage.getItem("auth_user");
  if (user == null || user == undefined) {
    return;
  }
  user = JSON.parse(user);
  const flightData = JSON.parse(window.localStorage.getItem("selected_flight"));
  const result = await fetchEdition({
    airport_code: user.airport_code,
    date: moment(flightData.Flight_Date).format("YYYY-MM-DD HH:mm:ss"),
    flight_no: flightData.Flight_no,
    last_sync_time: window.localStorage.getItem("last_sync", null),
  });
  if (result.data.data.length > 0) {
    result.data.data.map((item) => {
      insertFlightEditionNumber(item);
    });
  }
  return;
};


const insertToNsCheckInDetail = (data) => {
  try {
    var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

    request.onsuccess = function (event) {
      var db = event.target.result;

      var transaction = db.transaction(["nscheckindetail"], "readwrite");
      var objectStore = transaction.objectStore("nscheckindetail");

      var request = objectStore.put({
        Id: data.Id,
        Flight_Date: data.Flight_Date,
        Flight_no: data.Flight_no,
        Destination: data.Destination,
        source: data.source,
        C1Adult: data.C1Adult,
        C2Adult: data.C2Adult,
        C3Adult: data.C3Adult,
        C4Adult: data.C4Adult,
        C5Adult: data.C5Adult,
        C6Adult: data.C6Adult,
        C7Adult: data.C7Adult,
        C8Adult: data.C8Adult,
        C1Child: data.C1Child,
        C2Child: data.C2Child,
        C3Child: data.C3Child,
        C4Child: data.C4Child,
        C5Child: data.C5Child,
        C6Child: data.C6Child,
        C7Child: data.C7Child,
        C8Child: data.C8Child,
        C1Infant: data.C1Infant,
        C2infant: data.C2infant,
        C3Infant: data.C3Infant,
        C4Infant: data.C4Infant,
        C5Infant: data.C5Infant,
        C6Infant: data.C6Infant,
        C7Infant: data.C7Infant,
        C8Infant: data.C8Infant,
        OutofGate: data.OutofGate,
      });

      request.onsuccess = function (event) {
        console.log("Data inserted successfully into nscheckindetail");
      };

      request.onerror = function (event) {
        console.error("Error inserting data into IndexedDB", event.target.error);
      };
    };

    request.onerror = function (event) {
      console.error("Error opening IndexedDB", event.target.error);
    };
  } catch (err) {
    console.log(err);
  }
};



const insertToNsLntDetails = (data) => {
  try {
    var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

    request.onsuccess = function (event) {
      var db = event.target.result;

      var transaction = db.transaction("nslntdetail", "readwrite");
      var objectStore = transaction.objectStore("nslntdetail");

      var request = objectStore.put({
        Id: data.Id,
        Flight_Date: data.Flight_Date,
        Flight_no: data.Flight_no,
        Destination: data.Destination,
        source: data.source,
        Acft_Regn: data.Acft_Regn,
        EDNO: data.EDNO,
        ActcrewStr: data.ActcrewStr,
        cmpt1: data.cmpt1,
        cmpt2: data.cmpt2,
        cmpt3: data.cmpt3,
        cmpt4: data.cmpt4,
        TrimGenTimeUTC: data.TrimGenTimeUTC,
        ZFW: data.ZFW,
        FOB: data.FOB,
        TOW: data.TOW,
        TRIP_FUEL: data.TRIP_FUEL,
        underLoadLMC: data.underLoadLMC,
        ZFWindex: data.ZFWindex,
        TOWindex: data.TOWindex,
        LWindex: data.LWindex,
        ZFWMAC: data.ZFWMAC,
        TOWMAC: data.TOWMAC,
        LWMAC: data.LWMAC,
        specialStr: data.specialStr,
        LTLoginId: data.LTLoginId,
        Load_Officer: data.Load_Officer,
        CAPTAIN: data.CAPTAIN,
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
        Trim_Officer: data.Trim_Officer,
        PalletsStr: data.PalletsStr,
        ZFWMACFWD: data.ZFWMACFWD,
        ZFWMACAFT: data.ZFWMACAFT,
        TOWMACFWD: data.TOWMACFWD,
        TOWMACAFT: data.TOWMACAFT,
        LWMACFWD: data.LWMACFWD,
        LWMACAFT: data.LWMACAFT,
        isSync: true,
        CargoOnSeatStr: data.CargoOnSeatStr,
        ActLoadDistStr: data.ActLoadDistStr,
        ActLoadDistStrV2: data.ActLoadDistStrV2,
        CaptEmpId: data.CaptEmpId,
      });

      request.onsuccess = function (event) {
        console.log("Data inserted successfully into nslntdetail");
      };

      request.onerror = function (event) {
        console.error("Error inserting data into IndexedDB", event.target.error);
      };
    };

    request.onerror = function (event) {
      console.error("Error opening IndexedDB", event.target.error);
    };
  } catch (err) {
    console.log(err);
  }
};


const insertThrustArchive = (data) => {
  try {
    var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

    request.onsuccess = function (event) {
      var db = event.target.result;

      var transaction = db.transaction("thrustarchive", "readwrite");
      var objectStore = transaction.objectStore("thrustarchive");

      var request = objectStore.put({
        Id: data.Id,
        Flight_Date: data.Flight_Date,
        Flight_no: data.Flight_no,
        Destination: data.Destination,
        source: data.source,
        Thrust1: data.Thrust1,
        T1Flap1: data.T1Flap1,
        T1Stab1: data.T1Stab1,
        T1Flap2: data.T1Flap2,
        T1Stab2: data.T1Stab2,
        Thrust2: data.Thrust2,
        T2Flap1: data.T2Flap1,
        T2Stab1: data.T2Stab1,
        T2Flap2: data.T2Flap2,
        T2Stab2: data.T2Stab2,
        Thrust3: data.Thrust3,
        T3Flap1: data.T3Flap1,
        T3Stab1: data.T3Stab1,
        T3Flap2: data.T3Flap2,
        T3Stab2: data.T3Stab2,
        Thrust4: data.Thrust4,
        T4Flap1: data.T4Flap1,
        T4Stab1: data.T4Stab1,
        T4Flap2: data.T4Flap2,
        T4Stab2: data.T4Stab2,
        FlapValues: data.FlapValues,
        ThrustValues: data.ThrustValues,
        StabValues: data.StabValues,
        isSync: true,
      });

      request.onsuccess = function (event) {
        console.log("Data inserted successfully into thrustarchive");
      };

      request.onerror = function (event) {
        console.error("Error inserting data into IndexedDB", event.target.error);
      };
    };

    request.onerror = function (event) {
      console.error("Error opening IndexedDB", event.target.error);
    };
  } catch (err) {
    console.log(err);
  }
};


const insertFlightEditionNumberIndexedDB = async (objectStore, data) => {
  try {
    const request = objectStore.put(data);

    request.onsuccess = (event) => {
      console.log("Record added/updated in IndexedDB:", event.target.result);
    };

    request.onerror = (event) => {
      console.error("Error adding/updating record in IndexedDB:", event.target.error);
    };
  } catch (err) {
    console.log(err);
  }
};

// Usage in your main function
const flightEditionNumberIndexedDB = async () => {
  const dbName = Enviornment.get("DB_NAME");
  const dbVersion = 1;

  const db = await new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });

  const transaction = db.transaction("flighteditionno", "readwrite");
  const objectStore = transaction.objectStore("flighteditionno");

  const data = {
    Id: data.Id,
    Flight_Date: data.Flight_Date,
    Flight_no: data.Flight_no,
    Destination: data.Destination,
    source: data.source,
    EdNo: data.EdNo,
    Regn_no: data.Regn_no,
    ActcrewStr: data.ActcrewStr,
     cmpt1:data.cmpt1,
     cmpt2:data.cmpt2,
     cmpt3:data.cmpt3,
     cmpt4:data.cmpt4,
    ZFW:data.ZFW,
    FOB:data.FOB,
    TOW:data.TOW,
   TripFuel: data.TripFuel,
   underLoadLMC: data.underLoadLMC,
   ZFWindex: data.ZFWindex,
   TOWindex: data.TOWindex,
    LWindex:data.LWindex,
   ZFWMAC: data.ZFWMAC,
    TOWMAC:data.TOWMAC,
     LWMAC:data.LWMAC,
   LoadOfficer: data.LoadOfficer,
     SI:data.SI,
    Captain: data.Captain,
    OEW:data.OEW,
     OEW_Index:data.OEW_Index,
     AdjustStr:data.AdjustStr,
    ActCabStr: data.ActCabStr,
   ActCompStr: data.ActCompStr,
    OLW:data.OLW,
   OTOW: data.OTOW,
    RTOW:data.RTOW,
  AdjustStrv2:  data.AdjustStrv2,
   LW: data.LW,
   TrimOfficer: data.TrimOfficer,
   UTCtime: data.UTCtime,
   ISTtime: data.ISTtime,
   FlapValues: data.FlapValues,
     ThrustValues:data.ThrustValues,
    StabValues: data.StabValues,
     AppType:data.AppType,
     ZFWMACFWD:data.ZFWMACFWD,
     ZFWMACAFT:data.ZFWMACAFT,
    TOWMACFWD:data.TOWMACFWD,
   TOWMACAFT: data.TOWMACAFT,
   LWMACFWD: data.LWMACFWD,
   LWMACAFT: data.LWMACAFT,
   Userid: data.Userid,
    
    isSync: true,
  };

  insertFlightEditionNumberIndexedDB(objectStore, data);

  return;
};
