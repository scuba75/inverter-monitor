import uptime from './uptime.js'

const Cmds = { uptime }
export default async function( topic, value){
    if(Cmds[topic]) return Cmds[topic](topic, value)
}