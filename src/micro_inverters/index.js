import log from '/app/src/logger.js'
import switchCmd from './switch_cmd/index.js'
import updateInverter from './update_inverter/index.js'
import updateMain from './update_main/index.js'
import updatePowerLimiter from './update_power_limiter/index.js'


import CONFIGS from '/app/config/config.json' with { type: 'json' };

const INVERTER_CONFIGS = CONFIGS?.micro_inverters;


export default function( topic, value){
    try{
        if(!topic) return
        if(topic.startsWith(`open_dtu/switch_cmd`)) return switchCmd(topic.replace(`open_dtu/switch_cmd/`, ''), value)
        if(topic.startsWith('open_dtu/dtu/')) return updateMain(topic.replace('open_dtu/dtu/', ''), value)
        if(topic.startsWith('open_dtu/powerlimiter/status')) return updatePowerLimiter(topic.replace('open_dtu/powerlimiter/status/', ''), value)
        for(let i of INVERTER_CONFIGS){
            if(i.type !== 'ac') continue
            if(topic.startsWith(`open_dtu/${i.serial}/`)) return updateInverter(i, topic.replace(`open_dtu/${i.serial}/`, ''), value)
        }
    }catch(e){
        log.error(e)
    }
    
}