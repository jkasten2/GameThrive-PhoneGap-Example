cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.gamethrive.plugins.GameThrive/www/GameThrive.js",
        "id": "com.gamethrive.plugins.GameThrive.GameThrive",
        "clobbers": [
            "GameThrive"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.gamethrive.plugins.GameThrive": "1.0.1",
    "org.apache.cordova.device": "0.2.12"
}
// BOTTOM OF METADATA
});