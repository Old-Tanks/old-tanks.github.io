#!/bin/bash

out=`pwd`/_out
hull_name=$1
cd hulls
for subdir in ${hull_name}*; do
	file_name=$subdir.zip
	echo ">>"$file_name
	cd $subdir
	zip $file_name *
	mv -f $file_name $out
	cd ..
done

