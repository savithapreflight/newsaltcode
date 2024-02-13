import * as Enviornment from "./environment";
import axios from "axios";
import * as q from "q";
import * as SQL from "./SQL";
import momentTZ from "moment-timezone";
import moment from "moment-timezone";
//Method to check device status
export function fetch(data) {
  var defer = q.defer();
  var host = Enviornment.host();
  var url = host + "/ramp/data/fetch";
  var DEBUG = Enviornment.debug();

  console.log("1fetch");
  console.log(data);
  axios
    .post(url, data)
    .then(function (response) {
      var response_data = response.data;
      console.log(response_data);
      console.log("1etch response", response_data);
      if (response.data !== undefined) {
        defer.resolve(response_data);
      } else {
        DEBUG && console.log("Error", response);
        defer.reject({ error: "Something went wrong!" });
      }
    })
    .catch(function (error) {
      console.error(error);

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

function openIndexedDB() {
  var deferred = q.defer();
  var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

  request.onsuccess = function (event) {
    var db = event.target.result;
    deferred.resolve(db);
  };

  request.onerror = function (event) {
    console.error("Error opening IndexedDB:", event.target.error);
    deferred.reject(event.target.error);
  };

  return deferred.promise;
}
//Method to add transaction into database
export function storeTransaction(data) {
  var defer = q.defer();
  var host = Enviornment.host();
  var url = host + "/ramp/transaction/add";
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

export function fetchOfflineTrimSheet(data) {
  var defer = q.defer();
  var host = Enviornment.host();
  var url = host + "/offline/trimsheet/fetch";
  var DEBUG = Enviornment.debug();

  axios
    .post(url, data)
    .then(function (response) {
      var response_data = response.data;
      console.log("OfflineTrimSheet data", response_data);
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

export function storeOfflineTrimSheet(data) {
  var defer = q.defer();
  var host = Enviornment.host();
  var url = host + "/offline/trimsheet/add";
  var DEBUG = Enviornment.debug();

  axios
    .post(url, { data: data })
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
export function storeRamp(id, type, time) {
  var defer = q.defer();
  var host = Enviornment.host();
  var url = host + "/ramp/data/add";
  var DEBUG = Enviornment.debug();

  axios
    .post(url, {
      fims_id: id,
      type: type,
      time: time,
    })
    .then(function (response) {
      var response_data = response.data;
      console.log("storeRamp data", response_data);
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

// export function fetchLocalUpcomming() {
//   return new Promise((resolve, reject) => {
//     const dbRequest = indexedDB.open(Enviornment.get("DB_NAME"),1)

//     dbRequest.onerror = (event) => {
//       reject(new Error("Failed to open the database."));
//     };

//     dbRequest.onsuccess = (event) => {
//       const db = event.target.result;
//       const transaction = db.transaction('fims_schedule','readwrite');
//       const fimsStore = transaction.objectStore('fims_schedule');
//       const fims = [];

//       const cursorRequest = fimsStore.openCursor();

//       cursorRequest.onsuccess = (event) => {
//         const cursor = event.target.result;

//         if (cursor) {
//           const fimsData = cursor.value;
//           fims.push(fimsData);
//           cursor.continue();
//         } else {

//           resolve(fims);
//         }
//       };

//       cursorRequest.onerror = (event) => {
//         reject(new Error("Failed to open cursor on 'fims_schedule' object store."));
//       };
//     };
//   });
// }

function openIndexedDB1() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      const fimsObjectStore = db.createObjectStore("fims_schedule", {
        keyPath: "id",
      });

      const checkInObjectStore = db.createObjectStore("nscheckindetail", {
        keyPath: "id",
      });
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(new Error("Failed to open IndexedDB"));
    };
  });
}

export function fetchLocalUpcomming() {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openIndexedDB1();
      const transaction = db.transaction(
        ["fims_schedule", "nscheckindetail"],
        "readonly"
      );
      const fimsObjectStore = transaction.objectStore("fims_schedule");
      const checkInObjectStore = transaction.objectStore("nscheckindetail");

      const fimsIndex = fimsObjectStore.index(
        "Flight_Date",
        "Flight_no",
        "Source",
        "Destination"
      );
      const checkInIndex = checkInObjectStore.index(
        "Flight_Date",
        "Flight_no",
        "source",
        "Destination"
      );

      const fimsDataPromise = new Promise((resolve, reject) => {
        const fimsRequest = fimsIndex.openCursor();
        const fims = [];

        fimsRequest.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            fims.push(cursor.value);
            cursor.continue();
          } else {
            resolve(fims);
          }
        };

        fimsRequest.onerror = () => {
          reject(
            new Error(
              "Failed to execute the query on fims_schedule in IndexedDB"
            )
          );
        };
      });

      const checkInDataPromise = new Promise((resolve, reject) => {
        const checkInRequest = checkInIndex.openCursor();
        const checkIns = [];

        checkInRequest.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            checkIns.push(cursor.value);
            cursor.continue();
          } else {
            resolve(checkIns);
          }
        };

        checkInRequest.onerror = () => {
          reject(
            new Error(
              "Failed to execute the query on Ns_CheckInDetail in IndexedDB"
            )
          );
        };
      });

      Promise.all([fimsDataPromise, checkInDataPromise])
        .then(([fimsData, checkInData]) => {
          console.log(fimsData);
          console.log(checkInData);
          const neededData = [];

          const result = fimsData.map((fimsItem) => {
            const matchingCheckIn = checkInData.filter((checkInItem) => {
              if (
                fimsItem.Flight_Date === checkInItem.Flight_Date &&
                fimsItem.Flight_no === checkInItem.Flight_no &&
                fimsItem.Source === checkInItem.source &&
                fimsItem.Destination === checkInItem.Destination
              ) {
                neededData.push({
                  id: fimsItem.id,
                  Regn_no: fimsItem.Regn_no,
                  Flight_no: fimsItem.Flight_no,
                  Flight_Date: fimsItem.Flight_Date,
                  Source: fimsItem.Source,
                  Destination: fimsItem.Destination,
                  STD: fimsItem.STD,
                  STA: fimsItem.STA,
                  OutofGate: checkInItem ? checkInItem.OutofGate : null,
                });
              }

              return neededData;
            });
          });

          console.log("length", neededData.length);
          resolve(neededData);
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
}

export function fetchLocalUpcoming() {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openIndexedDB1();
      const transaction = db.transaction(
        ["fims_schedule", "nscheckindetail"],
        "readonly"
      );
      const fimsObjectStore = transaction.objectStore("fims_schedule");
      const checkInObjectStore = transaction.objectStore("nscheckindetail");

      const fimsIndex = fimsObjectStore.index(
        "Flight_Date",
        "Flight_no",
        "Source",
        "Destination"
      );
      const checkInIndex = checkInObjectStore.index(
        "Flight_Date",
        "Flight_no",
        "source",
        "Destination"
      );

      const fimsDataPromise = new Promise((resolve, reject) => {
        const fimsRequest = fimsIndex.openCursor();
        const fims = [];

        fimsRequest.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            fims.push(cursor.value);
            cursor.continue();
          } else {
            resolve(fims);
          }
        };

        fimsRequest.onerror = () => {
          reject(
            new Error(
              "Failed to execute the query on fims_schedule in IndexedDB"
            )
          );
        };
      });

      const checkInDataPromise = new Promise((resolve, reject) => {
        const checkInRequest = checkInIndex.openCursor();
        const checkIns = [];

        checkInRequest.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            checkIns.push(cursor.value);
            cursor.continue();
          } else {
            resolve(checkIns);
          }
        };

        checkInRequest.onerror = () => {
          reject(
            new Error(
              "Failed to execute the query on Ns_CheckInDetail in IndexedDB"
            )
          );
        };
      });

      Promise.all([fimsDataPromise, checkInDataPromise])
        .then(([fimsData, checkInData]) => {
          console.log(fimsData);
          console.log(checkInData);
          const neededData = [];

          const result = fimsData.map((fimsItem) => {
            const matchingCheckIn = checkInData.find((checkInItem) => {
              return (
                fimsItem.Flight_Date === checkInItem.Flight_Date &&
                fimsItem.Flight_no === checkInItem.Flight_no &&
                fimsItem.Source === checkInItem.source &&
                fimsItem.Destination === checkInItem.Destination
              )
            });
console.log(matchingCheckIn)
            neededData.push({
              id: fimsItem.id,
              Regn_no: fimsItem.Regn_no,
              Flight_no: fimsItem.Flight_no,
              Flight_Date: fimsItem.Flight_Date,
              Source: fimsItem.Source,
              Destination: fimsItem.Destination,
              STD: fimsItem.STD,
              STA: fimsItem.STA,
              OutofGate: matchingCheckIn ? matchingCheckIn.OutofGate : null,
            });

            return neededData;
          });

          console.log("length", neededData.length);
          resolve(neededData);
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
}

export function fetchLocalOfflineTrimSheets(
  flight_no,
  flight_date,
  source,
  destination
) {
  const defer = q.defer();
  console.log(flight_no);
  console.log(flight_date);
  console.log(source);
  console.log(destination);

  const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);
  let db;

  request.onsuccess = (event) => {
    db = event.target.result;

    const transaction = db.transaction("trimsheetlmcoffline", "readonly");
    const objectStore = transaction.objectStore("trimsheetlmcoffline");

    const index = objectStore.index("FlightDate,Source,Destination");
    const keyRange = IDBKeyRange.only([
      flight_no,
      flight_date,
      source,
      destination,
    ]);

    const getRequest = index.openCursor(keyRange);

    getRequest.onsuccess = (event) => {
      const cursor = event.target.result;
      const fims = [];

      if (cursor) {
        fims.push(cursor.value);
        cursor.continue();
      } else {
        defer.resolve(fims);
      }
    };

    getRequest.onerror = (event) => {
      console.log(event.error);
      defer.reject(new Error("Failed to fetch TrimSheetLMCOffline."));
    };
  };

  request.onerror = (event) => {
    console.log(event.error);
    defer.reject(new Error("Failed to open the database."));
  };

  return defer.promise;
}

export function fetchOfflineTrimSheets() {
  const defer = q.defer();

  const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);
  let db;

  request.onsuccess = (event) => {
    db = event.target.result;

    const transaction = db.transaction("trimsheetlmcoffline", "readonly");
    const objectStore = transaction.objectStore("trimsheetlmcoffline");

    const getRequest = objectStore.openCursor();

    const fims = [];

    getRequest.onsuccess = (event) => {
      const cursor = event.target.result;

      if (cursor) {
        fims.push(cursor.value);
        cursor.continue();
      } else {
        defer.resolve(fims);
      }
    };

    getRequest.onerror = (event) => {
      console.log(event.error);
      defer.reject(new Error("Failed to fetch TrimSheetLMCOffline."));
    };
  };

  request.onerror = (event) => {
    console.log(event.error);
    defer.reject(new Error("Failed to open the database."));
  };

  return defer.promise;
}

export function DeleteFimsScheduleByFlightNoDate(Flight_no, Flight_Date) {
  const defer = q.defer();

  const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);
  let db;

  request.onsuccess = (event) => {
    db = event.target.result;

    const transaction = db.transaction("fims_schedule", "readwrite");
    const objectStore = transaction.objectStore("fims_schedule");

    const index = objectStore.index("flightdate");
    const keyRange = IDBKeyRange.only([Flight_no, Flight_Date]);

    const getRequest = index.openCursor(keyRange);

    getRequest.onsuccess = (event) => {
      const cursor = event.target.result;

      if (cursor) {
        const deleteRequest = cursor.delete();

        deleteRequest.onsuccess = () => {
          defer.resolve();
        };

        deleteRequest.onerror = (deleteEvent) => {
          console.log(deleteEvent.error);
          defer.reject(new Error("Failed to delete from fims_schedule."));
        };
      } else {
        defer.resolve(); // No matching records found
      }
    };

    getRequest.onerror = (event) => {
      console.log(event.error);
      defer.reject(new Error("Failed to find the fims_schedule."));
    };
  };

  request.onerror = (event) => {
    console.log(event.error);
    defer.reject(new Error("Failed to open the database."));
  };

  return defer.promise;
}

