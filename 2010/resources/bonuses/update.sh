#!/bin/bash

for dir in boxes parachutes; do
    echo $dir
    cd $dir
    for subdir in *; do
	if [ -d $subdir  ]; then
    	    echo "+-- "$subdir
	    cd $subdir
	    zip $subdir.zip *
	    mv -f $subdir.zip ../../_out
	    cd ..
	fi
    done
    cd ..
done
