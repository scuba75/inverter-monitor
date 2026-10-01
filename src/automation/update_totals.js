import cache from '/app/src/cache/index.js'
import roundValue from '/app/src/helpers/round_value.js';
function getPreviousDate(timeZone = "America/New_York"){
    return Object.fromEntries(
        new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
        })
        .formatToParts(new Date(Date.now() - (24 * 60 * 60 * 1000)))
        .map(p => [p.type, p.value])
    );
}
function getCurrentDate(timeZone = "America/New_York"){
    return Object.fromEntries(
        new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        })
        .formatToParts(new Date(Date.now()))
        .map(p => [p.type, p.value])
    );
}
function getKey( parts = {}){
    return parseInt(`${parts.year}${parts.month}${parts.day}`)
}
async function updateMonthly(){
    let lastDate = getPreviousDate()
    let lastKey = getKey(lastDate)
    
    let data = await cache.get(`${lastDate.year}-${lastDate.month}`, 'monthly')
    if(!data) data = { month: lastDate.month, year: lastDate.year, pv_energy_dc: 0, pv_energy_ac: 0, grid_energy: 0, load_energy: 0, lastKey: 0, battery_charge: 0, battery_discharge: 0, battery_grid_charge: 0, num_days: 0 }
    for(let i = 0;i<32;i++){
        let s = i.toString().padStart(2, '0')
        let key = parseInt(`${lastDate.year}${lastDate.month}${s}`), id = `${lastDate.year}-${lastDate.month}-${s}`
        if(key > lastKey) break
        if(data.lastKey >= key) continue
        let mData = await cache.get(id, 'daily')
        if(!mData?.main) continue
        data.num_days++;
        data.pv_energy_dc += (mData.main.pv_energy_dc_daily || 0)
        data.pv_energy_ac += (mData.main.pv_energy_ac_daily || 0)
        data.grid_energy += (mData.main.grid_energy_daily || 0)
        data.load_energy += (mData.main.load_energy_daily || 0)
        data.battery_charge += (mData.main.battery_energy_charge_daily || 0)
        data.battery_discharge += (mData.main.battery_energy_discharge_daily || 0)
        data.battery_grid_charge += (mData.main.ac_charge_energy_daily || 0)
        data.lastKey = key
    }
    data.pv_energy_dc = roundValue(data.pv_energy_dc)
    data.pv_energy_ac = roundValue(data.pv_energy_ac)
    data.grid_energy = roundValue(data.grid_energy)
    data.load_energy = roundValue(data.load_energy)    
    data.battery_charge = roundValue(data.battery_charge)    
    data.battery_discharge = roundValue(data.battery_discharge)
    data.battery_grid_charge = roundValue(data.battery_grid_charge)
    data.pv_energy = roundValue(data.pv_energy_dc + data.pv_energy_ac)
    await cache.set(`${lastDate.year}-${lastDate.month}`, data, 'monthly')
}
export default async function(){
    await updateMonthly()
}
