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
import { fetchRegNoFileName as fetchRegNoFileNameV2 } from "./fuelV2action";
import { fetch as fetchLTAdjust } from "./LTAdjustaction";
import { fetch as fetchNsCheckIn } from "./nscheckindetail";
import { fetch as fetchNsLnt } from "./nslntdetail";
import { fetch as fetchThrust } from "./thrustarchive";
import { fetch as fetchEdition } from "./flighteditionno";
import {
  fetch as fetchStabTrimThrust,
  fetchData,
} from "./stabtrimthrustaction";
import { fetch as fetchSaltArchive } from "./saltArchive";
import { update as updateLntDetail } from "./nslntdetail";
import { update as updateSaltArchive } from "./saltArchive";
import { add as addFlightEdition } from "./flighteditionno";
import { update as updateThrust } from "./thrustarchive";
import * as Enviornment from "./environment";
import { fetch as fetchNSFlightSchedule } from "./nsflightschedule";
import { add } from "./LMCaction";
import { showError, isNetworkUp } from "./networkaction";

// var current_date    =  moment().format("YYYY-MM-DD HH:mm:ss")
// var current_date    =  "2020-07-01"

function syncTransaction() {
  return new Promise((resolve, reject) => {
    var dbOpenRequest = indexedDB.open(Enviornment.get("DB_NAME"),1);

    dbOpenRequest.onerror = function (event) {
      reject(new Error("Failed to open the database."));
    };
    dbOpenRequest.onupgradeneeded = function (event) {
      var db = event.target.result;
      
    }
    // dbOpenRequest.onsuccess = function (event) {
    //   var db = event.target.result;

    //   var transaction = db.transaction("ramp_transactions", "readwrite");
    //   var objectStore = transaction.objectStore("ramp_transactions");

    //   var getRequest = objectStore.index("isSync").getAll("false");

    //   getRequest.onsuccess = function (event) {
    //     var syncData = event.target.result;

    //     var promises = syncData.map((transactionData) => {
    //       return storeTransaction(transactionData);
    //     });

    //     Promise.all(promises)
    //       .then(() => {
    //         var deleteTransactionTransaction = db.transaction(["ramp_transactions"], "readwrite");
    //         var deleteObjectStore = deleteTransactionTransaction.objectStore("ramp_transactions");

    //         var deleteRequest = deleteObjectStore.index("id").openKeyCursor(IDBKeyRange.only(syncData.map((i) => i.id)));

    //         deleteRequest.onsuccess = function (event) {
    //           var cursor = event.target.result;
    //           if (cursor) {
    //             cursor.delete();
    //             cursor.continue();
    //           }
    //         };

    //         deleteTransactionTransaction.oncomplete = function () {
    //           resolve("Sync transactions completed successfully.");
    //         };
    //       })
    //       .catch((error) => {
    //         reject(error);
    //       });
    //   };

    //   getRequest.onerror = function (event) {
    //     reject(new Error("Failed to fetch unsynced transactions."));
    //   };
    // };

    dbOpenRequest.onupgradeneeded = function (event) {
      var db = event.target.result;
      var objectStore = db.createObjectStore("ramp_transactions", { keyPath: "id", autoIncrement: true });
      objectStore.createIndex("isSync", "isSync", { unique: false });
    };
  });
}



export function syncFlightEditionNo() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
     
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction('flighteditionno', 'readwrite');
      const objectStore = transaction.objectStore('flighteditionno');

      const getRequest = objectStore.getAll();

      getRequest.onsuccess = (event) => {
        const results = event.target.result;
        console.log(results)
        var syncPromises = [];
        const results1=results.filter((item)=>{
          return item.isSync==false
        })

        if (results1 && results1.length > 0) {
          results1.forEach((result) => {
           
            syncPromises.push(addFlightEdition(result));
          });

          Promise.all(syncPromises).then((res) => {
            resolve(res);
          });
        } else {
          resolve();
        }
      };

      getRequest.onerror = (event) => {
        console.error('Error fetching data from IndexedDB:', event.target.error);
        reject(event.target.error);
      };
    };


    request.onerror = (event) => {
      console.error('Error opening IndexedDB:', event.target.error);
      reject(event.target.error);
    };
  });
}
export function syncNSLntDetail() {
  return new Promise((resolve, reject) => {
    var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

    request.onerror = function (event) {
      console.error("Database error: " + event.target.errorCode);
      reject("Failed to open the database");
    };

    request.onupgradeneeded = function (event) {
      var db = event.target.result;
      // Handle database upgrade if needed
    };

    request.onsuccess = function (event) {
      var db = event.target.result;

      var transaction = db.transaction(["nslntdetail"], "readwrite");
      var objectStore = transaction.objectStore("nslntdetail");

     
      var getRequest = objectStore.getAll();

      getRequest.onsuccess = function (event) {
        var sync_data = event.target.result
console.log('sdfghj',sync_data)
const filteredSyncData=sync_data.filter((item)=>{
  return item.isSync==false
})

        if (filteredSyncData.length > 0) {
          console.log(filteredSyncData.length)
          var promises = filteredSyncData.map((item) => updateLntDetail(item));

          Promise.all(promises)
            .then((res) => {
              console.log(res)
              syncSaltArchive();

              resolve(res);
            })
            .catch((error) => {
              console.error(error);
              reject(error);
            });
        } else {
          resolve();
        }
      };

      getRequest.onerror = function (event) {
        console.log("Error fetching records: " + event.target.errorCode);
        reject("Failed to fetch records from Ns_LnTDetail.");
      };

      transaction.oncomplete = function () {
        db.close();
      };
    };
  });
}

