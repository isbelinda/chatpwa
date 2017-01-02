if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./service-worker.js')
        .then(function(reg){
            console.log('Service Worker Registered', reg);
        })
        .catch(function(err){
            console.log('Error registering Service Worker', err);
        })
}