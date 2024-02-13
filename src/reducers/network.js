// src/reducers/user.js
export default(state = {
    'status':false,

}, payload) => {
    switch (payload.type) {
        case 'NETWORK_ON':
            return {...state, status:true};
        case 'NETWORK_OFF':
            return {...state,status:false };
        default:
            return state;
    }
};

