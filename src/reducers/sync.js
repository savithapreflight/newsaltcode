// src/reducers/user.js
export default(state = {
    'ramp_sync':false,
    'transaction_sync':false

}, payload) => {
    switch (payload.type) {
        case 'RAMP_SYNC_STARTED':
            return {...state, ramp_sync:true};
        case 'RAMP_SYNC_COMPLETED':
            return {...state,ramp_sync:false };
        case 'TRANSACTION_SYNC_STARTED':
            return {...state,ramp_sync:true };
        case 'TRANSACTION_SYNC_COMPLETED':
            return {...state,ramp_sync:true };
        default:
            return state;
    }
};

