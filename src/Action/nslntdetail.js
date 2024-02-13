import * as Enviornment from "./environment";
import * as q from "q";
import * as SQL from "./SQL";
import axios from "axios";
//Method to check device status
export function fetch(data){

    var defer               =   q.defer();
    var host                =   Enviornment.host();
    var url                 =   host+"/nslntdetail"
    var DEBUG               =   Enviornment.debug();

    axios.post(url,data).then(function(response){

        var response_data        =   response.data;
        console.log('nslntdetail data', response_data);
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
    var url                 =   host+"/nslntdetail/update"
    var DEBUG               =   Enviornment.debug();

    axios.put(url,data).then(function(response){
        var response_data        =   response.data;
        console.log(" nslntdetail update response_data",response_data)
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

export function fetchCGRefTableByAcftType(AcftType) {
    var defer = q.defer();
    var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);
  
    request.onsuccess = function (event) {
      var db = event.target.result;
  
      var transaction = db.transaction(["cgreftable"], "readonly");
      var objectStore = transaction.objectStore("cgreftable");
      var index = objectStore.index("AcftType");
  
      var singleKeyRange = IDBKeyRange.only(AcftType);
      var request = index.openCursor(singleKeyRange);
  
      request.onsuccess = function (event) {
        var cursor = event.target.result;
  
        if (cursor) {
          console.log(cursor.value);
          defer.resolve(cursor.value);
        } else {
          // No matching record found
          defer.reject("Failed to find the CGRefTable.");
        }
      };
  
      request.onerror = function (event) {
        console.error("Error reading data from IndexedDB", event.target.error);
        defer.reject("Failed to find the CGRefTable.");
      };
    };
  
    request.onerror = function (event) {
      console.error("Error opening IndexedDB", event.target.error);
      defer.reject("Failed to open IndexedDB.");
    };
  
    return defer.promise;
  }
  

  export function DeleteNNsLnTDetailByFlightNoDate(Flight_no, Flight_Date) {
    var defer = q.defer();
    var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);
  
    request.onsuccess = function (event) {
      var db = event.target.result;
  
      var transaction = db.transaction(["nslntdetail"], "readwrite");
      var objectStore = transaction.objectStore("nslntdetail");
      var index = objectStore.index("Flight_no","Flight_Date")
      var singleKeyRange = IDBKeyRange.only([Flight_no, Flight_Date]);
  
      var request = index.openCursor(singleKeyRange);
  
      request.onsuccess = function (event) {
        var cursor = event.target.result;
  
        if (cursor) {
          cursor.delete();
          defer.resolve();
        } else {
          // No matching record found
          defer.reject("Failed to find the Ns_LnTDetail.");
        }
      };
  
      request.onerror = function (event) {
        console.error("Error deleting data from IndexedDB", event.target.error);
        defer.reject("Failed to delete the Ns_LnTDetail.");
      };
    };
  
    request.onerror = function (event) {
      console.error("Error opening IndexedDB", event.target.error);
      defer.reject("Failed to open IndexedDB.");
    };
  
    return defer.promise;
  }
  


export function UpdateNsLnTDetailByFlightNoDate(Flight_no, Flight_Date, data) {
    var defer = q.defer();
    var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);
  
    request.onsuccess = function (event) {
      var db = event.target.result;
  
      var transaction = db.transaction(["nslntdetail"], "readwrite");
      var objectStore = transaction.objectStore("nslntdetail");
      var index = objectStore.index("Flight_no","Flight_Date");
      var singleKeyRange = IDBKeyRange.only([Flight_no, Flight_Date]);
  
      var request = index.openCursor(singleKeyRange);
  
      request.onsuccess = function (event) {
        var cursor = event.target.result;
  
        if (cursor) {
          var updatedData = cursor.value;
          // Update the fields that need to be modified
          updatedData.EDNO = data.EDNO;
          updatedData.ActcrewStr = data.ActcrewStr;
          updatedData.cmpt1 = data.cmpt1;
          updatedData.cmpt2 = data.cmpt2;
          updatedData.cmpt3 = data.cmpt3;
          updatedData.cmpt4 = data.cmpt4;
          updatedData.TrimGenTimeUTC = data.TrimGenTimeUTC;
          updatedData.ZFW = data.ZFW;
          updatedData.FOB = data.FOB;
          updatedData.TOW = data.TOW;
          updatedData.TRIP_FUEL = data.TRIP_FUEL;
          updatedData.underLoadLMC = data.underLoadLMC;
          updatedData.ZFWindex = data.ZFWindex;
          updatedData.TOWindex = data.TOWindex;
          updatedData.LWindex = data.LWindex
          updatedData.ZFWMAC = data.ZFWMAC
          updatedData.TOWMAC = data.TOWMAC
          updatedData.LWMAC = data.LWMAC
          updatedData.specialStr = data.specialStr
          updatedData.LTLoginId = data.LTLoginId
          updatedData.Load_Officer = data.Load_Officer
          updatedData.CAPTAIN = data.CAPTAIN
          updatedData.OEW = data.OEW
          updatedData.OEW_Index= data.OEW_Index
          updatedData.AdjustStr = data.AdjustStr
          updatedData.Flight_no = data.Flight_no
          updatedData.Flight_Date = data.Flight_Date
          
        cursor.update(updatedData);
          defer.resolve();
        } else {
          // No matching record found
          defer.reject("Failed to find the Ns_LnTDetail.");
        }
      };
  
      request.onerror = function (event) {
        console.error("Error updating data in IndexedDB", event.target.error);
        defer.reject("Failed to update the Ns_LnTDetail.");
      };
    };
  
    request.onerror = function (event) {
      console.error("Error opening IndexedDB", event.target.error);
      defer.reject("Failed to open IndexedDB.");
    };
  
    return defer.promise;
  }
  