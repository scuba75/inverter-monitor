export default {
  load_power: { name: 'Load Power', topic: 'load_power', id: 'load', main: 'both', individual: true, config: { state_class: 'measurement', unit_of_measurement: 'W', device_class: 'power' } },
  load_power_low: { name: `Load Power Low`, topic: 'load_power_low', id: 'load', main: true, sensor_type: 'binary_sensor', retain: true, config: { icon: 'mdi:flash' } },
  max_load_power: { name: 'Load Power Max', topic: 'max_load_power', id: 'load', main: 'both', json_attributes: [ 'time' ], config: { state_class: 'measurement', unit_of_measurement: 'W', device_class: 'power' } },
  min_load_power: { name: 'Load Power Min ', topic: 'min_load_power', id: 'load', main: 'both', json_attributes: [ 'time' ], config: { state_class: 'measurement', unit_of_measurement: 'W', device_class: 'power' } },
  max_load_power_yesterday: { name: 'Load Power Max (Yesterday)', topic: 'max_load_power_yesterday', id: 'load', main: 'both', json_attributes: [ 'time' ], config: { state_class: 'measurement', unit_of_measurement: 'W', device_class: 'power' } },
  min_load_power_yesterday: { name: 'Load Power Min (Yesterday)', topic: 'min_load_power_yesterday', id: 'load', main: 'both', json_attributes: [ 'time' ], config: { state_class: 'measurement', unit_of_measurement: 'W', device_class: 'power' } }
}
