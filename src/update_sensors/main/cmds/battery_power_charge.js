import mqtt from '/app/src/mqtt/index.js'
import { dataList } from '/app/src/data_list.js';
import updateMain from './update_main.js';

export default async function(inv_num, data, influxWrite, timeNow, sensor_key, sensor, MASTER_INVERTER){
    await updateMain(inv_num, data, influxWrite, timeNow, sensor_key, sensor, MASTER_INVERTER)
    if(!dataList.main.battery_charged_today) dataList.main.battery_charged_today = 'OFF'
    if(dataList.main.battery_power_charge > 500 && dataList.main.battery_charged_today == 'ON'){
        dataList.main.battery_charged_today = 'ON'
    }
    await mqtt.sendSensorValue(`solar_inverter/schedule/battery_charged_today/state`, dataList.main.battery_charged_today);
}