export function UpdateFimsScheduleByFlightNoDate(Flight_no, Flight_Date, data) {
  const defer = q.defer();

  const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);
  let db;

  request.onsuccess = (event) => {
    db = event.target.result;

    const transaction = db.transaction("fims_schedule", "readwrite");
    const objectStore = transaction.objectStore("fims_schedule");

    const index = objectStore.index("FlightNoDate");
    const keyRange = IDBKeyRange.only([Flight_no, Flight_Date]);

    const getRequest = index.openCursor(keyRange);

    getRequest.onsuccess = (event) => {
      const cursor = event.target.result;

      if (cursor) {
        const updatedData = {
          ...cursor.value,
          STD: data.STD,
          STA: data.STA,
          ETD: data.ETD,
          ETA: data.ETA,
          BAYNO: data.BAYNO,
        };

        const updateRequest = cursor.update(updatedData);

        updateRequest.onsuccess = () => {
          defer.resolve();
        };

        updateRequest.onerror = (updateEvent) => {
          console.log(updateEvent.error);
          defer.reject(new Error("Failed to update FimsSchedule."));
        };
      } else {
        defer.reject(new Error("Record not found"));
      }
    };

    getRequest.onerror = (event) => {
      console.log(event.error);
      defer.reject(new Error("Failed to find the FimsSchedule."));
    };
  };

  request.onerror = (event) => {
    console.log(event.error);
    defer.reject(new Error("Failed to open the database."));
  };

  return defer.promise;
}

