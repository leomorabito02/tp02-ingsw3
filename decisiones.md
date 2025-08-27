## Decisiones:

Decidí crear con IA una app muy simple para este tp, funciona creando, borrando y actualizando mensajes y guardándolos en una DB mysql

Luego de crear la app les aplico un dockerfile a la db, al backend y al frontend para crear contenedores

Ya tengo todo listo para subir a docker con docker login, docker tag para crear una versión etiquedata del contededor y docker push, luego de dividir en qa y prod las voy a subir

Luego, para automatizar la creación de todos los contenedores cree un docker-compose para que se levanten todos los contenedores

Tengo dos volumenes:
- ./db/init.sql:/docker-entrypoint-initdb.d/init.sql #inicia la db
- db-data:/var/lib/mysql

el primero inicia la db y ejecuta el sript
la segunda mantiene las persistencia de datos si se elimina el volumen, guarda los datos en esa dirección dentro de docker


mis variables de entonor se guardan en un .env para mayor seguridad de los datos, este archivo no se debería pushear a git.

para separar en entornos, divido el docker compose y cambios los nombres de los servicios, para distingirlos agrego -prod o -qa, también cambio los puertos en el .env, distintos para qa y prod, para que no haya conflicto

tuve muchos problemas, pero principalmente eran del código, no había buena comunicación entre el frontend y el backend
* Error: SyntaxError: Unexpected token '<': El frontend intentaba leer datos de la API en formato JSON, pero el servidor de desarrollo de Vite le devolvía el archivo index.html porque la petición no se estaba redirigiendo correctamente.

* Error: 404 Not Found en el backend: El proxy de Vite estaba eliminando la parte /api de la URL, lo que hacía que el backend de Go no reconociera la ruta y devolviera un error.

* Error: 500 Internal Server Error: La petición del frontend llegaba al backend, pero este fallaba al intentar procesarla, probablemente por un error al conectar con la base de datos que solo ocurría dentro de la red de Docker.

* Error: Must set target or forward: El proxy de Vite fallaba porque la variable que define el target no se estaba pasando correctamente desde el docker-compose.yml, rompiendo la configuración de redirección


Mi aplicación se puede ejecutar igual en cualquier maquina porque está contenida en contenedores, en dónde están todas las dependencias y librerías necesarias. 

Ahora que todo funciona, procedo a subir las imagenes a docker hub
docker tag tp02-db leomorabito02/database:v1.0
docker push leomorabito02/database:v1.0

me gustó la estrategia de poner la v de versión seguido de tres digitos, la primera para cambios de arquitectura, la segunda para cambios de funcionalidades y la tercera para corregir errores.

para el punto 7, ejemplo con la db de producción:
```
db-prod:
    image: leomorabito02/database:v1.0
```



