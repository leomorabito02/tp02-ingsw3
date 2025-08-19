FROM node:20.14.0-slim
WORKDIR /frontend

# Paso 1: Copiar solo los archivos de configuración de dependencias
# Esto permite que Docker cachee la capa de npm install.
COPY package*.json ./

# Paso 2: Instalar las dependencias
# Este paso solo se ejecuta si package.json o package-lock.json cambian.
RUN npm install

# Paso 3: Copiar el resto del código
# Esto se hace después de la instalación para que Docker no invalide el caché de la capa RUN si solo cambiaste un archivo de tu proyecto.
COPY . .

EXPOSE 5173

# Paso 4: Comando de inicio
CMD ["npm", "run", "dev"]