export function fetchFimsById(ids) {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open(Enviornment.get("DB_NAME"), 1);

    dbRequest.onerror = (event) => {
      reject(new Error("Failed to open the database."));
    };

    dbRequest.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("fims_schedule", "readonly");
      const fimsStore = transaction.objectStore("fims_schedule");
      const fims = [];

      // Loop through each ID and fetch the corresponding record
      ids.forEach((id) => {
        const getRequest = fimsStore.get(id);

        getRequest.onsuccess = (event) => {
          const fimsData = event.target.result;

          if (fimsData) {
            fims.push(fimsData);
          }
        };

        getRequest.onerror = (event) => {
          reject(new Error(`Failed to fetch record with ID ${id}.`));
        };
      });

      transaction.oncomplete = (event) => {
        resolve(fims);
      };

      transaction.onerror = (event) => {
        reject(new Error("Failed to complete the transaction."));
      };
    };
  });
}

export function fetchRampDataById(id) {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open(Enviornment.get("DB_NAME"), 1);

    dbRequest.onerror = (event) => {
      console.log(event);
      reject(new Error("Failed to open the database."));
    };
    console.log(id);
    dbRequest.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("rampdata", "readonly");
      const rampDataStore = transaction.objectStore("rampdata");

      const getRequest = rampDataStore.index("fims_id").get(id);

      getRequest.onsuccess = (event) => {
        const rampData = event.target.result;

        if (rampData) {
          console.log(rampData);
          resolve(rampData);
        } else {
          console.log("Failed to");
          reject(new Error("Failed to find the Ramp Data."));
        }
      };

      getRequest.onerror = (event) => {
        console.log("Failed to fetch Ramp Data.");
        reject(new Error("Failed to fetch Ramp Data."));
      };

      transaction.onerror = (event) => {
        console.log("Failed to fetch");
        reject(new Error("Failed to complete the transaction."));
      };
    };
  });
}
export function fetchFimsDataByFlightNo(Flight_no) {
  return new Promise((resolve, reject) => {
    // Open IndexedDB
    const openRequest = indexedDB.open(Enviornment.get("DB_NAME"), 1);

    openRequest.onsuccess = function (event) {
      const db = event.target.result;

      const transaction = db.transaction("fims_schedule", "readonly");
      const objectStore = transaction.objectStore("fims_schedule");

      // if (!objectStore.indexNames.contains('Flight_no')) {
      //   objectStore.createIndex('Flight_no','Flight_no', { unique: false });
      // }

      const index = objectStore.index("Flight_no");
      const request = index.get(Flight_no);

      request.onsuccess = function (event) {
        const data = event.target.result;
        if (data) {
          resolve(data);
        } else {
          reject(new Error("Failed to find the fims schedule."));
        }
      };

      // Handle errors
      transaction.onerror = function (event) {
        console.error("Error in transaction:", event.target.error);
        reject(new Error("Failed to find the fims schedule."));
      };
    };

    openRequest.onerror = function (event) {
      console.error("Error opening database:", event.target.error);
      reject(new Error("Failed to open the database."));
    };
  });
}