function nsFlightSchedule() {
  return new Promise((resolve, reject) => {
    var user = window.localStorage.getItem("auth_user");

    if (user == null || user == undefined) {
      reject("User not available");
      return;
    }

    user = JSON.parse(user);
    var current_date = moment().format("YYYY-MM-DD HH:mm:ss");

    fetchNSFlightSchedule({
      airport_code: user.airport_code,
      date: current_date,
    })
      .then((res) => {
        const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          const objectStore = db.createObjectStore('nsflightschedule', { keyPath: 'Id' });
          // You might want to create indexes for other fields if needed
          objectStore.createIndex('Flight_no', 'Flight_no', { unique: false });
          // Add other indexes as needed
        };

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction('nsflightschedule', 'readwrite');
          const objectStore = transaction.objectStore('nsflightschedule');

          const clearRequest = objectStore.clear();

          clearRequest.onsuccess = () => {
            const promises = res.data.data.map((item) => {
              return new Promise((resolve, reject) => {
                const addRequest = objectStore.add(item);
                addRequest.onsuccess = () => resolve();
                addRequest.onerror = (event) => reject(event.target.error);
              });
            });

            Promise.all(promises)
              .then(() => {
                resolve();
              })
              .catch((error) => {
                reject(error);
              });
          };

          clearRequest.onerror = (event) => {
            console.error('Error clearing NS_FlightSchedule:', event.target.error);
            reject(event.target.error);
          };
        };

        request.onerror = (event) => {
          console.error('Error opening IndexedDB:', event.target.error);
          reject(event.target.error);
        };
      })
      .catch((error) => {
        reject(error);
        console.log(error);
      });
  });
}

export function syncSaltArchive() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore('saltarchive', { keyPath: 'Id' });
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction('saltarchive', 'readwrite');
      const objectStore = transaction.objectStore('saltarchive');

      const getRequest = objectStore.getAll();

      getRequest.onsuccess = (event) => {
        const results = event.target.result;
console.log(results.length)
        if (results && results.length > 0) {
          results.forEach((item) => {
            updateSaltArchive(item);

            console.log(item.Id, " Delete saltArchive transaction res ", item);

            const deleteRequest = objectStore.delete(item.Id);
            deleteRequest.onsuccess = () => {
              console.log(" Delete saltArchive transaction success");
            };
            deleteRequest.onerror = (event) => {
              console.error("Error deleting from SALTArchive:", event.target.error);
            };
          });

          resolve();
        } else {
          resolve();
        }
      };

      getRequest.onerror = (event) => {
        console.error('Error fetching data from SALTArchive:', event.target.error);
        reject(event.target.error);
      };
    };

    request.onerror = (event) => {
      console.error('Error opening IndexedDB:', event.target.error);
      reject(event.target.error);
    };
  });
}


export function syncThrustArchive() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore('thrustarchive', { keyPath: 'id' });
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction('thrustarchive', 'readwrite');
      const objectStore = transaction.objectStore('thrustarchive');

      const getRequest = objectStore.getAll()

      getRequest.onsuccess = (event) => {
        const results = event.target.result
        
        const results1=results.filter((item)=>{
          return item.isSync== false
        })
        const syncPromises = [];
console.log('sdfghjj',results1.length)
        if (results1 && results1.length > 0) {
          results1.forEach((item) => {
            syncPromises.push(updateThrust(item));
          });

          Promise.all(syncPromises).then((res) => {
            resolve(res);
          });
        } else {
          resolve();
        }
      };

      getRequest.onerror = (event) => {
        console.error('Error fetching data from ThrustArchive:', event.target.error);
        reject(event.target.error);
      };
    };

    request.onerror = (event) => {
      console.error('Error opening IndexedDB:', event.target.error);
      reject(event.target.error);
    };
  });
}


