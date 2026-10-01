export default {
  pv_energy_daily: { name: `Energy (Daily)`, topic: `pv_energy_daily`, main: true, config: { state_class: 'total', unit_of_measurement: 'kWh', device_class: 'energy' } },
  pv_energy_total: { name: `Energy (Total)`, topic: `pv_energy_total`, main: true, config: { state_class: 'total', unit_of_measurement: 'kWh', device_class: 'energy' } },
  pv_power_ac: { name: `Power`, topic: `pv_power_ac`, main: true, config: { state_class: 'measurement', unit_of_measurement: 'W', device_class: 'power' } },
  pv_power_ac_1: { name: `Power 1`, topic: `pv_power_ac_1`, main: true, config: { state_class: 'measurement', unit_of_measurement: 'W', device_class: 'power' } },
  pv_power_ac_2: { name: `Power 2`, topic: `pv_power_ac_2`, main: true, config: { state_class: 'measurement', unit_of_measurement: 'W', device_class: 'power' } },
  ip: { name: `IP Address`, topic: `ip`, main: true, dtu_topic: 'ip', config: { icon: 'mdi:ip-network' } },
  status: { name: `Status`, topic: `status`, main: true, sensor_type: 'binary_sensor', retain: true, config: { entity_category: 'diagnostic', device_class : 'connectivity', expire_after: 60 } },
  power_limiter: { name: `Power Limiter`, topic: `power_limiter`, main: true, sensor_type: 'switch',  command: 'true', retain: true, config: { device_class: `outlet` } }
}
