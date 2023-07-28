
# vite-plugin-auto-deploy
<p align="center">
<img width="640" src="./src/assets/images/logo-with-shadow.png" alt="vite-plugin-auto-deploy" />
</p>
<p align="center">
<img width="730" src="./src/assets/images/auto_header.png" alt="vite-plugin-auto-deploy" />
</p>

> vite把代码打包后自动布署到服务器中
npm run build 时才会打包上传布署

## Installation 安装

```console
npm install vite-plugin-auto-deploy --save-dev
# OR
yarn add vite-plugin-auto-deploy --dev
# OR
pnpm add vite-plugin-auto-deploy --save-dev
```

## Usage 使用

This plugin will delete the files on the server for you and upload the packaged files to the server. Just add the plugin to your vite config as follows:
该插件将为您把服务器上的文件删除，并把打包后的文件上传到服务器中，只需要您将插件添加到 vite 配置中，如下所示:

**vite.config.ts**
```js
import autoDeployPlugin from 'vite-plugin-auto-deploy'

export default defineConfig({
  plugins: [
    autoDeployPlugin(Options)
  ]
})
```

## Options 配置

You can pass a hash of configuration options to vite-plugin-auto-deploy. Allowed values are as follows:
您可以将配置的选项传递给 vite-plugin-auto-deploy 插件。允许的值如下：

|Name键名|Explain说明|Type类型|Description描述|
|:--:|:--:|:--:|:----------|
|**`host`**|**ServerIP/服务器IP**|**`{string}`**|example/例: 123.123.123.124|
|**`port`**|**ServerPort/服务器端口**|**`{number}`**|default: 22|
|**`username`**|**ServerUsers/服务器用户名**|**`{string}`**|example/例: root|
|**`password`**|**ServerPassword/服务器密码**|**`{string}`**|example/例: ****|
|**`remotePath`**|**ProjectPath/项目路径**|**`{string}`**|example/例: /root/www/project_demo|

Here's an example vite config illustrating how to use these options
下面是一个示例 vite 配置，说明如何使用这些选项

**vite.config.ts**
```js
plugins: [
  autoDeployPlugin({
    host: 'your server ip',
    username: 'your server users',
    password: 'your server password',
    remotePath: 'your project path on the server '
  }),
]
```

⚠️ **Attention：**
* 1.The code in the project requires npm run build packaging to take effect, otherwise the plugin will not take effect
* 2.The project path on the server needs to be specified to the project folder, as the folder will be deleted before each upload

⚠️ **特别注意：**
* 1.项目中代码需要npm run build打包才会生效，否则插件不会生效
* 2.服务器上的项目路径要指定到项目文件夹，因为每次上传前会先删除文件夹
