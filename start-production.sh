#!/bin/bash
cd /home/ilseralex/Documents/Code/MP004_Mixtr
export NODE_ENV=production
export $(cat .env.production | xargs)
npm start
