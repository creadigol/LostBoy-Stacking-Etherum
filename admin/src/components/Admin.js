import React, { Component } from 'react'
import Web3 from 'web3'
import { MerkleTree } from "merkletreejs"
import keccak256 from "keccak256"
import "./App.css"
import Marketplace from '../abis/LostBoy.json'
import LostStaking from '../abis/LostStaking.json'
import LostToken from '../abis/LostToken.json'
import Lostgirl from '../abis/Lostgirl.json'
import Services from './Service';
import metamask from "../assets/metamask.svg";
import Nav from './Nav'


class Admin extends Component {

    async componentWillMount() { 
        // await this.loadWeb3()
        // await this.loadBlockchainData()
    }

    // async loadWeb3() {
    //       if (window.ethereum) {
    //             window.web3 = new Web3(window.ethereum)
    //             await window.ethereum.enable()
    //       } else if (window.web3) {
    //             window.web3 = new Web3(window.web3.currentProvider)
    //       } else {
    //             window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    //       }
    // }

    async etherConnect(){
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }

        if(window.web3){
            const accounts = await window.web3.eth.getAccounts()
            if(((accounts[0]).toLowerCase() == ("0xe4d35cabcbf45b7c99d917f179b98a1e6e37a52f").toLowerCase()) || ((accounts[0]).toLowerCase() == ("0x7197127c29bb8b48ee33438102bee2c2d830c73d").toLowerCase()) ){
                const networkId = await window.web3.eth.net.getId()
                if(networkId == 1){
                    let displayType = "staking"
                    if((accounts[0]).toLowerCase() == ("0x7197127c29bb8b48ee33438102bee2c2d830c73d").toLowerCase()){
                        displayType = "losttoken"
                    }
                    this.setState({ account: accounts[0], network: "ether", displayType: displayType })
                    await this.loadBlockchainData()
                }else{
                    alert("Please change network to mainnet")
                }
            }else{
                alert("Invalid Admin wallet")
            }
        }
        
    }
    
    async loadBlockchainData() {
        const web3 = window.web3
        // Load account
        const networkId = await web3.eth.net.getId()
        const networkData = Marketplace.networks[networkId]
        const lostStakingData = LostStaking.networks[networkId]
        const lostTokens = LostToken.networks[networkId]
        const lostgirlTokens = Lostgirl.networks[networkId] 
    
            if(lostStakingData) {

                const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address)
                const lostStaking = web3.eth.Contract(LostStaking.abi, lostStakingData.address)
                const lostToken = web3.eth.Contract(LostToken.abi, lostTokens.address)
                const lostgirltoken = web3.eth.Contract(Lostgirl.abi, lostgirlTokens.address)
                
                this.setState({ marketplace, lostStaking, lostToken, lostgirltoken})

                const saleStatus = await this.state.lostStaking.methods.paused().call();

                this.setState({nftcontractAddress: marketplace.address, stakingAddress:lostStakingData.address, saleStatus:saleStatus});
                this.getbalanceOfToken()
                this.setState({ loading: false})
                // if(this.state.lostStaking){
                //     await this.getBalanceOfStak()
                // }

            } else {
                window.alert('Marketplace contract not deployed to detected network.')
            }
    }
    
    getSaleStatus = async() => {
        const saleStatus = await this.state.lostStaking.methods.paused().call();
        this.setState({saleStatus:saleStatus});
    }

    constructor(props) {
        super(props);
        this.state = {
            account: '',
            alert:"",
            loading:false,
            marketplace:null,
            lostStaking:null,
            lostToken:null,
            lostgirltoken:null,
            nftcontractAddress:null,
            stakingAddress: null,
            mintingIndex:0,
            mintinggirlIndex:0,
            addStackArray:"",
            withStakArray:"",
            addressPrevDay:"",
            tokenIdPrevDay:0,
            calculateRewardArray:"",
            claimRewardsIds:"",
            displayType:"staking",
            ownNfts:[],
            stackBalance:[],
            saleStatus:true,
            balance:0
        };
        // this.getBalanceOfnft = this.getBalanceOfnft.bind(this);
        // this.mintToken = this.mintToken.bind(this);
        // this.setApprovalForAll = this.setApprovalForAll.bind(this);
        // this.addInStacking = this.addInStacking.bind(this);
        // this.setStart = this.setStart.bind(this);
        this.increaseAllowance = this.increaseAllowance.bind(this);
        // this.handleChange = this.handleChange.bind(this);
        // this.handleChangeStack = this.handleChangeStack.bind(this);
        // this.handleChangeWithdraw = this.handleChangeWithdraw.bind(this);
        // this.handlecalculateReward = this.handlecalculateReward.bind(this);
        // this.handleChangeclaimRewardsIds = this.handleChangeclaimRewardsIds.bind(this);
        // // this.handleChangeStackDays = this.handleChangeStackDays.bind(this);
        // this.setStartStaking = this.setStartStaking.bind(this);
        // this.getBalanceOfnftOwner = this.getBalanceOfnftOwner.bind(this);
        // // this.transferNfts = this.transferNfts.bind(this);
        // this.getBalanceOfStak = this.getBalanceOfStak.bind(this);
        // this.claimRewards = this.claimRewards.bind(this);
    } 

    // stakingAddress = () => {
    //     // if(!this.state.stakingAddress){
    //     //     alert("Please change network to mainnet and refresh page")
    //     //     return false
    //     // }

    //     // if((this.state.account).toLowerCase() != ("0xe4D35CABCBf45B7C99d917f179B98a1e6E37a52F").toLowerCase()){
    //     //     alert("Please Connect with Admin wallet")
    //     //     return false
    //     // }

    //     return true;
    // }

    // handleChange = (e) => {
    //     this.setState({mintingIndex: e.target.value});
    // }

    // handleChangeGirl = (e) => {
    //     this.setState({mintinggirlIndex: e.target.value});
    // }

    // handleChangeStack = (e) => {
    //     this.setState({addStackArray: e.target.value});
    // }

    // handleChangeWithdraw = (e) => {
    //     this.setState({withStakArray: e.target.value});
    // }

    // handleaddressPrevDay = (e) => {
    //     this.setState({addressPrevDay: e.target.value});
    // }
    
    // handletokenIdPrevDay = (e) => {
    //     this.setState({tokenIdPrevDay: e.target.value});
    // }


    // handlecalculateReward = (e) => {
    //     this.setState({calculateRewardArray: e.target.value});
    // }

    // handleChangeclaimRewardsIds = (e) => {
    //     this.setState({claimRewardsIds: e.target.value});
    // }

    // handleChangeStackDays = (e) => {
    //     this.setState({stackFreezDay: e.target.value});
    // }


    // getBalanceOfnft = async () => {
    //     const addressToken = await this.state.marketplace.methods.balanceOf(this.state.account).call();
    //     // console.log();

    //     var rewardArray = [];
    //     for (let i=0; i < Number(addressToken); i++) {
    //         const tokensId = await this.state.marketplace.methods.tokenOfOwnerByIndex(this.state.account,i).call();
    //         rewardArray.push(Number(tokensId));
    //     }
    //     alert("Staking Nft's Id : "+rewardArray);
    //     this.setState({ loading: false })
    // }


    // getBalanceOfnftGirl = async () => {
    //         const ownNfts = await this.state.lostgirltoken.methods.balanceOf(this.state.account).call();
    //         // this.setState({ownNfts:ownNfts});
    //         alert(Number(ownNfts));
    //         this.setState({ loading: false })
    // }


    // getBalanceOfnftOwner = async () => {
    //     if(this.stakingAddress()){
    //         const addressToken = await this.state.marketplace.methods.tokensOfOwner(this.state.address).call();
    //         alert(addressToken.toString());
    //         this.setState({ loading: false })
    //     }
    // }

    // getBalanceOfStak = async() => {
    //         const addressToken = await this.state.lostStaking.methods.depositsOf(this.state.account).call();
    //         console.log(this.state.lostStaking)
    //         console.log(addressToken)
    //         // alert("Staking Nfts : " + addressToken.toString());

    //         this.setState({ stackBalance: addressToken })

    //         this.setState({ loading: false })
    // }

    // setStart = async () => {
    //         const thisss = this;
    //         thisss.setState({ loading: true })

    //         this.state.marketplace.methods.switchMinting().send({ from: this.state.account})
    //         .on('transactionHash', function(hash){
    //             thisss.waitForReceipt(hash, function(response) {
    //                 if(response.status){
    //                     window.location.reload();
    //                 }else{
    //                     console.log(response.msg);
    //                 } 
    //                 thisss.setState({ loading: false })
    //             });
    //         }).on('error', function(error, receipt) {
    //             alert(error.message);
    //             thisss.setState({ loading: false })
    //         });
    // }

    setStartStaking = async () => {
            const thisss = this;
            thisss.setState({ loading: true })

            this.state.lostStaking.methods.unpause().send({ from: this.state.account})
            .on('transactionHash', function(hash){
                thisss.waitForReceipt(hash, function(response) {
                    if(response.status){
                        thisss.getSaleStatus()
                        alert("Staking start successfully")
                    }else{
                        console.log(response.msg);
                    } 
                    thisss.setState({ loading: false })
                });
            }).on('error', function(error, receipt) {
                alert(error.message);
                thisss.setState({ loading: false })
            });
    }

    setStopStaking = async () => {
        const thisss = this;
        thisss.setState({ loading: true })

        this.state.lostStaking.methods.pause().send({ from: this.state.account})
        .on('transactionHash', function(hash){
            thisss.waitForReceipt(hash, function(response) {
                if(response.status){
                    thisss.getSaleStatus()
                    alert("Staking pause successfully")
                }else{
                    console.log(response.msg);
                } 
                thisss.setState({ loading: false })
            });
        }).on('error', function(error, receipt) {
            alert(error.message);
            thisss.setState({ loading: false })
        });
    }

    getbalanceOfToken= async()=>{
        const web3 = window.web3
        const balanceToken = await this.state.lostToken.methods.balanceOf(this.state.account).call();
        const balance = web3.utils.fromWei(String(balanceToken));
        this.setState({balance:balance})
    }

    // setApprovalForAll = async () => {
    //         const thisss = this;
    //         thisss.setState({ loading: true })
            
    //         this.state.marketplace.methods.setApprovalForAll(this.state.stakingAddress , true).send({ from: this.state.account})
    //         .on('transactionHash', function(hash){
    //             thisss.waitForReceipt(hash, function (response) {
    //                 if(response.status){
    //                     window.location.reload();
    //                 }else{
    //                     console.log(response.msg);
    //                 }
    //                 thisss.setState({ loading: false })
    //             });
    //         }).on('error', function(error, receipt) {
    //             alert(error.message);
    //             thisss.setState({ loading: false })
    //         });
    // }

    // mintToken = async () =>{
    //         const thisss = this;
    //         thisss.setState({ loading: true })

    //         this.state.marketplace.methods.mintBoy(this.state.mintingIndex).send({ from: this.state.account})
    //         .on('transactionHash', function(hash){
    //             thisss.waitForReceipt(hash, function (response) {
    //                 if(response.status){
    //                     window.location.reload();
    //                 }else{
    //                     console.log(response.msg);
    //                 }
    //                 thisss.setState({ loading: false })
    //             });
    //         }).on('error', function(error, receipt) {
    //             alert(error.message);
    //             thisss.setState({ loading: false })
    //         });
    // }

    // mintGirlToken = async () =>{
    //         const thisss = this;
    //         thisss.setState({ loading: true })

    //         this.state.lostgirltoken.methods.claim(this.state.mintinggirlIndex).send({ from: this.state.account})
    //         .on('transactionHash', function(hash){
    //             thisss.waitForReceipt(hash, function (response) {
    //                 if(response.status){
    //                     window.location.reload();
    //                 }else{
    //                     console.log(response.msg);
    //                 }
    //                 thisss.setState({ loading: false })
    //             });
    //         }).on('error', function(error, receipt) {
    //             alert(error.message);
    //             thisss.setState({ loading: false })
    //         });
    // }


    // setupdateStackDays = async () => {
    //     const thisss = this;
    //     thisss.setState({ loading: true })

    //     const days = this.state.stackFreezDay;

    //    this.state.lostStaking.methods.setfreezingDays(days).send({ from: this.state.account})
    //     .on('transactionHash', function(hash){
    //         thisss.waitForReceipt(hash, function (response) {
    //             if(response.status){
    //                 window.location.reload();
    //             }else{
    //                 console.log(response.msg);
    //             } 
    //             thisss.setState({ loading: false })
    //         });
    //     }).on('error', function(error, receipt) {
    //         alert(error.message);
    //         thisss.setState({ loading: false })
    //     });
    // }

    updateMarkeltreeData = async () => {
            const thisss = this;
            thisss.setState({ loading: true })

            // const addtoStak = this.state.addStackArray.toString().split(',');

            const values =  await Services.post("getRarity");
            if(values.data.status){ 

                const leaves1 = values.data.groupId[0].map(data => keccak256(String(data.lst_id)));
                const leaves2 = values.data.groupId[1].map(data => keccak256(String(data.lst_id)));
                const leaves3 = values.data.groupId[2].map(data => keccak256(String(data.lst_id)));
                const leaves4 = values.data.groupId[3].map(data => keccak256(String(data.lst_id)));

                // console.log(leaves1);
                const tree1 = new MerkleTree(leaves1, keccak256, { sort: true })
                const merkleRoot1 = tree1.getHexRoot()
                // console.log(merkleRoot1);

                // console.log(leaves2);
                const tree2 = new MerkleTree(leaves2, keccak256, { sort: true })
                const merkleRoot2 = tree2.getHexRoot()
                // console.log(merkleRoot2);

                // console.log(leaves3);
                const tree3 = new MerkleTree(leaves3, keccak256, { sort: true })
                const merkleRoot3 = tree3.getHexRoot()
                // console.log(merkleRoot3);

                // console.log(leaves4);
                const tree4 = new MerkleTree(leaves4, keccak256, { sort: true })
                const merkleRoot4 = tree4.getHexRoot()
                // console.log(merkleRoot4);


                this.state.lostStaking.methods.updateMarkelTree(merkleRoot1,merkleRoot2,merkleRoot3,merkleRoot4).send({ from: this.state.account})
                    .on('transactionHash', function(hash){
                        thisss.waitForReceipt(hash, function (response) {
                            if(response.status){
                                alert("Data update successfully.")
                            }else{
                                console.log(response.msg);
                            } 
                            thisss.setState({ loading: false })
                        });
                    }).on('error', function(error, receipt) {
                        alert(error.message);
                        thisss.setState({ loading: false })
                    });

            }else{
                alert("in not Database");   
                thisss.setState({ loading: false })
            }
    }
    
    // addInStacking = async() => {
    //         const thisss = this;
    //         thisss.setState({ loading: true })

    //         const values =  await Services.post("getRarity");
    //         if(values.data.status){ 

    //             const addtoStak = this.state.addStackArray.toString().split(',');
    //             const getgroupNum =  await Services.post("verifyRarity", {token_id: addtoStak});

    //             let markelproof = [];

    //             for (let i = 0; i < addtoStak.length; i++) {

    //                 const leaves = "";
    //                 const currentNum = Number(getgroupNum.data.groupId[i]);
    //                 if(currentNum == 0){
    //                     leaves = values.data.groupId[0].map(data => keccak256(String(data.lst_id)));
    //                 }else if(currentNum == 1){
    //                     leaves = values.data.groupId[1].map(data => keccak256(String(data.lst_id)));
    //                 }else if(currentNum == 2){
    //                     leaves = values.data.groupId[2].map(data => keccak256(String(data.lst_id)));
    //                 }else if(currentNum == 3){
    //                     leaves = values.data.groupId[3].map(data => keccak256(String(data.lst_id)));
    //                 }

    //                 const tree = new MerkleTree(leaves, keccak256, { sort: true })
    //                 const merkleProof = tree.getHexProof(keccak256(String(addtoStak[i])))

    //                 markelproof.push([merkleProof, Number(addtoStak[i])])
                    


    //                 if((addtoStak.length-1) == i){

    //                     // console.log("markelproof");
    //                     // console.log(markelproof);

    //                     this.state.lostStaking.methods.deposit(markelproof).send({ from: this.state.account})
    //                     .on('transactionHash', function(hash){
    //                         thisss.waitForReceipt(hash, function (response) {
    //                             if(response.status){
    //                                 window.location.reload();
    //                             }else{
    //                                 console.log(response.msg);
    //                             } 
    //                             thisss.setState({ loading: false })
    //                         });
    //                     }).on('error', function(error, receipt) {
    //                         alert(error.message);
    //                         thisss.setState({ loading: false })
    //                     });

    //                 }

    //             }
        


    //         // const verified = await contract.verify.call(root, leaf, proof);
        
        

    //         // const values =  await Services.post("verifyRarity", {token_id: addtoStak});
    //         // if(values.data.status){ 

    //         //         this.state.lostStaking.methods.deposit(addtoStak, values.data.groupId).send({ from: this.state.account})
    //         //         .on('transactionHash', function(hash){
    //         //             thisss.waitForReceipt(hash, function (response) {
    //         //                 if(response.status){
    //         //                     window.location.reload();
    //         //                 }else{
    //         //                     console.log(response.msg);
    //         //                 } 
    //         //                 thisss.setState({ loading: false })
    //         //             });
    //         //         }).on('error', function(error, receipt) {
    //         //             alert(error.message);
    //         //             thisss.setState({ loading: false })
    //         //         });
    //         }else{
    //             alert("in not Database");   
    //             thisss.setState({ loading: false })
    //         }
    // }

    // withdrawNFT = async() => {
    //         const thisss = this;
    //         thisss.setState({ loading: true })

    //         const withStakArray = this.state.withStakArray.toString().split(',');

    //         this.state.lostStaking.methods.withdraw(withStakArray).send({ from: this.state.account})
    //         .on('transactionHash', function(hash){
    //             thisss.waitForReceipt(hash, function (response) {
    //                 if(response.status){
    //                     window.location.reload();
    //                 }else{
    //                     console.log(response.msg);
    //                 }
    //                 thisss.setState({ loading: false })
    //             });
    //         }).on('error', function(error, receipt) {
    //             alert(error.message);
    //             thisss.setState({ loading: false })
    //         });
    // }
    
    // calculateReward = async() => {
    //         const thisss = this;
    //         thisss.setState({ loading: true })

    //         const calulateArrayss = this.state.calculateRewardArray.toString().split(',');

    //         const reward = await this.state.lostStaking.methods.calculateRewards(this.state.account, calulateArrayss).call();
    //         if(reward){ 
    //             var rewardArray = [];
    //             for (let i=0; i < reward.length; i++) {
    //                 // console.log(reward[i]);
    //                 rewardArray.push(Number(Number(reward[i])/100)/100);
    //             }
    //             alert(rewardArray);
    //         }
    //         thisss.setState({ loading: false })
    // }
    
    increaseAllowance = async() => {
            const thisss = this;
            thisss.setState({ loading: true })

            const web3 = window.web3;
            const coinAmount1 = web3.utils.toWei("100000000000", 'Ether'); 
            console.log(coinAmount1);

            this.state.lostToken.methods.increaseAllowance(this.state.stakingAddress, coinAmount1).send({ from: this.state.account})
                .on('transactionHash', function(hash){
                thisss.waitForReceipt(hash, function (response) { 
                    if(response.status){  
                        alert("Allowance increase successfully.")
                        // window.location.reload();
                    }else{
                        console.log(response.msg);
                    } 
                    thisss.setState({ loading: false })
                });
            }).on('error', function(error, receipt) {
                alert(error.message);
                thisss.setState({ loading: false })
            });
    }


    airdropToken = async (event) => {
        event.preventDefault(); 
        this.setState({ loading: true})
        const web3 = window.web3;
        const thisss = this;
        const amount = event.target.amount.value
        const address = event.target.address.value
    
        const transaferToken = web3.utils.toWei(String(amount));

        try {
        
            this.state.lostToken.methods.transfer(address, transaferToken).send({ from: this.state.account})
            .on('transactionHash', function(hash){
                thisss.waitForReceipt(hash, function (response) {
                    if(response.status){
                        thisss.getbalanceOfToken()
                        alert("Token Transfer successfully")
                    }else{
                        thisss.setState({ errorAlert: response.msg})
                    }
                    thisss.setState({ loading: false })
                });
            }).on('error', function(error, receipt) {
                alert(error.message);
                thisss.setState({ loading: false })
            });

        } catch (error) {
            console.error(error);
        }
    }

    // setOneDayPrev = async() => {
    //         const thisss = this;
    //         thisss.setState({ loading: true })

    //         this.state.lostStaking.methods.setOneDayPrev(this.state.addressPrevDay, Number(this.state.tokenIdPrevDay), 2).send({ from: this.state.account})
    //         .on('transactionHash', function(hash){
    //             thisss.waitForReceipt(hash, function (response) { 
    //                 if(response.status){ 
    //                     window.location.reload();
    //                 }else{
    //                     console.log(response.msg);
    //                 } 
    //                 thisss.setState({ loading: false })
    //             });
    //         }).on('error', function(error, receipt) {
    //             alert(error.message);
    //             thisss.setState({ loading: false })
    //         });
    // }

    // claimRewards = async() => {
    //         const thisss = this;
    //         thisss.setState({ loading: true });

    //         const reward = await this.state.lostStaking.methods.calculateRewards(this.state.account, this.state.stackBalance).call();
    //         if(reward){ 
    //             var rewardArray = [];
    //             for (let i=0; i < reward.length; i++) {
    //                 // console.log(reward[i]);
    //                 if((Number(Number(reward[i])/100)/100) > 0){
    //                     rewardArray.push(Number(this.state.stackBalance[i]));
    //                 }
    //             }
                
    //             this.state.lostStaking.methods.claimRewards(rewardArray).send({ from: this.state.account})
    //             .on('transactionHash', function(hash){
    //                 thisss.waitForReceipt(hash, function (response) { 
    //                     if(response.status){ 
    //                         window.location.reload();
    //                     }else{
    //                         console.log(response.msg);
    //                     } 
    //                     thisss.setState({ loading: false })
    //                 });
    //             }).on('error', function(error, receipt) {
    //                 alert(error.message);
    //                 thisss.setState({ loading: false })
    //             });
    //         }else{
    //             alert("something is wrong");
    //             thisss.setState({ loading: false })
    //         }
    // }

    // transferNfts = async() => {
    //         const thisss = this;
    //         thisss.setState({ loading: true }) 

    //         // const withStakArray = this.state.withStakArray.toString().split(',');

    //         this.state.lostgirltoken.methods.safeTransferFrom(this.state.account,'0x8eaD26Bd01A3ADCB01408B23456D15deFb2332f8',5).send({ from: this.state.account})
    //         .on('transactionHash', function(hash){
    //             thisss.waitForReceipt(hash, function (response) {
    //                 if(response.status){ 
    //                     window.location.reload();
    //                 }else{
    //                     console.log(response.msg);
    //                 }
    //                 thisss.setState({ loading: false })
    //             });
    //         }).on('error', function(error, receipt) {
    //             alert(error.message);
    //             thisss.setState({ loading: false })
    //         });
    // }

    async waitForReceipt(hash, cb) {
        const web3 = window.web3;
        const thiss = this;
        web3.eth.getTransactionReceipt(hash, function (err, receipt) {
            if (err) {
              console.log(err);
            }  
        
            if (receipt !== null) {
              if (cb) {
                  if(receipt.status == '0x0') {
                      cb({status:false, msg: "The contract execution was not successful, check your transaction !"});
                  } else {
                      cb({status:true, msg:"Execution worked fine!"});
                  }
              }
            } else {
              window.setTimeout(function () {
                thiss.waitForReceipt(hash, cb);
              }, 1000);
            }
          });
    }


    render() { 
        return (
            <>  
                { this.state.account ? (
                    <div style={{position:"relative"}}>

                        {this.state.loading && (
                            <div className="loaderScreen">
                                <span>Loading...</span>
                            </div>
                        )}
                            <Nav />
                        <div className="container-fluid">
                            <div className="row">
                                <main role="main" className="col-lg-12" style={{margin:"auto"}}>
                                    <div className="card p-4 mainCard">  
                                    
                                        <h2 style={{textAlign:"center"}} className="mb-5">For Admin</h2>
                                        {/* <button type="button" className="btn m-2 btn-primary" onClick={this.setStart}>
                                            Switch Lost boy status 
                                        </button> */}
                                        <div className="row">
                                            {this.state.displayType == "staking" && (
                                                <>
                                                    <div className="col-lg-6">
                                                        <div className='card' style={{textAlign:"center"}}>
                                                            <p style={{fontSize:"20px",marginBottom:"0px"}}>Sale Status : <b>{(this.state.saleStatus)?"Paused staking":"Started staking"}</b></p>
                                                            <button type="button" className="btn m-2 btn-primary inline-block" onClick={this.setStartStaking}
                                                                disabled={!this.state.saleStatus}
                                                            >
                                                                Start Staking
                                                            </button>
                                                            <button type="button" className="btn m-2 btn-danger inline-block" onClick={this.setStopStaking} disabled={this.state.saleStatus}>
                                                                Pause Staking
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {/* <div className="form-group card p-3">
                                                        <input type="text" value={this.state.addressPrevDay} placeholder="Address" name="addressPrevDay" id="addressPrevDay" className="form-control"  onChange={this.handleaddressPrevDay} />
                                                        <input type="number" value={this.state.tokenIdPrevDay} placeholder="Token Id" name="tokenIdPrevDay" id="tokenIdPrevDay" className="form-control"  onChange={this.handletokenIdPrevDay} />
                                                        <button type="button" className="btn m-2 btn-primary" onClick={this.setOneDayPrev}>
                                                            setOneDayPrev
                                                        </button>
                                                    </div> */}

                                                    {/* <div className="form-group card p-3">
                                                        <input type="text" value={this.state.stackFreezDay} placeholder="Address" name="stackFreezDay" id="stackFreezDay" className="form-control"  onChange={this.handleChangeStackDays} />
                                                        <button type="button" className="btn m-2 btn-primary" onClick={this.setupdateStackDays}>
                                                            Set Freez day for Staking
                                                        </button>
                                                    </div> */}
                                                    
                                                    {/* <button type="button" className="btn btn-primary" onClick={this.transferNfts}>
                                                            Transfer Nft
                                                        </button>
                                                    <br/> */}

                                                    <div className="col-lg-6">
                                                        <div className='card' style={{textAlign:"center"}}>
                                                            <p style={{fontSize:"20px",marginBottom:"0px"}}><b>Update Rarity data to contract</b></p>
                                                            <button type="button" className="btn m-2 btn-primary" onClick={this.updateMarkeltreeData}>
                                                                update Merkel data
                                                            </button>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                                    
                                            {this.state.displayType == "losttoken" && (
                                                <>
                                                    <div className="col-lg-6">
                                                        <div className='card' style={{textAlign:"center"}}>
                                                        <p style={{fontSize:"20px",marginBottom:"0px"}}><b>Increase Allowance</b></p>
                                                            <button type="button" className="btn m-2 btn-primary" onClick={this.increaseAllowance}>
                                                                Set Allowance for contract limit
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6">
                                                        <div className='card' style={{textAlign:"center"}}>
                                                            <p style={{fontSize:"20px",marginBottom:"0px"}}><b>Airdrop $LOST token (Balance : {this.state.balance})</b></p>
                                                            <form onSubmit={this.airdropToken}>
                                                                <div className="form-group mr-sm-2">
                                                                    <label>Token Amount:</label>
                                                                    <input id="amount" type="number" className="form-control" placeholder="10" required />
                                                                </div>

                                                                <div className="form-group mr-sm-2">
                                                                    <label>To Address:</label>
                                                                    <input id="address" type="text" className="form-control" placeholder="To transfer address" required />
                                                                </div>

                                                                <button type="submit" className="btn btn-primary">Transfer</button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                    </div>

                                    {/* <div className="card p-4">   */}
                                        {/* <h2>For Users For minting</h2>
                                        
                                        <div className="form-group card p-3">
                                            <input type="number" value={this.state.mintingIndex}  placeholder="Number Of NFT" name="mintingIndex" id="mintingIndex" className="form-control"  onChange={this.handleChange} />
                                            <button type="button" className="btn m-2 btn-primary" onClick={this.mintToken}> 
                                                Mint NFT
                                            </button>
                                        </div>
                                        
                                        
                                        <button type="button" className="btn m-2 btn-primary" onClick={this.getBalanceOfnft}>
                                            get Balance Of
                                        </button>

                                        <p className="text-center">=====================For Lost Girl===================</p>

                                        <div className="form-group card p-3">
                                            <input type="number" value={this.state.mintinggirlIndex}  placeholder="Number Of NFT" name="mintinggirlIndex" id="mintinggirlIndex" className="form-control"  onChange={this.handleChangeGirl} />
                                            <button type="button" className="btn m-2 btn-primary" onClick={this.mintGirlToken}> 
                                                Mint lost Girl NFT
                                            </button>
                                        </div>
                                        
                                        
                                        <button type="button" className="btn m-2 btn-primary" onClick={this.getBalanceOfnftGirl}>
                                            get Balance Of
                                        </button>
 */}

                                        {/* <br/>
                                        <br/> */}
                                        {/* <h2>For Users For Staking</h2>
                                        
                                        <button type="button" className="btn m-2 btn-primary" onClick={this.setApprovalForAll}>
                                            set Approval For All
                                        </button> */}

                                        {/* <div className="form-group">
                                            <div className="row">

                                                    <div className="col-sm-4">
                                                        <button type="button" className="btn btn-primary"></button>
                                                    </div>

                                            </div>
                                        </div> */}

                                        {/* <div className="form-group card p-3">
                                            <input type="text" value={this.state.addStackArray.toString()}  placeholder="1,2,3" name="handleChangeStack" id="handleChangeStack" className="form-control"  onChange={this.handleChangeStack} />
                                            <button type="button" className="btn btn-primary" onClick={this.addInStacking}> 
                                                Add in Stacking
                                            </button>
                                        </div>

                                        <button type="button" className="btn m-2 btn-primary" onClick={this.getBalanceOfStak}>
                                            get Balance Of Staking Nfts
                                        </button>


                                        <div className="form-group card p-3">
                                            <input type="text" value={this.state.claimRewardsIds.toString()} name="handleChangeclaimRewardsIds" id="handleChangeclaimRewardsIds" placeholder="1,2,3" className="form-control"  onChange={this.handleChangeclaimRewardsIds} />
                                            <button type="button" className="btn btn-primary" onClick={this.claimRewards}>
                                                Claim Rewards
                                            </button>
                                        </div>


                                        <div className="form-group card p-3">
                                            <input type="text" value={this.state.withStakArray.toString()} name="handleChangeWithdraw" id="handleChangeWithdraw" placeholder="1,2,3" className="form-control"  onChange={this.handleChangeWithdraw} />
                                            <button type="button" className="btn btn-primary" onClick={this.withdrawNFT}>
                                                withdraw
                                            </button>
                                        </div>


                                        <div className="form-group card p-3">
                                            <input type="text" value={this.state.calculateRewardArray.toString()} name="handlecalculateReward" id="handlecalculateReward" placeholder="1,2,3" className="form-control"  onChange={this.handlecalculateReward} />
                                        
                                            <button type="button" className="btn btn-primary" onClick={this.calculateReward}>
                                                Calculate Reward
                                            </button>

                                        </div>


                                    </div> */}

                                    {/*
                                    <div className="form-group">
                                        <button type="button" className="btn btn-primary" onClick={this.getBalanceOfnftOwner}>
                                        check "0xe4D35CABCBf45B7C99d917f179B98a1e6E37a52F" NFT hold
                                        </button>
                                    </div>

                                    <div className="form-group">
                                        <button type="button" className="btn btn-primary" onClick={this.getLostGirlCount}>
                                            Check Lost Girl
                                        </button>
                                    </div> */}

                                </main>
                            </div>
                        </div>
                    </div>
                ):(
                    <div className="display-table">
                        <div className='container'>
                                <a href="#" onClick={(e) => this.etherConnect()} >
                                    <img src={metamask} alt="metamask" />
                                    &nbsp; <span>Connect</span>
                                </a>
                            
                        </div>
                    </div>
                )}
            </>
        );
    }

}

export default Admin;