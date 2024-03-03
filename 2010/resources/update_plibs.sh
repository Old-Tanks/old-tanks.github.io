#!/bin/bash

cd proplibs

for dir in *; do
	echo "+-- "$dir
	cd $dir
	pwd
	zip $dir.zip *
#        java -jar /home/alar/sbin/tara.jar $dir.tara *
	mv -f $dir.zip ../../proplibs_out
	cd ..
done
