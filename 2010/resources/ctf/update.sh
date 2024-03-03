#!/bin/bash

for dir in pedestal; do
    echo $dir
    cd $dir
    for subdir in *; do
	echo "+--"$subdir
	cd $subdir
	zip $subdir.zip *
	mv -f $subdir.zip ../../_out
	cd ..
    done
    cd ..
done
