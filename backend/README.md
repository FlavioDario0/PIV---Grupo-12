KINEO BACKEND API


O QUE É NECESSÁRIO PARA RODAR

Antes de executar a API, é necessário ter instalado na máquina:

Java 17 ou superior
PostgreSQL
IntelliJ IDEA ou outra IDE Java
Git

CONFIGURAÇÃO DO BANCO DE DADOS

Crie um banco de dados no PostgreSQL com o nome:

CREATE DATABASE kineo;

Depois configure o arquivo application.properties com os dados do seu PostgreSQL:

spring.application.name=kineo-backend
server.port=8080

spring.datasource.url=jdbc:postgresql://localhost:5433/kineo
spring.datasource.username=postgres
spring.datasource.password=SUA_SENHA

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

Ajuste a porta, usuário e senha de acordo com a sua instalação do PostgreSQL.

COMO RODAR O PROJETO

Na pasta backend, execute:

Windows:
mvnw.cmd spring-boot:run

Linux/Mac:
./mvnw spring-boot:run

Ou rode a classe BackendApplication pela IDE.





SWAGGER

Com a aplicação rodando, acesse:

http://localhost:8080/swagger-ui/index.html

O Swagger permite:

visualizar os endpoints disponíveis
ver o formato do JSON esperado
testar as requisições diretamente pelo navegador

ENDPOINT DE CADASTRO

POST /auth/register

Exemplo de body:

{
"nome": "Isaac",
"dataNascimento": "20/06/2004",
"email": "isaac@email.com
",
"senha": "123456",
"objetivo": "Ganho de massa muscular",
"nivel": "Iniciante",
"altura": 1.75,
"peso": 78.5,
"frequenciaTreinos": "3-4 dias por semana"
}

OBSERVAÇÕES

O backend precisa estar rodando para o Swagger funcionar.
Os nomes dos campos enviados pelo frontend devem ser exatamente iguais aos definidos no endpoint.
O banco será atualizado automaticamente pelo Hibernate com ddl-auto=update.
