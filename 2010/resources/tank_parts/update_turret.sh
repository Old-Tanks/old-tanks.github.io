#!/bin/bash

out=`pwd`/_out
turret_name=$1
cd turrets
for subdir in ${turret_name}*; do
	file_name=$subdir.zip
	echo ">>"$file_name
	cd $subdir
	zip $file_name *
	mv -f $file_name $out
	cd ..
done

