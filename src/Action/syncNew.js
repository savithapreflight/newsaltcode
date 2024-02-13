import * as ramp from "./rampaction";
import * as SQL from "./SQL";
import moment from "moment";
import * as q from "q";
import {
  storeTransaction,
  updateRampData,
  addTransaction,
  storeOfflineTrimSheet,
  fetchOfflineTrimSheet,
} from "./rampaction";
import { fetch } from "./fleetinfoaction";
import {
  fetch as fetchCgref,
  fetchCGRefTableZFW,
  fetchCGRefTableTOW,
  fetchCGLIMTISZFW,
  fetchCGLIMTISTOW,
} from "./cgrefaction";
import { fetch as fetchFuel } from "./fuelaction";
import { fetch as fetchFuelV2 } from "./fuelV2action";
import { fetch as fetchLTAdjust } from "./LTAdjustaction";
import { fetch as fetchNsCheckIn } from "./nscheckindetail";
import { fetch as fetchNsLnt } from "./nslntdetail";
import { fetch as fetchThrust } from "./thrustarchive";
import { fetch as fetchEdition } from "./flighteditionno";
import {
  fetch as fetchStabTrimThrust,
  fetchData,
} from "./stabtrimthrustaction";
import { update as updateLntDetail } from "./nslntdetail";
import { add as addFlightEdition } from "./flighteditionno";
import { update as updateThrust } from "./thrustarchive";
import { fetch as fetchSaltArchive } from "./saltArchive";
import { update as updateSaltArchive } from "./saltArchive";
import { fetch as fetchNSFlightSchedule } from "./nsflightschedule";
import * as Enviornment from "./environment";
import { add } from "./LMCaction";
import { showError, isNetworkUp } from "./networkaction";

// var current_date    =  moment().format("YYYY-MM-DD HH:mm:ss")
// var current_date    =  "2020-07-01"

function syncTransaction() {
  var defer = q.defer();

  var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

  request.onsuccess = function (event) {
    var db = event.target.result;

    var transaction = db.transaction("ramp_transactions", "readwrite");
    var objectStore = transaction.objectStore("ramp_transactions");

    var index = objectStore.index("isSync");

    var range = IDBKeyRange.only("false");

    index.openCursor(range).onsuccess = function (event) {
      var cursor = event.target.result;

      if (cursor) {
        var sync_data = cursor.value;
        storeTransaction(sync_data).then(() => {
          cursor.delete();
          cursor.continue();
        });
      } else {
        db.close(); // Close the database connection when done
        defer.resolve();
      }
    };
  };

  request.onerror = function (event) {
    console.error("Error opening IndexedDB:", event.target.error);
    defer.reject(event.target.error);
  };

  return defer.promise;
}
function saltArchive() {
  var defer = q.defer();
  var user = window.localStorage.getItem("auth_user");

  if (user == null || user == undefined) {
    return;
  }

  user = JSON.parse(user);
  var current_date = moment().format("YYYY-MM-DD HH:mm:ss");

  fetchSaltArchive({
    airport_code: user.airport_code,
    date: current_date,
  })
    .then((res) => {
      // Open or create IndexedDB
      var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

      request.onsuccess = function (event) {
        var db = event.target.result;

        // Define object store
        var transaction = db.transaction("saltarchive", "readwrite");
        var objectStore = transaction.objectStore("saltarchive");

        // Clear existing data in the object store
        objectStore.clear();

        function promiseData(data) {
          return new Promise((resolve, reject) => {
            // Insert data into object store
            var request = objectStore.add(data);

            request.onsuccess = function (event) {
              resolve(event.result);
            };

            request.onerror = function (event) {
              console.error(
                "Error inserting data into IndexedDB:",
                event.target.error
              );
              reject(event.target.error);
            };
          });
        }

        var promises = [];
        res.data.data.forEach((item) => {
          promises.push(promiseData(item));
        });

        // Wait for all promises to resolve
        Promise.all(promises)
          .then(() => {
            defer.resolve();
          })
          .catch((error) => {
            defer.reject(error);
            console.log(error);
          });
      };

      request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
        defer.reject(event.target.error);
      };
    })
    .catch((error) => {
      defer.reject(error);
      console.log(error);
    });

  return defer.promise;
}

function nsFlightSchedule() {
  var defer = q.defer();
  var user = window.localStorage.getItem("auth_user");

  if (user == null || user == undefined) {
    return;
  }

  user = JSON.parse(user);
  var current_date = moment().format("YYYY-MM-DD HH:mm:ss");

  fetchNSFlightSchedule({
    airport_code: user.airport_code,
    date: current_date,
  })
    .then((res) => {
      // Open or create IndexedDB
      var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

      request.onsuccess = function (event) {
        var db = event.target.result;

        // Define object store
        var transaction = db.transaction("nsflightschedule", "readwrite");
        var objectStore = transaction.objectStore("nsflightschedule");

        // Clear existing data in the object store
        objectStore.clear();

        function promiseData(data) {
          return new Promise((resolve, reject) => {
            // Insert data into object store
            var request = objectStore.add(data);

            request.onsuccess = function (event) {
              resolve(event.result);
            };

            request.onerror = function (event) {
              console.error(
                "Error inserting data into IndexedDB:",
                event.target.error
              );
              reject(event.target.error);
            };
          });
        }

        var promises = [];
        res.data.data.forEach((item) => {
          promises.push(promiseData(item));
        });

        // Wait for all promises to resolve
        Promise.all(promises)
          .then(() => {
            defer.resolve();
          })
          .catch((error) => {
            defer.reject(error);
            console.log(error);
          });
      };

      request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
        defer.reject(event.target.error);
      };
    })
    .catch((error) => {
      defer.reject(error);
      console.log(error);
    });

  return defer.promise;
}

function syncFlightEditionNo() {
  var defer = q.defer();

  var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

  request.onsuccess = function (event) {
    var db = event.target.result;

    var transaction = db.transaction("flighteditionno", "readwrite");
    var objectStore = transaction.objectStore("flighteditionno");

    var index = objectStore.index("isSync");

    var range = IDBKeyRange.only("false");

    index.openCursor(range).onsuccess = function (event) {
      var cursor = event.target.result;

      if (cursor) {
        var sync_data = cursor.value;

        addFlightEdition(sync_data).then(() => {
          cursor.delete();
          cursor.continue();
        });
      } else {
        db.close(); // Close the database connection when done
        defer.resolve();
      }
    };
  };

  request.onerror = function (event) {
    console.error("Error opening IndexedDB:", event.target.error);
    defer.reject(event.target.error);
  };

  return defer.promise;
}

function syncNSLntDetail() {
  var defer = q.defer();

  var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

  request.onsuccess = function (event) {
    var db = event.target.result;

    var transaction = db.transaction("nslntdetail", "readwrite");
    var objectStore = transaction.objectStore("nslntdetail");

    var index = objectStore.index("isSync");

    var range = IDBKeyRange.only("false");

    index.openCursor(range).onsuccess = function (event) {
      var cursor = event.target.result;

      if (cursor) {
        var sync_data = cursor.value;

        updateLntDetail(sync_data).then(() => {
          cursor.delete();
          cursor.continue();
        });
      } else {
        db.close(); // Close the database connection when done
        defer.resolve();
      }
    };
  };

  request.onerror = function (event) {
    console.error("Error opening IndexedDB:", event.target.error);
    defer.reject(event.target.error);
  };

  return defer.promise;
}

function syncThrustArchive() {
  var defer = q.defer();

  var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

  request.onsuccess = function (event) {
    var db = event.target.result;

    var transaction = db.transaction("thrustarchive", "readwrite");
    var objectStore = transaction.objectStore("thrustarchive");

    var index = objectStore.index("isSync");

    var range = IDBKeyRange.only("false");

    index.openCursor(range).onsuccess = function (event) {
      var cursor = event.target.result;

      if (cursor) {
        var sync_data = cursor.value;

        updateThrust(sync_data).then(() => {
          cursor.delete();
          cursor.continue();
        });
      } else {
        db.close(); // Close the database connection when done
        defer.resolve();
      }
    };
  };

  request.onerror = function (event) {
    console.error("Error opening IndexedDB:", event.target.error);
    defer.reject(event.target.error);
  };

  return defer.promise;
}

// Enviornment.get("DB_NAME")
// function syncOfflineTrimSheet() {
//   var defer = q.defer();

//   // Open or create IndexedDB
//   var request = indexedDB.open(Enviornment.get("DB_NAME"),1);

//   request.onsuccess = function (event) {
//     var db = event.target.result;
//     console.log(db)
//     // Define object store
//     var transaction = db.transaction('trimsheetlmcoffline', 'readwrite');
//     var objectStore = transaction.objectStore('trimsheetlmcoffline');

//     // Select data from the object store where isSync is false
//     var request = objectStore.index('isSync').openCursor(IDBKeyRange.only(false));

//     var sync_data = [];

//     request.onsuccess = function (event) {
//       var cursor = event.target.result;

//       if (cursor) {
//         sync_data.push(cursor.value);
//         cursor.continue();
//       } else {
//         // If there is unsynced data, proceed with syncing
//         if (sync_data.length > 0) {
//           sync_data.forEach((x) => {
//             x.isOfflineGenerated = x.isOfflineGenerated === "true";
//             x.isSync = true;
//           });

//           // Store the updated data back to the object store
//           var updateRequest = objectStore.put(sync_data);

//           updateRequest.onsuccess = function (event) {
//             defer.resolve();
//           };

//           updateRequest.onerror = function (event) {
//             console.error('Error updating data in IndexedDB:', event.target.error);
//             defer.reject(event.target.error);
//           };
//         } else {
//           // If there is no unsynced data, resolve the promise
//           defer.resolve();
//         }
//       }
//     };
//   };

//   request.onerror = function (event) {
//     console.error('Error opening IndexedDB:', event.target.error);
//     defer.reject(event.target.error);
//   };

//   return defer.promise;
// }
function syncOfflineTrimSheet() {
  var defer = q.defer();

  var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

  request.onsuccess = function (event) {
    var db = event.target.result;

    var transaction = db.transaction("trimsheetlmcoffline", "readwrite");
    var objectStore = transaction.objectStore("trimsheetlmcoffline");

    var index = objectStore.index("isSync");

    var range = IDBKeyRange.only("false");

    index.openCursor(range).onsuccess = function (event) {
      var cursor = event.target.result;

      if (cursor) {
        var sync_data = cursor.value;

        sync_data.isOfflineGenerated =
          sync_data.isOfflineGenerated === "true" ? true : false;
        sync_data.isSync = true;

        storeOfflineTrimSheet([sync_data]).then(() => {
          cursor.delete();
          cursor.continue();
        });
      } else {
        db.close(); // Close the database connection when done
        defer.resolve();
      }
    };
  };

  request.onerror = function (event) {
    console.error("Error opening IndexedDB:", event.target.error);
    defer.reject(event.target.error);
  };

  return defer.promise;
}

function syncTrimSheetLMC() {
  var defer = q.defer();

  var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

  request.onsuccess = function (event) {
    var db = event.target.result;

    var transaction = db.transaction("trimsheetlmc", "readwrite");
    var objectStore = transaction.objectStore("trimsheetlmc");

    var index = objectStore.index("isSync");

    var range = IDBKeyRange.only("false");

    index.openCursor(range).onsuccess = function (event) {
      var cursor = event.target.result;

      if (cursor) {
        var sync_data = cursor.value;

        sync_data.Flight_Date = moment(sync_data.Flight_Date).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        sync_data.STD = moment(sync_data.STD).format("YYYY-MM-DD HH:mm:ss");
        sync_data.TrimSheetTime = moment(sync_data.TrimSheetTime).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        sync_data.created_at =
          sync_data.created_at == null
            ? null
            : moment(sync_data.created_at).format("YYYY-MM-DD HH:mm:ss");
        sync_data.Thrust24K = parseInt(sync_data.Thrust24K);
        sync_data.Thrust26K = parseInt(sync_data.Thrust26K);
        sync_data.TransitPax = parseInt(sync_data.TransitPax);
        sync_data.Flap1 = parseInt(sync_data.Flap1);
        sync_data.Flap2 = parseInt(sync_data.Flap2);
        sync_data.Flap3 = parseInt(sync_data.Flap3);
        sync_data.Flap4 = parseInt(sync_data.Flap4);
        sync_data.Stab1 = parseInt(sync_data.Stab1);
        sync_data.Stab2 = parseInt(sync_data.Stab2);
        sync_data.Stab3 = parseInt(sync_data.Stab3);
        sync_data.Stab4 = parseInt(sync_data.Stab4);
        sync_data.isOfflineGenerated =
          sync_data.isOfflineGenerated === "true" ? true : false;
        sync_data.isSync = true;

        add([sync_data]).then(() => {
          cursor.delete();
          cursor.continue();
        });
      } else {
        db.close(); // Close the database connection when done
        defer.resolve();
      }
    };
  };

  request.onerror = function (event) {
    console.error("Error opening IndexedDB:", event.target.error);
    defer.reject(event.target.error);
  };

  return defer.promise;
}

function transactionData(item) {
  var fields = [
    "cargo_close",
    "cargo_open",
    "catering_end",
    "catering_start",
    "crew",
    "door_close",
    "door_open",
    "fuel_end",
    "fuel_start",
    "in_time",
    "lnt",
    "out",
    "security_end",
    "security_start",
    "service_end",
    "service_start",
    "tech_clear",
  ];

  var promise = [];

  fields.forEach((i) => {
    if (item[i] == null) {
      return;
    }
    promise.push(
      addTransaction({
        fims_id: item.fims_id,
        transaction_type: i,
        user_id: -1,
        time: moment(item[i]).format("YYYY-MM-DD HH:mm:ss"),
        createdAt: moment(item[i + "_updated"]).format("YYYY-MM-DD HH:mm:ss"),
        isSync: true,
        message: "Synced",
      })
    );
  });

  return Promise.all(promise);
}

