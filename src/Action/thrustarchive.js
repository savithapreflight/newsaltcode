import * as Enviornment from "./environment";
import * as q from "q";
import * as SQL from "./SQL";
import axios from "axios";
//Method to check device status
export function fetch(data){

    var defer               =   q.defer();
    var host                =   Enviornment.host();
    var url                 =   host+"/thrustarchive"
    var DEBUG               =   Enviornment.debug();

    axios.post(url,data).then(function(response){

        var response_data        =   response.data;
        if(response.data !== undefined ){
            defer.resolve(response_data);
        } else {
            DEBUG &&  console.log("Error",response);
            defer.reject({'error':"Something went wrong!"});
        }

    }).catch(function(error){
        console.log(error);

        if(error.response !== undefined && error.response.data !== undefined && error.response.data.message !== undefined){
            DEBUG &&  console.log("Error",error.response.data);
            defer.reject({'error':error.response.data.message})
        } else {
            DEBUG &&  console.log("Error",error);
            defer.reject({'error':"Something went wrong!"});
        }
    });
    return defer.promise;
}

//Method to update the data into database
export function update(data){
    var defer               =   q.defer();
    var host                =   Enviornment.host();
    var url                 =   host+"/thrustarchive/update"
    var DEBUG               =   Enviornment.debug();

    axios.put(url,data).then(function(response){
        var response_data        =   response.data;
        if(response.data !== undefined ){
            defer.resolve(response_data);
        } else {
            DEBUG &&  console.log("Error",response);
            defer.reject({'error':"Something went wrong!"});
        }

    }).catch(function(error){
        console.log(error);

        if(error.response !== undefined && error.response.data !== undefined && error.response.data.message !== undefined){
            DEBUG &&  console.log("Error",error.response.data);
            defer.reject({'error':error.response.data.message})
        } else {
            DEBUG &&  console.log("Error",error);
            defer.reject({'error':"Something went wrong!"});
        }
    });
    return defer.promise;
}

export function DeleteThrustArchiveByFlightNoDate(Flight_no, Flight_Date) {
    var defer = q.defer();
  
    var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);
  
    request.onsuccess = function (event) {
      var db = event.target.result;
  
      db.transaction("thrustarchive", "readwrite")
        .objectStore("thrustarchive")
        .index("Flight_no_Flight_Date")
        .openCursor(IDBKeyRange.bound([Flight_no, Flight_Date], [Flight_no, Flight_Date + '\uffff']), 'prev')
        .onsuccess = function (event) {
          var cursor = event.target.result;
  
          if (cursor) {
            cursor.delete();
            cursor.continue();
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
  

  export function UpdateThrustArchiveByFlightNoDate(Flight_no, Flight_Date, data) {
    var defer = q.defer();
  
    var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);
  
    request.onsuccess = function (event) {
      var db = event.target.result;
  
      var transaction = db.transaction("thrustarchive", "readwrite");
      var objectStore = transaction.objectStore("thrustarchive");
      var index = objectStore.index("Flight_no_Flight_Date");
  
      var range = IDBKeyRange.bound([Flight_no, Flight_Date], [Flight_no, Flight_Date + '\uffff']);
  
      index.openCursor(range, 'prev').onsuccess = function (event) {
        var cursor = event.target.result;
  
        if (cursor) {
          var updateData = {
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
          };
  
          cursor.update(updateData);
          cursor.continue();
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
  