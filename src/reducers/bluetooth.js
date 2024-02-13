// src/reducers/user.js
export default(state = {
    'open':false,

}, payload) => {
    switch (payload.type) {
        case 'BLE_MODAL_OPEN':
            return {...state, open:true};
        case 'BLE_MODAL_CLOSE':
            return {...state,open:false };
        default:
            return state;
    }
};

