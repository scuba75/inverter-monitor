import mode from './mode.js'

const Cmds = { mode }

export default function( topic, value){
    if(Cmds[topic]) return Cmds[topic](value)
}