import connected from './connected.js';
import last_update from './last_update.js';
import power from './power.js';
import producing from './producing.js';
import yieldday from './yield_day.js'
import yieldtotal from './yield_total.js'

export default async function( { serial, num }, topic, value){
    //console.log(`${num} : ${serial} : ${topic} : ${value}`)
    if(topic == `0/power`) return await power(serial, num, value)
    if(topic == `0/yieldday`) return await yieldday(serial, num, value)
    if(topic == `0/yieldtotal`) return await yieldtotal(serial, num, value)
    if(topic == `status/producing`) return await producing(serial, num, value)
    if(topic == `status/reachable`) return await connected(serial, num, value)
    if(topic == `status/last_update`) return await last_update(serial, num, value)
}