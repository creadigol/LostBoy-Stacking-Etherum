import React from "react";
import { useState } from 'react';
import "./HeaderStyle.scss";
import { Navbar , Container , Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import discord from "../../../assets/images/stake/discord.png";
import instagram from "../../../assets/images/stake/instagram.png";
import twitter from "../../../assets/images/stake/twitter.png";
import discord_black from "../../../assets/images/stake/discord_black.png";
import instagram_black from "../../../assets/images/stake/instagram_black.png";
import twitter_black from "../../../assets/images/stake/twitter_black.png";
import logo_lostboy from "../../../assets/logo.png";
import { Modal } from 'antd';
import Welcome from "./Modal/Welcome/Welcome";
import { connect, intContract } from "../../../redux/actions/BlockchainActions";
import { ReducerStateIF } from "../../../redux/reducers";

const Header = () => {
    const [search, setSearch] = useState('');
    
    const dispatch = useDispatch();
    const blockchain = useSelector((state:ReducerStateIF) => state.blockchain);
    const [loding, setLoding] = useState(false);
    
    // const [navbarMain, setNavbar] = useState(false);
    // const changeBackground = () =>{
    //     if(window.scrollY >= 80){
    //         setNavbar(true)
    //     } else{
    //         setNavbar(false);
    //     }
    // };
    // window.addEventListener('scroll', changeBackground);

    // CONNECT METAMASK
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        setIsModalVisible(false);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    return(
        <>
            <div id="navbar" >
                
                    <Container className="text-center">
                        {/* <div className="logo">
                            <img src={logo_lostboy} width="69" className="header_logo"/>
                        </div> */}
                        <div className="header_btn">
                            <Nav.Link href="https://lostboy.io/">UNIVERSE</Nav.Link>
                        </div>
                        {(blockchain.account != null)?(
                            <button className="connect_button" disabled={loding}>{loding?"Loading..":(blockchain.account.slice(0,4)+"..."+blockchain.account.slice(-6))}</button>
                        ):(
                            <button className="connect_button" onClick={(e) => {
                                e.preventDefault();
                                dispatch(connect());
                            }}>Connect</button>
                        )}
                    </Container>
            </div>

            {/* CONNECT METAMASK */}
            <Modal 
                title="Basic Modal" 
                visible={isModalVisible} 
                onOk={handleOk} 
                onCancel={handleCancel}
                okText="Let's go"
                className="commonbackground welcome_lookrare"
            >
                <Welcome />
            </Modal>
        </>
    ); 
}


export default Header;