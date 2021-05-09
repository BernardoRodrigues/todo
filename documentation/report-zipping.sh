#!/bin/bash

timestamp() {
  date +"%s" # current time
}

echo "zipping report folder..."

zip -r ./report-zips/report-$(timestamp).zip report

echo "zip finished"
