![furrify title](https://user-images.githubusercontent.com/33985207/133672173-2d7ff06e-6f94-4742-a201-c54a85c5839a.png)

Frontend for [FurrifyWS-Strorage](https://github.com/Skyterix1991/FurrifyWS-Storage) microservices.

## Configuration

All relevant configuration regarding connection with Microservices and Keycloak can be found in path below:

`/src/shared/config/api.constants.ts:`

`KEYCLOAK_AUTH_URL - Keycloak authorization server url.`

`KEYCLOAK_REALM - Keycloak realm to use.`

`KEYCLOAK_CLIENT_ID - Keycloak client id to use.`

`CDN_ADDRESS - Address to use when pulling files, thumbnails etc. You specify the location to upload the files in microservices then configure endpoint you can access thoose files with. You can use nginx server for example.`

`SERVER_ADDRESS - Address corresponding to your gateway from hosted microservices.`

The folder `config` contains more files that you can tweak for better looks or default behaviour.