export function fetchFimsDataByFlightNoDate(Flight_no, Flight_Date) {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(Enviornment.get("DB_NAME"), 1);

    openRequest.onsuccess = function (event) {
      const db = event.target.result;

      const transaction = db.transaction("fims_schedule", "readonly");
      const objectStore = transaction.objectStore("fims_schedule");

      const index = objectStore.index("Flight_no");

      // Use IDBKeyRange to create a range for Flight_no and Flight_Date
      const range = IDBKeyRange.bound(
        [Flight_no, Flight_Date],
        [Flight_no, Flight_Date]
      );
      const request = index.openCursor(range);

      request.onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
          const data = cursor.value;
          resolve(data);
        } else {
          reject(new Error("Failed to find the fims schedule."));
        }
      };

      transaction.onerror = function (event) {
        console.error("Error in transaction:", event.target.error);
        reject(new Error("Failed to find the fims schedule."));
      };
    };

    openRequest.onerror = function (event) {
      console.error("Error opening database:", event.target.error);
      reject(new Error("Failed to open the database."));
    };
  });
}

export function fetchLTAdjustWeightByAcftType(AcftType) {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(Enviornment.get("DB_NAME"), 1);

    openRequest.onsuccess = function (event) {
      const db = event.target.result;

      const transaction = db.transaction("LTAdjustWeight", "readonly");
      const objectStore = transaction.objectStore("LTAdjustWeight");

      const index = objectStore.index("AcftType");
      const request = index.get(AcftType);

      request.onsuccess = function (event) {
        const data = event.target.result;
        if (data) {
          resolve(data);
        } else {
          reject("Failed to find the LTAdjustWeight.");
        }
      };

      transaction.onerror = function (event) {
        console.error("Error in transaction:", event.target.error);
        reject("Failed to find the LTAdjustWeight.");
      };
    };

    openRequest.onerror = function (event) {
      console.error("Error opening database:", event.target.error);
      reject("Failed to open the database.");
    };
  });
}

