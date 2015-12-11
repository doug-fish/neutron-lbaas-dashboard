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

      it('has empty subnets array', function() {
        expect(model.subnets).toEqual([]);
      });

      it('has array of pool protocols', function() {
        expect(model.poolProtocols).toEqual(['TCP', 'HTTP', 'HTTPS']);
      });

      it('has array of listener protocols', function() {
        expect(model.listenerProtocols).toEqual(['TCP', 'HTTP', 'HTTPS']);
      });

      it('has array of methods', function() {
        expect(model.methods).toEqual(['ROUND_ROBIN', 'LEAST_CONNECTIONS', 'SOURCE_IP']);
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
        expect(model.spec.loadbalancer).toBeDefined();
        expect(model.spec.listener).toBeDefined();
        expect(model.spec.pool).toBeDefined();
      });

      it('should initialize names', function() {
        expect(model.spec.loadbalancer.name).toBe('Load Balancer 3');
        expect(model.spec.listener.name).toBe('Listener 1');
        expect(model.spec.pool.name).toBe('Pool 1');
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
        expect(model.spec.loadbalancer.name).toBe('Load Balancer 3');
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
        expect(Object.keys(model.spec).length).toBe(3);
        expect(Object.keys(model.spec.loadbalancer).length).toBe(4);
        expect(Object.keys(model.spec.listener).length).toBe(4);
        expect(Object.keys(model.spec.pool).length).toBe(4);
      });

      it('sets load balancer name to null', function() {
        expect(model.spec.loadbalancer.name).toBeNull();
      });

      it('sets load balancer description to null', function() {
        expect(model.spec.loadbalancer.description).toBeNull();
      });

      it('sets load balancer ip address to null', function() {
        expect(model.spec.loadbalancer.ip).toBeNull();
      });

      it('sets load balancer subnet to null', function() {
        expect(model.spec.loadbalancer.subnet).toBeNull();
      });

      it('sets listener name to reasonable default', function() {
        expect(model.spec.listener.name).toBe('Listener 1');
      });

      it('sets listener description to null', function() {
        expect(model.spec.listener.description).toBeNull();
      });

      it('sets listener protocol to null', function() {
        expect(model.spec.listener.protocol).toBeNull();
      });

      it('sets listener port to null', function() {
        expect(model.spec.listener.port).toBeNull();
      });

      it('sets pool name to reasonable default', function() {
        expect(model.spec.pool.name).toBe('Pool 1');
      });

      it('sets pool description to null', function() {
        expect(model.spec.pool.description).toBeNull();
      });

      it('sets pool protocol to null', function() {
        expect(model.spec.pool.protocol).toBeNull();
      });

      it('sets pool method to null', function() {
        expect(model.spec.pool.method).toBeNull();
      });
    });

    describe('Create Load Balancer', function() {

      beforeEach(function() {
        model.initialize();
        scope.$apply();
      });

      it('should set final spec properties', function() {
        model.spec.loadbalancer.ip = '1.2.3.4';
        model.spec.loadbalancer.subnet = model.subnets[0];
        model.spec.listener.protocol = 'HTTPS';
        model.spec.listener.port = 80;
        model.spec.pool.name = 'pool name';
        model.spec.pool.description = 'pool description';
        model.spec.pool.protocol = 'HTTP';
        model.spec.pool.method = 'LEAST_CONNECTIONS';

        var finalSpec = model.createLoadBalancer();

        expect(finalSpec.loadbalancer.name).toBe('Load Balancer 3');
        expect(finalSpec.loadbalancer.description).toBeUndefined();
        expect(finalSpec.loadbalancer.ip).toBe('1.2.3.4');
        expect(finalSpec.loadbalancer.subnet).toBe(model.subnets[0].id);
        expect(finalSpec.listener.name).toBe('Listener 1');
        expect(finalSpec.listener.description).toBeUndefined();
        expect(finalSpec.listener.protocol).toBe('HTTPS');
        expect(finalSpec.listener.port).toBe(80);
        expect(finalSpec.pool.name).toBe('pool name');
        expect(finalSpec.pool.description).toBe('pool description');
        expect(finalSpec.pool.protocol).toBe('HTTP');
        expect(finalSpec.pool.method).toBe('LEAST_CONNECTIONS');
      });

      it('should delete listener if any required property is not set', function() {
        model.spec.loadbalancer.ip = '1.2.3.4';
        model.spec.loadbalancer.subnet = model.subnets[0];
        model.spec.listener.protocol = 'HTTPS';

        var finalSpec = model.createLoadBalancer();

        expect(finalSpec.loadbalancer).toBeDefined();
        expect(finalSpec.listener).toBeUndefined();
        expect(finalSpec.pool).toBeUndefined();
      });

      it('should delete pool if any required property is not set', function() {
        model.spec.loadbalancer.ip = '1.2.3.4';
        model.spec.loadbalancer.subnet = model.subnets[0];
        model.spec.listener.protocol = 'HTTPS';
        model.spec.listener.port = 80;

        var finalSpec = model.createLoadBalancer();

        expect(finalSpec.loadbalancer).toBeDefined();
        expect(finalSpec.listener).toBeDefined();
        expect(finalSpec.pool).toBeUndefined();
      });
    });

  });
})();
