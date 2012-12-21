#!/bin/sh
#
### BEGIN INIT INFO
# Provides:          detector
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Should-Start:      $network $time
# Should-Stop:       $network $time
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Start and stop the detector server daemon
# Description:       Controls a detector running on port 7101
### END INIT INFO

# uses 'forever' (https://github.com/nodejitsu/forever)

# changes with service
#===============================================================
NAME=detector
USER=web
FORKS=12
PORT="7101"
COMMAND="src/server.js -f $FORKS -p $PORT"
#===============================================================

ROOT=/var/services/$NAME
PIDFILE=/var/run/$NAME.pid
LOGFILE=/var/log/$NAME.log 
RETVAL=0

service() {
	echo $NAME  : $1 
	forever $1 --pidFile $PIDFILE -a -l $LOGFILE -e $LOGFILE -o $LOGFILE -w --sourceDir $ROOT $COMMAND
	RETVAL=$?
}
 
status() {
	if [ ! -e /proc/$(cat $PIDFILE) ] ; then
		echo "$NAME is stopped"
		RETVAL=1
	else
		echo "$NAME is running"
	fi
}

case "$1" in
	start)
		if [ ! -e /proc/$(cat $PIDFILE) ] ; then
			service start
			echo "$NAME has been started"
		else
			echo "$NAME was running"
		fi
		;;
	stop)
		if [ -e /proc/$(cat $PIDFILE) ] ; then 
			service stop
		else
			echo "$NAME was not running"
		fi
		;;
	status)
		status
		;;
	restart)
		if [ ! -e /proc/$(cat $PIDFILE) ] ; then
			service start
		else
			service restart
		fi
		status
		;;
	*)
		echo "Usage:  {start|stop|status|restart}"
		exit 1
		;;
esac
exit $RETVAL