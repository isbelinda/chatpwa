var app = angular.module('chatPWAApp', ['ui.router', 'firebase', 'LocalStorageModule']);

app.constant('FIREBASE_CONFIG', {
    apiKey: "AIzaSyBRccipNzuLK6veZgpAQPOIUEZAu8Mpy5o",
    authDomain: "fir-webchat-31ebc.firebaseapp.com",
    databaseURL: "https://fir-webchat-31ebc.firebaseio.com",
    storageBucket: "fir-webchat-31ebc.appspot.com",
    messagingSenderId: "588615177650"
});

app.controller('appController', ['$scope', '$state', 'localStorageService', '$firebaseArray', '$firebaseObject', '$rootScope', function($scope, $state, localStorageService, $firebaseArray, $firebaseObject, $rootScope){

    if(localStorageService.get('_INFO')){
        console.log(localStorageService.get('_INFO'));
        $state.go('chat');
    }

    $scope.send = function (data) {
        if(data.businessId && data.username){
            localStorageService.set('_INFO', data);
            var getRooms = firebase.database().ref('chatRooms').child(data.businessId)
            var getRoom = getRooms.child(data.username);

            var newRoom = {
                roomName: data.username,
                createdDate: Date.now(),
                timeStamp: Date.now()
            };

            getRooms.once('value', function(snapshot) {
                var count = 0;
                snapshot.forEach(function(childSnapshot) {
                    var childData = childSnapshot.val();

                    if(data.username === childData.roomName){
                        console.log(childData.roomName);
                        count++;
                        $state.go('chat');
                        $rootScope.getInfo = true;
                        $rootScope.businessName = data.businessId;
                    }
                });

                if(count === 0){
                    getRoom.set(newRoom);
                    $state.go('chat');
                    $rootScope.getInfo = true;
                    $rootScope.businessName = data.businessId;
                }
            });

        }
    }
}]);

app.controller('chatController', ['$scope', '$firebaseArray', '$firebaseObject', 'localStorageService', '$state', function($scope, $firebaseArray, $firebaseObject, localStorageService, $state){
    var info = localStorageService.get('_INFO');
    if(!info){
        $state.go('home');
    }
    var getMessages = firebase.database().ref('chatRooms').child(info.businessId).child(info.username);
    // var getMessages = firebase.database().ref('chatRooms').child('mixhotel').child('huaweip9'); // use

    $scope.infoRoom = $firebaseObject(getMessages);

    $scope.username = info.username;

    function init (){
        var msgSync = getMessages.child('chatMessage');
        $scope.items = $firebaseArray(msgSync);
    }

    $scope.addMessage = function(){
        if(!$scope.newText) return false;

        $scope.infoRoom.timeStamp = Date.now();

        var data = {
            username: info.username,
            text: $scope.newText,
            postedDate: Date.now()
        };

        $scope.infoRoom.$save().then(function(){
            $scope.items.$add(data);
        }).catch(function(error){
            console.log('error', error)
        });

        $scope.newText = '';
    };

    init();

}]);

app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

app.directive('scrollBottom', function () {
    return {
        scope: {
            scrollBottom: "="
        },
        link: function (scope, element) {
            scope.$watchCollection('scrollBottom', function (newValue) {
                if (newValue)
                {
                    console.log(element[0].scrollTop = element[0].scrollHeight);
                    element[0].scrollTop = element[0].scrollHeight;
                }
            });
        }
    }
});