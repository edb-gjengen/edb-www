from fabric.api import cd, env, run

env.use_ssh_config = True
env.hosts = ['dreamcast.neuf.no']
env.project_path = '/var/www/neuf.no/edb/edb-www'
env.user = 'gitdeploy'


def deploy():
    with cd(env.project_path):
        run('git pull')
        # run('yarn')
        # run('gulp')
