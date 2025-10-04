MY_SESSION=$(tmux list-sessions | grep "mediaserver")
if [[ ! $MY_SESSION ]]; then
	# create a new session and `-d`etach
	tmux new-session -d -s mediaserver
	tmux new-window
	tmux send "npm run dev"
	tmux split-window -h
	tmux send "npm run watch"
fi

tmux attach-session -d -t mediaserver
