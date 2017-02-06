# basic start/stop/deploy script for aws ubuntu servers

if [ $# -eq 0 ]
	then
		echo ""
		echo "No arguments... Try :"
		echo ""
		echo "-start   startup the webserver with the crawler in a new deteched session"
		echo "-stop    close all sessions (stops the server and the crawler)"
		echo "-deploy  download the latest version from github"
fi

if [ "$1" == "-start" ]
	screen -S electron -dm xvfb-run ./node_modules/.bin/electron .
	echo "starting server..."
fi

if [ "$1" == "-stop" ]
	screen -S electron -X quit
	echo "stopped server..."
fi

if [ "$1" == "-deploy" ]
	screen -S electron -X quit
	echo "stopped server..."
	git pull -r
	echo "updated version..."
fi
