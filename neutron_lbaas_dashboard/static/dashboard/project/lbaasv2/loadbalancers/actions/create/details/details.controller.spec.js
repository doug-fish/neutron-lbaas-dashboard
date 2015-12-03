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

  describe('Create Load Balancer Details Step', function() {
    var noop = angular.noop;

    beforeEach(module('horizon.dashboard.project.lbaasv2'));

    describe('CreateLoadBalancerDetailsController', function() {
      var scope, ctrl, deferred;

      beforeEach(inject(function($controller, $rootScope, $q) {
        scope = $rootScope.$new();
        deferred = $q.defer();
        scope.initPromise = deferred.promise;

        ctrl = $controller('CreateLoadBalancerDetailsController', { $scope: scope });

        scope.$apply();
      }));

      it('should define error messages for invalid fields', function() {
        expect(ctrl.loadbalancerNameError).toBeDefined();
        expect(ctrl.loadbalancerIPError).toBeDefined();
      });

      it('should define patterns for field validation', function() {
        expect(ctrl.ipPattern).toBeDefined();
      });

    });
  });
})();
