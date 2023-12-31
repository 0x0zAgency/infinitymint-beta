import hre, { ethers, artifacts } from "hardhat";
import {
	debugLog,
	getConfigFile,
	isEnvTrue,
	log,
	readSession,
	saveSession,
	warning,
} from "./helpers";
import { BaseContract } from "ethers";
import fs from "fs";
import Pipes from "./pipes";
import {
	Web3Provider,
	JsonRpcProvider,
	TransactionReceipt,
	Provider,
} from "@ethersproject/providers";
import GanacheServer from "./ganache";
import {
	ContractFactory,
	ContractReceipt,
	ContractTransaction,
} from "@ethersproject/contracts";
import { EthereumProvider } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { getLocalDeployment, create } from "./deployments";
import {
	InfinityMintConfigSettingsNetwork,
	InfinityMintDeploymentLive,
} from "./interfaces";
import { ContractType } from "hardhat/internal/hardhat-network/stack-traces/model";

//stores listeners for the providers
const ProviderListeners = {} as any;

export const getDefaultSigner = async () => {
	if (
		hre.network.name === "ganache" &&
		isEnvTrue("GANACHE_EXTERNAL") === false
	) {
		let obj = GanacheServer.getProvider().getSigner(
			getDefaultAccountIndex()
		) as any;
		obj.address = await obj.getAddress();
		return obj as SignerWithAddress;
	}

	let defaultAccount = getDefaultAccountIndex();
	let signers = await ethers.getSigners();

	if (!signers[defaultAccount])
		throw new Error(
			"bad default account for network " +
				hre.network.name +
				" index " +
				defaultAccount +
				"does not exist"
		);

	return signers[defaultAccount];
};

/**
 *
 * @param artifactName
 * @param args
 * @returns
 */
export const deploy = async (
	artifactName: string,
	signer?: SignerWithAddress,
	args?: [],
	save?: boolean,
	logDeployment?: boolean,
	usePreviousDeployment?: boolean
) => {
	signer = signer || (await getDefaultSigner());
	let artifact = await artifacts.readArtifact(artifactName);
	let fileName =
		process.cwd() +
		`/deployments/${hre.network.name}/${artifact.contractName}.json`;
	let buildInfo = await artifacts.getBuildInfo(artifactName);

	if (usePreviousDeployment && fs.existsSync(fileName)) {
		let deployment = JSON.parse(
			fs.readFileSync(fileName, {
				encoding: "utf-8",
			})
		);

		if (logDeployment)
			log(
				`🔖 using previous deployment at (${deployment.address}) for ${artifact.contractName}`
			);

		let contract = await ethers.getContractAt(
			artifact.contractName,
			deployment.address,
			signer
		);

		let session = readSession();

		if (!session.environment?.deployments[contract.address]) {
			if (!session.environment.deployments)
				session.environment.deployments = {};

			session.environment.deployments[contract.address] = {
				...artifact,
				...buildInfo,
				args: args,
				name: artifact.contractName,
				address: contract.address,
				transactionHash: contract.deployTransaction.hash,
				deployer: contract.deployTransaction.from,
				receipt: contract.deployTransaction,
			};
			debugLog(
				`saving deployment of ${artifact.contractName} to session`
			);
			saveSession(session);
		}

		return contract;
	}

	let factory = await ethers.getContractFactory(
		artifact.contractName,
		signer
	);
	let contract = await deployContract(factory, args);
	logTransaction(contract.deployTransaction);

	if (!save) return contract;

	let savedDeployment = {
		...artifact,
		...buildInfo,
		args: args,
		name: artifact.contractName,
		address: contract.address,
		transactionHash: contract.deployTransaction.hash,
		deployer: contract.deployTransaction.from,
		receipt: contract.deployTransaction,
	};

	let session = readSession();

	if (!session.environment?.deployments) session.environment.deployments = {};

	debugLog(`saving deployment to session`);
	session.environment.deployments[contract.address] = savedDeployment;
	saveSession(session);

	debugLog(`saving ${fileName}`);
	log(`⭐ deployed ${artifact.contractName} => [${contract.address}]`);

	if (
		!fs.existsSync(process.cwd() + "/deployments/" + hre.network.name + "/")
	)
		fs.mkdirSync(process.cwd() + "/deployments/" + hre.network.name + "/");

	fs.writeFileSync(fileName, JSON.stringify(savedDeployment, null, 2));
	return contract;
};

