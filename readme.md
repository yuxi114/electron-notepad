# Electron构建跨平台的桌面应用系列(第二节)
## 目录
[模板和命令行界面](#glo-model-cmd-ui)
- [模板与命令行界面](#sub-model-cmd-ui)
- [electron-forge](#electron-forge)
- [electron-builder](#electron-builder)
- [electron-react-boilerplate](#electron-react-boilerplate)
- [其它工具和模板](#other-tool-model)

[应用架构](#app-architecture)
- [主进程和渲染进程](#main-and-render-process)
- [使用 Electron 的 API](#use-ele-api)
- [使用 Node.js 的API](#use-node-api)
- [使用原生 Node.js 模块](#use-node-model)

[Demo演示：NotePad](#demo-notepad)

## <span id="glo-model-cmd-ui">模板和命令行界面</span>
Electron应用的开发从来都不是死板的, 应用的开发、构建、打包、分发从来都没有“唯一解”。Electron 的编译和运行时相关额外功能通常可以在[npm](https://www.npmjs.com/search?q=electron)的独立安装包中找到, 这样开发者就可以根据自己的需求同时编译应用和 build pipeline.

得益于高度的模块化和扩展性，所有的开发团队，无论大小都可以在整个开发周期中无往不利、所向披靡。 与此同时，对于大多数开发者来说如果能有一款社区驱动的boilerplates或者命令行工具，无疑会使应用的编译、打包、分发更加简单。

### <span id="sub-model-cmd-ui">模板和命令行界面</span>
一个模板就像是一张空白的画布，你可以以它为基础来搭建你的应用。通常来说，你可以从一个代码仓库克隆一个模板，然后修改成你心仪的样子。

命令行工具则是在整个开发和分发过程中从另一方面给你提供帮助。他们更有用，但同时也对代码结构和构建项目有着硬性的要求。<em>特别是对于初学者来说，命令行工具十分有用</em>。

### <span id="electron-forge">electron-forge</span>
Electron Forge是一个用来构建现代化Electron应用的完善的工具。Electron Forge将多个现有的（且有稳定维护的）Electron构建工具整合为一个简单易用的工具包，所有人都可以用它来快速地搭建Electron开发环境。

Forge 将一些流行框架整合为[“开箱即用”](https://electronforge.io/templates)的模板，比如：React、Vue、Angular等。Forge的一些核心模块来自于上层的Electron社区（比如[electron-packager](https://github.com/electron-userland/electron-packager)），因而Electron主要维护人员（比如说Slack）提交的Electron更新也会使Forge的用户受益。

关于Forge的更多信息，请查阅[electronforge.io](https://electronforge.io/)。

### <span id="electron-builder">electron-builder</span>
Electron Builder是一个完备的Electron应用打包和分发解决方案，它致力于软件开发的集成体验。[electron-builder](https://github.com/electron-userland/electron-builder)([中文翻译版](https://blog.csdn.net/hbzyin/article/details/80095991?utm_source=blogxgwz0))出于简化的目的添加了一个依赖项，可以在内部管理所有更多的要求。

electron-builder会将Electron维护者使用的模块和功能(例如:auto-updater)替换为自定义的。Electron Builder打包的应用内组件的集成度会更高，同时与主流的Electron应用共同点也就更少了。

关于Electron Builder的更多信息，请查阅[代码仓库](https://github.com/electron-userland/electron-builder)。

### <span id="electron-react-boilerplate">electron-react-boilerplate</span>
如果你不希望任何工具，而想要简单地从一个模板开始构建，CT Lin的[electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)可能值得一看。它在社区中很受欢迎，并在内部使用了`electron-builder`。

### <span id="other-tool-model">其它工具和模板</span>
["Awesome Electron"](https://github.com/sindresorhus/awesome-electron#boilerplates)列表涵盖了众多可供选择的工具和模板。 如果您发现列表的长度令人畏惧，请不要忘记，您也可以在开发过程中逐渐添加工具。

## <span id="app-architecture">Electron应用架构</span>
在我们深入了解Electron的API之前，我们需要探讨一下在Electron中可能遇到的两种进程类型。 它们是完全不同的，因此理解它们非常重要。

### <span id="main-and-render-process">主进程和渲染器进程</span>
`Electron`中，由`package.json`中的`main.js`运行出来的进程被称为**主进程**。主进程用于创建`GUI`界面以便`web`页面的展示，一个`Electron`应用只有一个主进程。`Electron`由`Chromium`负责页面的显示，所以当创建一个页面时，就会对应的创建渲染进程。

主进程通过创建`BrowserWindow`对象来创建`web`显示页面，`BrowserWindow`运行在他自己的**渲染进程**中。当`BrowserWindow`被销毁时，对应的渲染进程也会终止。

在普通的浏览器中，web页面通常在一个[沙盒](https://www.cnblogs.com/lovesong/p/5087423.html)环境中运行，不被允许去接触原生的资源。然而Electron的用户在Node.js的API支持下可以在页面中和操作系统进行一些底层交互。

#### 主进程和渲染进程之间的区别
主进程使用`BrowserWindow`实例创建页面。每个`BrowserWindow`实例都在自己的渲染进程里运行页面。当一个`BrowserWindow`实例被销毁后，相应的渲染进程也会被终止。

主进程管理所有的web页面和它们对应的渲染进程。每个渲染进程都是独立的，它只关心它所运行的web页面。

在页面中调用与GUI相关的原生API是不被允许的，因为在web页面里操作原生的GUI资源是非常危险的，而且容易造成资源泄露。如果你想在web页面里使用GUI操作，其对应的渲染进程必须与主进程进行通讯，请求主进程进行相关的GUI操作。


>#### 题外话：进程间通讯
Electron为主进程（ main process）和渲染器进程（renderer processes）通信提供了多种实现方式，如可以使用[ipcRenderer](https://github.com/electron/i18n/blob/master/content/zh-CN/docs/api/ipc-renderer.md)和[ipcMain](https://github.com/electron/i18n/blob/master/content/zh-CN/docs/api/ipc-main.md)模块发送消息，使用[remote](https://github.com/electron/i18n/blob/master/content/zh-CN/docs/api/remote.md)模块进行RPC方式通信。这里也有一个常见问题解答：[web页面间如何共享数据](https://github.com/electron/i18n/blob/master/content/zh-CN/docs/faq.md#how-to-share-data-between-web-pages)。

### <span id="use-ele-api">使用Electron的API</span>
Electron在主进程和渲染进程中提供了大量API去帮助开发桌面应用程序， 在主进程和渲染进程中，你可以通过require的方式将其包含在模块中以此，获取Electron的API.

	const electron = require('electron');

所有Electron的API都被指派给一种进程类型。 许多API只能被用于主进程中，有些API又只能被用于渲染进程，又有一些主进程和渲染进程中都可以使用。 每一个API的文档都将说明可以在哪种进程中使用该API。

Electron中的窗口是使用BrowserWindow类型创建的一个实例， 它只能在主进程中使用。

	// 这样写在主进程会有用，但是在渲染进程中会提示'未定义'
	const { BrowserWindow } = require('electron');
	const win = new BrowserWindow();
    
因为进程之间的通信是被允许的, 所以渲染进程可以调用主进程来执行任务。Electron通过remote模块暴露一些通常只能在主进程中获取到的API。为了在渲染进程中创建一个BrowserWindow的实例，我们通常使用remote模块为中间件：

    //这样写在渲染进程中时行得通的，但是在主进程中是'未定义'
    const { remote } = require('electron');
    const { BrowserWindow } = remote;
    const win = new BrowserWindow();
    
### <span id="use-node-api">使用Node.js的API</span>
Electron同时在主进程和渲染进程中对Node.js 暴露了所有的接口。这里有两个重要的定义：

1. 所有在Node.js可以使用的API，在Electron中同样可以使用。在Electron中调用如下代码是有用的：

        const fs = require('fs');
        const root = fs.readdirSync('/');
        // 这会打印出磁盘根级别的所有文件
        // 同时包含'/'和'C:\'。
        console.log(root);
    
正如可能已经猜到的那样，如果尝试加载远程内容，这会带来重要的安全隐患。可以在[安全文档](https://github.com/electron/i18n/blob/master/content/zh-CN/docs/tutorial/security.md)中找到更多有关加载远程内容的信息和指南。

2. 你可以在你的应用程序中使用Node.js的模块。选择您最喜欢的npm模块。npm提供了目前世界上最大的开源代码库，那里包含良好的维护、经过测试的代码，提供给服务器应用程序的特色功能也提供给Electron。

例如，在你的应用程序中要使用官方的AWS SDK，你需要首先安装它的依赖：

	npm install --save aws-sdk
    
然后在你的Electron应用中，通过require引入并使用该模块，就像构建Node.js应用程序那样：

    // 准备好被使用的S3 client模块
    const S3 = require('aws-sdk/clients/s3');
    
有一个非常重要的提示:原生Node.js模块(即指，需要编译源码过后才能被使用的模块)需要在编译后才能和Electron一起使用。

绝大多数的Node.js模块都不是原生的，只有大概400~650个模块是原生的。当然了，如果你的确需要原生模块，可以在这里查询[如何重新为Electron编译原生模块](https://github.com/electron/i18n/blob/master/content/zh-CN/docs/tutorial/using-native-node-modules.md)。

## <span id="use-node-model">使用Node原生模块</span>
Electron同样也支持Node原生模块，但由于和官方的Node相比使用了不同的V8引擎，如果你想编译原生模块，则需要手动设置 Electron的headers 的位置。

### 如何安装原生模块
如下三种方法教你安装原生模块

#### 通过npm安装
只要设置一些系统环境变量，你就可以通过 npm 直接安装原生模块。

为 Electron 安装所有依赖项的一个例子:

    #Electron 的版本。  
    export npm_config_target=1.2.3
    #Electron 的系统架构, 值为 ia32 或者 x64。  
    export npm_config_arch=x64  
    export npm_config_target_arch=x64
    #下载 Electron 的 headers。  
    export npm_config_disturl=https://atom.io/download/electron
	#告诉 node-pre-gyp 我们是在为 Electron 生成模块。  
	export npm_config_runtime=electron
	#告诉 node-pre-gyp 从源代码构建模块。  
	export npm_config_build_from_source=true
	#安装所有依赖，并缓存到 ~/.electron-gyp。
	HOME=~/.electron-gyp npm install
    
#### 为Electron安装并重新编译模块
你可以也选择安装其他Node项目模块一样，然后用[electron-rebuild](https://github.com/electron/electron-rebuild)包重建Electron模块。它可以识别当前Electron版本，帮你自动完成了下载headers、编译原生模块等步骤。
一个下载`electron-rebuild`并重新编译的例子：

	npm install --save-dev electron-rebuild
	# 每次运行"npm install"时，也运行这条命令
	./node_modules/.bin/electron-rebuild
	# 在windows下如果上述命令遇到了问题，尝试这个：
	.\node_modules\.bin\electron-rebuild.cmd
    
#### 为Electron手动编译
如果你是一个原生模块的开发人员，想在Electron中进行测试，你可能要手动编译 Electron模块。 你可以使用node-gyp直接编译：

	cd /path-to-module/HOME=~/.electron-gyp node-gyp rebuild --target=1.2.3 --arch=x64 --dist-url=https://atom.io/download/electron
`HOME=~/.electron-gyp`设置去哪找开发时的headers。`--target=1.2.3`设置了 Electron的版本。`--dist-url=...`设置了Electron的headers的下载地址。`--arch=x64`设置了该模块为适配64位操作系统而编译。

#### 为Electron的自定义编译手动编译
针对与公共发行版不匹配的Electron的自定义版本编译原生Node插件，npm要使用与自定义版本对应的Node版本。

`npm rebuild --nodedir=$HOME/.../path/to/electron/vendor/node`

### 故障排查
如果你安装了一个原生模块并发现它不能工作，你需要检查 以下事项：
- 模块的对应的操作系统和 Electron 对应的操作系统是否匹配(ia32 或 x64)。
- `win_delay_load_hook` is not set to false in the module's binding.gyp.
- 如果升级了 Electron，你通常需要重新编译这些模块。
- 当有疑问时，请先执行 electron-rebuild。

#### A note about `win_delay_load_hook`
On Windows,by default,node-gyp links native modules against `node.dll`.However,in Electron 4.x and higher,the symbols needed by native modules are exported by electron.exe,and there is no node.dll in Electron 4.x.In order to load native modules on Windows, node-gyp installs a [delay-load hook](https://docs.microsoft.com/en-us/cpp/build/reference/notification-hooks?view=vs-2019) that triggers when the native module is loaded, and redirects the node.dll reference to use the loading executable instead of looking for node.dll in the library search path (which would turn up nothing).As such, on Electron 4.x and higher,`'win_delay_load_hook'`: 'true' is required to load native modules.

If you get an error like `Module did not self-register`, or `The specified procedure could not be found`, it may mean that the module you're trying to use did not correctly include the delay-load hook. If the module is built with node-gyp, ensure that the win_delay_load_hook variable is set to true in the binding.gyp file, and isn't getting overridden anywhere. If the module is built with another system, you'll need to ensure that you build with a delay-load hook installed in the main .node file. Your link.exe invocation should look like this:

     link.exe /OUT:"foo.node" "...\node.lib" delayimp.lib /DELAYLOAD:node.exe /DLL
     "my_addon.obj" "win_delay_load_hook.obj"
In particular, it's important that:
- you link against node.lib from Electron and not Node. If you link against the wrong node.lib you will get load-time errors when you require the module in Electron.
- you include the flag /DELAYLOAD:node.exe. If the node.exe link is not delayed, then the delay-load hook won't get a chance to fire and the node symbols won't be correctly resolved.
- win_delay_load_hook.obj is linked directly into the final DLL. If the hook is set up in a dependent DLL, it won't fire at the right time.

See [node-gyp](https://github.com/nodejs/node-gyp/blob/e2401e1395bef1d3c8acec268b42dc5fb71c4a38/src/win_delay_load_hook.cc) for an example delay-load hook if you're implementing your own.

### 依赖于`prebuild`的模块
[prebuild](https://github.com/prebuild/prebuild)为多个版本的Node和Electron提供了一种简单发布预编译二进制原生模块的方法。

如果为Electron提供二进制原生模块，请确保删除`--build-from-source`和`npm_config_build_from_source`环境变量来充分利用预编译的二进制文件。

### 依赖于`node-pre-gyp`的模块
[node-pre-gyp](https://github.com/mapbox/node-pre-gyp)工具提供一种部署原生Node预编译二进制模块的方法，许多流行的模块都是使用它。

通常这些模块在Electron中工作良好，但有时当Electron使用比Node新的V8版本时，会有ABI改变，可能发生错误。因此，一般来说，建议始终从源代码编译原生模块。

如果你通过`npm`的方式安装模块，默认情况下这就完成了，如果没有，你需要传入 `--build-from-source`给npm,或者设置`npm_config_build_from_source`环境变量。

## <span id="demo-notepad">Demo演示：NotePad</span>

### 功能实现

- **热加载** electron-reload。

- **文本框**：用于文本编辑。这也是这个App上的唯一的组件，它的宽和高自动平铺满整个窗口大小。当修改了文本框中的文字后，会在App标题栏上最右侧添加一个*号以表示文档尚未保存。

- **主菜单**：包括File, Edit, View, Help四个主菜单。重点是File菜单下的三个子菜单：New（新建文件）、Open（打开文件）、Save（保存文件），这三个菜单需要自定义点击事件，其它的菜单基本使用内置的方法处理。


- **右键菜单**：支持右键菜单，可以通过菜单右键执行一些基本的操作，如：复制、粘贴等。

- **打开和保存**：支持打开本地文本文件.txt, .js, .html, .md等文本文件；可以将文本内容保存为本地文本文件。在打开或新建文件前，如果当前文档尚未保存，会提示用户先保存文档。

- **退出程序**：退出窗口或程序时，会检测当前文档是否需要保存，如果尚未保存，提示用户保存。