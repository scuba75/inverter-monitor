import mqtt from '/app/src/mqtt/index.js'
import { dataList } from '/app/src/data_list.js';

const INVERTER_STATE = {
  "0": "Standby",
  "2": "FW Updating",
  "4": "PV On-grid",
  "8": "PV Charge",
  "12": "PV Charge/Grid",
  "16": "PV & Battery/Grid",
  "17": "Bypass",
  "20": "PV & Battery/Grid",
  "25": "PV Charge/Bypass",
  "32": "AC Charge",
  "40": "PV & AC Charge",
  "64": "Battery",
  "128": "PV Off Grid",
  "136": "PV Charge Off Grid",
  "192": "PV & Battery Off Grid"
}

export default function(inv_num, data, influxWrite, timeNow, sensor_key, sensor, MASTER_INVERTER){
    if(dataList.inverters[inv_num]) dataList.inverters[inv_num].status = data
    if(inv_num == MASTER_INVERTER && INVERTER_STATE[data]){
        dataList.main.status_text = INVERTER_STATE[data]
        mqtt.sendSensorValue(`solar_inverter/status/status_text/state`, dataList.main.status_text)
    }
}