function Fleetinfo() {
  var defer = q.defer();

  fetch()
    .then((res) => {
      console.log(res)
      // Open or create IndexedDB
      var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

      request.onsuccess = function (event) {
        var db = event.target.result;

        // Define object store
        var transaction = db.transaction(["fleetinfo"], "readwrite");
        var objectStore = transaction.objectStore("fleetinfo");

        // Clear existing data from the object store
        objectStore.clear();
       
        function promiseData(data) {
          return new Promise((resolve, reject) => {
            // Insert data into the object store
            var addRequest = objectStore.add({
              Id: data.Id,
              AC_REGN: data.AC_REGN,
              AC_TYPE: data.AC_TYPE,
              CONFIG: data.CONFIG,
              OEW: data.OEW,
              OEW_Index: data.OEW_Index,
              STDCREW: data.STDCREW,
              Pantry: data.Pantry,
              MTOW: data.MTOW,
              MLW: data.MLW,
              MZFW: data.MZFW,
              MAxFuel: data.MAxFuel,
              EMRG_EXIT: data.EMRG_EXIT,
              THRUST: data.THRUST,
              CMPT1: data.CMPT1,
              CMPT2: data.CMPT2,
              CMPT3: data.CMPT3,
              CMPT4: data.CMPT4,
              LastRow: data.LastRow,
              OALimit: data.OALimit,
              OBLimit: data.OBLimit,
              OCLimit: data.OCLimit,
              ODLimit: data.ODLimit,
              OELimit: data.OELimit,
              C_Constant: data.C_Constant,
              K_Constant: data.K_Constant,
              CG_Ref: data.CG_Ref,
              LeMac: data.LeMac,
              Mac: data.Mac,
              OFLimit: data.OFLimit,
              MaxCabin: data.MaxCabin,
              MaxCompartment: data.MaxCompartment,
              CabinLimits: data.CabinLimits,
              CompLimits: data.CompLimits,
              CabinIndex: data.CabinIndex,
              CompIndex: data.CompIndex,
              IsFreighter: data.IsFreighter ? 1 : 0,
              MinFOB: data.MinFOB,
  
          MinTripFuel: data.MinLW,
  
          MinLW: data.MinLW,
  
          MinTOW: data.MinTOW,
  
          MaxCockpitOccupant: data.MaxCockpitOccupant,
  
          MaxFwdGalley: data.MaxFwdGalley,
  
          MaxAftGalley: data.MaxAftGalley,
  
          MaxCabinBaggage:data.MaxCabinBaggage,
  
          MaxAftJump: data.MaxAftJump,
  
          MaxFwdJump: data.MaxFwdJump,
  
          MaxMidJump: data.MaxMidJump,
  
          MaxFirstObserver: data.MaxFirstObserver,
  
          MaxSecondObserver: data.MaxSecondObserver,
  
          MaxSupernumerary:data.MaxSupernumerary,
  
          MaxPortableWater:data.MaxPortableWater,
  
          MaxSpareWheels:data.MaxSpareWheels,
  
          MaxETOPEquipments:data.MaxETOPEquipments,
  
          StdFwdJump:data.StdFwdJump,
  
          StdMidJump:data.StdMidJump,
  
          StdAftJump:data.StdAftJump,
  
          StdCabinBaggage: data.StdCabinBaggage,
  
          StdAftGalley:data.StdAftGalley,
  
          StdFwdGalley: data.StdFwdGalley,
  
          StdPortableWater: data.StdPortableWater,
  
          StdSpareWheels: data.StdSpareWheels,
  
          StdETOPEquipments: data. StdETOPEquipments
  
            });

            addRequest.onsuccess = function (event) {
              resolve(event.target.result);
            };

            addRequest.onerror = function (event) {
              console.error(
                "Error adding data to IndexedDB:",
                event.target.error
              );
              reject(event.target.error);
            };
          });
        }

        var promises = res.data.data.map((item) => promiseData(item));

        // Wait for all promises to resolve
        Promise.all(promises)
          .then(() => {
            defer.resolve();
          })
          .catch((error) => {
            defer.reject(error);
            console.log(error);
          });
      };

      request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
        defer.reject(event.target.error);
      };
    })
    .catch((er) => {
      defer.reject(er);
      console.log(er);
    });

  return defer.promise;
}

function LTAdjustWeight() {
  var defer = q.defer();

  fetchLTAdjust()
    .then((res) => {
      // Open or create IndexedDB
      var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

      request.onsuccess = function (event) {
        var db = event.target.result;

        // Define object store
        var transaction = db.transaction("ltadjustweight", "readwrite");
        var objectStore = transaction.objectStore("ltadjustweight");

        // Clear existing data from the object store
        objectStore.clear();

        function promiseData(data) {
          return new Promise((resolve, reject) => {
            // Insert data into the object store
            var addRequest = objectStore.add({
              Id: data.Id,
              AcftType: data.AcftType,
              CockpitOccupantPerKG: data.CockpitOccupantPerKG,
              FwdGalleyPerKG: data.FwdGalleyPerKG,
              PassengerInCabin1PerKG: data.PassengerInCabin1PerKG,
              FwdCargoCpt1PerKG: data.FwdCargoCpt1PerKG,
              FwdCargoCpt2PerKG: data.FwdCargoCpt2PerKG,
              PassengerInCabin3PerKG: data.PassengerInCabin3PerKG,
              PassengerInCabin4PerKG: data.PassengerInCabin4PerKG,
              AftCargoCpt3PerKG: data.AftCargoCpt3PerKG,
              AftCargoCpt4PerKG: data.AftCargoCpt4PerKG,
              AftGalleyPerKG: data.AftGalleyPerKG,
              AftJumpPerKG: data.AftJumpPerKG,
              FwdJumpPerKG: data.FwdJumpPerKG,
              MidJumpPerKG: data.MidJumpPerKG,
            });

            addRequest.onsuccess = function (event) {
              resolve(event.target.result);
            };

            addRequest.onerror = function (event) {
              console.error(
                "Error adding data to IndexedDB:",
                event.target.error
              );
              reject(event.target.error);
            };
          });
        }

        var promises = res.data.data.map((item) => promiseData(item));

        // Wait for all promises to resolve
        Promise.all(promises)
          .then(() => {
            defer.resolve();
          })
          .catch((error) => {
            defer.reject(error);
            console.log(error);
          });
      };

      request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
        defer.reject(event.target.error);
      };
    })
    .catch((er) => {
      console.log(er);
    });

  return defer.promise;
}

function LTAdjustWeightV2() {
  var defer = q.defer();

  fetchLTAdjust()
    .then((res) => {
      // console.log('res res res',res)
      var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

      request.onsuccess = function (event) {
        var db = event.target.result;

        var transaction = db.transaction("ltadjustweightv2", "readwrite");
        var objectStore = transaction.objectStore("ltadjustweightv2");

        objectStore.clear();

        function promiseData(data) {
          return new Promise((resolve, reject) => {
            // console.log(data)
            var request = objectStore.add(data);

            request.onsuccess = function (event) {
              resolve(event.target.result);
            };

            request.onerror = function (event) {
              console.log(event.target.error);
              reject(event.target.error);
            };
          });
        }

        var promises = [];

        res.data.data.forEach((item) => {
          // console.log(item)
          promises.push(promiseData(item));
        });

        Promise.all(promises)
          .then(() => {
            defer.resolve();
          })
          .catch((error) => {
            defer.reject(error);
            console.log(error);
          });
      };

      request.onerror = function (event) {
        console.log(event.target.error);
        defer.reject(event.target.error);
      };
    })
    .catch((error) => {
      defer.reject(error);
      console.log(error);
    });

  return defer.promise;
}

// function cgrefTable() {
//   var defer = q.defer();

//   fetchCgref()
//     .then((res) => {
//       console.log(res)
//       var dataArry = [];
//       var aircraftArray = Object.keys(res.data.data);

//       aircraftArray.forEach((x) => {
//         var weightValues = res.data.data[x];
//         var weightAarry = Object.keys(res.data.data[x]);

//         weightAarry.forEach((y) => {
//           var weightObj = weightValues[y];
//           var obj = {
//             AcftType: x,
//             Weight: y,
//             Aft_Tow_Limit: weightObj.Aft_Tow_Limit,
//             Aft_Zfw_Limit: weightObj.Aft_Zfw_Limit,
//             Fwd_Tow_Limit: weightObj.Fwd_Tow_Limit,
//             Fwd_Zfw_Limit: weightObj.Fwd_Zfw_Limit,
//             Fwd_Zfw_Limit_Gt65317: weightObj.Fwd_Zfw_Limit_Gt65317,
//           };
//           dataArry.push(obj);
//         });
//       });

//       // Open or create IndexedDB
//       var request = indexedDB.open(Enviornment.get("DB_NAME"),1);

//       request.onsuccess = function (event) {
//         var db = event.target.result;

//         // Define object store
//         var transaction = db.transaction('cgreftable','readwrite');
//         var objectStore = transaction.objectStore('cgreftable');

//         // Clear existing data from the object store
//         objectStore.clear();

//         function promiseData(data) {
//           console.log(data)
//           return new Promise((resolve, reject) => {
//             // Insert data into the object store
//             var addRequest = objectStore.add({

//               AcftType:data.AcftType,
//               Weight: data.Weight,
//               Aft_Tow_Limit: data.Aft_Tow_Limit,
//               Aft_Zfw_Limit: data.Aft_Zfw_Limit,
//               Fwd_Tow_Limit: data.Fwd_Tow_Limit,
//               Fwd_Zfw_Limit: data.Fwd_Zfw_Limit,
//               Fwd_Zfw_Limit_Gt65317: data.Fwd_Zfw_Limit_Gt65317
//             });

//             addRequest.onsuccess = function (event) {
//               resolve(event.target.result);
//             };

//             addRequest.onerror = function (event) {
//               console.error('Error adding data to IndexedDB:', event.target.error);
//               reject(event.target.error);
//             };
//           });
//         }

//         var promises = dataArry.map((item) => promiseData(item));

//         Promise.all(promises)
//           .then(() => {
//             defer.resolve();
//           })
//           .catch((error) => {
//             defer.reject(error);
//             console.log(error);
//           });
//       };

//       request.onerror = function (event) {
//         console.error('Error opening IndexedDB:', event.target.error);
//         defer.reject(event.target.error);
//       };
//     })
//     .catch((er) => {
//       defer.reject(er);
//       console.log(er);
//     });

//   return defer.promise;
// }

async function cgrefTable() {
  try {
    const res = await fetchCgref();
    const dataArr = [];
    const aircraftArray = Object.keys(res.data.data);

    aircraftArray.forEach((x) => {
      const weightValues = res.data.data[x];
      const weightArray = Object.keys(res.data.data[x]);
      weightArray.forEach((y) => {
        const weightObj = weightValues[y];
        const obj = {
          AcftType: x,
          Weight: y,
          Aft_Tow_Limit: weightObj.Aft_Tow_Limit,
          Aft_Zfw_Limit: weightObj.Aft_Zfw_Limit,
          Fwd_Tow_Limit: weightObj.Fwd_Tow_Limit,
          Fwd_Zfw_Limit: weightObj.Fwd_Zfw_Limit,
          Fwd_Zfw_Limit_Gt65317: weightObj.Fwd_Zfw_Limit_Gt65317,
        };
        dataArr.push(obj);
        // console.log(dataArr)
      });
    });

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

    const transaction = db.transaction("cgreftable", "readwrite");
    const store = transaction.objectStore("cgreftable");

    await new Promise((resolve, reject) => {
      const clearRequest = store.clear();

      clearRequest.onsuccess = () => {
        resolve();
      };

      clearRequest.onerror = (event) => {
        console.error("Error clearing object store:", event.target.error);
        reject(event.target.error);
      };
    });
    const insertPromises = dataArr.map(
      (item) =>
        new Promise((resolve, reject) => {
          const addRequest = store.add(item);

          addRequest.onsuccess = () => {
            resolve();
          };

          addRequest.onerror = (event) => {
            reject(event.target.error);
          };
        })
    );

    await Promise.all(insertPromises);

    return Promise.resolve();
  } catch (error) {
    console.log(error);
    console.error("Error in cgrefTable:", error);
    return Promise.reject(error);
  }
}

function fuelTable() {
  var defer = q.defer();
  fetchFuel()
    .then((res) => {
      defer.resolve(res.data.data);
    })
    .catch((er) => {
      console.log(er);
      defer.reject(er);
    });
  return defer.promise;
}
function fuelV2Table() {
  var defer = q.defer();
  fetchFuelV2()
    .then((res) => {
      defer.resolve(res.data.data);
    })
    .catch((er) => {
      console.log(er);
      defer.reject(er);
    });
  return defer.promise;
}

