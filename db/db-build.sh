
#!/bin/bash

DB_NAME='todo_db'

createdb ${DB_NAME}

psql -f db-creation.sql -d ${DB_NAME} -b
# TODO add new user for security and not use root
