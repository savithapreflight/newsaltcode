import * as q from "q";
import * as SQL from "./SQL";
import *  as Enviornment from '../../src/Action/environment'
export function fetchTrimSheetforFlight(
  flight_no,
  flight_date,
  source,
  destination
) {
  var auth = JSON.parse(window.localStorage.getItem("auth_user"));

  var defer = q.defer();
  var result = {};
console.log('hdsnu')
  fetchNsLnTDetail(flight_no, flight_date, source, destination)
    .then((resu) => {
      console.log(resu)
      result["Acft_Regn"] = resu[0].Acft_Regn;
      result["Flight_Date"] = resu[0].Flight_Date;
      result["Destination"] = resu[0].Destination;
      result["Source"] = resu[0].source;
      result["Flight_no"] = resu[0].Flight_no;
      result["EDNO"] = resu[0].EDNO;
      result["ActcrewStr"] = resu[0].ActcrewStr;
      result["cmpt1"] = parseInt(resu[0].cmpt1);
      result["cmpt2"] = parseInt(resu[0].cmpt2);
      result["cmpt3"] = parseInt(resu[0].cmpt3);
      result["cmpt4"] = parseInt(resu[0].cmpt4);
      result["TrimGenTimeUTC"] = resu[0].TrimGenTimeUTC;
      result["ZFW"] = resu[0].ZFW;
      result["FOB"] = resu[0].FOB;
      result["LAW"] = resu[0].LW;
      result["TOW"] = resu[0].TOW;
      result["TRIP_FUEL"] = resu[0].TRIP_FUEL;
      result["underLoadLMC"] = resu[0].underLoadLMC;
      result["ZFWindex"] = resu[0].ZFWindex;
      result["TOWindex"] = resu[0].TOWindex;
      result["LWindex"] = resu[0].LWindex;
      result["ZFWMAC"] = resu[0].ZFWMAC;
      result["TOWMAC"] = resu[0].TOWMAC;
      result["LWMAC"] = resu[0].LWMAC;
      result["specialStr"] = resu[0].specialStr;
      result["LTLoginId"] = resu[0].LTLoginId;
      result["Load_Officer"] = resu[0].Load_Officer;
      result["Trim_Officer"] = resu[0].Trim_Officer;
      result["CAPTAIN"] = resu[0].CAPTAIN;
      result["OEW"] = resu[0].OEW;
      result["OEW_Index"] = resu[0].OEW_Index;
      result["AdjustStr"] = resu[0].AdjustStr;
      result["ActCabStr"] = resu[0].ActCabStr;
      result["ActCompStr"] = resu[0].ActCompStr;
      result["AdjustStrv2"] = resu[0].AdjustStrv2;
      result["PalletsStr"] = resu[0].PalletsStr;
      result["ZFWMACFWD"] = resu[0].ZFWMACFWD;
      result["ZFWMACAFT"] = resu[0].ZFWMACAFT;
      result["TOWMACFWD"] = resu[0].TOWMACFWD;
      result["TOWMACAFT"] = resu[0].TOWMACAFT;
      result["LWMACFWD"] = resu[0].LWMACFWD;
      result["LWMACAFT"] = resu[0].LWMACAFT;
      result["CargoOnSeatStr"] = resu[0].CargoOnSeatStr;
      result["BagLDM"] = resu[0].BagLDM;
      result["CargoLDM"] = resu[0].CargoLDM;
      result["ActLoadDistStrV2"] = resu[0].ActLoadDistStrV2;
      result["ActLoadDistStr"] = resu[0].ActLoadDistStr;
      result["TargetTOWMAC"] = resu[0].TargetTOWMAC;
      result["DeviationTOWMAC"] = resu[0].DeviationTOWMAC;
      result["AdultLDM"] = resu[0].AdultLDM;
      result["InfantLDM"] = resu[0].InfantLDM;
      result["TotalLDM"] = resu[0].TotalLDM;
      if (
        result["CargoOnSeatStr"] != null &&
        String(result["CargoOnSeatStr"]).trim().length != 0
      ) {
        result["IsCargoOnSeatStr"] = true;
      } else {
        result["IsCargoOnSeatStr"] = false;
      }
      console.log(resu[0].ActCabStr, "ActCabStr ActCabStr");
      var ActCabStr = resu[0].ActCabStr.split("$");
      console.log("ActCabStrArray ", ActCabStr);
      var i = 0;
      ActCabStr.forEach((x) => {
        i++;
        var array = x.split("/");
        if (array.length < 3) {
          return;
        }
        console.log(array, "array");
        result["C" + i + "Adult"] = parseInt(array[0]);
        result["C" + i + "Child"] = parseInt(array[1]);
        result["C" + i + "Infant"] = parseInt(array[2]);
      });
      for (var j = 1; j <= 8; j++) {
        if (

          result["C" + j + "Adult"] === undefined ||
          result["C" + j + "Adult"] === null
        ) {
          result["C" + j + "Adult"] = 0;
          result["C" + j + "Child"] = 0;
          result["C" + j + "Infant"] = 0;
        }
      }
      return fetchFleetinfoByRegnNo(result["Acft_Regn"]);
    })
    .then((res) => {
      console.log(res)
      result["MaxCabin"] = res.MaxCabin;
      result["MaxCompartment"] = res.MaxCompartment;
      result["CONFIG"] = res.CONFIG;
      result["MZFW"] = res.MZFW;
      result["MTOW"] = res.MTOW;
      result["MLW"] = res.MLW;
      result["Acft_Type"] = res.AC_TYPE;
      result["STDCREW"] = res.STDCREW;
      result["IsFreighter"] = res.IsFreighter;
      return fetchThrustArchive(
        result["Flight_no"],
        result["Flight_Date"],
        result["Source"],
        result["Destination"]
      );
    })
    .then((res) => {
console.log(res)
      console.log("Happy..");
      result["Thrust1"] = res.Thrust1 ? res.Thrust1 : 0;
      result["T1Flap1"] = res.T1Flap1 ? res.T1Flap1 : "";
      result["T1Stab1"] = res.T1Stab1 ? res.T1Stab1 : 0;
      result["T1Flap2"] = res.T1Flap2 ? res.T1Flap2 : "";
      result["T1Stab2"] = res.T1Stab2 ? res.T1Stab2 : 0;
      result["Thrust2"] = res.Thrust2 ? res.Thrust2 : 0;
      result["T2Flap1"] = res.T2Flap1 ? res.T2Flap1 : "";
      result["T2Stab1"] = res.T2Stab1 ? res.T2Stab1 : 0;
      result["T2Flap2"] = res.T2Flap2 ? res.T2Flap2 : "";
      result["T2Stab2"] = res.T2Stab2 ? res.T2Stab2 : 0;
      result["Thrust3"] = res.Thrust3 ? res.Thrust3 : 0;
      result["T3Flap1"] = res.T3Flap1 ? res.T3Flap1 : "";
      result["T3Stab1"] = res.T3Stab1 ? res.T3Stab1 : 0;
      result["T3Flap2"] = res.T3Flap2 ? res.T3Flap2 : "";
      result["T3Stab2"] = res.T3Stab2 ? res.T3Stab2 : 0;
      result["Thrust4"] = res.Thrust4 ? res.Thrust4 : 0;
      result["T4Flap1"] = res.T4Flap1 ? res.T4Flap1 : "";
      result["T4Stab1"] = res.T4Stab1 ? res.T4Stab1 : 0;
      result["T4Flap2"] = res.T4Flap2 ? res.T4Flap2 : "";
      result["T4Stab2"] = res.T4Stab2 ? res.T4Stab2 : 0;
      result["FlapValues"] = res.FlapValues ? res.FlapValues : "";
      result["ThrustValues"] = res.ThrustValues ? res.ThrustValues : "";
      result["StabValues"] = res.StabValues ? res.StabValues : "";
      return fetchFlightEditionNo(
        result["Flight_no"],
        result["Flight_Date"],
        result["Source"],
        result["Destination"],
        result["EDNO"]
      );
    })
    .then((resu) => {
      console.log(resu)
      result["OLW"] = resu.OLW;
      result["OTOW"] = resu.OTOW;
      result["AppType"] = resu.AppType ? resu.AppType : "";
      console.log(result);
      defer.resolve(result);
    })
    
    .catch((er) => {
      console.log("Error...Thurst",er);

      defer.reject(er);
    });
  return defer.promise;
}
// export function fetchFimsScheduleByFlightNoDate(
//   flight_no,
//   flight_date,
//   source,
//   destination
// ) {
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.open(Enviornment.get("DB_NAME"),1);