function nsCheckInDetail() {
  var defer = q.defer();
  var user = window.localStorage.getItem("auth_user");

  if (user == null || user == undefined) {
    return;
  }

  user = JSON.parse(user);
  var current_date = moment().format("YYYY-MM-DD HH:mm:ss");

  fetchNsCheckIn({
    airport_code: user.airport_code,
    date: current_date,
  })
    .then((res) => {
      console.log(res);
      // Open or create IndexedDB
      var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

      request.onsuccess = function (event) {
        var db = event.target.result;

        // Define object store
        var transaction = db.transaction("nscheckindetail", "readwrite");
        var objectStore = transaction.objectStore("nscheckindetail");

        // Clear existing data from the object store
        objectStore.clear();

        function promiseData(data) {
          return new Promise((resolve, reject) => {
            var addRequest = objectStore.add({
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

            addRequest.onsuccess = function (event) {
              resolve(event.target.result);
            };

            addRequest.onerror = function (event) {
              console.error(
                "Error adding data to IndexedDB:",
                event.target.error
              );
              reject(event.target.error);
            };
          });
        }
        console.log(res.data.data.length);
        var promises = res.data.data.map((item) => promiseData(item));

        // Wait for all promises to resolve
        Promise.all(promises)
          .then(() => {
            defer.resolve();
          })
          .catch((error) => {
            defer.reject(error);
            console.log(error);
          });
      };

      request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
        defer.reject(event.target.error);
      };
    })
    .catch((er) => {
      defer.reject(er);
      console.log(er);
    });

  return defer.promise;
}

function nsLntDetail() {
  var defer = q.defer();
  var user = window.localStorage.getItem("auth_user");

  if (user == null || user == undefined) {
    return;
  }

  user = JSON.parse(user);
  var current_date = moment().format("YYYY-MM-DD HH:mm:ss");

  fetchNsLnt({
    airport_code: user.airport_code,
    date: current_date,
  })
    .then((res) => {
      console.log(res);
      var openRequest = indexedDB.open(Enviornment.get("DB_NAME"), 1);

      openRequest.onsuccess = function (event) {
        var db = event.target.result;

        var transaction = db.transaction("nslntdetail", "readwrite");
        var objectStore = transaction.objectStore("nslntdetail");

        var clearRequest = objectStore.clear();

        clearRequest.onsuccess = function () {
          console.log("Object store cleared successfully.");

          res.data.data.forEach(function (item) {
            const data = {
              Id: item.Id,
              Flight_Date: item.Flight_Date,
              Flight_no: item.Flight_no,
              Destination: item.Destination,
              source: item.source,
              Acft_Regn: item.Acft_Regn,
              EDNO: item.EDNO,
              ActcrewStr: item.ActcrewStr,
              cmpt1: item.cmpt1,
              cmpt2: item.cmpt2,
              cmpt3: item.cmpt3,
              cmpt4: item.cmpt4,
              TrimGenTimeUTC: item.TrimGenTimeUTC,
              ZFW: item.ZFW,
              FOB: item.FOB,
              TOW: item.TOW,
              TRIP_FUEL: item.TRIP_FUEL,
              underLoadLMC: item.underLoadLMC,
              ZFWindex: item.ZFWindex,
              TOWindex: item.TOWindex,
              LWindex: item.LWindex,
              ZFWMAC: item.ZFWMAC,
              TOWMAC: item.TOWMAC,
              LWMAC: item.LWMAC,
              specialStr: item.specialStr,
              LTLoginId: item.LTLoginId,
              Load_Officer: item.Load_Officer,
              CAPTAIN: item.CAPTAIN,
              OEW: item.OEW,
              OEW_Index: item.OEW_Index,
              AdjustStr: item.AdjustStr,
              ActCabStr: item.ActCabStr,
              ActCompStr: item.ActCompStr,
              OLW: item.OLW,
              OTOW: item.OTOW,
              RTOW: item.RTOW,
              AdjustStrv2: item.AdjustStrv2,
              LW: item.LW,
              Trim_Officer: item.Trim_Officer,
              PalletsStr: item.PalletsStr,
              ZFWMACFWD: item.ZFWMACFWD,
              ZFWMACAFT: item.ZFWMACAFT,
              TOWMACFWD: item.TOWMACFWD,
              TOWMACAFT: item.TOWMACAFT,
              LWMACFWD: item.LWMACFWD,
              LWMACAFT: item.LWMACAFT,
              isSync: true,
              CargoOnSeatStr: item.CargoOnSeatStr,
              BagLDM: item.BagLDM,
              CargoLDM: item.CargoLDM,
              ActLoadDistStr: item.ActLoadDistStr,
              ActLoadDistStrV2: item.ActLoadDistStrV2,
              CaptEmpId: item.CaptEmpId,
              TargetTOWMAC: item.TargetTOWMAC,
              DeviationTOWMAC: item.DeviationTOWMAC,
              AdultLDM: item.AdultLDM,
              InfantLDM: item.InfantLDM,
              TotalLDM: item.TotalLDM,
            };

            objectStore.add(data);
          });
          console.log("hdb");
          defer.resolve();
        };

        clearRequest.onerror = function (event) {
          console.error("Error clearing object store:", event.target.error);
          defer.reject(event.target.error);
        };
      };
    })
    .catch((er) => {
      console.log("happy coding");
      defer.reject(er);
      console.log(er);
    });

  return defer.promise;
}

function thrustArchive() {
  var defer = q.defer();
  var user = window.localStorage.getItem("auth_user");

  if (user == null || user == undefined) {
    return;
  }

  user = JSON.parse(user);
  var current_date = moment().format("YYYY-MM-DD HH:mm:ss");

  fetchThrust({
    airport_code: user.airport_code,
    date: current_date,
  })
    .then((res) => {
      var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

      request.onsuccess = function (event) {
        var db = event.target.result;

        var transaction = db.transaction("thrustarchive", "readwrite");
        var objectStore = transaction.objectStore("thrustarchive");

        objectStore.clear();

        function promiseData(data) {
          return new Promise((resolve, reject) => {
            var addRequest = objectStore.add({
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

            addRequest.onsuccess = function (event) {
              resolve(event.target.result);
            };

            addRequest.onerror = function (event) {
              console.error(
                "Error adding data to IndexedDB:",
                event.target.error
              );
              reject(event.target.error);
            };
          });
        }

        var promises = res.data.data.map((item) => promiseData(item));

        // Wait for all promises to resolve
        Promise.all(promises)
          .then(() => {
            defer.resolve();
          })
          .catch((error) => {
            defer.reject(error);
            console.log(error);
          });
      };

      request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
        defer.reject(event.target.error);
      };
    })
    .catch((er) => {
      defer.reject(er);
      console.log(er);
    });

  return defer.promise;
}

function flighteditionNo() {
  var defer = q.defer();
  var user = window.localStorage.getItem("auth_user");

  if (user == null || user == undefined) {
    return;
  }

  user = JSON.parse(user);
  var current_date = moment().format("YYYY-MM-DD HH:mm:ss");

  fetchEdition({
    airport_code: user.airport_code,
    date: current_date,
  })
    .then((res) => {
      // Open or create IndexedDB
      var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

      request.onsuccess = function (event) {
        var db = event.target.result;

        // Define object store
        var transaction = db.transaction("flighteditionno", "readwrite");
        var objectStore = transaction.objectStore("flighteditionno");

        // Clear existing data from the object store
        objectStore.clear();

        function promiseData(data) {
          return new Promise((resolve, reject) => {
            // Insert data into the object store
            console.log(data);
            var addRequest = objectStore.add({
              Id: data.Id,
              Flight_Date: data.Flight_Date,
              Flight_no: data.Flight_no,
              Destination: data.Destination,
              source: data.source,
              EdNo: data.EdNo,
              Regn_no: data.Regn_no,
              ActcrewStr: data.ActcrewStr,
              cmpt1: data.cmpt1,
              cmpt2: data.cmpt2,
              cmpt3: data.cmpt3,
              cmpt4: data.cmpt4,
              ZFW: data.ZFW,
              FOB: data.FOB,
              TOW: data.TOW,
              TripFuel: data.TripFuel,
              underLoadLMC: data.underLoadLMC,
              ZFWindex: data.ZFWindex,
              TOWindex: data.TOWindex,
              LWindex: data.LWindex,
              ZFWMAC: data.ZFWMAC,
              TOWMAC: data.TOWMAC,
              LWMAC: data.LWMAC,
              LoadOfficer: data.LoadOfficer,
              SI: data.SI,
              Captain: data.Captain,
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
              TrimOfficer: data.TrimOfficer,
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
              Userid: data.Userid,
              isSync: true,
            });

            addRequest.onsuccess = function (event) {
              resolve(event.target.result);
            };

            addRequest.onerror = function (event) {
              console.error(
                "Error adding data to IndexedDB:",
                event.target.error
              );
              reject(event.target.error);
            };
          });
        }

        var promises = res.data.data.map((item) => promiseData(item));

        // Wait for all promises to resolve
        Promise.all(promises)
          .then(() => {
            defer.resolve();
          })
          .catch((error) => {
            defer.reject(error);
            console.log(error);
          });
      };

      request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
        defer.reject(event.target.error);
      };
    })
    .catch((er) => {
      defer.reject(er);
      console.log(er);
    });

  return defer.promise;
}

function stabTrimThrust() {
  var defer = q.defer();

  fetchStabTrimThrust()
    .then((res) => {
      // Open or create IndexedDB
      var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

      request.onsuccess = function (event) {
        var db = event.target.result;

        // Define object store
        var transaction = db.transaction(["stabtrimthrust"], "readwrite");
        var objectStore = transaction.objectStore("stabtrimthrust");

        // Clear existing data from the object store
        objectStore.clear();

        function promiseData(data) {
          return new Promise((resolve, reject) => {
            // Insert data into the object store
            var addRequest = objectStore.add({
              Id: data.Id,
              Regn_no: data.Regn_no,
              AcftType: data.AcftType,
              TableName: data.TableName,
              LOPA: data.LOPA,
              Thrust: data.Thrust,
              Flap: data.Flap,
            });

            addRequest.onsuccess = function (event) {
              resolve(event.target.result);
            };

            addRequest.onerror = function (event) {
              console.error(
                "Error adding data to IndexedDB:",
                event.target.error
              );
              reject(event.target.error);
            };
          });
        }

        var promises = res.data.data.map((item) => promiseData(item));

        // Wait for all promises to resolve
        Promise.all(promises)
          .then(() => {
            defer.resolve();
          })
          .catch((error) => {
            defer.reject(error);
            console.log(error);
          });
      };

      request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
        defer.reject(event.target.error);
      };
    })
    .catch((er) => {
      defer.reject(er);
      console.log(er);
    });

  return defer.promise;
}

function stabTrimData() {
  var defer = q.defer();

  fetchData()
    .then((res) => {
      var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

      request.onsuccess = function (event) {
        var db = event.target.result;

        var transaction = db.transaction("stabtrimdata", "readwrite");
        var objectStore = transaction.objectStore("stabtrimdata");

        objectStore.clear();

        function promiseData(data) {
          return new Promise((resolve, reject) => {
            var addRequest = objectStore.add({
              Id: data.Id,
              STABVARIANT: data.STABVARIANT,
              THRUST: data.THRUST,
              FLAP: data.FLAP,
              TOW: data.TOW,
              TOWMAC: data.TOWMAC,
              STAB: data.STAB,
            });

            addRequest.onsuccess = function (event) {
              resolve(event.target.result);
            };

            addRequest.onerror = function (event) {
              console.error(
                "Error adding data to IndexedDB:",
                event.target.error
              );
              reject(event.target.error);
            };
          });
        }

        var promises = res.data.data.map((item) => promiseData(item));

        Promise.all(promises)
          .then(() => {
            defer.resolve();
          })
          .catch((error) => {
            defer.reject(error);
            console.log(error);
          });
      };

      request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
        defer.reject(event.target.error);
      };
    })
    .catch((er) => {
      defer.reject(er);
      console.log(er);
    });

  return defer.promise;
}

function offlineTrimSheet() {
  var defer = q.defer();
  var current_date = moment().format("YYYY-MM-DD");

  fetchOfflineTrimSheet({
    date: current_date,
  })
    .then((res) => {
      var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

      request.onsuccess = function (event) {
        var db = event.target.result;
        var transaction = db.transaction(["trimsheetlmcoffline"], "readwrite");
        var objectStore = transaction.objectStore("trimsheetlmcoffline");

        objectStore.clear();

        function promiseData(data) {
          return new Promise((resolve, reject) => {
            var addRequest = objectStore.add({
              id: data.id,
              flight_no: data.flight_no,
              flight_date: data.flight_date,
              trim_gen_time: data.trim_gen_time,
              edition_no: data.edition_no,
              source: data.source,
              destination: data.destination,
              std: data.std,
              sta: data.sta,
              regno: data.regno,
              ac_type: data.ac_type,
              config: data.config,
              crew: data.crew,
              COMPWT: data.COMPWT,
              CABBGWT: data.CABBGWT,
              PAXWT: data.PAXWT,
              total_load: data.total_load,
              dow: data.dow,
              zfw: data.zfw,
              mzfw: data.mzfw,
              take_of_fuel: data.take_of_fuel,
              tow: data.tow,
              trip_fuel: data.trip_fuel,
              law: data.law,
              olw: data.olw,
              otow: data.otow,
              mlw: data.mlw,
              underload: data.underload,
              doi: data.doi,
              lizfw: data.lizfw,
              litow: data.litow,
              lilw: data.lilw,
              zfmac: data.zfmac,
              towmac: data.towmac,
              lwmac: data.lwmac,
              pax: data.pax,
              cargo: data.cargo,
              adult: data.adult,
              child: data.child,
              infant: data.infant,
              ttl: data.ttl,
              sob: data.sob,
              si: data.si,
              loginId: data.loginId,
              trim_officer: data.trim_officer,
              load_officer: data.load_officer,
              captain: data.captain,
              thrust: data.thrust,
              isSync: data.isSync,
              isOfflineGenerated: data.isOfflineGenerated,
              created_at: data.created_at,
              AdjustStr: data.AdjustStr,
              ActCabStr: data.ActCabStr,
              ActCompStr: data.ActCompStr,
              ZFWMACFWD: data.ZFWMACFWD,
              ZFWMACAFT: data.ZFWMACAFT,
              TOWMACFWD: data.TOWMACFWD,
              TOWMACAFT: data.TOWMACAFT,
              LWMACFWD: data.LWMACFWD,
              LWMACAFT: data.LWMACAFT,
            });

            addRequest.onsuccess = function (event) {
              resolve(event.target.result);
            };

            addRequest.onerror = function (event) {
              console.error(
                "Error adding data to IndexedDB:",
                event.target.error
              );
              reject(event.target.error);
            };
          });
        }

        var promises = res.data.map((item) => promiseData(item));

        Promise.all(promises)
          .then(() => {
            defer.resolve();
          })
          .catch((error) => {
            defer.reject(error);
            console.log(error);
          });
      };

      request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
        defer.reject(event.target.error);
      };
    })
    .catch((er) => {
      defer.reject(er);
      console.log(er);
    });

  return defer.promise;
}

function cGRefTableZFW() {
  var defer = q.defer();

  fetchCGRefTableZFW()
    .then((res) => {
      var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

      request.onsuccess = function (event) {
        var db = event.target.result;
        var transaction = db.transaction(["cgreftablezfw"], "readwrite");
        var objectStore = transaction.objectStore("cgreftablezfw");

        objectStore.clear();

        function promiseData(data) {
          return new Promise((resolve, reject) => {
            var addRequest = objectStore.add({
              Id: data.Id,
              Regn_no: data.Regn_no,
              TableName: data.TableName,
              MinLW: data.MinLW,
              MaxLW: data.MaxLW,
            });

            addRequest.onsuccess = function (event) {
              resolve(event.target.result);
            };

            addRequest.onerror = function (event) {
              console.error(
                "Error adding data to IndexedDB:",
                event.target.error
              );
              reject(event.target.error);
            };
          });
        }

        var promises = res.data.data.map((item) => promiseData(item));

        Promise.all(promises)
          .then(() => {
            defer.resolve();
          })
          .catch((error) => {
            defer.reject(error);
            console.log(error);
          });
      };

      request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
        defer.reject(event.target.error);
      };
    })
    .catch((er) => {
      defer.reject(er);
      console.log(er);
    });

  return defer.promise;
}

function cGRefTableTOW() {
  var defer = q.defer();

  fetchCGRefTableTOW()
    .then((res) => {
      var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

      request.onsuccess = function (event) {
        var db = event.target.result;
        var transaction = db.transaction(["cgreftabletow"], "readwrite");
        var objectStore = transaction.objectStore("cgreftabletow");

        objectStore.clear();

        function promiseData(data) {
          return new Promise((resolve, reject) => {
            var addRequest = objectStore.add({
              Id: data.Id,
              Regn_no: data.Regn_no,
              TableName: data.TableName,
              MinLW: data.MinLW,
              MaxLW: data.MaxLW,
            });

            addRequest.onsuccess = function (event) {
              resolve(event.target.result);
            };

            addRequest.onerror = function (event) {
              console.error(
                "Error adding data to IndexedDB:",
                event.target.error
              );
              reject(event.target.error);
            };
          });
        }

        var promises = res.data.data.map((item) => promiseData(item));

        Promise.all(promises)
          .then(() => {
            defer.resolve();
          })
          .catch((error) => {
            defer.reject(error);
            console.log(error);
          });
      };

      request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
        defer.reject(event.target.error);
      };
    })
    .catch((er) => {
      defer.reject(er);
      console.log(er);
    });

  return defer.promise;
}

function cgLIMITSZFW() {
  var defer = q.defer();

  fetchCGLIMTISZFW()
    .then((res) => {
      var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

      request.onsuccess = function (event) {
        var db = event.target.result;
        var transaction = db.transaction(["cglimitszfw"], "readwrite");
        var objectStore = transaction.objectStore("cglimitszfw");

        objectStore.clear();

        function promiseData(data) {
          return new Promise((resolve, reject) => {
            var addRequest = objectStore.add({
              Id: data.Id,
              CGVARIANT: data.CGVARIANT,
              Weight: data.Weight,
              Fwd_Zfw_Limit: data.Fwd_Zfw_Limit,
              Aft_Zfw_Limit: data.Aft_Zfw_Limit,
            });

            addRequest.onsuccess = function (event) {
              resolve(event.target.result);
            };

            addRequest.onerror = function (event) {
              console.error(
                "Error adding data to IndexedDB:",
                event.target.error
              );
              reject(event.target.error);
            };
          });
        }

        var promises = res.data.data.map((item) => promiseData(item));

        Promise.all(promises)
          .then(() => {
            defer.resolve();
          })
          .catch((error) => {
            defer.reject(error);
            console.log(error);
          });
      };

      request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
        defer.reject(event.target.error);
      };
    })
    .catch((er) => {
      defer.reject(er);
      console.log(er);
    });

  return defer.promise;
}

function cgLIMITSTOW() {
  var defer = q.defer();

  fetchCGLIMTISTOW()
    .then((res) => {
      var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

      request.onsuccess = function (event) {
        var db = event.target.result;
        var transaction = db.transaction("cglimitstow", "readwrite");
        var objectStore = transaction.objectStore("cglimitstow");

        objectStore.clear();

        function promiseData(data) {
          return new Promise((resolve, reject) => {
            var addRequest = objectStore.add({
              Id: data.Id,
              CGVARIANT: data.CGVARIANT,
              Weight: data.Weight,
              Fwd_Tow_limit: data.Fwd_Tow_limit,
              Aft_Tow_Limit: data.Aft_Tow_Limit,
            });

            addRequest.onsuccess = function (event) {
              resolve(event.target.result);
            };

            addRequest.onerror = function (event) {
              console.error(
                "Error adding data to IndexedDB:",
                event.target.error
              );
              reject(event.target.error);
            };
          });
        }

        var promises = res.data.data.map((item) => promiseData(item));

        Promise.all(promises)
          .then(() => {
            defer.resolve();
          })
          .catch((error) => {
            defer.reject(error);
            console.log(error);
          });
      };

      request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
        defer.reject(event.target.error);
      };
    })
    .catch((er) => {
      defer.reject(er);
      console.log(er);
    });

  return defer.promise;
}

