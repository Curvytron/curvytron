# -*- mode: ruby -*-
# vi: set ft=ruby :

app = {
  :name        => 'curvytron',
  :box         => 'manala/app-dev-debian',
  :box_version => '~> 4.0.5',
  :box_memory  => 1024
}

Vagrant.require_version '>= 2.2.5'

Vagrant.configure(2) do |config|

  # Ssh
  config.ssh.username      = 'app'
  config.ssh.forward_agent = true

  # Vm
  config.vm.box           = app[:box]
  config.vm.box_version   = app[:box_version]
  config.vm.hostname      = app[:name] + '.vm'
  config.vm.network       'private_network', type: 'dhcp'
  config.vm.define        'localhost' do |localhost| end
  config.vm.synced_folder '.', '/srv/app',
    type: 'nfs',
    mount_options: ['nolock', 'actimeo=1', 'fsc']

  # Vm - Provider - Virtualbox
  config.vm.provider 'virtualbox' # Force provider
  config.vm.provider :virtualbox do |virtualbox|
    virtualbox.name   = app[:name]
    virtualbox.memory = app[:box_memory]
    virtualbox.customize ['modifyvm', :id, '--natdnshostresolver1', 'on']
    virtualbox.customize ['modifyvm', :id, '--natdnsproxy1', 'on']
  end

  # Vm - Provision - Dotfiles
  for dotfile in ['.ssh/config', '.gitconfig', '.gitignore', '.composer/auth.json']
    if File.exists?(File.join(Dir.home, dotfile)) then
      config.vm.provision dotfile, type: 'file', run: 'always' do |file|
        file.source      = '~/' + dotfile
        file.destination = '/home/' + config.ssh.username + '/' + dotfile
      end
    end
  end

  # Vm - Provision - Setup
  for playbook in ['ansible', 'app']
    config.vm.provision playbook, type: 'ansible_local' do |ansible|
      ansible.version           = (playbook == 'ansible') ? 'latest' : ''
      ansible.provisioning_path = '/srv/app/ansible'
      ansible.playbook          = playbook + '.yml'
      ansible.inventory_path    = '/etc/ansible/hosts'
      ansible.tags              = ENV['ANSIBLE_TAGS']
      ansible.extra_vars        = JSON.parse(ENV['ANSIBLE_EXTRA_VARS'] || '{"manala":{"update":true}}')
    end
  end

  # Plugins - Landrush
  if Vagrant.has_plugin?('landrush')
    config.landrush.enabled            = true
    config.landrush.tld                = config.vm.hostname
    config.landrush.guest_redirect_dns = false
  end

end