//     request.onsuccess = (event) => {
//       const db = event.target.result;

//       const transaction = db.transaction("fims_schedule", "readonly");

//       const objectStore = transaction.objectStore("fims_schedule");

//       const index = objectStore.index("Flight_Date");

//       const query = index.get([flight_no,source,flight_date,destination]);

//       query.onsuccess = (event) => {
//         const result = event.target.result;

//         if (result) {
//           resolve(result);
//         } else {
//           reject(new Error("Failed to find the FimsSchedule."));
//         }
//       };

//       // Handling errors on the query
//       query.onerror = (event) => {
//         // Logging the error for debugging purposes
//         console.error("Error fetching FimsSchedule:", event.target.error);

//         // Rejecting the promise with an error message
//         reject(new Error("Failed to find the FimsSchedule."));
//       };
//     };

//     // Handling errors on database open
//     request.onerror = (event) => {
//       // Logging the error for debugging purposes
//       console.error("Error opening database:", event.target.error);

//       // Rejecting the promise with an error message
//       reject(new Error("Failed to open the database."));
//     };
//   });
// }

export function fetchFimsScheduleByFlightNoDate(
  flight_no,
  flight_date,
  source,
  destination
) {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(Enviornment.get("DB_NAME"),1);

    openRequest.onsuccess = function (event) {
      const db = event.target.result;

      const transaction = db.transaction('fims_schedule', 'readonly');
      const objectStore = transaction.objectStore('fims_schedule');

      const indexFlightNo = objectStore.index('Flight_no');
      const indexSource = objectStore.index('Source');
      const indexFlightDate = objectStore.index('Flight_Date');
      const indexDestination = objectStore.index('Destination');

      const keyRange = IDBKeyRange.only(flight_no);
      const cursorRequest = indexFlightNo.openCursor(keyRange);

      cursorRequest.onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
          const data = cursor.value;

          // Check other conditions
          if (
            data.Source === source &&
            data.Flight_Date === flight_date &&
            data.Destination === destination
          ) {
            resolve(data);
            return;
          }

          cursor.continue();
        } else {
          // No matching data found
          reject("Failed to find the FleetInfo.");
        }
      };

      transaction.onerror = function (event) {
        console.error('Error in transaction:', event.target.error);
        reject("Failed to find the FleetInfo.");
      };
    };

    openRequest.onerror = function (event) {
      console.error('Error opening database:', event.target.error);
      reject("Failed to open the database.");
    };
  });
}

