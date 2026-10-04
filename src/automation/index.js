import log from '/app/src/logger.js'
import cache from './cache.js'

import acQuickCharge from './ac_quick_charge.js'
import dailyBridgeReset from './daily_bridge_reset.js'
import dailyUpdate from './daily_update.js'
import disableExtendedSummer from './disable_extended_summer.js'
import openDTUStatus from './open_dtu_status.js'
import preGridEnd from './pre_grid_end.js'
import resetBridge from './reset_bridge.js'
import updateTotals from './update_totals.js'

async function sync(){
  try{
    if(!cache.status()) return setTimeout(sync, 5000)
    await acQuickCharge();
    await dailyBridgeReset()
    await dailyUpdate()
    await disableExtendedSummer()
    await openDTUStatus();
    await preGridEnd();
    await resetBridge();
    await updateTotals();
    setTimeout(sync, 10 * 1000)
  }catch(e){
    log.error(e)
    setTimeout(sync, 5000)
  }
}
export default { start: sync }
