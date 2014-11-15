/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        console.log("initialize: function() {");
        alert("initialize: function() {");
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        var gameThrive = window.plugins.GameThrive;
        if (device.platform == "Android") {
            gameThrive.register(app.successHandler, app.errorHandler,{"senderID":"703322744261","ecb":"app.onNotificationGCM"});
        }
        else if (device.platform == "iPhone") {
            gameThrive.register(
                app.tokenHandler,
                app.errorHandler,
                {
                    "badge":"true",
                    "sound":"true",
                    "alert":"true",
                    "ecb":"onNotificationAPN"
                });
        }
    },
    // result contains any message sent from the plugin call
    successHandler: function(result) {
        alert('Callback Success! Result = '+result)
    },
    errorHandler: function(error) {
        alert(error);
    },
    tokenHandler: function(pushToken) {
        console.log('pushToken = ' + pushToken);
        alert('pushToken = ' + pushToken);
    },
    onNotificationGCM: function(e) {
        switch( e.event ) {
            case 'registered':
                if ( e.regid.length > 0 ) {
                    console.log("Regid " + e.regid);
                    alert('registration id = '+e.regid);
                    app.sendPushToken(e.regid);
                }
            break;
 
            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
              alert('message = '+e.alert+' msgcnt = '+e.msgcnt);
            break;
 
            case 'error':
              alert('GCM error = '+e.msg);
            break;
 
            default:
              alert('An unknown GCM event has occurred');
            break;
        }
    },
    sendPushToken: function(pushToken) {
        var playerId = window.localStorage.getItem("playerId");
        var device_type = (device.platform == "Android" ? 1 : 0);
        var sendURL;

        if (playerId == null) {
            sendURL = "http://10.0.1.233:3000/api/v1/players";
        }
        else  {
            sendURL = "http://10.0.1.233:3000/api/v1/players/" + playerId + "/on_session";
        }

        var jsonData = {
                       app_id: "5eb5a37e-b458-11e3-ac11-000c2940e62c",
                       device_type: device_type,
                       identifier: pushToken,
                       timezone: (new Date()).getTimezoneOffset() * -60
                    };
        $.ajax({
          type: "POST",
          dataType: "json",
          url: sendURL,
          data: jsonData,
          success: function(response) {
            window.localStorage.setItem("playerId", response.id);
            console.log("Device registered with GameThrive!");
          },
          error: function (e) {
            console.log("Device failed registering with GameThrive: " + e);
          }
        });

    }
};
