// constants
import Web3 from "web3";
import * as LostBoy from "../../contracts/LostBoy.json";
import * as LostStaking from '../../contracts/LostStaking.json';
import * as LostToken from '../../contracts/LostToken.json';
import * as Lostgirl from '../../contracts/Lostgirl.json';
import { isMobile } from 'react-device-detect';

declare let window: any;

const NetworkId = 1;
const redirectUrl = "https://metamask.app.link/dapp/lostboy.io/"

export const intContract = () => {

  return async (dispatch:any) => {
      if(window.ethereum){
        let web3 = new Web3(window.ethereum);
        const NetworkData = await LostBoy.networks[NetworkId];
        const NetworkLostStaking = await LostStaking.networks[NetworkId];
        const LostTokenNetwork = await LostToken.networks[NetworkId];
        const LostgirlNetwork = await Lostgirl.networks[NetworkId];
        const LostBoyTestObj = new web3.eth.Contract(
            LostBoy.abi as any,
            NetworkData.address
        );
        const LostStakingObj = new web3.eth.Contract(
            LostStaking.abi as any,
            NetworkLostStaking.address
        );

        const LostTokenObj = new web3.eth.Contract(
            LostToken.abi as any,
            LostTokenNetwork.address
        );

        const LostgirlNetworkObj = new web3.eth.Contract(
            Lostgirl.abi as any,
            LostgirlNetwork.address
        )

        dispatch(
          contractSuccess({
            LostBoyTest: LostBoyTestObj,
            LostStaking: LostStakingObj,
            LostToken: LostTokenObj,
            Lostgirl: LostgirlNetworkObj
          })
        );
      }else{
        if (isMobile) {
              window.open(redirectUrl);
        }else{  
           window.alert('Please install MetaMask!');
        }
      }
    }
};


const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload:any) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const contractSuccess = (payload:any) => {
  return {
    type: "CONTRACT_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload:any) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload:any) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};



export const connect = () => {
  
  return async (dispatch:any) => {
    dispatch(connectRequest());

    if (window.ethereum) {
        
      let web3 = new Web3(window.ethereum);
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const networkId = await window.ethereum.request({
          method: "net_version",
        });
        
        // const NetworkData = await LostStaking.networks[4];
        if (networkId == NetworkId) {
          // const MoonlightObj = new web3.eth.Contract(
          //   Moonlight.abi as any,
          //   NetworkData.address
          // );
          dispatch(
            connectSuccess({
              account: accounts[0],
              // smartContract: MoonlightObj,
              web3: web3,
            })
          );
          // Add listeners start
          window.ethereum.on("accountsChanged", (accounts:any) => {
            dispatch(updateAccount(accounts[0]));
          });
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });
          // Add listeners end
        } else {
          alert("Please change network to Mainnet");
          dispatch(connectFailed("Change network to Mainnet."));
        }
      } catch (err) {
        dispatch(connectFailed("Something went wrong."));
      }
    } else {
       if (isMobile) {
        window.location.href = redirectUrl
      }else{
        dispatch(connectFailed("Install Metamask."));
      }
    }
  };
};

export const updateAccount = (account:string) => {
  return async (dispatch:any) => {
    dispatch(updateAccountRequest({ account: account }));
  };
};
