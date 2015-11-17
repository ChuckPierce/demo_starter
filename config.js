var nconf = require('./node_modules/nconf').file({file: getUserHome() + '/demo-server-pid.json'})

function savePid(key, settingValue) {
    nconf.set(key, settingValue)
    nconf.save()
}

function readPid(key) {
    nconf.load()
    return nconf.get(key)
}

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']
}

function clearPid(key) {
    nconf.set(key, '')
    nconf.save()
}

function getDemoPath() {
    nconf.load()
    return nconf.get('demoPath')
}

function saveDemoPath(path) {
    nconf.set('demoPath', path)
    nconf.save()
}

module.exports = {
    savePid: savePid,
    readPid: readPid,
    clearPid: clearPid,
    getDemoPath: getDemoPath,
    saveDemoPath: saveDemoPath,
}
