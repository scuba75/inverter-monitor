import microInverters from '/app/src/micro_inverters/index.js'

import Cmds from '/app/src/cmds/index.js'

export default async function(topic, value){
  if(topic?.startsWith('open_dtu')) return microInverters(topic, value)
  let array = topic.split('/')
  if(!array || array?.length < 4) return

  let cmd = array[2], id = array[3]

  if(Cmds[cmd]) Cmds[cmd](id, value)
};
