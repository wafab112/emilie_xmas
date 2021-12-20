import argparse;
import paramiko;
import os;

parser = argparse.ArgumentParser()
parser.add_argument("mode", help="the deployment mode (0: full, 1: frontend only, 2: backend only).", type=int, choices=[0,1,2])
parser.add_argument("-v", "--verbose", action="store_true", help="get the verbose output of the program")
parser.add_argument("--color", action="store_true", help="use color for verbose output")
#parser.add_argument("-m", "--commitmessage", type=str, help="define a commit message. Default will be depending on mode")
args = parser.parse_args()

escape = chr(27) 
cyan = "[36m"
green = "[32m"
red = "[31m"
yellow = "[33m"
reset = "[0m"

def print_color(color, text):
    if not args.color:
        print(text)
        return
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


def debug(debugType, text, isIndented = True):
    if not args.verbose:
        return

    if debugType == "i":
        # information
        if isIndented:
            print_color("c", "#### " + text)
        else:
            print_color("c", text)
    if debugType == "w":
        # warning
        if isIndented:
            print_color("y", "#### " + text)
        else:
            print_color("y", text)
    if debugType == "s":
        # success
        if isIndented:
            print_color("g", "#### " + text)
        else:
            print_color("g", text)
    if debugType == "c":
        # critical
        if isIndented:
            print_color("r", "#### " + text)
        else:
            print_color("r", text)



def deploy_frontend(client):
    debug("i", "deploying frontend")

    debug("i", "chdir to front")
    os.chdir("front")
    debug("i", os.getcwd(), False)

    cmd(r"dev", r".\node_modules\.bin\tsc.cmd", "tsc")
    cmd(r"dev", r".\node_modules\.bin\sass.cmd scss:css", "sass")

    cmd(".", "git add .", "git add")
    cmd(".", "git commit -m\"frontend debug\"", "git commit")
    cmd(".", "git push", "git push")

    debug("s", "... deploying frontend locally done. Now doing remote ...")

    ssh_cmd(client, "cd /opt/emilie_xmas; git pull", "git pull")
    ssh_cmd(client, "cp -r -a /opt/emilie_xmas/front/dev/. /opt/emilie_xmas/front/www", "copying dev->www")
    ssh_cmd(client, "docker cp /opt/emilie_xmas/front/www/. front_xmas2021-frontend_1:/var/www/xmas-emilie", "copying www->docker:www")
    ssh_cmd(client, "docker exec front_xmas2021-frontend_1 apache2ctl restart", "restarting frontend apache2 server")

def cmd(path, command, debugText):
    if args.verbose:
        debug("i", debugText + "...")

    cwd = os.getcwd()
    os.chdir(path)
    os.system(command)
    os.chdir(cwd)

    if args.verbose:
        debug("s", "... done")

def ssh_cmd(client, command, debugText="ssh command", write = None):
    if args.verbose:
        print_color("c", "##### " + debugText + "...")

    stdin, stdout, stderr = client.exec_command(command)

    if write is not None:
        pass

    if args.verbose:
        print(stdout.read().decode("utf8"))

    if args.verbose:
        print(stderr.read().decode("utf8"))

    stdin.close()
    stdout.close()
    stderr.close()
    if args.verbose:
        print_color("g", "##### ... done")

if __name__ == "__main__":
    print_color("c", "##############################")
    print_color("c", "#### deploy remote server ####")
    print_color("c", "##############################")

    debug("i", "starting connection...")
    client = paramiko.SSHClient()
    client.look_for_keys = True
    client.load_system_host_keys()
    client.connect("173.249.26.235", username="fabian")
    debug("s", "... done")

    if args.mode == 0:
        pass
    elif args.mode == 1:
        deploy_frontend(client)
        client.close()
        quit()
    elif args.mode == 2:
        debug("c", "Mode 2 not implemented", False)
        quit()
    else:
        quit()

    cmd(".", "git add .", "git add")
    cmd(".", "git commit -m\"debug\"", "git commit")
    cmd(".", "git push", "git push")

    ssh_cmd(client, "cd /opt/emilie_xmas; git pull", "pulling repo")

    ssh_cmd(client, "cd /opt/emilie_xmas/front; docker-compose down")
    ssh_cmd(client, "cd /opt/emilie_xmas/backend; docker-compose down")
    if True:
        print_color("y", "### removing api image")
        ssh_cmd(client, "docker rmi backend_xmas2021-api")
    if True:
        print_color("y", "### removing frontend image")
        ssh_cmd(client, "docker rmi front_xmas2021-frontend")

    ssh_cmd(client, "cd /opt/emilie_xmas; ./deploy.sh", "starting xmas stack")

    print_color("c", "### restarting proxy-server ...")
    ssh_cmd(client, "cd /opt/proxy; docker-compose down;")
    ssh_cmd(client, "cd /opt/proxy; docker rmi proxy_proxy;")
    ssh_cmd(client, "cd /opt/proxy; docker-compose up -d;")
    print_color("g", "... done")

    client.close()
