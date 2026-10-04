import { dataList } from '/app/src/data_list.js'
import mqtt from '/app/src/mqtt/index.js'
import cache from '/app/src/cache/index.js'
import { checkTimeBetween } from '/app/src/helpers/time.js'

import acSolar from '/app/src/helpers/ac_solar.js'


function checkTime(){
  let grid_end = dataList.schedule.grid_first_end, grid_start = dataList.schedule.peak_end, load_shedding_start = false
  if(!grid_end || !grid_start) return
  return checkTimeBetween(grid_end, grid_start, 1, 0)
}
function getState(){
  if(dataList.schedule.pre_grid_end == 'ON') return 'ON'
  if(checkTime()) return 'ON'
  if(dataList.main.grid_available == 'OFF') return 'ON'
  if(dataList.main.grid_importing == 'OFF') return 'ON'
  if(dataList.schedule.peak_hours == 'ON') return 'ON'
  return 'OFF'
}
export default async function(){
  let load_shedding_state = getState()
  if(dataList.schedule.load_shedding != load_shedding_state){
    cache.set('load_shedding', { state: load_shedding_state })
  }
  
  dataList.schedule.load_shedding = load_shedding_state
  
  await mqtt.sendSensorValue('solar_inverter/schedule/load_shedding/state', dataList.schedule.load_shedding)
  
  if(load_shedding_state == 'ON') await acSolar.enable()
  let power_limiter = await cache.get('power_limiter', 'cache')
  if(!power_limiter) power_limiter = { state: 'OFF' }
  
  if(load_shedding_state == 'ON'){
    if(dataList.main.grid_importing == 'OFF'){
      if(power_limiter.state == 'OFF') await acSolar.enable()
      await mqtt.sendSensorValue(`open_dtu/powerlimiter/cmd/mode`, 2 ) 
    }       
  }else{
    if(power_limiter.state == 'ON') await mqtt.sendSensorValue(`open_dtu/powerlimiter/cmd/mode`, 0 )
  }
}