export function fetchFimsScheduleByFlightNo(flight_no, source) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(Enviornment.get("DB_NAME"),1);

    request.onsuccess = (event) => {
      const db = event.target.result;

      const transaction = db.transaction(["fims_schedule"], "readonly");

      const objectStore = transaction.objectStore("fims_schedule");

      const index = objectStore.index("flightIndex");

      const query = index.get([flight_no, source]);

      query.onsuccess = (event) => {
        const result = event.target.result;

        if (result) {
          resolve(result);
        } else {
          reject(new Error("Failed to find the FimsSchedule."));
        }
      };

      // Handling errors on the query
      query.onerror = (event) => {
        console.error("Error fetching FimsSchedule:", event.target.error);

        reject(new Error("Failed to find the FimsSchedule."));
      };
    };

    // Handling errors on database open
    request.onerror = (event) => {
      // Logging the error for debugging purposes
      console.error("Error opening database:", event.target.error);

      // Rejecting the promise with an error message
      reject(new Error("Failed to open the database."));
    };
  });
}
export function fetchNsLnTDetail(Flight_no, flight_date, source, destination) {
  console.log(Flight_no, flight_date, source, destination)
  var defer = q.defer();

  // Open the existing IndexedDB database
  var request = indexedDB.open(Enviornment.get("DB_NAME"),1);

  request.onsuccess = function (event) {
    var db = event.target.result;

    // Start a transaction
    var transaction = db.transaction(["nslntdetail"], "readonly");
    var objectStore = transaction.objectStore("nslntdetail");

    
    var singleKeyRange = objectStore.getAll()

   

    
    singleKeyRange.onsuccess = function (event) {
      const allRecords = event.target.result;
console.log(allRecords)
    // Filter the records based on required fields
    const filteredRecords = allRecords.filter(record =>
      record.Flight_no === Flight_no &&
      record.Flight_Date === flight_date &&
      record.source === source &&
      record.Destination === destination 
    
    );

    if (filteredRecords.length > 0) {
      console.log(filteredRecords)
      // Resolve with the filtered records
      defer.resolve(filteredRecords);
    } else {
      defer.reject("No matching records found.");
    }
    };

    singleKeyRange.onerror = function (event) {
      console.error("Error reading data from IndexedDB", event.target.error);
      defer.reject("Failed to find the Ns_LnTDetail.");
    };
  };

  // singleKeyRange.onerror = function (event) {
  //   console.error("Error opening IndexedDB", event.target.error);
  //   defer.reject("Failed to open IndexedDB.");
  // };

  return defer.promise;
}

