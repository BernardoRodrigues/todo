#!/bin/bash

# run and build user service
gnome-terminal --working-directory="/home/bernardo-rodrigues/Documents/Projects/todo/user-service" -- bash -c './run-service.sh'

# run and build todo service
#gnome-terminal --working-directory="/home/bernardo-rodrigues/Documents/Projects/todo/todo-service" -- bash -c './run-service.sh'

# run and build task service
#gnome-terminal --working-directory="/home/bernardo-rodrigues/Documents/Projects/todo/task-service" -- bash -c './run-service.sh'

# run and build gateway
#gnome-terminal --working-directory="/home/bernardo-rodrigues/Documents/Projects/todo/gateway" -- bash -c './run-gateway.sh'
