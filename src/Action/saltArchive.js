import * as Enviornment from "./environment";
import * as q from "q";
import * as SQL from "./SQL";
import axios from "axios";
//Method to check device status
export function fetch(data){

    var defer               =   q.defer();
    var host                =   Enviornment.host();
    var url                 =   host+"/saltarchive"
    var DEBUG               =   Enviornment.debug();

    axios.post(url,data).then(function(response){

        var response_data        =   response.data;
        console.log('saltarchive data', response_data);
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
    var url                 =   host+"/saltarchive/update"
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