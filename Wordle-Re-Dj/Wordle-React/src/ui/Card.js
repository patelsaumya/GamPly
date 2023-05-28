import classes from "./Card.module.css";

const Card = (props) => {
    return (
        <div className={`card shadow-xl ${classes.card}`} style={props.styleToApply}>
            {/*<div className={`card shadow-xl ${classes.card} ${props.classToAttach}`}>*/}
            {props.children}
        </div>
    );
}

export default Card;