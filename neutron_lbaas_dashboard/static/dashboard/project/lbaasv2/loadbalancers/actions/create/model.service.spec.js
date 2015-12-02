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

  describe('LBaaS v2 Create Load Balancer Workflow Model Service', function() {
    var model, $q, scope;

    beforeEach(module('horizon.dashboard.project.lbaasv2'));

    beforeEach(module(function($provide) {
      $provide.value('horizon.app.core.openstack-service-api.lbaasv2', {
        getLoadBalancers: function() {
          var loadbalancers = [ { name: 'Load Balancer 1' }, { name: 'Load Balancer 2' } ];

          var deferred = $q.defer();
          deferred.resolve({ data: { items: loadbalancers } });

          return deferred.promise;
        },
        createLoadBalancer: function(spec) {
          return spec;
        }
      });

      $provide.value('horizon.app.core.openstack-service-api.neutron', {
        getSubnets: function() {
          var subnets = [ { id: 'subnet-1', name: 'subnet-1' },
                          { id: 'subnet-2', name: 'subnet-2' } ];

          var deferred = $q.defer();
          deferred.resolve({ data: { items: subnets } });

          return deferred.promise;
        }
      });
    }));

    beforeEach(inject(function ($injector) {
      model = $injector.get(
        'horizon.dashboard.project.lbaasv2.loadbalancers.actions.create.model'
      );
      $q = $injector.get('$q');
      scope = $injector.get('$rootScope').$new();
    }));

    describe('Initial object (pre-initialize)', function() {

      it('is defined', function() {
        expect(model).toBeDefined();
      });

      it('has initialization status parameters', function() {
        expect(model.initializing).toBeDefined();
        expect(model.initialized).toBeDefined();
      });

      it('does not yet have a spec', function() {
        expect(model.spec).toBeNull();
      });

      it('has empty arrays for all data', function() {
        var datasets = ['subnets'];

        datasets.forEach(function(name) {
          expect(model[name]).toEqual([]);
        });
      });

      it('has an "initialize" function', function() {
        expect(model.initialize).toBeDefined();
      });

      it('has a "createLoadBalancer" function', function() {
        expect(model.createLoadBalancer).toBeDefined();
      });
    });

    describe('Post initialize model', function() {

      beforeEach(function() {
        model.initialize();
        scope.$apply();
      });

      it('should initialize model properties', function() {
        expect(model.initializing).toBe(false);
        expect(model.initialized).toBe(true);
        expect(model.subnets.length).toBe(2);
        expect(model.spec).toBeDefined();
        expect(model.spec.name).toBeDefined();
      });

      it('should initialize load balancer name', function() {
        expect(model.spec.name).toBe('Load Balancer 3');
      });
    });

    describe('Initialization failure', function() {

      beforeEach(inject(function ($injector) {
        var neutronAPI = $injector.get('horizon.app.core.openstack-service-api.neutron');
        neutronAPI.getSubnets = function() {
          var deferred = $q.defer();
          deferred.reject('Error');
          return deferred.promise;
        };
      }));

      beforeEach(function() {
        model.initialize();
        scope.$apply();
      });

      it('should fail to be initialized on subnets error', function() {
        expect(model.initializing).toBe(false);
        expect(model.initialized).toBe(false);
        expect(model.spec.name).toBe('Load Balancer 3');
        expect(model.subnets).toEqual([]);
      });
    });

    describe('Post initialize model - Initializing', function() {

      beforeEach(function() {
        model.initializing = true;
        model.initialize();
        scope.$apply();
      });

      // This is here to ensure that as people add/change spec properties, they don't forget
      // to implement tests for them.
      it('has the right number of properties', function() {
        expect(Object.keys(model.spec).length).toBe(4);
      });

      it('sets name to null', function() {
        expect(model.spec.name).toBeNull();
      });

      it('sets description to null', function() {
        expect(model.spec.description).toBeNull();
      });

      it('sets ip to null', function() {
        expect(model.spec.ip).toBeNull();
      });

      it('sets subnet to null', function() {
        expect(model.spec.subnet).toBeNull();
      });
    });

    describe('Create Load Balancer', function() {

      beforeEach(function() {
        model.initialize();
        scope.$apply();
        model.spec.ip = '1.2.3.4';
        model.spec.subnet = model.subnets[0];
      });

      it('should set final spec properties', function() {
        var finalSpec = model.createLoadBalancer();
        expect(finalSpec.name).toBe('Load Balancer 3');
        expect(finalSpec.description).toBeUndefined();
        expect(finalSpec.ip).toBe('1.2.3.4');
        expect(finalSpec.subnet).toBe(model.subnets[0].id);
      });
    });

  });
})();