function checkRecords() {
  var defer = q.defer();

  // var request = indexedDB.open(Enviornment.get("DB_NAME"),1);
  var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

  request.onsuccess = function (event) {
    var db = event.target.result;
    console.log(db);
    var transaction = db.transaction("cgreftable", "readonly");
    var objectStore = transaction.objectStore("cgreftable");

    var countRequest = objectStore.count();

    countRequest.onsuccess = function (event) {
      var count = event.target.result;
      console.log("Count results", count);
      defer.resolve();
    };

    countRequest.onerror = function (event) {
      console.error("Error counting records in IndexedDB:", event.target.error);
      defer.reject(event.target.error);
    };
  };

  request.onerror = function (event) {
    console.error("Error opening IndexedDB:", event.target.error);
    defer.reject(event.target.error);
  };

  return defer.promise;
}

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

    request.onsuccess = function (event) {
      var db = event.target.result;
      resolve(db);
    };
    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}

function syncSaltArchive() {
  return new Promise(async (resolve, reject) => {
    try {
      var db = await openIndexedDB(); // Open the IndexedDB database

      var transaction = db.transaction(["saltarchive"], "readwrite");
      var objectStore = transaction.objectStore("saltarchive");

      var cursorRequest = objectStore.openCursor();

      cursorRequest.onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
          var saltArchiveData = cursor.value;

          // Perform the updateSaltArchive operation
          updateSaltArchive(saltArchiveData);

          // Delete the record from the object store
          var deleteRequest = objectStore.delete(cursor.primaryKey);

          deleteRequest.onsuccess = function () {
            console.log("Delete saltArchive transaction success");
            cursor.continue();
          };

          deleteRequest.onerror = function (error) {
            console.error("Delete saltArchive transaction error", error);
            reject(error);
          };
        } else {
          // No more records
          resolve();
        }
      };

      cursorRequest.onerror = function (error) {
        console.error("Cursor request error", error);
        reject(error);
      };
    } catch (error) {
      console.error("Error opening IndexedDB", error);
      reject(error);
    }
  });
}

export function deleteTables() {
  var defer = q.defer();
  var db = indexedDB.open(Enviornment.get("DB_NAME"));
  db.transaction(function (tx) {
    Promise.all([
      syncNewThread(),
      tx.executeSql("DELETE FROM fims_schedule", []),
      tx.executeSql("DELETE FROM TrimSheetLMC", []),
      tx.executeSql("DELETE FROM ramp_data", []),
      tx.executeSql("DELETE FROM FleetInfo", []),
      tx.executeSql("DELETE FROM LTAdjustWeight", []),
      tx.executeSql("DELETE FROM LTAdjustWeightV2", []),
      tx.executeSql("DELETE FROM CGRefTable", []),
      tx.executeSql("DELETE FROM Ns_CheckInDetail", []),
      tx.executeSql("DELETE FROM Ns_LnTDetail", []),
      tx.executeSql("DELETE FROM ThrustArchive", []),
      tx.executeSql("DELETE FROM LTAdjustWeightV2", []),
      tx.executeSql("DELETE FROM TrimSheetLMCOffline", []),
      tx.executeSql("DELETE FROM StabTrimThrust", []),
      tx.executeSql("DELETE FROM StabTrimData", []),
      tx.executeSql("DELETE FROM CGRefTableZFW", []),
      tx.executeSql("DELETE FROM CGLIMITSZFW", []),
      tx.executeSql("DELETE FROM CGRefTableTOW", []),
      tx.executeSql("DELETE FROM CGLIMITSTOW", []),
      tx.executeSql("DELETE FROM FlightEditionNo", []),
    ])
      .then(() => {
        defer.resolve();
      })
      .catch((err) => {
        defer.reject();
      });
  });
  return defer.promise;
}
export function syncNewThread() {
  console.log("syncingg start");
  var datetimeStart = new Date();
  console.log("Start time : ", datetimeStart.toISOString());
  var user = window.localStorage.getItem("auth_user");
  if (user == null || user == undefined) {
    return;
  }

  user = JSON.parse(user);

  // Open or create the IndexedDB database
  const openRequest = indexedDB.open(Enviornment.get("DB_NAME"), 1);

  return function (dispatch) {
    dispatch({ type: "RAMP_SYNC_STARTED" });

    openRequest.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create object stores
      if (!db.objectStoreNames.contains("fims_schedule")) {
        db.createObjectStore("fims_schedule", { keyPath: "id" });
      }

      // Add other object stores as needed
    };

    openRequest.onerror = (event) => {
      console.error("Error opening IndexedDB:", event.target.error);
    };

    openRequest.onsuccess = (event) => {
      const db = event.target.result;

      const transaction = db.transaction(
        ["fims_schedule", "trimsheetlmc"],
        "readwrite"
      );

      // Access the object stores
      const fimsScheduleStore = transaction.objectStore("fims_schedule");
      const trimSheetLMCStore = transaction.objectStore("trimsheetlmc");

      checkRecords()
        .then(() => {
          return syncTransaction();
        })
        .then(() => {
          return syncOfflineTrimSheet();

          // syncTransaction().then(()=>{
          //     return syncOfflineTrimSheet()
        })
        .then(() => {
          return syncTrimSheetLMC();
        })
        .then(() => {
          return syncNSLntDetail();
        })
        .then(() => {
          return syncFlightEditionNo();
        })
        .then(() => {
          return syncThrustArchive();
        })
        .then(() => {
          var current_date = moment().format("YYYY-MM-DD HH:mm:ss");
          return ramp.fetch({
            airport_code: user.airport_code,
            date: current_date,
          });
        })
        .then((ramp_record) => {
          
          console.log(ramp_record);

          const transaction = db.transaction("fims_schedule", "readwrite");
          const fimsScheduleStore = transaction.objectStore("fims_schedule");

          const clearOperation = fimsScheduleStore.clear();

          clearOperation.onsuccess = function () {
            console.log("Object store cleared successfully.");
          };

          clearOperation.onerror = function (event) {
            console.error("Error clearing object store:", event.target.error);
          };

          const transaction1 = db.transaction("trimsheetlmc", "readwrite");
          const fimsScheduleStore1 = transaction1.objectStore("trimsheetlmc");

          const clearOperation1 = fimsScheduleStore1.clear();

          clearOperation1.onsuccess = function () {
            console.log("Object store cleared successfully.");
          };

          clearOperation.onerror = function (event) {
            console.error("Error clearing object store:", event.target.error);
          };

          const promises = ramp_record.data.data.data.map((item) => {
            console.log(item);
            return insertDataToIndexedDB(fimsScheduleStore, item);
          });
          const transactionPromise = ramp_record.data.data.res.map((item) => {
            console.log(item);
            return insertTransactionDataToIndexedDB(trimSheetLMCStore, item);
          });

          return Promise.all([transactionPromise, promises]).then(() => {
            var transactionPromise = [];
            ramp_record.data.data.res.forEach((item) => {
              console.log(item);
              transactionPromise.push(transactionData(item));
            });
            return Promise.all(transactionPromise);
          });
        })
        .then(() => {
          // dispatch({'type':'RAMP_SYNC_STARTED'});
          return Promise.all([
            cgrefTable(),
            Fleetinfo(),
            LTAdjustWeight(),
            LTAdjustWeightV2(),
            fuelTable(),
            fuelV2Table(),
            nsCheckInDetail(),
            nsLntDetail(),
            thrustArchive(),
            flighteditionNo(),
            stabTrimThrust(),
            stabTrimData(),
            cGRefTableTOW(),
            cGRefTableZFW(),
            cgLIMITSTOW(),
            cgLIMITSZFW(),
            offlineTrimSheet(),
            ,
            saltArchive(),
            nsFlightSchedule(),
          ]);
        })
        .then(
          () => {
            window.localStorage.setItem(
              "last_sync",
              moment().format("YYYY-MM-DD HH:mm:ss")
            );
          },
          (err) => {
            window.localStorage.setItem(
              "last_sync",
              moment().format("YYYY-MM-DD HH:mm:ss")
            );
            console.log(err);
          }
        )

        .then(() => {
          return Promise.all([
            nsCheckInDetail(),
            nsLntDetail(),
            thrustArchive(),
            flighteditionNo(),
            offlineTrimSheet(),
          ]);
        })
        .then(() => {
          console.log("ramp sync complete");
          window.localStorage.setItem(
            "last_sync",
            moment().format("YYYY-MM-DD HH:mm:ss")
          );
          var datetimeEnd = new Date();
          console.log("Sync end Time : ", datetimeEnd.toISOString());
          dispatch({ type: "RAMP_SYNC_COMPLETED" });
        })
        .then(() => {
          return checkRecords();
        })
        .catch((er) => {
          console.log(er);
          dispatch({ type: "RAMP_SYNC_COMPLETED" });
          if (isNetworkUp()) {
            showError(
              "Currently SALT server is down. Please try after sometime or contact IT admin."
            );
          } else {
            showError("Please check your network connection and try again!!");
          }
        })
        .finally(() => {
          transaction.commit(); // Commit the transaction
        });
    };
  };
}

function clearObjectStore(objectStore) {
  return new Promise((resolve, reject) => {
    const request = objectStore.clear();
    request.onsuccess = resolve;
    request.onerror = reject;
  });
}

function insertDataToIndexedDB(objectStore, item) {
  return new Promise((resolve, reject) => {
    const request = objectStore.add({
      id: item.id,
      Regn_no: item.Acft_Regn,
      Acft_Type: item.Acft_Type,
      Flight_no: item.Flight_no,
      Source: item.Source,
      Destination: item.Destination,
      Flight_Date: item.Flight_Date,
      STD: item.STD,
      STA: item.STA,
      ETD: item.ETD,
      ETA: item.ETA,
      BAYNO: item.BAYNO,
    });

    request.onsuccess = resolve;
    request.onerror = reject;
  });
}

function insertTransactionDataToIndexedDB(objectStore, item) {
  return new Promise((resolve, reject) => {
    var active =
      item.FimsTRIM[0]["active"] != undefined
        ? item.FimsTRIM[0]["active"]
        : false;
    var isSync =
      item.FimsTRIM[0]["isSync"] != undefined
        ? item.FimsTRIM[0]["isSync"]
        : false;
    var isOfflineGenerated =
      item.FimsTRIM[0]["isOfflineGenerated"] != undefined
        ? item.FimsTRIM[0]["isOfflineGenerated"]
        : false;
    var created_at =
      item.FimsTRIM[0]["created_at"] != undefined
        ? item.FimsTRIM[0]["created_at"]
        : null;
    var ms_id =
      item.FimsTRIM[0]["Id"] != undefined
        ? item.FimsTRIM[0]["Id"]
        : item.FimsTRIM[0]["ms_id"];
    const request = objectStore.add({
      Id: ms_id,
      FlightNo: item.FimsTRIM[0]["FlightNo"],
      Flight_Date: item.FimsTRIM[0]["Flight_Date"],
      Acft_Regn: item.FimsTRIM[0]["Acft_Type"],
      STD: item.FimsTRIM[0]["STD"],
      TrimSheetTime: item.FimsTRIM[0]["TrimSheetTime"],
      Source: item.FimsTRIM[0]["Source"],
      Destination: item.FimsTRIM[0]["Destination"],
      Regn_no: item.FimsTRIM[0]["Regn_no"],
      Crew: item.FimsTRIM[0]["Crew"],
      ZFW: item.FimsTRIM[0]["ZFW"],
      MZFW: item.FimsTRIM[0]["MZFW"],
      TOF: item.FimsTRIM[0]["TOF"],
      TOW: item.FimsTRIM[0]["TOW"],
      MTOW: item.FimsTRIM[0]["MTOW"],
      TripFuel: item.FimsTRIM[0]["TripFuel"],
      LAW: item.FimsTRIM[0]["LAW"],
      MLAW: item.FimsTRIM[0]["MLAW"],
      underLoad: item.FimsTRIM[0]["underLoad"],
      LIZFW: item.FimsTRIM[0]["LIZFW"],
      LITOW: item.FimsTRIM[0]["LITOW"],
      LILAW: item.FimsTRIM[0]["LILAW"],
      ZFWMAC: item.FimsTRIM[0]["ZFWMAC"],
      MAC: item.FimsTRIM[0]["MAC"],
      TOWMAC: item.FimsTRIM[0]["TOWMAC"],
      LAWMAC: item.FimsTRIM[0]["LAWMAC"],
      Thrust24K: item.FimsTRIM[0]["Thrust24K"],
      Flap1: item.FimsTRIM[0]["Flap1"],
      Stab1: item.FimsTRIM[0]["Stab1"],
      Flap2: item.FimsTRIM[0]["Flap2"],
      Stab2: item.FimsTRIM[0]["Stab2"],
      Thrust26K: item.FimsTRIM[0]["Thrust26K"],
      Flap3: item.FimsTRIM[0]["Flap3"],
      Stab3: item.FimsTRIM[0]["Stab3"],
      Flap4: item.FimsTRIM[0]["Flap4"],
      Stab4: item.FimsTRIM[0]["Stab4"],
      cmpt1: item.FimsTRIM[0]["cmpt1"],
      cmpt2: item.FimsTRIM[0]["cmpt2"],
      cmpt3: item.FimsTRIM[0]["cmpt3"],
      cmpt4: item.FimsTRIM[0]["cmpt4"],
      Adult: item.FimsTRIM[0]["Adult"],
      Child: item.FimsTRIM[0]["Child"],
      Infant: item.FimsTRIM[0]["Infant"],
      Tpax: item.FimsTRIM[0]["Tpax"],
      SOB: item.FimsTRIM[0]["SOB"],
      TransitPax: item.FimsTRIM[0]["TransitPax"],
      SI: item.FimsTRIM[0]["SI"],
      LoadOfficer: item.FimsTRIM[0]["LoadOfficer"],
      Captain: item.FimsTRIM[0]["Captain"],
      PreparedBy: item.FimsTRIM[0]["PreparedBy"],
      Z1a: item.FimsTRIM[0]["Z1a"],
      Z1c: item.FimsTRIM[0]["Z1c"],
      Z1i: item.FimsTRIM[0]["Z1i"],
      Z2a: item.FimsTRIM[0]["Z2a"],
      Z2c: item.FimsTRIM[0]["Z2c"],
      Z2i: item.FimsTRIM[0]["Z2i"],
      Z3a: item.FimsTRIM[0]["Z3a"],
      Z3c: item.FimsTRIM[0]["Z3c"],
      Z3i: item.FimsTRIM[0]["Z3i"],
      active: active,
      isSync: true,
      isOfflineGenerated: isOfflineGenerated,
      created_at: created_at,
    });
    console.log(request);

    request.onsuccess = resolve;
    request.onerror = reject;
  });
}

// import * as ramp from "./rampaction";
// import * as SQL from "./SQL";
// import moment from "moment";
// import * as q from "q";
// import {
//   storeTransaction,
//   updateRampData,
//   addTransaction,
//   storeOfflineTrimSheet,
//   fetchOfflineTrimSheet,
// } from "./rampaction";
// import { fetch } from "./fleetinfoaction";
// import {
//   fetch as fetchCgref,
//   fetchCGRefTableZFW,
//   fetchCGRefTableTOW,
//   fetchCGLIMTISZFW,
//   fetchCGLIMTISTOW,
// } from "./cgrefaction";
// import { fetch as fetchFuel } from "./fuelaction";
// import { fetch as fetchFuelV2 } from "./fuelV2action";
// import { fetch as fetchLTAdjust } from "./LTAdjustaction";
// import { fetch as fetchNsCheckIn } from "./nscheckindetail";
// import { fetch as fetchNsLnt } from "./nslntdetail";
// import { fetch as fetchThrust } from "./thrustarchive";
// import { fetch as fetchEdition } from "./flighteditionno";
// import {
//   fetch as fetchStabTrimThrust,
//   fetchData,
// } from "./stabtrimthrustaction";
// import { update as updateLntDetail } from "./nslntdetail";
// import { add as addFlightEdition } from "./flighteditionno";
// import { update as updateThrust } from "./thrustarchive";
// import { fetch as fetchSaltArchive } from "./saltArchive";
// import { update as updateSaltArchive } from "./saltArchive";
// import { fetch as fetchNSFlightSchedule } from "./nsflightschedule";
// import * as Enviornment from "./environment";
// import { add } from "./LMCaction";
// import { showError, isNetworkUp } from "./networkaction";

