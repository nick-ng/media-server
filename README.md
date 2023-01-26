# media-server

## Development

1. `npm install`
2. Copy `.env.sample` to `.env`
3. Copy `users.sample.json` to `users.json`
4. `npm run dev`
5. http://localhost:8080
6. username: `testu0`, password: `testp0`

Put `.mp4` or video files compatible with your target browser(s) in `./media`.

## Production

1. `./build.sh`
2. `touch users.json` and add users
3. `./serve.sh`
