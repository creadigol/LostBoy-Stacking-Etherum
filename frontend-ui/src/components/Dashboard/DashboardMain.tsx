import HeroSection from "../Common/HeroSection/HeroSection";
import './DashboardStyle.scss';
import { Row , Col , Container } from "react-bootstrap";
import Unstake from "../Common/Unstake/Unstake";
import Stake from "../Common/Stake/Stake";
import lostboy from "../../assets/images/stake/lostboy_icon.png";
import Multiplier from "./Multiplier";
import LostReward from "./LostReward";
import { useState } from "react";

const DashboardMain = () => {

    const [pageRfress, setPageRfress] = useState(0);

    const pageRefresh = () => {
        setPageRfress(pageRfress+1);
    };

    return(
        <>
            <HeroSection />
            <div className="dashboard_main" >
                <Container>
                    <h5 className="heading" >LOSTBOYS</h5>
                    <Row>
                        {/* LOSTBOYS */}
                        <Col xl={8} lg={8} >
                            <Row>
                                <Col xl={6} >
                                    <Unstake pageRefresh={pageRefresh} pageRfress={pageRfress} />
                                </Col>
                                <Col xl={6} >
                                    <Stake pageRefresh={pageRefresh} pageRfress={pageRfress} />
                                </Col>
                            </Row>
                            <div className="lostgirls_main" >
                                <h5 className="heading" >LOSTGIRLS</h5>
                                <Row>
                                    <Col xl={6} >
                                        <Multiplier />
                                    </Col>
                                    <Col xl={12} >
                                        <LostReward />
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        {/* LOSTGIRLS */}
                        <Col xl={4} lg={4} >
                            <div className="lostboy_icon" >
                                <img src={lostboy} alt="lostboy" />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default DashboardMain;