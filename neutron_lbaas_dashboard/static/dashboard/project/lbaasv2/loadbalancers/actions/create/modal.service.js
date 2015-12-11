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
    .factory('horizon.dashboard.project.lbaasv2.loadbalancers.actions.create.modal',
      modalService);

  modalService.$inject = [
    '$modal',
    '$location',
    '$window',
    'horizon.framework.widgets.toast.service',
    'horizon.framework.util.i18n.gettext'
  ];

  /**
   * @ngdoc service
   * @ngname horizon.dashboard.project.lbaasv2.loadbalancers.actions.create.modal
   *
   * @description
   * Provides the service for opening the create load balancer modal.
   *
   * @param $modal The angular bootstrap $modal service.
   * @param $location The angular $location service.
   * @param $window The angular reference to the browser window object.
   * @param toastService The horizon toast service.
   * @param gettext The horizon gettext function for translation.
   * @returns The modal service for the create load balancer workflow.
   */

  function modalService($modal, $location, $window, toastService, gettext) {

    var service = {
      open: open
    };

    return service;

    //////////////

    function open() {
      var spec = {
        backdrop: 'static',
        controller: 'ModalContainerController',
        template: '<wizard ng-controller="CreateLoadBalancerWizardController"></wizard>',
        windowClass: 'modal-dialog-wizard',
        // ModalContainerController requires a launchContext parameter...
        resolve: {
          launchContext: null
        }
      };
      var modal = $modal.open(spec);
      modal.result.then(function(response) {
        toastService.add('success', gettext('A new load balancer is being created.'));
        $location.path($window.WEBROOT + 'project/ngloadbalancersv2/detail/' + response.data.id);
      });
    }

  }
})();
