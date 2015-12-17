=======================
neutron-lbaas-dashboard
=======================

Horizon panels for Neutron LBaaS

* Free software: Apache license
* Documentation: http://docs.openstack.org/developer/neutron-lbaas-dashboard
* Source: http://git.openstack.org/cgit/openstack/neutron-lbaas-dashboard
* Bugs: http://bugs.launchpad.net/neutron

Features
--------

This is a fork of http://git.openstack.org/cgit/openstack/neutron-lbaas-dashboard to which I've added
every patch which I have given a +2 in https://review.openstack.org/#/q/project:+openstack/neutron-lbaas-dashboard,n,z

This level of code is useful because it can be used to install the lbaas v2 dashboard through 
devstack AND it will actually work.


Howto
-----

Use devstack. Create a local.conf file similar to:
(Thanks amotoki for providing most of this!)

Note that after running devstack you'll have to make Horizon re-collectstatic and re-compress until
https://review.openstack.org/#/c/257744/
is merged using the commands
cd /opt/stack/horizon
python manage.py collectstatic --noinput
python manage.py compress --force
sudo service apache2 restart


.. code-block:: python

    [[local|localrc]]
    DATABASE_PASSWORD=openstack1
    RABBIT_PASSWORD=openstack1
    SERVICE_TOKEN=openstack1
    SERVICE_PASSWORD=openstack1
    ADMIN_PASSWORD=openstack1
    SCREEN_LOGDIR=$DEST/logs/screen
    HOST_IP= #BE SURE SURE TO SET OR REMOVE THIS LINE
    #OFFLINE=True
    RECLONE=True
    #NO_UPDATE_REPOS=True
    
    #-----------------------------
    # Common configurations
    #-----------------------------
    #disable_service cinder c-sch c-api c-vol
    #disable_service tempest
    #disable_service horizon
    disable_service heat h-api h-api-cfn h-api-cw h-eng
    #enable_service ceilometer-acompute ceilometer-acentral ceilometer-collector ceilometer-api
    
    KEYSTONE_TOKEN_FORMAT=UUID
    PRIVATE_NETWORK_NAME=net1
    PUBLIC_NETWORK_NAME=ext_net
    
    enable_plugin neutron https://git.openstack.org/openstack/neutron
    enable_plugin neutron-lbaas https://git.openstack.org/openstack/neutron-lbaas
    NEUTRON_LBAAS_SERVICE_PROVIDERV2="LOADBALANCERV2:Haproxy:neutron_lbaas.drivers.haproxy.plugin_driver.HaproxyOnHostPluginDriver:default"
    #NEUTRON_LBAAS_SERVICE_PROVIDERV2="LOADBALANCERV2:Octavia:neutron_lbaas.drivers.octavia.driver.OctaviaDriver:default"
    #enable_plugin neutron-lbaas-dashboard https://git.openstack.org/openstack/neutron-lbaas-dashboard
    enable_plugin neutron-lbaas-dashboard https://github.com/doug-fish/neutron-lbaas-dashboard
    
    #-----------------------------
    # Neutron
    #-----------------------------
    disable_service n-net
    enable_service neutron q-svc q-agt
    enable_service q-dhcp
    enable_service q-l3
    enable_service q-meta
    #enable_service q-lbaas
    enable_service q-lbaasv2
    #enable_service q-fwaas
    #enable_service q-vpn
    enable_service q-qos
    enable_service q-flavors

    Q_PLUGIN=ml2
    Q_ML2_TENANT_NETWORK_TYPE=vxlan
    
    #-----------------------------
    # Devstack configurations
    #-----------------------------
    LOGDIR=$DEST/logs
    SCREEN_LOGDIR=$LOGDIR
    SCREEN_HARDSTATUS="%{= rw} %H %{= wk} %L=%-w%{= bw}%30L> %n%f %t*%{= wk}%+Lw%-17< %-=%{= gk} %y/%m/%d %c"
    LOGFILE=$LOGDIR/devstack.log
    LOGDAYS=1
    
    [[post-config|/etc/neutron/dhcp_agent.ini]]
    [DEFAULT]
    enable_isolated_metadata = True
