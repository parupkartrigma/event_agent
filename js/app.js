var bones = angular.module('bones', ['ngResource', 'ngRoute', 'kinvey']);
var $injector = angular.injector(['ng', 'kinvey']);
$injector.invoke(['$kinvey', '$window',
    function($kinvey, $window) {
        $kinvey.init({
            appKey: 'kid_eesMzwMN6O',
            appSecret: '78d3cb65f708427cbbd9e62613727a55'
        }).then(function() {
            angular.bootstrap(document.body, ['bones']);
            $window.jQuery('body').fadeIn();
        });

    }
]);

bones.run(function($rootScope, $location, $kinvey, $http, $window) {
    $rootScope.user = {};

    if ($kinvey.getActiveUser()) {
        var user = $kinvey.getActiveUser();
        window.location.href = "index.html";
    }





    $rootScope.login = function() {
        $rootScope.loading = true;
        $rootScope.dump = {};
        if ($rootScope.username) {
            var promise = $kinvey.User.login({
                username: $rootScope.username,
                password: $rootScope.password
            });
            promise.then(function(response) {
                window.location.href = "index.html";
            }, function(error) {

                if (error.error == 'pending' || error.error == 'expired') {
                    if ($kinvey.getToken()) {
                        $rootScope.selectPlan = true;
                        $http({
                            method: 'GET',
                            url: 'https://baas.kinvey.com/appdata/kid_eesMzwMN6O/plans/',
                            headers: {
                                'Authorization': 'Kinvey ' + $kinvey.getToken()
                            }
                        }).success(function(plans, status, headers, config) {
                            for (var i in plans) {
                                plans[i].yearly = plans[i].price * 12;
                            }
                            $rootScope.plans = plans;
                            $rootScope.selectPlan = true;
                            $rootScope.loading = false;
                        }).error(function(error, status, headers, config) {
                            $rootScope.loading = false;
                            $rootScope.dump.message = error.description;
                            $rootScope.dump.type = 'alert-error';
                        });
                    }
                }
                $rootScope.loading = false;
                $rootScope.dump.message = error.description;
                $rootScope.dump.type = 'alert-error';
            });
        } else {
            $rootScope.loading = false;
            $rootScope.dump.message = 'Please enter your username and password!';
            $rootScope.dump.type = 'alert-error';
        }
    }




    $rootScope.signup = function() {
        $rootScope.dump = {};
        $rootScope.loading = true;
        //console.log($rootScope.user);


        var promise = $kinvey.User.signup($rootScope.user);
        promise.then(function(response) {
            $rootScope.page.contact_person = $rootScope.user.fullname;
            $rootScope.page.email = $rootScope.user.email;
            $rootScope.page.user_id = response._id;

            if ($kinvey.getToken()) {
                $http({
                    method: 'POST',
                    url: 'https://baas.kinvey.com/appdata/kid_eesMzwMN6O/business-pages/',
                    headers: {
                        'Authorization': 'Kinvey ' + $kinvey.getToken()
                    },
                    data: $rootScope.page
                }).success(function(data, status, headers, config) {

                    var plans = $kinvey.DataStore.find('plans');
                    plans.then(function(plans) {
                        $rootScope.selectPlan = true;
                        for (var i in plans) {
                            plans[i].yearly = plans[i].price * 12;
                        }
                        $rootScope.plans = plans;
                        $rootScope.loading = false;
                    }, function(error) {
                        if ($kinvey.getToken()) {
                            $rootScope.selectPlan = true;
                            $http({
                                method: 'GET',
                                url: 'https://baas.kinvey.com/appdata/kid_eesMzwMN6O/plans/',
                                headers: {
                                    'Authorization': 'Kinvey ' + $kinvey.getToken()
                                }
                            }).success(function(plans, status, headers, config) {
                                for (var i in plans) {
                                    plans[i].yearly = plans[i].price * 12;
                                }
                                $rootScope.plans = plans;
                                $rootScope.loading = false;
                            }).error(function(error, status, headers, config) {
                                $rootScope.error_occur = true;
                                $rootScope.dump.message = error.description;
                                $rootScope.dump.type = 'alert-error';
                                $rootScope.loading = false;
                            });
                        }
                        $rootScope.error_occur = true;
                        //$rootScope.dump.message = error.description;
                        $rootScope.dump.type = 'alert-error';
                        $rootScope.loading = false;
                    });

                }).error(function(error, status, headers, config) {
                    $rootScope.error_occur = true;
                    $rootScope.loading = false;
                    $rootScope.dump.message = error.description;
                    $rootScope.dump.type = 'alert-error';
                });
            }

        }, function(error) {
            $rootScope.error_occur = true;
            $rootScope.loading = false;
            $rootScope.dump.message = error.description;
            $rootScope.dump.type = 'alert-error';
        });
        $("body").animate({
                scrollTop: 0
            }, '500',
            function() {});
    }
    $rootScope.selectYourPlan = function() {
        $rootScope.loading = true;
        $rootScope.dump = {};
        //console.log($rootScope.user);
        $rootScope.user.card['exp-month'] = $rootScope.user.card.expire_date.split('/')[0];
        $rootScope.user.card['exp-year'] = $rootScope.user.card.expire_date.split('/')[1];
        //console.log($rootScope.user.card);
        var sKey = 'pk_live_cSbYofhbBK8lYVqZNMF51JSs';
        Stripe.setPublishableKey(sKey);
        Stripe.createToken($rootScope.user.card, function(status, response) {
            if (response.error) {
                console.log(response.error);
            } else {
                var token = response.id;

                $http({
                    method: 'POST',
                    url: 'https://baas.kinvey.com/rpc/kid_eesMzwMN6O/custom/subscribePlan',
                    headers: {
                        'Authorization': 'Kinvey ' + $kinvey.getToken()
                    },
                    data: {
                        token: token,
                        user: $rootScope.user
                    }
                }).success(function(response, status, headers, config) {
                    $rootScope.registered_successfully = true;
                    $rootScope.loading = false;
                }).error(function(error, status, headers, config) {
                    $rootScope.registered_successfully = true;
                    //$rootScope.dump.message = error.description;
                    //$rootScope.dump.type = 'alert-error';
                    $rootScope.loading = false;
                });


            }
        });


        // var promise = $kinvey.User.signup($rootScope.user);
        // promise.then(function(response) {
        //     var plans = $kinvey.DataStore.find('plans');
        //     plans.then(function(plans) {
        //         $rootScope.selectPlan = true;
        //         for (var i in plans) {
        //             plans[i].yearly = plans[i].price * 12;
        //         }
        //         $rootScope.plans = plans;
        //     }, function(error) {
        //         $rootScope.dump.message = error.description;
        //         $rootScope.dump.type = 'alert-error';
        //     });
        // }, function(error) {
        //     console.log(error);
        //     $rootScope.dump.message = error.description;
        //     $rootScope.dump.type = 'alert-error';
        // });

    }

    $rootScope.forget = function() {
        $rootScope.loading = true;
        $rootScope.dump = {};
        if ($rootScope.forget_username) {
            var promise = $kinvey.User.resetPassword($rootScope.forget_username);
            promise.then(function(response) {
                $rootScope.loading = false;
                $rootScope.dump.message = 'Your request successfully sent, Please check your email';
                $rootScope.dump.type = 'alert-success';
                $rootScope.show_forget = false;
            });
        } else {
            $rootScope.loading = false;
            $rootScope.dump = 'Please enter your username!';
            $rootScope.dump_type = 'alert-error';
        }
    }


});