---
title: Docker
date: 2023-02-27 20:30:44
permalink: /pages/f8ef21/
categories:
  - 工具
  - Docker
tags:
  - 
author: 
  name: MYH
  link: https://github.com/mengyahui
---

##  一、Docker 介绍

Docker 是一个开源的容器引擎，是虚拟化的一种轻量级替代技术。Docker 可以让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的 Linux 机器上。Docker 容器的运行几乎没有性能开销，可以很容易的在机器和数据中心上运行，并且不依赖与任何语言、框架和系统。

### 1.1 Docker 核心概念

#### 1.1.1 Image(镜像)

Linux 文件系统由 bootfs 和 rootfs 组成，bootfs 会在 kernel 加载到内存后 umount 掉，所以我们进入系统看到的都是 rootfs，如 /etc、/bin 等标准目录。我们可以把 Docker 镜像当成一个 rootfs。

Docker 镜像是一个特殊的文件系统，其特殊性主要体现在如下两个方面：

1. Docker 镜像除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。
2. 镜像不包含任何动态数据，其内容在构建之后也不会被改变。

Docker 充分利用了 `UnionFS` 技术，将镜像设计成分层存储，使得镜像的复用、定制变的更为容易。甚至可以用之前构建好的镜像作为基础层，然后进一步添加新的层，以定制自己所需的内容，构建新的镜像。

#### 1.1.2 Container(容器)

镜像（Image）和容器（Container）的关系，就像是面向对象程序设计中的**类**和**实例**一样，镜像是静态的定义，容器是镜像运行时的实体。

镜像是分层存储的，容器也是如此。**每一个容器运行时，是以镜像为基础层，在其上创建一个当前容器的存储层**，我们可以称这个为容器运行时读写而准备的存储层为**容器存储层**。

容器存储层的生存周期和容器一样，容器消亡时，容器存储层也随之消亡，任何保存于容器存储层的信息都会随容器删除而丢失。不应该向容器存储层内写入任何数据，所有的文件写入操作都应该使用数据卷（volume），数据卷的生存周期独立于容器，容器消亡，数据卷不会消亡。因此，使用数据卷后，容器可以随意删除、重新运行，数据却不会丢失。

#### 1.1.3 Registry(仓库)

镜像构建完成后，可以很容易的在当前宿主上运行，但是如何在其他服务器上运行这个镜像，那么我们就需要一个集中存放镜像文件的场所，这个存放 Docker 镜像的场所就叫做 Registry。

Docker 仓库的概念跟 GitHub 类似，用于集中存放镜像文件。使用 `registry:tag` 来表示一个 Docker 镜像，`registry` 表示镜像的仓库名称，`tag` 表示镜像的版本，一个仓库会包含同一个软件不同版本的镜像，如果在拉取镜像时不指定 `tag` ，则会以 `latest` 作为默认版本标签。

