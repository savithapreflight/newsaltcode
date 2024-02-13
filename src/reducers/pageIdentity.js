// src/reducers/user.js
export default(state = {'page_name':"",'page_info':"","action":null,"theme": null}, payload) => {
    var data     =  payload.payload;
    switch (payload.type) {
        case 'SET_PAGE_INFO':
            return {...state, 'page_name':data.page_name,'page_info':data.page_info};
        case 'SET_PAGE_ACTION':
            return {...state, 'action':data};
        case 'SET_APP_THEME':
            return {...state, 'theme':data};
        default:
            return state;
    }
};