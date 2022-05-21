# :night_sky: Aromatic Media Server
Aromatic Media Server is the media server of the Aroma platform which is intended to handle file operations for avatars and book covers. It supports AWS S3 and local filesystems with a maximum of 10 megabytes per file (a hardcoded limit to reduce costs, not any technical issues). 

The media server was created to workaround the issue with Sveltekit being unable to handle file uploads neatly. It is recommended to use AWS S3 for this but if unable to bear the costs of AWS S3 then we recommend pairing this with NGINX to enable fast uploads.