function syncOfflineTrimSheet() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore('trimsheetlmcoffline', { keyPath: 'yourPrimaryKey' });
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction('trimsheetlmcoffline', 'readwrite');
      const objectStore = transaction.objectStore('trimsheetlmcoffline');

      const getRequest = objectStore.index('isSync').getAll('false');

      getRequest.onsuccess = (event) => {
        const results = event.target.result;

        if (results && results.length > 0) {
          const syncPromises = results.map((item) => {
            item.isOfflineGenerated = item.isOfflineGenerated === 'true';
            item.isSync = true;
            return item;
          });

          storeOfflineTrimSheet(syncPromises)
            .then(() => {
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          resolve();
        }
      };

      getRequest.onerror = (event) => {
        console.error('Error fetching data from TrimSheetLMCOffline:', event.target.error);
        reject(event.target.error);
      };
    };

    request.onerror = (event) => {
      console.error('Error opening IndexedDB:', event.target.error);
      reject(event.target.error);
    };
  });
}


function syncTrimSheetLMC() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
     
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction('trimsheetlmc', 'readwrite');
      const objectStore = transaction.objectStore('trimsheetlmc');

      const getRequest = objectStore.index('isSync').getAll('false');

      getRequest.onsuccess = (event) => {
        const results = event.target.result;

        if (results && results.length > 0) {
          const syncPromises = results.map((item) => {
            item.Flight_Date = moment(item.Flight_Date).format("YYYY-MM-DD HH:mm:ss");
            item.STD = moment(item.STD).format("YYYY-MM-DD HH:mm:ss");
            item.TrimSheetTime = moment(item.TrimSheetTime).format("YYYY-MM-DD HH:mm:ss");
            item.created_at = item.created_at ? moment(item.created_at).format("YYYY-MM-DD HH:mm:ss") : null;
            item.Thrust24K = parseInt(item.Thrust24K);
            item.Thrust26K = parseInt(item.Thrust26K);
            item.TransitPax = parseInt(item.TransitPax);
            item.Flap1 = parseInt(item.Flap1);
            item.Flap2 = parseInt(item.Flap2);
            item.Flap3 = parseInt(item.Flap3);
            item.Flap4 = parseInt(item.Flap4);
            item.Stab1 = parseInt(item.Stab1);
            item.Stab2 = parseInt(item.Stab2);
            item.Stab3 = parseInt(item.Stab3);
            item.Stab4 = parseInt(item.Stab4);
            item.isOfflineGenerated = item.isOfflineGenerated === "true";
            item.isSync = true;
            return item;
          });

          add(syncPromises)
            .then(() => {
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          resolve();
        }
      };

      getRequest.onerror = (event) => {
        console.error('Error fetching data from TrimSheetLMC:', event.target.error);
        reject(event.target.error);
      };
    };

    request.onerror = (event) => {
      console.error('Error opening IndexedDB:', event.target.error);
      reject(event.target.error);
    };
  });
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
  return new Promise((resolve, reject) => {
    fetch()
      .then((res) => {
        console.log("Fleet Data: ", res);
        const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          db.createObjectStore('fleetinfo', { keyPath: 'Id' });
        };

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction('fleetinfo', 'readwrite');
          const objectStore = transaction.objectStore('fleetinfo');

          const clearRequest = objectStore.clear();

          clearRequest.onsuccess = () => {
            const promises = res.data.data.map((item) => {
              return new Promise((resolve, reject) => {
                const addRequest = objectStore.add(item);
                addRequest.onsuccess = () => resolve();
                addRequest.onerror = (event) => reject(event.target.error);
              });
            });

            Promise.all(promises)
              .then(() => {
                resolve();
              })
              .catch((error) => {
                reject(error);
              });
          };

          clearRequest.onerror = (event) => {
            console.error('Error clearing FleetInfo:', event.target.error);
            reject(event.target.error);
          };
        };

        request.onerror = (event) => {
          console.error('Error opening IndexedDB:', event.target.error);
          reject(event.target.error);
        };
      })
      .catch((error) => {
        reject(error);
        console.log(error);
      });
  });
}

function LTAdjustWeight() {
  return new Promise((resolve, reject) => {
    fetchLTAdjust()
      .then((res) => {
        const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          db.createObjectStore('ltadjustweight', { keyPath: 'Id' });
        };

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction('ltadjustweight', 'readwrite');
          const objectStore = transaction.objectStore('ltadjustweight');

          const clearRequest = objectStore.clear();

          clearRequest.onsuccess = () => {
            const promises = res.data.data.map((item) => {
              return new Promise((resolve, reject) => {
                const addRequest = objectStore.add(item);
                addRequest.onsuccess = () => resolve();
                addRequest.onerror = (event) => reject(event.target.error);
              });
            });

            Promise.all(promises)
              .then(() => {
                resolve();
              })
              .catch((error) => {
                reject(error);
              });
          };

          clearRequest.onerror = (event) => {
            console.error('Error clearing LTAdjustWeight:', event.target.error);
            reject(event.target.error);
          };
        };

        request.onerror = (event) => {
          console.error('Error opening IndexedDB:', event.target.error);
          reject(event.target.error);
        };
      })
      .catch((error) => {
        reject(error);
        console.log(error);
      });
  });
}