export function fetchFleetinfoByRegnNo(AC_REGN) {
  console.log(AC_REGN)
  return new Promise((resolve, reject) => {
    // Open IndexedDB
    const openRequest = indexedDB.open(Enviornment.get("DB_NAME"),1);

    openRequest.onsuccess = function (event) {
      const db = event.target.result;

      // Start a readonly transaction on the 'FleetInfo' object store
      const transaction = db.transaction('fleetinfo','readonly');
      const objectStore = transaction.objectStore('fleetinfo');

      
      const index = objectStore.index('AC_REGN');
      const request = index.get(AC_REGN);
console.log(request)
      // Handle the request result
      request.onsuccess = function (event) {
        const data = event.target.result
        console.log(data);
        if (data) {
          console.log(data)
          resolve(data);
        } else {
          reject("Failed to find the FleetInfo.");
        }
      };

      // Handle errors
      transaction.onerror = function (event) {
        console.error('Error in transaction sdfjkl;', event.target.error);
        reject("Failed to find the FleetInfo.");
      };
    };

    openRequest.onerror = function (event) {
      console.error('Error opening database:', event.target.error);
      reject("Failed to open the database.");
    };
  });
}

 
  

export function fetchNSCheckinDetail(
  Flight_no,
  flight_date,
  source,
  destination
) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(Enviornment.get("DB_NAME"),1);

    request.onsuccess = (event) => {
      const db = event.target.result;

      const transaction = db.transaction(["nscheckindetail"], "readonly");

      const objectStore = transaction.objectStore("nscheckindetail");

      const index = objectStore.index("flightIndex");

      const query = index.get([Flight_no, flight_date, source, destination]);

      query.onsuccess = (event) => {
        const result = event.target.result;

        if (result) {
          resolve(result);
        } else {
          reject(new Error("Failed to find the NS_CheckinDetail."));
        }
      };

      query.onerror = (event) => {
        console.error("Error fetching NS_CheckinDetail:", event.target.error);

        reject(new Error("Failed to find the NS_CheckinDetail."));
      };
    };

    request.onerror = (event) => {
      console.error("Error opening database:", event.target.error);

      reject(new Error("Failed to open the database."));
    };
  });
}

export function fetchThrustArchive(
  Flight_no,
  flight_date,
  source,
  destination
) {
  console.log( Flight_no,
    flight_date,
    source,
    destination)
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(Enviornment.get("DB_NAME"),1);
console.log(openRequest)
    openRequest.onerror = function (event) {
      console.error("Error opening IndexedDB:", event.target.error);
      reject("Failed to open IndexedDB.");
    };

    openRequest.onupgradeneeded = function (event) {
      const db = event.target.result;

      // Create an object store if it doesn't exist
      if (!db.objectStoreNames.contains("thrustarchive")) {
        db.createObjectStore("thrustarchive", { keyPath: "Id" });
      }
    };

    openRequest.onsuccess = function (event) {
      const db = event.target.result;

      const transaction = db.transaction("thrustarchive","readonly");
      const objectStore = transaction.objectStore("thrustarchive");
      const index = objectStore.index("Flight_no","Flight_Date","source","Destination");

      const getRequest = index.get(Flight_no,flight_date
        ,source,destination)

    

      getRequest.onsuccess = function (event) {
        const cursor = event.target.result;

        if (cursor) {
          console.log(cursor)
          resolve(cursor);
        } else {
        
          resolve({ res: null });
        }
      };

      getRequest.onerror = function (event) {
        console.error(
          "Error fetching data from IndexedDB:",
          event.target.error
        );
        reject("Failed to find the ThrustArchive.");
      };
    };
  });
}

