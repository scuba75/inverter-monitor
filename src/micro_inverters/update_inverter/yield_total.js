import { dataList } from '/app/src/data_list.js'

export default function(serial, inv_num, value){
    if(!dataList.micro_inverters[inv_num]) dataList.micro_inverters[inv_num] = {}
    dataList.micro_inverters[inv_num].pv_energy_ac_total = parseFloat(value)
    if(dataList.inverters[inv_num]) dataList.inverters[inv_num].pv_energy_ac_total = parseFloat(value)
}