import acSolar from '/app/src/helpers/ac_solar.js'

export default async function(state){
    if(state == 'OFF'){
        await acSolar.disable()
    }else{
        await acSolar.enable()
    }
}