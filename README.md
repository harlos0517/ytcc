# YTCC - YouTube Closed Caption Tool
YTCC is a project aiming to be an online collaboratable closed caption editing tool for YouTube videos.

The ultimate goal of this project is to let people understand videos and alike from all over the world, stimulating "[culture cross-pollination](https://www.youtube.com/watch?v=tIU0xG-lXkQ&t=5917s&ab_channel=TrashTaste)".

## Architecture
![image](https://user-images.githubusercontent.com/20572126/155831237-5c54692f-1012-4b0a-b184-7d1f971a5682.png)

## How To Build & Run (Ubuntu)
### First Build
1. Create [Google Oauth Client Credentials](https://console.cloud.google.com/apis/credentials?project=ytcc-341407&hl=zh-tw).
  For details see [here](https://cloud.google.com/docs/authentication/end-user?hl=zh-tw#creating_your_client_credentials).
2. [Install MongoDB Community Edition](https://docs.mongodb.com/manual/installation/) and [create an admin user](https://blog.yowko.com/mongodb-enable-auth/).
  Please also see [here](https://stackoverflow.com/questions/51149455/mongodb-getting-error-while-creating-new-user) or else you wouldn't be able to successfully create user.
3. Create `db/` directory at project root.
3. Create `.env` file from the `.env.example` file, and replace the google client information you retrieved in step 1, and mongoDB username and password you setup in step 2.
4. Go to both backend and frontend directory and `yarn`.

### Run
1. Run `./db-script.sh` to run database.
2. `yarn dev` in backend directory to run backend server.
3. `yarn dev` in frontend directory to run frontend client. Or, you can build static files by `yarn build` and start static server by `yarn start`.

## File Structure
- `old/`: files from the old version
- **`api/`**: common api type definition
- `spec/`: yaml files of api and page design
- `.gitignore`: files to be ignored by git
- `.env.example`: example dotenv file
- `db-script.sh`: script that starts mongoDB
- `vetur.config.js`: this is to let VScode Vetur extension know where the frontend directory is located
- **`frontend/`**: frontend, see [frontend Readme.md](https://github.com/DeemoHarlos/ytcc/tree/master/frontend)
- **`backend/`**: backend
  - `src/`: code directory
    - `server.ts`: entry point
    - `middleware.ts`: authentication middleware
    - `route/`: routes
    - `schema/`: Mongoose Schemas
    - `util/`: utility functions
  
## Appendix
### Flow of Google OAuth Login
![image](https://user-images.githubusercontent.com/20572126/155833832-f877eee3-9219-4655-8022-ccebacdf6d9c.png)
