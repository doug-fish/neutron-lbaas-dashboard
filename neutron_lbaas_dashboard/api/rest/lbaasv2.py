# Copyright 2015 IBM Corp.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""API over the neutron LBaaS v2 service.
"""

from django.views import generic

from openstack_dashboard.api import neutron
from openstack_dashboard.api.rest import urls
from openstack_dashboard.api.rest import utils as rest_utils

neutronclient = neutron.neutronclient


@urls.register
class LoadBalancers(generic.View):
    """API for load balancers.

    """
    url_regex = r'lbaas/loadbalancers/$'

    @rest_utils.ajax()
    def get(self, request):
        """List load balancers for current project.

        The listing result is an object with property "items".
        """
        tenant_id = request.user.project_id
        result = neutronclient(request).list_loadbalancers(tenant_id=tenant_id)
        return {'items': result.get('loadbalancers')}

    @rest_utils.ajax()
    def post(self, request):
        """Create a new load balancer.

        """
        # TODO(jpomero) This will eventually be used for creating more than
        # just a load balancer, once the wizard supports that. It should
        # handle creation of the load balancer, a listener/pool, a monitor
        # and any members. Only the load balancer is required.
        data = request.DATA
        loadbalancer = {
            'name': data['name'],
            'vip_subnet_id': data['subnet']
        }
        if data.get('description'):
            loadbalancer['description'] = data.get('description')
        if data.get('ip'):
            loadbalancer['vip_address'] = data.get('ip')
        return neutronclient(request).create_loadbalancer(
            {'loadbalancer': loadbalancer})


@urls.register
class LoadBalancer(generic.View):
    """API for retrieving a single load balancer.

    """
    url_regex = r'lbaas/loadbalancers/(?P<loadbalancer_id>[^/]+)/$'

    @rest_utils.ajax()
    def get(self, request, loadbalancer_id):
        """Get a specific load balancer.

        http://localhost/api/lbaas/loadbalancers/cc758c90-3d98-4ea1-af44-aab405c9c915
        """
        lb = neutronclient(request).show_loadbalancer(loadbalancer_id)
        return lb.get('loadbalancer')