// // var current_date    =  moment().format("YYYY-MM-DD HH:mm:ss")
// // var current_date    =  "2020-07-01"

// function syncTransaction() {
//   var defer = q.defer();

//   var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//   db.transaction(function (tx) {
//     tx.executeSql(
//       "SELECT * FROM ramp_transactions WHERE isSync = 'false'",
//       [],
//       (tx, results) => {
//         console.log("sync transaction res", results);
//         var sync_data = [];
//         for (var i = 0; i < results.rows.length; i++) {
//           sync_data.push(results.rows.item(i));
//         }
//         var promise = [];
//         var ids = [];
//         sync_data.map((i) => {
//           ids.push(i.id);
//         });
//         sync_data.forEach(async (i) => {
//           promise.push(storeTransaction(i));
//         });
//         Promise.all(promise).then((res) => {
//           db.transaction(function (tx) {
//             tx.executeSql(
//               "delete FROM ramp_transactions WHERE id in [" +
//                 ids.join(",") +
//                 "]"
//             );
//           });
//           defer.resolve(res);
//         });
//       },
//       (er) => {
//         console.log(er);
//         defer.reject(er);
//       }
//     );
//   });
//   return defer.promise;
// }

// function saltArchive() {
//   var defer = q.defer();
//   var user = window.localStorage.getItem("auth_user");
//   if (user == null || user == undefined) {
//     return;
//   }
//   user = JSON.parse(user);
//   var current_date = moment().format("YYYY-MM-DD HH:mm:ss");
//   fetchSaltArchive({
//     airport_code: user.airport_code,
//     date: current_date,
//   })
//     .then((res) => {
//       var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//       db.transaction(function (tx) {
//         tx.executeSql("DELETE FROM SALTArchive", [], () => {
//           function promiseData(data) {
//             return new Promise((resolve, reject) => {
//               tx.executeSql(
//                 "insert into SALTArchive (  Id , FlightDate , FlightNo , DepArpt , ArrArpt , AcftRegn ,MTow , MZFW , OEW , OEW_Index , AcftPurpose , STDCREW , AdultCntBooked , ChildCntBooked , InfantCntBooked , AdultCabListCheckedIn , ChildCabListCheckedIn , InfantCabListCheckedIn , PaxseatStrCheckedIn , TransitStrCheckedIn , ThruChecked , TotCheckedInPax , OnwardAdultCheckedIn , OnwardChildCheckedIn ,  BagDetailsCheckedIn , FOB , TripFuel , OLW ,OTOW , RTOW ,AdjustStrv2 ,LoadDistStrV2 , ActLoadDistStrV2 ,SpecialStr ,PalletsStr ,PalletsStrAuto ,CargoOnSeatAuto ,CargoOnSeatStr ,EditionNum ,CrewStr ,CockpitCrew ,CabinCrew ,ZFW ,TOW ,LW ,LWCG ,LWCGFwdLimit ,TOWCG ,TOWCGFwdLimit ,TOWCGAftLimit , ZFWCG , ZFWCGFwdLimit , ZFWCGAftLimit , TargetTOWCG , ZFWindex ,TOWindex , LWindex , LimitFacLw , LimitFacTow , LimitFacZfw , ActCabStr , SectorLDM , AdultLDM , InfantLDM , TotalLDM , BagLDM , CargoLDM , TrafficTotalWeight ,FlapValues ,ThrustValues , StabValues ,UnderLoadLMC ,GeneratedTimeUTC ,CAPTAIN ,LoadOfficer ,TrimOfficer ,UserId ,ErrorMessage ,SuggestionMessage ,TrimRecallNo ,LIRRecallNo ,IPAddress ,CmptWeights ,CabinPax ,CockpitOccuPant ,CabinAcm ,AftJumpSeat ,OZFW , isSync ) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//                 [
//                   data.Id,
//                   data.Flight_Date,
//                   data.Flight_no,
//                   data.Destination,
//                   data.source,
//                   data.Acft_Regn,
//                   data.MTOW,
//                   data.MZFW,
//                   data.OEW,
//                   data.OEW_Index,
//                   data.AcftPurpose,
//                   data.STDCREW,
//                   data.Tadult,
//                   data.Tchild,
//                   data.Tinfant,
//                   data.AdultCabList,
//                   data.ChildCabList,
//                   data.InfantCabList,
//                   data.PaxseatStr,
//                   data.TransitStr,
//                   data.ThruChecked,
//                   data.TotCheckedIn,
//                   data.OnwardAdult,
//                   data.OnwardChild,
//                   data.BagDetails,
//                   data.FOB,
//                   data.TRIP_FUEL,
//                   data.OLW,
//                   data.OTOW,
//                   data.RTOW,
//                   data.AdjustStrv2,
//                   data.LoadDistStrV2,
//                   data.specialStr,
//                   data.PalletsStr,
//                   data.PalletsStrAuto,
//                   data.CargoOnSeatAuto,
//                   data.CargoOnSeatStr,
//                   data.EDNO,
//                   data.crewStr,
//                   data.CockpitCrew,
//                   data.CabinCrew,
//                   data.ZFW,
//                   data.TOW,
//                   data.LW,
//                   data.LWMAC,
//                   data.LWMACFWD,
//                   data.LWMACAFT,
//                   data.TOWMAC,
//                   data.TOWMACFWD,
//                   data.TOWMACAFT,
//                   data.ZFWMAC,
//                   data.ZFWMACFWD,
//                   data.ZFWMACAFT,
//                   data.TargetTOWMAC,
//                   data.ZFWindex,
//                   data.TOWindex,
//                   data.LWindex,
//                   data.LimitFacLw,
//                   data.LimitFacTow,
//                   data.LimitFacZfw,
//                   data.ActCabStr,
//                   data.SectorLDM,
//                   data.AdultLDM,
//                   data.InfantLDM,
//                   data.TotalLDM,
//                   data.BagLDM,
//                   data.CargoLDM,
//                   data.TrafficTotalWeight,
//                   data.FlapValues,
//                   data.ThrustValues,
//                   data.StabValues,
//                   data.underLoadLMC,
//                   data.CAPTAIN,
//                   data.Load_Officer,
//                   data.Trim_Officer,
//                   data.LTLoginId,
//                   data.LTLoginId,
//                   data.SuggestionMessage,
//                   data.TrimRecallNo,
//                   data.LIRRecallNo,
//                   data.IPAddress,
//                   data.ActCompStr,
//                   data.CabinPax,
//                   data.CockpitOccuPant,
//                   data.CabinAcm,
//                   data.AftJumpSeat,
//                   data.OZFW,
//                   true,
//                 ],
//                 (tx, result) => {
//                   resolve(result);
//                 },
//                 (tx, err) => {
//                   console.log(err);
//                   reject(err);
//                 }
//               );
//             });
//           }
//           var promises = [];
//           res.data.data.forEach((item) => {
//             promises.push(promiseData(item));
//           });
//           return Promise.all(promises);
//         });
//       });
//     })
//     .then((re) => {
//       defer.resolve();
//     })
//     .catch((er) => {
//       defer.reject(er);
//       console.log(er);
//     });
//   return defer.promise;
// }

// function nsFlightSchedule() {
//   var defer = q.defer();
//   var user = window.localStorage.getItem("auth_user");
//   if (user == null || user == undefined) {
//     return;
//   }
//   user = JSON.parse(user);
//   var current_date = moment().format("YYYY-MM-DD HH:mm:ss");
//   fetchNSFlightSchedule({
//     airport_code: user.airport_code,
//     date: current_date,
//   })
//     .then((res) => {
//       var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//       db.transaction(function (tx) {
//         tx.executeSql("DELETE FROM NS_FlightSchedule", [], () => {
//           function promiseData(data) {
//             return new Promise((resolve, reject) => {
//               tx.executeSql(
//                 "insert into NS_FlightSchedule (  id , Flight_no , Acft_Regn , Acft_Type , Source , Destination ,Flight_Date , STD , STA , ETD) values (?,?,?,?,?,?,?,?,?,?)",
//                 [
//                   data.Id,
//                   data.Flight_no,
//                   data.Acft_Regn,
//                   data.Acft_Type,
//                   data.Source,
//                   data.Destination,
//                   data.Flight_Date,
//                   data.STD,
//                   data.STA,
//                   data.ETD,
//                 ],
//                 (tx, result) => {
//                   resolve(result);
//                 },
//                 (tx, err) => {
//                   console.log(err);
//                   reject(err);
//                 }
//               );
//             });
//           }
//           var promises = [];
//           res.data.data.forEach((item) => {
//             promises.push(promiseData(item));
//           });
//           return Promise.all(promises);
//         });
//       });
//     })
//     .then((re) => {
//       defer.resolve();
//     })
//     .catch((er) => {
//       defer.reject(er);
//       console.log(er);
//     });
//   return defer.promise;
// }

// export function syncFlightEditionNo() {
//   var defer = q.defer();

//   var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//   db.transaction(function (tx) {
//     tx.executeSql(
//       "SELECT * FROM FlightEditionNo WHERE isSync = 'false'",
//       [],
//       (tx, results) => {
//         console.log("sync transaction res", results);
//         var sync_data = [];
//         if (results !== null && results.rows.length > 0) {
//           for (var i = 0; i < results.rows.length; i++) {
//             sync_data.push(results.rows.item(i));
//           }
//           var promise = [];
//           sync_data.forEach(async (i) => {
//             promise.push(addFlightEdition(i));
//           });
//           Promise.all(promise).then((res) => {
//             defer.resolve(res);
//           });
//         } else {
//           defer.resolve();
//         }
//       },
//       (er) => {
//         console.log(er);
//         defer.reject(er);
//       }
//     );
//   });
//   return defer.promise;
// }

// export function syncNSLntDetail() {
//   var defer = q.defer();

//   var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//   db.transaction(function (tx) {
//     tx.executeSql(
//       "SELECT * FROM Ns_LnTDetail WHERE isSync = 'false'",
//       [],
//       (tx, results) => {
//         console.log("sync transaction res", results);
//         var sync_data = [];
//         if (results !== null && results.rows.length > 0) {
//           for (var i = 0; i < results.rows.length; i++) {
//             sync_data.push(results.rows.item(i));
//           }
//           var promise = [];
//           sync_data.forEach(async (i) => {
//             promise.push(updateLntDetail(i));
//           });
//           Promise.all(promise).then((res) => {
//             defer.resolve(res);
//           });
//           syncSaltArchive();
//         } else {
//           defer.resolve();
//         }
//       },
//       (er) => {
//         console.log(er);
//         defer.reject(er);
//       }
//     );
//   });
//   return defer.promise;
// }

// export function syncThrustArchive() {
//   var defer = q.defer();

//   var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//   db.transaction(function (tx) {
//     tx.executeSql(
//       "SELECT * FROM ThrustArchive WHERE isSync = 'false'",
//       [],
//       (tx, results) => {
//         console.log("sync transaction res", results);
//         var sync_data = [];
//         if (results !== null && results.rows.length > 0) {
//           for (var i = 0; i < results.rows.length; i++) {
//             sync_data.push(results.rows.item(i));
//           }
//           var promise = [];
//           sync_data.forEach(async (i) => {
//             promise.push(updateThrust(i));
//           });
//           Promise.all(promise).then((res) => {
//             defer.resolve(res);
//           });
//         } else {
//           defer.resolve();
//         }
//       },
//       (er) => {
//         console.log(er);
//         defer.reject(er);
//       }
//     );
//   });
//   return defer.promise;
// }

// function syncOfflineTrimSheet() {
//   var defer = q.defer();

//   var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//   db.transaction(function (tx) {
//     tx.executeSql(
//       "SELECT * FROM TrimSheetLMCOffline WHERE isSync = 'false'",
//       [],
//       (tx, results) => {
//         console.log("sync trim sheet offline res", results);
//         if (results !== null && results.rows.length > 0) {
//           var sync_data = [];
//           for (var i = 0; i < results.rows.length; i++) {
//             sync_data.push(results.rows.item(i));
//           }
//           sync_data.map((x) => {
//             x.isOfflineGenerated =
//               x.isOfflineGenerated == "true" ? true : false;
//             x.isSync = true;
//             return x;
//           });

//           storeOfflineTrimSheet(sync_data).then((res) => {
//             defer.resolve();
//           });
//         } else {
//           defer.resolve();
//         }
//       },
//       (er) => {
//         console.log(er);
//         defer.reject(er);
//       }
//     );
//   });
//   return defer.promise;
// }

// function syncTrimSheetLMC() {
//   var defer = q.defer();

//   var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//   db.transaction(function (tx) {
//     tx.executeSql(
//       "SELECT * FROM TrimSheetLMC WHERE isSync = 'false'",
//       [],
//       (tx, results) => {
//         console.log("sync TrimSheetLMC res", results);
//         if (results !== null && results.rows.length > 0) {
//           var sync_data = [];
//           for (var i = 0; i < results.rows.length; i++) {
//             sync_data.push(results.rows.item(i));
//           }
//           sync_data.map((x) => {
//             x.Flight_Date = moment(x.Flight_Date).format("YYYY-MM-DD HH:mm:ss");
//             x.STD = moment(x.STD).format("YYYY-MM-DD HH:mm:ss");
//             x.TrimSheetTime = moment(x.TrimSheetTime).format(
//               "YYYY-MM-DD HH:mm:ss"
//             );
//             x.created_at =
//               x.created_at == null
//                 ? null
//                 : moment(x.created_at).format("YYYY-MM-DD HH:mm:ss");
//             x.Thrust24K = parseInt(x.Thrust24K);
//             x.Thrust26K = parseInt(x.Thrust26K);
//             x.TransitPax = parseInt(x.TransitPax);
//             x.Flap1 = parseInt(x.Flap1);
//             x.Flap2 = parseInt(x.Flap2);
//             x.Flap3 = parseInt(x.Flap3);
//             x.Flap4 = parseInt(x.Flap4);
//             x.Stab1 = parseInt(x.Stab1);
//             x.Stab2 = parseInt(x.Stab2);
//             x.Stab3 = parseInt(x.Stab3);
//             x.Stab4 = parseInt(x.Stab4);
//             x.isOfflineGenerated =
//               x.isOfflineGenerated == "true" ? true : false;
//             x.isSync = true;
//             return x;
//           });

//           add(sync_data).then((res) => {
//             defer.resolve();
//           });
//         } else {
//           defer.resolve();
//         }
//       },
//       (er) => {
//         console.log(er);
//         defer.reject(er);
//       }
//     );
//   });
//   return defer.promise;
// }

// function transactionData(item) {
//   var fields = [
//     "cargo_close",
//     "cargo_open",
//     "catering_end",
//     "catering_start",
//     "crew",
//     "door_close",
//     "door_open",
//     "fuel_end",
//     "fuel_start",
//     "in_time",
//     "lnt",
//     "out",
//     "security_end",
//     "security_start",
//     "service_end",
//     "service_start",
//     "tech_clear",
//   ];
//   var promise = [];

//   fields.forEach((i) => {
//     if (item[i] == null) {
//       return;
//     }
//     promise.push(
//       addTransaction({
//         fims_id: item.fims_id,
//         transaction_type: i,
//         user_id: -1,
//         time: moment(item[i]).format("YYYY-MM-DD HH:mm:ss"),
//         createdAt: moment(item[i + "_updated"]).format("YYYY-MM-DD HH:mm:ss"),
//         isSync: true,
//         message: "Synced",
//       })
//     );
//   });

