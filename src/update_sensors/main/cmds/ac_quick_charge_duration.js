import mqtt from '/app/src/mqtt/index.js'
import { dataList } from '/app/src/data_list.js';
import CONFIGS from '/app/config/config.json' with { type: 'json' };

const INVERTER_CONFIGS = CONFIGS?.inverters;

export default function(inv_num, data, influxWrite, timeNow, sensor_key, sensor, MASTER_INVERTER){
    if(inv_num != CONFIGS.write_inverter) return true

    dataList.main.ac_quick_charge_duration = data
    mqtt.sendSensorValue(`solar_inverter/battery/ac_quick_charge_duration/state`, dataList.main.ac_quick_charge_duration)
    return true
}