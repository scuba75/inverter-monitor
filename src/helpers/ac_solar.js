import cache from '/app/src/cache/index.js'
import mqtt from '/app/src/mqtt/index.js';
import { dataList } from '/app/src/data_list.js';

async function enable(){
    let load_shedding = dataList.schedule.load_shedding
    if(!dataList.open_dtu) dataList.open_dtu = {}
    dataList.open_dtu.power_limiter = 'ON'
    dataList.open_dtu.solar_bypass = load_shedding
    await cache.set('power_limiter', { state: 'ON' }, 'cache')
    await mqtt.sendSensorValue(`micro_inverter/main/power_limiter/state`, 'ON' )
    await mqtt.sendSensorValue(`open_dtu/powerlimiter/cmd/mode`, load_shedding == 'OFF' ? 0:2 )    
}
async function disable(){
    if(!dataList.open_dtu) dataList.open_dtu = {}
    dataList.open_dtu.power_limiter = 'OFF'
    dataList.open_dtu.solar_bypass = 'OFF'
    await cache.set('power_limiter', { state: 'OFF' }, 'cache')
    await mqtt.sendSensorValue(`micro_inverter/main/power_limiter/state`, 'OFF' )
    await mqtt.sendSensorValue(`open_dtu/powerlimiter/cmd/mode`, 1 )
}

export default { enable, disable }