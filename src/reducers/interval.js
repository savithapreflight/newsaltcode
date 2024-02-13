// src/reducers/user.js
export default(state = {
    'id':null,

}, payload) => {
    var data     =  payload.payload;

    switch (payload.type) {
        case 'SET_INTERVAL':
            return {...state, id:data};
        default:
            return state;
    }
};

