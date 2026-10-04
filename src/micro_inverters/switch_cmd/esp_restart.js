import log from '/app/src/logger.js'
import cache from '/app/src/cache/index.js'
import mqtt from '/app/src/mqtt/index.js';
import openDTUapi from '/app/src/helpers/open_dtu_api.js'

async function reboot(){
    let status = await openDTUapi.reboot()
    if(status?.type != 'success') return setTimeout(reboot, 5000)
    log.info(`OpenDTU Rebooted...`)
    cache.set('esp_restart', { state: 'OFF' }, 'cache')
    await mqtt.sendSensorValue(`micro_inverter/main/esp_restart/state`, 'OFF')
}
export default async function(state){
    if(state == 'ON') await reboot()
}