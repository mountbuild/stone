
# Roadmap

## Where it's headed

While XO is a specification language general enough to model any type of information or computation, it needs a practical realization in order to be useful as a programming language. The `stone` tool provides this framework using a thoroughly refined set of types and records.

It begins with the idea of a class. There are two main types of classes in stone, a force and a field. A force is a function, while a field is a state type. You can think about it as the motion itself, and the steps between the motion. A force is invoked as a cause. You mount state onto the cause when it evaluates. Each cause creates a drive which gets added to a tree of drives, the call stack.

Then you have the idea of packages, called stacks. Each stack is composed of many stores. Each store is mapped to a path in a tree of paths, where the store sheet has the final set of records. Stacks are organized into organizations called houses, and houses are grouped into clouds. You reference a stack with a URL-like identifier. You can import forces and fields and other structures from stores with a fetch. Each store also gets a theme in order to handle parsing it.

Then we have the idea of memory management, type checking, and type inference. Memory is for the most part managed by the system like Rust based on borrowing logic, but otherwise you have to manually allocate free memory. You can allocate memory with the build command. In memory, the central store stores objects as blocks. Each block contains type metadata, and the state fields of the record. But in more specialized contexts records have different shape, such as for WebGL.

Anywhere in the code you can add checks, which are tests. Each test has a set of claims which must resolve to true otherwise an error occurs.

In the end, it is the goal of the stone compiler to provide standard forces and fields and other structures so that you can define an application in a declarative way with minimal coding. This will allow for mathematical optimizations.

## Example

```xo
write |hello world|
```

That is actually shorthand for the following. The following explicitly imports the `write` force, and calls it as a cause. The `write` verse just syntactic sugar.

```xo
fetch @mountbuild/drive/write
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
fetch @mountbuild/drive/theme/build
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
