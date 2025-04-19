## QuaBot Bot
![Typescript](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square)
![Discord](https://img.shields.io/badge/Discord.js-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white

On January 1, 2025, we chose to shutdown QuaBot forever. We are now open-sourcing the bot's source code. We might open-source the dashboard & api in the future. The code can be ran by cloning the repository and adding the .env file based on the .env.example. Please not some values such as a the Websocket Port are API-specific and do not apply without the API code. The code will not be bug-free given the bot hasn't been updated in a while. If you need support regarding the bot's sources, please visit our Discord server: https://discord.gg/DAWKAej8Qb. We might not have all the answers and we won't update the bot for the forseeable future.

**Feel free to make PRs to improve or fix bugs. If you are going to use this to create your own bot we do recommend a full rewrite of the codebase due to the limitations of the v7 structure.**

### Installation / Starting
- **Install dependencies.** We use *Node.js* as Javascript runtime and *Yarn* as a package manager, so you should install it. Use this command in root of this repo to install *Yarn* and frontend dependencies: 
```bash
npm install --global yarn && yarn install
```
- **Start it.** Use just `yarn start` in root of this repo to run it.
This product includes the QuaBot Discord bot itself, usable in Discord servers only.
