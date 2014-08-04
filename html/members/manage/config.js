bones.config(function($routeProvider) {
    $routeProvider
        .when('/manage-plan', {
            templateUrl: 'html/members/manage/views/manage-plan.html',
            controller: 'manage_plan'
        }).when('/billing-history', {
            templateUrl: 'html/members/dashboard/views/billing-history.html',
            controller: 'billing_history'
        });
});