Repository 分为两种：共有仓库、私有仓库，Docker 官方提供的 [docker hub](https://hub-stage.docker.com/) 就是一个共有仓库，开放给用户使用。除此之外，Docker 官方还提供了 `Registry` 镜像，可以直接作为私有仓库使用。

### 1.2 Docker 运行流程图

![image-20230624201549531](https://cdn.jsdelivr.net/gh/mengyahui/image-repository@master/docker/image-20230624201549531.6c94sl0y6co0.png)

如果把 Docker 的运行流程和程序的发布与运行流程做类比，可以得出如下结论：

1. Image => 可执行程序
2. Container => 可执行程序运行起来的进程
3. Registry => 代码托管平台
4. Dockerfile => 源代码
5. Docker => 编译器

### 1.3 为什么要使用 Docker？

为啥要用 Docker？这要从目前软件行业的痛点来讲起

1. 开发、生产、测试环境不一致，开发环境下可用的服务挪到生产上不可用。
2. 不同环境之间迁移成本太高，没有统一的软件部署封装标准及封装环境。
3. 对于分布式软件持续集成（测试、打包、发布、部署、管理）周期很长，难以自动化、工程化。

对于开发和运维人员来说，最希望的效果就是一次创建或者配置后，可以在任意地方、任意时间让应用正常运行，Docker 的环境隔离就可以很方便的用于不同环境的配置。但 Docker 的优势不仅仅只有环境隔离这一点，通常体现在如下几个方面：

- **快速交付和部署**：使用 Docker，开发人员可以使用镜像快速构建一套标准的开发环境；开发完成后，测试和运维人员可以使用完全相同的环境部署代码，只要是开发测试过的代码就可以确保在生产环境无缝运行。
- **高效的资源利用**：运行 Docker 容器不需要额外的虚拟化管理程序的支持，Docker 是内核级的虚拟化，可以实现更高的性能，同时对资源的额外需求很低。
- **轻松的迁移和扩展**：Docker 容器几乎可以在任意的平台上运行，包括物理机、虚拟机、公有云、私有云、服务器等，同时支持主流的操作系统发行版本，这种兼容性让用户可以在不同平台间轻松的迁移应用。
- **简单的更新管理**：使用 Dockerfile 生成镜像的方式，只需要小小的配置修改，就可以替代以往大量的更新工作，所有的修改都以增量的方式进行分发和更新，从而实现自动化且高效的容器管理。

### 1.4 Docker 和虚拟机的区别

Docker 是一种虚拟化容器技术，和虚拟机最根本的区别是：**Docker 容器和宿主机共用 Linux 操作系统内核，不会在宿主机上再次安装操作系统**。**Docker 容器运行状态下的本质是宿主机上的进程**，通过 namespace 资源隔离，cgroups 资源限制，使它看上去像是一个独立的虚拟机。

![image-20230621185456037](https://cdn.jsdelivr.net/gh/mengyahui/image-repository@master/docker/image-20230621185456037.zbrzwhfvmog.png)

虚拟机是在物理资源层面实现的隔离，Hypervisor 模拟了一个操作系统的所有硬件资源，而 Docker 守护进程可以直接与主操作系统进行通信，直接复用主操作系统的硬件资源。

虚拟机启动需要数分钟，而 Docker 容器可以在数毫秒内启动。由于没有臃肿的从操作系统，Docker 可以节省大量的磁盘空间以及其他系统资源。

## 二、安装 Docker

Docker 分为 Docker CE（社区版）和 Docker EE（企业版），其中企业版的安全性很高，但需要付费使用，Docker 官网上有各种环境下的[安装指南](https://docs.docker.com/engine/install/centos/)，这里主要介绍 Docker CE 在 CentOS 上的安装。Docker CE 支持 64 位版本 CentOS 7，并且要求内核版本不低于 3.10，使用 uname -r 命令可以查看操作系统的内核版本。

### 2.1 卸载旧版本 Docker

如果之前安装过旧版本的Docker，可以使用下面命令卸载：

```shell
yum remove docker \
		    docker-client \
		    docker-client-latest \
		    docker-common \
			docker-latest \
			docker-latest-logrotate \
			docker-logrotate \
			docker-selinux \
			docker-engine-selinux \
			docker-engine \
			docker-ce
```

这里的  \  表示命令仍未结束。

### 2.2 安装 yum 工具包

下面是安装 yum 工具包的命令，主要是利用其 yum-config-manager 设置 Docker 的安装源。

```shell
yum install -y yum-utils
```

从 Docker 官网安装 Docker 较慢，可以使用阿里云镜像地址：

```shell
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

设置完 Docker 的 yum 仓库后，可以使用如下命令，来设置软件包的本地索引缓存，来提高 Docker 的安装速度。

```shell
yum makecache fast
```

### 2.3 安装 Docker

Docker CE 的安装命令如下：

```shell
yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

以上命令安装了 Docker Engine、containerd 和 Docker Compose。

### 2.4 系统相关命令

Docker 容器需要用到各种端口，在生产环境下需要逐一修改防火墙设置，在学习阶段建议直接使用如下命令关闭防火墙。

```shell
# 关闭
systemctl stop firewalld
# 禁止开机启动防火墙
systemctl disable firewalld
```

Docker 启动与关闭相关的系统命令如下：

```shell
systemctl start docker  	# 启动docker服务
systemctl stop docker  		# 停止docker服务
systemctl restart docker  	# 重启docker服务
systemctl enable docker		# 设置docker开机自启
docker version				# 查看docker版本
```

### 3.5 配置阿里云镜像加速

从 Docker Hub 上拉取镜像较慢，可以使用阿里云提供的镜像加速服务，具体的操作步骤可以参考：

https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors



## 三、操作镜像

**镜像的名称**一般由两部分组成：**repository:tag**，在没有指定 tag 时，默认为 latest，代表最新版本的镜像。

### 3.1 查看本地镜像

**语法：**

```shell
Usage:  docker images [OPTIONS] [REPOSITORY[:TAG]]

List images

Aliases:
  docker image ls, docker image list, docker images

Options:
  -a, --all             列出本地所有镜像，包含中间层镜像。默认情况下不包含中间层镜像。
      --digests         显示镜像的摘要信息
  -f, --filter filter   根据指定条件过滤输出
      --format string   使用指定模板文件来显示搜索结果，如 json、table，默认是 table
      --no-trunc        不要截断输出
  -q, --quiet           只显示镜像ID

```

**示例：**

```shell
[root@localhost ~] # docker images
REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
ubuntu       latest    ba6acccedd29   20 months ago   72.8MB
```

下表是 `docker images` 命令输出表头的相关说明：

| 表头       | 说明         |
| ---------- | ------------ |
| REPOSITORY | 镜像所在仓库 |
| TAG        | 镜像版本标签 |
| IMAGE ID   | 镜像ID       |
| CREATED    | 镜像创建时间 |
| SIZE       | 镜像大小     |

### 3.2 从镜像仓库查找镜像

**语法：**

```shell
Usage:  docker search [OPTIONS] TERM

Search Docker Hub for images 

Options:
  -f, --filter filter   根据指定条件过滤输出
      --format string   使用指定模板文件来显示搜索结果
      --limit int       指定最大搜索结果数
      --no-trunc        不要截断输出
```

**示例：**

```shell
[root@localhost ~]# docker search redis --limit 3
NAME                     DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
redis                    Redis is an open source key-value store that…   12165     [OK]       
redislabs/redisearch     Redis With the RedisSearch module pre-loaded…   56                   
redislabs/redisinsight   RedisInsight - The GUI for Redis                88 
```

下面是 `docker search` 命令输出表头的相关说明：

| 表头        | 说明                                      |
| ----------- | ----------------------------------------- |
| NAME        | 镜像名称                                  |
| DESCRIPTION | 镜像说明                                  |
| STARS       | 镜像点赞数                                |
| OFFICIAL    | 镜像是否来自官方，[ok] 表示该镜像来自官方 |
| AUTOMATED   | 是否是自动构建的                          |

### 3.3 从镜像仓库拉取镜像

**语法：**

```shell
Usage:  docker pull [OPTIONS] NAME[:TAG|@DIGEST]

Download an image from a registry

Aliases:
  docker image pull, docker pull

Options:
  -a, --all-tags                下载仓库中所有存在版本tag的镜像
      --disable-content-trust   跳过镜像验证，默认跳过
      --platform string         如果服务器支持多平台，则设置平台
  -q, --quiet                   精简输出
```

**示例：**

```shell
[root@localhost ~]# docker pull nginx
Using default tag: latest
latest: Pulling from library/nginx
a2abf6c4d29d: Already exists 
a9edb18cadd1: Pull complete 
589b7251471a: Pull complete 
186b1aaa4aa6: Pull complete 
b4df32aa5a72: Pull complete 
a0bcbecc962e: Pull complete 
Digest: sha256:0d17b565c37bcbd895e9d92315a05c1c3c9a29f762b011a10c54a66cd53c9b31
Status: Downloaded newer image for nginx:latest
docker.io/library/nginx:latest
```

从上面镜像的拉取过程也可以印证前面提出的镜像分层存储的概念，镜像的下载也是一层层的，并非单一文件。在拉取镜像的过程中，如果遇到了已经存在的镜像层级会使用 `Already exists` 来标识，进而实现镜像的复用。

### 3.4 查看所占空间

**语法：**

```shell
Usage:  docker system df [OPTIONS]

Show docker disk usage

Options:
      --format string   使用指定模板文件来显示搜索结果
  -v, --verbose         显示使用空间的详细信息

```

**示例：**

```shell
[root@localhost ~]# docker system df
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          1         0         141.5MB   141.5MB (100%)
Containers      0         0         0B        0B
Local Volumes   0         0         0B        0B
Build Cache     0         0         0B        0B
```

### 3.5 删除镜像

**语法：**

```shell
Usage:  docker rmi [OPTIONS] IMAGE [IMAGE...]

Remove one or more images

Aliases:
  docker image rm, docker image remove, docker rmi

Options:
  -f, --force      强制删除
      --no-prune   不删除未被标记的父镜像
```

**示例：**

```shell
[root@localhost ~]# docker rmi -f nginx
Untagged: nginx:latest
Untagged: nginx@sha256:0d17b565c37bcbd895e9d92315a05c1c3c9a29f762b011a10c54a66cd53c9b31
Deleted: sha256:605c77e624ddb75e6110f997c58876baa13f8754486b461117934b24a9dc3a85
Deleted: sha256:b625d8e29573fa369e799ca7c5df8b7a902126d2b7cbeb390af59e4b9e1210c5
Deleted: sha256:7850d382fb05e393e211067c5ca0aada2111fcbe550a90fed04d1c634bd31a14
Deleted: sha256:02b80ac2055edd757a996c3d554e6a8906fd3521e14d1227440afd5163a5f1c4
Deleted: sha256:b92aa5824592ecb46e6d169f8e694a99150ccef01a2aabea7b9c02356cdabe7c
Deleted: sha256:780238f18c540007376dd5e904f583896a69fe620876cabc06977a3af4ba4fb5
```

### 3.6 归档镜像

**语法：**

```shell
Usage:  docker save [OPTIONS] IMAGE [IMAGE...]

Save one or more images to a tar archive (streamed to STDOUT by default)

Aliases:
  docker image save, docker save

Options:
  -o, --output string   指定归档的文件路径
```

**示例：**

```shell
[root@localhost ~]# docker save -o redis.tar redis
[root@localhost ~]# ls
anaconda-ks.cfg  redis.tar
```

### 3.7 加载归档镜像

**语法：**

```shell
Usage:  docker load [OPTIONS]

Load an image from a tar archive or STDIN

Aliases:
  docker image load, docker load

Options:
  -i, --input string   指定读取的归档文件，默认从 STDIN 中读取
  -q, --quiet          精简输出
```

**示例：**

```shell
[root@localhost ~]# docker load -i redis.tar 
2edcec3590a4: Loading layer [==================================================>]  83.86MB/83.86MB
9b24afeb7c2f: Loading layer [==================================================>]  338.4kB/338.4kB
4b8e2801e0f9: Loading layer [==================================================>]  4.274MB/4.274MB
529cdb636f61: Loading layer [==================================================>]   27.8MB/27.8MB
9975392591f2: Loading layer [==================================================>]  2.048kB/2.048kB
8e5669d83291: Loading layer [==================================================>]  3.584kB/3.584kB
Loaded image: redis:latest
```

## 四、操作容器

### 4.1 查看容器

**语法：**

```shell
Usage:  docker ps [OPTIONS]

List containers

Aliases:
  docker container ls, docker container list, docker container ps, docker ps

Options:
  -a, --all             列出所有容器，默认只列出正在运行的容器
  -f, --filter filter   根据条件过滤输出结果
      --format string   使用指定模板来显示结果
  -n, --last int        显示 n 个包含所有状态的容器
  -l, --latest          显示最新创建的所有状态的容器
      --no-trunc        精简输出
  -q, --quiet           仅仅输出容器ID
  -s, --size            显示总文件大小
```

**示例：**

```shell
[root@localhost ~]# docker ps -a
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

### 4.2 创建容器

**语法：**

```shell
Usage:  docker create [OPTIONS] IMAGE [COMMAND] [ARG...]

Create a new container

Aliases:
  docker container create, docker create

Options:
	-e, --env list                       设置环境变量
		--env-file list                  读取环境变量的文件
	-i, --interactive                    打开标准输入
	-t, --tty                            给容器分配一个伪终端
	-p, --publish list                   设置指定的端口映射
  	-P, --publish-all                    设置随机的端口映射

```

**示例：**

```shell
[root@localhost ~]# docker create redis -p 6379:6379
acc38f433e9067da5006117ca3012f52669c2f661769e64f975151a4b974f176
```

### 4.3 创建并启动容器

**语法：**

```shell
Usage:  docker run [OPTIONS] IMAGE [COMMAND] [ARG...]

Create and run a new container from an image

Aliases:
  docker container run, docker run
  
Options:
	-d, --detach                         以守护（后台）模式运行容器。
	-i, --interactive                    保持容器运行。通常与 -t 同时使用。
	-t, --tty                            为容器重新分配一个伪终端，通常与 -i 同时使用。
		--name string                    给创建的容器分配一个名字
	-e, --env list             		     设置环境变量
```

**示例：**

```shell
[root@localhost ~]# docker run -it --name ubuntu001 ubuntu /bin/bash
root@53678170acd8:/# 
```

在使用 -it 选项创建并进入容器后，有两种方式退出容器，一种是在终端输入 exit 命令，这种在退出容器时会停止容器；另一种是使用快捷键 ctrl + p + q，这种在退出容器时不会停止容器。

### 4.4 进入容器

**语法：**

```shell
Usage:  docker exec [OPTIONS] CONTAINER COMMAND [ARG...]

Execute a command in a running container

Aliases:
  docker container exec, docker exec

Options:
  -d, --detach               以后台模式运行命令
  -e, --env list             设置环境变量
      --env-file list        读入环境变量文件
  -i, --interactive          保持容器运行。通常与 -t 同时使用
      --privileged           为容器提供拓展的Linux功能
  -t, --tty                  为容器重新分配一个伪终端，通常与 -i 同时使用
  -u, --user string          指定访问容器的用户名或用户ID
  -w, --workdir string       指定要进入的工作目录

```

**示例：**

```shell
[root@localhost ~]# docker exec -it ubuntu001 /bin/bash
root@02e7f8b802b8:/# 
```

### 4.5 启动停止运行的容器

**语法：**

```shell
Usage:  docker start [OPTIONS] CONTAINER [CONTAINER...]

Start one or more stopped containers

Aliases:
  docker container start, docker start

Options:
  -a, --attach               Attach STDOUT/STDERR and forward signals
      --detach-keys string   Override the key sequence for detaching a container
  -i, --interactive          以交互模式启动容器

```

**示例：**

```shell
[root@localhost ~]# docker start 53678170acd8
53678170acd8
```

### 4.6 重启容器

**语法：**

```shell
Usage:  docker restart [OPTIONS] CONTAINER [CONTAINER...]

Restart one or more containers

Aliases:
  docker container restart, docker restart

Options:
  -s, --signal string   Signal to send to the container
  -t, --time int        在停止容器前等待的时间，单位秒
```

**示例：**

```shell
[root@localhost ~]# docker restart 53678170acd8
53678170acd8
```

### 4.7 停止容器

**语法：**

```shell
Usage:  docker stop [OPTIONS] CONTAINER [CONTAINER...]

Stop one or more running containers

Aliases:
  docker container stop, docker stop

Options:
  -s, --signal string   Signal to send to the container
  -t, --time int        在停止容器前等待的时间，单位秒
```

**示例：**

```shell
[root@localhost ~]# docker stop ubuntu001
ubuntu001
```

### 4.8 删除容器

**语法：**

```shell
Usage:  docker rm [OPTIONS] CONTAINER [CONTAINER...]

Remove one or more containers

Aliases:
  docker container rm, docker container remove, docker rm

Options:
  -f, --force     强制删除正在运行中的容器
  -l, --link      删除容器之间的网络连接，而非容器本身
  -v, --volumes   删除与容器关联的数据卷
```

**示例：**

```shell
[root@localhost ~]# docker rm -f ubuntu001
ubuntu001
```

### 4.9 导出容器

**语法：**

```shell
Usage:  docker export [OPTIONS] CONTAINER

Export a container's filesystem as a tar archive

Aliases:
  docker container export, docker export

Options:
  -o, --output string   指定写入的文件，默认以流的方式输出到 STDOUT
```

**示例：**

```shell
[root@localhost ~]# docker export -o ubuntu001.tar ubuntu001
[root@localhost ~]# ls
ubuntu001.tar
```

### 4.10 导入容器

**语法：**

```shell
Usage:  docker import [OPTIONS] file|URL|- [REPOSITORY[:TAG]]

Import the contents from a tarball to create a filesystem image

Aliases:
  docker image import, docker import

Options:
  -c, --change list       将Dockerfile指令应用于创建的映像
  -m, --message string    为导入的镜像提交消息
      --platform string   如果服务器支持多平台，则设置平台
```

**示例：**

```shell
[root@localhost ~]# docker import ubuntu001.tar 
sha256:2db5d6e83cc75781f7ed41749a538013abe19a3f0c18b479ae1981224c0f94cf
[root@localhost ~]# docker images
REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
<none>       <none>    2db5d6e83cc7   4 seconds ago   72.8MB
redis        latest    7614ae9453d1   18 months ago   113MB
```

像上面那样，若不指定构建容器镜像的 repository 和 tag，则导入的镜像是一个虚悬镜像，即 REPOSITORY 和 TAG 都为 `<none>`。

### 4.11 查看容器日志

**语法：**

```shell
Usage:  docker logs [OPTIONS] CONTAINER

Fetch the logs of a container

Aliases:
  docker container logs, docker logs

Options:
      --details        显示日志详情
  -f, --follow         日志跟随容器输出
      --since string   显示指定时间之后的日志
  -n, --tail string    从尾部开始显示n行日志
  -t, --timestamps     显示时间戳
      --until string   显示指定时间之前的日志
```

**示例：**

```shell
[root@localhost ~]# docker logs redis001
1:C 23 Jun 2023 03:38:19.587 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
1:C 23 Jun 2023 03:38:19.587 # Redis version=6.2.6, bits=64, commit=00000000, modified=0, pid=1, just started
1:C 23 Jun 2023 03:38:19.587 # Warning: no config file specified, using the default config. In order to specify a config file use redis-server /path/to/redis.conf
1:M 23 Jun 2023 03:38:19.588 * monotonic clock: POSIX clock_gettime
1:M 23 Jun 2023 03:38:19.590 * Running mode=standalone, port=6379.
1:M 23 Jun 2023 03:38:19.591 # WARNING: The TCP backlog setting of 511 cannot be enforced because /proc/sys/net/core/somaxconn is set to the lower value of 128.
1:M 23 Jun 2023 03:38:19.591 # Server initialized
1:M 23 Jun 2023 03:38:19.591 # WARNING overcommit_memory is set to 0! Background save may fail under low memory condition. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
1:M 23 Jun 2023 03:38:19.591 * Ready to accept connections
```



## 五、管理数据卷

容器中的文件内容是可以被修改的，但是**一旦容器重启，所有写入到容器中的，针对数据文件、配置文件的修改都将丢失**。所以为了保存容器的运行状态，执行结果，我们需要将容器内的一些重要的数据文件、日志文件、配置文件使用数据卷映射到宿主机上。

### 5.1 创建数据卷

对于数据卷的创建与挂载有两种方式，第一种是先创建，再挂载；第二种是挂载时创建；

- 先创建，再挂载

```shell
# 创建一个指定名字的数据卷
docker volume create html
# 挂载数据卷，例如挂载 nginx 的静态文件目录
docker run --name nginx -p 80:80 -v html:/usr/share/nginx/html -d nginx:latest
```

- 挂载时创建

```shell
# 仍然以 nginx 为例
docker run --name nginx -p 80:80 -v /docker/nginx/html:/usr/share/nginx/html -d nginx:latest 
```

使用 `docker volume create` 命令创建的数据卷默认会放到宿主机的 `/var/lib/docker/volumes` 目录下；使用 -v 选项挂载的数据卷目录，若宿主机不存在，则在挂载时会自动创建。

### 5.2 查看数据卷详细

在使用 `docker volume create` 命令创建一个数据卷后，可以查看该数据卷的详细信息，具体用法如下：

**语法：**

```shell
Usage:  docker volume inspect [OPTIONS] VOLUME [VOLUME...]

Display detailed information on one or more volumes

Options:
  -f, --format string   按照指定模板格式输出
```

**示例：**

```shell
[root@localhost ~]# docker volume inspect html
[
    {
        "CreatedAt": "2023-06-23T11:48:46+08:00",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/html/_data",
        "Name": "html",
        "Options": null,
        "Scope": "local"
    }
]

```

### 5.3 查看所有数据卷

**语法：**

```shell
Usage:  docker volume ls [OPTIONS]

List volumes

Aliases:
  docker volume ls, docker volume list

Options:
  -f, --filter filter   过滤结果 (e.g. "dangling=true")
      --format string   按照指定模板格式输出
  -q, --quiet           仅仅输出数据卷名字
```

**示例：**

```shell
[root@localhost ~]# docker volume ls
DRIVER    VOLUME NAME
local     7ee96f7cefbd018dd1bb2a9671a1fd280a6434969d1c9cff58fd015bebdf5cea
local     960fc3f104aa2aa05189191629d2b2b9b3f4090acb1a289502e7edfb1a67f215
local     a1231945d3ee6edb407718d22009802c4e722fd4ebcde3fb7d7facda462541ad
local     b7c94fa4e1b508f5a2ac132281e89a8e89da30c0aa812cf731f9ddcd38b8d37d
local     html
```

### 5.4 删除匿名数据卷

**语法：**

```shell
Usage:  docker volume prune [OPTIONS]

Remove all unused local volumes

Options:
  -a, --all             删除所有未使用的卷，而不仅仅是匿名卷
      --filter filter   过滤值 (e.g. "label=<label>")
  -f, --force           强制删除，不提示确认
```

**示例：**

```shell
[root@localhost ~]# docker volume prune
WARNING! This will remove anonymous local volumes not used by at least one container.
Are you sure you want to continue? [y/N] y
Deleted Volumes:
960fc3f104aa2aa05189191629d2b2b9b3f4090acb1a289502e7edfb1a67f215
b7c94fa4e1b508f5a2ac132281e89a8e89da30c0aa812cf731f9ddcd38b8d37d
7ee96f7cefbd018dd1bb2a9671a1fd280a6434969d1c9cff58fd015bebdf5cea

Total reclaimed space: 0B
```

### 5.5 删除数据卷

**语法：**

```shell
Usage:  docker volume rm [OPTIONS] VOLUME [VOLUME...]

Remove one or more volumes. You cannot remove a volume that is in use by a container.

Aliases:
  docker volume rm, docker volume remove

Options:
  -f, --force   强制删除，不提示
```

**示例：**

```shell
[root@localhost ~]# docker volume rm html
html
```

## 六、Docker 网络

Docker 网络是 Docker 容器间通信的基础支持，它提供了多种网络模式，使得单个容器或多个容器组成的应用程序可以相互通信、互相连接，为 Docker 容器的部署和管理提供了便利。Docker 网络主要有如下两方面的作用：

1. 负责容器间的相互连接和通信，以及端口映射；
2. 当容器 `IP` 地址发生更改时，可以通过服务名称进行网络通信，不会因为 `IP` 的更改导致服务不可用。

### 6.1 网络实现原理

Docker 使用 Linux 桥接，在宿主机虚拟一个 Docker 容器网桥(docker0)，Docker 启动一个容器时会根据 Docker 网桥的网段分配给容器一个 IP 地址，称之为 `Container-IP`，同时 Docker 网桥是每个容器的默认网关。因为在同一宿主机内的容器都接入同一个网桥，这样容器之间就能够通过容器的 `Container-IP` 直接通信。

Docker 网桥是宿主机虚拟出来的，并不是真实存在的网络设备，外部网络是无法寻址到的，这也意味着外部网络无法通过直接 `Container-IP` 访问到容器。如果容器希望外部访问能够访问到，可以通过映射容器端口到宿主主机（端口映射），在访问容器时就可以通过 **[宿主机IP]:[映射端口]** 来寻址。

### 6.2 默认网络

在安装 Docker 时，会自动创建三个网络：bridge、none 和 host，其中的 bridge 是创建容器时默认连接到的网络。使用 `ip addr` 命令查看宿主机的网络信息，会看到三个网络：

1. lo：宿主机内网回环网络；
2. ens32：宿主机内外 IP；
3. docker0：Docker 默认安装的 bridge 网络。

```shell
[root@localhost ~]# ip addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: ens32: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:50:56:25:13:18 brd ff:ff:ff:ff:ff:ff
    inet 192.168.184.134/24 brd 192.168.184.255 scope global noprefixroute dynamic ens32
       valid_lft 1643sec preferred_lft 1643sec
    inet6 fe80::63b4:1b85:f7e9:5f1/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever
3: docker0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default 
    link/ether 02:42:9d:0d:3b:c2 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
    inet6 fe80::42:9dff:fe0d:3bc2/64 scope link 
       valid_lft forever preferred_lft forever
```

### 6.3 网络模式

在使用 `docker run` 命令创建 Docker 容器时，可以使用 `--network` 选项来指定容器的网络模式，包括上面提到的三种 Docker 网络模式，Docker 一共有四种网络模式，具体说明如下表：

| 网络模式  | 容器配置                       | 说明                                                         |
| --------- | ------------------------------ | ------------------------------------------------------------ |
| host      | --network=host                 | 容器和宿主机共享 Network namespace。容器将不会虚拟出自己的网卡，配置自己的 IP 等，<br/>而是使用宿主机的 IP 和端口。 |
| container | --network=container:NAME_or_ID | 容器和另外一个容器共享 Network namespace。创建的容器不会创建自己的网卡，配置自己的 IP，<br/>而是和一个指定的容器共享IP、端口范围 |
| bridge    | --network=bridge               | 此模式会为每一个容器分配、设置IP等，并将容器连接到一个 docker0 虚拟网桥，<br/>通过 docker0 网桥以及 Iptables nat表配置与宿主机通信 |
| none      | --network=none                 | 该模式关闭了容器的网络功能                                   |

### 6.4 容器互联

同一个宿主机上的多个 Docker 容器之间如果想进行通信，有如下四种方式：

1. 通过使用容器的 ip 地址来通信（这样会导致 ip 地址的硬编码，不方便迁移，并且容器重启后ip地址会改变，除非使用固定的 ip）；
2. 通过宿主机的 ip 加上容器暴露出的端口号来通信（这样的通信方式比较单一，只能依靠监听在暴露出的端口的进程来进行有限的通信）；
3. 通过 Docker 的 link 机制可以通过容器名来和另一个容器通信（link 机制只能实现单向通信，且 link 机制在后续的版本中可能会被移除掉）；
4. 自定义网络（既解决了 IP 地址硬编码的问题，也解决了使用容器名只能单向通信的问题）。

下面演示自定义网络的方式来实现容器互联：

**(1) 创建网络**

创建网络的命令是 `docker network create [options] netname` 其常用选项如下：

- --driver 指定网络驱动，bridge（自带dns解析功能）、overlay（用于跨主机网络，集群访问，应用层通信）、macvlan（用于跨主机网络，集群访问，物理层通信）；
- --subnet 指定子网掩码；
- --gateway 指定网关；

下面的例子创建了一个 bridge 驱动模式的网络：

```shell
docker network create --driver bridge my_net
```

**(2) 查看网络**

网络常见完成后，可以使用 `docker network ls` 命令，来查看网络是否创建成功：

```shell
[root@localhost ~]# docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
7226a9852154   bridge    bridge    local
1fde67b94f3a   host      host      local
22924a247e74   my_net    bridge    local
7561a4c79dbe   none      null      local
```

**(3) 查看网络详情**

使用 `docker network inspect` 命令可以查看网络的详情：

```shell
[root@localhost ~]# docker network inspect my_net
[
    {
        "Name": "my_net",
        "Id": "22924a247e7430c49cbabb54efad40d913d08eb3e1daef864d8d3348d36673ff",
        "Created": "2023-06-25T20:57:30.037520605+08:00",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "172.18.0.0/16",
                    "Gateway": "172.18.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {},
        "Options": {},
        "Labels": {}
    }
]
```

**(4) 加入网络**

网络创建后，加入这个网络的容器就可以实现相互通信，如果是已经创建的容器，可以使用 `docker network netname container_name_or_id` 命令来加入网络，若容器还没有创建，使用 `--network` 选项指定网络即可。

下面的命令创建了两个 ubuntu 容器，名字分别为 container-1 和 container-1，都加入了同一个自定义网络 my_net。

```shell
docker run --net my_net --name container-1 -td ubuntu:20.04
docker run --net my_net --name container-2 -td ubuntu:20.04
```

为了测试在相同自定义网络下的容器能否使用容器名进行通信，我们需要使用如下命令进入其中一个容器，使用 ping 命令来测试。

```shell
# 进入 container-1
docker exec -it container-1 /bin/bash
# 测试是否可以和 container-2 进行通信
ping container-2
```

由于 ubuntu 的镜像非常小，并没有包含 ping 命令，可以使用如下命令安装：

```shell
apt-get update
apt-get install iputils-ping
```

下面是测试的结果：

```shell
root@7128878b47e7:/# ping container-2
PING container-2 (172.18.0.3) 56(84) bytes of data.
64 bytes from container-2.my_net (172.18.0.3): icmp_seq=1 ttl=64 time=0.129 ms
64 bytes from container-2.my_net (172.18.0.3): icmp_seq=2 ttl=64 time=0.117 ms
64 bytes from container-2.my_net (172.18.0.3): icmp_seq=3 ttl=64 time=0.204 ms
64 bytes from container-2.my_net (172.18.0.3): icmp_seq=4 ttl=64 time=0.150 ms
64 bytes from container-2.my_net (172.18.0.3): icmp_seq=5 ttl=64 time=0.287 ms
```

## 七、Dockerfile

Dockerfile 是用来构建 Docker 镜像的文本文件，是由一条条构建镜像所需的指令和参数构成的脚本。Dockerfile 其实就是我们用来构建 Docker 镜像的源码，当然这不是所谓的编程源码，而是一些命令的集合，只要理解它的逻辑和语法格式，就可以很容易的编写 Dockerfile。简单点说，Dockerfile 可以让用户个性化定制 Docker 镜像。因为工作环境中的需求各式各样，网络上的镜像很难满足实际的需求。

### 7.1 Dockerfile 文件格式

Dockerfile 分为四部分：**基础镜像信息、标签信息、镜像操作指令、容器启动执行指令**。一开始必须要指明所基于的镜像名称，接下来一般会说明镜像的信息；后面则是镜像操作指令，例如 RUN 指令。每执行一条 RUN 指令，镜像添加新的一层，并提交；最后是 CMD 指令，来指明运行容器时的操作命令。

Docker Hub 提供的 ubuntu 镜像是 mini 版的，不带有 vim 这些基础命令，下面是一个在 ubuntu 镜像基础上添加 vim 指令的 Dockerfile 文件：

```dockerfile
# 1.第一行必须指定基础镜像信息
FROM ubuntu:20.04
# 2.维护者信息
LABEL version="1.0" description="add vim"
# 3.镜像操作指令
ENV MYPATH /usr/local
WORKDIR $MYPATH

RUN apt-get update
RUN apt-get install -y  vim 
# 4.容器启动执行指令
CMD /bin/bash
```

### 7.2 Dockerfile 常用指令

| 指令       | 作用                                                         | 示例                                                 |
| ---------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| FROM       | 指定运行容器的基础镜像是什么                                 | FROM ubuntu:20.04                                    |
| MAINTAINER | 指定镜像的作者信息（已废弃）                                 | MAINTAINER docker_user@邮箱地址                      |
| LABEL      | 指定镜像的标签 ，MAINTAINER 指令的替代方案                   | LABEL version="1.0" description="..."                |
| RUN        | 运行一个命令 可以使用 \ 分割多行命令,语法有两种：<br/>RUN `<command>` `RUN ["executable", "param1", "param2"]` | RUN mkdir -p /usr/local/java                         |
| COPY       | 拷贝文件到容器里，语法有两种：<br/>COPY `<src> <dest>` COPY ["`<src>`","`<dest>`"] | COPY jdk-11.0.6_linux-x64_bin.tar.gz /usr/local/java |
| ADD        | 拷贝文件到容器,若源路径是url，则会自动下载，再进行拷贝，<br/>若源路径是tar.gz的压缩包，则会自动解压缩并删除压缩包,语法和 COPY 一样 | ADD jdk-11.0.6_linux-x64_bin.tar.gz /usr/local/java  |
| WORKDIR    | 指定容器的工作目录,就相当于是执行了一次 cd xx                | WORKDIR /usr/local                                   |
| VOLUME     | 指定容器的挂载点目录,一般还是使用 -v 选项来挂载目录          | VOLUME ["/var/lib/mysql"]                            |
| EXPOSE     | 暴露出镜像的端口，以供外界可以访问                           | EXPOSE [80,8080]、EXPOSE 80/tcp、EXPOSE 80           |
| CMD        | 容器启动的时候指定的命令，<br/>**会**被 docker run 命令行指定的参数所覆盖,且只能有一条 | CMD java -jar ht.jar                                 |
| ENTRYPOINT | 容器启动的时候指定的命令，与 CMD 类似，<br/>**不会**被 docker run 命令行指定的参数所覆盖,且只能有一条 | ENTRYPOINT java -jar ht.jar                          |
| STOPSIGNAL | 用于设置停止信号，来指定容器的停止方式                       | STOPSIGNAL 9                                         |
| ENV        | 构建镜像的时候设置环境变量，语法有两种：<br/>ENV `<key> <value>` ENV `<key>=<value>` | ENV JAVA_HOME /usr/local/java/jdk-11.0.6/            |

### 7.3 构建镜像

Dockerfile 文件编写好以后，真正构建镜像时需要通过 `docker build` 命令，其用法如下：

```shell
Usage:  docker buildx build [OPTIONS] PATH | URL | -

Start a build

Aliases:
  docker buildx build, docker buildx b
  
Options:
      -f, --file string                   指定要使用的 Dockerfile 路径
      -t, --tag stringArray               镜像的名字及标签，可以在一次构建中为一个镜像设置多个标签
```

在前面，我们已经编写好了一个 ubuntu 安装 vim 的 Dockerfile 文件，下面是使用这个文件构建镜像的命令：

```shell
docker build -f /usr/local/Dockerfile -t myubuntu:20.04 .
```

当我们使用 `docker build` 命令来构建镜像时，这个构建过程其实是在 `Docker 引擎` 中完成的，而不是在本机环境。如果在 `Dockerfile` 中使用了一些 `ADD` 等指令来操作文件，如何让 `Docker 引擎` 获取到这些文件呢？

这里就有了一个 `镜像构建上下文` 的概念，当构建的时候，由用户指定构建镜像时的上下文路径，而 `docker build` 会将这个路径下所有的文件都打包上传给 `Docker 引擎`。如果 Dockerfile 和构建镜像需要的文件在同一目录下，则可以使用 `.` 来表示构建镜像的上下文路径，否则需要给出构建镜像需要的文件的完整目录。

### 7.4 健康检查

在 Dockerfile 的常用指令中，`HEALTHCHECK` 指令用于容器启动时的健康检查，语法格式如下：

```dockerfile
# 在容器内部运行命令来检查容器的运行状况
HEALTHCHECK [options] CMD command
options:
	–interval=<间隔>			两次健康检查的间隔，默认为 30 秒
	–timeout=<间隔> 			健康检查命令运行超时时间，如果超过这个时间，本次健康检查就被视为失败，默认 30 秒
	–retries=<间隔> 			当连续失败指定次数后，则将容器状态视为 unhealthy，默认3次
	--start-period=<间隔> 	容器启动的初始化时间，在启动过程中的健康检查失效不会计入，默认 0 秒，需要一定启动时间的服务最好设置；
# 禁用从基础镜像继承的任何健康检查
HEALTHCHECK NONE
```

当一个镜像指定了 `HEALTHCHECK` 后，初启动容器时，初始状态为 `starting`, 当 `HEALTHCHECK` 指令检查成功后，容器状态会变为 `healthy`，如果重试多次失败，则会变为 `unhealthy`。

在前面，我们在编写携带 vim 指令的 ubuntu 的 Dockerfile 时，并未指定健康检查，下面将健康检查加入进入：

```dockerfile
# 1.第一行必须指定基础镜像信息
FROM ubuntu:20.04
# 2.维护者信息
LABEL version="1.0" description="add vim"
# 3.镜像操作指令
ENV MYPATH /usr/local
WORKDIR $MYPATH

RUN apt-get update
RUN apt-get install -y  vim

# 健康检查
HEALTHCHECK --interval=5s --timeout=3s --retries=3 CMD curl -fs http://localhost/ || exit 1

# 4.容器启动执行指令
CMD /bin/bash
```

> 当 Dockerfile 中出现多个 `HEALTHCHECK` 时，只有最后一个生效。

## 八、Docker Compose

Compose 项目是 Docker 官方的开源项目，负责实现对 Docker 容器集群的快速编排。使用 Dockerfile 我们很容易定义一个单独的应用容器。然而在日常开发工作中，经常会碰到需要多个容器相互配合来完成某项任务的情况。例如要实现一个 Web 项目，除了 Web 服务容器本身，往往还需要再加上后端的数据库服务容器；再比如在分布式应用一般包含若干个服务，每个服务一般都会部署多个实例。如果每个服务都要手动启停，那么效率之低、维护量之大可想而知。这时候就需要一个工具能够管理一组相关联的的应用容器，这就是 Docker Compose。

Docker Compose 通过 `docker-compose.yml` 文件来实现对容器集群的编排工作，有如下三个概念：

1. 工程：`docker-compose` 运行目录下的所有文件（docker-compose.yml文件、extends文件或环境变量等）组成一个工程，如无特殊指定，工程名即为当前目录名。
2. 服务：一个工程当中，可以包含多个服务，每个服务中定义了容器运行的镜像、参数、依赖；
3. 容器：一个服务中可以包括多个容器实例，docker-compose 并没有解决负载均衡的问题。因此需要借助其他工具实现服务发现及负载均衡，比如 consul。

Docker Compose 也存在不足的地方，就是它只能用在单一主机上进行容器编排，无法跨节点对容器进行编排。

### 8.1 compose 文件格式

`docker-compose` 使用 `yml` 文件对容器集群进行编排，有 `version`、`services`、`networks` 和 `volumes` 几个顶层配置，除 `version` 外，其他几个顶级配置下还有很多下级配置，下面是 `docker-compose.yml` 配置文件中顶层配置的说明：

1. `version`：描述 `Compose` 文件的版本信息，Compose 和 Docker 的对应版本信息，可以参考 [docker文档](https://docs.docker.com/compose/compose-file/compose-file-v3/)
2. `services`：定义服务，可以定义多个，每个服务中定义了创建容器时所需的镜像、参数、依赖等；
3. `networkds`：定义网络，可以定义多个，根据 `DNS server` 让相同网络中的容器可以直接通过容器名称进行通信；
4. `volumes`：数据卷，用于实现目录挂载。

下面是一个相对完整的 `docker-compose.yml` 文件内容：

```shell
# 描述 Compose 文件的版本信息
version: "3.8"

# 定义服务，可以多个
services:
  nginx: # 服务名称
    image: nginx # 创建容器时所需的镜像
    container_name: mynginx # 容器名称，默认为"工程名称_服务条目名称_序号"
    ports: # 宿主机与容器的端口映射关系
      - "80:80" # 左边宿主机端口:右边容器端口
    networks: # 配置容器连接的网络，引用顶级 networks 下的条目
      - nginx-net

# 定义网络，可以多个。如果不声明，默认会创建一个网络名称为"工程名称_default"的 bridge 网络
networks:
  nginx-net: # 一个具体网络的条目名称
    name: nginx-net # 网络名称，默认为"工程名称_网络条目名称"
    driver: bridge # 网络模式，默认为 bridge
    
# 定义数据卷，可以多个,通常直接在具体的服务中挂载数据卷
volumes:
  nginx-data-volume: # 一个具体数据卷的条目名称
    name: nginx-data-volume # 数据卷名称，默认为"工程名称_数据卷条目名称"
```

### 8.2 compose 常用配置属性

| 字段           | 说明                                                         |
| -------------- | ------------------------------------------------------------ |
| build          | 指定 Dockerfile 文件名                                       |
| dockerfile     | 构建镜像上下文路径                                           |
| images         | 指定已存在的镜像                                             |
| command        | 执行命令，会覆盖容器启动后默认执行的命令（Dockerfile中的CMD指令） |
| container_name | 指定容器名称                                                 |
| deploy         | 指定部署和运行服务相关配置，只能在 swarm 模式使用            |
| environment    | 添加环境变量                                                 |
| networks       | 加入网络，引用顶层 networks 下的条目                         |
| network-mode   | 设置容器的网络模式                                           |
| ports          | 暴露容器端口，与 -p 选项相同，但是端口不能低于 60            |
| depends_on     | 用于解决容器的依赖，启动先后问题。                           |

### 8.3 运行 compose

这里以 [RuoYi](https://gitee.com/y_project/RuoYi/tree/v4.7.4/) 的后台管理系统为例，将源码编译打包成 ruoyi-admin.jar，在打包前需要修改数据库连接信息：

```yaml
# application.yml
server:
  # 服务器的HTTP端口，默认为80
  port: 8088
# application-druid.yml
master:
	url: jdbc:mysql://ruoyi-db:3306/ry?useUnicode=true&characterEncoding=utf8
	username: root
	password: root
```

将编译打包的 ruoyi-admin.jar 放到宿主机的 /home/app 目录下，将数据库执行脚本放到 /home/app/sql 目录下。

下面是部署 RuoYi 后台管理系统的 docker-compose.yml 文件：

```yaml
version: "3.9"

services: 
  ruoyi-app: 
    images: openjdk:8u342-jre
    ports: 
      - 8088:8088
    volumes:
      - /home/app/ruoyi-admin.jar:/usr/local/src/ruoyi-admin.jar
    command: java -jar /usr/local/src/ruoyi-admin.jar
    networks:
      - ruoyi-net
    depends_on:
      - ruoyi-db
      
      
  ruoyi-db: 
  	image: mysql:5.7
  	environment: 
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_DATABASE=ry
    command: [
      "--character-set-server=utf8mb4",
      "--collation-server=utf8mb4_general_ci",
      "--skip-character-set-client-handshake"
    ]
    volumes:
      - /home/app/sql:/docker-entrypoint-initdb.d
      - ruoyi-data:/var/lib/mysql
    networks:
      - ruoyi-net
      
volumes:
  ruoyi-data:

networks:
  ruoyi-net: 
```

我们只需要在 docker-compose.yaml 文件所在目录执行 `docker compose up -d` 命令即可一键启动服务。

### 8.4 健康检查

在上面 RuoYi 项目的 docker-compose.yaml 部署文件中，我们虽然使用 `depends_on` 属性来保证 ruoyi-db 服务在 ruoyi-app 服务之前运行，也就是说 `depends_on` 属性只能保证容器的启动和销毁顺序，并不能保证具有依赖关系的容器是否准备完成。

在 RuoYi 项目部署这个例子中，需要保证服务在数据初始化完成后再启动，我们可以对其 docker-compose.yaml 文件做出如下修改：

```yaml
version: "3.9"

services: 
  ruoyi-app: 
    images: openjdk:8u342-jre
    ports: 
      - 8088:8088
    volumes:
      - /home/app/ruoyi-admin.jar:/usr/local/src/ruoyi-admin.jar
    command: java -jar /usr/local/src/ruoyi-admin.jar
    networks:
      - ruoyi-net
    depends_on:
      ruoyi-db: 
        condition: service_healthy # 表示只有 ruiyi-db 中容器的状态为健康状态，ruoyi-app 中的容器才启动
        # service_started：容器已启动
        # service_healthy：容器处于健康状态
        # service_completed_successfully：容器执行完成且成功退出
      
      
  ruoyi-db: 
  	image: mysql:5.7
  	environment: 
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_DATABASE=ry
    command: [
      "--character-set-server=utf8mb4",
      "--collation-server=utf8mb4_general_ci",
      "--skip-character-set-client-handshake"
    ]
    # ruoyi-db 中的容器开启健康检查
    healthcheck: 
      test: ["CMD", "mysqladmin" ,"ping", "-h", "localhost", "-uroot", "-proot"]
      interval: 5s
      timeout: 5s
      retries: 5
    volumes:
      - /home/app/sql:/docker-entrypoint-initdb.d
      - ruoyi-data:/var/lib/mysql
    networks:
      - ruoyi-net
      
volumes:
  ruoyi-data:

networks:
  ruoyi-net: 
```

### 8.5 compose 常用命令

Compose 的所有命令都以 `docker compose` 开头，下面不在重复。若命令后面有具体的服务名，则该命令只对 Compose 文件中相应的服务生效。

| 命令    | 选项                                                         | 说明                                                         |
| :------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| up      | -d：在后台运行服务容器<br/>--no-build：不自动构建缺失的服务镜像<br/>--scale：拓展服务数量 | 该命令十分强大，它将尝试自动完成包括构建镜像，创建服务，启动服务，<br/>和关联服务相关容器等一系列操作 |
| down    |                                                              | 停止 up 命令所启动的容器，并移除网络                         |
| pull    | --ignore-pull-failures：忽略拉取镜像过程中的错误             | 拉取服务依赖的镜像                                           |
| build   | --force-rm：删除构建过程中的临时容器。 <br/>--no-cache：构建镜像过程中不使用 cache <br/>--pull：始终尝试通过 pull 来获取更新版本的镜像 | 重新构建项目中的服务容器                                     |
| config  | -q：只验证配置，不打印任何东西                               | 验证 Compose 文件格式是否正确，若正确显示配置，若格式错误显示错误原因 |
| images  | -q：仅仅列出镜像ID                                           | 列出 Compose 文件中包含的镜像                                |
| ps      | -a：列出项目中的所有容器<br/>-q：仅仅列出容器ID              | 列出项目中目前的所有容器                                     |
| restart | --no-deps：不重启服务所依赖的服务                            | 重启项目中的服务，该命令不会重新加载 Compose 文件中的变动    |
| logs    | -f：跟随日志输出                                             | 查看服务中容器的输出，默认不同的服务会使用不同的颜色输出     |
| rm      | -f：强制删除<br/>-v：删除容器所挂载的数据卷                  | 删除所有（停止状态的）服务容器                               |
| run     | -d：后台运行                                                 | 在指定服务商运行一次命令                                     |
| start   |                                                              | 启动服务                                                     |
| stop    |                                                              | 停止已经存在的服务容器                                       |
| pause   |                                                              | 暂停服务                                                     |
| unpause |                                                              | 恢复处于暂停状态的服务                                       |
| port    |                                                              | 打印指定服务容器的某个端口所映射的主机端口                   |
| top     |                                                              | 列出所有服务容器的运行进程                                   |

## 九、常见 Docker 容器的构建

### 4.1 Tomcat

#### 4.1.1 拉取镜像

```shell
docker pull tomcat
```

#### 4.1.2 运行容器

```shell
docker run -d --name tomcat001 -p 8080:8080 tomcat
```

#### 4.1.3 使用说明

若在本机无法访问 tomcat 的容器端口，则是因为新版的 tomcat 将默认部署代码放到了 webapps.dist 目录下，可以通过如下命令访问 tomcat 的默认部署界面。

```shell
# 首先进入容器
docker exec -it 37381248c1a4 /bin/bash
root@37381248c1a4:/usr/local/tomcat#
# 删除 webapps 空目录
rm -rf webapps
# 重命名目录 webapps.dist 为 webapps
mv webapps.dist/ webapps
# 退出tomcat容器
exit
# 重启tomcat容器
docker restart 37381248c1a4
```

### 4.2 MySQL

#### 4.2.1 拉取镜像

从远程镜像仓库拉取版本号为 8.0.11 的 MySQL。

```shell
docker pull mysql:8.0.11
```

#### 4.2.2 运行容器

```shell
docker run \
		--name mysql8 \
		-p 3306:3306 \
		-v /docker/mysql/config:/etc/mysql/conf.d \
		-v /docker/mysql/logs:/logs \
		-v /docker/mysql/data:/var/lib/mysql \
		-e MYSQL_ROOT_PASSWORD=root \
		-d mysql:8.0.11
```

选项说明：

- `-p 3306:3306`：将容器的 3306 端口映射到主机的 3306 端口；

- `--name mysql8`：设置容器实例的名字；
- `-v /docker/mysql/conf:/etc/mysql/conf.d`：将配置文件夹挂载到主机；
- `-v /docker/mysql/logs:/logs`：将日志文件夹挂载到主机，5.7 版本 MySQL 容器的日志文件在 `/var/log/mysql` 目录下。
- `-v /docker/mysql/data:/var/lib/mysql/`：将配置文件夹挂载到主机；
- `-e MYSQL_ROOT_PASSWORD=root`：初始化 root 用户的密码；
- `-d mysql:8.0.11`：后台运行镜像为 mysql:8.0.11 的容器。

#### 4.2.3 连接 MySQL

```shell
docker exec -it mysql8 mysql -uroot -proot
```

#### 4.2.4 设置 MySQL 开机自启

```shell
docker update --restart=always mysql8
```

### 4.3 Redis

#### 4.3.1 拉取镜像

这里使用 6.0.19 版本的 redis

```shell
docker pull redis:6.0.19
```

#### 4.3.2 获取 Redis 配置

Redis 中有两个文件目录涉及到了容器状态。

| 描述           | 容器中的路径          | 宿主机中自定义映射路径        |
| -------------- | --------------------- | ----------------------------- |
| 数据目录       | /data                 | /docker/redis/data            |
| redis 配置文件 | /etc/redis/redis.conf | /docker/redis/conf/redis.conf |

不同版本的 Redis 配置文件有所不同，下面演示如何获取 redis.conf 配置文件。

```shell
# 首先创建redis的数据目录和配置目录
mkdir -p /docker/redis/conf
mkdir -p /docker/redis/data
# 首先进入 /docker/redis/conf 目录，接着下载 redis-6.0.19.tar.gz
wget -P https://download.redis.io/releases/redis-6.0.19.tar.gz
# 解压 redis-6.0.19.tar.gz
tar -zxvf redis-6.0.19.tar.gz
# 移动 redis.conf 配置文件
mv /docker/redis/conf/redis-6.0.19/redis.conf /docker/redis/conf/redis.conf
# 最后将可以将 redis-6.0.19.tar.gz 文件和 redis-6.0.19 目录删除
rm -rf redis-6.0.19 redis-6.0.19.tar.gz
```

#### 4.3.3 运行容器

```shell
docker run \
--name redis-6.0.19 \
-p 6379:6379 \
-v /docker/redis/data:/data \
-v /docker/redis/conf/redis.conf:/etc/redis/redis.conf \
-d redis:6.0.19 redis-server /etc/redis/redis.conf
```

#### 4.3.4 使用 redis-cli

```shell
docker exec -it redis-6.0.19 redis-cli
```

#### 4.3.5 设置 Redis 持久化

在 redis 的挂载文件 /docker/redis/conf/redis.conf 中搜索 `appendonly` 并将其值修改为 `yes`，接着重启 redis

```shell
appendonly yes
docker restart redis-6.0.19
```

#### 4.3.6 设置 Redis 开机自启

```shell
docker update --restart=always redis-6.0.19
```

### 4.4 Nginx

#### 4.4.1 拉取镜像

这里以 1.24.0 版本的 nginx 为例

```shell
docker pull nginx:1.24.0
```

#### 4.4.2 获取 nginx 配置

nginx 中有四个文件目录涉及到了文件状态：

| 描述               | 容器中的路径          | 宿主机中自定义映射路径        |
| ------------------ | --------------------- | ----------------------------- |
| 存储网站网页的目录 | /usr/share/nginx/html | /docker/nginx/html            |
| nginx 配置文件     | /etc/nginx/nginx.conf | /docker/nginx/conf/nginx.conf |
| nginx 配置目录     | /etc/nginx/conf.d     | /docker/nginx/conf/conf.d     |
| 日志目录           | /var/log/nginx        | /docker/nginx/logs            |

在 /etc/nginx/nginx.conf 配置文件中配置者默认加载 /etc/nginx/conf.d 目录中所有配置文件的代码，所以在创建 nginx 容器之前需要先获取 nginx.conf 配置文件，而 /etc/nginx/conf.d 目录下也存在默认的配置文件，下面演示如何获取这些文件：

```shell
# 首先创建 nginx 的配置目录
mkdir -p /docker/nginx/conf
mkdir -p /docker/nginx/conf/conf.d
# 先随便运行一个 nginx 容器
docker run -d -p 80:80 --name nginx-test nginx:1.24.0
# 复制文件
docker cp nginx-test:/etc/nginx/nginx.conf /docker/nginx/conf/nginx.conf
docker cp nginx-test:/etc/nginx/conf.d/default.conf /docker/nginx/conf/conf.d/default.conf
# 最后删除这个容器
docker rm -f nginx-test
```

#### 4.4.3 运行容器

```shell
docker run \
	--name nginx-1.24.0 \
	-p 80:80 \
	-v /docker/nginx/html:/usr/share/nginx/html \
	-v /docker/nginx/conf/nginx.conf:/etc/nginx/nginx.conf \
	-v /docker/nginx/conf/conf.d:/etc/nginx/conf.d \
	-v /docker/nginx/logs:/var/log/nginx \
	-d nginx:1.24.0
```

此时，将静态网站放到 /docker/nginx/html 目录即可完成静态网站的部署，若需要在 /docker/nginx/conf/conf.d 目录中新增配置，则需要重新启动容器并映射相应的端口。

#### 4.4.4 设置 nginx 开机自启

```shell
docker update --restart=always nginx-1.24.0
```

### 4.5 RabbitMQ

#### 4.5.1 拉取镜像

需要选择带 management 的本版（包含web管理界面），这里以 3.7.7-management 版本的 RabbitQM 为例

```shell
docker pull rabbitmq:3.7.7-management
```

#### 4.5.2 运行容器

```shell
docker run \
	--name rabbitmq-3.7.7 \
	--hostname rabbit1 \
	-p 5672:5672 \
	-p 15672:15672 \
	-v /docker/rabbitmq/data:/data \
	-v /docker/rabbitmq/logs:/var/log/rabbitmq \
	-e RABBITMQ_DEFAULT_USER=root \
	-e RABBITMQ_DEFAULT_PASS=root \
	-e RABBITMQ_DEFAULT_VHOST=vhost \
	-d rabbitmq:3.7.7-management
```

选项说明：

- `--hostname rabbit1`：设置RabbitMQ主机名称，在集群模式下会使用

- `-p 5672:5672`：映射程序连接端口
- `-p 15672:15672`：映射web管理界面端口
- `-v /docker/rabbitmq/data:/data`：挂载数据目录
- `-v /docker/rabbitmq/logs:/var/log/rabbitmq`：挂载日志目录
- `-e RABBITMQ_DEFAULT_USER=root`：设置web界面默认登录用户
- `-e RABBITMQ_DEFAULT_PASS=root`：设置web界面默认登录密码
- `-e RABBITMQ_DEFAULT_VHOST=vhost`：设置RabbitMQ默认的虚拟机名

#### 4.5.3 设置 RabbitMQ 开机自启

```shell
docker update --restart=always rabbitmq-3.7.7
```
