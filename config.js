var nconf = require('nconf').file({file: getUserHome() + '/demo-server-pid.json'})

function savePid(settingValue) {
    nconf.set('pid', settingValue)
    nconf.save()
}

function readPid() {
    nconf.load()
    return nconf.get('pid')
}

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']
}

function clearPid() {
    nconf.set('pid', '')
    nconf.save()
}

module.exports = {
    savePid: savePid,
    readPid: readPid,
    clearPid: clearPid,
}
