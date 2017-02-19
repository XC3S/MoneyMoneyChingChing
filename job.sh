# cronjob that keeps the system running
if ! screen -list | grep -q "electron"; then
	screen -dmS electron xvfb-run /home/ubuntu/MoneyMoneyChingChing/node_modules/.bin/electron /home/ubuntu/MoneyMoneyChingChing/	    
fi