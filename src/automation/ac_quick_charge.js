import log from '/app/src/logger.js'
import { dataList } from '/app/src/data_list.js';
import cache from '/app/src/cache/index.js'
import mqtt from '/app/src/mqtt/index.js'
import inverters  from '/app/src/inverters.js';

let chargeStatus = new Map()

export default async function(){
    try{
        let grid_importing = dataList.main.grid_importing, ac_quick_charge_duration = dataList.main.ac_quick_charge_duration
        let ac_quick_charge = await cache.get('ac_quick_charge')
        if(grid_importing == 'OFF'){
            chargeStatus.set('startRequest', false)
            chargeStatus.set('inProgress', false)            
            await cache.set('ac_quick_charge', { state: 'OFF' })
            await mqtt.sendSensorValue(`solar_assistant/battery/ac_quick_charge`, 'OFF')
            return
        }
        //running normal
        if(ac_quick_charge?.state == 'ON' && ac_quick_charge_duration > 0 && !chargeStatus.get('startRequest') && chargeStatus.get('inProgress')){
            return;
        }
        if(ac_quick_charge?.state == 'ON' && ac_quick_charge_duration > 0 && !chargeStatus.get('startRequest') && !chargeStatus.get('inProgress')){
            log.info('ac_quick_charge_in_progress')
            chargeStatus.set('startRequest', false)
            chargeStatus.set('inProgress', true)
            return;
        }
        //switch turned on
        if(ac_quick_charge?.state == 'ON' && ac_quick_charge_duration == 0 && !chargeStatus.get('startRequest') && !chargeStatus.get('inProgress')){
            log.info(`ac_quick_charge requested`)
            chargeStatus.set('startRequest', true)
            chargeStatus.set('inProgress', false)
            await inverters.queueWrite(234, 60)
            return
        }
        //charge started
        if(ac_quick_charge?.state == 'ON' && ac_quick_charge_duration > 0 && chargeStatus.get('startRequest')){
            log.info(`ac_quick_charge started`)
            chargeStatus.set('startRequest', false)
            chargeStatus.set('inProgress', true)            
            return
        }
        //charge done
        if(ac_quick_charge?.state == 'ON' && ac_quick_charge_duration == 0 && chargeStatus.get('inProgress')){
            log.info(`ac_quick_charge finished`)
            chargeStatus.set('startRequest', false)
            chargeStatus.set('inProgress', false)            
            await cache.set('ac_quick_charge', { state: 'OFF' })
            await mqtt.sendSensorValue(`solar_assistant/battery/ac_quick_charge`, 'OFF')
            return
        }
        //switch turned off
        if(ac_quick_charge?.state == 'OFF' && ac_quick_charge_duration > 0 && !chargeStatus.get('stopRequest')){
            log.info(`ac_quick_charge stopped`)
            chargeStatus.set('startRequest', false)
            chargeStatus.set('inProgress', false)          
            chargeStatus.set('stopRequest', true)  
            await cache.set('ac_quick_charge', { state: 'OFF' })
            await mqtt.sendSensorValue(`solar_assistant/battery/ac_quick_charge`, 'OFF')
            await inverters.queueWrite(234, 0)
            return
        }
        
        
    }catch(e){
        log.error(e)
    }
}