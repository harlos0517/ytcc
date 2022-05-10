#!/bin/sh
tmux new-session -d './db-script.sh' -s 'ytcc'
tmux split-window -h 'cd backend; yarn dev'
tmux split-window -v 'cd frontend; yarn dev'
tmux select-pane -t 0
tmux split-window -v 'cd api; tsc --build --watch'
tmux -2 attach-session -d
