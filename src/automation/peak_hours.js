import log from '/app/src/logger.js'
import mqtt from '/app/src/mqtt/index.js'
import cache from '/app/src/cache/index.js'
import { dataList } from '/app/src/data_list.js'

import { checkTimeBetween } from '/app/src/helpers/time.js'
import isSummer from '/app/src/helpers/is_summer.js'

export default async function(){
  let peak_start = dataList.schedule?.peak_start, peak_end = dataList.schedule?.peak_end, peak_hours = 'OFF', summer_peak_hours = 'OFF'
  
  if(!peak_start || !peak_end) return

  let isBetween = checkTimeBetween(peak_start, peak_end, 5, 5)
  
  if(isBetween) peak_hours = 'ON'
  if(isSummer()) summer_peak_hours = 'ON'
  if(dataList.schedule.peak_hours != peak_hours){
    dataList.schedule.peak_hours = peak_hours
    await cache.set('peak_hours', { state: peak_hours })
    log.info(`setting peak_hours to ${peak_hours}`)
  }
  if(dataList.schedule.summer_peak_hours != summer_peak_hours){
    await cache.set('summer_peak_hours', { state: summer_peak_hours })
    log.info(`setting summer_peak_hours to ${summer_peak_hours}`)
  }
  await mqtt.sendSensorValue(`solar_inverter/schedule/peak_hours/state`, dataList.schedule.peak_hours)
  await mqtt.sendSensorValue(`solar_inverter/schedule/summer_peak_hours/state`, dataList.schedule.summer_peak_hours)
}
