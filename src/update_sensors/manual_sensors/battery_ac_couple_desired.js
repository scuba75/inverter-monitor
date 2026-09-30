import { dataList } from '/app/src/data_list.js'
import mqtt from '/app/src/mqtt/index.js'
import cache from '/app/src/cache/index.js'

import extendedSolar from '/app/src/helpers/extended_solar.js'
import { checkTimeStart } from '/app/src/helpers/time.js'

function checkAferPeakSummer(){
    if(dataList.schedule.summer_peak_hours == 'OFF') return
    let start_time = dataList.schedule.grid_first_start
    return checkTimeStart(start_time, 0)
}
function checkChargeCycle(){
    let soc = dataList.main.battery_soc
    if(!dataList.schedule.ac_couple_battery_charge_needed) dataList.schedule.ac_couple_battery_charge_needed = 'OFF'
    if(soc < 90){
        dataList.schedule.ac_couple_battery_charge_needed = 'ON'
        return 'OFF'
    }
    if(soc < 95){
        if(dataList.schedule.ac_couple_battery_charge_needed == 'ON') return 'OFF'
        return 'ON'
    }
    dataList.schedule.ac_couple_battery_charge_needed = 'OFF'
    return 'ON'
}
function getState(){
    if(dataList.schedule.load_shedding == 'ON') return 'OFF'
    if(dataList.schedule.battery_ac_charged == 'ON') return 'OFF'
    if(dataList.main.battery_charged_today == 'OFF') return 'OFF'
    if(dataList.main.battery_full_charged_today == 'OFF') return 'OFF'
    
    if(checkAferPeakSummer()){
        if(dataList.main.battery_soc < 60) return 'OFF'
        return 'ON'
    }
    return checkChargeCycle()
}

export default async function(){
    if(!dataList.schedule.ac_couple_daily_cycle) dataList.schedule.ac_couple_daily_cycle = 'OFF'
    if(!dataList.schedule.ac_couple_battery_charge_needed) dataList.schedule.ac_couple_battery_charge_needed = 'OFF'
    let new_state = getState()
    dataList.schedule.battery_ac_couple_desired = new_state
    if(dataList.schedule.battery_ac_couple_desired == 'ON' ) dataList.schedule.ac_couple_daily_cycle = 'ON'
    await mqtt.sendSensorValue(`solar_inverter/schedule/battery_ac_couple_desired/state`, dataList.schedule.battery_ac_couple_desired);
}