export function fetchFleetinfoByRegnNo(AC_REGN) {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(Enviornment.get("DB_NAME"), 1);

    openRequest.onsuccess = function (event) {
      const db = event.target.result;

      const transaction = db.transaction("fleetinfo", "readonly");
      const objectStore = transaction.objectStore("fleetinfo");

      const index = objectStore.index("AC_REGN");
      const request = index.get(AC_REGN);

      request.onsuccess = function (event) {
        const data = event.target.result;
        if (data) {
          resolve(data);
        } else {
          reject("Failed to find the FleetInfo.");
        }
      };

      transaction.onerror = function (event) {
        console.error("Error in transaction:", event.target.error);
        reject("Failed to find the FleetInfo.");
      };
    };

    openRequest.onerror = function (event) {
      console.error("Error opening database:", event.target.error);
      reject("Failed to open the database.");
    };
  });
}

export function fetchAcTypeInFleetInfo() {
  return new Promise((resolve, reject) => {
    // Open IndexedDB
    const openRequest = indexedDB.open(Enviornment.get("DB_NAME"), 1);

    openRequest.onsuccess = function (event) {
      const db = event.target.result;

      // Start a readonly transaction on the 'FleetInfo' object store
      const transaction = db.transaction("fleetinfo", "readonly");
      const objectStore = transaction.objectStore("fleetinfo");

      // Open a cursor to iterate over all records and collect unique AC_TYPE values
      const cursorRequest = objectStore.openCursor();
      const uniqueAC_TYPES = [];

      cursorRequest.onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
          const AC_TYPE = cursor.value.AC_TYPE;

          if (!uniqueAC_TYPES.includes(AC_TYPE)) {
            uniqueAC_TYPES.push(AC_TYPE);
          }

          cursor.continue();
        } else {
          // All records processed, resolve with unique AC_TYPE values
          resolve(uniqueAC_TYPES);
        }
      };

      // Handle errors
      transaction.onerror = function (event) {
        console.error("Error in transaction:", event.target.error);
        reject(new Error("Failed to find the FleetInfo."));
      };
    };

    openRequest.onerror = function (event) {
      console.error("Error opening database:", event.target.error);
      reject(new Error("Failed to open the database."));
    };
  });
}

