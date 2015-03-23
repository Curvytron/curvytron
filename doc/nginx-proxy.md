## Setting it up with Nginx

Create a virtual host:

```nginx
server {
    listen 80;

    # Your domain name:
    server_name curvytron.acme.com;

    # Path to curvytron repository on file system:
    root /path/to/curvytron/web;
    index index.html;

    # Custom logs (Optional):
    access_log  /var/log/nginx/curvytron/access.log combined;
    error_log   /var/log/nginx/curvytron/error.log;

    location / {
        # Address and port of your running Curvytron server:
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
