import { dataList } from '/app/src/data_list.js'
import mqtt from '/app/src/mqtt/index.js';
import CONFIGS from '/app/config/config.json' with { type: 'json' };

const INVERTER_CONFIGS = CONFIGS?.micro_inverters;

export default async function(value){
    if(value >= 0){
        for(let i of INVERTER_CONFIGS) await mqtt.sendSensorValue(`open_dtu/${i.serial}/cmd/power`, value == 1 ? 0:1)
    }

}