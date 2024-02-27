export default function Die(props){
    const style = {
        backgroundColor: props.isHeld ? "#59E391" : ""
    };

    return(
        <div onClick={props.holdDice} style={style} className="die-box">{props.number}</div>
    );
}