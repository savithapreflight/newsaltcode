
export default(state = {
    'socket':null,
}, payload) => {
    var data     =  payload.payload;
    console.log('Socket...Data.....');
    console.log(data);
    switch (payload.type) {
        case 'SOCKET_CONNECTION':
                return {...state, 'socket':data};
        default:
            return state;
    }
};