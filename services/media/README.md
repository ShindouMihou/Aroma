# 🌉 Aromatic Media Server
Aromatic Media Server is the media server of the Aroma platform which is intended to handle file operations for avatars and book covers. It supports AWS S3 and local filesystems with a maximum of 10 megabytes per file (a hardcoded limit to reduce costs, not any technical issues). 

The media server was created to workaround the issue with Sveltekit being unable to handle file uploads neatly. It is recommended to use AWS S3 for this but if unable to bear the costs of AWS S3 then we recommend pairing this with NGINX to enable fast uploads.

## ⚙️ Flow
The Aromatic Media Server works akin to AWS S3's presigned urls where the website's backend asks for presigned token from the media server that contains the important metadata such as the filename, directory, who is responsible for this operation and other details and can then allow the frontend client to use that presigned token to upload the file onto the media server who checks the validity of the token from the database and stores the file if the token is valid.

![Aromatic Media Server](https://user-images.githubusercontent.com/69381903/169654864-2935e453-71e1-4ab4-9b5e-591043a38b50.png)
