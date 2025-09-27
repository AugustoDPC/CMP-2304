# CMP-2304
TECNOLOGIA DE CONSTRUCAO DE SOFTWARE

# 1. Login no Docker Hub
docker login

# 2. Build da imagem a partir do Dockerfile
docker build -t minha-api:latest .

# 3. Ver as imagens disponíveis
docker images

# 4. Tag da imagem para o Docker Hub
docker tag minha-api:latest meunome/minha-api:1.0

# 5. Enviar (push) a imagem para o Docker Hub
docker push meunome/minha-api:1.0