/**
 * Deploys a contract, takes an ethers factory. Does not save the deployment.
 * @param factory
 * @param args
 * @returns
 */
export const deployContract = async (factory: ContractFactory, args?: []) => {
	let contract = await factory.deploy(args);
	let tx = await contract.deployed();
	return contract;
};

/**
 * Deploys a contract via its bytecode. Does not save the deployment
 * @param abi
 * @param bytecode
 * @param args
 * @param signer
 * @returns
 */
export const deployBytecode = async (
	abi: string[],
	bytecode: string,
	args?: [],
	signer?: SignerWithAddress
) => {
	signer = signer || (await getDefaultSigner());
	let factory = await ethers.getContractFactory(abi, bytecode, signer);
	return await deployContract(factory, args);
};

export const changeNetwork = (network: string) => {
	stopNetworkPipe(ethers.provider, hre.network.name);
	hre.changeNetwork(network);
	if (network !== "ganache") startNetworkPipe(ethers.provider, network);
};

/**
 * Returns the current provider to use for web3 interaction.
 * Used to ensure that output from the ganache chain is piped correctly into the logger.
 * Since ganache is ran inside of this instance we use the EIP-1199 provider
 * and return that, if we aren't then we will assume hardhat has managed our provider for us and return what ever ethers uses, use this
 * over ethers.provider or hre.network.provider
 *
 * @returns
 */
export const getProvider = () => {
	if (
		hre.network.name === "ganache" &&
		isEnvTrue("GANACHE_EXTERNAL") === false
	)
		return GanacheServer.getProvider();

	return ethers.provider;
};

/**
 * Returns an ethers contract instance but takes an InfinityMintDeployment directly
 * @param deployment
 * @param provider
 * @returns
 */
export const getContract = (
	deployment: InfinityMintDeploymentLive,
	provider?: Provider | JsonRpcProvider
) => {
	provider = provider || getProvider();
	return new ethers.Contract(deployment.address, deployment.abi, provider);
};

/**
 * Returns an instance of a contract which is signed
 * @param artifactOrDeployment
 * @param signer
 * @returns
 */
export const getSignedContract = async (
	deployment: InfinityMintDeploymentLive,
	signer?: SignerWithAddress
): Promise<BaseContract> => {
	signer = signer || (await getDefaultSigner());
	let factory = await ethers.getContractFactory(deployment.name);
	return factory.connect(signer).attach(deployment.address);
};

export const logTransaction = async (
	execution: Promise<ContractTransaction> | ContractTransaction,
	logMessage?: string,
	printGasUsage?: boolean
) => {
	if (logMessage?.length !== 0) {
		log(`🏳️‍🌈 ${logMessage}`);
	}

	if (typeof execution === typeof Promise)
		execution = await (execution as Promise<ContractTransaction>);

	let tx = execution as ContractTransaction;
	log(`🏷️ <${tx.hash}>(chainId: ${tx.chainId})`);
	let receipt: TransactionReceipt;
	if (tx.wait) {
		receipt = await tx.wait();
	} else receipt = await getProvider().getTransactionReceipt(tx.blockHash);

	log(`{green-fg}😊 Success{/green-fg}`);

	let session = readSession();

	if (!session.environment.temporaryGasReceipts)
		session.environment.temporaryGasReceipts = [];

	let savedReceipt = {
		...receipt,
		gasUsedEther: ethers.utils.formatEther(receipt.gasUsed.toString()),
		gasUsedNumerical: parseInt(receipt.gasUsed.toString()),
	};
	session.environment.temporaryGasReceipts.push({ savedReceipt });

	if (printGasUsage)
		log(
			"{magenta-fg}⛽ gas: {/magenta-fg}" +
				savedReceipt.gasUsedEther +
				" ETH"
		);

	saveSession(session);
	return receipt;
};

