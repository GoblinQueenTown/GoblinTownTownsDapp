import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";




const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
 padding: 10px;
  border-radius: 120px;
  border: none;
  background-color: var(--secondary);
  padding: 12px;
  font-weight: normal;
  font-size: 30px;
  color: var(--secondary-text);
  width: 270px;                                                       
  cursor: pointer;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 255, 0.2);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;
//16-adjustment for hight of connect button
//19-adjust width of connect button
//21-shadow effects for the connect button

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 200%;
  border: solid;
  background-color: var(--primary);
  padding: 20px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 10px;
  height: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 1200px) {
    flex-direction: row;
  }
`;

//66 min alowance for screen width before changing
//67 alignment of media row colum etc

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width:300px) {
    width: 250px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;
//75 -77 logo adjustment settings

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px solid var(--accent);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 250px;
  }
  transition: width 0.5s;
`;
//86 background ring around .gif pictures
//94 adjustment of .gif size

export const StyledLink = styled.a`
  color: var(--primary);
  text-decoration: none;
`;

function App() {


 var audio= document.getElementById('audio');
 var playPauseBTN= document.getElementById('playPauseBTN');
 var count=0;

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Claim your Goblin town town.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

 

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit +((gasLimit* mintAmount)*.2));
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .ClaimGoblinTownTowns(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Congratulations, the ${CONFIG.NFT_NAME} is now all yours! go visit Opensea.io to see your new NFT!.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

function playPause(){

  if(count==0||count==null){
    count=1;
    audio.play();
   
  }
  else{
    count=0;
    audio.pause();

    audio.currentTime=0;
  }
}



  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
   <audio id="audio">
     <source src="/config/images/audio.mp3" type="audio/mpeg"></source>   
   </audio>
  
      <s.Container
        flex={1}
        ai={"center"}      //change placement of the logo (right = top left of page)    //playbutton code:   <button id="playPauseBTN"   onClick={(e) => {    e.preventDefault();playPause();}}>Play &#9658; </button>
        style={{ padding: 10, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bgfinal.png" : null}
      >
        <s.SpacerLarge />    
        <s.SpacerSmall />
        <ResponsiveWrapper flex={screenLeft} style={{ padding: 50 }} test>
       
        <s.SpacerLarge />        <s.SpacerLarge />     <s.SpacerLarge />    <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge />
          <s.SpacerLarge />    
          <s.Container
            flex={1}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              border: "2px solid var(--accent)",
              boxShadow: "0px 0px 0px 0px rgba(0,0,0,0.7)",
            }}
          >
          
      
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
              <s.Container ai={"center"} jc={"center"}>
           <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary)",
              }}
            >
              
              <StyledButton>
                       Sold Out Fuckers
                      </StyledButton>
                <s.SpacerSmall/>
           
            </s.TextDescription>

            </s.Container>
         
              </>
            ) : (
              <>
      
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                  
              
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                        playPause();
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                      
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                  
                   
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                     
                    </s.Container>
                 
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "Signing Deeds" : "Claim Town"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
          <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge />
          <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge />
          <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge />
          <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge />
          <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge />
          <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge />
       
  
          <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge />
          <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge />
          <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge />
          <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge />
          <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge />
          <s.Container flex={1} jc={"top  "} ai={"center"}>
   
                 <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary)",
              }}
            >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate("Contract", 15)}
              </StyledLink>
            
                <s.SpacerSmall/>
                 
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
          
            </s.TextDescription>

          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge /> <s.SpacerLarge />

        <s.SpacerMedium />
     
        <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/>
         <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> 
         <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/>
         <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/>
         <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/>
         <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/>
         <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/>
         <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/>
         <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/> <s.SpacerLarge/>
         <s.SpacerLarge/><s.SpacerLarge/> <s.SpacerLarge/><s.SpacerLarge/><s.SpacerLarge/><s.SpacerLarge/><s.SpacerLarge/><s.SpacerLarge/><s.SpacerLarge/><s.SpacerLarge/>
         <s.SpacerLarge/> <s.SpacerLarge/><s.SpacerLarge/> <s.SpacerLarge/>

         <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              boxShadow: "0px 5px 11px 2px rgba(0, 0, 0, 0.7)",
              border: "4px solid var(--primary)",
              backgroundColor: "var(--primary)",
            //adjusted bottom text bar 1
            }}
          >
          
            
          </s.TextDescription>
          <s.SpacerSmall />
   
        </s.Container>
    
      </s.Container>
   
    </s.Screen>
  );
}

export default App;
