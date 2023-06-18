---
title: Nginx
date: 2023-06-16 18:31:19
permalink: /pages/3a7e1b/
categories:
  - 工具
  - Nginx
tags:
  - 
author: 
  name: MYH
  link: https://github.com/mengyahui
---
## 一、nginx 概述

nginx 是一款轻量级HTTP和反向代理服务器，同时也是一个 IMAP/POP3/SMTP 代理服务器，特点是占有内存少，并发能力强，事实上nginx 的并发能力确实在同类型的网页服务器中表现较好，中国大陆使用Nginx网站用户有：百度、京东、新浪、网易、腾讯、淘宝等。

nginx 具有如下特点：

- 更快：单次请求响应更快，高并发可以更快的处理响应；
- 高拓展性：设计极具扩展性，由多个不同功能、不同层次、不同类型且耦合度极低的模块组成；
- 高可靠性：很多高流量网站都在核心服务器上大规模使用 nginx；
- 低内存消耗：一般1万个非活跃的 HTTP Keep-Alive 连接在 nginx 中仅消耗 2.5MB 内存；
- 高并发：单机支持 10 万以上的并发连接；
- 热部署：master 管理进程与 worker工作进程的分离设计，使得 nginx 能够支持热部署；
- 开源协议：使用 BSD 许可协议，免费使用，且可修改源码。

nginx 的主要应用场景如下：

![Nginx应用场景](../../../../../../resources/blog/Nginx/assets/Nginx.png)

## 二、关于代理

nginx 是一款反向代理服务器，什么是反向代理呢？与之相对的，什么又是正向代理呢？

**正向代理：**

正向代理（forward）意思是一个位于客户端和原始服务器 (origin server) 之间的服务器，为了从原始服务器取得内容，客户端向代理发送一个请求并指定目标 (原始服务器)，然后代理向原始服务器转交请求并将获得的内容返回给客户端。

正向代理是为客户端服务的，客户端可以根据正向代理访问到它本身无法访问到的服务器资源。

![image-20230616192510073](../../../../../../resources/blog/Nginx/assets/image-20230616192510073.png)

在访问谷歌的时候，由于防火墙的存在是不能直接访问的，但可以借助 VPN 来实现，这就是一个简单的正向代理的例子。正向代理 “代理” 的是客户端，而且客户端是知道目标的，而目标是不知道客户端是通过 VPN 访问的。

**反向代理：**

反向代理（Reverse Proxy）方式是指以代理服务器来接受 internet 上的连接请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给 internet 上请求连接的客户端，此时代理服务器对外就表现为一个反向代理服务器。

反向代理是为服务端服务的，反向代理可以帮助服务器接收来自客户端的请求，帮助服务器做请求转发，负载均衡等。

![image-20230616195719028](../../../../../../resources/blog/Nginx/assets/image-20230616195719028.png)

**二者的区别：**

正向代理对客户端是透明的，对服务端是非透明的，即服务端并不知道自己收到的是来自代理的访问还是来自真实客户端的访问。

反向代理对服务端是透明的，对客户端是非透明的，即客户端并不知道自己访问的是代理服务器，而服务器知道反向代理在为他服务。

## 三、安装 nginx

虚拟机软件：VMWare Workstation 17 Pro.

操作系统：CentOS 7.9

1. 添加 nginx 的 yum 仓库：

```shell
# 创建文件夹使用vim编辑
vim /etc/yum.repos.d/nginx.repo

# 填写以下内容并保存
[nginx-stable]
name=nginx stable repo
baseurl=http://nginx.org/packages/centos/\$releasever/\$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true
```

2. 安装 nginx：

```shell
yum -y install nginx
```

安装完成后可使用 `rpm -ql nginx` 命令查看 nginx 的安装信息，我们只需关注其中的两个安装配置：

`/etc/nginx/conf.d`：子配置项的存放处，`/etc/nginx/nginx.conf` 主配置文件会默认把这个文件夹中所有子配置项都引入；

`/usr/share/nginx/html`：静态文件都放在这个文件夹，也可以根据你自己的习惯放在其他地方；

