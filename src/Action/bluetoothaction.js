export function bleModalOpen(){
    return {
        type:'BLE_MODAL_OPEN',
    }
}

export function bleModalClose(){
    return {
        type:'BLE_MODAL_CLOSE',
    }
}


export function scanBlueToothDevices(onDeviceFound,onScanError){
    if(window.evothings != undefined && window.evothings.ble != undefined){
        window.evothings.ble.startScan(onDeviceFound,onScanError)
    }
}