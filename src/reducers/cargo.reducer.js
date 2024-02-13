const initialState = {
    loadTypes: [],
    sectors:[]
}

export default(state=initialState, action) => {
    const {type, payload} = action
    switch (type) {
        case 'LOAD_TYPE':
            return {
                ...state, 
                loadTypes: payload
            };
            case 'SECTOR_TYPE':
            return {
                ...state, 
                sectors: payload
            };
        default:
            return state;
    }
};

