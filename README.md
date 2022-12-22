# cloud-gateway-client
Agrihub Client; code with AngularJS and ❤

## Features
1. Full SPA (Single Page Application).
2. Authenticated Using JWT (JSON Web Token).
3. User credentials and token store on browser cookie (raw).
4. Access control per page, thanks to my own [authenticate](https://github.com/OckiFals/cloud-gateway-client/blob/master/scripts/services/authenticate.js) and [access-control](https://github.com/OckiFals/angularJS-agri-hub/blob/dev/scripts/services/access-control.js) services.
5. Using Bootstrap Component UI, thanks to [angular-ui bootsrap](https://angular-ui.github.io/bootstrap/).

# Cons
1. Storing raw data on browser cookie is very risk, inseccure, and bad-practice...
