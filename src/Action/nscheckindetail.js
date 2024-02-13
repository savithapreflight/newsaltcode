import * as Enviornment from "./environment";
import * as q from "q";
import * as SQL from "./SQL";
import axios from "axios";
//Method to check device status
export function fetch(data){

    var defer               =   q.defer();
    var host                =   Enviornment.host();
    var url                 =   host+"/nscheckindetail"
    var DEBUG               =   Enviornment.debug();

    axios.post(url,data).then(function(response){

        var response_data        =   response.data;
        console.log("1nscheckindetail",response_data);
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

export function DeleteNsCheckInDetailByFlightNoDate(Flight_no, Flight_Date) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);
  
      request.onerror = (event) => {
        console.error('Database error:', event.target.error);
        reject(new Error('Failed to open the database.'));
      };
  
request.onsuccess = (event) => {
        const db = event.target.result;
  
        const transaction = db.transaction(['nscheckindetail'], 'readwrite');
        const store = transaction.objectStore('nscheckindetail');
  
        const deleteRequest = store.delete(IDBKeyRange.bound(Flight_no, Flight_no), Flight_Date);
  
        deleteRequest.onsuccess = () => {
          resolve();
        };
  
        deleteRequest.onerror = (event) => {
          console.error('Delete error:', event.target.error);
          reject(new Error('Failed to delete from Ns_CheckInDetail.'));
        };
      };
    });
  }
export function UpdateCheckInDetailByFlightNoDate(Flight_no, Flight_Date, data) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);
  
      request.onerror = (event) => {
        console.error('Database error:', event.target.error);
        reject(new Error('Failed to open the database.'));
      };
  
     
      request.onsuccess = (event) => {
        const db = event.target.result;
  
        const transaction = db.transaction(['checkindetail'], 'readwrite');
        const store = transaction.objectStore('checkindetail');
  
        const getRequest = store.get(IDBKeyRange.bound(Flight_no, Flight_no), Flight_Date);
  
        getRequest.onsuccess = () => {
          const existingData = getRequest.result;
  
          if (existingData) {
            
            Object.assign(existingData, data);
  
            
            const putRequest = store.put(existingData);
  
            putRequest.onsuccess = () => {
              resolve();
            };
  
            putRequest.onerror = (event) => {
              console.error('Put error:', event.target.error);
              reject(new Error('Failed to update CheckInDetail.'));
            };
          } else {
            reject(new Error('Record not found.'));
          }
        };
  
        getRequest.onerror = (event) => {
          console.error('Get error:', event.target.error);
          reject(new Error('Failed to get CheckInDetail.'));
        };
      };
    });
  }
  