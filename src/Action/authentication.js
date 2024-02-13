import * as Enviornment from "./environment";
import axios from "axios";
import * as q from "q";
import {getDeviceId} from "./../utils/device";
import { deleteTables } from "./sync";
//  const https = require('https');

export function login_progress(status){
    return {
        type:'AUTH_LOGIN_PROGRESS',
        payload:status
    }
}

export function auth_complete(user,error){
    return {
        type:'AUTH_LOGIN_RESPONSE',
        payload:{
            user:user,
            error:error
        }
    }
}

export function logout(){
    return {
        type:'AUTH_LOGOUT',
        payload:{
        }
    }
}

//Method is used to authenticate user.
export function authenticateUser(postData){
    var host                =   Enviornment.host();
    var url                 =   host+"/user/authenticate?date="+(new Date()).getTime();
    var DEBUG               =   Enviornment.debug();
    var authData = {
        "Flight_Date": new Date(),
        "UserName": postData.username,
        "LoginTime": new Date(),
        "IPOrIMEI": postData.device_id,
        "App": "SaltMob"
    }
    console.log('url',url)
    console.log('url123',postData)
   
    return function(dispatch, getState) {
        dispatch(login_progress(true));
       
        window.localStorage.setItem("auth_user",JSON.stringify(postData))
        axios.post(url,
          postData,
       
            )
            .then(function(response){
            var response_data        =   response.data;
           dispatch(insertUserLoginHistory(authData));
            if(response.data !== undefined ){
                window.localStorage.setItem("auth_user",JSON.stringify(response_data.data));
                dispatch(auth_complete(response_data.data,null))
            } else {
                DEBUG &&  console.log("Error",response);
                dispatch(auth_complete(null,new Error("Something went wrong!")))
            }
        }).catch(function(error){
            console.log(error)
            if(error.response !== undefined && error.response.data !== undefined && error.response.data.message !== undefined){
                DEBUG &&  console.log("Error",error.response.data);
                dispatch(auth_complete(null,error.response.data.message))
            } else {
                DEBUG &&  console.log("Error",error);
                dispatch(auth_complete(null,error.message))
            }
        });

    }
}

export function getAuthenticatedUser(data){
    var host                =   Enviornment.host();
    var url                 =   host+"/user/getauthenticated";
    var DEBUG               =   Enviornment.debug();
    return function(dispatch, getState) {
        axios.post(url,data,).then(function(response){
            var response_data        =   response.data;
            if(response.data !== undefined ){
                window.localStorage.setItem("auth_user",JSON.stringify(response_data.data));
                dispatch(auth_complete(response_data.data,null))
            } else {
                DEBUG &&  console.log("Error",response);
                dispatch(auth_complete(null,new Error("Something went wrong!")))
            }
        }).catch(function(error){
            if(error.response !== undefined && error.response.data !== undefined && error.response.data.message !== undefined){
                DEBUG &&  console.log("Error",error.response.data);
                dispatch(auth_complete(null))
            } else {
                DEBUG &&  console.log("Error",error);
                dispatch(auth_complete(null))
            }
        });
    }
}

export function logout_dialog_visibility(status){
    return {
        'type':'SHOW_LOGOUT_DIALOG',
        'payload':status
    }
}

//Method is used to logout user
export function logoutUser(){
    return function(dispatch, getState) {
    var auth = JSON.parse(window.localStorage.getItem("auth_user"));
    var authData = {
        "LogoutTime": new Date(),
        "UserName": auth.user_name,
        "LoginTime": new Date(),
        "IPOrIMEI": getDeviceId(),
        "App": "SaltMob"
    } 
    dispatch(updateLogoutUserLoginHistory(authData));
    window.localStorage.removeItem("auth_user");

    deleteTables().then(()=>{
        console.log('deleted all');
        // window.localStorage.removeItem("auth_user");
    }).catch(err =>{
        console.log('not delete all');
    });
    dispatch(logout(null))
   } 
}

//Method is used to authenticate user.
export function insertUserLoginHistory(postData){
    var host                =   Enviornment.host();
    var url                 =   host+"/userLoginHistory/insertData"
    var DEBUG               =   Enviornment.debug();
    return function(dispatch, getState) {
        //dispatch(login_progress(true));
        axios.put(url,postData).then(function(response){
            var response_data        =   response.data;
            console.log("insertUserLoginHistory response_data ",response_data)
        }).catch(function(error){
            console.log("insertUserLoginHistory error ",error)
        });

    }
}

export function updateLogoutUserLoginHistory(postData){
    var host                =   Enviornment.host();
    var url                 =   host+"/userLoginHistory/update"
    var DEBUG               =   Enviornment.debug();
    return function(dispatch, getState) {
        //dispatch(login_progress(true));
        axios.put(url,postData).then(function(response){
            var response_data        =   response.data;
            console.log("updateLogoutUserLoginHistory response_data ",response_data)
        }).catch(function(error){
            console.log("updateLogoutUserLoginHistory error ",error)
        });

    }
}
// //Method To reset password
// export function resetPassword(password){
    
//     var defer               =   q.defer();
//     var host                =   Enviornment.host();
//     var url                 =   host+"/reset/password?date="+(new Date()).getTime();
//     var DEBUG               =   Enviornment.debug();

//     axios.post(url,{

//         'password':password

//     }).then(function(response){
//         var response_data        =   response.data;
//         if(response.data !== undefined ){
//             defer.resolve(response_data);
//         } else {
//             DEBUG &&  console.log("Error",response);
//             defer.reject({'error':"Something went wrong !"});
//         }
//     }).catch(function(error){
//         console.log(error);
//         if(error.response !== undefined && error.response.data !== undefined && error.response.data.message !== undefined){
//             DEBUG &&  console.log("Error",error.response.data);
//             defer.reject({'error':error.response.data.message})
//         } else {
//             DEBUG &&  console.log("Error",error);
//             defer.reject({'error':"Something went wrong!"});
//         }
//     });
//     return defer.promise;
// }


// //Method To change password
// export function changePassword(postData){
    
//     var defer               =   q.defer();
//     var host                =   Enviornment.host();
//     var url                 =   host+"/change/password?date="+(new Date()).getTime();
//     var DEBUG               =   Enviornment.debug();

//     axios.post(url,postData).then(function(response){
//         var response_data        =   response.data;
//         if(response.data !== undefined ){
//             defer.resolve(response_data);
//         } else {
//             DEBUG &&  console.log("Error",response);
//             defer.reject({'error':"Something went wrong !"});
//         }
//     }).catch(function(error){
//         console.log(error);
//         if(error.response !== undefined && error.response.data !== undefined && error.response.data.message !== undefined){
//             DEBUG &&  console.log("Error",error.response.data);
//             defer.reject({'error':error.response.data.message})
//         } else {
//             DEBUG &&  console.log("Error",error);
//             defer.reject({'error':"Something went wrong!"});
//         }
//     });
//     return defer.promise;
// }