export function fetchACRegInFleetInfo() {
  var defer = q.defer();

  openIndexedDB().then(function (db) {
    var transaction = db.transaction("fleetinfo");
    var objectStore = transaction.objectStore("fleetinfo");
    var request = objectStore.getAll();

    request.onsuccess = function (event) {
      var results = event.target.result;
      var dummy = [];

      if (results && results.length > 0) {
        results.forEach(function (item) {
          if (dummy.indexOf(item) == -1) {
            dummy.push(item);
          }
        });

        dummy = dummy.filter(
          (thing, index, self) =>
            index === self.findIndex((t) => t.AC_REGN === thing.AC_REGN)
        );

        defer.resolve(dummy);
      } else {
        defer.reject(new Error("Failed to find the FleetInfo."));
      }
    };

    request.onerror = function (event) {
      console.error(
        "Error fetching AC_REGN from FleetInfo:",
        event.target.error
      );
      defer.reject(new Error("Failed to find the FleetInfo."));
    };
  });

  return defer.promise;
}
export function fetchOfflineTrimSheetforFlight(data) {
  const defer = q.defer();

  const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);
  let db;

  request.onsuccess = (event) => {
    db = event.target.result;

    const transaction = db.transaction("trimsheetlmcoffline", "readonly");
    const objectStore = transaction.objectStore("trimsheetlmcoffline");

    const index = objectStore.index(
      "FlightNo",
      "Source",
      "RegNo",
      "Destination"
    );
    const keyRange = IDBKeyRange.only([
      data.flight_no,
      data.source,
      data.regno,
      data.destination,
    ]);

    const getRequest = index.openCursor(keyRange);

    getRequest.onsuccess = (event) => {
      const cursor = event.target.result;

      if (cursor) {
        cursor.continue();
      } else {
        if (cursor) {
          defer.resolve(cursor.value);
        } else {
          defer.resolve(null);
        }
      }
    };

    getRequest.onerror = (event) => {
      console.log(event.error);
      defer.reject(new Error("Failed to fetch TrimSheetLMCOffline."));
    };
  };

  request.onerror = (event) => {
    console.log(event.error);
    defer.reject(new Error("Failed to open the database."));
  };

  return defer.promise;
}

export function fetchTrimSheetforFlight(flight_no) {
  const defer = q.defer();

  const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);
  let db;

  request.onsuccess = (event) => {
    db = event.target.result;

    const transaction = db.transaction("trimsheetlmc", "readonly");
    const objectStore = transaction.objectStore("trimsheetlmc");

    const index = objectStore.index("FlightNo");
    const keyRange = IDBKeyRange.only(flight_no);

    const getRequest = index.openCursor(keyRange);

    getRequest.onsuccess = (event) => {
      const cursor = event.target.result;

      if (cursor) {
        cursor.continue();
      } else {
        if (cursor) {
          defer.resolve(cursor.value);
        } else {
          defer.resolve(null);
        }
      }
    };

    getRequest.onerror = (event) => {
      console.log(event.error);
      defer.reject(new Error("Failed to fetch TrimSheetLMC."));
    };
  };

  request.onerror = (event) => {
    console.log(event.error);
    defer.reject(new Error("Failed to open the database."));
  };

  return defer.promise;
}

export function addTransaction(data) {
  const defer = q.defer();
  const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);
  let db;

  request.onsuccess = (event) => {
    db = event.target.result;

    const transaction = db.transaction("ramp_transactions", "readwrite");
    const objectStore = transaction.objectStore("ramp_transactions");

    const addRequest = objectStore.add(data);

    addRequest.onsuccess = (event) => {
      const update_time = momentTZ.utc().format("YYYY-MM-DD HH:mm:ss");
      if (data.createdAt !== undefined) {
        update_time = momentTZ(data.createdAt)
          .utc()
          .format("YYYY-MM-DD HH:mm:ss");
      }

      updateRampData(
        data.fims_id,
        data.transaction_type,
        data.time,
        update_time
      ).then(() => {
        defer.resolve();
      });
    };

    addRequest.onerror = (event) => {
      console.log(event.error);
      defer.reject(new Error("Failed to add the Transactions."));
    };
  };

  request.onerror = (event) => {
    console.log(event.error);
    defer.reject(new Error("Failed to open the database."));
  };

  return defer.promise;
}

export function addTrimSheetLMCOffline(item) {
  const defer = q.defer();
  const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);
  let db;

  request.onsuccess = (event) => {
    db = event.target.result;

    const transaction = db.transaction("trimsheetlmcoffline", "readwrite");
    const objectStore = transaction.objectStore("trimsheetlmcoffline");

    const addRequest = objectStore.add(item);

    addRequest.onsuccess = (event) => {
      console.log("111111");
      console.log(event.result);
      defer.resolve(event.result);
    };

    addRequest.onerror = (event) => {
      console.log(event.error);
      defer.reject(new Error("Failed to add the Offline Trim Sheet."));
    };
  };

  request.onerror = (event) => {
    console.log(event.error);
    defer.reject(new Error("Failed to open the database."));
  };

  return defer.promise;
}

