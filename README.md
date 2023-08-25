# videos-app-backend

Backend para gestionar listas de reproducción de videos de YouTube, desarrollado con Node.js v18.17.1 + Express.js + Sequelize (PostgreSQL).


## Pasos para ejecución de proyecto de manera local.

### N°1 Instalar dependencias.
```sh
npm install
```

### N°2 Levantar base de datos configurada en archivo docker-compose.yml.
```sh
docker-compose up postgres -d
```

### N°2.1 (OPCIONAL) Si desea visualizar los datos guardados en la DB a través de PGADMIN, levante el servicio "pgadmin" configurado en archivo docker-compose.yml. (Los datos para iniciar sesión en PGADMIN estan en el archivo docker-compose.yml, en las líneas: 18, 19 y 21).
```sh
docker-compose up pgadmin -d
```

### N°3 Crear archivo ".env" con las variables de entorno (Los datos de conexión a la DB puede encontrarlos en el archivo docker-compose.yml, en las líneas: 7, 8, 9 y 11.), tambien debe generar su API KEY para usar el API de YouTube. Ejemplo:
```sh
PORT=3000
NODE_ENV='dev'
DB_USER=''
DB_PASSWORD=''
DB_HOST='localhost'
DB_NAME=''
DB_PORT=''
DATABASE_URL='postgres://"USER":"PASSWORD"@"DB_HOST":"DB_PORT"/"DB_NAME"'
API_URL_YOUTUBE='https://www.googleapis.com/youtube/v3/videos'
API_KEY_YOUTUBE=''
```

### N°4 Ejecutar migraciones.
```sh
npm run migrations:run
```

### N°5 Ejecute con Hot-Reload para desarrollo.
```sh
npm run dev
```

### N°5.1 Ejecute sin Hot-Reload.
```sh
npm run start
```
