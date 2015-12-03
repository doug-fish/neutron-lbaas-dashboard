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
    .factory('horizon.dashboard.project.lbaasv2.loadbalancers.actions.batchActions',
      tableBatchActions);

  tableBatchActions.$inject = [
    'horizon.dashboard.project.lbaasv2.loadbalancers.actions.create.modal',
    'horizon.dashboard.project.lbaasv2.basePath',
    'horizon.app.core.openstack-service-api.policy',
    'horizon.framework.util.i18n.gettext'
  ];

  /**
   * @ngdoc service
   * @ngname horizon.dashboard.project.lbaasv2.loadbalancers.actions.batchActions
   *
   * @description
   * Provides the service for the Load Balancers table batch actions.
   *
   * @param createModal The create action modal service.
   * @param basePath The lbaasv2 module base path.
   * @param policy The horizon policy service.
   * @returns Load balancers table batch actions service object.
   */

  function tableBatchActions(createModal, basePath, policy) {
    var actions = [{
      callback: 'table.batchActions.create.open',
      template: {
        url: basePath + 'loadbalancers/actions/create/action.template.html',
        text: gettext('Create Load Balancer')
      },
      // This rule is made up and should therefore always pass. I assume at some point there
      // will be a valid rule similar to this that we will want to use.
      permissions: policy.ifAllowed({ rules: [['neutron', 'create_loadbalancer']] })
    }];

    var service = {
      initScope: initScope,
      create: createModal,
      actions: actions
    };

    return service;

    ///////////////

    function initScope(scope) {
      // Pass child scope onto actions so that actions can emit events
      angular.forEach(service, function setActionScope(action) {
        if (action.initScope) {
          action.initScope(scope.$new());
        }
      });
    }
  }

})();
