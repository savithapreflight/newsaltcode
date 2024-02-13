
import * as Enviornment from "./environment";
import axios from "axios";
import * as q from 'q';

//Method to check device status
export function getDeviceStatus(device_id){

    var defer               =   q.defer();
    var host                =   Enviornment.host();
    var url                 =   host+"/device/"+device_id
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