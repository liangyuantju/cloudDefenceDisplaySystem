#! /bin/bash

export FLASK_APP=cloud_management
export FLASK_ENV=development
flask run --host=0.0.0.0 -p 5500
