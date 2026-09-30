import { dataList } from '/app/src/data_list.js'
import mqtt from '/app/src/mqtt/index.js';

export default function(serial, inv_num, value){
    if(!value) return
    if(!dataList.micro_inverters[inv_num]) dataList.micro_inverters[inv_num] = {}
    dataList.micro_inverters[inv_num].last_update = parseInt(value * 1000)
    mqtt.sendSensorValue(`micro_inverter/${inv_num}/pv_inverter_serial_number/state`, serial)
}