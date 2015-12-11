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

  describe('LBaaS v2 Load Balancer Detail Controller', function() {
    var controller, lbaasv2API, staticUrl, loadbalancer;

    function fakeAPI() {
      return {
        success: function(callback) {
          callback(loadbalancer);
        }
      };
    }

    ///////////////////////

    beforeEach(module('horizon.framework.util.http'));
    beforeEach(module('horizon.framework.widgets.toast'));
    beforeEach(module('horizon.framework.conf'));
    beforeEach(module('horizon.app.core.openstack-service-api'));
    beforeEach(module('horizon.dashboard.project.lbaasv2'));

    beforeEach(inject(function($injector) {
      loadbalancer = { id: '1234' };
      lbaasv2API = $injector.get('horizon.app.core.openstack-service-api.lbaasv2');
      controller = $injector.get('$controller');
      staticUrl = $injector.get('$window').STATIC_URL;
      spyOn(lbaasv2API, 'getLoadBalancer').and.callFake(fakeAPI);
    }));

    function createController() {
      return controller('LoadBalancerDetailController', {
        api: lbaasv2API,
        $routeParams: { loadbalancerId: '1234' }
      });
    }

    it('should invoke lbaasv2 apis', function() {
      createController();
      expect(lbaasv2API.getLoadBalancer).toHaveBeenCalledWith('1234');
    });

  });

})();