## 四、nginx 常用命令

### 4.1 系统命令

```shell
systemctl enable nginx 			# 开机自动启动
systemctl disable nginx 		# 关闭开机自动启动

systemctl start nginx 			# 启动 nginx
systemctl stop nginx 			# 停止 nginx

systemctl restart nginx 		# 重启 nginx
systemctl reload nginx 			# 重新加载 nginx

systemctl status nginx 			# 查看 nginx 运行状态
ps -ef | grep nginx 			# 查看 nginx 进程
kill -9 pid 					# 根据上面查看到的 nginx 进程号，杀死 nginx 进程，-9 表示强制结束进程
```

### 4.2 nginx 命令

```shell
nginx -s reload  		# 向主进程发送信号，重新加载配置文件，热重启
nginx -s reopen  		# 重启 
nginx -s stop    		# 快速关闭
nginx -s quit    		# 等待工作进程处理完成后关闭
nginx -T         		# 查看当前 nginx 最终的配置
nginx -t         		# 检查配置是否有问题
```

## 五、nginx 配置文件

nginx 配置文件主要分为如下几个模块：

1. 全局配置模块，影响 nginx 的全局配置；
2. events 模块，影响 nginx 服务器与用户的网络连接；
3. http 模块，用于代理，缓存，日志定义等绝大多数功能和第三方模块的配置；
4. server 模块，用于配置虚拟主机的相关参数，一个 http 模块中可以有多个 server 模块；
5. location 模块，用于配置匹配的 uri ；
6. upstream 模块，用于配置后端服务器具体地址，是负载均衡配置不可或缺的部分。

下面是一个比较完整的 nginx.conf 配置文件：

```nginx
# 全局配置模块
user  nginx;                        		# 运行用户，默认即是 nginx，可以不进行设置
worker_processes  auto;             		# nginx 进程数，一般设置为和 CPU 核心数一样
# nginx 的错误日志存放目录,和日志级别，从高到低分别是debug—info—notice—warning—error—critic,含义分别是测试、显示、通知、警告、报错和紧急,显示信息逐步减少。在生产环境中,我们一般将日志级别定义为warning及以上。
error_log  /var/log/nginx/error.log warn;   
pid        /var/run/nginx.pid;      		# nginx 服务启动时的 pid 存放位置

# events 模块
events {
    use epoll;# 使用epoll的I/O模型(如果你不知道nginx该使用哪种轮询方法,会自动选择一个最适合你操作系统的)
    worker_connections 1024;   # 每个进程允许最大并发数
}

# http 模块
# 配置使用最频繁的部分，代理、缓存、日志定义等绝大多数功能和第三方模块的配置都在这里设置
http { 
    # 设置日志格式
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;   # nginx访问日志存放位置

    sendfile            on;   # 开启高效传输模式
    tcp_nopush          on;   # 减少网络报文段的数量
    tcp_nodelay         on;
    keepalive_timeout   65;   # 保持连接的时间，也叫超时时间，单位秒
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;      # 文件扩展名与类型映射表
    default_type        application/octet-stream;   # 默认文件类型

    include /etc/nginx/conf.d/*.conf;   # 加载子配置项
    
    # server模块
    server {
     listen       80;           # 配置监听的端口
     server_name  localhost;    # 配置的域名
      
     # location模块
     location / {
      root   /usr/share/nginx/html;  # 网站根目录
      index  index.html index.htm;   # 默认首页文件
      deny 172.168.22.11;   # 禁止访问的ip地址，可以为all
      allow 172.168.33.44；# 允许访问的ip地址，可以为all
     }
     
     error_page 500 502 503 504 /50x.html;  # 默认50x对应的访问页面
     error_page 400 404 error.html;   # 同上
    }
}
```

## 六、location 指令详解

location 是 nginx 中的块级指令(block directive)，其功能是用来匹配不同的 URI 请求，进而对请求做不同的处理和响应，语法格式如下：

```nginx
location [ = | ~ | ~* | ^~ ] uri { … }
```

