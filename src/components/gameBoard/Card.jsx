import React from "react";
import TV from "../../assets/img/TV.png"
import VT from "../../assets/img/VT.png"
import hbird from "../../assets/img/hbird.png"
import name from "../../assets/img/name.png"
import seal from "../../assets/img/seal.png"
import tracks from "../../assets/img/tracks.png"
import backLogo from "../../assets/img/cards/backLogo.png"
import achilles from "../../assets/img/cards/achilles.png"
import fibula from "../../assets/img/cards/fibula.png"
import guster from "../../assets/img/cards/guster.png"
import spring from "../../assets/img/cards/spring.png"
import fascia from "../../assets/img/cards/fascia.png"
import dorsal from "../../assets/img/cards/dorsal.png"

const images = {TV: achilles,
    VT: fibula,
    hbird: guster,
    name: spring,
    seal: fascia,
    tracks: dorsal,}

const Card = ({ id, name, flipped, matched, clicked }) => {
  return (
    <div
      onClick={() => (flipped ? undefined : clicked(name, id))}
      className={
        "card" + (flipped ? " flipped" : "") + (matched ? " matched" : "")
      }
    >
      <div className="back">
        <img src={backLogo} style={{ width: '40%',  objectFit: 'cover',  }} />
      </div>
      <div className="front">
        <img alt={name} src={images[name]} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
      </div>
    </div>
  );
};

export default Card;