export function addTrimSheetLMC(item) {
  const defer = q.defer();
  const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);
  let db;

  request.onsuccess = (event) => {
    db = event.target.result;

    const transaction = db.transaction("trimsheetlmc", "readwrite");
    const objectStore = transaction.objectStore("trimsheetlmc");

    const addRequest = objectStore.add({
      ms_id: item.ms_id,
      FlightNo: item.FlightNo,
      Flight_Date: item.Flight_Date,
      Acft_Type: item.Acft_Type,
      STD: item.STD,
      TrimSheetTime: item.TrimSheetTime,
      Source: item.Source,
      Destination: item.Destination,
      Regn_no: item.Regn_no,
      Crew: item.Crew,
      ZFW: item.ZFW,
      MZFW: item.MZFW,
      TOF: item.TOF,
      TOW: item.TOW,
      MTOW: item.MTOW,
      TripFuel: item.TripFuel,
      LAW: item.LAW,
      MLAW: item.MLAW,
      underLoad: item.underLoad,
      LIZFW: item.LIZFW,
      LITOW: item.LITOW,
      LILAW: item.LILAW,
      ZFWMAC: item.ZFWMAC,
      MAC: item.MAC,
      TOWMAC: item.TOWMAC,
      LAWMAC: item.LAWMAC,
      Thrust24K: item.Thrust24K,
      Flap1: item.Flap1,
      Stab1: item.Stab1,
      Flap2: item.Flap2,
      Stab2: item.Stab2,
      Thrust26K: item.Thrust26K,
      Flap3: item.Flap3,
      Stab3: item.Stab3,
      Flap4: item.Flap4,
      Stab4: item.Stab4,
      cmpt1: item.cmpt1,
      cmpt2: item.cmpt2,
      cmpt3: item.cmpt3,
      cmpt4: item.cmpt4,
      Adult: item.Adult,
      Child: item.Child,
      Infant: item.Infant,
      Tpax: item.Tpax,
      SOB: item.SOB,
      TransitPax: item.TransitPax,
      SI: item.SI,
      LoadOfficer: item.LoadOfficer,
      Captain: item.Captain,
      PreparedBy: item.PreparedBy,
      Z1a: item.Z1a,
      Z1c: item.Z1c,
      Z1i: item.Z1i,
      Z2a: item.Z2a,
      Z2c: item.Z2c,
      Z2i: item.Z2i,
      Z3a: item.Z3a,
      Z3c: item.Z3c,
      Z3i: item.Z3i,
      active: item.active,
      isSync: item.isSync,
      isOfflineGenerated: item.isOfflineGenerated,
      created_at: new Date(),
    });

    addRequest.onsuccess = (event) => {
      console.log("111111");
      console.log(event.result);
      defer.resolve(event.result);
    };

    addRequest.onerror = (event) => {
      console.log(event.error);
      defer.reject(new Error("Failed to add the TrimSheetLMC."));
    };
  };

  request.onerror = (event) => {
    console.log(event.error);
    defer.reject(new Error("Failed to open the database."));
  };

  return defer.promise;
}

var fims_mapping = {
  cargo_close: "cargo_close",
  cargo_open: "cargo_open",
  catering_end: "catering_end",
  catering_start: "catering_start",
  crew: "crew",
  door_close: "door_close",
  door_open: "door_open",
  fuel_end: "fuel_end",
  fuel_start: "fuel_start",
  in_time: "in_time",
  lnt: "lnt",
  out: "out",
  security_end: "security_end",
  security_start: "security_start",
  service_end: "service_end",
  service_start: "service_start",
  tech_clear: "tech_clear",
};