### 6.1 URI 路径匹配

URI 前面的参数叫做路径通配符，含义如下：

- `=`：表示精确匹配；

- `~ `：表示区分大小写的正则匹配；

- `~*` ：表示不区分大小写的正则匹配；

- `^~ `：表示 uri 以某个常规字符串开头，不是正则匹配。

优先级：

1. 等号类型（=）的优先级最高。一旦匹配成功，则不再查找其它 location 的匹配项；
2. ^~ 和 /，使用前缀匹配，不支持正则表达式，如果有多个 location 匹配成功的话，不会终止匹配过程，**会匹配表达式最长的那个**
3. 如果上一步得到的最长的 location 为 ^~ 类型，则表示阻断正则表达式，不再匹配正则表达式；
4. 如果上一步得到的最长的 location 不是 ^~ 类型，继续匹配正则表达式，只要有一个正则成功，则使用这个正则的 location，立即返回结果，并结束解析过程。

### 6.2 root 指令

在 location 命中后，若其下配置的是 root 指，则会在 root 指令配置的文件夹内寻找资源，并把 location 配置路径附加到其后

例如，我们的请求是：/js/jquery.js ，location 配置如下：

```nginx
location /js {
    root /home/static/;
}
```

则实际返回的是 /home/static/js 下的 jsquey.js 文件。此外，location 内部默认配置了一条规则 `index index.html` ，当实际访问的是一个目录时，会返回该目录中 index 指令指定的文件，如果该目录中不存在该文件，则会返回 403。

### 6.3 alias 指令

和 root 不同的是，在 location 命中后，会将 location 配置的 uri 指向 alias 配置的路径，且不会拼接上 location 配置的路径，且 alias 配置的最后一定要有 `/` ，而 root 可以没有。

例如，我们的请求是：/static/logo.png ，location 配置如下：

```nginx
location /static {
	alias /home/static/
}
```

则实际返回的是 /home/static/logo.png 文件。

### 6.4 proxy_pass 指令

location 下的 proxy_pass 用于代理请求，location 命中后，会将请求通过 proxy_pass 指定的 URL 进行转发。

若 proxy-pass 的地址只配置到端口，不包含`/`或其他路径，那么 location 将被追加到转发地址中：

```nginx
location /some/path/ {
    proxy_pass http://localhost:8080;
}
```

像上面那样，如果请求的路径为 http://localhost/som/path/page.html ，则实际的请求地址为 http://localhost:8080/some/path/page.html

若 proxy-pass 的地址包含 `/` 相关路径，则 `/` 相关路径将会被 location 的路径替换：

```nginx
location /some/path/ {
    proxy_pass http://localhost:8080/zh-cn/;
}
```

像上面那样，如果请求的路径为 http://localhost/som/path/page.html ，则实际的请求地址为 http://localhost:8080/zh-ch/page.html

## 七、nginx 部署案例

### 7.0 环境搭建

#### 7.0.1 安装 JDK

1. 检查是否已经安装 JDK，命令为：`yum list installed | grep jdk`
2. 查看 JDK 软件包列表，命令为：`yum search java | grep -i --color jdk`
3. 安装 JDK，命令为：`yum install -y java-11-openjdk.x86_64`
4. 查看是否安装成功，命令为：`java -version`
5. 卸载 JDK，命令为：`yum remove -y java-11-openjdk.x86_64`

#### 7.0.2 安装 MySQL

为了方便，这里选择使用 Docker 安装 MySQL。

1. 拉取 MySQL 镜像，命令为：`docker pull mysql:8.0.17`
2. 运行 MySQL 容器，命令如下：

```shell
docker run \
-p 3306:3306 \
--name mysql \
-v /docker/mysql/logs:/logs \
-v /docker/mysql/data:/var/lib/mysql \
-v /docker/mysql/conf:/etc/mysql/conf.d \
-e MYSQL_ROOT_PASSWORD=root \
-d mysql:8.0.17
```

#### 7.0.3 准备部署项目

