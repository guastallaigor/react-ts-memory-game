import * as React from 'react';
import styled from '../styled/styled-components-main';
import { ICardInterface } from './card-interface';

const StyledImage = styled.img`
    width: 265px;
    height: 370px;
`

const CardFlip = styled.div`
    background-color: transparent;
    width: 265px;
    height: 370px;
    margin: 0 5px 2px 5px;    
    cursor: pointer;
    perspective: 1000px;
`

const CardFlipInner = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
`

const CardFlipBoth = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    background-color: transparent;
`

const CardFlipFront = styled(CardFlipBoth)`
`

const CardFlipBack = styled(CardFlipBoth)`
    transform: rotateY(180deg);
`

const Card = (props: ICardInterface) => (
    <CardFlip>
        <CardFlipInner 
            style={props.isTurned ? { transform: 'rotateY(180deg)' } : {}} 
            onClick={() => props.onTurn(props.id)}
        >
            <CardFlipFront>
                <StyledImage src={require('../back2.jpg')} alt="img-back"/>                
            </CardFlipFront>
            <CardFlipBack>
                <StyledImage src={props.imageUrl} alt="img-card"/>
            </CardFlipBack>
        </CardFlipInner>
    </CardFlip>
);

export default Card;