export function fetchFlightEditionNo(
  Flight_no,
  flight_date,
  source,
  destination,
  EdNo
) {
 
  var defer = q.defer();

  var request = indexedDB.open(Enviornment.get('DB_NAME'), 1);

  request.onsuccess = function (event) {
    var db = event.target.result;

    // Start a read-only transaction
    var transaction = db.transaction('flighteditionno','readonly');
    var objectStore = transaction.objectStore('flighteditionno');
    
   const cursorRequest=objectStore.getAll()

   cursorRequest.onsuccess = function(event) {
    const allRecords = event.target.result;

    // Filter the records based on required fields
    console.log('needed data',Flight_no,
    flight_date,
    source,
    destination,
    EdNo)
    console.log('item flight',allRecords)
    const filteredRecords = allRecords.filter((record) =>
   
      {
        console.log(record.Flight_no,record.Flight_Date,record.Destination,record.EdNo)
         return record.Flight_no === Flight_no &&
      record.Flight_Date === flight_date &&
      record.source === source &&
      record.Destination === destination &&
      record.EdNo === EdNo
     }
     
    );
    console.log(filteredRecords)

    if (filteredRecords.length > 0) {
      // Resolve with the filtered records
      defer.resolve(filteredRecords);
    } else {
      defer.reject("No matching records found.");
    }
  };


  cursorRequest.onerror = function(event) {
    console.error("Error reading all data from IndexedDB", event);
    reject("Failed to retrieve data from IndexedDB.");
  };
};

  request.onerror = function (event) {
    console.log(event.target.error);
    defer.reject("Failed to open the database.");
  };

  return defer.promise;
}



// export function fetchOfflineTrimSheetforFlight(flight_no){
//     var auth                =   JSON.parse(window.localStorage.getItem("auth_user"))
//     var source              =   auth.airport_code;
//     var defer               =   q.defer();
//     var result              =   {};
//     fetchFimsScheduleByFlightNo(flight_no,source).then((res)=>{
//         result['Destination']       =   res.Destination;
//         result['Flight_no']         =   res.Flight_no;
//         result['Flight_Date']       =   res.Flight_Date;
//         result['Source']            =   res.Source;
//         result['Acft_Regn']         =   res.Regn_no;
//         return fetchNsLnTDetail(result['Flight_no'],result['Source'],result['Destination'])
//     }).then((resu)=>{
//         result['EDNO']              =   resu.EDNO;
//         result['ActcrewStr']        =   resu.ActcrewStr;
//         result['cmpt1']             =   parseInt(resu.cmpt1);
//         result['cmpt2']             =   parseInt(resu.cmpt2);
//         result['cmpt3']             =   parseInt(resu.cmpt3);
//         result['cmpt4']             =   parseInt(resu.cmpt4);
//         result['TrimGenTimeUTC']    =   resu.TrimGenTimeUTC;
//         result['ZFW']               =   resu.ZFW;
//         result['FOB']               =   resu.FOB;
//         result['TOW']               =   resu.TOW;
//         result['TRIP_FUEL']         =   resu.TRIP_FUEL;
//         result['underLoadLMC']      =   resu.underLoadLMC;
//         result['ZFWindex']          =   resu.ZFWindex;
//         result['TOWindex']          =   resu.TOWindex;
//         result['LWindex']           =   resu.LWindex;
//         result['ZFWMAC']            =   resu.ZFWMAC;
//         result['TOWMAC']            =   resu.TOWMAC;
//         result['LWMAC']             =   resu.LWMAC;
//         result['specialStr']        =   resu.specialStr;
//         result['LTLoginId']         =   resu.LTLoginId;
//         result['Load_Officer']      =   resu.Load_Officer;
//         result['CAPTAIN']           =   resu.CAPTAIN;
//         result['OEW']               =   resu.OEW;
//         result['OEW_Index']         =   resu.OEW_Index;
//         result['AdjustStr']         =   resu.AdjustStr;
//         return fetchFleetinfoByRegnNo(result['Acft_Regn'])
//     }).then((res)=>{
//         result['MaxCabin']          =   res.MaxCabin;
//         result['MaxCompartment']    =   res.MaxCompartment;
//         result['CONFIG']            =   res.CONFIG;
//         result['MZFW']              =   res.MZFW;
//         result['MTOW']              =   res.MTOW;
//         result['MLW']               =   res.MLW;
//         result['Acft_Type']         =   res.AC_TYPE;
//         result['STDCREW']           =   res.STDCREW;