静态网页使用 AdminLTE-3.2.0，Java 项目选择若依项目打包后的 jar 包和 war 包，名字分别为：ruoyi-admin.jar 和 ruoyi-admin.war，在本地均已调试好。部署 ruoyi-admin.war 的 Tomcat 服务器选择 apache-tomcat-8.5.81。

以上资源均放到了 /home/apps/ 目录下。除此之外，本地虚拟机的 IP 为 192.168.184.129。

为了方便修改配置文件，这里选择使用在 vscode 中使用 Remote-SSH 插件来连接 Linux 虚拟机，使用 NGINX Configuration 插件来使 nginx 的配置文件语法高亮。

![image-20230617170910081](../../../../../../resources/blog/Nginx/assets/image-20230617170910081.png)

连接上虚拟机后，打开 /etc/nginx/ 目录，查看其中的 nginx.conf 文件，可以看到 /etc/nginx/conf.d/ 目录下的配置文件也会被加载，所以在部署项目时，只需要在这个目录下新建配置文件即可。

### 7.1 静态网页

在 /etc/nginx/conf.d/ 目录下新建 8000-adminLTE.conf 文件，写入如下内容：

```nginx
server{
  
    listen 8000;
    server_name localhost;
    
    location / {
        root /home/apps/AdminLTE-3.2.0;
        index index.html index2.html index3.html;
    } 
}
```

listen 监听可以配置成 IP 或 port 或 IP + port；server_name 主要用于区分不同的 server，可以随便起，也可以使用变量 ` $hostname ` 配置成主机名。

最后，访问 192.168.184.129:8000 检查静态网页是否部署成功。

### 7.2 HTTP 反向代理

首先，使用命令 `java -jar ruoyi-admin.jar` 启动 ruoyi-admin，ruoyi-admin 项目配置的端口是 8088，访问 `192.168.184.129:8088` 检查项目是否启动。

然后在 /etc/nginx/conf.d/ 目录下新建 8001-ruoyi-jar.conf 配置文件，写入如下内容：

```nginx
server {
  
  listen 8001;
  server_name ruoyi.jar;
  
  location / {
    proxy_pass http://localhost:8088;
  }
}
```

使用 `nginx -s reload` 重新加载配置文件，访问：`192.168.184.129:8001` 检查 HTTP 反向代理是否成功。

由于使用反向代理之后，后端服务无法获取用户的真实 IP，所以，一般反向代理都会设置以下 header 信息。

```nginx
location / {
    #nginx的主机地址
    proxy_set_header Host $http_host;
    #用户端真实的IP，即客户端IP
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    proxy_pass http://localhost:8088;
}
```



### 7.3 动静分离

Apache Tocmat 严格来说是一款 Java EE 服务器，主要是用来处理  Servlet 请求。处理 css、js、图片这些静态文件的 IO 性能不够好，因此，将静态文件交给 nginx 处理，可以提高系统的访问速度，减少 tomcat 的请求次数，有效的给后端服务器降压。

1. 将 ruoyi-admin.war 移动到 tomcat 解压目录的 webapps 目录下，并重命名为 ROOT.war，同时删除 ROOT 目录

```shell
mv /home/apps/ruoyi-admin.war /home/apps/apache-tomcat-8.5.81/webapps/ROOT.war
rm -rf //home/apps/apache-tomcat-8.5.81/webapps/ROOT
```

2. 在 tomcat 的 bin 目录下执行命令 `sh startup.sh` 运行 tomcat 服务器。

3. 在浏览器访问 `192.168.184.129:8080` 检查项目是否部署成功。

至此，ruoyi-admin 已经在 tomcat 中部署好了，下面是实现动静分离的具体配置：

1. 首先调整 tomcat 部署后生产的目录 ，主要是将编译后的静态文件的所在目录 static 移动到了 /home/www 目录下，此外将 ruoyi-admin 的国际化资源目录移动到 templates 目录下。

```shell
cd /home/apps/apache-tomcat-8.5.81/webapps/ROOT
mv WEB-INF/classes/static/i18n  WEB-INF/classes/templates/i18n 
mv WEB-INF/classes/static /home/www/
```

