import { dataList } from '/app/src/data_list.js'
import mqtt from '/app/src/mqtt/index.js';

export default function(serial, inv_num, value){
    if(!dataList.micro_inverters[inv_num]) dataList.micro_inverters[inv_num] = {}
    dataList.micro_inverters[inv_num].producing = (value == 1 ? 'ON':'OFF')
    mqtt.sendSensorValue(`micro_inverter/${inv_num}/producing/state`, dataList.micro_inverters[inv_num].producing)
}