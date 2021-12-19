import argparse;
import paramiko;
import os;

escape = "`e" 
cyan = "[36m"
green = "[32m"
red = "[31m"
yellow = "[33m"
reset = "[0m"

nocolor = True

def print_color(color, text):
    if nocolor:
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
    print_color("c", "#######################");
    print_color("c", "### deploy frontend ###");
    print_color("c", "#######################");

    print_color("c", "### starting connection...")
    client = paramiko.SSHClient()
    client.look_for_keys = True
    client.load_system_host_keys()
    client.connect("173.249.26.235", username="fabian")
    print_color("g", "... done")

    # todo
    os.system("cd dev\\node_modules\\.bin; .sass.cmd ..\\..\\scss:..\\..\\css")
    os.system("cd dev; .\\node_modules\\.bin\\tsc.cmd ")
    os.system("git add .")
    os.system("git commit -m 'frontend debug'")
    os.system("git push")
