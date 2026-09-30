import { dataList } from '/app/src/data_list.js';
import mqtt from '/app/src/mqtt/index.js'

import CONFIGS from '/app/config/config.json' with { type: 'json' };

const INVERTER_CONFIGS = CONFIGS?.micro_inverters;

export default async function(){
    let timeNow = Date.now() - (60 * 1000)
    for(let i of INVERTER_CONFIGS){
        let state = 'OFF'
        if(dataList?.micro_inverters[i.num]?.last_update >= timeNow) state = 'ON'
        dataList.micro_inverters[i.num].communication = state
        await mqtt.sendSensorValue(`micro_inverter/${i.num}/communication/state`, state)
    }
    let main_state = 'OFF'
    if(dataList?.open_dtu?.last_update >= timeNow) main_state = 'ON'
    await mqtt.sendSensorValue(`micro_inverter/main/status/state`, main_state)
}