//   return Promise.all(promise);
// }
// function Fleetinfo() {
//   var defer = q.defer();
//   fetch()
//     .then((res) => {
//       var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//       db.transaction(function (tx) {
//         tx.executeSql("DELETE FROM FleetInfo", [], () => {
//           function promiseData(data) {
//             return new Promise((resolve, reject) => {
//               tx.executeSql(
//                 "insert into FleetInfo (Id ,AC_REGN ,AC_TYPE ,CONFIG ,OEW ,OEW_Index ,STDCREW ,Pantry ,MTOW ,MLW ,MZFW ,MAxFuel ,EMRG_EXIT ,THRUST ,CMPT1 ,CMPT2 ,CMPT3 ,CMPT4 ,LastRow ,OALimit ,OBLimit ,OCLimit ,ODLimit ,OELimit ,C_Constant ,K_Constant ,CG_Ref ,LeMac ,Mac ,OFLimit, MaxCabin, MaxCompartment, CabinLimits, CompLimits, CabinIndex, CompIndex,IsFreighter ) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//                 [
//                   data.Id,
//                   data.AC_REGN,
//                   data.AC_TYPE,
//                   data.CONFIG,
//                   data.OEW,
//                   data.OEW_Index,
//                   data.STDCREW,
//                   data.Pantry,
//                   data.MTOW,
//                   data.MLW,
//                   data.MZFW,
//                   data.MAxFuel,
//                   data.EMRG_EXIT,
//                   data.THRUST,
//                   data.CMPT1,
//                   data.CMPT2,
//                   data.CMPT3,
//                   data.CMPT4,
//                   data.LastRow,
//                   data.OALimit,
//                   data.OBLimit,
//                   data.OCLimit,
//                   data.ODLimit,
//                   data.OELimit,
//                   data.C_Constant,
//                   data.K_Constant,
//                   data.CG_Ref,
//                   data.LeMac,
//                   data.Mac,
//                   data.OFLimit,
//                   data.MaxCabin,
//                   data.MaxCompartment,
//                   data.CabinLimits,
//                   data.CompLimits,
//                   data.CabinIndex,
//                   data.CompIndex,
//                   data.IsFreighter == true ? 1 : 0,
//                 ],
//                 (tx, result) => {
//                   resolve(result);
//                 },
//                 (tx, err) => {
//                   console.log(err);
//                   reject(err);
//                 }
//               );
//             });
//           }
//           var promises = [];
//           res.data.data.forEach((item) => {
//             promises.push(promiseData(item));
//           });
//           return Promise.all(promises);
//         });
//       });
//     })
//     .then((re) => {
//       defer.resolve();
//     })
//     .catch((er) => {
//       defer.reject(er);
//       console.log(er);
//     });
//   return defer.promise;
// }
// function LTAdjustWeight() {
//   var defer = q.defer();
//   fetchLTAdjust()
//     .then((res) => {
//       var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//       db.transaction(function (tx) {
//         tx.executeSql("DELETE FROM LTAdjustWeight", [], () => {
//           function promiseData(data) {
//             return new Promise((resolve, reject) => {
//               tx.executeSql(
//                 "insert into LTAdjustWeight (Id ,AcftType,CockpitOccupantPerKG,FwdGalleyPerKG ,PassengerInCabin1PerKG,FwdCargoCpt1PerKG ,FwdCargoCpt2PerKG ,PassengerInCabin3PerKG ,PassengerInCabin4PerKG,AftCargoCpt3PerKG,AftCargoCpt4PerKG ,AftGalleyPerKG ,AftJumpPerKG,FwdJumpPerKG ,MidJumpPerKG ) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//                 [
//                   data.Id,
//                   data.AcftType,
//                   data.CockpitOccupantPerKG,
//                   data.FwdGalleyPerKG,
//                   data.PassengerInCabin1PerKG,
//                   data.FwdCargoCpt1PerKG,
//                   data.FwdCargoCpt2PerKG,
//                   data.PassengerInCabin3PerKG,
//                   data.PassengerInCabin4PerKG,
//                   data.AftCargoCpt3PerKG,
//                   data.AftCargoCpt4PerKG,
//                   data.AftGalleyPerKG,
//                   data.AftJumpPerKG,
//                   data.FwdJumpPerKG,
//                   data.MidJumpPerKG,
//                 ],
//                 (tx, result) => {
//                   resolve(result);
//                 },
//                 (tx, err) => {
//                   console.log(err);
//                   reject(err);
//                 }
//               );
//             });
//           }
//           var promises = [];
//           res.data.data.forEach((item) => {
//             promises.push(promiseData(item));
//           });
//           return Promise.all(promises);
//         });
//       });
//     })
//     .catch((er) => {
//       console.log(er);
//     });
//   return defer.promise;
// }

// function LTAdjustWeightV2() {
//   var defer = q.defer();
//   fetchLTAdjust()
//     .then((res) => {
//       var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//       db.transaction(function (tx) {
//         tx.executeSql("DELETE FROM LTAdjustWeightV2", [], () => {
//           function promiseData(data) {
//             return new Promise((resolve, reject) => {
//               tx.executeSql(
//                 "insert into LTAdjustWeightV2 (Id ,Reg_no ,AcftType,CockpitOccupantPerKG, FwdGalleyPerKG, AftGalleyPerKG, AftJumpPerKG, FwdJumpPerKg, MidJumpPerKg,CabinBaggagePerKg ) values (?,?,?,?,?,?,?,?,?,?)",
//                 [
//                   data.Id,
//                   data.Regn_no,
//                   data.AcftType,
//                   data.CockpitOccupantPerKG,
//                   data.FwdGalleyPerKG,
//                   data.AftGalleyPerKG,
//                   data.AftJumpPerKG,
//                   data.FwdJumpPerKg,
//                   data.MidJumpPerKg,
//                   data.CabinBaggagePerKg,
//                 ],
//                 (tx, result) => {
//                   resolve(result);
//                 },
//                 (tx, err) => {
//                   console.log(err);
//                   reject(err);
//                 }
//               );
//             });
//           }
//           var promises = [];
//           res.data.data.forEach((item) => {
//             promises.push(promiseData(item));
//           });
//           return Promise.all(promises);
//         });
//       });
//     })
//     .then((re) => {
//       defer.resolve();
//     })
//     .catch((er) => {
//       defer.reject(er);
//       console.log(er);
//     });
//   return defer.promise;
// }

// function cgrefTable() {
//   var defer = q.defer();
//   fetchCgref()
//     .then((res) => {
//       var dataArry = [];
//       var aircraftArray = Object.keys(res.data.data);

//       aircraftArray.map((x) => {
//         var weightValues = res.data.data[x];
//         var weightAarry = Object.keys(res.data.data[x]);
//         weightAarry.map((y) => {
//           var weightObj = weightValues[y];
//           var obj = {
//             AcftType: x,
//             Weight: y,
//             Aft_Tow_Limit: weightObj.Aft_Tow_Limit,
//             Aft_Zfw_Limit: weightObj.Aft_Zfw_Limit,
//             Fwd_Tow_Limit: weightObj.Fwd_Tow_Limit,
//             Fwd_Zfw_Limit: weightObj.Fwd_Zfw_Limit,
//             Fwd_Zfw_Limit_Gt65317: weightObj.Fwd_Zfw_Limit_Gt65317,
//           };
//           dataArry.push(obj);
//         });
//       });
//       var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//       db.transaction(function (tx) {
//         tx.executeSql(
//           "DELETE FROM CGRefTable",
//           [],
//           () => {
//             function promiseData(data) {
//               return new Promise((resolve, reject) => {
//                 tx.executeSql(
//                   "insert into CGRefTable (AcftType , Weight , Aft_Tow_Limit , Aft_Zfw_Limit , Fwd_Tow_Limit , Fwd_Zfw_Limit ,Fwd_Zfw_Limit_Gt65317) values (?,?,?,?,?,?,?)",
//                   [
//                     data.AcftType,
//                     data.Weight,
//                     data.Aft_Tow_Limit,
//                     data.Aft_Zfw_Limit,
//                     data.Fwd_Tow_Limit,
//                     data.Fwd_Zfw_Limit,
//                     data.Fwd_Zfw_Limit_Gt65317,
//                   ],
//                   (tx, result) => {
//                     resolve(result);
//                   },
//                   (tx, err) => {
//                     console.log(err);
//                     reject(err);
//                   }
//                 );
//               });
//             }
//             var promises = [];
//             dataArry.forEach((item) => {
//               promises.push(promiseData(item));
//             });
//             return Promise.all(promises);
//           },
//           (er) => {
//             console.log("er....");
//             console.log(er);
//           }
//         );
//       });
//     })
//     .then((re) => {
//       defer.resolve();
//     })
//     .catch((er) => {
//       defer.reject(er);
//       console.log(er);
//     });
//   return defer.promise;
// }

// function fuelTable() {
//   var defer = q.defer();
//   fetchFuel()
//     .then((res) => {
//       defer.resolve(res.data.data);
//     })
//     .catch((er) => {
//       console.log(er);
//       defer.reject(er);
//     });
//   return defer.promise;
// }
// function fuelV2Table() {
//   var defer = q.defer();
//   fetchFuelV2()
//     .then((res) => {
//       defer.resolve(res.data.data);
//     })
//     .catch((er) => {
//       console.log(er);
//       defer.reject(er);
//     });
//   return defer.promise;
// }

// function nsCheckInDetail() {
//   var defer = q.defer();
//   var user = window.localStorage.getItem("auth_user");
//   if (user == null || user == undefined) {
//     return;
//   }
//   user = JSON.parse(user);
//   var current_date = moment().format("YYYY-MM-DD HH:mm:ss");
//   fetchNsCheckIn({
//     airport_code: user.airport_code,
//     date: current_date,
//   })
//     .then((res) => {
//       var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//       db.transaction(function (tx) {
//         tx.executeSql("DELETE FROM Ns_CheckInDetail", [], () => {
//           function promiseData(data) {
//             return new Promise((resolve, reject) => {
//               tx.executeSql(
//                 "insert into Ns_CheckInDetail ( Id , Flight_Date , Flight_no , Destination , source , C1Adult , C2Adult , C3Adult , C4Adult , C5Adult , C6Adult , C7Adult , C8Adult , C1Child , C2Child , C3Child , C4Child , C5Child , C6Child , C7Child , C8Child , C1Infant , C2infant , C3Infant , C4Infant , C5Infant , C6Infant , C7Infant , C8Infant ,OutofGate) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//                 [
//                   data.Id,
//                   data.Flight_Date,
//                   data.Flight_no,
//                   data.Destination,
//                   data.source,
//                   data.C1Adult,
//                   data.C2Adult,
//                   data.C3Adult,
//                   data.C4Adult,
//                   data.C5Adult,
//                   data.C6Adult,
//                   data.C7Adult,
//                   data.C8Adult,
//                   data.C1Child,
//                   data.C2Child,
//                   data.C3Child,
//                   data.C4Child,
//                   data.C5Child,
//                   data.C6Child,
//                   data.C7Child,
//                   data.C8Child,
//                   data.C1Infant,
//                   data.C2infant,
//                   data.C3Infant,
//                   data.C4Infant,
//                   data.C5Infant,
//                   data.C6Infant,
//                   data.C7Infant,
//                   data.C8Infant,
//                   data.OutofGate,
//                 ],
//                 (tx, result) => {
//                   resolve(result);
//                 },
//                 (tx, err) => {
//                   console.log(err);
//                   reject(err);
//                 }
//               );
//             });
//           }
//           var promises = [];
//           res.data.data.forEach((item) => {
//             promises.push(promiseData(item));
//           });
//           return Promise.all(promises);
//         });
//       });
//     })
//     .then((re) => {
//       defer.resolve();
//     })
//     .catch((er) => {
//       defer.reject(er);
//       console.log(er);
//     });
//   return defer.promise;
// }

// function nsLntDetail() {
//   var defer = q.defer();
//   var user = window.localStorage.getItem("auth_user");
//   if (user == null || user == undefined) {
//     return;
//   }
//   user = JSON.parse(user);
//   var current_date = moment().format("YYYY-MM-DD HH:mm:ss");
//   fetchNsLnt({
//     airport_code: user.airport_code,
//     date: current_date,
//   })
//     .then((res) => {
//       var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//       db.transaction(function (tx) {
//         tx.executeSql("DELETE FROM Ns_LnTDetail", [], () => {
//           function promiseData(data) {
//             return new Promise((resolve, reject) => {
//               tx.executeSql(
//                 "insert into Ns_LnTDetail (  Id , Flight_Date , Flight_no , Destination , source ,Acft_Regn, EDNO , ActcrewStr , cmpt1 , cmpt2 , cmpt3 , cmpt4 , TrimGenTimeUTC , ZFW , FOB , TOW , TRIP_FUEL , underLoadLMC , ZFWindex , TOWindex , LWindex , ZFWMAC , TOWMAC , LWMAC ,  specialStr , LTLoginId , Load_Officer , CAPTAIN, OEW, OEW_Index, AdjustStr ,ActCabStr ,ActCompStr,OLW,OTOW,RTOW,AdjustStrv2,LW,Trim_Officer,PalletsStr,ZFWMACFWD,ZFWMACAFT,TOWMACFWD,TOWMACAFT,LWMACFWD,LWMACAFT,isSync,CargoOnSeatStr,BagLDM,CargoLDM,ActLoadDistStr, ActLoadDistStrV2 , CaptEmpId,TargetTOWMAC,DeviationTOWMAC,AdultLDM,InfantLDM,TotalLDM) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//                 [
//                   data.Id,
//                   data.Flight_Date,
//                   data.Flight_no,
//                   data.Destination,
//                   data.source,
//                   data.Acft_Regn,
//                   data.EDNO,
//                   data.ActcrewStr,
//                   data.cmpt1,
//                   data.cmpt2,
//                   data.cmpt3,
//                   data.cmpt4,
//                   data.TrimGenTimeUTC,
//                   data.ZFW,
//                   data.FOB,
//                   data.TOW,
//                   data.TRIP_FUEL,
//                   data.underLoadLMC,
//                   data.ZFWindex,
//                   data.TOWindex,
//                   data.LWindex,
//                   data.ZFWMAC,
//                   data.TOWMAC,
//                   data.LWMAC,
//                   data.specialStr,
//                   data.LTLoginId,
//                   data.Load_Officer,
//                   data.CAPTAIN,
//                   data.OEW,
//                   data.OEW_Index,
//                   data.AdjustStr,
//                   data.ActCabStr,
//                   data.ActCompStr,
//                   data.OLW,
//                   data.OTOW,
//                   data.RTOW,
//                   data.AdjustStrv2,
//                   data.LW,
//                   data.Trim_Officer,
//                   data.PalletsStr,
//                   data.ZFWMACFWD,
//                   data.ZFWMACAFT,
//                   data.TOWMACFWD,
//                   data.TOWMACAFT,
//                   data.LWMACFWD,
//                   data.LWMACAFT,
//                   true,
//                   data.CargoOnSeatStr,
//                   data.BagLDM,
//                   data.CargoLDM,
//                   data.ActLoadDistStr,
//                   data.ActLoadDistStrV2,
//                   data.CaptEmpId,
//                   data.TargetTOWMAC,
//                   data.DeviationTOWMAC,
//                   data.AdultLDM,
//                   data.InfantLDM,
//                   data.TotalLDM,
//                 ],
//                 (tx, result) => {
//                   resolve(result);
//                 },
//                 (tx, err) => {
//                   console.log(err);
//                   reject(err);
//                 }
//               );
//             });
//           }
//           var promises = [];
//           res.data.data.forEach((item) => {
//             promises.push(promiseData(item));
//           });
//           return Promise.all(promises);
//         });
//       });
//     })
//     .then((re) => {
//       defer.resolve();
//     })
//     .catch((er) => {
//       defer.reject(er);
//       console.log(er);
//     });
//   return defer.promise;
// }

