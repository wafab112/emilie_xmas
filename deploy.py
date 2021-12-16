import argparse;
import paramiko;

escape = "`e" 
cyan = "[36m"
green = "[32m"
red = "[31m"
yellow = "[33m"
reset = "[0m"

def print_color(color, text):
    if color == "r":
        print(f"{escape}{red}{text}{escape}{reset}")
    elif color == "g":
        print(f"{escape}{green}{text}{escape}{reset}")
    elif color == "c":
        print(f"{escape}{cyan}{text}{escape}{reset}")
    elif color == "y":
        print(f"{escape}{yellow}{text}{escape}{reset}")
    else:
        print(text)


def ssh_cmd(client, command, debugText = None, write = None, doRead = False, doErrLog = False):
    if debugText is not None:
        print_color("c", "### " + debugText + "...")

    stdin, stdout, stderr = client.exec_command(command)

    if write is not None:
        pass

    if doRead:
        print(stdout.read().decode("utf8"))

    if doErrLog:
        print(stderr.read().decode("utf8"))

    stdin.close()
    stdout.close()
    stderr.close()
    if debugText is not None:
        print_color("g", "... done")

if __name__ == "__main__":
    print_color("c", "############################")
    print_color("c", "### deploy remote server ###")
    print_color("c", "############################")

    print_color("c", "### starting connection...")
    client = paramiko.SSHClient()
    client.look_for_keys = True
    client.load_system_host_keys()
    client.connect("173.249.26.235", username="fabian")
    print_color("g", "... done")

    ssh_cmd(client, "cd /opt/emilie_xmas; git pull", "pulling repo", doRead=True)

    ssh_cmd(client, "cd /opt/emilie_xmas; docker-compose down", "stopping previous stack", doRead=True)
    ssh_cmd(client, "cd /opt/emilie_xmas/front; docker-compose down", doRead=True)
    ssh_cmd(client, "cd /opt/emilie_xmas/backend; docker-compose down", doRead=True)
    if True:
        print_color("y", "### removing api image")
        ssh_cmd(client, "docker rmi emilie_xmas_xmas2021-api", doRead=True)
    if True:
        print_color("y", "### removing frontend image")
        ssh_cmd(client, "docker rmi emilie_xmas_xmas2021-frontend", doRead=True)

    ssh_cmd(client, "cd /opt/emilie_xmas; ./deploy.sh", "starting xmas stack", doRead=True, doErrLog=True)

    print_color("c", "### restarting proxy-server ...")
    ssh_cmd(client, "cd /opt/proxy; docker-compose down;", doRead=True)
    ssh_cmd(client, "cd /opt/proxy; docker rmi proxy_proxy;", doRead=True)
    ssh_cmd(client, "cd /opt/proxy; docker-compose up -d;", doRead=True)
    print_color("g", "... done")

    client.close()
