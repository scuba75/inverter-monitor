import log from '/app/src/logger.js'
import { dataList } from '/app/src/data_list.js'
import updateMain from './update_main.js';
import acSolar from '/app/src/helpers/ac_solar.js'

export default async function(inv_num, data, influxWrite, timeNow, sensor_key, sensor, MASTER_INVERTER){
    await updateMain(inv_num, data, influxWrite, timeNow, sensor_key, sensor, MASTER_INVERTER)
    if(!inv_num) return;
    if(!dataList?.micro_inverters) dataList.micro_inverters = {}
    if(!dataList?.micro_inverters[inv_num]) dataList.micro_inverters[inv_num] = {}
    let load_shedding = dataList.schedule.load_shedding || 'ON'
    if(load_shedding == 'ON') return;
    if(data > 0 && data < 300){
        dataList.micro_inverters[inv_num].low_grid = true
        log.info(`Disabling micro ${inv_num}`)
        await acSolar.disable(inv_num)
    }else{
        dataList.micro_inverters[inv_num].low_grid = false
        await acSolar.enable(inv_num)
    }
    //await mqtt.sendSensorValue(`open_dtu_dpl/${inv_num}/grid_power`, data)
}