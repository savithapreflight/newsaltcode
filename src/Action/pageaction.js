export function setPage(page_name,page_info){
    return {
        'type':"SET_PAGE_INFO",
        "payload":{
            'page_name':page_name,
            'page_info':page_info
        }
    }
}

export function setAction(action){
    return {
        'type':"SET_PAGE_ACTION",
        "payload":action
    }
}

export function setTheme(theme){
    return {
        'type':"SET_APP_THEME",
        "payload":theme
    }
}