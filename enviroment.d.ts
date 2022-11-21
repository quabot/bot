declare global {
    namespace NodeJS {
      interface ProcessEnv {
        TOKEN: string | '';
        DATABASE_URI: string | '';
        TOPGG_API_KEY: string | '';
        NODE_ENV: 'development' | 'production';
      }
    }
  }
  
  export {}