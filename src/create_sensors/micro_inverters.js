import log from '/app/src/logger.js';
import createSensor from './create_sensor.js'

import CONFIGS from '/app/config/config.json' with { type: 'json' };

const INVERTER_CONFIGS = CONFIGS?.micro_inverters;

let MICRO_INVERTER_SN = [], OPENDTU_HOST = process.env.OPENDTU_HOST, OPENDTU_AUTH = process.env.OPENDTU_AUTH;
if (process.env.MICRO_INVERTER_SN) MICRO_INVERTER_SN = JSON.parse(process.env.MICRO_INVERTER_SN);

const STRING_COUNT = +(process.env.STRING_COUNT || 4);

import { main_sensors, individual_sensors, string_sensors } from '/app/src/sensor_configs/micro_inverters/index.js'

async function createACInverter(inv){
  if(!inv?.num || !inv?.serial) return
  let inverter_num = inv.num
  let inv_device = { name: `HM-1200NT-${inverter_num}`, identifiers: [`micro_inverter_${inverter_num}`], via_device: `solar_micro_inverter_main` };
  for(let t in individual_sensors){
    if(!individual_sensors[t]) continue
    let config = {
      name: individual_sensors[t].name,
      state_topic: `micro_inverter/${inverter_num}/${individual_sensors[t].topic}/state`,
      unique_id: `micro_inverter_${inverter_num}_${individual_sensors[t].topic}`,
      device: JSON.parse(JSON.stringify(inv_device))
    }
    if(individual_sensors[t].dtu_topic) config.state_topic = `open_dtu/${inv.serial}/${individual_sensors[t].dtu_topic}`
    if(individual_sensors[t].config) config = { ...config, ...individual_sensors[t].config }
    await createSensor(individual_sensors[t], config, `homeassistant/${individual_sensors[t].sensor_type || 'sensor'}/micro_inverter_${inverter_num}/${individual_sensors[t].topic}/config`)
  }
  for(let s = 1; s < (STRING_COUNT + 1); s++){
    for(let x in string_sensors){
      if(!string_sensors[x]) continue
      let info = JSON.parse(JSON.stringify(string_sensors[x]))
      let config = {
        name: info.name?.replace('{{NUM}}', s),
        state_topic: `micro_inverter/${inverter_num}/string/${s}/${info.topic}/state`,
        unique_id: `micro_inverter_${inverter_num}_${s}_${info.topic}`,
        device: JSON.parse(JSON.stringify(inv_device))
      }
      if(string_sensors[x].dtu_topic) config.state_topic = `open_dtu/${inv.serial}/${s}/${string_sensors[x].dtu_topic}`
      if(info.config) config = { ...config, ...info.config }
      await createSensor(info, config, `homeassistant/${info.sensor_type || 'sensor'}/micro_inverter_${inverter_num}_${s}/${info.topic}/config`)
    }
  }
}

export default async function(){
  try{
    if (!INVERTER_CONFIGS || INVERTER_CONFIGS?.length == 0) return;
    let main_device = { name: `Open DTU`, identifiers: [`solar_micro_inverter_main`] };
    for(let i in main_sensors){
      if(!main_sensors[i]) continue
      let config = {
        name: main_sensors[i].name,
        state_topic: `micro_inverter/main/${main_sensors[i].topic}/state`,
        unique_id: `micro_inverter_main_${main_sensors[i].topic}`,
        device: JSON.parse(JSON.stringify(main_device))
      }
      if(main_sensors[i].dtu_topic) config.state_topic = `open_dtu/${main_sensors[i].dtu_topic}`
      if(main_sensors[i].command) config.command_topic = `open_dtu/${main_sensors[i].sensor_type || 'sensor'}_cmd/${main_sensors[i].topic}`
      if(main_sensors[i].config) config = { ...config, ...main_sensors[i].config }
      await createSensor(main_sensors[i], config, `homeassistant/${main_sensors[i].sensor_type || 'sensor'}/micro_inverter_main/${main_sensors[i].topic}/config`)
    }
    
    for(let i of INVERTER_CONFIGS){
      if(i.type == 'ac') await createACInverter(i)
    }
    /*
    for(let i in MICRO_INVERTER_SN){
      let inverter_num = +i + 1;
      let inv_device = { name: `HM-1200NT-${inverter_num}`, identifiers: [`micro_inverter_${inverter_num}`], via_device: `solar_micro_inverter_main` };
      for(let t in individual_sensors){
        if(!individual_sensors[t]) continue
        let config = {
          name: individual_sensors[t].name,
          state_topic: `micro_inverter/${inverter_num}/${individual_sensors[t].topic}/state`,
          unique_id: `micro_inverter_${inverter_num}_${individual_sensors[t].topic}`,
          device: JSON.parse(JSON.stringify(inv_device))
        }
        if(individual_sensors[t].config) config = { ...config, ...individual_sensors[t].config }
        await createSensor(individual_sensors[t], config, `homeassistant/${individual_sensors[t].sensor_type || 'sensor'}/micro_inverter_${inverter_num}/${individual_sensors[t].topic}/config`)
      }
      for(let s = 0; s < STRING_COUNT; s++){
        for(let x in string_sensors){
          if(!string_sensors[x]) continue
          let info = JSON.parse(JSON.stringify(string_sensors[x]))
          let config = {
            name: info.name?.replace('{{NUM}}', s),
            state_topic: `micro_inverter/${inverter_num}/string/${s}/${info.topic}/state`,
            unique_id: `micro_inverter_${inverter_num}_${s}_${info.topic}`,
            device: JSON.parse(JSON.stringify(inv_device))
          }
          if(info.config) config = { ...config, ...info.config }
          await createSensor(info, config, `homeassistant/${info.sensor_type || 'sensor'}/micro_inverter_${inverter_num}_${s}/${info.topic}/config`)
        }
      }
    }
    */
    log.info(`Created all Micro Inverter Sensors...`);
    return true;
  }catch(e){
    log.error(e)
  }
}