// function thrustArchive() {
//   var defer = q.defer();
//   var user = window.localStorage.getItem("auth_user");
//   if (user == null || user == undefined) {
//     return;
//   }
//   user = JSON.parse(user);
//   var current_date = moment().format("YYYY-MM-DD HH:mm:ss");
//   fetchThrust({
//     airport_code: user.airport_code,
//     date: current_date,
//   })
//     .then((res) => {
//       var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//       db.transaction(function (tx) {
//         tx.executeSql("DELETE FROM ThrustArchive", [], () => {
//           function promiseData(data) {
//             return new Promise((resolve, reject) => {
//               tx.executeSql(
//                 "insert into ThrustArchive ( Id , Flight_Date , Flight_no , Destination , source , Thrust1 , T1Flap1 , T1Stab1 , T1Flap2 , T1Stab2 , Thrust2 , T2Flap1 , T2Stab1 , T2Flap2 , T2Stab2 , Thrust3 , T3Flap1 , T3Stab1 , T3Flap2 , T3Stab2 , Thrust4 , T4Flap1 , T4Stab1 , T4Flap2 , T4Stab2,FlapValues,ThrustValues,StabValues,isSync) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//                 [
//                   data.Id,
//                   data.Flight_Date,
//                   data.Flight_no,
//                   data.Destination,
//                   data.source,
//                   data.Thrust1,
//                   data.T1Flap1,
//                   data.T1Stab1,
//                   data.T1Flap2,
//                   data.T1Stab2,
//                   data.Thrust2,
//                   data.T2Flap1,
//                   data.T2Stab1,
//                   data.T2Flap2,
//                   data.T2Stab2,
//                   data.Thrust3,
//                   data.T3Flap1,
//                   data.T3Stab1,
//                   data.T3Flap2,
//                   data.T3Stab2,
//                   data.Thrust4,
//                   data.T4Flap1,
//                   data.T4Stab1,
//                   data.T4Flap2,
//                   data.T4Stab2,
//                   data.FlapValues,
//                   data.ThrustValues,
//                   data.StabValues,
//                   true,
//                 ],
//                 (tx, result) => {
//                   resolve(result);
//                 },
//                 (tx, err) => {
//                   console.log(err);
//                   reject(err);
//                 }
//               );
//             });
//           }
//           var promises = [];
//           res.data.data.forEach((item) => {
//             promises.push(promiseData(item));
//           });
//           return Promise.all(promises);
//         });
//       });
//     })
//     .then((re) => {
//       defer.resolve();
//     })
//     .catch((er) => {
//       defer.reject(er);
//       console.log(er);
//     });
//   return defer.promise;
// }

// function flighteditionNo() {
//   var defer = q.defer();
//   var user = window.localStorage.getItem("auth_user");
//   if (user == null || user == undefined) {
//     return;
//   }
//   user = JSON.parse(user);
//   var current_date = moment().format("YYYY-MM-DD HH:mm:ss");
//   fetchEdition({
//     airport_code: user.airport_code,
//     date: current_date,
//   })
//     .then((res) => {
//       var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//       db.transaction(function (tx) {
//         tx.executeSql("DELETE FROM FlightEditionNo", [], () => {
//           function promiseData(data) {
//             return new Promise((resolve, reject) => {
//               tx.executeSql(
//                 "insert into FlightEditionNo ( Id , Flight_Date , Flight_no , Destination , source , EdNo , Regn_no ,ActcrewStr ,cmpt1 ,cmpt2 ,cmpt3 ,cmpt4 ,ZFW  ,FOB ,TOW ,TripFuel ,underLoadLMC ,ZFWindex  ,TOWindex  ,LWindex  ,ZFWMAC  ,TOWMAC  ,LWMAC ,LoadOfficer ,SI ,Captain ,OEW ,OEW_Index ,AdjustStr ,ActCabStr ,ActCompStr ,OLW  ,OTOW  ,RTOW  ,AdjustStrv2 ,LW ,TrimOfficer ,UTCtime ,ISTtime ,FlapValues ,ThrustValues ,StabValues,AppType,ZFWMACFWD,ZFWMACAFT,TOWMACFWD,TOWMACAFT,LWMACFWD,LWMACAFT,Userid,isSync ) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//                 [
//                   data.Id,
//                   data.Flight_Date,
//                   data.Flight_no,
//                   data.Destination,
//                   data.source,
//                   data.EdNo,
//                   data.Regn_no,
//                   data.ActcrewStr,
//                   data.cmpt1,
//                   data.cmpt2,
//                   data.cmpt3,
//                   data.cmpt4,
//                   data.ZFW,
//                   data.FOB,
//                   data.TOW,
//                   data.TripFuel,
//                   data.underLoadLMC,
//                   data.ZFWindex,
//                   data.TOWindex,
//                   data.LWindex,
//                   data.ZFWMAC,
//                   data.TOWMAC,
//                   data.LWMAC,
//                   data.LoadOfficer,
//                   data.SI,
//                   data.Captain,
//                   data.OEW,
//                   data.OEW_Index,
//                   data.AdjustStr,
//                   data.ActCabStr,
//                   data.ActCompStr,
//                   data.OLW,
//                   data.OTOW,
//                   data.RTOW,
//                   data.AdjustStrv2,
//                   data.LW,
//                   data.TrimOfficer,
//                   data.UTCtime,
//                   data.ISTtime,
//                   data.FlapValues,
//                   data.ThrustValues,
//                   data.StabValues,
//                   data.AppType,
//                   data.ZFWMACFWD,
//                   data.ZFWMACAFT,
//                   data.TOWMACFWD,
//                   data.TOWMACAFT,
//                   data.LWMACFWD,
//                   data.LWMACAFT,
//                   data.Userid,
//                   true,
//                 ],
//                 (tx, result) => {
//                   resolve(result);
//                 },
//                 (tx, err) => {
//                   console.log(err);
//                   reject(err);
//                 }
//               );
//             });
//           }
//           var promises = [];
//           res.data.data.forEach((item) => {
//             promises.push(promiseData(item));
//           });
//           return Promise.all(promises);
//         });
//       });
//     })
//     .then((re) => {
//       defer.resolve();
//     })
//     .catch((er) => {
//       defer.reject(er);
//       console.log(er);
//     });
//   return defer.promise;
// }

// function stabTrimThrust() {
//   var defer = q.defer();
//   fetchStabTrimThrust()
//     .then((res) => {
//       var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//       db.transaction(function (tx) {
//         tx.executeSql("DELETE FROM StabTrimThrust", [], () => {
//           function promiseData(data) {
//             return new Promise((resolve, reject) => {
//               tx.executeSql(
//                 "insert into StabTrimThrust (Id ,Regn_no ,AcftType ,TableName ,LOPA ,Thrust ,Flap ) values (?,?,?,?,?,?,?)",
//                 [
//                   data.Id,
//                   data.Regn_no,
//                   data.AcftType,
//                   data.TableName,
//                   data.LOPA,
//                   data.Thrust,
//                   data.Flap,
//                 ],
//                 (tx, result) => {
//                   resolve(result);
//                 },
//                 (tx, err) => {
//                   console.log(err);
//                   reject(err);
//                 }
//               );
//             });
//           }
//           var promises = [];
//           res.data.data.forEach((item) => {
//             promises.push(promiseData(item));
//           });
//           return Promise.all(promises);
//         });
//       });
//     })
//     .then((re) => {
//       defer.resolve();
//     })
//     .catch((er) => {
//       defer.reject(er);
//       console.log(er);
//     });
//   return defer.promise;
// }

// function stabTrimData() {
//   var defer = q.defer();
//   fetchData()
//     .then((res) => {
//       var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//       db.transaction(function (tx) {
//         tx.executeSql("DELETE FROM StabTrimData", [], () => {
//           function promiseData(data) {
//             return new Promise((resolve, reject) => {
//               tx.executeSql(
//                 "insert into StabTrimData (Id, STABVARIANT, THRUST, FLAP, TOW, TOWMAC, STAB) values (?,?,?,?,?,?,?)",
//                 [
//                   data.Id,
//                   data.STABVARIANT,
//                   data.THRUST,
//                   data.FLAP,
//                   data.TOW,
//                   data.TOWMAC,
//                   data.STAB,
//                 ],
//                 (tx, result) => {
//                   resolve(result);
//                 },
//                 (tx, err) => {
//                   console.log(err);
//                   reject(err);
//                 }
//               );
//             });
//           }
//           var promises = [];
//           res.data.data.forEach((item) => {
//             promises.push(promiseData(item));
//           });
//           return Promise.all(promises);
//         });
//       });
//     })
//     .then((re) => {
//       defer.resolve();
//     })
//     .catch((er) => {
//       defer.reject(er);
//       console.log(er);
//     });
//   return defer.promise;
// }

// function offlineTrimSheet() {
//   var defer = q.defer();
//   var current_date = moment().format("YYYY-MM-DD");
//   fetchOfflineTrimSheet({
//     date: current_date,
//   })
//     .then((res) => {
//       var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//       db.transaction(function (tx) {
//         tx.executeSql("DELETE FROM TrimSheetLMCOffline", [], () => {
//           function promiseData(data) {
//             return new Promise((resolve, reject) => {
//               tx.executeSql(
//                 "insert into TrimSheetLMCOffline (id, flight_no, flight_date, trim_gen_time, edition_no, source, destination, std, sta,regno, ac_type, config, crew, COMPWT, CABBGWT,PAXWT, total_load, dow, zfw, mzfw, take_of_fuel, tow, trip_fuel, law, olw, otow, mlw, underload, doi, lizfw, litow, lilw, zfmac, towmac, lwmac, pax,  cargo, adult, child, infant, ttl, sob, si, loginId, trim_officer, load_officer, captain, thrust, isSync, isOfflineGenerated, created_at,AdjustStr,ActCabStr,ActCompStr,ZFWMACFWD,ZFWMACAFT,TOWMACFWD,TOWMACAFT,LWMACFWD,LWMACAFT) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//                 [
//                   data.id,
//                   data.flight_no,
//                   data.flight_date,
//                   data.trim_gen_time,
//                   data.edition_no,
//                   data.source,
//                   data.destination,
//                   data.std,
//                   data.sta,
//                   data.regno,
//                   data.ac_type,
//                   data.config,
//                   data.crew,
//                   data.COMPWT,
//                   data.CABBGWT,
//                   data.PAXWT,
//                   data.total_load,
//                   data.dow,
//                   data.zfw,
//                   data.mzfw,
//                   data.take_of_fuel,
//                   data.tow,
//                   data.trip_fuel,
//                   data.law,
//                   data.olw,
//                   data.otow,
//                   data.mlw,
//                   data.underload,
//                   data.doi,
//                   data.lizfw,
//                   data.litow,
//                   data.lilw,
//                   data.zfmac,
//                   data.towmac,
//                   data.lwmac,
//                   data.pax,
//                   data.cargo,
//                   data.adult,
//                   data.child,
//                   data.infant,
//                   data.ttl,
//                   data.sob,
//                   data.si,
//                   data.loginId,
//                   data.trim_officer,
//                   data.load_officer,
//                   data.captain,
//                   data.thrust,
//                   data.isSync,
//                   data.isOfflineGenerated,
//                   data.created_at,
//                   data.AdjustStr,
//                   data.ActCabStr,
//                   data.ActCompStr,
//                   data.ZFWMACFWD,
//                   data.ZFWMACAFT,
//                   data.TOWMACFWD,
//                   data.TOWMACAFT,
//                   data.LWMACFWD,
//                   data.LWMACAFT,
//                 ],
//                 (tx, result) => {
//                   resolve(result);
//                 },
//                 (tx, err) => {
//                   console.log(err);
//                   reject(err);
//                 }
//               );
//             });
//           }
//           var promises = [];
//           console.log(res);
//           res.data.forEach((item) => {
//             promises.push(promiseData(item));
//           });
//           return Promise.all(promises);
//         });
//       });
//     })
//     .then((re) => {
//       defer.resolve();
//     })
//     .catch((er) => {
//       defer.reject(er);
//       console.log(er);
//     });
//   return defer.promise;
// }

// function cGRefTableZFW() {
//   var defer = q.defer();
//   fetchCGRefTableZFW()
//     .then((res) => {
//       var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//       db.transaction(function (tx) {
//         tx.executeSql("DELETE FROM CGRefTableZFW", [], () => {
//           function promiseData(data) {
//             return new Promise((resolve, reject) => {
//               tx.executeSql(
//                 "insert into CGRefTableZFW (Id, Regn_no, TableName, MinLW, MaxLW ) values (?,?,?,?,?)",
//                 [data.Id, data.Regn_no, data.TableName, data.MinLW, data.MaxLW],
//                 (tx, result) => {
//                   resolve(result);
//                 },
//                 (tx, err) => {
//                   console.log(err);
//                   reject(err);
//                 }
//               );
//             });
//           }
//           var promises = [];
//           res.data.data.forEach((item) => {
//             promises.push(promiseData(item));
//           });
//           return Promise.all(promises);
//         });
//       });
//     })
//     .then((re) => {
//       defer.resolve();
//     })
//     .catch((er) => {
//       defer.reject(er);
//       console.log(er);
//     });
//   return defer.promise;
// }

// function cGRefTableTOW() {
//   var defer = q.defer();
//   fetchCGRefTableTOW()
//     .then((res) => {
//       var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//       db.transaction(function (tx) {
//         tx.executeSql("DELETE FROM CGRefTableTOW", [], () => {
//           function promiseData(data) {
//             return new Promise((resolve, reject) => {
//               tx.executeSql(
//                 "insert into CGRefTableTOW (Id, Regn_no, TableName, MinLW, MaxLW ) values (?,?,?,?,?)",
//                 [data.Id, data.Regn_no, data.TableName, data.MinLW, data.MaxLW],
//                 (tx, result) => {
//                   resolve(result);
//                 },
//                 (tx, err) => {
//                   console.log(err);
//                   reject(err);
//                 }
//               );
//             });
//           }
//           var promises = [];
//           res.data.data.forEach((item) => {
//             promises.push(promiseData(item));
//           });
//           return Promise.all(promises);
//         });
//       });
//     })
//     .then((re) => {
//       defer.resolve();
//     })
//     .catch((er) => {
//       defer.reject(er);
//       console.log(er);
//     });
//   return defer.promise;
// }

// function cgLIMITSZFW() {
//   var defer = q.defer();
//   fetchCGLIMTISZFW()
//     .then((res) => {
//       var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//       db.transaction(function (tx) {
//         tx.executeSql("DELETE FROM CGLIMITSZFW", [], () => {
//           function promiseData(data) {
//             return new Promise((resolve, reject) => {
//               tx.executeSql(
//                 "insert into CGLIMITSZFW (Id, CGVARIANT, Weight, Fwd_Zfw_Limit, Aft_Zfw_Limit) values (?,?,?,?,?)",
//                 [
//                   data.Id,
//                   data.CGVARIANT,
//                   data.Weight,
//                   data.Fwd_Zfw_Limit,
//                   data.Aft_Zfw_Limit,
//                 ],
//                 (tx, result) => {
//                   resolve(result);
//                 },
//                 (tx, err) => {
//                   console.log(err);
//                   reject(err);
//                 }
//               );
//             });
//           }
//           var promises = [];
//           res.data.data.forEach((item) => {
//             promises.push(promiseData(item));
//           });
//           return Promise.all(promises);
//         });
//       });
//     })
//     .then((re) => {
//       defer.resolve();
//     })
//     .catch((er) => {
//       defer.reject(er);
//       console.log(er);
//     });
//   return defer.promise;
// }

