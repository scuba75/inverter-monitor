export default {
  pv_energy_ac: { name: `Energy (AC)`, topic: `pv_energy_ac`,  dtu_topic: '0/yieldday', config: { state_class: 'total', unit_of_measurement: 'Wh', device_class: 'energy' } },
  pv_power_ac: { name: `Power (AC)`, topic: `pv_power_ac`, dtu_topic: '0/power',  config: { state_class: 'measurement', unit_of_measurement: 'W', device_class: 'power' } },
  pv_voltage_ac: { name: `Voltage (AC)`, topic: `pv_voltage_ac`, dtu_topic: '0/voltage', config: { state_class: 'measurement', unit_of_measurement: 'V', device_class: 'voltage' } },
  pv_current_ac: { name: `Current (AC)`, topic: `pv_current_ac`, dtu_topic: '0/current',  config: { state_class: 'measurement', unit_of_measurement: 'A', device_class: 'current' } },
  pv_inverter_temperature_ac: { name: `Temperature`, topic: `pv_inverter_temperature_ac`, dtu_topic: '0/temperature', config: { entity_category: 'diagnostic', state_class: 'measurement', unit_of_measurement: '°C', device_class: 'temperature' } },
  pv_inverter_serial_number: { name: `Serial`, topic: `pv_inverter_serial_number`, config: { entity_category: 'diagnostic' } },
  power_limit: { name: `Power Limit`, topic: `power_limit`, dtu_topic: `status/limit_absolute`, config: { state_class: 'measurement', unit_of_measurement: 'W', device_class: 'power' } },
  connected: { name: `Connected`, topic: `connected`, main: true, sensor_type: 'binary_sensor', retain: true, config: { entity_category: 'diagnostic', device_class : 'connectivity', expire_after: 60 } },
  producing: { name: `Producing`, topic: `producing`, main: true, sensor_type: 'binary_sensor', retain: true, config: { entity_category: 'diagnostic', device_class : 'connectivity', expire_after: 60 } }
}
