import cache from '/app/src/cache/index.js'
import mqtt from '/app/src/mqtt/index.js';
import { dataList } from '/app/src/data_list.js';
import CONFIGS from '/app/config/config.json' with { type: 'json' };

const INVERTER_CONFIGS = CONFIGS?.micro_inverters;

let inv_status = new Map(), inv_config = new Map(INVERTER_CONFIGS?.map(x=>[ x.num, x ]))

async function enable(inv_num){
    if(inv_num){
        let inv = inv_config.get(inv_num)
        if(!inv.serial) return
        if(!inv_status?.get(inv_num)){
            await mqtt.sendSensorValue(`open_dtu/${inv.serial}/cmd/power`, 1, true)
            inv_status.set(inv_num, true)
        }
    }else{
        for(let i of INVERTER_CONFIGS){
            if(!i?.serial) continue
            if(dataList?.micro_inverters[i.num]?.low_grid) continue
            if(!inv_status?.get(i.num)){
                await mqtt.sendSensorValue(`open_dtu/${i.serial}/cmd/power`, 1, true)
                inv_status.set(i.num, true)
            } 
        }
        await mqtt.sendSensorValue(`micro_inverter/main/inverters_power/state`, 'ON')
    }
    
}
async function disable(inv_num){
    if(inv_num){
        let inv = inv_config.get(inv_num)
        if(!inv.serial) return
        if(inv_status.get(inv_num) || !inv.status?.has(inv_num)){
            await mqtt.sendSensorValue(`open_dtu/${inv.serial}/cmd/power`, 0, true)
            inv_status.set(inv_num, false)
        }
    }else{
        for(let i of INVERTER_CONFIGS){
        if(!i?.serial) continue
        if(inv_status.get(i.num) || !inv_status?.has(inv_num)){
            await mqtt.sendSensorValue(`open_dtu/${i.serial}/cmd/power`, 0, true)
            inv_status.set(i.num, false)
        }
    }
    await mqtt.sendSensorValue(`micro_inverter/main/inverters_power/state`, 'OFF')
    }
}

export default { enable, disable }