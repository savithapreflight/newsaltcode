import * as Enviornment from "./environment";
import * as q from "q";
import * as SQL from "./SQL";
import axios from "axios";
//Method to check device status
export function fetch(){

    var defer               =   q.defer();
    var host                =   Enviornment.host();
    var url                 =   host+"/cgref/table"
    var DEBUG               =   Enviornment.debug();

    axios.get(url).then(function(response){

        var response_data        =   response.data;
        if(response.data !== undefined ){
            window.localStorage.setItem("cgrefTable",JSON.stringify(response_data.data.data));
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
    const defer = q.defer();
  
    const request = indexedDB.open(Enviornment.get("DB_NAME"),1);
    let db;
  
    request.onsuccess = (event) => {
      db = event.target.result;
  
      const transaction = db.transaction("cgreftable", "readonly");
      const objectStore = transaction.objectStore("cgreftable");
      const index = objectStore.index("AcftType");
  
      const keyRange = IDBKeyRange.only(AcftType);
      const getRequest = index.openCursor(keyRange);
  
      getRequest.onsuccess = (event) => {
        const cursor = event.target.result;
        const dummy = [];
  
        if (cursor) {
          dummy.push(cursor.value);
          cursor.continue();
        } else {
          if (dummy.length > 0) {
            defer.resolve(dummy);
          } else {
            defer.reject("Failed to find the CGRefTable.");
          }
        }
      };
  
      getRequest.onerror = (event) => {
        console.log(event.error);
        defer.reject("Failed to find the CGRefTable.");
      };
    };
  
    request.onerror = (event) => {
      console.log(event.error);
      defer.reject("Failed to find the CGRefTable.");
    };
  
    return defer.promise;
 }

  export function fetchCGRefTableZFW(){

    var defer               =   q.defer();
    var host                =   Enviornment.host();
    var url                 =   host+"/cgref/zfw/table"
    var DEBUG               =   Enviornment.debug();

    axios.get(url).then(function(response){

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

export function fetchCGRefTableTOW(){

    var defer               =   q.defer();
    var host                =   Enviornment.host();
    var url                 =   host+"/cgref/tow/table"
    var DEBUG               =   Enviornment.debug();

    axios.get(url).then(function(response){

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

export function fetchCGLIMTISZFW(){

    var defer               =   q.defer();
    var host                =   Enviornment.host();
    var url                 =   host+"/cgref/zfw/limit/table"
    var DEBUG               =   Enviornment.debug();

    axios.get(url).then(function(response){

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

export function fetchCGLIMTISTOW(){

    var defer               =   q.defer();
    var host                =   Enviornment.host();
    var url                 =   host+"/cgref/tow/limit/table"
    var DEBUG               =   Enviornment.debug();

    axios.get(url).then(function(response){

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



























