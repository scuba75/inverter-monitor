export default {
  pv_energy_dc: { name: `Energy {{NUM}} (DC)`, topic: `pv_energy_dc`,  dtu_topic: 'yieldday', config: { state_class: 'total', unit_of_measurement: 'Wh', device_class: 'energy' } },
  pv_power_dc: { name: `Power {{NUM}} (DC)`, topic: `pv_power_dc`, dtu_topic: 'power',config: { state_class: 'measurement', unit_of_measurement: 'W', device_class: 'power' } },
  pv_voltage_dc: { name: `Voltage {{NUM}} (DC)`, topic: `pv_voltage_dc`, dtu_topic: 'voltage', config: { state_class: 'measurement', unit_of_measurement: 'V', device_class: 'voltage' } },
  pv_current_dc: { name: `Current {{NUM}} (DC)`, topic: `pv_current_dc`, dtu_topic: 'current', config: { state_class: 'measurement', unit_of_measurement: 'A', device_class: 'current' } }
}
