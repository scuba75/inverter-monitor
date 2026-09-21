import log from '/app/src/logger.js';
import cache from '/app/src/cache/index.js';
import mqtt from '/app/src/mqtt/index.js';
import getPreviousDate from '/app/src/helpers/get_previous_date.js'

export default async function(sensor_key, sensor_topic, sensor_id){
  try{
    let key = getPreviousDate();
    if(!key) return;

    let data = await cache.get(key, 'daily')

    if(!data?.main) return;

    let value = data.main[sensor_key] || 0;
    await mqtt.sendSensorValue(`solar_inverter/${sensor_id}/${sensor_topic.replace('_daily', '_yesterday')}/state`, value);

  }catch(e){
    log.error(e)
  }
}
