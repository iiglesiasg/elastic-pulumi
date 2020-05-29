#!/bin/bash

echo started
while [ "$(PULUMI_EXPERIMENTAL=true pulumi query | grep data)" == 0 ]
do
  echo waiting
  sleep 2
done
echo the end
