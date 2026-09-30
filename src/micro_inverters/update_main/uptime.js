import { dataList } from '/app/src/data_list.js'
import mqtt from '/app/src/mqtt/index.js';

import CONFIGS from '/app/config/config.json' with { type: 'json' };

const INVERTER_CONFIGS = CONFIGS?.micro_inverters;

export default function( topic, value ){
    if(!dataList.open_dtu) dataList.open_dtu = {}
    delete dataList.open_dtu.updated
    dataList.open_dtu.last_update = Date.now()
    //mqtt.sendSensorValue(`micro_inverter/main/status/state`, 'ON')
    let total_power = 0
    for(let i of INVERTER_CONFIGS){
        if(dataList.micro_inverters[i.num]) total_power += (dataList.micro_inverters[i.num].pv_power_ac || 0)
    }
    dataList.open_dtu.pv_power_ac = total_power
    mqtt.sendSensorValue(`micro_inverter/main/pv_power_ac/state`, dataList.open_dtu.pv_power_ac.toString())
}