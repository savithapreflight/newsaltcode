fetchLtAdjustByRegnNo(data.regno).then((result)=>{
    if(result ===null || result === undefined){
        defer.reject("LTAdjust is not found")
    }
    console.log("LTAdjust",result)
    ltadjust  = result;
    var cgrefTableForActype   =  cgrefTable[data.ac_type];
    var weights             =   Object.keys(cgrefTableForActype);
    if(cgrefTableForActype == null || cgrefTableForActype == undefined || weights.length <= 0 ){
        defer.reject("cgrefTable out of limit")
        return defer.promise

    }
    console.log(cgrefTableForActype,'Cgref')
   

    Object.keys(data.pax).forEach((y)=>{
        var paxIndexArray =  data.pax[y].split('/');
        var x       = parseInt(y)
        console.log("paxIndexArray",paxIndexArray)
        console.log("lnt[adult",lnt["C"+x+"Adult"])
        console.log("parseInt(paxIndexArray[0]",parseInt(paxIndexArray[0]))
        console.log("parseInt(paxIndexArray[1]",parseInt(paxIndexArray[1]))
        console.log("lnt[child",lnt["C"+x+"Child"])
        lnt["C"+parseInt(x+1)+"Adult"] = parseInt(lnt["C"+(x+1)+"Adult"]) + parseInt(paxIndexArray[0]);
        lnt["C"+(x+1)+"Child"] = parseInt(lnt["C"+(x+1)+"Child"]) + parseInt(paxIndexArray[1]);
        lnt["C"+(x+1)+"Infant"] = parseInt(lnt["C"+(x+1)+"Infant"]) + parseInt(paxIndexArray[2]);
        // lnt["C"+x+"Infant"] = lnt["C"+x+"Infant"] + parseInt(paxIndexArray[3]);

    })

    Object.keys(data.cargo).forEach((y)=>{
        var cargoIndexArray =  data.cargo[y].split('/');
        var x       = parseInt(y)
        console.log("cargoIndexArray",cargoIndexArray)
        lnt["cmpt"+parseInt(x+1)] = parseInt(lnt["cmpt"+(x+1)]) + parseInt(cargoIndexArray[0]);

    })
    var totalCmpWt = 0;
    Object.values(data.cargo).forEach( x => {
        totalCmpWt   = totalCmpWt + parseInt(x);
    })

    var delta_weight      =   fixedNumber((parseInt(lmcLnt['adult']) +  parseInt(lmcLnt['child']) +parseInt(lmcLnt['paxAcm']))*75+ (totalCmpWt)+
                            + (parseInt(lmcLnt['Fwdgalley']) + parseInt(lmcLnt['Aftrgalley']))+ (lmcLnt['CockpitOccupantPerKG'])*90
                            + (lmcLnt['Aftrjump'])*90+ lmcLnt['take_of_fuel']);
    console.log("delta_weight in lmc",delta_weight);
//                 lnt.Adult             =     fixedNumber((lnt.Adult + lmcLnt['passenger']) );
//                 lnt.Tpax              =     fixedNumber((lnt.Tpax + lmcLnt['passenger']) );
//                 lnt.SOB               =     fixedNumber((lnt.SOB + lmcLnt['passenger']) );
    lnt.ZFW               =     fixedNumber((lnt.ZFW + delta_weight));
    lnt.TOW               =     fixedNumber((lnt.TOW + delta_weight));
    lnt.LAW               =     fixedNumber((lnt.TOW - parseInt(lmcLnt['trip_fuel'])));
//                 lnt.LAW               =     fixedNumber((lnt.LAW + delta_weight));

    var cabinIndexArray  = fleet_info_for_aircraft.CabinIndex.split("$");
    var count  = 0;
    cabinIndexArray.forEach(x =>{
        count = count + parseFloat(x);
    })

    var cmpIndexArray  = fleet_info_for_aircraft.CompIndex.split("$");

    var cmp_count  = 0;
    cmpIndexArray.forEach(x =>{
        cmp_count = cmp_count + parseFloat(x);
    })

    var TotalCabinIndex = 0;
    var TotalCompIndex = 0;
    var TotalpaxAcmIndex =0;
    for(var p = 0; p<fleet_info_for_aircraft.MaxCabin;p++){
        var paxIArray  = data.pax[p].split('/');
        var cabinIndexA = ((paxIArray[0]*75*cabinIndexArray[p]) + (paxIArray[1]*35*cabinIndexArray[p]));
        var paxAcmIndex = paxIArray[3]*85*cabinIndexArray[p];
        TotalCabinIndex = TotalCabinIndex + cabinIndexA;
        TotalpaxAcmIndex = TotalpaxAcmIndex + paxAcmIndex;
    }

    for(var q = 0; q<fleet_info_for_aircraft.MaxCompartment;q++){
        var compIndexA  = (parseFloat(data.cargo[q]) * cmpIndexArray[q]);
        TotalCompIndex = TotalCompIndex + compIndexA;
    }
    var afterJumpIndex = 0;
    if(data.ac_type !== 'Q400' && parseFloat(data.Aftrjump) > 0){
        afterJumpIndex   = parseFloat(ltadjust.AftJumpPerKG);
    }

    var CockpitOccupantPerKG   = 0
    if(parseFloat(data.cockpitnew) > 0){
        CockpitOccupantPerKG = parseFloat(ltadjust.CockpitOccupantPerKG) 
    }

    var FwdGalleyPerKG   = 0
    if(parseFloat(data.Fwdgalley) > 0){
        FwdGalleyPerKG = parseFloat(ltadjust.FwdGalleyPerKG) 
    }

    var AftGalleyPerKG   = 0
    if(parseFloat(data.Aftrgalley) > 0){
        AftGalleyPerKG = parseFloat(ltadjust.AftGalleyPerKG) 
    }
    lnt['dow']   =  Math.round(parseFloat(fleet_info_for_aircraft.OEW) + (parseFloat(lmcLnt['CockpitOccupantPerKG']) *85) + (parseFloat(lmcLnt['paxAcm']) *85) + parseFloat(lmcLnt['Aftrgalley']) + parseFloat(lmcLnt['Fwdgalley']) + (parseFloat(lmcLnt['Aftrjump'])*85));
    lnt['doi']   =  fixedNumber(parseFloat(fleet_info_for_aircraft.OEW_Index) + ((lmcLnt['CockpitOccupantPerKG']*85*CockpitOccupantPerKG )+ TotalpaxAcmIndex + (lmcLnt['Fwdgalley']*FwdGalleyPerKG) + (lmcLnt['Aftrgalley']*AftGalleyPerKG) + (lmcLnt['Aftrjump']*85*afterJumpIndex )));

    var delta_index_wo_fuel =   fixedNumber((TotalCabinIndex +TotalpaxAcmIndex )*75+ (TotalCompIndex)+
                                (data.Fwdgalley*FwdGalleyPerKG + data.Aftrgalley*AftGalleyPerKG)
                                + (data.cockpitnew*CockpitOccupantPerKG)*90+ (afterJumpIndex)*90);
    console.log("delta_index_wo_fuel",delta_index_wo_fuel)
    console.log("lnt.LILAW ",lnt.LWindex)


    // lnt.LWindex               =   fixedNumber((lnt.LWindex   + delta_index_wo_fuel));
    lnt.ZFWindex               =   fixedNumber((lnt.ZFWindex   + delta_index_wo_fuel));
    lnt.TOWindex               =   fixedNumber((lnt.TOWindex   + delta_index_wo_fuel));
    lnt.LWindex               = fixedNumber(parseFloat(lnt.LWindex) + remaining_fuel_index);
    
    lnt.LWMAC              =   fixedNumber(((((((lnt.LWindex-fleet_info_for_aircraft['K_Constant'])*fleet_info_for_aircraft['C_Constant'])/lnt.LAW)+fleet_info_for_aircraft['CG_Ref'])-fleet_info_for_aircraft['LeMac'])/fleet_info_for_aircraft['Mac'])*100);
    lnt.ZFWMAC              =   fixedNumber(((((((lnt.ZFWindex-fleet_info_for_aircraft['K_Constant'])*fleet_info_for_aircraft['C_Constant'])/lnt.ZFW)+fleet_info_for_aircraft['CG_Ref'])-fleet_info_for_aircraft['LeMac'])/fleet_info_for_aircraft['Mac'])*100);
    lnt.TOWMAC              =   fixedNumber(((((((lnt.TOWindex-fleet_info_for_aircraft['K_Constant'])*fleet_info_for_aircraft['C_Constant'])/lnt.TOW)+fleet_info_for_aircraft['CG_Ref'])-fleet_info_for_aircraft['LeMac'])/fleet_info_for_aircraft['Mac'])*100);

    // lnt.LWMAC              =   fixedNumber(((((((lnt.LILAW-fleet_info_for_aircraft['K_Constant'])*fleet_info_for_aircraft['C_Constant'])/lnt.LAW)+fleet_info_for_aircraft['CG_Ref'])-fleet_info_for_aircraft['LeMac'])/fleet_info_for_aircraft['Mac'])*100);
    // lnt.ZFWMAC              =   fixedNumber(((((((lnt.LIZFW-fleet_info_for_aircraft['K_Constant'])*fleet_info_for_aircraft['C_Constant'])/lnt.ZFW)+fleet_info_for_aircraft['CG_Ref'])-fleet_info_for_aircraft['LeMac'])/fleet_info_for_aircraft['Mac'])*100);
    // lnt.TOWMAC              =   fixedNumber(((((((lnt.LITOW-fleet_info_for_aircraft['K_Constant'])*fleet_info_for_aircraft['C_Constant'])/lnt.TOW)+fleet_info_for_aircraft['CG_Ref'])-fleet_info_for_aircraft['LeMac'])/fleet_info_for_aircraft['Mac'])*100);
   
//                 lnt.created_at          =   moment().toDate();
//                 lnt.isSync          =   false;
//                 lnt.active          =   null;
//                 lnt.isOfflineGenerated  =   false;  
//                 var auth            =   JSON.parse(window.localStorage.getItem("auth_user"))
//                 lnt.PreparedBy      =   auth.user_name;

        weights.forEach(function(d){
            d   =   parseInt(d);
        });
    
        weights   = weights.sort();

        var weight_zfw = getNearestWeight(weights,lnt.ZFW);
        console.log(weight_zfw);
        var cg_limit_zfw  = cgrefTableForActype[weight_zfw];
        


        if(lnt.ZFWMAC < cg_limit_zfw['Fwd_Zfw_Limit'] || lnt.ZFWMAC > cg_limit_zfw['Aft_Zfw_Limit']){
            defer.reject('CG not in limit.');
            return defer.promise;
        }
        var weight_tow = getNearestWeight(weights,lnt.ZFW);

        var cg_limit_tow  = cgrefTableForActype[weight_tow];
       
        if(lnt.TOWMAC < cg_limit_tow['Fwd_Tow_Limit'] || lnt.TOWMAC > cg_limit_tow['Aft_Tow_Limit']){
            defer.reject('CG not in limit.');
            return defer.promise;
        }
        return fetchStabTrimThrustRegnNo(data.regno,data.ac_type)
    }).then((stabthrust)=>{
        var _promise   = [];
        var res   = data.regno.substr(0,5)
        console.log("split res 1",res)
        if(data.ac_type !== 'Q400' && res !== "VT-MX"){
            var tableArray  = stabthrust.TableName.split(",");
            console.log("lnt['TOWMAC']",lnt['TOWMAC'])
            tableArray.forEach(x  =>{
                _promise.push(fetchStabTrimDataTableName(x,lnt['TOW'],lnt['TOWMAC']))
            })    
        }
        return Promise.all(_promise)
    }).then((stabdata)=>{
        lnt['thrust']  = JSON.stringify(stabdata);
        var thrust  = [];
        thrust  = JSON.parse(lnt['thrust'])
        var thrus    = null;
        var t   = 0;
        thrust.forEach((item,x)=>{
            if(thrus === null){
               
                lnt["Thrust"+(x+1)]            =   parseInt(item.Thrust)
                lnt["T"+(t+1)+"Flap1"]    =   item.Flap
                lnt["T"+(t+1)+"Stab1"]    =   Number(fixed2Number(item.Stab))
                thrus        = parseInt(item.Thrust);
                t    = t+1;
            }else if(thrus === parseInt(item.Thrust)){
              
                lnt["T"+t+"Flap2"]    =   item.Flap
                lnt["T"+t+"Stab2"]    =   Number(fixed2Number(item.Stab));
                thrus  = null;
            }
            console.log("thrus",thrus,t)
           
        })
        lnt['ActcrewStr']   = data.ActcrewStr;
        lnt['STDCREW']   = fleet_info_for_aircraft.STDCREW;
        console.log("lnt",lnt)

        // addTrimSheetLMC(lnt).then((res)=>{
        //     console.log(res)
            defer.resolve(lnt)
        // })
//             })
//         }).catch((er)=>{
//             defer.reject(er)
//         })
//     }).catch((er)=>{
//         defer.reject(er)
//     })
}).catch((er)=>{
    defer.reject(er)
    console.log(er)
})
return defer.promise;


