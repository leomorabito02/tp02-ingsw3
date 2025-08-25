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




