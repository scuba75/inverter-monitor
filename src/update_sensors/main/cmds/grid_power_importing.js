import mqtt from '/app/src/mqtt/index.js'
import updateMain from './update_main.js';

export default async function(inv_num, data, influxWrite, timeNow, sensor_key, sensor, MASTER_INVERTER){
    await updateMain(inv_num, data, influxWrite, timeNow, sensor_key, sensor, MASTER_INVERTER)
    await mqtt.sendSensorValue(`open_dtu_dpl/${inv_num}/grid_power`, data)
}