/**
 * Returns an ethers contract which you can use to execute methods on a smart contraact.
 * @param contractName
 * @param network
 * @param provider
 * @returns
 */
export const get = (contractName: string, network?: string, provider?: any) => {
	provider = provider || getProvider();
	return getContract(getLocalDeployment(contractName, network), provider);
};

/**
 * Returns an InfinityMintLiveDeployment with that contract name
 * @param contractName
 * @param network
 * @returns
 */
export const getDeployment = (contractName: string, network?: string) => {
	return create(
		getLocalDeployment(contractName, network || hre.network.name)
	);
};

export const getNetworkSettings = (network: string) => {
	let config = getConfigFile();
	return (
		config?.settings?.networks[network] ||
		({} as InfinityMintConfigSettingsNetwork)
	);
};

export const getDefaultAccountIndex = () => {
	let config = getConfigFile();
	return config?.settings?.networks[hre.network.name]?.defaultAccount || 0;
};

export const registerNetworkPipes = () => {
	let networks = Object.keys(hre.config.networks);
	let config = getConfigFile();

	networks.forEach((network) => {
		let settings = config?.settings?.networks[network] || {};
		if (settings.useDefaultPipe) return;
		debugLog("registered pipe for " + network);
		Pipes.registerSimplePipe(network);
	});
};

export const getPrivateKeys = (mnemonic: any, walletLength?: number) => {
	let keys = [];
	walletLength = walletLength || 20;
	for (let i = 0; i < walletLength; i++) {
		keys.push(
			ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/` + i)
				.privateKey
		);
	}
	return keys;
};

export const stopNetworkPipe = (
	provider?: Web3Provider | JsonRpcProvider | EthereumProvider,
	network?: any
) => {
	if (!network) network = hre.network.name;
	let settings = getNetworkSettings(network);
	//register events
	try {
		Object.keys(ProviderListeners[network]).forEach((key) => {
			provider.off(key, ProviderListeners[network][key]);
		});
	} catch (error) {
		if (isEnvTrue("THROW_ALL_ERRORS")) throw error;
		warning("failed to stop pipe: " + network);
	}
	Pipes.getPipe(settings.useDefaultPipe ? "default" : network).log(
		"{red-fg}stopped pipe{/red-fg}"
	);
	delete ProviderListeners[network];
};

export const startNetworkPipe = (
	provider?: Web3Provider | JsonRpcProvider | EthereumProvider,
	network?: any
) => {
	if (!network) network = hre.network.name;
	let settings = getNetworkSettings(network);

	if (!provider) provider = ethers.provider;
	if (ProviderListeners[network]) stopNetworkPipe(provider, network);

	ProviderListeners[network] = ProviderListeners[network] || {};
	ProviderListeners[network].block = (blockNumber: any) => {
		log(
			"{green-fg}new block{/green-fg} => [" + blockNumber + "]",
			settings.useDefaultPipe ? "default" : network
		);
	};

	ProviderListeners[network].pending = (tx: any) => {
		log(
			"{yellow-fg}new transaction pending{/yellow-fg} => " +
				JSON.stringify(tx, null, 2),
			settings.useDefaultPipe ? "default" : network
		);
	};

	ProviderListeners[network].error = (tx: any) => {
		Pipes.getPipe(settings.useDefaultPipe ? "default" : network).error(
			"{red-fg}tx error{/reg-fg} => " + JSON.stringify(tx, null, 2)
		);
	};

	Pipes.getPipe(settings.useDefaultPipe ? "default" : network).log(
		"{cyan-fg}started pipe{/cyan-fg}"
	);
	Object.keys(ProviderListeners[network]).forEach((key) => {
		provider.on(key, ProviderListeners[network][key]);
	});

	debugLog("registered provider event hooks for " + network);
};
