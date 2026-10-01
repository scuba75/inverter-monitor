import log from '/app/src/logger.js'
import { dataList } from '/app/src/data_list.js';
import cache from './cache.js'
import checkTime from './check_time.js'

import acSolar from '/app/src/helpers/ac_solar.js'

export default async function(){
    let grid_first_end = dataList.schedule?.grid_first_end
      if(!grid_first_end) return
      let runTask = checkTime('disable_ac_solar', grid_first_end, 10, -5)
      if(runTask){
        log.info(`Disabling AC Solar for swith to off grid power`)
        await acSolar.disable();
        cache.set('disable_ac_solar', true)
      }
}