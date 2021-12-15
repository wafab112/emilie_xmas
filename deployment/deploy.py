import argparse;
import paramiko;

escape = chr(27)
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

    print_color("c", "### pulling remote repo...")
    client.exec_command("cd /opt/emilie_xmas; git pull")
    print_color("g", "... done")

    print_color("c", "### restarting xmas stack ...")
    print_color("c", "### stopping xmas stack")
    client.exec_command("docker-compose down")
    if True:
        print_color("y", "### removing api image")
        client.exec_command("docker rmi emilie_xmas_xmas2021-api")
    if True:
        print_color("y", "### removing frontend image")
        client.exec_command("cd /opt/emilie_xmas; docker rmi emilie_xmas_xmas2021-frontend")
    print_color("c", "### starting xmas stack")
    stdin, stdout, stderr = client.exec_command("cd /opt/emilie_xmas; ./deploy.sh")
    print(stdout.read().decode("utf8"))
    print(stderr.read().decode("utf8"))
    stdin.close()
    stdout.close()
    stderr.close()
    print_color("g", "### ... done")


    print_color("c", "### restarting proxy-server ...")
    client.exec_command("cd /opt/proxy; docker-comopse down")
    client.exec_command("cd /opt/proxy; docker rmi proxy_proxy")
    stdin, stdout, stderr = client.exec_command("cd /opt/proxy; docker-compose up -d")
    print(stdout.read().decode("utf8"))
    print(stderr.read().decode("utf8"))
    stdin.close()
    stdout.close()
    stderr.close()

    client.close()
