import log from '/app/src/logger.js';
import { dataList } from '/app/src/data_list.js';
import mqtt from '/app/src/mqtt/index.js';

import CONFIGS from '/app/config/config.json' with { type: 'json' };
import all_sensors from '/app/src/sensor_configs/index.js'

import updateMain from './update_main.js'

const INVERTER_CONFIGS = CONFIGS?.inverters;

let MASTER_INVERTER = 1;

export default async function(inv_num, data, influxWrite, timeNow, queueWrite){
  try{
    if(!inv_num || !data || !dataList?.inverters[inv_num]) return;

    if (data?.isMaster) MASTER_INVERTER = inv_num;
    if (!dataList.main) dataList.main = {};

    dataList.inverters[inv_num].connected = timeNow
    if(data?.status){
      dataList.inverters[inv_num].status = data.status
      await updateMain(inv_num, data?.status, influxWrite, timeNow, 'status', null, MASTER_INVERTER)
    }
    /*
    if(data?.ac_quick_charge_duration >= 0 && data?.isMaster){
      console.log(inv_num)
      console.log(data.uFunction4En)
      console.log(data.ac_quick_charge_duration)
      await queueWrite(2, 234, 0)
    }
      */
    await mqtt.sendSensorValue(`solar_inverter/${inv_num}/status/bridge_connected/state`, 'ON')
    for(let i in data){
      if (!i || (!data[i] && +(data[i] != 0))) continue;
      dataList.inverters[inv_num][i] = data[i];

      let sensor = all_sensors[i]
      if(!sensor || !sensor.id) continue

      if(sensor.main) await updateMain(inv_num, data[i], influxWrite, timeNow, i, sensor, MASTER_INVERTER)
      if(sensor.individual){
        let state_topic = `solar_inverter/${inv_num}/${sensor.id}/${sensor.topic}/state`
        mqtt.sendSensorValue(state_topic, data[i]);
        influxWrite(i, `inverter_${inv_num}`, data[i], sensor?.config?.unit_of_measurement || sensor?.unit_of_measurement, timeNow);
      }
    }
  }catch(e){
    log.error(e)
  }
}
