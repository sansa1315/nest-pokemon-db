export const envConfiguration = () => {
     console.log('MONGODB:', process.env.MONGODB);
     return {
         environment: process.env.NODE_ENV || 'dev',
         mongodb: process.env.MONGODB || 'http://localhost:27017/nest-pokemon',
         port: process.env.PORT || 3000,
         defaultLimit: process.env.DEFAULT_LIMIT,
         defaultOffset: process.env.DEFAULT_OFFSET

     }
}