function LTAdjustWeightV2() {
  return new Promise((resolve, reject) => {
    fetchLTAdjust()
      .then((res) => {
        const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          db.createObjectStore('ltadjustweightv2', { keyPath: 'Id' });
        };

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction('ltadjustweightv2', 'readwrite');
          const objectStore = transaction.objectStore('ltadjustweightv2');

          const clearRequest = objectStore.clear();

          clearRequest.onsuccess = () => {
            const promises = res.data.data.map((item) => {
              return new Promise((resolve, reject) => {
                const addRequest = objectStore.add(item);
                addRequest.onsuccess = () => resolve();
                addRequest.onerror = (event) => reject(event.target.error);
              });
            });

            Promise.all(promises)
              .then(() => {
                resolve();
              })
              .catch((error) => {
                reject(error);
              });
          };

          clearRequest.onerror = (event) => {
            console.error('Error clearing LTAdjustWeightV2:', event.target.error);
            reject(event.target.error);
          };
        };

        request.onerror = (event) => {
          console.error('Error opening IndexedDB:', event.target.error);
          reject(event.target.error);
        };
      })
      .then(() => resolve())
      .catch((error) => {
        reject(error);
        console.log(error);
      });
  });
}


function cgrefTable() {
  return new Promise((resolve, reject) => {
    fetchCgref()
      .then((res) => {
        var dataArry = [];
        var aircraftArray = Object.keys(res.data.data);

        aircraftArray.map((x) => {
          var weightValues = res.data.data[x];
          var weightAarry = Object.keys(res.data.data[x]);
          weightAarry.map((y) => {
            var weightObj = weightValues[y];
            var obj = {
              AcftType: x,
              Weight: y,
              Aft_Tow_Limit: weightObj.Aft_Tow_Limit,
              Aft_Zfw_Limit: weightObj.Aft_Zfw_Limit,
              Fwd_Tow_Limit: weightObj.Fwd_Tow_Limit,
              Fwd_Zfw_Limit: weightObj.Fwd_Zfw_Limit,
              Fwd_Zfw_Limit_Gt65317: weightObj.Fwd_Zfw_Limit_Gt65317,
            };
            dataArry.push(obj);
          });
        });

        const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          db.createObjectStore('cgreftable', { keyPath: ['AcftType', 'Weight'] });
        };

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction('cgreftable', 'readwrite');
          const objectStore = transaction.objectStore('cgreftable');

          const clearRequest = objectStore.clear();

          clearRequest.onsuccess = () => {
            const promises = dataArry.map((item) => {
              return new Promise((resolve, reject) => {
                const addRequest = objectStore.add(item);
                addRequest.onsuccess = () => resolve();
                addRequest.onerror = (event) => reject(event.target.error);
              });
            });

            Promise.all(promises)
              .then(() => {
                resolve();
              })
              .catch((error) => {
                reject(error);
              });
          };

          clearRequest.onerror = (event) => {
            console.error('Error clearing CGRefTable:', event.target.error);
            reject(event.target.error);
          };
        };

        request.onerror = (event) => {
          console.error('Error opening IndexedDB:', event.target.error);
          reject(event.target.error);
        };
      })
      .then(() => resolve())
      .catch((error) => {
        reject(error);
        console.log(error);
      });
  });
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

function fetchRegNoFileNameTable() {
  var defer = q.defer();
  fetchRegNoFileNameV2()
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
  return new Promise((resolve, reject) => {
    var user = window.localStorage.getItem("auth_user");
    if (user == null || user == undefined) {
      reject("User not authenticated");
      return;
    }
    user = JSON.parse(user);
    var current_date = moment().format("YYYY-MM-DD HH:mm:ss");

    fetchNsCheckIn({
      airport_code: user.airport_code,
      date: current_date,
    })
      .then((res) => {
        const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          db.createObjectStore('nscheckindetail', { keyPath: 'Id' });
        };

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction('nscheckindetail', 'readwrite');
          const objectStore = transaction.objectStore('nscheckindetail');

          const clearRequest = objectStore.clear();

          clearRequest.onsuccess = () => {
            const promises = res.data.data.map((item) => {
              return new Promise((resolve, reject) => {
                const addRequest = objectStore.add(item);
                addRequest.onsuccess = () => resolve();
                addRequest.onerror = (event) => reject(event.target.error);
              });
            });

            Promise.all(promises)
              .then(() => {
                resolve();
              })
              .catch((error) => {
                reject(error);
              });
          };

          clearRequest.onerror = (event) => {
            console.error('Error clearing Ns_CheckInDetail:', event.target.error);
            reject(event.target.error);
          };
        };

        request.onerror = (event) => {
          console.error('Error opening IndexedDB:', event.target.error);
          reject(event.target.error);
        };
      })
      .then(() => resolve())
      .catch((error) => {
        reject(error);
        console.log(error);
      });
  });
}


