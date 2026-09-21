import { dataList } from '/app/src/data_list.js'
import mqtt from '/app/src/mqtt/index.js'
import cache from '/app/src/cache/index.js'

import extendedSolar from '/app/src/helpers/extended_solar.js'
import { checkTimeBetween } from '/app/src/helpers/time.js'

function getState(){
    if(dataList.schedule.load_shedding == 'ON') return 'OFF'
    if(dataList.schedule.battery_ac_charged == 'ON') return 'OFF'
    if(dataList.main.battery_charged_today == 'OFF') return 'OFF'
    if(dataList.main.battery_full_charged_today == 'OFF') return 'OFF'
    if(dataList.main.battery_soc < 60) return 'OFF'
    if(dataList.main.load_power < 2000) return 'OFF'
    return 'ON'
}

export default async function(){
    let new_state = getState()
    dataList.schedule.battery_ac_couple_desired = new_state
    await mqtt.sendSensorValue(`solar_inverter/schedule/battery_ac_couple_desired/state`, dataList.schedule.battery_ac_couple_desired);
}