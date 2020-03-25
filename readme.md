
# Creating a Rest API with JWT authentication and role based authorization using TypeScript…

Today, we are going to use TypeScript Express.js and TypeORM to create an enterprise level Rest API with JWT authentication and role based authorization. The objective is to create a repository that you can use as bases for your real life projects.

## Let’s start

TypeORM has a CLI tool that allow us to generate a base application already in TypeScript. To use this tool we need first to install typeORM as a global dependency:

    npm install -g typeorm

Now we can set up our application:

    typeorm init --name jwt-express-typeorm --database postgres --express

It will create an example express application already in TypeScript with TypeORM and body-parser. Let’s install those dependencies with:

    npm install

Now, we are going to install some additional dependencies

    npm install -s helmet cors jsonwebtoken bcryptjs pg class-validator ts-node-dev

After that, we are going to have the following dependencies

**helmet**
Help us to secure our application by setting various HTTP headers

**cors**
Enable cross-origin Requests

**body-parser**
Parses the client’s request from json into javascript objects

**jsonwebtoken**
Will handle the jwt operations for us

**bcryptjs**
Help us to hash user passwords

**typeorm**
The ORM we are going to use to manipulate database

**reflect-metadata**
allow some annotations features used with TypeORM

**class-validator** 
A validation package that works really well with TypeORM

**postgres** 
We are going to use postgres as dev database

**ts-node-dev**
Automatically restarts the server when we change any file

### Installing type check dependencies 

Since we are working with TypeScript, it is a good idea to install @types for our dependencies.

    npm install -s @types/bcryptjs @types/body-parser @types/cors @types/helmet @types/jsonwebtoken

After that you will be able to use autocomplete and typecheck even with the JavaScript packages. Now we start the server, so the synchronize tool can generate our database tables.

    npm start

Now we can run the migration, to insert the first admin user.

    npm run migration:run

Finally, your server is ready to go. Just get the Postman, or any other tool, and make some requests.