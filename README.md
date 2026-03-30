# 🦌 Educación Bambi 🦌
## ¿Qué es este proyecto? 🤔
Este proyecto es una página web para el almacenamiento, gestion y consulta de contenidos educativos multimedia de Hogar Bambi. 
## ¿Cómo ejecuto el proyecto en mi máquina? ☝️🤓
Primero, agrégese a usted mismo como colaborador de este proyecto 🥸. Luego inicialice y cargue el repositorio de proyecto en su máquina siguiendo los siguientes comandos
```
git clone https://github.com/BambiDev25/EducacionBambi.git
cd EducacionBambi
git checkout main 
git config --global user.name "Nombre Colaborador"
git config --global user.email "correo@example.com"
git pull origin main
```
Instale las dependencias del proyecto 📁
```
npm i
```
Luego, debe crear en el root de su proyecto un archivo .env que contenga las variables de entorno presentes en el archivo .env.template. Las variables de entorno a cargar las encontrará en la página web de Firebase 🔥 en un proyecto llamado "EducacionBambiWebPage". Luego, acceda a la configuración del proyecto, entre a la sección general y abajo del todo encontrará los códigos de las API keys del proyecto. Cargue las API keys en su archivo .env. Recuerde que debe ingresar a Firebase desde el correo [educacionvirtualbambi@gmail.com]

Y listo! 🥂 para ejecutar el proyecto en modo desarrollador use el siguiente comando
```
npm run dev
```
Si quiere generar una build de producción para desplegar el proyecto en un servicio de hosting, 
use el comando a continuación, el cual generará una carpeta llamada dist en el root de su proyecto
la cual contiene la página lista para desplegar 🚀.
```
npm run build
```
Nada más que decir, mucho éxito y que todo marche bien 🤑😎 Sientase Libre de modificar este readme de ser necesario.