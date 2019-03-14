
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<p align='center'>
  <img src='https://github.com/mountbuild/stone/blob/build/flash/verse.svg?raw=true' height='312'/>
</p>

<h3 align='center'>stone</h3>
<p align='center'>
  XO Compiler and IDE
</p>

<p align='center'>
  <a href='#summary'>Summary</a> •
  <a href='#contribute'>Contribute</a> •
  <a href='#getting-started'>Getting Started</a> •
  <a href='#license'>License</a>
</p>

<br/>
<br/>
<br/>

### Welcome

Welcome to the `stone` compiler. You are in the right place. Here you will find the implementation of a new tree-based programming language, in the form of a compiler, debugger, and IDE. If it pique's your interest, you are more than welcome to contribute or offer your suggestions. The end goal is to make a powerful yet simplified programming environment that everyone in the world can participate in.

### Summary

Stone is a compiler for the XO programming language. Currently it compiles to JavaScript for Node.js, with plans for [runtimes](https://github.com/mountbuild/drive) for the browser in JavaScript, MacOS/iOS in Swift, Linux in Assembly, Windows in JavaScript, and Android in Kotlin. Stone provides a framework to compile XO on any modern environment. It works by building a driver for each environment which acts as a container that can host and run code. In JavaScript, it uses a low-level virtual machine to JIT compile to bytecode. On Linux, it doesn't use a virtual machine and instead runs assembly directly as machine code.

### Framework

While XO is a specification language general enough to model any type of information or computation, it needs a practical realization in order to be useful as a programming language. The `stone` tool provides this framework using a thoroughly refined set of types and records.

It begins with the idea of a class. There are two main types of classes in stone, a force and a field. A force is a function, while a field is a state type. You can think about it as the motion itself, and the steps between the motion. A force is invoked as a cause. You mount state onto the cause when it evaluates. Each cause creates a drive which gets added to a tree of drives, the call stack.

Then you have the idea of packages, called stacks. Each stack is composed of many stores. Each store is mapped to a path in a tree of paths, where the store sheet has the final set of records. Stacks are organized into organizations called houses, and houses are grouped into clouds. You reference a stack with a URL-like identifier. You can import forces and fields and other structures from stores with a fetch. Each store also gets a theme in order to handle parsing it.

Then we have the idea of memory management, type checking, and type inference. Memory is for the most part managed by the system like Rust based on borrowing logic, but otherwise you have to manually allocate free memory. You can allocate memory with the build command. In memory, the central store stores objects as blocks. Each block contains type metadata, and the state fields of the record. But in more specialized contexts records have different shape, such as for WebGL.

Anywhere in the code you can add checks, which are tests. Each test has a set of claims which must resolve to true otherwise an error occurs.

In the end, it is the goal of the stone compiler to provide standard forces and fields and other structures so that you can define an application in a declarative way with minimal coding. This will allow for mathematical optimizations.

### Example

```xo
write |hello world|
```

That is actually shorthand for the following. The following explicitly imports the `write` force, and calls it as a cause. The `write` verse just syntactic sugar.

```xo
fetch @mount/start/write
  catch force write

cause write
  mount state, |hello world|
```

You can define a full stack as well, and tell it which themes to use for which files, to aid in parsing.

```xo
stack @rabbit/tunnel
  brief |HTTP tunneling client|
  class |http|
  class |tunneling|
  mount ./mount
```

And the `./mount/verse.xo` is define like this:

```
fetch @mount/start/theme/build
  catch theme build

mount build
  match ../**/*.xo
```

Then you can build your main file.

```
force start
  cause create-http2-server
    store server
  cause watch
    mount server, share server
    catch match
      start response

      cause write-response
        mount response
        mount write, |hello world|

cause start
```

### History

The XO Language was conceived in the winter of 2015, and the compiler idea in winter of 2018. We decided that the language needs basically a full browser implemented into it, so it can have a rich debugger and text editor that connects to the cloud and help you get work done.

### Contribute

Contributions are greatly welcomed. Help us define what the ideal interface would be for a terminal-editor-debugger app. Identify the key painpoints in the customer onboarding flow, and help us map out the best solutions. See the [contributor's guide](https://github.com/mountbuild/stone/blob/build/contributing.md) for more info if you are just starting out coding.

### License

Copyright 2019 <a href='https://mount.build'>Mount</a>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

### Mount

The stone is being developed by the folks at [Mount](https://mount.build), a California-based project for helping humanity master information and computation. Mount started off in the winter of 2008 as a spark of an idea, to forming a company 10 years later in the winter of 2018, to a seed of a project just beginning its development phases. Mount funds stone's development. It is entirely bootstrapped by working full time and running [Etsy](https://etsy.com/shop/mountbuild) and [Amazon](https://www.amazon.com/s?rh=p_27%3AMount+Build) shops. Also find us on [Facebook](https://www.facebook.com/mountbuild), [Twitter](https://twitter.com/mountbuild), and [LinkedIn](https://www.linkedin.com/company/mountbuild). Check out our other GitHub projects as well!

<br/>
<br/>

<p align='center'>
  <em>From Mount you find the Stone, reaching to the Cloud.<br/>
  No where on Earth do you feel the power of Nature all around.<br/>
  With the Cloud so close, you can see, touch, and taste.<br/>
  Feeding your energy to the Stone with haste.<br/>
  Mount holds it shape, like the secret ball.</em>
</p>

<br/>
<br/>

<p align='center'>
  <a href='https://twitter.com/mountbuild'>
    <img src='https://mount.build/slate/twitter.png' height='64' />
  </a>　　　　
  <a href='https://etsy.com/shop/mountbuild'>
    <img src='https://mount.build/slate/etsy.png' height='64' />
  </a>　　　　
  <a href='https://github.com/mountbuild'>
    <img src='https://mount.build/slate/github.png' height='64' />
  </a>　　　
  <a href='https://www.amazon.com/s?rh=p_27%3AMount+Build'>
    <img src='https://mount.build/slate/amazon.png' height='64' />
  </a>　　　　　
  <a href='https://www.facebook.com/mountbuild'>
    <img src='https://mount.build/slate/facebook.png' height='64' />
  </a>
</p>

<br/>
<br/>
