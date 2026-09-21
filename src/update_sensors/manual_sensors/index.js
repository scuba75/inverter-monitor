import batteryAcCharged from './battery_ac_charged.js'
import batteryAcCoupleDesired from './battery_ac_couple_desired.js'
import bridgeConnected from './bridge_connected.js'
import loadShedding from './load_shedding.js'
import peakHours from './peak_hours.js'
import summerPeakHours from './summer_peak_hours.js'

export default async function(){
  await batteryAcCharged()
  await batteryAcCoupleDesired()
  await bridgeConnected()
  await loadShedding()
  await peakHours()
  await summerPeakHours()
}
