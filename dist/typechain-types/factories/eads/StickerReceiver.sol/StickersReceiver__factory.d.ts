import { Signer, ContractFactory, BigNumberish, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type { StickersReceiver, StickersReceiverInterface } from "../../../eads/StickerReceiver.sol/StickersReceiver";
type StickersReceiverConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class StickersReceiver__factory extends ContractFactory {
    constructor(...args: StickersReceiverConstructorParams);
    deploy(oracleDestination: PromiseOrValue<string>, erc721: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, tokenName: PromiseOrValue<string>, tokenSymbol: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<StickersReceiver>;
    getDeployTransaction(oracleDestination: PromiseOrValue<string>, erc721: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, tokenName: PromiseOrValue<string>, tokenSymbol: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): StickersReceiver;
    connect(signer: Signer): StickersReceiver__factory;
    static readonly bytecode = "0x60806040523480156200001157600080fd5b506040516200260338038062002603833981016040819052620000349162000262565b8151829082906200004d906005906020850190620000d2565b50805162000063906006906020840190620000d2565b505060078054336001600160a01b031991821681179092556000918252600a60205260408220805460ff191660011790556008829055600991909155600b805482166001600160a01b03988916179055600c8054909116959096169490941790945550600d5550620003399050565b828054620000e090620002fc565b90600052602060002090601f0160209004810192826200010457600085556200014f565b82601f106200011f57805160ff19168380011785556200014f565b828001600101855582156200014f579182015b828111156200014f57825182559160200191906001019062000132565b506200015d92915062000161565b5090565b5b808211156200015d576000815560010162000162565b80516001600160a01b03811681146200019057600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b600082601f830112620001bd57600080fd5b81516001600160401b0380821115620001da57620001da62000195565b604051601f8301601f19908116603f0116810190828211818310171562000205576200020562000195565b816040528381526020925086838588010111156200022257600080fd5b600091505b8382101562000246578582018301518183018401529082019062000227565b83821115620002585760008385830101525b9695505050505050565b600080600080600060a086880312156200027b57600080fd5b620002868662000178565b9450620002966020870162000178565b6040870151606088015191955093506001600160401b0380821115620002bb57600080fd5b620002c989838a01620001ab565b93506080880151915080821115620002e057600080fd5b50620002ef88828901620001ab565b9150509295509295909350565b600181811c908216806200031157607f821691505b602082108114156200033357634e487b7160e01b600052602260045260246000fd5b50919050565b6122ba80620003496000396000f3fe6080604052600436106101a45760003560e01c8063780fae66116100e8578063780fae661461040157806384d4db06146104165780638f965d8014610429578063948509ea1461046057806395d89b4114610480578063a22cb46514610495578063b88d4fde146104b5578063ba0bba40146104d5578063c87b56dd146104ea578063cc2ee1961461050a578063d15d41501461051f578063d49a2a7c1461053f578063d5f394881461058f578063d8b964e6146105af578063e985e9c5146105df578063f2fde38b146105ff578063fe684c0e1461061f578063feb6ce691461063f57600080fd5b806301ffc9a7146101a957806306fdde03146101de578063081812fc14610200578063095ea7b31461022d57806310a8c7a91461024f57806317d70f7c1461026f57806323b872dd1461029357806323d882d3146102b357806331ed86d2146102d357806342842e0e146102f3578063430c2081146103135780634f558e79146103335780635a6bd716146103535780636352211e146103735780636884d0a61461039357806370a08231146103a957806375467b26146103df575b600080fd5b3480156101b557600080fd5b506101c96101c4366004611a9a565b61066c565b60405190151581526020015b60405180910390f35b3480156101ea57600080fd5b506101f36106be565b6040516101d59190611b0b565b34801561020c57600080fd5b5061022061021b366004611b1e565b610750565b6040516101d59190611b37565b34801561023957600080fd5b5061024d610248366004611b60565b61076b565b005b34801561025b57600080fd5b5061024d61026a366004611bd2565b6108c0565b34801561027b57600080fd5b50610285600d5481565b6040519081526020016101d5565b34801561029f57600080fd5b5061024d6102ae366004611c83565b61096d565b3480156102bf57600080fd5b5061024d6102ce366004611d1b565b610add565b3480156102df57600080fd5b5061024d6102ee366004611bd2565b610b1a565b3480156102ff57600080fd5b5061024d61030e366004611c83565b610bc3565b34801561031f57600080fd5b506101c961032e366004611b60565b610be3565b34801561033f57600080fd5b506101c961034e366004611b1e565b610c42565b34801561035f57600080fd5b50600b54610220906001600160a01b031681565b34801561037f57600080fd5b5061022061038e366004611b1e565b610c5f565b34801561039f57600080fd5b5061028560095481565b3480156103b557600080fd5b506102856103c4366004611d63565b6001600160a01b031660009081526004602052604090205490565b3480156103eb57600080fd5b506103f4610cc4565b6040516101d59190611d80565b34801561040d57600080fd5b50600f54610285565b61024d610424366004611df2565b610df2565b34801561043557600080fd5b50610449610444366004611b1e565b6110c5565b6040516101d59b9a99989796959493929190611e54565b34801561046c57600080fd5b50600c54610220906001600160a01b031681565b34801561048c57600080fd5b506101f36111bb565b3480156104a157600080fd5b5061024d6104b0366004611ec9565b6111ca565b3480156104c157600080fd5b5061024d6104d0366004611f02565b611237565b3480156104e157600080fd5b5061024d611249565b3480156104f657600080fd5b506101f3610505366004611b1e565b6113b7565b34801561051657600080fd5b506101f3611459565b34801561052b57600080fd5b506101c961053a366004611d63565b611468565b34801561054b57600080fd5b50600754600d5460408051808201825260038152626e657760e81b602082015290516101d59330936001600160a01b039091169290916335268a9f60e21b90611f55565b34801561059b57600080fd5b50600754610220906001600160a01b031681565b3480156105bb57600080fd5b506101c96105ca366004611d63565b600a6020526000908152604090205460ff1681565b3480156105eb57600080fd5b506101c96105fa366004611fa3565b6114a1565b34801561060b57600080fd5b5061024d61061a366004611d63565b6114cf565b34801561062b57600080fd5b5061024d61063a366004611ec9565b611575565b34801561064b57600080fd5b5061065f61065a366004611b1e565b611692565b6040516101d59190611fd1565b60006001600160e01b031982166380ac58cd60e01b148061069d57506001600160e01b03198216635b5e139f60e01b145b806106b857506301ffc9a760e01b6001600160e01b03198316145b92915050565b6060600580546106cd90612094565b80601f01602080910402602001604051908101604052809291908181526020018280546106f990612094565b80156107465780601f1061071b57610100808354040283529160200191610746565b820191906000526020600020905b81548152906001019060200180831161072957829003601f168201915b5050505050905090565b6000908152600260205260409020546001600160a01b031690565b600061077682610c5f565b9050806001600160a01b0316836001600160a01b031614156107d65760405162461bcd60e51b815260206004820152601460248201527331b0b73737ba1030b8383937bb329037bbb732b960611b60448201526064015b60405180910390fd5b336001600160a01b03821614806107f257506107f281336114a1565b6108645760405162461bcd60e51b815260206004820152603d60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206f7220617070726f76656420666f7220616c6c00000060648201526084016107cd565b60008281526002602052604080822080546001600160a01b0319166001600160a01b0387811691821790925591518593918516917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a4505050565b6007546001600160a01b031633146108ea5760405162461bcd60e51b81526004016107cd906120cf565b80516108f557600080fd5b60005b8151811015610969576001600a6000848481518110610919576109196120f5565b6020908102919091018101516001600160a01b031682528101919091526040016000908120805460ff191692151592909217909155600980549161095c83612121565b90915550506001016108f8565b5050565b6109773382610be3565b6109bb5760405162461bcd60e51b81526020600482015260156024820152743737ba1030b8383937bb32b21037b91037bbb732b960591b60448201526064016107cd565b6001600160a01b038316610a0b5760405162461bcd60e51b815260206004820152601760248201527673656e64696e6720746f206e756c6c206164647265737360481b60448201526064016107cd565b600081815260026020908152604080832080546001600160a01b03191690556001600160a01b038616835260049091528120805460019290610a4e90849061213c565b90915550506001600160a01b0382166000908152600460205260408120805460019290610a7c908490612153565b909155505060008181526020819052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b6007546001600160a01b03163314610b075760405162461bcd60e51b81526004016107cd906120cf565b80516109699060119060208401906119e8565b6007546001600160a01b03163314610b445760405162461bcd60e51b81526004016107cd906120cf565b8051610b4f57600080fd5b60005b8151811015610969576000600a6000848481518110610b7357610b736120f5565b6020908102919091018101516001600160a01b031682528101919091526040016000908120805460ff1916921515929092179091556009805491610bb68361216b565b9091555050600101610b52565b610bde83838360405180602001604052806000815250611836565b505050565b600080610bef83610c5f565b9050806001600160a01b0316846001600160a01b03161480610c165750610c1681856114a1565b80610c3a5750836001600160a01b0316610c2f84610750565b6001600160a01b0316145b949350505050565b6000908152602081905260409020546001600160a01b0316151590565b6000610c6a82610c42565b610ca85760405162461bcd60e51b815260206004820152600f60248201526e1a5b9d985b1a59081d1bdad95b9259608a1b60448201526064016107cd565b506000908152602081905260409020546001600160a01b031690565b60606000805b600f54811015610d27576000818152600e602052604090206008015462010000900460ff168015610d0c57506000818152600e602052604090206008015460ff165b15610d1f5781610d1b81612121565b9250505b600101610cca565b50806001600160401b03811115610d4057610d40611b8c565b604051908082528060200260200182016040528015610d69578160200160208202803683370190505b5091506000905060005b600f54811015610ded576000818152600e602052604090206008015462010000900460ff168015610db557506000818152600e602052604090206008015460ff165b15610de557808383610dc681612121565b945081518110610dd857610dd86120f5565b6020026020010181815250505b600101610d73565b505090565b811580610dfd575083155b610e485760405162461bcd60e51b815260206004820152601c60248201527b707073206d757374206265207a65726f20696620756e74696c69747960201b60448201526064016107cd565b60125460ff16610ebe5760405162461bcd60e51b815260206004820152603b60248201527f6465706c6f79657220686173206e6f742073657420757020746869732073746960448201527a636b65727320636f6e7472616374207375636365737366756c6c7960281b60648201526084016107cd565b600b54604051631844598360e21b81526000916001600160a01b031690636111660c90610eef903390600401611b37565b608060405180830381865afa158015610f0c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f309190612182565b9050806060015115156001151514610fbb5760405162461bcd60e51b815260206004820152604260248201527f706c65617365207265676973746572207769746820737469636b6572206f726160448201527f636c652066697273742077697468207468652063757272656e74206164647265606482015261737360f01b608482015260a4016107cd565b828061104c5750600b546001600160a01b031663a5058ff48686336040516001600160e01b031960e086901b168152600481019390935260248301919091526001600160a01b03166044820152606401602060405180830381865afa158015611028573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061104c91906121f6565b6110be5760405162461bcd60e51b815260206004820152603e60248201527f63616e6e6f74206166666f7264207468652050505320796f752068617665207360448201527f657420666f722074686174206475726174696f6e2063757272656e746c79000060648201526084016107cd565b5050505050565b600e602052600090815260409020805460018201546002830154600384018054939492936001600160a01b0390921692916110ff90612094565b80601f016020809104026020016040519081016040528092919081815260200182805461112b90612094565b80156111785780601f1061114d57610100808354040283529160200191611178565b820191906000526020600020905b81548152906001019060200180831161115b57829003601f168201915b5050506004840154600585015460068601546007870154600890970154959660ff938416969295509093509181811691610100810482169162010000909104168b565b6060600680546106cd90612094565b3360008181526003602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3191015b60405180910390a35050565b61124384848484611836565b50505050565b6007546001600160a01b031633146112735760405162461bcd60e51b81526004016107cd906120cf565b60125460ff16156112bb5760405162461bcd60e51b8152602060048201526012602482015271068617320616c7265616479207365742075760741b60448201526064016107cd565b600b54600d546040516312187ff160e21b81526001600160a01b0390921691634861ffc4916112ee913090600401612213565b602060405180830381865afa15801561130b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061132f91906121f6565b15611343576012805460ff19166001179055565b600b54600d54604051634564a42560e01b81526001600160a01b0390921691634564a42591611376913090600401612213565b600060405180830381600087803b15801561139057600080fd5b505af11580156113a4573d6000803e3d6000fd5b50506012805460ff191660011790555050565b60008181526001602052604090208054606091906113d490612094565b80601f016020809104026020016040519081016040528092919081815260200182805461140090612094565b801561144d5780601f106114225761010080835404028352916020019161144d565b820191906000526020600020905b81548152906001019060200180831161143057829003601f168201915b50505050509050919050565b6060601180546106cd90612094565b6007546000906001600160a01b03838116911614806106b85750506001600160a01b03166000908152600a602052604090205460ff1690565b6001600160a01b03918216600090815260036020908152604080832093909416825291909152205460ff1690565b6007546001600160a01b031633146114f95760405162461bcd60e51b81526004016107cd906120cf565b600780546001600160a01b039081166000908152600a6020526040808220805460ff1990811690915584546001600160a01b03191693861693841790945582825280822080549094166001179093559151909133917f93091b3f3cd424efabc74e181f3799f3476ed758412561ed3b29515c51f567529190a350565b6007546001600160a01b0316331461159f5760405162461bcd60e51b81526004016107cd906120cf565b6007546001600160a01b03838116911614156115f65760405162461bcd60e51b815260206004820152601660248201527531b0b73737ba1036b7b234b33c903232b83637bcb2b960511b60448201526064016107cd565b6001600160a01b0382166000908152600a60205260409020805460ff1916821580159190911790915561163d576009805490600061163383612121565b9190505550611653565b6009805490600061164d8361216b565b91905055505b60405181151581526001600160a01b0383169033907ff38de818d000d07d091732dd783c6855722d7bc1934d92b7635133289d3416959060200161122b565b6040805161016080820183526000808352602080840182905283850182905260608085018190526080850183905260a0850183905260c0850183905260e08501839052610100850183905261012085018390526101408501839052868352600e825291859020855193840186528054845260018101549184019190915260028101546001600160a01b031694830194909452600384018054939492939184019161173b90612094565b80601f016020809104026020016040519081016040528092919081815260200182805461176790612094565b80156117b45780601f10611789576101008083540402835291602001916117b4565b820191906000526020600020905b81548152906001019060200180831161179757829003601f168201915b5050509183525050600482015460ff90811615156020830152600583015460408301526006830154606083015260078301546080830152600890920154808316151560a083015261010081048316151560c0830152620100009004909116151560e090910152610140810151909150151560011461183157600080fd5b919050565b61184184848461096d565b61184e33858585856118a6565b6112435760405162461bcd60e51b815260206004820152602360248201527f45524337323120526563656976657220436f6e6669726d6174696f6e2049732060448201526210985960ea1b60648201526084016107cd565b6000833b6118b6575060016119df565b604051630a85bd0160e11b81526001600160a01b0385169063150b7a02906118e890899089908890889060040161222a565b6020604051808303816000875af1925050508015611923575060408051601f3d908101601f1916820190925261192091810190612267565b60015b6119c9573d808015611951576040519150601f19603f3d011682016040523d82523d6000602084013e611956565b606091505b5080516119c15760405162461bcd60e51b815260206004820152603360248201527f5468697320636f6e747261637420646f6573206e6f7420696d706c656d656e746044820152721030b71024a2a9219b9918a932b1b2b4bb32b960691b60648201526084016107cd565b805181602001fd5b6001600160e01b031916630a85bd0160e11b1490505b95945050505050565b8280546119f490612094565b90600052602060002090601f016020900481019282611a165760008555611a5c565b82601f10611a2f57805160ff1916838001178555611a5c565b82800160010185558215611a5c579182015b82811115611a5c578251825591602001919060010190611a41565b50611a68929150611a6c565b5090565b5b80821115611a685760008155600101611a6d565b6001600160e01b031981168114611a9757600080fd5b50565b600060208284031215611aac57600080fd5b8135611ab781611a81565b9392505050565b6000815180845260005b81811015611ae457602081850181015186830182015201611ac8565b81811115611af6576000602083870101525b50601f01601f19169290920160200192915050565b602081526000611ab76020830184611abe565b600060208284031215611b3057600080fd5b5035919050565b6001600160a01b0391909116815260200190565b6001600160a01b0381168114611a9757600080fd5b60008060408385031215611b7357600080fd5b8235611b7e81611b4b565b946020939093013593505050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b0381118282101715611bca57611bca611b8c565b604052919050565b60006020808385031215611be557600080fd5b82356001600160401b0380821115611bfc57600080fd5b818501915085601f830112611c1057600080fd5b813581811115611c2257611c22611b8c565b8060051b9150611c33848301611ba2565b8181529183018401918481019088841115611c4d57600080fd5b938501935b83851015611c775784359250611c6783611b4b565b8282529385019390850190611c52565b98975050505050505050565b600080600060608486031215611c9857600080fd5b8335611ca381611b4b565b92506020840135611cb381611b4b565b929592945050506040919091013590565b60006001600160401b03831115611cdd57611cdd611b8c565b611cf0601f8401601f1916602001611ba2565b9050828152838383011115611d0457600080fd5b828260208301376000602084830101529392505050565b600060208284031215611d2d57600080fd5b81356001600160401b03811115611d4357600080fd5b8201601f81018413611d5457600080fd5b610c3a84823560208401611cc4565b600060208284031215611d7557600080fd5b8135611ab781611b4b565b6020808252825182820181905260009190848201906040850190845b81811015611db857835183529284019291840191600101611d9c565b50909695505050505050565b8015158114611a9757600080fd5b600082601f830112611de357600080fd5b611ab783833560208501611cc4565b60008060008060808587031215611e0857600080fd5b84359350602085013592506040850135611e2181611dc4565b915060608501356001600160401b03811115611e3c57600080fd5b611e4887828801611dd2565b91505092959194509250565b8b8152602081018b90526001600160a01b038a16604082015261016060608201819052600090611e868382018c611abe565b9915156080840152505060a081019690965260c086019490945260e085019290925215156101008401521515610120830152151561014090910152949350505050565b60008060408385031215611edc57600080fd5b8235611ee781611b4b565b91506020830135611ef781611dc4565b809150509250929050565b60008060008060808587031215611f1857600080fd5b8435611f2381611b4b565b93506020850135611f3381611b4b565b92506040850135915060608501356001600160401b03811115611e3c57600080fd5b6001600160a01b038681168252851660208201526040810184905260a060608201819052600090611f8890830185611abe565b905063ffffffff60e01b831660808301529695505050505050565b60008060408385031215611fb657600080fd5b8235611fc181611b4b565b91506020830135611ef781611b4b565b6020815281516020820152602082015160408201526000604083015161200260608401826001600160a01b03169052565b50606083015161016080608085015261201f610180850183611abe565b9150608085015161203460a086018215159052565b5060a085015160c085015260c085015160e085015260e085015161010081818701528087015191505061012061206d8187018315159052565b86015190506101406120828682018315159052565b90950151151593019290925250919050565b600181811c908216806120a857607f821691505b602082108114156120c957634e487b7160e01b600052602260045260246000fd5b50919050565b6020808252600c908201526b3737ba103232b83637bcb2b960a11b604082015260600190565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b60006000198214156121355761213561210b565b5060010190565b60008282101561214e5761214e61210b565b500390565b600082198211156121665761216661210b565b500190565b60008161217a5761217a61210b565b506000190190565b60006080828403121561219457600080fd5b604051608081018181106001600160401b03821117156121b6576121b6611b8c565b60405282516121c481611b4b565b80825250602083015160208201526040830151604082015260608301516121ea81611dc4565b60608201529392505050565b60006020828403121561220857600080fd5b8151611ab781611dc4565b9182526001600160a01b0316602082015260400190565b6001600160a01b038581168252841660208201526040810183905260806060820181905260009061225d90830184611abe565b9695505050505050565b60006020828403121561227957600080fd5b8151611ab781611a8156fea26469706673582212205ea6781c7880eaa057c7416ee1c2a9123b1ae7302b2c49aa1c3b36b7633af97064736f6c634300080c0033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "oracleDestination";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "erc721";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_tokenId";
            readonly type: "uint256";
        }, {
            readonly internalType: "string";
            readonly name: "tokenName";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "tokenSymbol";
            readonly type: "string";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "approved";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "Approval";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "operator";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "bool";
            readonly name: "approved";
            readonly type: "bool";
        }];
        readonly name: "ApprovalForAll";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "changee";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "bool";
            readonly name: "value";
            readonly type: "bool";
        }];
        readonly name: "PermissionChange";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "Transfer";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }];
        readonly name: "TransferedOwnership";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "approvalCount";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_tokenId";
            readonly type: "uint256";
        }];
        readonly name: "approve";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "approved";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_owner";
            readonly type: "address";
        }];
        readonly name: "balanceOf";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "deployer";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "erc721Destination";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_tokenId";
            readonly type: "uint256";
        }];
        readonly name: "exists";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getActiveStickers";
        readonly outputs: readonly [{
            readonly internalType: "uint256[]";
            readonly name: "results";
            readonly type: "uint256[]";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_tokenId";
            readonly type: "uint256";
        }];
        readonly name: "getApproved";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getIntegrity";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes4";
            readonly name: "";
            readonly type: "bytes4";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getOptions";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_stickerId";
            readonly type: "uint256";
        }];
        readonly name: "getSticker";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "uint256";
                readonly name: "stickerId";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "oracaleId";
                readonly type: "uint256";
            }, {
                readonly internalType: "address";
                readonly name: "owner";
                readonly type: "address";
            }, {
                readonly internalType: "string";
                readonly name: "stickerUri";
                readonly type: "string";
            }, {
                readonly internalType: "bool";
                readonly name: "utility";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "duration";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "pps";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "creation";
                readonly type: "uint256";
            }, {
                readonly internalType: "bool";
                readonly name: "active";
                readonly type: "bool";
            }, {
                readonly internalType: "bool";
                readonly name: "completed";
                readonly type: "bool";
            }, {
                readonly internalType: "bool";
                readonly name: "valid";
                readonly type: "bool";
            }];
            readonly internalType: "struct StickersReceiver.Sticker";
            readonly name: "sticker";
            readonly type: "tuple";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getStickerCount";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_owner";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_operator";
            readonly type: "address";
        }];
        readonly name: "isApprovedForAll";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "addr";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "isApprovedOrOwner";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "addr";
            readonly type: "address";
        }];
        readonly name: "isAuthenticated";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address[]";
            readonly name: "addrs";
            readonly type: "address[]";
        }];
        readonly name: "multiApprove";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address[]";
            readonly name: "addrs";
            readonly type: "address[]";
        }];
        readonly name: "multiRevoke";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "name";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_tokenId";
            readonly type: "uint256";
        }];
        readonly name: "ownerOf";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "pps";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "duration";
            readonly type: "uint256";
        }, {
            readonly internalType: "bool";
            readonly name: "utility";
            readonly type: "bool";
        }, {
            readonly internalType: "bytes";
            readonly name: "requestData";
            readonly type: "bytes";
        }];
        readonly name: "request";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_from";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_tokenId";
            readonly type: "uint256";
        }];
        readonly name: "safeTransferFrom";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_from";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_tokenId";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "_data";
            readonly type: "bytes";
        }];
        readonly name: "safeTransferFrom";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_operator";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "_approved";
            readonly type: "bool";
        }];
        readonly name: "setApprovalForAll";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "_options";
            readonly type: "string";
        }];
        readonly name: "setOptions";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "addr";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "value";
            readonly type: "bool";
        }];
        readonly name: "setPrivilages";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "setup";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "stickerManager";
        readonly outputs: readonly [{
            readonly internalType: "contract StickerOracle";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "stickers";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "stickerId";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "oracaleId";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly internalType: "string";
            readonly name: "stickerUri";
            readonly type: "string";
        }, {
            readonly internalType: "bool";
            readonly name: "utility";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "duration";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "pps";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "creation";
            readonly type: "uint256";
        }, {
            readonly internalType: "bool";
            readonly name: "active";
            readonly type: "bool";
        }, {
            readonly internalType: "bool";
            readonly name: "completed";
            readonly type: "bool";
        }, {
            readonly internalType: "bool";
            readonly name: "valid";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes4";
            readonly name: "interfaceId";
            readonly type: "bytes4";
        }];
        readonly name: "supportsInterface";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "symbol";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "tokenId";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_tokenId";
            readonly type: "uint256";
        }];
        readonly name: "tokenURI";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_from";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_tokenId";
            readonly type: "uint256";
        }];
        readonly name: "transferFrom";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "addr";
            readonly type: "address";
        }];
        readonly name: "transferOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): StickersReceiverInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): StickersReceiver;
}
export {};
//# sourceMappingURL=StickersReceiver__factory.d.ts.map