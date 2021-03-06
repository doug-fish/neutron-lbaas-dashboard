/*
 * Copyright 2015 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function() {
  'use strict';

  angular
    .module('horizon.dashboard.project.lbaasv2.loadbalancers')
    .controller('LoadBalancersTableController', LoadBalancersTableController);

  LoadBalancersTableController.$inject = [
    '$scope',
    '$window',
    'horizon.app.core.openstack-service-api.lbaasv2',
    'horizon.dashboard.project.lbaasv2.loadbalancers.actions.batchActions'
  ];

  /**
   * @ngdoc controller
   * @name LoadBalancersTableController
   *
   * @description
   * Controller for the LBaaS v2 load balancers table. Serves as the focal point for table actions.
   *
   * @param $scope The angular $scope object.
   * @param $window The angular reference to the browser window object.
   * @param api The LBaaS V2 service API.
   * @param batchActions The load balancer batch actions service.
   * @returns undefined
   */

  function LoadBalancersTableController($scope, $window, api, batchActions) {

    var ctrl = this;
    ctrl.items = [];
    ctrl.src = [];
    ctrl.checked = {};
    ctrl.webroot = $window.webroot;

    ctrl.batchActions = batchActions;
    ctrl.batchActions.initScope($scope);

    init();

    ////////////////////////////////

    function init() {
      api.getLoadBalancers().success(success);
    }

    function success(response) {
      ctrl.src = response.items;
    }

  }

})();