function nsLntDetail() {
  return new Promise((resolve, reject) => {
    var user = window.localStorage.getItem("auth_user");
    if (user == null || user == undefined) {
      reject("User not authenticated");
      return;
    }
    user = JSON.parse(user);
    var current_date = moment().format("YYYY-MM-DD HH:mm:ss");

    fetchNsLnt({
      airport_code: user.airport_code,
      date: current_date,
    })
      .then((res) => {
        const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          db.createObjectStore('nslntdetail', { keyPath: 'Id' });
        };

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction('nslntdetail', 'readwrite');
          const objectStore = transaction.objectStore('nslntdetail');

          const clearRequest = objectStore.clear();

          clearRequest.onsuccess = () => {
            const promises = res.data.data.map((item) => {
              return new Promise((resolve, reject) => {
                const addRequest = objectStore.add(item);
                addRequest.onsuccess = () => resolve();
                addRequest.onerror = (event) => reject(event.target.error);
              });
            });

            Promise.all(promises)
              .then(() => {
                resolve();
              })
              .catch((error) => {
                reject(error);
              });
          };

          clearRequest.onerror = (event) => {
            console.error('Error clearing Ns_LnTDetail:', event.target.error);
            reject(event.target.error);
          };
        };

        request.onerror = (event) => {
          console.error('Error opening IndexedDB:', event.target.error);
          reject(event.target.error);
        };
      })
      .then(() => resolve())
      .catch((error) => {
        reject(error);
        console.log(error);
      });
  });
}





function thrustArchive() {
  return new Promise((resolve, reject) => {
    var user = window.localStorage.getItem("auth_user");
    if (user == null || user == undefined) {
      reject("User not authenticated");
      return;
    }
    user = JSON.parse(user);
    var current_date = moment().format("YYYY-MM-DD HH:mm:ss");

    fetchThrust({
      airport_code: user.airport_code,
      date: current_date,
    })
      .then((res) => {
        const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          db.createObjectStore('thrustarchive', { keyPath: 'Id' });
        };

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction('thrustarchive', 'readwrite');
          const objectStore = transaction.objectStore('thrustarchive');

          const clearRequest = objectStore.clear();

          clearRequest.onsuccess = () => {
            const promises = res.data.data.map((item) => {
              return new Promise((resolve, reject) => {
                const addRequest = objectStore.add(item);
                addRequest.onsuccess = () => resolve();
                addRequest.onerror = (event) => reject(event.target.error);
              });
            });

            Promise.all(promises)
              .then(() => {
                resolve();
              })
              .catch((error) => {
                reject(error);
              });
          };

          clearRequest.onerror = (event) => {
            console.error('Error clearing ThrustArchive:', event.target.error);
            reject(event.target.error);
          };
        };

        request.onerror = (event) => {
          console.error('Error opening IndexedDB:', event.target.error);
          reject(event.target.error);
        };
      })
      .then(() => resolve())
      .catch((error) => {
        reject(error);
        console.log(error);
      });
  });
}


function flighteditionNo() {
  return new Promise((resolve, reject) => {
    var user = window.localStorage.getItem("auth_user");
    if (user == null || user == undefined) {
      reject("User not authenticated");
      return;
    }
    user = JSON.parse(user);
    var current_date = moment().format("YYYY-MM-DD HH:mm:ss");

    fetchEdition({
      airport_code: user.airport_code,
      date: current_date,
    })
      .then((res) => {
        const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          db.createObjectStore('flighteditionno', { keyPath: 'Id' });
        };

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction('flighteditionno', 'readwrite');
          const objectStore = transaction.objectStore('flighteditionno');

          const clearRequest = objectStore.clear();

          clearRequest.onsuccess = () => {
            const promises = res.data.data.map((item) => {
              return new Promise((resolve, reject) => {
                const addRequest = objectStore.add(item);
                addRequest.onsuccess = () => resolve();
                addRequest.onerror = (event) => reject(event.target.error);
              });
            });

            Promise.all(promises)
              .then(() => {
                resolve();
              })
              .catch((error) => {
                reject(error);
              });
          };

          clearRequest.onerror = (event) => {
            console.error('Error clearing FlightEditionNo:', event.target.error);
            reject(event.target.error);
          };
        };

        request.onerror = (event) => {
          console.error('Error opening IndexedDB:', event.target.error);
          reject(event.target.error);
        };
      })
      .then(() => resolve())
      .catch((error) => {
        reject(error);
        console.log(error);
      });
  });
}


function stabTrimThrust() {
  return new Promise((resolve, reject) => {
    fetchStabTrimThrust()
      .then((res) => {
        const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          db.createObjectStore('stabtrimthrust', { keyPath: 'Id' });
        };

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction('stabtrimthrust', 'readwrite');
          const objectStore = transaction.objectStore('stabtrimthrust');

          const clearRequest = objectStore.clear();

          clearRequest.onsuccess = () => {
            const promises = res.data.data.map((item) => {
              return new Promise((resolve, reject) => {
                const addRequest = objectStore.add(item);
                addRequest.onsuccess = () => resolve();
                addRequest.onerror = (event) => reject(event.target.error);
              });
            });

            Promise.all(promises)
              .then(() => {
                resolve();
              })
              .catch((error) => {
                reject(error);
              });
          };

          clearRequest.onerror = (event) => {
            console.error('Error clearing StabTrimThrust:', event.target.error);
            reject(event.target.error);
          };
        };

        request.onerror = (event) => {
          console.error('Error opening IndexedDB:', event.target.error);
          reject(event.target.error);
        };
      })
      .then(() => resolve())
      .catch((error) => {
        reject(error);
        console.log(error);
      });
  });
}


