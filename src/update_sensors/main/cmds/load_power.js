import mqtt from '/app/src/mqtt/index.js'
import { dataList } from '/app/src/data_list.js';
import zonedTimestamp from '/app/src/helpers/zoned_time_stamp.js';
import cache from '/app/src/cache/index.js';
import getPreviousDate from '/app/src/helpers/get_previous_date.js'
import updateMain from './update_main.js';

import CONFIGS from '/app/config/config.json' with { type: 'json' };

const INVERTER_CONFIGS = CONFIGS?.inverters;

export default async function(inv_num, data, influxWrite, timeNow, sensor_key, sensor, MASTER_INVERTER){
    await updateMain(inv_num, data, influxWrite, timeNow, sensor_key, sensor, MASTER_INVERTER);
    dataList.main.load_power_low = dataList?.main?.load_power < 2000 ? 'ON':'OFF'
    await mqtt.sendSensorValue(`solar_inverter/load/load_power_low/state`, dataList.main.load_power_low)

    let key = zonedTimestamp(Date.now()), current_load_power_date = dataList.main.load_power_date
    if(!key?.date || !key?.time) return;
    
    if(key.date !== current_load_power_date){
        dataList.main.max_load_power = 0;
        dataList.main.min_load_power = 99999;
        dataList.main.load_power_date = key.date
    }
    let current_load_power = 0, max_load_power = dataList.main.max_load_power || 0, min_load_power = dataList.main.min_load_power || 99999
    
    for(let i of INVERTER_CONFIGS){
        if(!dataList.inverters[i.inverter_num]?.load_power) return;

        current_load_power += parseInt(dataList.inverters[i.inverter_num]?.load_power)
    }
    if(current_load_power > max_load_power || current_load_power < min_load_power){
        if(current_load_power > max_load_power){
            dataList.main.max_load_power = current_load_power
            dataList.main.max_load_time = key?.time
        } 
        if(current_load_power < min_load_power){
            dataList.main.min_load_power = current_load_power
            dataList.main.min_load_time = key?.time
        }
    }
    
    mqtt.sendSensorValue(`solar_inverter/load/max_load_power/state`, dataList.main.max_load_power);
    mqtt.sendSensorValue(`solar_inverter/load/max_load_power_attribute/state`, JSON.stringify({ time: dataList.main.max_load_time }));

    mqtt.sendSensorValue(`solar_inverter/load/min_load_power/state`, dataList.main.min_load_power);
    mqtt.sendSensorValue(`solar_inverter/load/min_load_power_attribute/state`, JSON.stringify({ time: dataList.main.min_load_time }));
    let previous_key = getPreviousDate();
    if(!previous_key) return;

    let previous_data = await cache.get(previous_key, 'daily')
    if(previous_data?.main?.min_load_power){
        mqtt.sendSensorValue(`solar_inverter/load/min_load_power_yesterday/state`, previous_data.main.min_load_power);
        if(previous_data?.main?.min_load_time) mqtt.sendSensorValue(`solar_inverter/load/min_load_power_yesterday_attribute/state`, JSON.stringify({ time: previous_data.main.min_load_time }));
    }
    if(previous_data?.main?.max_load_power){
        mqtt.sendSensorValue(`solar_inverter/load/max_load_power_yesterday/state`, previous_data.main.max_load_power);
        if(previous_data?.main?.max_load_time) mqtt.sendSensorValue(`solar_inverter/load/max_load_power_yesterday_attribute/state`, JSON.stringify({ time: previous_data.main.max_load_time }));
    }
}