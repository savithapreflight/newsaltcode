import * as Enviornment from "./environment";
import axios from "axios";
import get from "lodash/get";
import * as q from "q";
import * as SQL from "./SQL";
var host = Enviornment.host();
export const getLoadTypes = () => (dispatch) => {
  const url = `${host}/loadTypes`;
  axios
    .get(url)
    .then((res) => {
      dispatch({
        type: "LOAD_TYPE",
        payload: get(res, "data.data.data", []),
      });
    })
    .catch((e) => {
      console.log({ e });
    });
};
export const getSector = (payload) => (dispatch) => {
  var defer = q.defer();
  const dbName = Enviornment.get("DB_NAME");
  const request = indexedDB.open(dbName,1);

  request.onerror = function (event) {
    console.error('Error opening database:', event.target.error);
    // Handle error opening the database
    defer.reject(event.target.error);
  };

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction('nsflightschedule','readonly');
    const objectStore = transaction.objectStore('nsflightschedule');

    const index = objectStore.index("Flight_Date","Flight_no","Source","Destination");
    const keyRange = IDBKeyRange.only([
      payload.Flight_Date,
      payload.Flight_no,
      payload.Source,
      payload.Destination
    ]);

    const getRequest = index.openCursor(keyRange);

    getRequest.onsuccess = function (event) {
      const cursor = event.target.result;

      if (cursor) {
        const sync_data = [cursor.value];
        let finalSql;
        const indexToUse = sync_data[0].IsSchedule ?'Flight_no':'Acft_Regn';

        const secondTransaction = db.transaction('nsflightschedule','readonly');
        const secondObjectStore = secondTransaction.objectStore('nsflightschedule');
        const secondIndex = secondObjectStore.index(indexToUse);

        const keyRange = IDBKeyRange.only(sync_data[0][indexToUse]);
        const range = IDBKeyRange.lowerBound(payload.STD);

        const getRequest = secondIndex.openCursor(keyRange, 'next');
        const res_data = [];

        getRequest.onsuccess = function (event) {
          const cursor = event.target.result;
          if (cursor) {
            if (!cursor.value.std || cursor.value.std >= payload.STD) {
              res_data.push({ destination: cursor.value.Destination });
            }
            cursor.continue();
          } else {
            // All records processed, dispatch the action
            dispatch({
              type: "SECTOR_TYPE",
              payload: res_data,
            });
          }
        };

        getRequest.onerror = function (event) {
          console.error('Error in second transaction:', event.target.error);
          defer.reject(event.target.error);
        };
      } else {
        // No matching data found
        defer.resolve();
      }
    };

    getRequest.onerror = function (event) {
      console.error('Error in first transaction:', event.target.error);
      // Handle error retrieving data
      defer.reject(event.target.error);
    };
  };
};






// export const getSector = (payload) => (dispatch) => {
//   var defer = q.defer();

//   var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
//   var sqlStm =
//     "select * from NS_FlightSchedule where Flight_Date = '" +
//     payload.Flight_Date +
//     "' and Flight_no= '" +
//     payload.Flight_no +
//     "' and Source= '" +
//     payload.Source +
//     "' and Destination = '" +
//     payload.Destination +
//     "'";
//   var sqlNonIsSchedule =
//     "select * from NS_FlightSchedule where Flight_Date= '" +
//     payload.Flight_Date +
//     "' and Acft_Regn='" +
//     payload.Acft_Regn +
//     "' and IsSchedule='false' and (std >= '" +
//     payload.STD +
//     "' OR ( std is null and Flight_Date >= '" +
//     payload.Flight_Date +
//     "')) order by std";
//   var sqlIsSchedule =
//     "select * from NS_FlightSchedule where Flight_Date = '" +
//     payload.Flight_Date +
//     "' and Flight_no = '" +
//     payload.Flight_no +
//     "' and (std >= '" +
//     payload.STD +
//     "' OR ( std is null and Flight_Date >= '" +
//     payload.Flight_Date +
//     "')) order by std";
//   console.log("Fetch NS_FlightSchedule ", sqlStm);
//   db.transaction(function (tx) {
//     console.log("Fetch NS_FlightSchedule ", sqlStm);
//     tx.executeSql(
//       sqlStm,
//       [],
//       (tx, results) => {
//         console.log("sync transaction res", results);
//         var sync_data = [];
//         if (results !== null && results.rows.length > 0) {
//           var finalSql = sqlNonIsSchedule;
//           sync_data.push(results.rows.item(0));
//           if (
//             sync_data[0].IsSchedule == "true" ||
//             sync_data[0].IsSchedule == true
//           ) {
//             finalSql = sqlIsSchedule;
//           }
//           db.transaction(function (tx) {
//             console.log("Fetch NS_FlightSchedule ", finalSql);
//             tx.executeSql(
//               finalSql,
//               [],
//               (tx, res) => {
//                 console.log("fianl results NS_FlightSchedule ", res);
//                 var res_data = [];
//                 if (res !== null && res.rows.length > 0) {
//                   for (var i = 0; i < res.rows.length; i++) {
//                     var obj = { destination: res.rows.item(i).Destination };
//                     res_data.push(obj);
//                   }
//                 }
//                 payload = res_data;
//                 dispatch({
//                   type: "SECTOR_TYPE",
//                   payload: payload,
//                 });
//               },
//               (er) => {
//                 console.log(er);
//                 defer.reject(er);
//               }
//             );
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
// }