function stabTrimData() {
  return new Promise((resolve, reject) => {
    fetchData()
      .then((res) => {
        const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          db.createObjectStore('stabtrimdata', { keyPath: 'Id' });
        };

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction('stabtrimdata', 'readwrite');
          const objectStore = transaction.objectStore('stabtrimdata');

          const clearRequest = objectStore.clear();

          clearRequest.onsuccess = () => {
            const promises = res.data.data.map((item) => {
              return new Promise((resolve, reject) => {
                const addRequest = objectStore.add(item);
                addRequest.onsuccess = () => resolve();
                addRequest.onerror = (event) => reject(event.target.error);
              });
            });

            Promise.all(promises)
              .then(() => {
                resolve();
              })
              .catch((error) => {
                reject(error);
              });
          };

          clearRequest.onerror = (event) => {
            console.error('Error clearing StabTrimData:', event.target.error);
            reject(event.target.error);
          };
        };

        request.onerror = (event) => {
          console.error('Error opening IndexedDB:', event.target.error);
          reject(event.target.error);
        };
      })
      .then(() => resolve())
      .catch((error) => {
        reject(error);
        console.log(error);
      });
  });
}

function offlineTrimSheet() {
  return new Promise((resolve, reject) => {
    var current_date = moment().format("YYYY-MM-DD");

    fetchOfflineTrimSheet({ date: current_date })
      .then((res) => {
        var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

        request.onerror = function (event) {
          console.error("Error opening database:", event.target.error);
          reject(event.target.error);
        };

        request.onupgradeneeded = function (event) {
          var db = event.target.result;
          db.createObjectStore("trimsheetlmcoffline", { keyPath: "id" });
        };

        request.onsuccess = function (event) {
          var db = event.target.result;

          // Start a transaction
          var transaction = db.transaction(["trimsheetlmcoffline"], "readwrite");
          var objectStore = transaction.objectStore("trimsheetlmcoffline");

          // Clear the existing data
          objectStore.clear();

          // Function to store data
          function storeData(data) {
            return new Promise((resolve, reject) => {
              var addRequest = objectStore.add(data);

              addRequest.onsuccess = function () {
                resolve();
              };

              addRequest.onerror = function (event) {
                console.error("Error storing data:", event.target.error);
                reject(event.target.error);
              };
            });
          }

          // Use Promise.all to handle asynchronous storeData calls
          var promises = res.data.map(storeData);

          Promise.all(promises)
            .then(() => {
              resolve("Data stored successfully");
            })
            .catch((error) => {
              console.error("Error storing data:", error);
              reject(error);
            });
        };
      })
      .catch((error) => {
        console.error("Error fetching offline trim sheet:", error);
        reject(error);
      });
  });
}


function cGRefTableZFW() {
  return new Promise((resolve, reject) => {
    fetchCGRefTableZFW()
      .then((res) => {
        const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          db.createObjectStore('cgreftablezfw', { keyPath: 'Id' });
        };

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction('cgreftablezfw', 'readwrite');
          const objectStore = transaction.objectStore('cgreftablezfw');

          const clearRequest = objectStore.clear();

          clearRequest.onsuccess = () => {
            const promises = res.data.data.map((item) => {
              return new Promise((resolve, reject) => {
                const addRequest = objectStore.add(item);
                addRequest.onsuccess = () => resolve();
                addRequest.onerror = (event) => reject(event.target.error);
              });
            });

            Promise.all(promises)
              .then(() => {
                resolve();
              })
              .catch((error) => {
                reject(error);
              });
          };

          clearRequest.onerror = (event) => {
            console.error('Error clearing CGRefTableZFW:', event.target.error);
            reject(event.target.error);
          };
        };

        request.onerror = (event) => {
          console.error('Error opening IndexedDB:', event.target.error);
          reject(event.target.error);
        };
      })
      .then(() => resolve())
      .catch((error) => {
        reject(error);
        console.log(error);
      });
  });
}


