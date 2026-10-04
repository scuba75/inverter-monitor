import { dataList } from '/app/src/data_list.js'
import mqtt from '/app/src/mqtt/index.js';
import acSolar from '/app/src/helpers/ac_solar.js'

let mode = { 0: 'Normal', 1: 'Disabled', 2: 'Passthrough' }
export default async function(value){
    if(!mode[value]) return
    mqtt.sendSensorValue(`micro_inverter/main/dpl_mode/state`, mode[value])
}