import { PluginOption } from 'vite'
const { NodeSSH }= require('node-ssh')
require('console-color-mr')

import { makeMulti, strLog } from "./stringLog";
const ssh = new NodeSSH()
let options:TypeOptions

interface TypeOptions {
  host: string
  username: string
  password: string
  remotePath: string
  port?: number
}


export default function autoDeployPlugin(objOptions: TypeOptions) {
  let outputPath: string | undefined = ''
  options = objOptions

  return {
    name: 'vite-plugin-auto-deploy',
    apply: 'build',
    outputOptions(outputOptions) {
      outputPath = outputOptions.dir
    },
    async closeBundle() {
      console.debug(makeMulti(strLog));
      console.log("");
      console.info("  ============================ vite-plugin-auto-deploy start =============================");
      console.log("");
      console.log("                        Start connecting to server 开始连接服务器~");
      console.log("");
      if(!outputPath){return}
      // 2.连接远程服务器 SSH
      try {
        await connectServer();
        console.info("  ------------------------------       连接服务器成功       ------------------------------");
        // 3.删除文件夹原来的内容
        let remotePath = options.remotePath;
        const isRemotePathSlash = remotePath.endsWith("/");
        remotePath = isRemotePathSlash ? remotePath : remotePath + "/";
        const execCommandResult = await ssh.execCommand(
          `rm -rf ${remotePath}*`
        );
        // 3.2判断是否账号是否有权限删除和上传文件
        if (execCommandResult.code === 0) {
          // 3.3 当有权限时
          // 4.将文件夹中资源上传到服务器
          console.log("");
          console.log("                                      资源上传进行中...");
          console.log("");
          await uploadFiles(outputPath, remotePath);
        }
        if (execCommandResult.code === 1) {
          // 3.3 当没有权限时
          console.error("  自动化布署失败~");
          console.error(
            `  您的账户 ${options.username} 没有删除文件的权限，请添加权限或更换为root账户`
          );
          console.error(execCommandResult.stderr);
          console.info(
            "  ==============================  automatic-deployment end  =============================="
          );
        }
        // 5.关闭ssh连接
        ssh.dispose();
      } catch (err) {
        console.error("  服务器连接错误，请检配置参数是否正确");
        console.error("  "+err);
        console.info(
          "  ==============================  automatic-deployment end  =============================="
        );
      }
    }
  } as PluginOption
}

async function connectServer(){  
  await ssh.connect({
    host: options.host,
    username: options.username,
    password: options.password,
    port: options.port || 22,
  });
}

async function uploadFiles(localPath: string, remotePath: string) {
  const status = await ssh.putDirectory(localPath, remotePath, {
    recursive: true, //递归上传
    concurrency: 10, //并发上传
  });
  if (status) {
    console.info(
      "  ------------------------------       自动化布署成功       ------------------------------"
    );
    console.info(
      "  ==============================  automatic-deployment end  =============================="
    );
  }
}