目录调整后，需要修改 application.yml 配置文件中的国际化资源配置：

```yaml
messages:
    # 国际化资源文件路径 
    # 将 static/i18n/messages 修改为 templates/i18n/messages
    basename: templates/i18n/messages
```

2. 在 /etc/nginx/conf.d/ 目录下新建 8002-ruoyi-war.conf 配置文件，写入如下内容：

```nginx
server {
    listen 8002;
    server_name ruoyi.war;

    location / {
        proxy_pass http://localhost:8080;
    }

    location ~ \.(js|css|png|jpg|gif|ico) {
        root /home/www/static;
    }

    location = /html/ie.html {
        root /home/www/static;
    }
  
    location ^~ /fonts/ {
        root /home/www/static;
    }
}
```

配置完成之后需要使用命令 `nginx -s reload` 重新加载 nginx 配置文件，同时重新启动 tomcat 服务器。启动后可能会出现静态资源无法访问的情况，查看 `/var/log/nginx/error.log` ，若发现权限不足，则需要从如下两个方面进行修改：

1. 静态资源存放目录权限不足，可以使用命令 `chmod -R 777 /home/www/static` 解决。
2. 若静态资源存放目录的权限没问题，则需要考虑 `/etc/nginx/nginx.conf`  配置文件中的 nginx 启动用户和本机的用户是否保持一致，不一致，改为一致即可。

### 7.4 缓冲（buffer）和缓存（cache）

#### 7.4.1 缓冲（buffer）

缓冲一般放在内存中，如果不适合放入内存（比如超过了指定大小），则会将响应写入磁盘临时文件中。启用缓冲后，nginx 先将后端的请求响应（response）放入缓冲区中，等到整个响应完成后，再发给客户端。nginx 缓冲能够解决由于客户端性能慢而导致与后端服务器长时间连接的问题。

![image.png](../../../../../../resources/blog/Nginx/assets/1659585056819-df82befd-d847-4a0b-bffc-84cf626c2fed.png)

开启代理缓冲后，nginx 可以用较快的速度尽可能将响应体读取并缓冲到本地内存或磁盘中，同时根据客户端的网络质量以合适的网速将响应传递给客户端。这样既解决了 server 端连接过多的问题，也保证了能持续稳定的向客户端传递响应。

![image.png](../../../../../../resources/blog/Nginx/assets/1659585458893-c276995d-f299-444b-bd33-cee5933ab878.png)



缓冲（buffer）可以配置在 http、server 或 location 的上下文 context 中，我们可以使用如下指令来调整：

- `proxy_buffering`：这个指令控制所在 context 或者子 context 的 buffer（缓冲） 是否打开。默认是 on。

- `proxy_buffers`：这个指令控制缓冲（buffer）的数量（第一个参数）和大小（第二个参数）。默认是 8 个 buffer（缓冲），每个 buffer（缓冲） 大小是 1 个内存页（4k 或 8k）。增加 buffer 的数量可以缓冲更多的信息。

- `proxy_buffer_size`：是来自后端服务器 response 信息的一部分，它包含 Headers，从 response 分离出来。这个指令设置 response 的缓冲。默认，它和 proxy_buffers 一样，但是因为它仅用于 Headers，所有它的值一般设置得更低。

```nginx
location / {
    proxy_buffers 16 4k;
    proxy_buffer_size 2k;
    proxy_pass http://localhost:8088;
}
```

#### 7.4.2 缓存（cache）

启用缓存后，nginx将响应保存在磁盘中，返回给客户端的数据首先从缓存中获取，这样子相同的请求不用每次都发送给后端服务器，减少到后端请求的数量。

![img](../../../../../../resources/blog/Nginx/assets/1659599505974-889b4227-80eb-4deb-8bae-303828cc3bc4.png)

缓存的配置，主要射击如下几个指令：

1. **proxy_cache_path**

使用缓存（cache）时，需要先在 http 的上下文中使用 `proxy_cache_path` 指令来配置缓存的本地文件目录、名称和大小，其语法格式如下：

