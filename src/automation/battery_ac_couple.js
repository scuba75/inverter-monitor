import log from '/app/src/logger.js'
import { dataList } from '/app/src/data_list.js';
import mqtt from '/app/src/mqtt/index.js'
import { checkTimeStart } from '/app/src/helpers/time.js'

function getState(){
    try{
        let battery_soc = dataList?.main?.battery_soc, grid_start = dataList?.schedule?.grid_first_start
        if(dataList?.schedule?.load_shedding !== 'OFF') return 'OFF'
        if(!grid_start) return 'OFF'
        if(checkTimeStart(grid_start, -5) && battery_soc > 60 && dataList?.schedule?.summer_peak_hours == 'ON') return 'ON'
        if( battery_soc > 85 && dataList?.schedule?.battery_ac_charged == 'OFF') return 'ON'
        //if(dataList?.main?.battery_charged_today !== 'ON') return 'OFF'        
        //if(dataList?.main?.battery_full_charged_today !== 'OFF') return 'OFF'            
        return 'OFF'
    }catch(e){
        log.error(e)
    }
}
export default async function(){
    let state = getState() || 'OFF'
    await mqtt.sendSensorValue('solar_inverter/battery/ac_coupling_desired/state', state)
}