function cGRefTableTOW() {
  return new Promise((resolve, reject) => {
    fetchCGRefTableTOW()
      .then((res) => {
        const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          db.createObjectStore('cgreftabletow', { keyPath: 'Id' });
        };

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction('cgreftabletow', 'readwrite');
          const objectStore = transaction.objectStore('cgreftabletow');

          const clearRequest = objectStore.clear();

          clearRequest.onsuccess = () => {
            const promises = res.data.data.map((item) => {
              return new Promise((resolve, reject) => {
                const addRequest = objectStore.add(item);
                addRequest.onsuccess = () => resolve();
                addRequest.onerror = (event) => reject(event.target.error);
              });
            });

            Promise.all(promises)
              .then(() => {
                resolve();
              })
              .catch((error) => {
                reject(error);
              });
          };

          clearRequest.onerror = (event) => {
            console.error('Error clearing CGRefTableTOW:', event.target.error);
            reject(event.target.error);
          };
        };

        request.onerror = (event) => {
          console.error('Error opening IndexedDB:', event.target.error);
          reject(event.target.error);
        };
      })
      .then(() => resolve())
      .catch((error) => {
        reject(error);
        console.log(error);
      });
  });
}

function cgLIMITSZFW() {
  return new Promise((resolve, reject) => {
    fetchCGLIMTISZFW()
      .then((res) => {
        const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          db.createObjectStore('cglimitszfw', { keyPath: 'Id' });
        };

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction('cglimitszfw', 'readwrite');
          const objectStore = transaction.objectStore('cglimitszfw');

          const clearRequest = objectStore.clear();

          clearRequest.onsuccess = () => {
            const promises = res.data.data.map((item) => {
              return new Promise((resolve, reject) => {
                const addRequest = objectStore.add(item);
                addRequest.onsuccess = () => resolve();
                addRequest.onerror = (event) => reject(event.target.error);
              });
            });

            Promise.all(promises)
              .then(() => {
                resolve();
              })
              .catch((error) => {
                reject(error);
              });
          };

          clearRequest.onerror = (event) => {
            console.error('Error clearing CGLIMITSZFW:', event.target.error);
            reject(event.target.error);
          };
        };

        request.onerror = (event) => {
          console.error('Error opening IndexedDB:', event.target.error);
          reject(event.target.error);
        };
      })
      .then(() => resolve())
      .catch((error) => {
        reject(error);
        console.log(error);
      });
  });
}


function cgLIMITSTOW() {
  return new Promise((resolve, reject) => {
    fetchCGLIMTISTOW()
      .then((res) => {
        const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          db.createObjectStore('cglimitstow', { keyPath: 'Id' });
        };

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction('cglimitstow', 'readwrite');
          const objectStore = transaction.objectStore('cglimitstow');

          const clearRequest = objectStore.clear();

          clearRequest.onsuccess = () => {
            const promises = res.data.data.map((item) => {
              return new Promise((resolve, reject) => {
                const addRequest = objectStore.add(item);
                addRequest.onsuccess = () => resolve();
                addRequest.onerror = (event) => reject(event.target.error);
              });
            });

            Promise.all(promises)
              .then(() => {
                resolve();
              })
              .catch((error) => {
                reject(error);
              });
          };

          clearRequest.onerror = (event) => {
            console.error('Error clearing CGLIMITSTOW:', event.target.error);
            reject(event.target.error);
          };
        };

        request.onerror = (event) => {
          console.error('Error opening IndexedDB:', event.target.error);
          reject(event.target.error);
        };
      })
      .then(() => resolve())
      .catch((error) => {
        reject(error);
        console.log(error);
      });
  });
}


export function syncThread() {
  console.log("syncingg start");

  var user = window.localStorage.getItem("auth_user");
  if (user == null || user == undefined) {
    return;
  }

  user = JSON.parse(user);

  return function (dispatch) {
    dispatch({ type: "RAMP_SYNC_STARTED" });

    syncTransaction()
      .then(() => syncOfflineTrimSheet())
      .then(() => syncTrimSheetLMC())
      .then(() => syncNSLntDetail())
      .then(() => syncFlightEditionNo())
      .then(() => syncThrustArchive())
      .then(() => {
        var current_date = moment().format("YYYY-MM-DD HH:mm:ss");
        return ramp.fetch({
          airport_code: user.airport_code,
          date: current_date,
        });
      })
      .then((ramp_record) => {
        console.log("111");
        const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          db.createObjectStore("fims_schedule", { keyPath: "id" });
          db.createObjectStore("trimsheetlmc", { keyPath: "ms_id" });
          // Add other object stores as needed
        };

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(
            ["fims_schedule", "trimsheetlmc"],
            "readwrite"
          );

          const fimsScheduleStore = transaction.objectStore("fims_schedule");
          const trimSheetLMCStore = transaction.objectStore("trimsheetlmc");

          const clearFimsScheduleRequest = fimsScheduleStore.clear();
          const clearTrimSheetLMCRequest = trimSheetLMCStore.clear();

          clearFimsScheduleRequest.onsuccess = () => {
            clearTrimSheetLMCRequest.onsuccess = () => {
              const promises = ramp_record.data.data.data.map((item) => {
                return new Promise((resolve, reject) => {
                  const addFimsScheduleRequest = fimsScheduleStore.add(item);

                  addFimsScheduleRequest.onsuccess = () => {
                    const trimSheetLMCItem = item.FimsTRIM[0];

                    if (trimSheetLMCItem) {
                      const addTrimSheetLMCRequest = trimSheetLMCStore.add(
                        trimSheetLMCItem
                      );

                      addTrimSheetLMCRequest.onsuccess = () => {
                        resolve();
                      };

                      addTrimSheetLMCRequest.onerror = (event) => {
                        reject(event.target.error);
                      };
                    } else {
                      resolve();
                    }
                  };

                  addFimsScheduleRequest.onerror = (event) => {
                    reject(event.target.error);
                  };
                });
              });

              Promise.all(promises)
                .then(() => {
                  cgrefTable(),
                  Fleetinfo(),
                  LTAdjustWeightV2(),
                  fuelTable(),
                  fuelV2Table(),
                  fetchRegNoFileNameTable(),
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
                  //  ,saltArchive()
                  nsFlightSchedule()
                })
                .catch((error) => {
                  console.error("Error synchronizing data:", error);
                  dispatch({ type: "RAMP_SYNC_COMPLETED" });
                });
            };
          };

          clearFimsScheduleRequest.onerror = (event) => {
            console.error("Error clearing fims_schedule:", event.target.error);
            dispatch({ type: "RAMP_SYNC_COMPLETED" });
          };
        };

        request.onerror = (event) => {
          console.error("Error opening IndexedDB:", event.target.error);
          dispatch({ type: "RAMP_SYNC_COMPLETED" });
        };
      })
      .then(() => {
        // Handle other data synchronization
        console.log("Other data synchronization complete");
        window.localStorage.setItem(
          "last_sync",
          moment().format("YYYY-MM-DD HH:mm:ss")
        );
        dispatch({ type: "RAMP_SYNC_COMPLETED" });
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
      });
  };
}


