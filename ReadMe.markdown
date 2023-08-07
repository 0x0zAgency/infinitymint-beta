# InfinityMint QuickStart Guide

InfinityMint is an awesome tool for developers, designers, and artists to make cool stuff with Web3. It helps you create unique NFT collections, art, and build an entire user community in a decentralized way. Let's get started!

## 🚀 Features

- Create unique NFTs (like Bored Apes) completely on the blockchain
- Supports all types of media and content formats
- Easy project setup and management
- Import resources and files for your project
- Works on any blockchain that supports Solidity
- A user-friendly GUI for casual users
- Supports Telnet for Web3
- Add-ons (called Gems) to expand functionality
- Built-in event system for developers

## 💻 Requirements

- Mac OSX, Windows (XP, Vista, 7, 8, 10, 11), Debian (5+), Ubuntu (14+)
- Node **16.0.0** or higher
- (Optional) Nix

## 🏗️ Boilerplates & Starterkits

Get started quickly with our ready-to-use templates:

- [Javascript Boilerplate](https://github.com/0x0zAgency/infinitymint-javascript-boilerplate)
- [Typescript Boilerplate](https://github.com/0x0zAgency/infinitymint-typescript-boilerplate)
- [React Starterkit (Typescript)](https://github.com/0x0zAgency/infinitymint-react-typescript-starterkit)
- [React Starterkit (Javascript)](https://github.com/0x0zAgency/infinitymint-react-javascript-starterkit)
- [NextJS Starterkit](https://github.com/0x0zAgency/infinitymint-nextjs-starterkit)

## 🎯 Installation

Open your terminal and type:

`npm i infinitymint`

## 🛠️ Setup

Create a new file in your project folder (the one with `package.json`) called `hardhat.config.js` or `hardhat.config.ts`, depending on if you're using JavaScript or TypeScript.

Copy the contents from the links below into your new hardhat configuration file:

- [Link to hardhat.config.ts (for TypeScript)](https://github.com/0x0zAgency/infinitymint-beta/blob/master/examples/hardhat.config.ts)
- [Link to hardhat.config.js (for JavaScript)](https://github.com/0x0zAgency/infinitymint-beta/blob/master/examples/js/hardhat.config.js)

## 🕹️ Command Line Usage

Run `npx infinitymint` in your terminal to see a list of available commands.

**Note: InfinityMint can only be run inside a folder with a `hardhat.config` file.**

Here are some examples:

`npx infinitymint compile -- --project "maskmode"`

`npx infinitymint deploy -- --project "maskmode" -- --network "ganache"`

For more commands and flags, check the full README file.

## 📚 Documentation

For more details, visit:

- [Official Documentation](https://docs.infinitymint.app)
- [TypeDoc Documentation](https://typedoc.org/)

# InfinityMint by 0x0zAgency

InfinityMint is a tool for developers, designers, and artists to take their content to the next level with Web3. It can be used as a developmental platform to produce highly-scalable and dynamic Web3 content. For designers, it can help you prototype quickly NFT collections and create a new type of randomized art through our generation engine. For artists, you can build an entire ecosystem of users who follow and engage with your content in a completely decentralized way, where you have full control over all aspects of your content.

InfinityMint comes packed with many innovations, allowing for dynamic NFTs, each with their own unique appearance, to be generated completely on chain with very little gas used. We have invented a path and asset system for building generative art on chain, and it currently powers 50+ deployments on Web3. InfinityMint tokens are backed by their own custom ERC721 implementation, which allows for a wide list of features previously thought impossible until huge updates would occur with the EVM.

All InfinityMint tokens are expandable through our smart contract linker. They can also be used as wallets and hold other NFTs inside of them. You can change the nature of the NFT post-launch and add new variations to the generation engine over time. You can also add more contracts to your ecosystem at any time, which expand InfinityMint's functionality.

InfinityMint is a toolset that combines several key technologies currently in the Web3 space, as well as introducing several of its own innovations to create a toolset that aims at speeding up Web3 development into a matter of minutes. InfinityMint aims at providing a simple user experience to produce a wide range of Web3-oriented content.

## 🗿 Features

- "Bored Apes" like generation engine, but completely on chain.
- Supports all Media/Content formats, even arbitrary data if configured correctly.
- We've invented a project file for Web3, which is the backbone of your creation. Through the project file, you can reference files on your local PC, and InfinityMint will compile these into your project.
- Import database system, which helps with files and resources projects request.
- Multiple Roots for imports, scripts, gems, and more can be defined in your config file, so InfinityMint can build its Import database from many different locations, including networked locations.
- Works on any chain that accepts solidity bytecode.
- Easy to maintain and expand through our configuration file and many other options.
- InfinityConsole GUI System designed for casual users. You can do everything we've previously mentioned through a GUI Driven "Mini-OS" we have invented.
- InfinityMint supports telnet. Yes. Telnet. You can use InfinityMint as a Web3 telnet server.
- Gem (modding) system, which is package-based, as well as also backed by GitHub. It's as easy as installing the gem through npm or cloning it. Gems can add new smart contracts, UI elements, and more. Gems can change and integrate every aspect of InfinityMint.
- Event system for developers. Events are emitted for everything that happens in InfinityMint, and you can specify Event Handlers in your project file, config file, and more. Gems can also listen to events, which makes InfinityMint very easy to develop on.

## 🗿 Requirements

- Mac OSX (any version), Windows (XP, Vista, 7, 8, 10, 11), Debian (5+), Ubuntu (14+)
- Node **16.0.0** or Higher
- (Optional) Nix

## 🗿 Boilerplates & Starterkits

Don't feel like starting from scratch ? Check out our boilerplates and starterkits and get building with InfinityMint straight away!

[Javascript Boilerplate](https://github.com/0x0zAgency/infinitymint-javascript-boilerplate)<br>
[Typescript Boilerplate](https://github.com/0x0zAgency/infinitymint-typescript-boilerplate)<br>
[React Starterkit (Typescript)](https://github.com/0x0zAgency/infinitymint-react-typescript-starterkit)<br>
[React Starterkit (Javascript)](https://github.com/0x0zAgency/infinitymint-react-javascript-starterkit)<br>
[NextJS Starterkit](https://github.com/0x0zAgency/infinitymint-nextjs-starterkit)<br>

## 🗿 Installation

`npm i infinitymint`

InfinityMint also provides a working [_Nix_](https://nixos.org) setup out of the box for development.
This is to prevent conflicts in the environment between the end developer & shipping to production.

Access to the environment is provided via a _Nix Flake._ To enter;
`nix develop`

InfinityMint works with both Javascript and Typescript and can be used in both the browser and in node.

## 🗿 Setup

You will need to create a new file in the current working directory (the one with your package.json) or the node project called `hardhat.config.js` or `hardhat.config.ts`, depending on if you are using InfinityMint in a TypeScript or Javascript environment.

Please either download the configuration file and place it in your node projects root or copy the following contents into your hardhat configuration file. If you are bringing InfinityMint into an already established hardhat project. Then simply backup the contents of your current hardhat configuration file as you will be able to place it into InfinityMint's configuration file instead.

[Link to hardhat.config.ts (for ts)](https://github.com/0x0zAgency/infinitymint-beta/blob/master/examples/hardhat.config.ts)

[Link to hardhat.config.js (for js)](https://github.com/0x0zAgency/infinitymint-beta/blob/master/examples/js/hardhat.config.js)

InfinityMint will automatically create an `infinitymint.config.ts` or `infinitymint.config.js` depending on the environment. This new project file which is created is where you configure both hardhat and InfinityMint and other things which can be installed into InfinityMint.

Please view our official documentation and [examples](https://docs.infinitymint.app/modules/examples_examples.html) for more information.

## 🗿 Command Line Usage

InfinityMint can work via npx, and any of the InfinityMint scripts (including gems) can be executed through any terminal! We suggest using the terminal `Alacritty` as this terminal has the best support for the advanced graphics features that InfinityMint supports.

Simply run `npx infinitymint` to see a list of available commands.

**Note: InfinityMint can only be run inside of a folder which has a hardhat.config**

You can do every action inside of InfinityMint through the npx command module.

**Please note that the `--` after each name you want to execute is important as it allows named variable arguments in the command line.**

`npx infinitymint compile -- --project "maskmode"`

`npx infinitymint deploy -- --project "maskmode" -- --network "ganache"`

InfinityMint uses the first argument as the script name. You can just run `npx infinitymint` to see all of the scripts available to you. Hardhat tasks can also be called through `npx infinitymint`. For example, to run a hardhat task called `compile`, you would run `npx infinitymint compile`.

## 🗿 Development

The InfinityMint team is hard at work developing InfinityMint and the surrounding ecosystem. We are currently working on extending the functionality of InfinityMint's core, adding more gems, and improving the overall developer experience.

We are always looking for more talented developers to join our team. If you are interested in helping with the development of InfinityMint or have any suggestions, please visit our [GitHub repository](https://github.com/0x0zAgency/infinitymint) or join our [Discord server](https://discord.gg/infinitymint).

## 🗿 Documentation

For more detailed information on how to use InfinityMint and its features, please visit our official documentation at [docs.infinitymint.app](https://docs.infinitymint.app).

You can also find examples and tutorials to help you get started with creating your own generative art, dynamic NFTs, and more.

## 🗿 Support

If you need assistance with InfinityMint or have any questions, please visit our [GitHub repository](https://github.com/0x0zAgency/infinitymint) and open an issue, or join our [Discord server](https://discord.gg/infinitymint) where our team and community members are more than happy to help.

## 🗿 License

InfinityMint is licensed under the [MIT License](https://github.com/0x0zAgency/infinitymint/blob/master/LICENSE).

## 🗿 Credits

InfinityMint is developed by the 0x0zAgency team. We would like to thank our contributors, partners, and community members for their support and input in creating this powerful toolset for the Web3 ecosystem.