import * as Enviornment from "./environment";
import * as q from "q";
import {DeleteFlightEditionNoByFlightNoDate,UpdateFlightEditionNoByFlightNoDate} from "./flighteditionno";
import {DeleteThrustArchiveByFlightNoDate,UpdateThrustArchiveByFlightNoDate} from "./thrustarchive";
import {DeleteNsCheckInDetailByFlightNoDate,UpdateCheckInDetailByFlightNoDate} from "./nscheckindetail";
import {DeleteNNsLnTDetailByFlightNoDate,UpdateNsLnTDetailByFlightNoDate} from "./nslntdetail";
import {DeleteFimsScheduleByFlightNoDate,UpdateFimsScheduleByFlightNoDate} from "./rampaction";
import {DeleteFleetInfoByAcRegn,UpdateFleetInfoByAcRegn} from "./fleetinfoaction";

export function deltaSyncing(data){
    var defer               =   q.defer();
    var dataAr  = Object.keys(data);
    console.log(dataAr)
    dataAr.map((x)=>{
        console.log("x",x)
        var xData       =   data[x];
        var xDataKeys       =   Object.keys(data[x]);
        xDataKeys.map((y)=>{
            if(y === 'deleted'){
                console.log("yyyy if",y)
                var inputs          =  xData[y]
                console.log("inputs",inputs)
                inputs.map((z)=>{
                    delete_data(x,z.input.where).then(()=>{
    
                    }).catch((er)=>{
                        console.log(er)
                    })
                })
            }
            else{
                console.log("yyyy else",y)
                var inputs          =  xData[y]
                console.log("inputs else",inputs)
                inputs.map((z)=>{
                    update_data(x,z.input.where,z.data).then(()=>{
    
                    }).catch((er)=>{
                        console.log(er)
                    })
                })
            }
        })

    })
    
    return defer.promise;
}


async function delete_data(table_name, inputs) {
    const defer = q.defer();
    let result = null;
  
    const request = indexedDB.open(Enviornment.get("DB_NAME"),1);
    let db;
  
    request.onsuccess = (event) => {
      db = event.target.result;
  
      const transaction = db.transaction(table_name, 'readwrite');
      const objectStore = transaction.objectStore(table_name);
  
      if (table_name === 'fleetinfo') {
        result = DeleteFleetInfoByAcRegn(objectStore, inputs.AC_REGN);
      } else if (table_name === 'flighteditionno') {
        result = DeleteFlightEditionNoByFlightNoDate(objectStore, inputs.Flight_no, inputs.Flight_Date);
      } else if (table_name === 'nscheckindetail') {
        result = DeleteNsCheckInDetailByFlightNoDate(objectStore, inputs.Flight_no, inputs.Flight_Date);
      } else if (table_name === 'nslntdetail') {
        result = DeleteNNsLnTDetailByFlightNoDate(objectStore, inputs.Flight_no, inputs.Flight_Date);
      } else if (table_name === 'nsflightschedule') {
        result = DeleteFimsScheduleByFlightNoDate(objectStore, inputs.Flight_no, inputs.Flight_Date);
      } else if (table_name === 'thrustarchive') {
        result = DeleteThrustArchiveByFlightNoDate(objectStore, inputs.Flight_no, inputs.Flight_Date);
      }
  
      transaction.oncomplete = () => {
        defer.resolve(result);
      };
  
      transaction.onerror = (event) => {
        console.log(event.error);
        defer.reject(event.error);
      };
    };
  
    request.onerror = (event) => {
      console.log(event.error);
      defer.reject(event.error);
    };
  
    return defer.promise;
  }

  async function update_data(table_name, inputs,data) {
    const defer = q.defer();
    let result = null;
  
    const request = indexedDB.open(Enviornment.get("DB_NAME"),1);
    let db;
  
    request.onsuccess = (event) => {
      db = event.target.result;
  
      const transaction = db.transaction(table_name,'readwrite');
      const objectStore = transaction.objectStore(table_name);
  
      if (table_name === 'fleetinfo') {
        result = UpdateFleetInfoByAcRegn(objectStore, inputs.AC_REGN, data);
      } else if (table_name === 'flighteditionno') {
        result = UpdateFlightEditionNoByFlightNoDate(objectStore, inputs.Flight_no, inputs.Flight_Date, data);
      } else if (table_name === 'nscheckindetail') {
        result = UpdateCheckInDetailByFlightNoDate(objectStore, inputs.Flight_no, inputs.Flight_Date, data);
      } else if (table_name === 'nslntdetail') {
        result = UpdateNsLnTDetailByFlightNoDate(objectStore, inputs.Flight_no, inputs.Flight_Date, data);
      } else if (table_name === 'nsflightschedule') {
        result = UpdateFimsScheduleByFlightNoDate(objectStore, inputs.Flight_no, inputs.Flight_Date, data);
      } else if (table_name === 'thrustarchive') {
        result = UpdateThrustArchiveByFlightNoDate(objectStore, inputs.Flight_no, inputs.Flight_Date, data);
      }
  
      transaction.oncomplete = () => {
        defer.resolve(result);
      };
  
      transaction.onerror = (event) => {
        console.log(event.error);
        defer.reject(event.error);
      };
    };
  
    request.onerror = (event) => {
      console.log(event.error);
      defer.reject(event.error);
    };
  
    return defer.promise;
  }
  







