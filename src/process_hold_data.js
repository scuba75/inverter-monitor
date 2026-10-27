import log from '/app/src/logger.js'
import mqtt from '/app/src/mqtt/index.js'
import cache from '/app/src/cache/index.js'
import { decodeValue } from '/app/src/helpers/register_time.js'
import { dataList } from '/app/src/data_list.js';
import all_sensors from '/app/src/sensor_configs/index.js'

function isAcCouplingEnabled(value) {
  return (value & (1 << 11)) !== 0;
}

function enableAcCoupling(value) {
  return value | (1 << 11);
}
function disableAcCoupling(value) {
  return value & ~(1 << 11);
}
async function processAcCharge(data = {}, queueWrite){
  if(!dataList?.battery) dataList.battery = {}
  let ac_quick_charge_duration = data.ac_quick_charge_duration, battery_soc = dataList?.main?.battery_soc || 0
  
  let ac_quick_charge = await cache.get('ac_quick_charge')
  //switched off
  if(ac_quick_charge?.state == 'OFF' && ac_quick_charge_duration > 0){
    log.info(`ac_quick_charge is OFF, setting ac_quick_charge_duration to 0`);
    return await queueWrite(234, 0)
  }
  //charge started
  if(ac_quick_charge?.state == 'ON' && battery_soc < 100 && ac_quick_charge_duration == 0){
    log.info(`ac_quick_charge is ON, battery_soc is ${battery_soc}, ac_quick_charge_duration: ${ac_quick_charge_duration}. setting ac_quick_charge_duration to 60`);
    return await queueWrite(234, 60)
  }
  //charge finished
  if(ac_quick_charge?.state == 'ON' && battery_soc >= 100){
    log.info(`battery_soc is ${battery_soc} disabling ac quick charge`)
    await cache.set('ac_quick_charge', { state: 'OFF' })
    dataList.battery.ac_quick_charge = 'OFF'
    if(ac_quick_charge_duration > 0) await queueWrite(234, 0)
    return
  }
}
async function processSchedule(data = {}, queueWrite){
  for (let i in data) {
      if (!i || !data[i] || !data[i]?.raw) continue;
      let sensor = all_sensors[i]
      if(!sensor) continue;

      let decodedValue = decodeValue(data[i].raw);
      if (!decodedValue) continue;

      if (!dataList.schedule) dataList.schedule = {};
      dataList.schedule[i] = decodedValue;


      if(sensor.topic && sensor.id){
        await mqtt.sendSensorValue(`solar_inverter/${sensor.id}/${sensor.topic}/state`, decodedValue);
        await mqtt.sendSensorValue(`solar_inverter/${sensor.id}/${sensor.topic}_attribute/state`, JSON.stringify({ register: data[i].register, raw: data[i].raw }))
      }

      let desired = await cache.get(i);
      if (!desired?.raw) {
        await cache.set(i, { raw: data[i].raw, decodedValue: decodedValue, register: data[i].register });
        desired = await cache.get(i);
      }
      if (desired?.decodedValue && sensor.topic && sensor.id) {
        let desired_topic = `${sensor.topic}_desired`;
        if (!dataList.schedule) dataList.schedule = {};
        dataList.schedule[desired_topic] = desired?.decodedValue;
        await mqtt.sendSensorValue(`solar_inverter/${sensor.id}/${desired_topic}/state`, desired?.decodedValue);
      }

      if (desired?.raw != data[i].raw && data[i].register > 0 && desired?.raw >= 0){
        //console.log(desired)
        //console.log(d.data.schedule[i])
        queueWrite(data[i].register, desired.raw)
      };
    }
}
async function processFunctionEnable(data, queueWrite){
  if(data?.register !== 179) return;

  let desired = await cache.get('ac_coupling_switch');
  let desired_value = disableAcCoupling(data.raw)
  if(desired?.state == 'ON') desired_value = enableAcCoupling(data.raw)
  
  if(desired_value == data.raw) return
  if(desired_value >= 0) queueWrite(data?.register, desired_value)
}
export default async function(d, queueWrite){
  try{
    if(d?.data?.schedule) await processSchedule(d.data.schedule, queueWrite)
    if(d?.data?.func_en2) await processFunctionEnable(d.data.func_en2, queueWrite)
    if(d?.data?.ac_charge) await processAcCharge(d.data.ac_charge, queueWrite)
    
  }catch(e){
    log.error(e)
  }
}
