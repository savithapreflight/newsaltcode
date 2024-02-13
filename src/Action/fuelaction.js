import * as Enviornment from "./environment";
import * as q from "q";
import * as SQL from "./SQL";
import axios from "axios";
//Method to check device status
export function fetch(){

    var defer               =   q.defer();
    var host                =   Enviornment.host();
    var url                 =   host+"/fuel/table"
    var DEBUG               =   Enviornment.debug();

    axios.get(url).then(function(response){

        var response_data        =   response.data;
        if(response.data !== undefined ){
            window.localStorage.setItem("fuelTable",JSON.stringify(response_data.data.data));
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
