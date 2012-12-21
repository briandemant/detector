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

ROOT=/var/services/detector
PIDFILE=/var/run/detector.pid
LOGFILE=/var/log/detector.log
ERRFILE=/var/log/detector.errors.log
FORKS=12
PORT="7101"


forever $1 --pidFile $PIDFILE -a -l $LOGFILE -e $LOGFILE -o $LOGFILE -w --sourceDir $ROOT src/server.js -f $FORKS -p $PORT