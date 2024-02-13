
import * as Enviornment from "./environment";
import axios from "axios";
import * as q from 'q';

//Method to check device status
export function fetch(){

    var defer               =   q.defer();
    var host                =   Enviornment.host();
    var url                 =   host+"/stab/trim/thrust"
    var DEBUG               =   Enviornment.debug();

    axios.get(url).then(function(response){

        var response_data        =   response.data;
        console.log("/stab/trim/thrust",response_data);
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

//Method to check device status
export function fetchData(){

    var defer               =   q.defer();
    var host                =   Enviornment.host();
    var url                 =   host+"/stab/trim/data"
    var DEBUG               =   Enviornment.debug();

    var datetimefetchStart = new Date();
    console.log("Fetch start Time : ",datetimefetchStart.toISOString());

    axios.get(url).then(function(response){

        var datetimefetchStop = new Date();
        console.log("Fetch stop Time : ",datetimefetchStop.toISOString());

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