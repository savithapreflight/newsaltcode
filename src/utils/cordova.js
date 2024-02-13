export function setOrienration(type){
    try{
        window.screen.orientation.lock(type);
    } catch(err){
        console.error(err);
        console.warn("Cordova plugin oreintation is not installed.");
    }
    
}

export function setBright(value){
    try{
        window.cordova.plugins.brightness.setBrightness(value, setsuccess, seterror);
    } catch(err){
        console.error(err);
        console.warn("Cordova plugin brightness is not installed.");
    }
    
    function setsuccess(e) {        
        console.log("Brightness set successfully");
    }

    function seterror(e) {
        console.log(e);
        console.log("Error setting brightness");
    }
}

export function getBrightness(success, error){
    try{
        window.cordova.plugins.brightness.getBrightness(success, error);
    } catch(err){
        console.error(err);
        console.warn("Cordova plugin brightness is not installed.");
    }
    
    function setsuccess(e) {        
        console.log("Brightness set successfully");
    }

    function seterror(e) {
        console.log(e);
        console.log("Error setting brightness");
    }
}


