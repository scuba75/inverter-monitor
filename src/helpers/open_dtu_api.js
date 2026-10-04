import log from '/app/src/logger.js';

let OPENDTU_HOST = process.env.OPENDTU_HOST, OPENDTU_AUTH = process.env.OPENDTU_AUTH;

async function parseResponse(r) {
  let contentType = r?.headers.get("content-type");
  if (contentType && contentType?.indexOf("application/json") !== -1) return await r?.json();
}

async function apiRequest(uri, opts = {}){
    try{
        opts.signal = AbortSignal.timeout(10000)
        if(!opts.headers) opts.headers = {}
        opts.headers['Authorization'] = `Basic ${OPENDTU_AUTH}`
        let r = await fetch(`http://${OPENDTU_HOST}/api/${uri}`, opts);
        let res = await parseResponse(r);
        if (!r.ok) {
            if (res) log.error(JSON.stringify(res));
            return;
        }
        return res;
    }catch(e){
        log.error(e)
    }
}
async function reboot(){
    try{
        let opts = { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams() }
        opts.body.append('data', JSON.stringify({ reboot: true }))
        return await apiRequest(`maintenance/reboot`, opts)
    }catch(e){
        log.error(e)
    }
}
export default { reboot }