export function updateRampData(id, type, time, update_time) {
  return new Promise((resolve, reject) => {
    if (update_time === undefined) {
      update_time = momentTZ.utc().format("YYYY-MM-DD HH:mm:ss");
    }

    const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      const objectStore = db.createObjectStore("rampdata", {
        keyPath: "fims_id",
      });

      // Add indexes for other fields as needed
      objectStore.createIndex("in_time", "in_time", { unique: false });
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(["rampdata"], "readwrite");
      const objectStore = transaction.objectStore("rampdata");

      const getRequest = objectStore.get(id);

      getRequest.onsuccess = function (event) {
        const data = event.target.result || {
          fims_id: id,
          in_time: null,
          door_open: null,
          cargo_open: null,
          crew: null,
          fuel_start: null,
          fuel_end: null,
          tech_clear: null,
          cargo_close: null,
          lnt: null,
          door_close: null,
          catering_start: null,
          catering_end: null,
          security_start: null,
          security_end: null,
          service_start: null,
          service_end: null,
          out: null,
          in_time_update: null,
          door_open_update: null,
          cargo_open_update: null,
          crew_update: null,
          fuel_start_update: null,
          fuel_end_update: null,
          tech_clear_update: null,
          cargo_close_update: null,
          lnt_update: null,
          door_close_update: null,
          catering_start_update: null,
          catering_end_update: null,
          security_start_update: null,
          security_end_update: null,
          service_start_update: null,
          service_end_update: null,
          out_update: null,
        };

        if (type === "in") {
          data.in_time = time;
          data.in_time_update = update_time;
        } else if (type === "door_open") {
          data.door_open = time;
          data.door_open_update = update_time;
        } else if (type === "cargo_open") {
          cargo_open = time;
          cargo_open_update = update_time;
        } else if (type === "crew") {
          crew = time;
          crew_update = update_time;
        } else if (type === "fuel_start") {
          fuel_start = time;
          fuel_start_update = update_time;
        } else if (type === "fuel_end") {
          fuel_end = time;
          fuel_end_update = update_time;
        } else if (type === "tech_clear") {
          tech_clear = time;
          tech_clear_update = update_time;
        } else if (type === "cargo_close") {
          cargo_close = time;
          cargo_close_update = update_time;
        } else if (type === "lnt") {
          lnt = time;
          lnt_update = update_time;
        } else if (type === "door_close") {
          door_close = time;
          door_close_update = update_time;
        } else if (type === "catering_start") {
          catering_start = time;
          catering_start_update = update_time;
        } else if (type === "catering_end") {
          catering_end = time;
          catering_end_update = update_time;
        } else if (type === "security_start") {
          security_start = time;
          security_end_update = update_time;
        } else if (type === "security_end") {
          security_end = time;
          security_end_update = update_time;
        } else if (type === "service_start") {
          service_start = time;
          service_start_update = update_time;
        } else if (type === "service_end") {
          service_end = time;
          security_end_update = update_time;
        } else if (type === "out") {
          out = time;
          out_update = update_time;
        }

        const putRequest = objectStore.add(data);

        putRequest.onsuccess = function () {
          resolve();
        };

        putRequest.onerror = function (error) {
          reject(new Error("Failed to update ramp data.", error));
        };
      };

      getRequest.onerror = function (error) {
        reject(new Error("Failed to fetch ramp data.", error));
      };
    };

    request.onerror = function (error) {
      reject(new Error("Failed to open the database.", error));
    };
  });
}

export function fetchTrimSheetforFlight1(flight_no) {
  const defer = q.defer();

  const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);
  let db;

  request.onsuccess = (event) => {
    db = event.target.result;

    const transaction = db.transaction("trimsheetlmc", "readonly");
    const objectStore = transaction.objectStore("trimsheetlmc");

    const index = objectStore.index("FlightNo");
    const keyRange = IDBKeyRange.only(flight_no);

    const getRequest = index.openCursor(keyRange);

    getRequest.onsuccess = (event) => {
      const cursor = event.target.result;

      if (cursor) {
        cursor.continue();
      } else {
        if (cursor) {
          defer.resolve(cursor.value);
        } else {
          defer.resolve(null);
        }
      }
    };

    getRequest.onerror = (event) => {
      console.log(event.error);
      defer.reject(new Error("Failed to fetch TrimSheetLMC."));
    };
  };

  request.onerror = (event) => {
    console.log(event.error);
    defer.reject(new Error("Failed to open the database."));
  };

  return defer.promise;
}

export function fetchUpdatedTransactions(data) {
  var defer = q.defer();
  var host = Enviornment.host();
  var url = host + "/fetch/updated/transactions";
  var DEBUG = Enviornment.debug();

  console.log("fetchUpdatedTransactions");

  axios
    .post(url, data)
    .then(function (response) {
      var response_data = response.data;
      console.log("etchUpdatedTransactions response", response_data);
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

export function checkLmcStatus(data) {
  var defer = q.defer();
  var host = Enviornment.host();
  var url = host + "/ramp/lmc/status";
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