//         return fetchNSCheckinDetail(result['Flight_no'],result['Source'],result['Destination'])
//     }).then((re)=>{
//         result['C1Adult']           =   re.C1Adult === null || re.C1Adult === undefined?0:parseInt(re.C1Adult);
//         result['C2Adult']           =   re.C2Adult === null || re.C2Adult === undefined?0:parseInt(re.C2Adult);
//         result['C3Adult']           =   re.C3Adult === null || re.C3Adult === undefined?0:parseInt(re.C3Adult);
//         result['C4Adult']           =   re.C4Adult === null || re.C4Adult === undefined?0:parseInt(re.C4Adult);
//         result['C5Adult']           =   re.C5Adult === null || re.C5Adult === undefined?0:parseInt(re.C5Adult);
//         result['C6Adult']           =   re.C6Adult === null || re.C6Adult === undefined?0:parseInt(re.C6Adult);
//         result['C7Adult']           =   re.C7Adult === null || re.C7Adult === undefined?0:parseInt(re.C7Adult);
//         result['C8Adult']           =   re.C8Adult === null || re.C8Adult === undefined?0:parseInt(re.C8Adult);
//         result['C1Child']           =   re.C1Child === null || re.C1Child === undefined?0:parseInt(re.C1Child);
//         result['C2Child']           =   re.C2Child === null || re.C2Child === undefined?0:parseInt(re.C2Child);
//         result['C3Child']           =   re.C3Child === null || re.C3Child === undefined?0:parseInt(re.C3Child);
//         result['C4Child']           =   re.C4Child === null || re.C4Child === undefined?0:parseInt(re.C4Child);
//         result['C5Child']           =   re.C5Child === null || re.C5Child === undefined?0:parseInt(re.C5Child);
//         result['C6Child']           =   re.C6Child === null || re.C6Child === undefined?0:parseInt(re.C6Child);
//         result['C7Child']           =   re.C7Child === null || re.C7Child === undefined?0:parseInt(re.C7Child);
//         result['C8Child']           =   re.C8Child === null || re.C8Child === undefined?0:parseInt(re.C8Child);
//         result['C1Infant']          =   re.C1Infant === null || re.C1Infant === undefined?0:parseInt(re.C1Infant);
//         result['C2infant']          =   re.C2Infant === null || re.C2Infant === undefined?0:parseInt(re.C2Infant);
//         result['C3Infant']          =   re.C3Infant === null || re.C3Infant === undefined?0:parseInt(re.C3Infant);
//         result['C4Infant']          =   re.C4Infant === null || re.C4Infant === undefined?0:parseInt(re.C4Infant);
//         result['C5Infant']          =   re.C5Infant === null || re.C5Infant === undefined?0:parseInt(re.C5Infant);
//         result['C6Infant']          =   re.C6Infant === null || re.C6Infant === undefined?0:parseInt(re.C6Infant);
//         result['C7Infant']          =   re.C7Infant === null || re.C7Infant === undefined?0:parseInt(re.C7Infant);
//         result['C8Infant']          =   re.C8Infant === null || re.C8Infant === undefined?0:parseInt(re.C8Infant);
//         return fetchThrustArchive(result['Flight_no'],result['Source'],result['Destination'])
//     }).then((res)=>{
//         console.log('Happy..')
//         result['Thrust1']           =   res.Thrust1;
//         result['T1Flap1']           =   res.T1Flap1;
//         result['T1Stab1']           =   res.T1Stab1;
//         result['T1Flap2']           =   res.T1Flap2;
//         result['T1Stab2']           =   res.T1Stab2;
//         result['Thrust2']           =   res.Thrust2;
//         result['T2Flap1']           =   res.T2Flap1;
//         result['T2Stab1']           =   res.T2Stab1;
//         result['T2Flap2']           =   res.T2Flap2;
//         result['T2Stab2']           =   res.T2Stab2;
//         result['Thrust3']           =   res.Thrust3;
//         result['T3Flap1']           =   res.T3Flap1;
//         result['T3Stab1']           =   res.T3Stab1;
//         result['T3Flap2']           =   res.T3Flap2;
//         result['T3Stab2']           =   res.T3Stab2;
//         result['Thrust4']           =   res.Thrust4;
//         result['T4Flap1']           =   res.T4Flap1;
//         result['T4Stab1']           =   res.T4Stab1;
//         result['T4Flap2']           =   res.T4Flap2;
//         result['T4Stab2']           =   res.T4Stab2;
//         return fetchFlightEditionNo(result['Flight_no'],result['Source'],result['Destination'],result['EDNO'])
//     }).then((resu)=>{
//         result['OLW']               =   resu.OLW;
//         result['OTOW']              =   resu.OTOW;
//         console.log(result)
//         defer.resolve(result)
//     }).catch((er)=>{
//         console.log('Error...Thurst')
//         defer.reject(er)
//     })
//     return defer.promise;
// }
