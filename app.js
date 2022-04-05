//node HID import
var HID = require('node-hid');
const { exec } = require('child_process');

//Device in for for ymd09
var VENDOR_ID = 0x594D; //22861
var PRODUCT_ID = 0x4409; //17417
var USAGE_PAGE = 0xFF60; //65376
var usagePageNumber = 65376;
var USAGE = 0x61; //97
var deviceList = HID.devices();
// console.log(deviceList);
var path = ''; 

deviceList.forEach(item => {
  if (item.usagePage == USAGE_PAGE) {
    path = item.path;
  }
});
var device = new HID.HID(path);
console.log(path);



const muteMicStopVid = () => {
    device.write([0x00, 0x01, 0x01, 0x01, 0x01, 0x01])
};
const muteMicStartVid = () => {
    device.write([0x00, 0x02, 0x02, 0x02, 0x02, 0x02])
};
const unmuteMicStopVid = () => {
  device.write([0x00, 0x03, 0x03, 0x03, 0x03, 0x03])
};
const unmuteMicStartVid = () => {
  device.write([0x00, 0x04, 0x04, 0x04, 0x04, 0x04])
};






var checkStatus = function() {
    console.log('Checking status...');
    exec('osascript get-zoom-status_with-video.scpt', (error, stdout, stderr) => {
        console.log(stdout);
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }

        var status = JSON.parse(stdout);
        if (status.mute == "muted" && status.video == "stop") {
          muteMicStopVid();
        } else if (status.mute == "muted" && status.video == "start") {
          muteMicStartVid();
        } else if (status.mute == "unmuted" && status.video == "stop") {
          unmuteMicStopVid();
        } else if (status.mute == "unmuted" && status.video == "started") {
          unmuteMicStartVid();
        }

    });
}


checkStatus();
setInterval(checkStatus, 3000);



