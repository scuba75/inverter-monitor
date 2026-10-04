import cache from '/app/src/cache/index.js'
import mqtt from '/app/src/mqtt/index.js';

import esp_restart from './esp_restart.js';
import power_limiter from './power_limiter.js';

const Cmds = { esp_restart, power_limiter }
export default async function(topic, value){
    cache.set(topic, { state: value }, 'cache')
    await mqtt.sendSensorValue(`micro_inverter/main/${topic}/state`, value)
    if(Cmds[topic]) return Cmds[topic](value)
}