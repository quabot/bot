declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string | '';
            DATABASE_URI: string | '';
            TOPGG_API_KEY: string | '';
            CLIENT_ID: string | '';
            GUILD_ID: string | '';
            NODE_ENV: 'development' | 'production';
            RELOAD_COMMANDS: string | '';
        }
    }
}
  
export {}
