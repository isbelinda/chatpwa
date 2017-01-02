app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'templates/home.html',
            controller: 'appController'
        })

        .state('chat', {
            url: '/chat',
            templateUrl: 'templates/chat.html',
            controller: 'chatController'
        })
}]);

app.run(['$rootScope', 'FIREBASE_CONFIG', 'localStorageService', '$state', function ($rootScope, FIREBASE_CONFIG, localStorageService, $state) {
    var config = FIREBASE_CONFIG;

    firebase.initializeApp(config);
    
    var info = localStorageService.get('_INFO');
    if(info){
        $rootScope.businessName = info.businessId;
        $rootScope.getInfo = true;
    } else {
        $rootScope.businessName = 'CHAT';
        $rootScope.getInfo = false;
    }

    $rootScope.logout = function () {
        console.log('logout');
        localStorageService.clearAll()
        $state.go('home');
        $rootScope.businessName = 'CHAT';
        $rootScope.getInfo = false;
    }
}]);