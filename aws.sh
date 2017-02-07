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
	then
		screen -dmS electron -c 'xvfb-run ./node_modules/.bin/electron . > log.txt; exec bash'
		echo "starting server..."
fi

if [ "$1" == "-stop" ]
	then
		screen -S electron -X quit
		echo "stopped server..."
fi

if [ "$1" == "-deploy" ]
	then
		screen -S electron -X quit
		echo "stopped server..."
		git pull -r
		echo "updated version..."
fi
