import { dataList } from '/app/src/data_list.js'
import mqtt from '/app/src/mqtt/index.js';

export default function(serial, inv_num, value){
    mqtt.sendSensorValue(`micro_inverter/main/pv_power_ac_${inv_num}/state`, value?.toString())
    if(!dataList.micro_inverters[inv_num]) dataList.micro_inverters[inv_num] = {}
    dataList.micro_inverters[inv_num].pv_power_ac = parseFloat(value || 0)
}