```nginx
proxy_cache_path path [levels=number] keys_zone=zone_name:zone_size [inactive=time][max_size=size];
```

- path：缓存的本地文件目录。
- levels：指定该缓存空间对应的目录层级，最多可以设置3层，每层取值为 1|2。

默认情况下，本地缓存目录中的文件名为 `proxy_cache_key` 的 MD5 值，`proxy_cache_key` 默认值是：

```nginx
proxy_cache_key $scheme$proxy_host$uri$is_args$args;
```

假设 proxy_cache_key 的值为 `43c8233266edce38c2c9af0694e2107d`，下面是对 levels 的举例说明：

```shell
levels=1:2   # 表示最终的存储路径为 path/d/07
levels=2:1:2 # 表示最终的存储路径为 path/7d/0/21
levels=2:2:2 # 表示最终的存储路径为 path/7d/10/e2
```

- keys_zone：用来为这个缓存区设置引用名称和大小。
- inactive：指定缓存的数据多次时间未被访问就将被删除，如 inactive=1d 表示缓存数据 1 天内没有被访问就会被删除。
- max_size：设置最大缓存空间，如果缓存空间存满，默认会覆盖缓存时间最长的资源。

2. **proxy_cache**

`proxy_cache` 指令来使用缓存，可以在 http、server 和 location 的 context 中使用，下面是一个在 location 的 context 中使用 `proxy_cache` 指令的例子。

```nginx
http {
    proxy_cache_path /var/lib/nginx/cache keys_zone=mycache:10m;
    server {
        location / {
            proxy_cache mycache;
            proxy_pass http://localhost:8000;
        }
    }
}
```

在上面的代码中，我们使用 `proxy_cache_path` 指令来定义了一个名为 mycache 大小为 10m 的缓存，缓存的本地目录是 `/var/lib/nginx/cache` ，如果这个路径不存在，则需要创建这个目录，并赋予正确的权限：

```shell
mkdir -p /var/lib/nginx/cache
chmod 700 /var/lib/nginx/cache
```

3. **proxy_cache_min_uses**

缓存不应该设置的太敏感，可以使用 `proxy_cache_min_uses` 设置相同的 key 的请求，访问次数超过指定数量才会被缓存，其可以在 http、server 和 location 的 context 中使用。

```nginx
proxy_cache_min_uses 5;
```

4. **proxy_cache_valid**

默认情况下，响应会无限期的保留在缓存中，仅当缓存超过最大配置大小时，按照时间删除最旧的数据。除此之外，我们还可以使用 `proxy_cache_valid` 指令配置缓存的存活时长，该指令可以配置在 http、server 和 location 的 context 中。

```nginx
http {
    proxy_cache_path /var/lib/nginx/cache keys_zone=mycache:10m;
    server {
        location / {
            proxy_cache mycache;
            proxy_cache_valid 200 302 10m; # 成功的请求缓存保留10分钟
        	proxy_cache_valid 404      1m; # 404的请求缓存保存1分钟
        	proxy_cache_valid any 5m;	   # 其他请求缓存保存5分钟 
            
            proxy_pass http://localhost:8000;
        }
    }
}
```

**配置案例：**

配置 ruoyi-admin.jar 的反向代理，缓存请求的静态文件。

1. 在 `/etc/nginx/conf.d/` 目录下新建 8003-ruoyi-cache.conf 配置文件，写入内容如下：

```nginx
proxy_cache_path /var/cache/nginx/data keys_zone=static:100m;

server {

    listen 8003;

    location / {
        proxy_pass http://localhost:8088;
    }

    location ~ \.(js|css|png|jpg|gif|ico) {
        proxy_cache static;
        proxy_cache_valid 200 302 10m;
        proxy_cache_valid 404      1m;
        proxy_cache_valid any 5m;
        proxy_cache_min_uses 1;
        proxy_pass http://localhost:8088;
    }

    location = /html/ie.html {
        proxy_cache static;
        proxy_cache_valid 200 302 10m;
        proxy_cache_valid 404      1m;
        proxy_cache_valid any 5m;
        proxy_cache_min_uses 1;
        proxy_pass http://localhost:8088;
    }
  
    location ^~ /fonts/ {
        proxy_cache static;
        proxy_cache_valid 200 302 10m;
        proxy_cache_valid 404      1m;
        proxy_cache_valid any 5m;
        proxy_cache_min_uses 1;
        proxy_pass http://localhost:8088;
    }
}
```

