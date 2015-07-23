require('./github')
var gui = require('nw.gui')
// var win = gui.Window.get()
// var exec = require('child_process').exec
// var cmd = 'cd ~/percolate/demo/ui && grunt watch'
// var psTree = require('ps-tree')
//
// var child = exec(cmd)
//
// child.stdout.on('data', function(data) {
//     console.log('stdout: ' + data);
// })
// child.stderr.on('data', function(data) {
//     console.log('stderr: ' + data);
// })
// child.on('close', function(code) {
//     console.log('closing code: ' + code);
// })
//
// var kill = function (pid, signal, callback) {
//     signal   = signal || 'SIGINT';
//     callback = callback || function () {}
//     var killTree = true;
//     if(killTree) {
//         psTree(pid, function (err, children) {
//             var pidArr = []
//             pidArr.push(pid)
//             pidArr.concat(
//                 children.map(function (p) {
//                     return p.PID;
//                 })
//             ).forEach(function (tpid) {
//                 try { process.kill(tpid, signal) }
//                 catch (ex) { }
//             })
//             callback()
//         });
//     } else {
//         try { process.kill(pid, signal) }
//         catch (ex) { }
//         callback()
//     }
// }
//
// win.on('close', function () {
//
//     var stop = exec('cd ~/percolate/demo/ui && grunt gae:stop')
//     stop.on('close', function() {
//         console.log('closed')
//         kill(child.pid)
//         win.close(true)
//     })
// })
