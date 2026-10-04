import log from '/app/src/logger.js'
import { dataList } from '/app/src/data_list.js';
import cache from './cache.js'
import checkTime from './check_time.js'
import acSolar from '/app/src/helpers/ac_solar.js'

export default async function(){
    let grid_first_end = dataList.schedule?.grid_first_end
    if(!grid_first_end) return
    let runTask = checkTime('pre_grid_end', grid_first_end, 10, 10)
    
    if(runTask){
        log.info(`Setting pre grid end`)
        dataList.schedule.pre_grid_end = 'ON'
        await acSolar.disable();
        cache.set('pre_grid_end', true)
    }
    let status = cache.get('pre_grid_end')
    if(!status) dataList.schedule.pre_grid_end = 'OFF'
}