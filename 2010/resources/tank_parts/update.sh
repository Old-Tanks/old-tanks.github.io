#!/bin/bash

cd colorings
cp -f * ../_out
cd ..

for dir in hulls garage_box; do
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