// function cgLIMITSTOW() {
//   var defer = q.defer();
//   fetchCGLIMTISTOW()
//     .then((res) => {
//       var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//       db.transaction(function (tx) {
//         tx.executeSql("DELETE FROM CGLIMITSTOW", [], () => {
//           function promiseData(data) {
//             return new Promise((resolve, reject) => {
//               tx.executeSql(
//                 "insert into CGLIMITSTOW (Id, CGVARIANT, Weight, Fwd_Tow_limit, Aft_Tow_Limit) values (?,?,?,?,?)",
//                 [
//                   data.Id,
//                   data.CGVARIANT,
//                   data.Weight,
//                   data.Fwd_Tow_limit,
//                   data.Aft_Tow_Limit,
//                 ],
//                 (tx, result) => {
//                   resolve(result);
//                 },
//                 (tx, err) => {
//                   console.log(err);
//                   reject(err);
//                 }
//               );
//             });
//           }
//           var promises = [];
//           res.data.data.forEach((item) => {
//             promises.push(promiseData(item));
//           });
//           return Promise.all(promises);
//         });
//       });
//     })
//     .then((re) => {
//       defer.resolve();
//     })
//     .catch((er) => {
//       defer.reject(er);
//       console.log(er);
//     });
//   return defer.promise;
// }

// function checkRecords() {
//   var defer = q.defer();
//   var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));

//   db.transaction(function (tx) {
//     tx.executeSql(
//       "SELECT COUNT(*) FROM CGRefTable",
//       [],
//       (tx, results) => {
//         console.log("Count results", results);
//         defer.resolve();
//       },
//       (er) => {
//         console.log(er);
//         defer.reject(er);
//       }
//     );
//   });

//   return defer.promise;
// }

// export function syncNewThread() {
//   console.log("syncingg start");
//   var datetimeStart = new Date();
//   console.log("Start time : ", datetimeStart.toISOString());
//   var user = window.localStorage.getItem("auth_user");
//   if (user == null || user == undefined) {
//     return;
//   }

//   user = JSON.parse(user);
//   var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));

//   return function (dispatch) {
//     dispatch({ type: "RAMP_SYNC_STARTED" });

//     checkRecords()
//       .then(() => {
//         return syncTransaction();
//       })
//       .then(() => {
//         return syncOfflineTrimSheet();

//         // syncTransaction().then(()=>{
//         //     return syncOfflineTrimSheet()
//       })
//       .then(() => {
//         return syncTrimSheetLMC();
//       })
//       .then(() => {
//         return syncNSLntDetail();
//       })
//       .then(() => {
//         return syncFlightEditionNo();
//       })
//       .then(() => {
//         return syncThrustArchive();
//       })
//       .then(() => {
//         var current_date = moment().format("YYYY-MM-DD HH:mm:ss");
//         return ramp.fetch({
//           airport_code: user.airport_code,
//           date: current_date,
//         });
//       })
//       .then((ramp_record) => {
//         console.log("111");
//         return db.transaction(function (tx) {
//           tx.executeSql("DELETE FROM fims_schedule", [], () => {
//             tx.executeSql(
//               "DELETE FROM TrimSheetLMC",
//               [],
//               () => {
//                 tx.executeSql(
//                   "DELETE FROM ramp_transactions",
//                   [],
//                   () => {
//                     function promiseData(item) {
//                       return new Promise((resolve, reject) => {
//                         tx.executeSql(
//                           "insert into fims_schedule (id, Regn_no ,Acft_Type,Flight_no ,Source ,Destination ,Flight_Date  ,STD ,STA ,ETD ,ETA ,BAYNO ) values (?,?,?,?,?,?,?,?,?,?,?,?)",
//                           [
//                             item.id,
//                             item.Acft_Regn,
//                             item.Acft_Type,
//                             item.Flight_no,
//                             item.Source,
//                             item.Destination,
//                             item.Flight_Date,
//                             item.STD,
//                             item.STA,
//                             item.ETD,
//                             item.ETA,
//                             item.BAYNO,
//                           ],
//                           (tx, result) => {
//                             if (item.FimsTRIM[0] != undefined) {
//                               var active =
//                                 item.FimsTRIM[0]["active"] != undefined
//                                   ? item.FimsTRIM[0]["active"]
//                                   : false;
//                               var isSync =
//                                 item.FimsTRIM[0]["isSync"] != undefined
//                                   ? item.FimsTRIM[0]["isSync"]
//                                   : false;
//                               var isOfflineGenerated =
//                                 item.FimsTRIM[0]["isOfflineGenerated"] !=
//                                 undefined
//                                   ? item.FimsTRIM[0]["isOfflineGenerated"]
//                                   : false;
//                               var created_at =
//                                 item.FimsTRIM[0]["created_at"] != undefined
//                                   ? item.FimsTRIM[0]["created_at"]
//                                   : null;
//                               var ms_id =
//                                 item.FimsTRIM[0]["Id"] != undefined
//                                   ? item.FimsTRIM[0]["Id"]
//                                   : item.FimsTRIM[0]["ms_id"];
//                               console.log(
//                                 active,
//                                 isSync,
//                                 isOfflineGenerated,
//                                 created_at,
//                                 "insert trim"
//                               );
//                               tx.executeSql(
//                                 "insert into TrimSheetLMC (ms_id ,  FlightNo  ,  Flight_Date ,  Acft_Type ,  STD,  TrimSheetTime,  Source ,  Destination ,  Regn_no ,  Crew ,  ZFW ,  MZFW ,  TOF ,  TOW ,  MTOW ,  TripFuel ,  LAW ,  MLAW ,  underLoad , LIZFW ,  LITOW ,  LILAW ,  ZFWMAC ,  MAC ,  TOWMAC ,  LAWMAC ,  Thrust24K ,  Flap1 ,  Stab1 ,  Flap2 ,  Stab2 ,  Thrust26K ,  Flap3 ,  Stab3 ,  Flap4 ,  Stab4 ,  cmpt1 ,  cmpt2 ,  cmpt3 ,  cmpt4 ,  Adult ,  Child ,  Infant ,  Tpax ,  SOB ,  TransitPax ,  SI ,  LoadOfficer ,  Captain ,  PreparedBy ,  Z1a ,  Z1c ,  Z1i ,  Z2a ,  Z2c ,  Z2i ,  Z3a ,  Z3c ,  Z3i,active ,isSync ,isOfflineGenerated,created_at ) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//                                 [
//                                   ms_id,
//                                   item.FimsTRIM[0]["FlightNo"],
//                                   item.FimsTRIM[0]["Flight_Date"],
//                                   item.FimsTRIM[0]["Acft_Type"],
//                                   item.FimsTRIM[0]["STD"],
//                                   item.FimsTRIM[0]["TrimSheetTime"],
//                                   item.FimsTRIM[0]["Source"],
//                                   item.FimsTRIM[0]["Destination"],
//                                   item.FimsTRIM[0]["Regn_no"],
//                                   item.FimsTRIM[0]["Crew"],
//                                   item.FimsTRIM[0]["ZFW"],
//                                   item.FimsTRIM[0]["MZFW"],
//                                   item.FimsTRIM[0]["TOF"],
//                                   item.FimsTRIM[0]["TOW"],
//                                   item.FimsTRIM[0]["MTOW"],
//                                   item.FimsTRIM[0]["TripFuel"],
//                                   item.FimsTRIM[0]["LAW"],
//                                   item.FimsTRIM[0]["MLAW"],
//                                   item.FimsTRIM[0]["underLoad"],
//                                   item.FimsTRIM[0]["LIZFW"],
//                                   item.FimsTRIM[0]["LITOW"],
//                                   item.FimsTRIM[0]["LILAW"],
//                                   item.FimsTRIM[0]["ZFWMAC"],
//                                   item.FimsTRIM[0]["MAC"],
//                                   item.FimsTRIM[0]["TOWMAC"],
//                                   item.FimsTRIM[0]["LAWMAC"],
//                                   item.FimsTRIM[0]["Thrust24K"],
//                                   item.FimsTRIM[0]["Flap1"],
//                                   item.FimsTRIM[0]["Stab1"],
//                                   item.FimsTRIM[0]["Flap2"],
//                                   item.FimsTRIM[0]["Stab2"],
//                                   item.FimsTRIM[0]["Thrust26K"],
//                                   item.FimsTRIM[0]["Flap3"],
//                                   item.FimsTRIM[0]["Stab3"],
//                                   item.FimsTRIM[0]["Flap4"],
//                                   item.FimsTRIM[0]["Stab4"],
//                                   item.FimsTRIM[0]["cmpt1"],
//                                   item.FimsTRIM[0]["cmpt2"],
//                                   item.FimsTRIM[0]["cmpt3"],
//                                   item.FimsTRIM[0]["cmpt4"],
//                                   item.FimsTRIM[0]["Adult"],
//                                   item.FimsTRIM[0]["Child"],
//                                   item.FimsTRIM[0]["Infant"],
//                                   item.FimsTRIM[0]["Tpax"],
//                                   item.FimsTRIM[0]["SOB"],
//                                   item.FimsTRIM[0]["TransitPax"],
//                                   item.FimsTRIM[0]["SI"],
//                                   item.FimsTRIM[0]["LoadOfficer"],
//                                   item.FimsTRIM[0]["Captain"],
//                                   item.FimsTRIM[0]["PreparedBy"],
//                                   item.FimsTRIM[0]["Z1a"],
//                                   item.FimsTRIM[0]["Z1c"],
//                                   item.FimsTRIM[0]["Z1i"],
//                                   item.FimsTRIM[0]["Z2a"],
//                                   item.FimsTRIM[0]["Z2c"],
//                                   item.FimsTRIM[0]["Z2i"],
//                                   item.FimsTRIM[0]["Z3a"],
//                                   item.FimsTRIM[0]["Z3c"],
//                                   item.FimsTRIM[0]["Z3i"],
//                                   active,
//                                   true,
//                                   isOfflineGenerated,
//                                   created_at,
//                                 ],
//                                 (tx, result) => {
//                                   resolve(result);
//                                 },
//                                 (tx, err) => {
//                                   console.log(err);
//                                   reject(err);
//                                   // dispatch({'type':'RAMP_SYNC_COMPLETED'});
//                                 }
//                               );
//                             } else {
//                               resolve(result);
//                             }
//                           },
//                           (tx, err) => {
//                             console.log(err);
//                             reject(err);
//                             // dispatch({'type':'RAMP_SYNC_COMPLETED'});
//                           }
//                         );
//                       });
//                     }
//                     var promises = [];
//                     ramp_record.data.data.data.forEach((item) => {
//                       promises.push(promiseData(item));
//                     });
//                     Promise.all(promises)
//                       .then(() => {
//                         var transactionPromise = [];
//                         ramp_record.data.data.res.forEach((item) => {
//                           transactionPromise.push(transactionData(item));
//                         });
//                         return Promise.all(transactionPromise);
//                       })
//                       .then(
//                         () => {
//                           window.localStorage.setItem(
//                             "last_sync",
//                             moment().format("YYYY-MM-DD HH:mm:ss")
//                           );
//                           // dispatch({'type':'RAMP_SYNC_COMPLETED'});
//                         },
//                         (err) => {
//                           window.localStorage.setItem(
//                             "last_sync",
//                             moment().format("YYYY-MM-DD HH:mm:ss")
//                           );
//                           console.log(err);
//                           // dispatch({'type':'RAMP_SYNC_COMPLETED'});
//                         }
//                       );
//                   },
//                   null
//                 );
//               },
//               (tx, err) => {
//                 console.log(err);
//               }
//             );
//           });
//         });
//       })
//       .then(() => {
//         // dispatch({'type':'RAMP_SYNC_STARTED'});
//         return Promise.all([
//           // cgrefTable(),
//           // Fleetinfo(),
//           // LTAdjustWeightV2(),
//           // fuelTable(),
//           //fuelV2Table(),
//           nsCheckInDetail(),
//           nsLntDetail(),
//           thrustArchive(),
//           flighteditionNo(),
//           // stabTrimThrust(),
//           // stabTrimData(),
//           // cGRefTableTOW(),
//           // cGRefTableZFW(),
//           // cgLIMITSTOW(),
//           // cgLIMITSZFW(),
//           offlineTrimSheet(),
//           //,saltArchive()
//           //  ,nsFlightSchedule()
//         ]);
//       })
//       .then(() => {
//         console.log("sramp sync complete");
//         window.localStorage.setItem(
//           "last_sync",
//           moment().format("YYYY-MM-DD HH:mm:ss")
//         );
//         var datetimeEnd = new Date();
//         console.log("Sync end Time : ", datetimeEnd.toISOString());
//         dispatch({ type: "RAMP_SYNC_COMPLETED" });
//       })
//       .then(() => {
//         return checkRecords();
//       })
//       .catch((er) => {
//         console.log(er);
//         dispatch({ type: "RAMP_SYNC_COMPLETED" });
//         if (isNetworkUp()) {
//           showError(
//             "Currently SALT server is down. Please try after sometime or contact IT admin."
//           );
//         } else {
//           showError("Please check your network connection and try again!!");
//         }
//       });
//   };
// }

// export function syncSaltArchive() {
//   var defer = q.defer();

//   var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//   db.transaction(function (tx) {
//     tx.executeSql(
//       "SELECT * FROM SALTArchive ",
//       [],
//       (tx, results) => {
//         console.log("sync syncSaltArchive transaction res", results);
//         var sync_data = [];
//         if (results !== null && results.rows.length > 0) {
//           for (var i = 0; i < results.rows.length; i++) {
//             sync_data.push(results.rows.item(i));
//           }
//           // var promise =[]
//           sync_data.forEach(async (i) => {
//             // promise.push(updateSaltArchive(i))
//             updateSaltArchive(i);
//             console.log(i.Id, " Delete saltArchive transaction res ", i);
//             var sqlStm = "DELETE FROM SALTArchive WHERE Id = " + i.Id;
//             tx.executeSql(sqlStm, [], (tx, resultVal) => {
//               console.log(" Delete saltArchive transaction succes ", resultVal);
//               defer.resolve();
//             });
//           });
//           //Promise.all(promise).then((res)=>{
//           //  defer.resolve(res)
//           //})
//         } else {
//           defer.resolve();
//         }
//       },
//       (er) => {
//         console.log(er);
//         defer.reject(er);
//       }
//     );
//   });
//   return defer.promise;
// }

// export function deleteTables() {
//   var defer = q.defer();
//   var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//   db.transaction(function (tx) {
//     Promise.all([
//       syncNewThread(),
//       tx.executeSql("DELETE FROM fims_schedule", []),
//       tx.executeSql("DELETE FROM TrimSheetLMC", []),
//       tx.executeSql("DELETE FROM ramp_data", []),
//       tx.executeSql("DELETE FROM FleetInfo", []),
//       tx.executeSql("DELETE FROM LTAdjustWeight", []),
//       tx.executeSql("DELETE FROM LTAdjustWeightV2", []),
//       tx.executeSql("DELETE FROM CGRefTable", []),
//       tx.executeSql("DELETE FROM Ns_CheckInDetail", []),
//       tx.executeSql("DELETE FROM Ns_LnTDetail", []),
//       tx.executeSql("DELETE FROM ThrustArchive", []),
//       tx.executeSql("DELETE FROM LTAdjustWeightV2", []),
//       tx.executeSql("DELETE FROM TrimSheetLMCOffline", []),
//       tx.executeSql("DELETE FROM StabTrimThrust", []),
//       tx.executeSql("DELETE FROM StabTrimData", []),
//       tx.executeSql("DELETE FROM CGRefTableZFW", []),
//       tx.executeSql("DELETE FROM CGLIMITSZFW", []),
//       tx.executeSql("DELETE FROM CGRefTableTOW", []),
//       tx.executeSql("DELETE FROM CGLIMITSTOW", []),
//       tx.executeSql("DELETE FROM FlightEditionNo", []),
//     ])
//       .then(() => {
//         defer.resolve();
//       })
//       .catch((err) => {
//         defer.reject();
//       });
//   });
//   return defer.promise;
// }
