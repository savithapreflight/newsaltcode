// src/reducers/user.js
export default(state = {
    'in_prog':false,
    'user':null,
    'error':null,
    'login_status':false,

}, payload) => {
    var data     =  payload.payload;
    switch (payload.type) {
        case 'AUTH_LOGIN_PROGRESS':
            return {...state, in_prog:data};
        case 'AUTH_LOGIN_RESPONSE':
            var error   = data.error;
            if(error == null){
                return {...state,user:data.user,login_status:true,error:null,in_prog:false };
            } else {
                return {...state,user:null,login_status:false,error:error,in_prog:false };
            }
        case 'AUTH_LOGOUT':
            return {...state, user:null,login_status:false,error:null,in_prog:false };
        case 'SHOW_LOGOUT_DIALOG':
            return {...state, 'show_logout_dialog':data};
        default:
            return state;
    }
};

