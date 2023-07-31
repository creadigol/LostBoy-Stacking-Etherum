import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./UnstakeStyle.scss";
import { Row , Col } from "react-bootstrap";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
// import lost1 from "../../../assets/images/home/lost1.png";
// import lost2 from "../../../assets/images/home/lost2.png";
// import lost3 from "../../../assets/images/home/lost3.png";
// import lost4 from "../../../assets/images/home/lost4.png";
import sign from "../../../assets/images/home/home_icon.svg";
import { connect, intContract } from "../../../redux/actions/BlockchainActions";
import { ReducerStateIF } from "../../../redux/reducers";
import Web3 from 'web3';
import axios from "axios";

const Unstake = (props:any) =>{
    interface NftList {
        id: number;
        name: string;
        tokenUri: string;
    }
    const dispatch = useDispatch();
    const blockchain = useSelector((state:ReducerStateIF) => state.blockchain);
    const [nfts, setNfts] = useState<Array<NftList>>([]);
    const [stakingNft, setStakingNft] = useState([] as any);
    const [loading, setLoading] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [isCheckAll, setIsCheckAll] = useState(false);

    // const stakingNft: any[] = [];

    useEffect(() => {
        if(blockchain.LostBoyTest === null){
            dispatch(intContract());
        }else{
            if(blockchain.account != null){
                setLoading(true);
                getBalanceOfnft();
            } 
        }
    },[blockchain, props.pageRfress]);

    const getBalanceOfnft = async () => {
        const isApprovedResult = await blockchain.LostBoyTest.methods.isApprovedForAll(blockchain.account, blockchain.LostStaking._address).call();
        setIsApproved(isApprovedResult)
        
        const addressToken = await blockchain.LostBoyTest.methods.balanceOf(blockchain.account).call();

        var rewardArray:Array<NftList> = [];
        for (let i=0; i < Number(addressToken); i++) {
            const tokensId = await blockchain.LostBoyTest.methods.tokenOfOwnerByIndex(blockchain.account,i).call();
            let tokenURI = await blockchain.LostBoyTest.methods.tokenURI(Number(tokensId)).call();
            const metadata = await (await fetch(String(tokenURI))).json();
        
            rewardArray.push({
                id: Number(tokensId),
                name: metadata.name,
                tokenUri: metadata.animation_url 
            });
        }
        setNfts(rewardArray);
        setLoading(false);
    }

    const handleSelectAll = (e:any) => {
        e.preventDefault()
        setIsCheckAll(!isCheckAll);
        setStakingNft(nfts.map(li => li.id));
        if (isCheckAll) {
            setStakingNft([]);
        }
    };

    const addtoStack = async() => {
        if(stakingNft.length > 0){
            setLoading(true);

            const tokenPass = Buffer.from("admin:1234", 'utf8').toString('base64');
        
            const headers:any = {
                "Access-Control-Allow-Credentials": true,
                "Authorization":`Basic ${tokenPass}`,
                "App-Secret-Key":"Mn2fKZG4M1170jDlVn6lOFTN6OE27f6UO99n9QDV",
                "Authorization-Token":"eyJ0eXA1iOi0JKV1QiL8CJhb5GciTWvLUzI1NiJ9IiRk2YXRh8Ig",
                "Content-Type": "application/json",
            }
            // https://thingproxy.freeboard.io/fetch/
            axios.post("https://staking.lostboy.io/API/v1/getRarity",{}, {
                headers: headers
            })
            .then((response1) => {

                    axios.post("https://staking.lostboy.io/API/v1/verifyRarity", {token_id: stakingNft}, {
                        headers: headers
                    }).then((response) => {

                        let markelproof = [];

                        for (let i = 0; i < stakingNft.length; i++) {
            
                            let leaves = [];
                            const currentNum = Number(response.data.groupId[i]);
                            if(currentNum == 0){
                                leaves = response1.data.groupId[0].map((data:any) => keccak256(String(data.lst_id)));
                            }else if(currentNum == 1){
                                leaves = response1.data.groupId[1].map((data:any) => keccak256(String(data.lst_id)));
                            }else if(currentNum == 2){
                                leaves = response1.data.groupId[2].map((data:any) => keccak256(String(data.lst_id)));
                            }else if(currentNum == 3){
                                leaves = response1.data.groupId[3].map((data:any) => keccak256(String(data.lst_id)));
                            }
            
                            const tree = new MerkleTree(leaves, keccak256, { sort: true })
                            const merkleProof = tree.getHexProof(keccak256(String(stakingNft[i])))
            
                            markelproof.push([merkleProof, Number(stakingNft[i])])
                            
                            if((stakingNft.length-1) == i){
            
                                blockchain.LostStaking.methods.deposit(markelproof).send({ from: blockchain.account})
                                .on('transactionHash', function(hash:any){
                                    waitForReceipt(hash, function(response:any) {
                                        if(response.status){ 
                                            alert("Lostboys were staked successfully");
                                            setTimeout(() => {
                                                // getBalanceOfnft();
                                                props.pageRefresh();
                                            }, 500);
                                            // setLoading(false);
                                        }else{
                                            alert(response.msg);
                                            setLoading(false);
                                        }
                                    });
                                }).on('error', function(error:any, receipt:any) {
                                    alert(error.message);
                                    setLoading(false);
                                });

                            }
            
                        }

                    })
                    .catch((error) => {
                        alert(error);
                        setLoading(false);
                    })
                })
                .catch((error) => {
                    alert(error);
                    setLoading(false);
                })
        }else{
            alert("Please select unstacked Nft's");
        }
    }    

    const waitForReceipt = async (hash:any, cb:any) => {

        blockchain.web3.eth.getTransactionReceipt(hash, function (err:any, receipt :any) {
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
                    waitForReceipt(hash, cb);
              }, 1000);
            }
          });
    } 

    const onIngredientChange = (event:any) => {
        const selectedId:number = event.target.value;
        if (stakingNft.includes(Number(selectedId))) { 
            const newIds = stakingNft.filter((id:number) => Number(id) !== Number(selectedId));
            setStakingNft(newIds);
        } else {
            const newIds = [...stakingNft, Number(selectedId)];
            setStakingNft(newIds);
        }
    };

    const appreveForAll = async() => {
        setLoading(true);
        blockchain.LostBoyTest.methods.setApprovalForAll(blockchain.LostStaking._address, true).send({ from: blockchain.account})
        .on('transactionHash', function(hash:any){
            waitForReceipt(hash, function (response:any) {
                if(response.status){ 
                    alert("Approve for all set successfully");
                    setTimeout(() => { 
                        getBalanceOfnft();
                    }, 500);
                }else{
                    console.log(response.msg);
                }
                setLoading(false);
            });
        }).on('error', function(error:any, receipt:any) {
            alert(error.message);
            setLoading(false);
        });
    }    

    return(
        <>
            <div className="unstake_section" >
                <h5 className="stake_head">
                    UNSTAKED LOSTBOYS
                </h5>
                {!loading?(
                    <>
                        <div className="unstake_subsection" >
                            {(nfts.length > 0)?(
                                <Row>
                                    {nfts.map((d: any, i:any) => (
                                        <Col key={i} xl={4} md={4} sm={4} xs={4} >
                                            <div className="unstake_list" >
                                                <input type="checkbox" id={d.id} value={d.id} onChange={(e) => onIngredientChange(e)} checked={stakingNft.includes(d.id)}/>
                                                <label htmlFor={d.id} >
                                                    <video src={d.tokenUri} width="110" height="110"></video>
                                                    <span></span>
                                                    <img src={sign} alt="true" />
                                                </label>
                                                <p>{d.name}</p>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            ):(
                                <h4>No Items Found</h4>
                            )}
                        </div>
                        {(nfts.length > 0) && (
                            <>  
                                {!isApproved? (
                                    <button type="button" className="white_button" onClick={appreveForAll}> Approve for Staking</button>
                                ):(
                                    <>
                                        {(stakingNft.length>0)?(
                                            <button type="button" className="white_button" onClick={addtoStack}>STAKE</button>
                                        ):(
                                            <button type="button" className="white_button" disabled>STAKE</button>
                                        )}
                                        <button type="button" className="white_button" onClick={handleSelectAll}>
                                            {isCheckAll? "Unselect All" : "Select All"}
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </>
                ):(
                        <h2>Loading...</h2>
                )}   
            </div>
        </>
    );
}

export default Unstake;