// export function deleteTables() {
//   var defer = q.defer();
//   // var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//   var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);
  
//   var tableNames = [
//     "fims_schedule",
//     "TrimSheetLMC",
//     "ramp_data",
//     "FleetInfo",
//     "LTAdjustWeight",
//     "LTAdjustWeightV2",
//     "CGRefTable",
//     "Ns_CheckInDetail",
//     "Ns_LnTDetail",
//     "ThrustArchive",
//     "LTAdjustWeightV2",
//     "TrimSheetLMCOffline",
//     "StabTrimThrust",
//     "StabTrimData",
//     "CGRefTableZFW",
//     "CGLIMITSZFW",
//     "CGRefTableTOW",
//     "CGLIMITSTOW",
//     "FlightEditionNo",
//   ];
//   function clearObjectStore(db, objectStoreName) {
//     var deferred = q.defer();
//     var transaction = db.transaction(objectStoreName, "readwrite");
//     var objectStore = transaction.objectStore(objectStoreName);
//     var request = objectStore.clear();
  
//     transaction.oncomplete = function () {
//       deferred.resolve();
//     };
  
//     request.onerror = function (event) {
//       console.error("Error clearing object store:", event.target.error);
//       deferred.reject(event.target.error);
//     };
  
//     return deferred.promise;
//   }
//   Promise.all(syncThread(),tableNames.map(tableName => clearObjectStore(db, tableName)))
//   .then(() => {
//     defer.resolve();
//   })
//   .catch((err) => {
//     defer.reject(err);
//   });
//   return defer.promise;
// }
export function deleteTables() {
  var defer = q.defer();
  var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

  var tableNames = [
    "fims_schedule",
    "TrimSheetLMC",
    "ramp_data",
    "FleetInfo",
    "LTAdjustWeight",
    "LTAdjustWeightV2",
    "CGRefTable",
    "Ns_CheckInDetail",
    "Ns_LnTDetail",
    "ThrustArchive",
    "LTAdjustWeightV2",
    "TrimSheetLMCOffline",
    "StabTrimThrust",
    "StabTrimData",
    "CGRefTableZFW",
    "CGLIMITSZFW",
    "CGRefTableTOW",
    "CGLIMITSTOW",
    "FlightEditionNo",
  ];

  request.onsuccess = function (event) {
    var db = event.target.result;
    var promises = [syncThread()];

    tableNames.forEach(function (tableName) {
      promises.push(clearObjectStore(db, tableName));
    });

    Promise.all(promises)
      .then(() => {
        db.close(); // Close the database connection when done
        defer.resolve();
      })
      .catch((err) => {
        db.close(); // Close the database connection in case of an error
        defer.reject(err);
      });
  };

  request.onerror = function (event) {
    console.error("Error opening IndexedDB:", event.target.error);
    defer.reject(event.target.error);
  };

  function clearObjectStore(db, objectStoreName) {
    var deferred = q.defer();
    var transaction = db.transaction(objectStoreName, "readwrite");
    var objectStore = transaction.objectStore(objectStoreName);
    var request = objectStore.clear();

    transaction.oncomplete = function () {
      deferred.resolve();
    };

    request.onerror = function (event) {
      console.error("Error clearing object store:", event.target.error);
      deferred.reject(event.target.error);
    };

    return deferred.promise;
  }

  return defer.promise;
}