2. 接着，启动 ruoyi-admin.jar 并使用命令 `nginx -s reload` 重新加载 nginx 配置文件。
3. 项目启动完成，访问项目路径后，可在 `/var/cache/nginx/data` 目录下查看是否生成了缓存文件。

### 7.5 负载均衡

如果请求数过大，单个服务器解决不了，我们增加服务器的数量，然后将请求分发到各个服务器上，将原先请求集中到单个服务器的情况改为请求分发到多个服务器上，就是负载均衡。

upstream 指定后端服务器地址列表，在 server 中拦截响应请求，并将请求转发到 upstream 中配置的服务器列表。

```nginx
upstream nacos-server {
    server localhost:8080;
	server localhost:8088;
}

server { 
    server_name  ruoyi.apps;
    listen 		 8004;
    location /nacos {
        proxy_pass http://nacos-server;
  }
}
```

不做任何配置的情况下，nginx 会采用轮询的方式分发请求，除此之外，还可以配置如下几种负载均衡策略：

#### 7.5.1 最小连接（least-conn）

将下一个请求分配给活动连接数最少的服务器（较为空闲的服务器）。

```nginx
upstream backend {
    least_conn;
    server backend1.example.com;
    server backend2.example.com;
}
```

需要注意的是，无论是使用轮询机制还是最小连接机制，相同客户端的请求都有可能分发到不同的服务器，不能保证同一个客户端始终定向到同一台服务器。

#### 7.5.2 ip-hash

客户端的 IP 地址将用作哈希键，来自同一个 IP 的请求会被转发到相同的服务器。

```nginx
upstream backend {
    ip_hash;
    server backend1.example.com;
    server backend2.example.com;
}
```

#### 7.5.3 hash

通用 hash，允许用户自定义 has h的 key，key 可以是字符串、变量或组合，如：

```nginx
upstream backend {
    hash $request_uri consistent;
    server backend1.example.com;
    server backend2.example.com;
}
```

基于 IP 的哈希算法存在一个问题，那就是当有一个上游服务器宕机或者扩容的时候，会引发大量的路由变更，进而引发连锁反应，导致大量缓存失效等问题。

为了解决这个问题，可以配置 `consistent` 参数，`consistent` 参数启用 ketama 一致哈希算法，如果在上游添加或删除服务器，只会重新映射部分键，从而最大限度地减少缓存失效。‎

#### 7.5.4 随机（random） 

每个请求都将传递到随机选择的服务器。

two 是可选参数，nginx 在考虑服务器权重的情况下随机选择两台服务器，然后使用指定的方法选择其中一台，默认为选择连接数最少（least_conn‎）的服务器。

```nginx
upstream backend {
    random two least_conn;
    server backend1.example.com;
    server backend2.example.com;
    server backend3.example.com;
    server backend4.example.com;
}
```

#### 7.5.5 权重（weight）

根据服务器的权重来分发请求。

```nginx
upstream my-server {
  
    server performance.server weight=3;
    server app1.server;
    server app2.server;

}
```

#### 7.5.6 健康检查

在反向代理中，如果后端服务器在某个周期内响应失败次数超过规定值，nginx会将此服务器标记为失败，并在之后的一个周期不再将请求发送给这台服务器。

通过 `fail_timeout`‎ 参数来设置检查周期，默认为 10 秒。

通过 `max_fails` 参数来设置检查失败次数，默认为 1 次。

```nginx
upstream backend {
  server backend1.example.com;
  server backend2.example.com max_fails=3 fail_timeout=30s; 
} 
```