export function CalculateLMC(data){
    var defer               =   q.defer();
    var fleetinfo   = data.fleetinfo;
    var lnt         = data.trimSheet;
   
    var lmcLnt = {
        'ac_type':data.ac_type,
        'config':fleetinfo.CONFIG,
        'crew':'',
        'COMPWT':0,
        'CABBGWT':Number(data.cabin_baggage),
        'PAXWT':0,
        'total_load':0,
        'dow':0,
        'zfw':0,
        'mzfw':fleetinfo.MZFW,
        'take_of_fuel':Number(data.take_of_fuel_in),
        'tow':0,
        'trip_fuel':Number(data.trip_fuel_in),
        'law':0,
        'olw':Number(data.olw),
        'otow':Number(data.otow),
        'mlw':0,
        'underload':0,
        'doi':0,
        'lizfw':0,
        'litow':0,
        'lilw':0,
        'zfmac':0,
        'towmac':0,
        'lwmac':0,
        'pax':data.pax,
        'cargo':data.cargo, 
        'adult':0,
        'child':0,
        'infant':0,
        'paxAcm':0,
        'ttl':0,
        'sob':0,
        'thrust':'',
        'trim_officer':data.trim_officer.replace(/[&\/\\#,+()$~%.'":*?<>{}@!^]/g,""),
        'load_officer':data.load_officer.replace(/[&\/\\#,+()$~%.'":*?<>{}@!^]/g,""),
        'si':data.si.replace(/[&\/\\#,+()$~%.'":*?<>{}@!^]/g,""),
        'captain':data.captain.replace(/[&\/\\#,+()$~%.'":*?<>{}@!^]/g,""),
        'isSync':false,
        'isOfflineGenerated':true,
        'created_at':new Date(),
        'Aftrjump':Number(data.Aftrjump),
        'Aftrgalley':Number(data.Aftrgalley),
        'Fwdgalley':Number(data.Fwdgalley),
        'CockpitOccupantPerKG':Number(data.cockpitnew),
        'passenger':0
    }
    var cgrefTable            =   JSON.parse(window.localStorage.getItem("cgrefTable"))
    var fuelTable            =   JSON.parse(window.localStorage.getItem("fuelTable"))

    var fuelTableForActype    =  fuelTable[data.ac_type];   
    var fuelweights1             =   Object.keys(fuelTableForActype);

    var ZFWLimit        =   null;
    var TOWLimit        =   null;
    var LAWLimit        =   null;

    if(fuelTableForActype == null || fuelTableForActype == undefined || fuelweights1.length <= 0 ){
        defer.reject("Fuel weight not found")
        return defer.promise

    }

    var fuelweights =  fuelweights1.map(function(d){
        return parseInt(d);
    });

    fuelweights   = fuelweights.sort(function(a,b){
        return a-b;
    });
    var ltadjust  = null;

    lnt['Load_Officer']     = lmcLnt['load_officer']
    lnt['CAPTAIN']          = lmcLnt['captain']
    lnt['specialStr']       = lmcLnt['si']
    lnt['FOB']              =  parseInt(lmcLnt['take_of_fuel'])
    lnt['TRIP_FUEL']        =  parseInt(lmcLnt['trip_fuel'])
    lnt['cabinBagagge']     = lmcLnt['CABBGWT']

    Object.keys(data.pax).forEach((x)=>{
        var paxIndexArray   =  data.pax[x].split('/');
        lmcLnt['adult']     = lmcLnt['adult'] + parseInt(paxIndexArray[0]);
        lmcLnt['child']     = lmcLnt['child'] + parseInt(paxIndexArray[1]);
        lmcLnt['infant']    = lmcLnt['infant'] + parseInt(paxIndexArray[2]);
        lmcLnt['paxAcm']    = lmcLnt['paxAcm'] + parseInt(paxIndexArray[3]);

    })
    lnt['crew']             =  (data.cockpit +data.cockpitOccupent_final)+'/'+(data.cabin_crew + lmcLnt['paxAcm'])

    var totalCmpWt = 0;
    Object.values(data.cargo).forEach( x => {
        totalCmpWt   = totalCmpWt + parseInt(x);
    })

    lnt['COMPWT']   = totalCmpWt;

    var take_of_fuel_index = getFuelIndex(parseFloat(data.take_of_fuel_in),fuelweights,fuelTableForActype);
    console.log(take_of_fuel_index,'...take_of_fuel_index..')
    var remaing_fuel_in  = parseFloat(data.take_of_fuel_in) -  parseFloat(data.trip_fuel_in);

    var remaining_fuel_index = getFuelIndex(remaing_fuel_in,fuelweights,fuelTableForActype);

    lnt['PAXWT'] =  Math.round((parseInt(lmcLnt['adult']) * 75) + (parseInt(lmcLnt['child']) * 35) + (parseInt(lmcLnt['infant']) * 10));

    lnt['total_load'] =  Math.round((parseInt(lmcLnt['adult']) * 75) + (parseInt(lmcLnt['child']) * 35) + (parseInt(lmcLnt['infant']) * 10) + totalCmpWt + parseFloat(data.cabin_baggage));

    console.log("total load",lnt['total_load'])
    var afterJump = 0;
    if(data.ac_type !== 'Q400'){
        afterJump   = data.Aftrjump;
    }

    lnt['dow']   =  Math.round(parseFloat(fleetinfo.OEW) + (parseFloat(lmcLnt['CockpitOccupantPerKG']) *85) + (parseFloat(lmcLnt['paxAcm']) *85) + parseFloat(lmcLnt['Aftrgalley']) + parseFloat(lmcLnt['Fwdgalley']) + (parseFloat(afterJump)*85));
    
    lnt['ZFW']   =  Math.round(parseFloat(lnt['total_load']) + parseFloat(lnt['dow']));
    console.log("total ZFW",lnt['ZFW'])

    if(parseFloat(lnt['ZFW']) > parseFloat(fleetinfo.MZFW)) {
        defer.reject("ZFW ("+parseFloat(lnt['ZFW'])+") should be less than MZFW("+parseFloat(fleetinfo.MZFW)+")")
        return defer.promise
    }

    
    lnt['TOW']   =  Math.round(parseFloat(lnt['ZFW']) + parseFloat(data.take_of_fuel_in));
    
    lnt['LAW']   =  Math.round(parseFloat(lnt['TOW']) - parseFloat(data.trip_fuel_in));

    if(parseFloat(data.olw) < parseFloat(lnt['LAW'])) {
        defer.reject("Law ("+parseFloat(lnt['LAW'])+") should be less than OLW("+parseFloat(data.olw)+")")
        return defer.promise
    }
    
    if(parseFloat(data.rtow) < parseFloat(lnt['TOW'])) {
        defer.reject("TOW ("+parseFloat(lnt['TOW'])+") should be less than RTOW("+parseFloat(data.rtow)+")")
        return defer.promise
    }
    lnt['underload']   =  Math.round(parseFloat(data.rtow) - parseFloat(lnt['TOW']));


    fetchLtAdjustByRegnNo(data.regno).then((result)=>{
        if(result ===null || result === undefined){
            defer.reject("LTAdjust is not found")
        }
        console.log("LTAdjust",result)
        ltadjust  = result;
        var cgrefTableForActype   =  cgrefTable[data.ac_type];
        var weights             =   Object.keys(cgrefTableForActype);
        if(cgrefTableForActype == null || cgrefTableForActype == undefined || weights.length <= 0 ){
            defer.reject("cgrefTable out of limit")
            return defer.promise

        }
        console.log(cgrefTableForActype,'Cgref')
       

        Object.keys(data.pax).forEach((y)=>{
            var paxIndexArray =  data.pax[y].split('/');
            var x       = parseInt(y)
          
            lnt["C"+parseInt(x+1)+"Adult"] =  parseInt(paxIndexArray[0]);
            lnt["C"+(x+1)+"Child"] =  parseInt(paxIndexArray[1]);
            lnt["C"+(x+1)+"Infant"] =  parseInt(paxIndexArray[2]);
    
        })

        Object.keys(data.cargo).forEach((y)=>{
            // var cargoIndexArray =  data.cargo[y].split('/');
            var x       = parseInt(y)
            // console.log("cargoIndexArray",cargoIndexArray)
            lnt["cmpt"+parseInt(x+1)] = parseInt(data.cargo[y]);
    
        })
        
        var totalCmpWt = 0;
        Object.values(data.cargo).forEach( x => {
            totalCmpWt   = totalCmpWt + parseInt(x);
        })

        var cabinIndexArray  = fleetinfo.CabinIndex.split("$");
        var count  = 0;
        cabinIndexArray.forEach(x =>{
            count = count + parseFloat(x);
        })

        var cmpIndexArray  = fleetinfo.CompIndex.split("$");

        var cmp_count  = 0;
        cmpIndexArray.forEach(x =>{
            cmp_count = cmp_count + parseFloat(x);
        })

        var TotalCabinIndex = 0;
        var TotalCompIndex = 0;
        var TotalpaxAcmIndex =0;
        for(var p = 0; p<fleetinfo.MaxCabin;p++){
            var paxIArray  = data.pax[p].split('/');
            var cabinIndexA = ((paxIArray[0]*75*cabinIndexArray[p]) + (paxIArray[1]*35*cabinIndexArray[p]));
            var paxAcmIndex = paxIArray[3]*85*cabinIndexArray[p];
            TotalCabinIndex = TotalCabinIndex + cabinIndexA;
            TotalpaxAcmIndex = TotalpaxAcmIndex + paxAcmIndex;
        }

        for(var q = 0; q<fleetinfo.MaxCompartment;q++){
            var compIndexA  = (parseFloat(data.cargo[q]) * cmpIndexArray[q]);
            TotalCompIndex = TotalCompIndex + compIndexA;
        }
        var afterJumpIndex = 0;
        if(data.ac_type !== 'Q400' && parseFloat(data.Aftrjump) > 0){
            afterJumpIndex   = parseFloat(ltadjust.AftJumpPerKG);
        }

        var CockpitOccupantPerKG   = 0
        if(parseFloat(data.cockpitnew) > 0){
            CockpitOccupantPerKG = parseFloat(ltadjust.CockpitOccupantPerKG) 
        }

        var FwdGalleyPerKG   = 0
        if(parseFloat(data.Fwdgalley) > 0){
            FwdGalleyPerKG = parseFloat(ltadjust.FwdGalleyPerKG) 
        }

        var AftGalleyPerKG   = 0
        if(parseFloat(data.Aftrgalley) > 0){
            AftGalleyPerKG = parseFloat(ltadjust.AftGalleyPerKG) 
        }
        lnt['doi']   =  fixedNumber(parseFloat(fleetinfo.OEW_Index) + ((lmcLnt['CockpitOccupantPerKG']*85*CockpitOccupantPerKG )+ TotalpaxAcmIndex + (lmcLnt['Fwdgalley']*FwdGalleyPerKG) + (lmcLnt['Aftrgalley']*AftGalleyPerKG) + (lmcLnt['Aftrjump']*85*afterJumpIndex )));


        lnt['ZFWindex']   =  fixedNumber(parseFloat(lnt['doi']) + parseFloat(TotalCabinIndex) + parseFloat(TotalCompIndex));

        lnt['TOWindex']   =  fixedNumber(parseFloat(lnt['ZFWindex']) + take_of_fuel_index);

        lnt['LWindex']   =  fixedNumber(parseFloat(lnt['ZFWindex']) + remaining_fuel_index);

        lnt['ZFWMAC']   =  fixedNumber(((((((parseFloat(lnt['ZFWindex']) - parseFloat(fleetinfo.K_Constant)) * parseFloat(fleetinfo.C_Constant)) /parseFloat(lnt['ZFW'])) + parseFloat(fleetinfo.CG_Ref)) - parseFloat(fleetinfo.LeMac)) / parseFloat(fleetinfo.Mac)) * 100);

        lnt['TOWMAC']  =  parseFloat(((((((parseFloat(lnt['TOWindex']) - parseFloat(fleetinfo.K_Constant)) * parseFloat(fleetinfo.C_Constant)) /parseFloat(lnt['TOW'])) + parseFloat(fleetinfo.CG_Ref)) - parseFloat(fleetinfo.LeMac)) / parseFloat(fleetinfo.Mac)) * 100);

        lnt['LWMAC']   =  fixedNumber(((((((parseFloat(lnt['LWindex']) - parseFloat(fleetinfo.K_Constant)) * parseFloat(fleetinfo.C_Constant)) /parseFloat(lnt['LAW'])) + parseFloat(fleetinfo.CG_Ref)) - parseFloat(fleetinfo.LeMac)) / parseFloat(fleetinfo.Mac)) * 100);
        return checkZFWLimit(lnt['Acft_Regn'],lnt['ZFW'],lnt['LAW'])
    }).then((resul)=>{
        ZFWLimit = resul
        console.log(ZFWLimit,"zfw limit")
        return checkTOWLimit(lnt['Acft_Regn'],lnt['TOW'],lnt['LAW'])
    }).then((resu)=>{
        TOWLimit  = resu;
        console.log(TOWLimit,"TOWLimit limit")

        return checkLAWLimit(lnt['Acft_Regn'],lnt['LAW'])
    }).then((res)=>{
        LAWLimit  = res

        
         
        if((lnt['ZFWMAC'] < ZFWLimit['Fwd_Zfw_Limit']) || (lnt['ZFWMAC'] > ZFWLimit['Aft_Zfw_Limit'])){
            defer.reject("CG ZFW not in limit")
            return defer.promise;
        }
        if(lnt['TOWMAC'] < TOWLimit['Fwd_Tow_Limit'] || lnt['TOWMAC'] > TOWLimit['Aft_Tow_Limit']){
            defer.reject("CG TOW not in limit")
            return defer.promise;
        }
        if(lnt['LWMAC'] < LAWLimit['Fwd_Law_Limit'] || lnt['LWMAC'] > LAWLimit['Aft_Law_Limit']){
            defer.reject("CG LAW not in limit")
            return defer.promise;
        }
        return fetchStabTrimThrustRegnNo(data.regno,data.ac_type)
    }).then((stabthrust)=>{
        var _promise   = [];
        var res   = data.regno.substr(0,5)
        console.log("split res 1",res)
        if(data.ac_type !== 'Q400' && res !== "VT-MX"){
            var tableArray  = stabthrust.TableName.split(",");
            console.log("lnt['towmac']",lnt['TOWMAC'])
            tableArray.forEach(x  =>{
                _promise.push(fetchStabTrimDataTableName(x,lnt['TOW'],lnt['TOWMAC']))
            })    
        }
        return Promise.all(_promise)
        }).then((stabdata)=>{
            lnt['thrust']  = JSON.stringify(stabdata);
            var thrust  = [];
            thrust  = JSON.parse(lnt['thrust'])
            var thrus    = null;
            var t   = 0;
            thrust.forEach((item,x)=>{
                if(thrus === null){
                    console.log("thrust",lnt["Thrust"+(t+1)],parseInt(item.Thrust))
                    console.log("Flap1",lnt["T"+(t+1)+"Flap1"],item.Flap)
                    console.log("Stab1", lnt["T"+(t+1)+"Stab1"],fixed2Number(item.Stab))
                    lnt["Thrust"+(x+1)]            =   parseInt(item.Thrust)
                    lnt["T"+(t+1)+"Flap1"]    =   item.Flap
                    lnt["T"+(t+1)+"Stab1"]    =   Number(fixed2Number(item.Stab))
                    thrus        = parseInt(item.Thrust);
                    t    = t+1;
                }else if(thrus === parseInt(item.Thrust)){
                    console.log("Flap2",lnt["T"+t+"Flap2"],item.Flap)
                    console.log("Stab2", lnt["T"+t+"Stab2"],fixed2Number(item.Stab))
                    lnt["T"+t+"Flap2"]    =   item.Flap
                    lnt["T"+t+"Stab2"]    =   Number(fixed2Number(item.Stab));
                    thrus  = null;
                }
                console.log("thrus",thrus,t)
               
            })
            lnt['ActcrewStr']   = data.ActcrewStr;
            lnt['STDCREW']   = fleetinfo.STDCREW;
            console.log("lnt",lnt)
            defer.resolve(lnt)
    }).catch((er)=>{
        defer.reject(er)
        console.log(er)
    })
    return defer.promise;
}